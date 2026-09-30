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
}

export const tagRepository = new TagRepository();
