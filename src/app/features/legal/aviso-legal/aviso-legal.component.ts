import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../core/seo/seo.service';

@Component({
  selector: 'app-aviso-legal',
  standalone: true,
  templateUrl: './aviso-legal.component.html',
  styleUrls: ['./aviso-legal.component.scss']
})
export class AvisoLegalComponent implements OnInit {
  constructor(private seo: SeoService) { }

  ngOnInit(): void {
    const canonical = 'https://toolnexo.es/aviso-legal';
    const title = 'Aviso legal | Toolnexo';
    const description = 'Información del titular, condiciones de uso, propiedad intelectual y limitación de responsabilidad de Toolnexo.';

    this.seo.setTitle(title);
    this.seo.setCanonical(canonical);
    this.seo.setMeta(description, {
      title,
      url: canonical,
      type: 'website'
    });

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Aviso legal',
      'url': canonical,
      'about': 'Información legal del sitio Toolnexo'
    }, 'jsonld-legal');
  }
}
