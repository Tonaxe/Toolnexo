export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  contentHtmlPath: string;
  publishedAt: string;
  tags: string[];
}
