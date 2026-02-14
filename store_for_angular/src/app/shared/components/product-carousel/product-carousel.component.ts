import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { ProductType } from '../../../../types/product/ProductType.type';
import { trackById } from '../../utils/track-by';
import { FavoriteService } from '../../services/favorite.service';
import { DefaultResponseType } from '../../../../types/common/DefaultResponse.type';
import { FavoriteType } from '../../../../types/personal/favorite/favorite.type';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../../core/auth/auth.service';
import { CartType } from '../../../../types/cart/product-cart.type';

@Component({
  selector: 'product-carousel',
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.scss'],
})
export class ProductCarouselComponent implements OnInit, OnDestroy {
  @Input() title!: string;
  @Input() isShowLight: boolean = false;
  subscription: Subscription | null = null;
  products: ProductType[] = [];
  protected readonly trackById = trackById;
  private _destroy$: Subject<void> = new Subject();

  constructor(
    private productService: ProductService,
    private favoriteService: FavoriteService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cartService
      .getCart()
      .pipe(takeUntil(this._destroy$))
      .subscribe((cart: CartType | DefaultResponseType) => {
        if ((cart as DefaultResponseType).error !== undefined) {
          const error = (cart as DefaultResponseType).message;
          throw new Error(error);
        }
        const cartResponse = cart as CartType;
        let cartItems = cartResponse;
        let favorites: FavoriteType[] = [];
        if (this.authService.getIsLoggedIn()) {
          this.favoriteService
            .getFavorite()
            .pipe(takeUntil(this._destroy$))
            .subscribe({
              next: (data: DefaultResponseType | FavoriteType[]) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  const error = (data as DefaultResponseType).message;
                  throw new Error(error);
                }
                const dataFavorite = data as FavoriteType[];
                favorites = data as FavoriteType[];
                this.updateProducts(cartItems, favorites);
              },
            });
        } else {
          this.updateProducts(cartItems, []);
        }
      });
  }
  private updateProducts(cartItems: CartType, favorites: FavoriteType[] = []) {
    this.productService
      .getBestProducts()
      .pipe(takeUntil(this._destroy$))
      .subscribe((data: ProductType[]) => {
      
        this.products = data.map((product: ProductType) => {
          const cartFound = cartItems.items.find((item) => item.product.id === product.id);
          const favoriteItem = favorites.find((item) => item.id === product.id);
          return {
            ...product,
            countInCart: cartFound ? cartFound.quantity : 0,
            isInFavorite: !!favoriteItem,
          };
        });
      });
  }
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    margin: 24,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
    },
  };

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
