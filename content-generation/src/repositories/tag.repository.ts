import { Collection, ObjectId } from 'mongodb';
import { getDb } from '../lib/mongodb';
import { Tag, TagDoc } from '../types/content-model';

function mapDocToTag(doc: TagDoc): Tag {
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}

export class TagRepository {
  private async collection(): Promise<Collection<TagDoc>> {
    const db = await getDb();
    return db.collection<TagDoc>('tags');
  }

  async findAll(): Promise<Tag[]> {
    const col = await this.collection();
    const docs = await col.find({}).sort({ name: 1 }).toArray();
    return docs.map(mapDocToTag);
  }

  async findById(id: string): Promise<Tag | null> {
    if (!ObjectId.isValid(id)) return null;
    const col = await this.collection();
    const doc = await col.findOne({ _id: new ObjectId(id) });
    return doc ? mapDocToTag(doc) : null;
  }

  async findBySlug(slug: string): Promise<Tag | null> {
    const col = await this.collection();
    const doc = await col.findOne({ slug });
    return doc ? mapDocToTag(doc) : null;
  }

  async create(data: { name: string; slug?: string }): Promise<Tag> {
    const col = await this.collection();
    const slug = (data.slug || data.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    const now = new Date();
    const doc: TagDoc = {
      _id: new ObjectId(),
      name: data.name.trim(),
      slug,
      createdAt: now,
      updatedAt: now,
    };

    await col.insertOne(doc);
    return mapDocToTag(doc);
  }

  async findOrCreate(name: string): Promise<Tag> {
    const cleanName = name.trim();
    const slug = cleanName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const existing = await this.findBySlug(slug);
    if (existing) return existing;

    const col = await this.collection();
    const existingByName = await col.findOne({ name: { $regex: new RegExp(`^${cleanName}$`, 'i') } });
    if (existingByName) return mapDocToTag(existingByName);

    return this.create({ name: cleanName, slug });
  }
}

export const tagRepository = new TagRepository();
