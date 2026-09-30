import { ObjectId } from 'mongodb';

export type UserRole = 'ADMIN' | 'EDITOR' | 'AUTHOR';
export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED';

export interface AuthorSocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface AuthorDoc {
  _id: ObjectId;
  name: string;
  slug: string;
  bio?: string;
  profileImage?: string;
  role?: string;
  socialLinks?: AuthorSocialLinks;
  createdAt: Date;
  updatedAt: Date;
}

export type Author = Omit<AuthorDoc, '_id'> & {
  _id: string;
};

export interface CategoryDoc {
  _id: ObjectId;
  name: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Category = Omit<CategoryDoc, '_id'> & {
  _id: string;
};

export interface TagDoc {
  _id: ObjectId;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Tag = Omit<TagDoc, '_id'> & {
  _id: string;
};

export interface PostSeo {
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export interface PostDoc {
  _id: ObjectId;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  authorId: string;
  categoryId: string;
  tagIds: string[];
  status: PostStatus;
  publishedAt?: Date | null;
  scheduledAt?: Date | null;
  seo?: PostSeo;
  createdAt: Date;
  updatedAt: Date;
}

export type Post = Omit<PostDoc, '_id'> & {
  _id: string;
};

export interface PopulatedPost extends Post {
  author?: Author | null;
  category?: Category | null;
  tags?: Tag[];
}
