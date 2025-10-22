import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService } from '../../../core/posts/post.service';
import { Post } from '../../../core/posts/post.model';
import { SeoService } from '../../../core/seo/seo.service';

@Component({
  selector: 'app-post-list-preview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-list-preview.component.html',
  styleUrls: ['./post-list-preview.component.scss']
})
export class PostListPreviewComponent implements OnInit {
  posts: Post[] = [];
  loading = true;

  constructor(
    private ps: PostService,
    private seo: SeoService
  ) { }

  async ngOnInit() {
    const all = await this.ps.list();
    this.posts = all.slice(0, 6);
    this.loading = false;

    const base = 'https://toolnexo.es';
    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'itemListElement': this.posts.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${base}/post/${p.slug}`,
        name: p.title
      }))
    }, 'jsonld-latest');
  }

  trackBySlug(_i: number, p: Post) { return p.slug; }
}
