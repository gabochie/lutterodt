export interface Article {
  id: number;
  created: string;
  updated: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  status: "draft" | "published";
  author: string;
  featured_image?: string;
  published_at?: string;
}

export interface TimelineEvent {
  id: number;
  created: string;
  updated: string;
  year: string;
  category: string;
  title: string;
  description: string;
  filter: string;
  images?: string[];
}

export interface GalleryItem {
  id: number;
  created: string;
  updated: string;
  src: string;
  alt: string;
  tag: string;
  title: string;
  filter: string;
}

export interface Contact {
  id: number;
  created: string;
  updated: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  status: "new" | "read" | "resolved";
}

export interface AdminUser {
  id: number;
  created: string;
  updated: string;
  email: string;
  name?: string;
  avatar?: string;
}

declare global {
  interface CloudflareEnv {
    LUTTERODT_KV: KVNamespace;
    LUTTERODT_D1: D1Database;
  }
}
