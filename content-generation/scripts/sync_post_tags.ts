import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

import { getDb, getMongoClient } from '../src/lib/mongodb';
import { tagRepository } from '../src/repositories/tag.repository';
import { generateBlogTags } from '../src/utils/tag-generator';

async function main() {
  console.log(`\n=============================================================`);
  console.log(`Demoly 5-6 SEO Tags & Keywords Auto-Sync Pipeline`);
  console.log(`=============================================================`);

  const db = await getDb();
  const postsCollection = db.collection('posts');

  const posts = await postsCollection.find({}).toArray();
  console.log(`Found ${posts.length} posts in Demoly CMS database.`);

  let updatedCount = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    if (!post) continue;

    const tagNames = generateBlogTags(post.title, post.categoryId);
    const resolvedTagIds: string[] = [];

    for (const tName of tagNames) {
      try {
        const tagDoc = await tagRepository.findOrCreate(tName);
        if (tagDoc && !resolvedTagIds.includes(tagDoc._id)) {
          resolvedTagIds.push(tagDoc._id);
        }
      } catch (err) {
        console.warn(`  [WARN] Failed to find or create tag "${tName}":`, err);
      }
    }

    await postsCollection.updateOne(
      { _id: post._id },
      {
        $set: {
          tagIds: resolvedTagIds,
          updatedAt: new Date(),
        },
      }
    );

    console.log(`\n[${i + 1}/${posts.length}] "${post.title}"`);
    console.log(`  Assigned ${resolvedTagIds.length} Tags: [${tagNames.join(', ')}]`);
    updatedCount++;
  }

  console.log(`\n=============================================================`);
  console.log(`TAG SYNC COMPLETE: ${updatedCount}/${posts.length} posts updated successfully.`);
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
