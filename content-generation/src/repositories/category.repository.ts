import { Collection, ObjectId } from 'mongodb';
import { getDb } from '../lib/mongodb';
import { Category, CategoryDoc } from '../types/content-model';

function mapDocToCategory(doc: CategoryDoc): Category {
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}

export class CategoryRepository {
  private async collection(): Promise<Collection<CategoryDoc>> {
    const db = await getDb();
    return db.collection<CategoryDoc>('categories');
  }

  async findAll(): Promise<Category[]> {
    const col = await this.collection();
    const docs = await col.find({}).sort({ name: 1 }).toArray();
    return docs.map(mapDocToCategory);
  }

  async findById(id: string): Promise<Category | null> {
    if (!ObjectId.isValid(id)) return null;
    const col = await this.collection();
    const doc = await col.findOne({ _id: new ObjectId(id) });
    return doc ? mapDocToCategory(doc) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const col = await this.collection();
    const doc = await col.findOne({ slug });
    return doc ? mapDocToCategory(doc) : null;
  }

  async create(data: Omit<CategoryDoc, '_id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const col = await this.collection();
    const now = new Date();
    const docToInsert: Omit<CategoryDoc, '_id'> = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const result = await col.insertOne(docToInsert as CategoryDoc);
    return {
      ...docToInsert,
      _id: result.insertedId.toString(),
    };
  }

  async update(id: string, data: Partial<Omit<CategoryDoc, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Category | null> {
    if (!ObjectId.isValid(id)) return null;
    const col = await this.collection();
    const now = new Date();
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: now } },
      { returnDocument: 'after' }
    );
    return result ? mapDocToCategory(result) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const col = await this.collection();
    const result = await col.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}

export const categoryRepository = new CategoryRepository();
