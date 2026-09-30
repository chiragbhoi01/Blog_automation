import { ObjectId } from 'mongodb';
import { QAResult } from './blueprint';

export type AutomationFrequency = 'DAILY' | 'WEEKLY';
export type TopicStatus = 'PENDING' | 'PROCESSING' | 'GENERATED' | 'FAILED';
export type TopicSource = 'MANUAL' | 'BULK_IMPORT' | 'SCHEDULED_SUGGESTION';
export type JobTriggerType = 'SCHEDULED' | 'MANUAL';
export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface AutomationSettingsDoc {
  _id: ObjectId;
  enabled: boolean;
  frequency: AutomationFrequency;
  runTime: string;
  timezone: string;
  defaultAuthorId?: string;
  defaultCategoryId?: string;
  updatedAt: Date;
}

export type AutomationSettings = Omit<AutomationSettingsDoc, '_id'> & {
  _id: string;
};

export interface BlogTopicDoc {
  _id: ObjectId;
  title: string;
  category?: string;
  keywords?: string[];
  status: TopicStatus;
  priority: number;
  source: TopicSource;
  postId?: string;
  lastJobId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BlogTopic = Omit<BlogTopicDoc, '_id'> & {
  _id: string;
};

export interface JobErrorInfo {
  code: string;
  message: string;
  step?: string;
  timestamp: Date;
}

export interface BlogGenerationJobDoc {
  _id: ObjectId;
  topicId?: string;
  topicTitle: string;
  triggerType: JobTriggerType;
  status: JobStatus;
  retryCount: number;
  maxRetries: number;
  startedAt?: Date | null;
  completedAt?: Date | null;
  durationMs?: number;
  errorInfo?: JobErrorInfo;
  postId?: string;
  blueprintId?: string;
  blueprintVersion?: string;
  promptVersion?: string;
  qaResult?: QAResult;
  lockToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BlogGenerationJob = Omit<BlogGenerationJobDoc, '_id'> & {
  _id: string;
};
