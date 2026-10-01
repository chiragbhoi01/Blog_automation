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

async function run() {
  try {
    const db = await getDb();
    const posts = await db.collection('posts').find({}, { projection: { title: 1, slug: 1, featuredImage: 1, status: 1 } }).toArray();
    console.log(`\n=== Total Posts in Database: ${posts.length} ===`);
    posts.forEach((p, idx) => {
      console.log(`[${idx + 1}] Title: "${p.title}"`);
      console.log(`    ID: ${p._id}`);
      console.log(`    Slug: ${p.slug}`);
      console.log(`    Status: ${p.status}`);
      console.log(`    Featured Image: ${p.featuredImage || '(EMPTY / NOT GENERATED)'}`);
      console.log('----------------------------------------------------');
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
  } finally {
    try {
      const client = await getMongoClient();
      await client.close();
    } catch {}
    process.exit(0);
  }
}

run();
