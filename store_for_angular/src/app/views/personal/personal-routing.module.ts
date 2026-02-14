import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FavoriteComponent} from "./favorite/favorite.component";
import {OrderComponent} from "./order/order.component";
import {InfoComponent} from "./info/info.component";
import {AuthGuard} from "../../core/auth/auth.guard";
import {OrdersComponent} from "./orders/orders.component";

const routes: Routes = [
  {
    path: 'favorite',
    component:FavoriteComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'order',
    component:OrderComponent,
  },
  {
    path: 'orders',
    component:OrdersComponent,
  },
  {
    path: 'info',
    component:InfoComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalRoutingModule { }
