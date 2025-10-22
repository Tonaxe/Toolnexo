import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../core/seo/seo.service';

@Component({
  selector: 'app-cookies',
  standalone: true,
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss']
})
export class CookiesComponent implements OnInit {
  constructor(private seo: SeoService) { }

  ngOnInit(): void {
    const canonical = 'https://toolnexo.es/cookies';
    const title = 'Política de cookies | Toolnexo';
    const description = 'Información sobre el uso de cookies propias y de terceros, finalidades, gestión del consentimiento y cómo configurarlas en tu navegador.';

    this.seo.setTitle(title);
    this.seo.setCanonical(canonical);
    this.seo.setMeta(description, { title, url: canonical, type: 'website' });
    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Política de cookies',
      'url': canonical,
      'about': 'Uso de cookies propias y de terceros y gestión del consentimiento.'
    }, 'jsonld-cookies');
  }
  
  openConsent(): void {
    const w = window as any;
    try {
      if (w.OneTrust && typeof w.OneTrust.ToggleInfoDisplay === 'function') {
        w.OneTrust.ToggleInfoDisplay(); return;
      }
      if (w.Cookiebot && typeof w.Cookiebot.renew === 'function') {
        w.Cookiebot.renew(); return;
      }
      if (w.cookieconsent && typeof w.cookieconsent.showSettings === 'function') {
        w.cookieconsent.showSettings(); return;
      }
      
      window.dispatchEvent(new CustomEvent('open-consent-preferences'));
    } catch { }
  }
}
