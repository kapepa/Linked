import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule), data: { preload: true } },
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: 'chat', loadChildren: () => import('./modules/chat/chat.module').then(m => m.ChatModule), data: { preload: true } },
  { path: 'person', loadChildren: () => import('./modules/person/person.module').then(m => m.PersonModule) },
  { path: 'feet', loadChildren: () => import('./modules/feet/feet.module').then(m => m.FeetModule), data: { preload: true } },
  { path: '', redirectTo: '/', pathMatch: 'full' }
  // { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
