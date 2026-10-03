import { describe, it, expect, vi, beforeEach } from 'vitest';
import { automationService } from './automation.service';
import { automationRepository } from '../repositories/automation.repository';
import { postRepository } from '../repositories/post.repository';
import { authorRepository } from '../repositories/author.repository';
import { categoryRepository } from '../repositories/category.repository';
import { tagRepository } from '../repositories/tag.repository';
import { geminiService } from './gemini.service';
import { imageGeneratorService } from './image-generator.service';
import { ObjectId } from 'mongodb';

describe('Blog Automation Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should execute generation pipeline and create a NEW post draft', async () => {
    const mockTopicId = new ObjectId().toString();
    const mockPostId = new ObjectId().toString();
    const mockJobId = new ObjectId().toString();

    vi.spyOn(imageGeneratorService, 'generateAndUploadFeaturedImage').mockResolvedValue('http://mock-cloudinary-url.com/cover.png');

    vi.spyOn(automationRepository, 'findTopicById').mockResolvedValue({
      _id: mockTopicId,
      title: 'Interactive Walkthroughs vs Loom',
      category: 'Product News',
      keywords: ['walkthroughs', 'loom'],
      status: 'PENDING',
      priority: 1,
      source: 'MANUAL',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.spyOn(automationRepository, 'updateTopic').mockResolvedValue({
      _id: mockTopicId,
      title: 'Interactive Walkthroughs vs Loom',
      status: 'PROCESSING',
      priority: 1,
      source: 'MANUAL',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.spyOn(automationRepository, 'createJob').mockResolvedValue({
      _id: mockJobId,
      topicId: mockTopicId,
      topicTitle: 'Interactive Walkthroughs vs Loom',
      triggerType: 'MANUAL',
      status: 'PROCESSING',
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.spyOn(automationRepository, 'getSettings').mockResolvedValue({
      _id: new ObjectId().toString(),
      enabled: true,
      frequency: 'DAILY',
      runTime: '09:00',
      timezone: 'UTC',
      defaultAuthorId: 'author-123',
      defaultCategoryId: 'cat-123',
      updatedAt: new Date(),
    });

    vi.spyOn(authorRepository, 'findAll').mockResolvedValue([{ _id: 'author-123', name: 'Author', slug: 'author', createdAt: new Date(), updatedAt: new Date() }]);
    vi.spyOn(categoryRepository, 'findAll').mockResolvedValue([{ _id: 'cat-123', name: 'Category', slug: 'category', createdAt: new Date(), updatedAt: new Date() }]);
    vi.spyOn(tagRepository, 'findOrCreate').mockImplementation(async (name) => ({ _id: `tag-${name}`, name, slug: name.toLowerCase(), createdAt: new Date(), updatedAt: new Date() }));

    vi.spyOn(geminiService, 'generateArticle').mockResolvedValue({
      title: 'Interactive Walkthroughs vs Loom: The Ultimate Guide',
      slug: 'interactive-walkthroughs-vs-loom',
      excerpt: 'Comprehensive comparison for SaaS teams.',
      content: '## Introduction\n\nDetailed breakdown of walkthrough platforms.',
      seoTitle: 'Interactive Walkthroughs vs Loom | Demoly Blog',
      seoDescription: 'Learn why walkthroughs outperform static video.',
      blueprintId: 'alternatives-cluster',
      blueprintVersion: '1.0.0',
      promptVersion: '1.0.0',
      qaResult: {
        passed: true,
        errors: [],
        warnings: [],
        factReviewClaims: [],
        checks: {
          structure: true,
          faq: true,
          table: true,
          readability: true,
          pricing: true,
          demolyPositioning: true,
          competitorFairness: true,
          seo: true,
        },
      },
    });

    vi.spyOn(postRepository, 'findBySlug').mockResolvedValue(null);

    const createPostSpy = vi.spyOn(postRepository, 'create').mockResolvedValue({
      _id: mockPostId,
      title: 'Interactive Walkthroughs vs Loom: The Ultimate Guide',
      slug: 'interactive-walkthroughs-vs-loom',
      excerpt: 'Comprehensive comparison for SaaS teams.',
      content: '## Introduction\n\nDetailed breakdown of walkthrough platforms.',
      authorId: 'author-123',
      categoryId: 'cat-123',
      tagIds: [],
      status: 'DRAFT',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.spyOn(automationRepository, 'updateJob').mockImplementation(async (id, data) => ({
      _id: id,
      topicTitle: 'Interactive Walkthroughs vs Loom',
      triggerType: 'MANUAL',
      status: data.status || 'COMPLETED',
      retryCount: 0,
      maxRetries: 3,
      postId: data.postId || mockPostId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await automationService.executePipeline({
      topicId: mockTopicId,
      triggerType: 'MANUAL',
    });

    expect(result.status).toBe('COMPLETED');
    expect(result.postId).toBe(mockPostId);
    expect(createPostSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Interactive Walkthroughs vs Loom: The Ultimate Guide',
        status: 'DRAFT',
      })
    );
  }, 15000);

  it('should reject execution with CONFLICT error if topic is already in PROCESSING status', async () => {
    const mockTopicId = new ObjectId().toString();

    vi.spyOn(automationRepository, 'findTopicById').mockResolvedValue({
      _id: mockTopicId,
      title: 'Topic In Progress',
      status: 'PROCESSING',
      priority: 1,
      source: 'MANUAL',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const updatePostSpy = vi.spyOn(postRepository, 'update');

    await expect(
      automationService.executePipeline({
        topicId: mockTopicId,
        triggerType: 'MANUAL',
      })
    ).rejects.toThrow('CONFLICT: Topic "Topic In Progress" is currently being processed by another job.');

    expect(updatePostSpy).not.toHaveBeenCalled();
  });
});
