import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostListPreviewComponent } from '../posts/post-list-preview/post-list-preview.component';
import { SeoService } from '../../core/seo/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, PostListPreviewComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    const title = 'Herramientas gratuitas para autónomos y pequeños negocios | Toolnexo';
    const description = 'Guías, comparativas y plantillas para facturar, organizar clientes y proyectos sin pagar licencias.';
    const canonical = 'https://toolnexo.es/';

    this.seo.setTitle(title);
    this.seo.setCanonical(canonical);
    this.seo.setMeta(description, {
      title,
      url: canonical,
      image: 'https://toolnexo.es/assets/og-home.jpg',
      type: 'website'
    });

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Toolnexo',
      'url': canonical,
    }, 'jsonld-website');

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Toolnexo',
      'url': canonical,
      'logo': 'https://toolnexo.es/assets/logo.png'
    }, 'jsonld-org');
  }
}
