import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables immediately before modules initialize
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

import { postRepository } from '../src/repositories/post.repository';
import { authorRepository } from '../src/repositories/author.repository';
import { categoryRepository } from '../src/repositories/category.repository';
import { tagRepository } from '../src/repositories/tag.repository';
import { convertMarkdownToHtml } from '../src/utils/markdown-to-html';
import { getMongoClient } from '../src/lib/mongodb';

interface ParsedMetadata {
  title: string;
  slug: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  category?: string;
  tags?: string[];
  featuredImage?: string;
  author?: string;
  content: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseMarkdownFile(filePath: string): ParsedMetadata {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  let title = '';
  let slug = '';
  let excerpt = '';
  let seoTitle = '';
  let seoDescription = '';
  let category = '';
  let featuredImage = '';
  let author = '';
  const tags: string[] = [];
  let bodyContent = rawContent;

  // 1. Check for YAML Frontmatter
  if (rawContent.startsWith('---')) {
    const endFrontmatterIndex = rawContent.indexOf('---', 3);
    if (endFrontmatterIndex !== -1) {
      const frontmatterText = rawContent.substring(3, endFrontmatterIndex).trim();
      bodyContent = rawContent.substring(endFrontmatterIndex + 3).trim();

      const lines = frontmatterText.split('\n');
      for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;
        const key = line.substring(0, colonIndex).trim().toLowerCase();
        const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');

        if (key === 'title') title = value;
        else if (key === 'slug') slug = value;
        else if (key === 'excerpt') excerpt = value;
        else if (key === 'seotitle' || key === 'seo_title') seoTitle = value;
        else if (key === 'seodescription' || key === 'seo_description') seoDescription = value;
        else if (key === 'category') category = value;
        else if (key === 'author') author = value;
        else if (key === 'featuredimage' || key === 'feature_image' || key === 'cover_image' || key === 'image') {
          featuredImage = value;
        } else if (key === 'tags') {
          const cleanVal = value.replace(/^\[|\]$/g, '');
          const splitTags = cleanVal
            .split(',')
            .map((t) => t.trim().replace(/^["']|["']$/g, ''))
            .filter((t) => t.length > 0);
          tags.push(...splitTags);
        }
      }
    }
  }

  // 2. Fallback Title Extraction
  if (!title) {
    const lines = bodyContent.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const l = (lines[i] || '').trim();
      if (l.startsWith('# ')) {
        title = l.replace(/^#\s+/, '').trim();
        lines.splice(i, 1);
        bodyContent = lines.join('\n').trim();
        break;
      } else if (i === 0 && l && !l.startsWith('#') && !l.startsWith('---')) {
        title = l;
        lines.splice(0, 1);
        bodyContent = lines.join('\n').trim();
        break;
      }
    }
  }

  if (!title) {
    const baseName = path.basename(filePath, path.extname(filePath));
    title = baseName.replace(/[-_]/g, ' ');
  }

  if (!slug) {
    slug = slugify(title);
  }

  // 3. Fallback Excerpt Extraction
  if (!excerpt) {
    const paragraphs = bodyContent
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0 && !p.startsWith('#') && !p.startsWith('>') && !p.startsWith('|') && !p.startsWith('*') && !p.startsWith('-'));

    if (paragraphs.length > 0 && paragraphs[0]) {
      excerpt = paragraphs[0].replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/[*_`]/g, '');
      if (excerpt.length > 180) {
        excerpt = excerpt.substring(0, 177) + '...';
      }
    }
  }

  // 4. Default SEO metadata if not specified
  if (!seoTitle) {
    seoTitle = title.length <= 60 ? title : title.substring(0, 57) + '...';
  }
  if (!seoDescription) {
    seoDescription = excerpt.length <= 160 ? excerpt : excerpt.substring(0, 157) + '...';
  }

  return {
    title,
    slug,
    excerpt,
    seoTitle,
    seoDescription,
    category,
    tags,
    featuredImage,
    author,
    content: bodyContent,
  };
}

async function updateProgressTracker(topicTitle: string, postSlug: string) {
  const progressPath = path.resolve(process.cwd(), '..', 'PROGRESS.md');
  const localProgressPath = path.resolve(process.cwd(), 'tracking', 'PROGRESS.md');
  const pathsToUpdate = [progressPath, localProgressPath].filter((p) => fs.existsSync(p));

  for (const p of pathsToUpdate) {
    const content = fs.readFileSync(p, 'utf-8');
    const normalizedTitle = topicTitle.toLowerCase().trim();
    if (content.toLowerCase().includes(normalizedTitle)) {
      const lines = content.split('\n');
      let modified = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line && line.includes('|') && line.toLowerCase().includes(normalizedTitle)) {
          if (line.includes('| PENDING |')) {
            lines[i] = line.replace('| PENDING |', '| DRAFT_CREATED |');
            modified = true;
          }
        }
      }
      if (modified) {
        fs.writeFileSync(p, lines.join('\n'), 'utf-8');
        console.log(`[OK] Updated status in ${path.relative(process.cwd(), p)} -> DRAFT_CREATED`);
      }
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  let filePath = '';
  let isDryRun = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) continue;
    if (arg === '--dry-run') {
      isDryRun = true;
    } else if (arg === '--file' || arg === '-f') {
      const nextVal = args[i + 1];
      if (nextVal && !nextVal.startsWith('--')) {
        filePath = nextVal;
        i++;
      }
    } else if (!arg.startsWith('--') && !filePath) {
      filePath = arg;
    }
  }

  if (!filePath) {
    console.error(`\n[ERROR] Please specify a Markdown file path.`);
    console.error(`Usage: npm run import-md <path/to/blog.md> [--dry-run]\n`);
    process.exit(1);
  }

  const resolvedPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`\n[ERROR] File not found at: ${resolvedPath}\n`);
    process.exit(1);
  }

  console.log(`\n====================================================`);
  console.log(`Demoly Direct Markdown -> CMS Draft Importer`);
  console.log(`====================================================`);
  console.log(`Target File : ${resolvedPath}`);
  console.log(`Mode        : ${isDryRun ? 'DRY-RUN (Preview only, no DB writes)' : 'LIVE (Save as DRAFT in Demoly CMS DB)'}`);

  const parsed = parseMarkdownFile(resolvedPath);
  const wordCount = parsed.content.split(/\s+/).length;
  const htmlContent = convertMarkdownToHtml(parsed.content);

  console.log(`\n----------------------------------------------------`);
  console.log(`PARSED BLOG METADATA:`);
  console.log(`Title        : "${parsed.title}"`);
  console.log(`Slug         : ${parsed.slug}`);
  console.log(`Excerpt      : ${parsed.excerpt}`);
  console.log(`SEO Title    : ${parsed.seoTitle}`);
  console.log(`SEO Desc     : ${parsed.seoDescription}`);
  console.log(`Category     : ${parsed.category || '(Auto-resolve)'}`);
  console.log(`Tags         : ${parsed.tags?.join(', ') || '(Auto-resolve)'}`);
  console.log(`Cover Image  : ${parsed.featuredImage || '(None in frontmatter)'}`);
  console.log(`Word Count   : ~${wordCount} words`);
  console.log(`HTML Length  : ${htmlContent.length} characters`);
  console.log(`----------------------------------------------------`);

  if (isDryRun) {
    console.log(`\n[DRY-RUN COMPLETE] Successfully parsed and validated Markdown.`);
    console.log(`[NOTICE] No DB write performed because --dry-run was specified.`);
    return;
  }

  try {
    // 1. Resolve Author
    let authorId = '';
    const authors = await authorRepository.findAll();
    if (parsed.author) {
      const match = authors.find(
        (a) => a.name.toLowerCase() === parsed.author?.toLowerCase() || a.slug === slugify(parsed.author || '')
      );
      if (match) authorId = match._id;
    }
    if (!authorId && authors.length > 0) {
      // Prefer Manish Bulchandani or first available
      const manish = authors.find((a) => a.name.toLowerCase().includes('manish'));
      authorId = manish ? manish._id : (authors[0]?._id || '');
    }

    // 2. Resolve Category
    let categoryId = '';
    const categories = await categoryRepository.findAll();
    if (parsed.category) {
      const catQuery = parsed.category.toLowerCase().trim();
      const match = categories.find((c) => {
        const cName = c.name.toLowerCase();
        const cSlug = c.slug.toLowerCase();
        return (
          cName === catQuery ||
          cSlug === catQuery ||
          cName.includes(catQuery) ||
          catQuery.includes(cName) ||
          (catQuery.includes('competitor') && cSlug === 'comparisons') ||
          (catQuery.includes('alternative') && cSlug === 'comparisons')
        );
      });
      if (match) categoryId = match._id;
    }
    if (!categoryId) {
      // Default to "Comparisons" or "AI Search" or first category
      const compCat = categories.find((c) => c.slug === 'comparisons' || c.name.toLowerCase() === 'comparisons');
      categoryId = compCat ? compCat._id : (categories[0]?._id || '');
    }

    // 3. Resolve Tags from DB
    const allDbTags = await tagRepository.findAll();
    const resolvedTagIds: string[] = [];
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (parsed.tags && parsed.tags.length > 0) {
      for (const t of parsed.tags) {
        const target = norm(t);
        const found = allDbTags.find((dbTag) => {
          const dbN = norm(dbTag.name);
          const dbS = norm(dbTag.slug);
          return dbN === target || dbS === target || dbN.includes(target) || target.includes(dbN);
        });
        if (found && !resolvedTagIds.includes(found._id)) {
          resolvedTagIds.push(found._id);
        }
      }
    }
    // If no tags matched, assign relevant defaults based on content
    if (resolvedTagIds.length === 0 && allDbTags.length > 0) {
      for (const t of allDbTags) {
        if (['Screen Recording', 'Client Handoffs', 'Agencies', 'AI Video Search'].includes(t.name)) {
          resolvedTagIds.push(t._id);
        }
      }
    }

    // 4. Upsert Post (Update if exists, Create if new)
    const existingPost = await postRepository.findBySlug(parsed.slug);
    let targetPost;

    const postPayload = {
      title: parsed.title,
      slug: parsed.slug,
      excerpt: parsed.excerpt,
      content: htmlContent,
      authorId,
      categoryId,
      tagIds: resolvedTagIds,
      featuredImage: parsed.featuredImage || (existingPost?.featuredImage ? existingPost.featuredImage : ''),
      status: 'DRAFT' as const,
      seo: {
        seoTitle: parsed.seoTitle,
        seoDescription: parsed.seoDescription,
        canonicalUrl: `https://demoly.dev/blog/${parsed.slug}`,
      },
    };

    if (existingPost) {
      targetPost = await postRepository.update(existingPost._id, postPayload);
      console.log(`\n[UPDATED] Existing draft post was updated with category and tag links.`);
    } else {
      targetPost = await postRepository.create(postPayload);
    }

    const postResult = targetPost || existingPost;

    const resolvedCategoryObj = categories.find((c) => c._id === categoryId);
    const resolvedTagsList = allDbTags.filter((t) => resolvedTagIds.includes(t._id)).map((t) => `#${t.name}`);

    console.log(`\n====================================================`);
    console.log(`[SUCCESS] DRAFT POST READY IN DEMOLY CMS!`);
    console.log(`====================================================`);
    console.log(`Post ID     : ${postResult._id}`);
    console.log(`Post Title  : ${postResult.title}`);
    console.log(`Post Slug   : ${postResult.slug}`);
    console.log(`Category    : ${resolvedCategoryObj?.name || categoryId}`);
    console.log(`Tags (${resolvedTagIds.length})   : ${resolvedTagsList.join(', ')}`);
    console.log(`Status      : DRAFT (is_published: false)`);
    console.log(`CMS URL     : https://demoly.dev/blog/${postResult.slug}`);
    console.log(`====================================================\n`);

    await updateProgressTracker(parsed.title, postResult.slug);

    const client = await getMongoClient();
    await client.close();
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error(`\n[IMPORT FAILED] ${errMsg}`);
    try {
      const client = await getMongoClient();
      await client.close();
    } catch {
      // Ignore DB close error
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[FATAL ERROR]', err);
  process.exit(1);
});
