import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService } from '../../../core/posts/post.service';
import { Post } from '../../../core/posts/post.model';
import { SeoService } from '../../../core/seo/seo.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  loading = true;

  constructor(
    private ps: PostService,
    private seo: SeoService
  ) { }

  async ngOnInit() {
    this.posts = await this.ps.list();
    this.loading = false;
    const canonical = 'https://toolnexo.es/posts';
    const title = 'Artículos y guías | Toolnexo';
    const description = 'Herramientas, comparativas y tutoriales para autónomos y pequeños negocios.';

    this.seo.setTitle(title);
    this.seo.setCanonical(canonical);
    this.seo.setMeta(description, {
      title,
      url: canonical,
      type: 'website'
    });

    const items = this.posts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://toolnexo.es/post/${p.slug}`,
      name: p.title
    }));

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'itemListElement': items
    }, 'jsonld-itemlist-posts');
  }

  trackBySlug(_i: number, p: Post) { return p.slug; }
}
