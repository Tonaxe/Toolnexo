import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { SeoService } from './core/seo/seo.service';

const BASE_URL = 'https://toolnexo.es';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private sub?: Subscription;

  constructor(
    private readonly seo: SeoService,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly pid: Object
  ) { }

  ngOnInit(): void {
    this.seo.setTitle('Toolnexo — Guías y herramientas gratuitas para autónomos');
    this.seo.setMeta(
      'Guías, comparativas y plantillas para facturar, organizar clientes y proyectos sin pagar licencias.',
      {
        title: 'Toolnexo',
        url: BASE_URL,
        type: 'website'
      }
    );

    this.seo.setJsonLd(
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Toolnexo',
        'url': BASE_URL,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${BASE_URL}/posts?query={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      'site-ld'
    );

    if (isPlatformBrowser(this.pid)) {
      this.sub = this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
