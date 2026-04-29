export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  coverImage?: string;
  isPrivate?: boolean;
  _count?: {
    likes: number;
  };
  author: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
}

export interface User {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  socials?: {
    github?: string;
    twitter?: string;
    email?: string;
  };
}
