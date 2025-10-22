import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../core/seo/seo.service';

@Component({
  selector: 'app-privacidad',
  standalone: true,
  templateUrl: './privacidad.component.html',
  styleUrls: ['./privacidad.component.scss']
})
export class PrivacidadComponent implements OnInit {
  constructor(private seo: SeoService) { }

  ngOnInit(): void {
    const canonical = 'https://toolnexo.es/privacidad';
    const title = 'Política de privacidad | Toolnexo';
    const description = 'Cómo tratamos tus datos personales, base legal, finalidades, conservación, derechos y contacto. Compatible con Consent Mode v2.';

    this.seo.setTitle(title);
    this.seo.setCanonical(canonical);
    this.seo.setMeta(description, { title, url: canonical, type: 'website' });
    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Política de privacidad',
      'url': canonical,
      'about': 'Información sobre el tratamiento de datos personales en Toolnexo.'
    }, 'jsonld-privacy');
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
