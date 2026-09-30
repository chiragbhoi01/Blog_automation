import { Collection, Filter, ObjectId } from 'mongodb';
import { getDb } from '../lib/mongodb';
import {
  AutomationSettings,
  AutomationSettingsDoc,
  BlogTopic,
  BlogTopicDoc,
  BlogGenerationJob,
  BlogGenerationJobDoc,
  TopicStatus,
  JobStatus,
  JobTriggerType,
} from '../types/automation';

function mapDocToSettings(doc: AutomationSettingsDoc): AutomationSettings {
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}

function mapDocToTopic(doc: BlogTopicDoc): BlogTopic {
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}

function mapDocToJob(doc: BlogGenerationJobDoc): BlogGenerationJob {
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}

export interface ListTopicsOptions {
  status?: TopicStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ListJobsOptions {
  status?: JobStatus;
  triggerType?: JobTriggerType;
  page?: number;
  limit?: number;
}

export class AutomationRepository {
  private async settingsCollection(): Promise<Collection<AutomationSettingsDoc>> {
    const db = await getDb();
    return db.collection<AutomationSettingsDoc>('automation_settings');
  }

  private async topicsCollection(): Promise<Collection<BlogTopicDoc>> {
    const db = await getDb();
    return db.collection<BlogTopicDoc>('blog_topics');
  }

  private async jobsCollection(): Promise<Collection<BlogGenerationJobDoc>> {
    const db = await getDb();
    return db.collection<BlogGenerationJobDoc>('blog_generation_jobs');
  }

  // --- Automation Settings ---
  async getSettings(): Promise<AutomationSettings> {
    const col = await this.settingsCollection();
    let doc = await col.findOne({});
    if (!doc) {
      const now = new Date();
      const defaultDoc: Omit<AutomationSettingsDoc, '_id'> = {
        enabled: false,
        frequency: 'DAILY',
        runTime: '09:00',
        timezone: 'UTC',
        updatedAt: now,
      };
      const res = await col.insertOne(defaultDoc as AutomationSettingsDoc);
      doc = { _id: res.insertedId, ...defaultDoc };
    }
    return mapDocToSettings(doc);
  }

  async updateSettings(data: Partial<Omit<AutomationSettingsDoc, '_id' | 'updatedAt'>>): Promise<AutomationSettings> {
    const col = await this.settingsCollection();
    const now = new Date();
    const current = await this.getSettings();
    const res = await col.findOneAndUpdate(
      { _id: new ObjectId(current._id) },
      { $set: { ...data, updatedAt: now } },
      { returnDocument: 'after' }
    );
    return res ? mapDocToSettings(res) : current;
  }

  // --- Blog Topics Queue ---
  async findTopics(options: ListTopicsOptions = {}): Promise<{ items: BlogTopic[]; total: number }> {
    const col = await this.topicsCollection();
    const filter: Filter<BlogTopicDoc> = {};

    if (options.status) {
      filter.status = options.status;
    }

    if (options.search && options.search.trim()) {
      const searchRegex = new RegExp(options.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { title: searchRegex },
        { category: searchRegex },
        { keywords: searchRegex },
      ];
    }

    const total = await col.countDocuments(filter);
    const cursor = col.find(filter).sort({ priority: -1, createdAt: -1 });

    if (options.page && options.limit) {
      const skip = (options.page - 1) * options.limit;
      cursor.skip(skip).limit(options.limit);
    }

    const docs = await cursor.toArray();
    return {
      items: docs.map(mapDocToTopic),
      total,
    };
  }

  async findTopicById(id: string): Promise<BlogTopic | null> {
    if (!ObjectId.isValid(id)) return null;
    const col = await this.topicsCollection();
    const doc = await col.findOne({ _id: new ObjectId(id) });
    return doc ? mapDocToTopic(doc) : null;
  }

