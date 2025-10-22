import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { AvisoLegalComponent } from './features/legal/aviso-legal/aviso-legal.component';
import { CookiesComponent } from './features/legal/cookies/cookies.component';
import { PrivacidadComponent } from './features/legal/privacidad/privacidad.component';
import { PostDetailComponent } from './features/posts/post-detail/post-detail.component';
import { PostListComponent } from './features/posts/post-list/post-list.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, data: { title: 'Herramientas gratuitas para autónomos | Toolnexo', description: 'Guías y comparativas de software gratis para autónomos y pequeños negocios.' } },
    { path: 'posts', component: PostListComponent, data: { title: 'Artículos y guías | Toolnexo', description: 'Listado de guías...' } },
    { path: 'post/:slug', component: PostDetailComponent },
    { path: 'aviso-legal', component: AvisoLegalComponent, data: { title: 'Aviso legal | Toolnexo', description: 'Aviso legal del sitio.' } },
    { path: 'privacidad', component: PrivacidadComponent, data: { title: 'Política de privacidad | Toolnexo', description: 'Tratamiento de datos y privacidad.' } },
    { path: 'cookies', component: CookiesComponent, data: { title: 'Política de cookies | Toolnexo', description: 'Política de cookies y consentimiento.' } },
    { path: '**', redirectTo: '' }
];