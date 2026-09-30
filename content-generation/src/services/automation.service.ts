import { geminiService } from './gemini.service';
import { automationRepository } from '../repositories/automation.repository';
import { postRepository } from '../repositories/post.repository';
import { authorRepository } from '../repositories/author.repository';
import { categoryRepository } from '../repositories/category.repository';
import { convertMarkdownToHtml } from '../utils/markdown-to-html';
import {
  BlogGenerationJob,
  BlogTopic,
  JobTriggerType,
  AutomationSettings,
} from '../types/automation';

export interface ExecutePipelineParams {
  topicId?: string;
  title?: string;
  triggerType: JobTriggerType;
  masterPromptOverride?: string;
}

export class AutomationService {
  private sanitizeContent(content: string): string {
    return convertMarkdownToHtml(content.trim());
  }

  private async generateUniqueSlug(baseSlug: string): Promise<string> {
    let candidate = baseSlug;
    let counter = 1;
    while (await postRepository.findBySlug(candidate)) {
      candidate = `${baseSlug}-${counter}`;
      counter++;
    }
    return candidate;
  }

  async executePipeline(params: ExecutePipelineParams): Promise<BlogGenerationJob> {
    const startTime = Date.now();
    let topicObj: BlogTopic | null = null;
    let targetTitle = (params.title || '').trim();
    let keywords: string[] = [];

    // 1. Resolve Topic if topicId provided
    if (params.topicId) {
      topicObj = await automationRepository.findTopicById(params.topicId);
      if (!topicObj) {
        throw new Error(`NOT_FOUND: Topic not found with ID ${params.topicId}`);
      }
      if (topicObj.status === 'PROCESSING') {
        throw new Error(`CONFLICT: Topic "${topicObj.title}" is currently being processed by another job.`);
      }
      targetTitle = topicObj.title;
      keywords = topicObj.keywords || [];
    } else if (targetTitle) {
      const existing = await automationRepository.findTopicByTitle(targetTitle);
      if (existing) {
        if (existing.status === 'PROCESSING') {
          throw new Error(`CONFLICT: Topic "${existing.title}" is currently being processed by another job.`);
        }
        topicObj = existing;
        keywords = existing.keywords || [];
      } else {
        topicObj = await automationRepository.createTopic({
          title: targetTitle,
          status: 'PROCESSING',
          priority: 1,
          source: 'MANUAL',
        });
      }
    } else {
      throw new Error('VALIDATION_ERROR: Either topicId or title must be provided.');
    }

    // 2. Mark Topic as PROCESSING
    if (topicObj && topicObj.status !== 'PROCESSING') {
      await automationRepository.updateTopic(topicObj._id, { status: 'PROCESSING' });
    }

    // 3. Create Job Ledger in PROCESSING state
    const lockToken = `lock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const job = await automationRepository.createJob({
      topicId: topicObj?._id,
      topicTitle: targetTitle,
      triggerType: params.triggerType,
      status: 'PROCESSING',
      retryCount: 0,
      maxRetries: 3,
      startedAt: new Date(),
      completedAt: null,
      lockToken,
    });

    try {
      if (job.postId) {
        console.warn(`[AutomationService] Job ${job._id} already has associated postId ${job.postId}. Skipping post creation.`);
        return job;
      }

      // 4. Get Fallback Author and Category for Post Creation
      const settings: AutomationSettings = await automationRepository.getSettings();
      let authorId: string = settings.defaultAuthorId || '';
      if (!authorId) {
        const authors = await authorRepository.findAll();
        if (authors.length > 0 && authors[0]) {
          authorId = authors[0]._id;
        } else {
          const newAuthor = await authorRepository.create({
            name: 'Demoly AI Editorial',
            slug: 'demoly-ai-editorial',
            role: 'Automated Content Engine',
          });
          authorId = newAuthor._id;
        }
      }

      let categoryId: string = settings.defaultCategoryId || '';
      if (!categoryId) {
        const categories = await categoryRepository.findAll();
        if (categories.length > 0 && categories[0]) {
          categoryId = categories[0]._id;
        } else {
          const newCategory = await categoryRepository.create({
            name: 'Product & Engineering',
            slug: 'product-and-engineering',
            description: 'Automated insights on product walkthroughs and software architecture.',
          });
          categoryId = newCategory._id;
        }
      }

      // 5. Call Gemini AI Generation Service with Blueprint
      const generated = await geminiService.generateArticle(targetTitle, keywords, 'alternatives-cluster', params.masterPromptOverride);

      // 6. QA Validation Check - Block draft creation if HARD_BLOCK errors exist
      if (generated.qaResult && !generated.qaResult.passed) {
        const errorMsg = `QA_BLOCK: Content failed editorial QA checks: ${generated.qaResult.errors.join('; ')}`;
        throw new Error(errorMsg);
      }

      // 7. Sanitize Content & Ensure Unique Slug
      const sanitizedContent = this.sanitizeContent(generated.content);
      const uniqueSlug = await this.generateUniqueSlug(generated.slug);

      // 8. Create NEW Post with status: DRAFT
      const newPost = await postRepository.create({
        title: generated.title,
        slug: uniqueSlug,
        excerpt: generated.excerpt,
        content: sanitizedContent,
        authorId,
        categoryId,
        tagIds: [],
        status: 'DRAFT',
        featuredImage: '',
        seo: {
          seoTitle: generated.seoTitle,
          seoDescription: generated.seoDescription,
          canonicalUrl: `https://demoly.dev/blog/${uniqueSlug}`,
        },
      });

      const durationMs = Date.now() - startTime;
      const completedAt = new Date();

      // 9. Update Job to COMPLETED
      const updatedJob = await automationRepository.updateJob(job._id, {
        status: 'COMPLETED',
        completedAt,
        durationMs,
        postId: newPost._id,
        blueprintId: generated.blueprintId || 'alternatives-cluster',
        blueprintVersion: generated.blueprintVersion || '1.0.0',
        promptVersion: generated.promptVersion || '1.0.0',
        qaResult: generated.qaResult,
      });

      // 10. Update Topic to GENERATED
      if (topicObj) {
        await automationRepository.updateTopic(topicObj._id, {
          status: 'GENERATED',
          postId: newPost._id,
          lastJobId: job._id,
        });
      }

      return updatedJob || job;
    } catch (err: unknown) {
      console.error('[AutomationService Pipeline Failure]', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown generation failure';
      const durationMs = Date.now() - startTime;

      const failedJob = await automationRepository.updateJob(job._id, {
        status: 'FAILED',
        completedAt: new Date(),
        durationMs,
        errorInfo: {
          code: 'GENERATION_ERROR',
          message: errorMessage,
          timestamp: new Date(),
        },
      });

      if (topicObj) {
        await automationRepository.updateTopic(topicObj._id, {
          status: 'FAILED',
          lastJobId: job._id,
        });
      }

      throw new Error(`AUTOMATION_FAILURE: ${errorMessage}`);
    }
  }

  async retryJob(jobId: string): Promise<BlogGenerationJob> {
    const job = await automationRepository.findJobById(jobId);
    if (!job) {
      throw new Error(`NOT_FOUND: Job not found with ID ${jobId}`);
    }

    if (job.status === 'COMPLETED' && job.postId) {
      throw new Error('VALIDATION_ERROR: Cannot retry an already completed job that created a draft.');
    }

    return this.executePipeline({
      topicId: job.topicId,
      title: job.topicTitle,
      triggerType: 'MANUAL',
    });
  }
}

export const automationService = new AutomationService();
