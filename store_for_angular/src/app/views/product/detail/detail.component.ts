import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../../shared/services/product.service";
import {Subject, takeUntil} from "rxjs";
import {ProductType} from "../../../../types/product/ProductType.type";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart/product-cart.type";
import {CartService} from "../../../shared/services/cart.service";
import {ToastService} from "../../../shared/services/toast.service";
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/personal/favorite/favorite.type";
import {DefaultResponseType} from "../../../../types/common/DefaultResponse.type";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  private _destroy$: Subject<void> = new Subject<void>();
  count: number = 1;
  isLogged: boolean = false;

  constructor(private router: Router, private productService: ProductService, private activatedRoute: ActivatedRoute,
              private cartService: CartService, private toastService: ToastService, private favoriteService: FavoriteService,
              private authService: AuthService) {
  }

  product!: ProductType;

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.productService.getProduct(params['url'])
        .pipe(takeUntil(this._destroy$))
        .subscribe((product: ProductType) => {
          this.product = product;
          this.cartService.getCart().subscribe(
            (data: CartType | DefaultResponseType) => {
              if ((data as DefaultResponseType).error !== undefined) {
                throw new Error((data as DefaultResponseType).message);
              }
              const productInCart = (data as CartType).items.find(item => item.product.id === this.product.id);
              if (productInCart) {
                this.product.countInCart = productInCart.quantity;
                this.count = productInCart.quantity;
              } else {
                this.product.countInCart = 0;
              }
            }
          );
          if (this.authService.getIsLoggedIn()) {
            this.favoriteService.getFavorite()
              .pipe(takeUntil(this._destroy$)).subscribe({
              next: (data: DefaultResponseType | FavoriteType[]) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  const error = (data as DefaultResponseType).message;
                  throw new Error(error);
                }

                const products = data as FavoriteType[];
                const currentProductExists = products.find(item => item.id === this.product.id);
                if (currentProductExists) {
                  this.product.isInFavorite = true;
                }
              }
            });
          }

        });
    });

    this.isLogged = this.authService.getIsLoggedIn();
  }


  updateCount(value: number) {
    this.count = value;
    if (this.product.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .pipe(takeUntil(this._destroy$),
        ).subscribe((result: CartType | DefaultResponseType) => {
        if ((result as DefaultResponseType).error !== undefined) {
          throw new Error((result as DefaultResponseType).message);
        }
        const cartDataResponse = result as CartType;
        if (cartDataResponse) {
          this.product.countInCart = this.count;
        }
      });
    }
  }

  addToCart() {
    this.cartService.updateCart(this.product.id, this.count)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (result: CartType | DefaultResponseType) => {
          if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message);
          }
          const cartDataResponse = result as CartType;
          if (cartDataResponse) {
            this.product.countInCart = this.count;
            this.toastService.showToast('success', 'Успешно', `Добавлено ${this.count} шт. товара "${this.product.name}" в корзину.`);
          }

        },
        error: error => {
          this.toastService.showToast('error', 'Ошибка', 'Ошибка при добавлении товара в корзину.');
          console.error(error);
        }
      });

  }

  updateFavorite() {

    if (this.authService.getIsLoggedIn()) {
      if (this.product.isInFavorite) {
        this.favoriteService.deleteFavorite(this.product.id).pipe(takeUntil(this._destroy$)).subscribe((data: DefaultResponseType) => {
          if (data.error) {
            this.toastService.showToast('error', 'Ошибка', "Ошибка при удалении товара из избранное");
            throw new Error(data.message);
          }
          this.product.isInFavorite = false;
          this.toastService.showToast('success', 'Успешно', "Товар успешно удален из избранное");
        });
      } else {
        this.favoriteService.addFavorite(this.product.id).pipe(takeUntil(this._destroy$)).subscribe({
          next: (data: FavoriteType | DefaultResponseType) => {
            let error = '';
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
              throw new Error(error);
            }
            this.toastService.showToast('success',
              "Успешно", "Товар успешно добавлен в избранное");
            this.product.isInFavorite = true;
          },
          error: error => {
            console.error(error);
            this.toastService.showToast('error',
              "Ошибка", "Ошибка при добавлении товара в избранное");
          }
        });
      }
    } else {
      this.toastService.showToast('info', "Авторизуйтесь или зарегистрируйтесь", "Для того чтобы добавить товар в избранное нужно быть зарегистрированным", 3000);
      this.router.navigate(['/login']);
    }


  }

  removeFromCart() {
    this.cartService.updateCart(this.product.id, 0)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (result: CartType | DefaultResponseType) => {
          if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message);
          }
          const cartDataResponse = result as CartType;
          if (cartDataResponse) {
            this.toastService.showToast('success', 'Успешно', `Товар "${this.product.name}" в количестве ${this.count} успешно удален из корзины.`);
            this.product.countInCart = 0;
            this.count = 1;
          }

        },
        error: error => {
          this.toastService.showToast('error', 'Ошибка', 'Ошибка при удалении товара из корзины.');
          console.error(error);
        }
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  protected readonly environment = environment;
}
