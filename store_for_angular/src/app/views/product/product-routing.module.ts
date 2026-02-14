import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CatalogComponent} from './catalog/catalog.component';
import {DetailComponent} from "./detail/detail.component";
import {CartComponent} from "./cart/cart.component";

const routes: Routes = [
  {
    path: "catalog",
    component: CatalogComponent,
  },
  {
    path: "detail/:url",
    component: DetailComponent,
  },
  {
    path: "cart",
    component: CartComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