  async findTopicByTitle(title: string): Promise<BlogTopic | null> {
    const col = await this.topicsCollection();
    const doc = await col.findOne({ title: title.trim() });
    return doc ? mapDocToTopic(doc) : null;
  }

  async createTopic(data: Omit<BlogTopicDoc, '_id' | 'createdAt' | 'updatedAt'>): Promise<BlogTopic> {
    const col = await this.topicsCollection();
    const now = new Date();
    const docToInsert: Omit<BlogTopicDoc, '_id'> = {
      ...data,
      title: data.title.trim(),
      createdAt: now,
      updatedAt: now,
    };
    const res = await col.insertOne(docToInsert as BlogTopicDoc);
    return {
      ...docToInsert,
      _id: res.insertedId.toString(),
    };
  }

  async updateTopic(id: string, data: Partial<Omit<BlogTopicDoc, '_id' | 'createdAt' | 'updatedAt'>>): Promise<BlogTopic | null> {
    if (!ObjectId.isValid(id)) return null;
    const col = await this.topicsCollection();
    const now = new Date();
    const res = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: now } },
      { returnDocument: 'after' }
    );
    return res ? mapDocToTopic(res) : null;
  }

  async deleteTopic(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const col = await this.topicsCollection();
    const topic = await col.findOne({ _id: new ObjectId(id) });
    if (!topic || topic.status === 'PROCESSING') {
      return false;
    }
    const res = await col.deleteOne({ _id: new ObjectId(id) });
    return res.deletedCount > 0;
  }

  async claimNextPendingTopic(): Promise<BlogTopic | null> {
    const col = await this.topicsCollection();
    const now = new Date();
    const res = await col.findOneAndUpdate(
      { status: 'PENDING' },
      { $set: { status: 'PROCESSING', updatedAt: now } },
      { sort: { priority: -1, createdAt: 1 }, returnDocument: 'after' }
    );
    return res ? mapDocToTopic(res) : null;
  }

  // --- Blog Generation Jobs (Run History) ---
  async findJobs(options: ListJobsOptions = {}): Promise<{ items: BlogGenerationJob[]; total: number }> {
    const col = await this.jobsCollection();
    const filter: Filter<BlogGenerationJobDoc> = {};

    if (options.status) {
      filter.status = options.status;
    }

    if (options.triggerType) {
      filter.triggerType = options.triggerType;
    }

    const total = await col.countDocuments(filter);
    const cursor = col.find(filter).sort({ createdAt: -1 });

    if (options.page && options.limit) {
      const skip = (options.page - 1) * options.limit;
      cursor.skip(skip).limit(options.limit);
    }

    const docs = await cursor.toArray();
    return {
      items: docs.map(mapDocToJob),
      total,
    };
  }

  async findJobById(id: string): Promise<BlogGenerationJob | null> {
    if (!ObjectId.isValid(id)) return null;
    const col = await this.jobsCollection();
    const doc = await col.findOne({ _id: new ObjectId(id) });
    return doc ? mapDocToJob(doc) : null;
  }

  async createJob(data: Omit<BlogGenerationJobDoc, '_id' | 'createdAt' | 'updatedAt'>): Promise<BlogGenerationJob> {
    const col = await this.jobsCollection();
    const now = new Date();
    const docToInsert: Omit<BlogGenerationJobDoc, '_id'> = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const res = await col.insertOne(docToInsert as BlogGenerationJobDoc);
    return {
      ...docToInsert,
      _id: res.insertedId.toString(),
    };
  }

  async updateJob(id: string, data: Partial<Omit<BlogGenerationJobDoc, '_id' | 'createdAt' | 'updatedAt'>>): Promise<BlogGenerationJob | null> {
    if (!ObjectId.isValid(id)) return null;
    const col = await this.jobsCollection();
    const now = new Date();
    const res = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: now } },
      { returnDocument: 'after' }
    );
    return res ? mapDocToJob(res) : null;
  }
}

export const automationRepository = new AutomationRepository();
