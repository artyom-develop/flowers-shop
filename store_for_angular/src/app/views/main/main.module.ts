import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MainRoutingModule} from './main-routing.module';
import {MainComponent} from "./main/main.component";
import {PromotionComponent} from "./promotion/promotion.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {ProductsComponent} from './products/products.component';
import {CarouselModule} from "ngx-owl-carousel-o";
import { DeliveryComponent } from './delivery/delivery.component';
import { CommentsComponent } from './comments/comments.component';


@NgModule({
  declarations: [
    MainComponent,
    PromotionComponent,
    ProductsComponent,
    DeliveryComponent,
    CommentsComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
    RouterModule,
    CarouselModule

  ]
})
export class MainModule { }
