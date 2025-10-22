import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

type OgMeta = {
    title: string;
    url: string;
    image?: string;
    type?: string;
    publishedTime?: string;
};

@Injectable({ providedIn: 'root' })
export class SeoService {
    constructor(
        private meta: Meta,
        private title: Title,
        @Inject(DOCUMENT) private doc: Document
    ) { }

    setTitle(text: string): void {
        this.title.setTitle(text);
    }

    setMeta(description: string, og: OgMeta): void {
        const ogType = og.type || 'article';

        if (description) {
            this.meta.updateTag({ name: 'description', content: description });
        }
        this.meta.updateTag({ property: 'og:title', content: og.title });
        this.meta.updateTag({ property: 'og:description', content: description || '' });
        this.meta.updateTag({ property: 'og:url', content: og.url });
        this.meta.updateTag({ property: 'og:type', content: ogType });
        if (og.image) this.meta.updateTag({ property: 'og:image', content: og.image });
        if (og.publishedTime) {
            this.meta.updateTag({ property: 'article:published_time', content: og.publishedTime });
        }
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title', content: og.title });
        this.meta.updateTag({ name: 'twitter:description', content: description || '' });
        if (og.image) this.meta.updateTag({ name: 'twitter:image', content: og.image });
    }

    setCanonical(url: string): void {
        let linkEl = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (!linkEl) {
            linkEl = this.doc.createElement('link');
            linkEl.setAttribute('rel', 'canonical');
            this.doc.head.appendChild(linkEl);
        }
        linkEl.setAttribute('href', url);
    }

    setJsonLd(json: object, id = 'jsonld'): void {
        let script = this.doc.getElementById(id) as HTMLScriptElement | null;
        if (!script) {
            script = this.doc.createElement('script');
            script.type = 'application/ld+json';
            script.id = id;
            this.doc.head.appendChild(script);
        }
        script.text = JSON.stringify(json);
    }

    removeJsonLd(id: string): void {
        const el = this.doc.getElementById(id);
        if (el && el.parentNode) el.parentNode.removeChild(el);
    }
}
