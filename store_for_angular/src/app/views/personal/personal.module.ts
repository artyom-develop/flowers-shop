import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PersonalRoutingModule} from './personal-routing.module';
import {SharedModule} from "../../shared/shared.module";
import {InfoComponent} from './info/info.component';
import {OrderComponent} from './order/order.component';
import {FavoriteComponent} from './favorite/favorite.component';
import {ReactiveFormsModule} from "@angular/forms";
import {DialogModule} from "primeng/dialog";
import { OrdersComponent } from './orders/orders.component';


@NgModule({
  declarations: [
    InfoComponent,
    OrderComponent,
    FavoriteComponent,
    OrdersComponent
  ],
  imports: [
    CommonModule,
    PersonalRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    DialogModule,
  ]
})
export class PersonalModule { }
