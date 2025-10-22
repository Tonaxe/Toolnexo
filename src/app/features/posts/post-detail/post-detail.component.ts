import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PostService } from '../../../core/posts/post.service';
import { SeoService } from '../../../core/seo/seo.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit, OnDestroy {
  @ViewChild('contentRef') contentRef!: ElementRef<HTMLElement>;

  html: SafeHtml | null = null;
  title = '';
  slug = '';

  private anchorClickHandler?: (ev: Event) => void;

  constructor(
    private route: ActivatedRoute,
    private ps: PostService,
    private seo: SeoService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  async ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug')!;

    const { post, html } = await this.ps.getBySlug(this.slug);
    this.title = post.title;
    this.html = this.sanitizer.bypassSecurityTrustHtml(html);

    const url = `https://toolnexo.es/post/${post.slug}`;
    const ogImg =
      post.cover?.startsWith('http')
        ? post.cover
        : post.cover
          ? `https://toolnexo.es${post.cover}`
          : undefined;

    this.seo.setTitle(`${post.title} | Toolnexo`);
    this.seo.setCanonical(url);
    this.seo.setMeta(post.excerpt, {
      title: `${post.title} | Toolnexo`,
      url,
      image: ogImg,
      type: 'article',
      publishedTime: post.publishedAt,
    });

    this.seo.setJsonLd(
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        author: { '@type': 'Organization', name: 'Toolnexo' },
        publisher: {
          '@type': 'Organization',
          name: 'Toolnexo',
          logo: { '@type': 'ImageObject', url: 'https://toolnexo.es/assets/logo.png' },
        },
        ...(ogImg ? { image: [ogImg] } : {}),
        mainEntityOfPage: url,
      },
      `jsonld-${post.slug}`
    );

    this.seo.setJsonLd(
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Artículos', item: 'https://toolnexo.es/posts' },
          { '@type': 'ListItem', position: 2, name: post.title, item: url },
        ],
      },
      `breadcrumb-${post.slug}`
    );

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.bindAnchorScrolling(), 0);

      const hash = decodeURIComponent(location.hash.replace('#', ''));
      if (hash) {
        setTimeout(() => {
          const root = this.contentRef?.nativeElement;
          const el =
            root?.querySelector<HTMLElement>(`#${CSS?.escape ? CSS.escape(hash) : hash}`) ||
            document.getElementById(hash);
          el?.scrollIntoView({ behavior: 'auto', block: 'start' });
        }, 0);
      }
    }
  }

  ngOnDestroy(): void {
    const root = this.contentRef?.nativeElement;
    if (root && this.anchorClickHandler) {
      root.removeEventListener('click', this.anchorClickHandler);
    }
  }

  private bindAnchorScrolling(): void {
    const root = this.contentRef?.nativeElement;
    if (!root) return;
    this.anchorClickHandler = (ev: Event) => {
      const target = ev.target as HTMLElement | null;
      const link = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.getAttribute('href')!;
      const id = decodeURIComponent(href.slice(1));
      const el =
        root.querySelector<HTMLElement>(`#${CSS?.escape ? CSS.escape(id) : id}`) ||
        document.getElementById(id);
      if (!el) return;

      ev.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    };

    root.addEventListener('click', this.anchorClickHandler);
  }
}
