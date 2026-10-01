import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// 1. Load environment variables
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

import { getDb, getMongoClient } from '../src/lib/mongodb';
import { imageGeneratorService } from '../src/services/image-generator.service';

async function main() {
  console.log(`\n=============================================================`);
  console.log(`Demoly Automated Featured Image Generation Pipeline (Supademo Theme)`);
  console.log(`=============================================================`);

  const args = process.argv.slice(2);
  const isForce = args.includes('--force');
  const targetSlug = args.find((a, i) => args[i - 1] === '--slug' || a.startsWith('--slug='))?.replace('--slug=', '');

  const db = await getDb();
  const postsCollection = db.collection('posts');

  const posts = await postsCollection.find({}).toArray();
  console.log(`Found ${posts.length} total posts in Demoly CMS database.`);

  let pendingPosts = posts;
  if (targetSlug) {
    pendingPosts = posts.filter((p) => p.slug === targetSlug);
  } else if (!isForce) {
    pendingPosts = posts.filter(
      (p) => !p.featuredImage || !p.featuredImage.startsWith('http')
    );
  }

  console.log(`\nFound ${pendingPosts.length} posts to generate featured images for (Force: ${isForce}).`);
  console.log(`-------------------------------------------------------------`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < pendingPosts.length; i++) {
    const post = pendingPosts[i];
    if (!post) continue;

    console.log(`\n[${i + 1}/${pendingPosts.length}] Processing: "${post.title}"`);
    console.log(`  Slug: ${post.slug}`);
    console.log(`  Current Featured Image: ${post.featuredImage || '(None)'}`);

    try {
      console.log(`  -> Generating brand-consistent Supademo/Demoly style cover image...`);
      const coverUrl = await imageGeneratorService.generateAndUploadFeaturedImage(
        post.title,
        post.slug,
        post.excerpt
      );

      if (coverUrl) {
        await postsCollection.updateOne(
          { _id: post._id },
          {
            $set: {
              featuredImage: coverUrl,
              'seo.ogImage': coverUrl,
              updatedAt: new Date(),
            },
          }
        );
        console.log(`  [OK] Successfully updated MongoDB post with Cloudinary URL:`);
        console.log(`       ${coverUrl}`);
        successCount++;
      } else {
        console.warn(`  [WARN] Failed to upload or generate image for "${post.title}".`);
        failCount++;
      }
    } catch (err) {
      console.error(`  [ERROR] Processing failed for "${post.title}":`, err);
      failCount++;
    }
  }

  console.log(`\n=============================================================`);
  console.log(`EXECUTION SUMMARY:`);
  console.log(`Total Processed : ${pendingPosts.length}`);
  console.log(`Successfully Updated : ${successCount}`);
  console.log(`Failed : ${failCount}`);
  console.log(`=============================================================\n`);

  try {
    const client = await getMongoClient();
    await client.close();
  } catch {}
  process.exit(0);
}

main().catch((err) => {
  console.error('[FATAL ERROR]', err);
  process.exit(1);
});
