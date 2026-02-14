import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './shared/layout/layout.component';
import {ForwardGuard} from "./core/auth/forward.guard";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full',
      },
      {
        path: '',
        loadChildren: () => import('./views/main/main.module').then(m => m.MainModule),
      },
      {
        path: '',
        loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthModule),
        canActivate: [ForwardGuard]
      },
      {
        path: '',
        loadChildren: () => import('./views/product/product.module').then(m => m.ProductModule),
      },
      {
        path: '',
        loadChildren: () => import('./views/personal/personal.module').then(m => m.PersonalModule),

      }
    ]
  },
  {
    path: '**',
    redirectTo: 'main',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
