import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product/ProductType.type";
import {trackById, trackByIndex} from "../../../shared/utils/track-by";
import {CategoryService} from "../../../shared/services/category.service";
import {debounceTime, Subject, takeUntil, tap} from "rxjs";
import {MapType} from "../../../../types/category/mapType.type";
import {ActivatedRoute} from "@angular/router";
import {ActiveParamsType} from "../../../../types/product/active-params.type";
import {AppliedFilterType} from "../../../../types/category/appliedFilter.type";
import {CartType} from "../../../../types/cart/product-cart.type";
import {CartService} from "../../../shared/services/cart.service";
import {FavoriteService} from "../../../shared/services/favorite.service";
import {DefaultResponseType} from "../../../../types/common/DefaultResponse.type";
import {FavoriteType} from "../../../../types/personal/favorite/favorite.type";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})

export class CatalogComponent implements OnInit, OnDestroy {
  trackById = trackById;
  products: ProductType[] = [];
  categories: MapType[] = [];
  private destroy$ = new Subject<void>();
  activeParams: ActiveParamsType = {
    types: [],
  };

  appliedFilters: AppliedFilterType[] = [];
  sortingOpen: boolean = false;
  pages: number[] = [];
  loading = true;
  cart: CartType | null = null;
  favoriteProducts: FavoriteType[] | null = null;
  constructor(private productService: ProductService, private categoryService: CategoryService, private activateRoute: ActivatedRoute,
              private cartService: CartService,
              private favoriteService: FavoriteService
              ,private authService: AuthService) {
  }

  ngOnInit(): void {

    this.cartService.getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.cart = data as CartType;
        if(this.authService.getIsLoggedIn()){
          this.favoriteService.getFavorite()
            .pipe(takeUntil(this.destroy$)).subscribe({
            next: (data: DefaultResponseType | FavoriteType[]) => {
              if ((data as DefaultResponseType).error !== undefined) {
                const error = (data as DefaultResponseType).message;
                this.processCatalog();
                throw new Error(error);
              }
              this.favoriteProducts = data as FavoriteType[];
              this.processCatalog();
            },
            error: (error)=>{
              this.processCatalog();
            }
          });
        }else{
          this.processCatalog();
        }

      }
    );


  }

  processCatalog(){
    this.categoryService.getTypesOfCategories()
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((types) => {

        this.categories = types;
        this.activateRoute.queryParams
          .pipe(
            debounceTime(300),
          ).subscribe(params => {
          this.activeParams = ActiveParamsUtil.processParams(params);
          this.appliedFilters = [];


          this.activeParams.types.forEach(url => {
            this.categories.forEach(category => {
              const foundItem = category.types.find(type => type.url === url);
              if (foundItem) {
                this.appliedFilters.push({
                  name: foundItem.name,
                  urlParam: foundItem.url
                });
              }
            });
          });
          if (this.activeParams.heightFrom) {
            this.appliedFilters.push({
              name: 'Высота: от ' + this.activeParams.heightFrom + ' см',
              urlParam: 'heightFrom'
            });
          }
          if (this.activeParams.heightTo) {
            this.appliedFilters.push({
              name: 'Высота: до ' + this.activeParams.heightTo + ' см',
              urlParam: 'heightTo'
            });
          }

          if (this.activeParams.diameterFrom) {
            this.appliedFilters.push({
              name: 'Диаметр: от ' + this.activeParams.diameterFrom + ' см',
              urlParam: 'diameterFrom'
            });
          }
          if (this.activeParams.diameterTo) {
            this.appliedFilters.push({
              name: 'Диаметр: до ' + this.activeParams.diameterTo + ' см',
              urlParam: 'diameterTo'
            });
          }
          if (this.activeParams.sort) {
            this.sortingOpen = true;
          }
          this.productService.getProducts(this.activeParams)
            .pipe(takeUntil(this.destroy$), tap(() => {
                this.loading = false;
              }),
            )
            .subscribe((products) => {
              this.pages = [];
              for (let i = 1; i <= products.pages; i++) {
                this.pages.push(i);
              }

              if (this.cart && this.cart.items.length > 0) {

                this.products = products.items.map(product => {
                  if (this.cart) {
                    const productInCart = this.cart?.items.find(item => item.product.id === product.id);
                    if (productInCart) {
                      product.countInCart = productInCart.quantity;
                    }
                  }
                  return product;
                });

              } else {
                this.products = products.items;
              }
              if(this.favoriteProducts){
                this.products = this.products.map(product=>{
                  const foundFavoriteProduct = this.favoriteProducts?.find(item=> item.id === product.id);
                  if(foundFavoriteProduct){
                    product.isInFavorite = true;
                  }
                  return product;
                });
              }
            });
        });

      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly trackByIndex = trackByIndex;
}
