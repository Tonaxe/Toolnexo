import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
    private indexUrl = 'assets/posts/index.json';
    private cache: Post[] | null = null;

    constructor(private http: HttpClient) { }

    private async loadIndex(): Promise<Post[]> {
        if (this.cache) return this.cache;

        const posts = await firstValueFrom(
            this.http.get<Post[]>(this.indexUrl)
        );

        this.cache = [...posts].sort((a, b) => {
            const ad = Date.parse(a.publishedAt || '');
            const bd = Date.parse(b.publishedAt || '');
            const aNaN = Number.isNaN(ad);
            const bNaN = Number.isNaN(bd);
            if (aNaN && bNaN) return 0;
            if (aNaN) return 1;
            if (bNaN) return -1;
            return bd - ad;
        });

        return this.cache;
    }

    async list(): Promise<Post[]> {
        return await this.loadIndex();
    }

    async getBySlug(slug: string): Promise<{ post: Post; html: string }> {
        const posts = await this.loadIndex();
        const post = posts.find(p => p.slug === slug);
        if (!post) {
            throw new Error(`Post not found: ${slug}`);
        }

        const htmlPath = this.normalizeAssetPath(post.contentHtmlPath);

        const html = await firstValueFrom(
            this.http.get(htmlPath, { responseType: 'text' })
        );

        return { post, html };
    }

    async filterByTags(tags: string[], mode: 'AND' | 'OR' = 'AND'): Promise<Post[]> {
        const posts = await this.loadIndex();
        const tset = new Set(tags.map(t => t.toLowerCase()));
        if (!tags.length) return posts;

        return posts.filter(p => {
            const pTags = new Set((p.tags || []).map(t => t.toLowerCase()));
            const has = [...tset].map(t => pTags.has(t));
            return mode === 'AND' ? has.every(Boolean) : has.some(Boolean);
        });
    }

    async search(term: string): Promise<Post[]> {
        const posts = await this.loadIndex();
        const q = term.trim().toLowerCase();
        if (!q) return posts;
        return posts.filter(p =>
            (p.title || '').toLowerCase().includes(q) ||
            (p.excerpt || '').toLowerCase().includes(q)
        );
    }

    clearCache(): void {
        this.cache = null;
    }

    private normalizeAssetPath(path: string): string {
        if (!path) return 'assets/posts/___missing.html';
        return path.startsWith('/') ? path.slice(1) : path;
    }
}
