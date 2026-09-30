import { Collection, Filter, ObjectId, Sort } from 'mongodb';
import { getDb } from '../lib/mongodb';
import { Post, PostDoc, PostStatus } from '../types/content-model';

function mapDocToPost(doc: PostDoc): Post {
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}

export interface PostFindAllOptions {
  status?: PostStatus | string;
  page?: number;
  limit?: number;
  authorId?: string;
  categoryId?: string;
  tagId?: string;
  search?: string;
  sort?: 'recent' | 'publishedAt' | 'title';
}

export class PostRepository {
  private async collection(): Promise<Collection<PostDoc>> {
    const db = await getDb();
    return db.collection<PostDoc>('posts');
  }

  async findAll(options?: PostFindAllOptions): Promise<{ items: Post[]; total: number }> {
    const page = Math.max(1, options?.page || 1);
    const limit = Math.min(100, Math.max(1, options?.limit || 20));
    const skip = (page - 1) * limit;

    const filter: Filter<PostDoc> = {};

    if (options?.status) {
      filter.status = options.status as PostStatus;
    }
    if (options?.authorId) {
      filter.authorId = options.authorId;
    }
    if (options?.categoryId) {
      filter.categoryId = options.categoryId;
    }
    if (options?.tagId) {
      filter.tagIds = options.tagId;
    }
    if (options?.search && options.search.trim()) {
      const searchRegex = new RegExp(options.search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { excerpt: searchRegex },
        { slug: searchRegex },
      ];
    }

    let sortOption: Sort = { createdAt: -1 };
    if (options?.sort === 'publishedAt') {
      sortOption = { publishedAt: -1, createdAt: -1 };
    } else if (options?.sort === 'title') {
      sortOption = { title: 1 };
    }

    const col = await this.collection();
    const [docs, total] = await Promise.all([
      col.find(filter).sort(sortOption).skip(skip).limit(limit).toArray(),
      col.countDocuments(filter),
    ]);

    return {
      items: docs.map(mapDocToPost),
      total,
    };
  }

  async findPublished(options?: Omit<PostFindAllOptions, 'status'>): Promise<{ items: Post[]; total: number }> {
    return this.findAll({
      ...options,
      status: 'PUBLISHED',
      sort: options?.sort || 'publishedAt',
    });
  }

  async findById(id: string): Promise<Post | null> {
    if (!ObjectId.isValid(id)) return null;
    const col = await this.collection();
    const doc = await col.findOne({ _id: new ObjectId(id) });
    return doc ? mapDocToPost(doc) : null;
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const col = await this.collection();
    const doc = await col.findOne({ slug });
    return doc ? mapDocToPost(doc) : null;
  }

  async findPublishedBySlug(slug: string): Promise<Post | null> {
    const col = await this.collection();
    const doc = await col.findOne({ slug, status: 'PUBLISHED' });
    return doc ? mapDocToPost(doc) : null;
  }

  async create(data: Omit<PostDoc, '_id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    const col = await this.collection();
    const now = new Date();
    const docToInsert: Omit<PostDoc, '_id'> = {
      ...data,
      tagIds: data.tagIds || [],
      createdAt: now,
      updatedAt: now,
    };
    const result = await col.insertOne(docToInsert as PostDoc);
    return {
      ...docToInsert,
      _id: result.insertedId.toString(),
    };
  }

  async update(id: string, data: Partial<Omit<PostDoc, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Post | null> {
    if (!ObjectId.isValid(id)) return null;
    const col = await this.collection();
    const now = new Date();
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: now } },
      { returnDocument: 'after' }
    );
    return result ? mapDocToPost(result) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const col = await this.collection();
    const result = await col.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async count(filter: Filter<PostDoc> = {}): Promise<number> {
    const col = await this.collection();
    return col.countDocuments(filter);
  }
}

export const postRepository = new PostRepository();
