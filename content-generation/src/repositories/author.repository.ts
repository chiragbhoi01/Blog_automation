import { Collection, ObjectId } from 'mongodb';
import { getDb } from '../lib/mongodb';
import { Author, AuthorDoc } from '../types/content-model';

function mapDocToAuthor(doc: AuthorDoc): Author {
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}

export class AuthorRepository {
  private async collection(): Promise<Collection<AuthorDoc>> {
    const db = await getDb();
    return db.collection<AuthorDoc>('authors');
  }

  async findAll(): Promise<Author[]> {
    const col = await this.collection();
    const docs = await col.find({}).sort({ name: 1 }).toArray();
    return docs.map(mapDocToAuthor);
  }

  async findById(id: string): Promise<Author | null> {
    if (!ObjectId.isValid(id)) return null;
    const col = await this.collection();
    const doc = await col.findOne({ _id: new ObjectId(id) });
    return doc ? mapDocToAuthor(doc) : null;
  }

  async findBySlug(slug: string): Promise<Author | null> {
    const col = await this.collection();
    const doc = await col.findOne({ slug });
    return doc ? mapDocToAuthor(doc) : null;
  }

  async create(data: Omit<AuthorDoc, '_id' | 'createdAt' | 'updatedAt'>): Promise<Author> {
    const col = await this.collection();
    const now = new Date();
    const docToInsert: Omit<AuthorDoc, '_id'> = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const result = await col.insertOne(docToInsert as AuthorDoc);
    return {
      ...docToInsert,
      _id: result.insertedId.toString(),
    };
  }

  async update(id: string, data: Partial<Omit<AuthorDoc, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Author | null> {
    if (!ObjectId.isValid(id)) return null;
    const col = await this.collection();
    const now = new Date();
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: now } },
      { returnDocument: 'after' }
    );
    return result ? mapDocToAuthor(result) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const col = await this.collection();
    const result = await col.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}

export const authorRepository = new AuthorRepository();
