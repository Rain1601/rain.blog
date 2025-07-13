export interface Post {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  date: string;
  readTime: string;
  slug: string;
  content?: string;
}

export interface PostMetadata {
  title: string;
  excerpt: string;
  tags: string[];
  date: string;
  readTime: string;
} 