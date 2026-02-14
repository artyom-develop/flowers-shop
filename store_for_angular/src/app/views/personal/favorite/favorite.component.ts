import {Component, OnDestroy, OnInit} from '@angular/core';
import {trackByIndex} from "../../../shared/utils/track-by";
import {environment} from "../../../../environments/environment";
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/personal/favorite/favorite.type";
import {DefaultResponseType} from "../../../../types/common/DefaultResponse.type";
import {Router} from "@angular/router";
import {ToastService} from "../../../shared/services/toast.service";
import {Subject, takeUntil} from "rxjs";
import {CartType} from "../../../../types/cart/product-cart.type";
import {CartService} from "../../../shared/services/cart.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit, OnDestroy {
  products: FavoriteType[] = [];
  private _destroy$: Subject<void> = new Subject<void>();


  constructor(private favoriteService: FavoriteService, private router: Router, private toastService: ToastService, private cartService: CartService) {
  }

  ngOnInit(): void {
    this.cartService.getCart().pipe(takeUntil(this._destroy$)).subscribe({
      next: (cart: DefaultResponseType | CartType) => {
        if ((cart as DefaultResponseType).error !== undefined) {
          const error = (cart as DefaultResponseType).message;
          throw new Error(error);
        }
        const cartResponse = cart as CartType;
        this.updateProducts(cartResponse);
      },
      error: (err: HttpErrorResponse) => {
        if (err.error.hasOwnProperty("message")) {
          this.toastService.showToast('error', 'Ошибка', err.error.message);
        } else {
          this.toastService.showToast('error', 'Ошибка', 'Ошибка при получении товаров из корзины корзины.');
        }
        this.router.navigate(['/']);
        console.error(err);
      }
    });

  }

  updateProducts(cart: CartType) {
    let cartItems = cart?.items;
    let favorites: FavoriteType[] = [];
    this.favoriteService.getFavorite()
      .pipe(takeUntil(this._destroy$)).subscribe({
      next: (data: DefaultResponseType | FavoriteType[]) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        favorites = data as FavoriteType[];
        if (favorites) {
          this.products = favorites.map((favorite) => {
            const foundProduct = cartItems.find(item => item.product.id === favorite.id);
            let objectFavorite: FavoriteType = {
              ...favorite
            };
            if (foundProduct) {
              if (foundProduct.quantity) {
                objectFavorite.quantity = foundProduct.quantity;
              }
            }
            return objectFavorite;
          });
        }

      },
      error: (err: Error) => {
        console.error(err);
        this.toastService.showToast('error',
          'Ошибка', 'Ошибка при получении товаров "избранное"');
        this.router.navigate(['/']);
      }
    });
  }

  removeFavoriteProduct(id: string): void {
    this.favoriteService.deleteFavorite(id).pipe(takeUntil(this._destroy$)).subscribe((data: DefaultResponseType) => {
      if (data.error) {
        this.toastService.showToast('error', 'Ошибка', 'Ошибка при удалении товара из избранное');
        throw new Error(data.message);
      }
      this.products = this.products.filter(product => product.id !== id);
      this.toastService.showToast('success', 'Успешно', "Продукт успешно удален из избранное");
    });
  }

  removeFromCart(product: FavoriteType, count: number): void {
    this.cartService
      .updateCart(product.id, 0)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (result: CartType | DefaultResponseType) => {
          if ((result as DefaultResponseType).error !== undefined) {
            const error = (result as DefaultResponseType).message;
            throw new Error(error);
          }
          const cartResponse = result as CartType;
          if (cartResponse) {
            this.updateProducts(cartResponse);
            this.toastService.showToast(
              'success',
              'Успешно',
              `Товар "${product.name}" в количестве ${count} шт. успешно удален из корзины.`
            );
          }
        },
        error: (error) => {
          this.toastService.showToast('error', 'Ошибка', 'Ошибка при удалении товара из корзины.');
          console.error(error);
        },
      });
  }

  updateCount(product: FavoriteType, count: number) {
    if (product.quantity) {
      this.cartService.updateCart(product.id, count)
        .pipe(takeUntil(this._destroy$),
        ).subscribe((result: CartType | DefaultResponseType) => {
        if ((result as DefaultResponseType).error !== undefined) {
          throw new Error((result as DefaultResponseType).message);
        }
        const cartDataResponse = result as CartType;
        if (cartDataResponse) {
          this.updateProducts(cartDataResponse);
          product.quantity = count;
        }

      });
    }
  }

  addToCart(product: FavoriteType, count: number) {
    this.cartService.updateCart(product.id, count)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (result: CartType | DefaultResponseType) => {
          if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message);
          }
          const cartDataResponse = result as CartType;
          if (cartDataResponse) {
            product.quantity = count;
            this.updateProducts(cartDataResponse);
            this.toastService.showToast('success', 'Успешно', `Добавлено ${count} шт. товара "${product.name}" в корзину.`);

          }

        },
        error: error => {
          this.toastService.showToast('error', 'Ошибка', 'Ошибка при добавлении товара в корзину.');
          console.error(error);
        }
      });

  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  protected readonly trackByIndex = trackByIndex;
  protected readonly environment = environment;
}
