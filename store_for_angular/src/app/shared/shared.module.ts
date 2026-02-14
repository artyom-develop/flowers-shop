import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RouterModule} from "@angular/router";
import {PasswordRepeatDirective} from './directives/password-repeat.directive';
import {ProductCardComponent} from './components/product-card/product-card.component';
import {FormsModule} from "@angular/forms";

import {CategoryFilterComponent} from './components/category-filter/category-filter.component';
import {PaginationComponent} from './components/pagination/pagination.component';
import {AppliedFilterComponent} from './components/applied-filter/applied-filter.component';
import {SortingComponent} from './components/sorting/sorting.component';
import {ProductCarouselComponent} from './components/product-carousel/product-carousel.component';
import {CarouselModule} from "ngx-owl-carousel-o";
import {CounterComponent} from './components/counter/counter.component';
import {LoaderComponent} from './components/loader/loader.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@NgModule({
  declarations: [
    PasswordRepeatDirective,
    ProductCardComponent,
    CategoryFilterComponent,
    PaginationComponent,
    AppliedFilterComponent,
    SortingComponent,
    ProductCarouselComponent,
    CounterComponent,
    LoaderComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CarouselModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    PasswordRepeatDirective,
    ProductCardComponent,
    CategoryFilterComponent,
    PaginationComponent,
    AppliedFilterComponent,
    SortingComponent,
    ProductCarouselComponent,
    CounterComponent,
    LoaderComponent
  ]
})
export class SharedModule {
}
