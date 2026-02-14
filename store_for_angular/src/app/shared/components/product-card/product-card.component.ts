import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ProductType} from '../../../../types/product/ProductType.type';
import {environment} from '../../../../environments/environment';
import {CartService} from '../../services/cart.service';
import {Subject, takeUntil} from 'rxjs';
import {ToastService} from '../../services/toast.service';
import {CartType} from '../../../../types/cart/product-cart.type';
import {DefaultResponseType} from '../../../../types/common/DefaultResponse.type';
import {FavoriteType} from '../../../../types/personal/favorite/favorite.type';
import {AuthService} from '../../../core/auth/auth.service';
import {Router} from '@angular/router';
import {FavoriteService} from '../../services/favorite.service';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input() product!: ProductType;
  @Input() countInCart: number | undefined = 0;
  count: number = 1;
  @Input() isShowLight!: boolean;
  isLogged: boolean = false;
  private _destroyed$ = new Subject<void>();
  protected readonly environment = environment;

  constructor(
    private cartService: CartService,
    private toastService: ToastService,
    private authService: AuthService,
    private router: Router,
    private favoriteService: FavoriteService
  ) {}


  ngOnInit(): void {
    this.isLogged = this.authService.getIsLoggedIn();
    if (this.countInCart && this.countInCart > 1) {
      this.count = this.countInCart;
    }
  }

  navigate() {
    if (this.isShowLight) {
      this.router.navigate([`/detail/${this.product.url}`]);
    }
  }

  updateCount(value: number) {
    this.count = value;
    if (this.countInCart) {
      this.cartService
        .updateCart(this.product.id, this.count)
        .pipe(takeUntil(this._destroyed$))
        .subscribe((result: CartType | DefaultResponseType) => {
          if ((result as DefaultResponseType).error !== undefined) {
            const error = (result as DefaultResponseType).message;
            throw new Error(error);
          }

          const cartResponse = result as CartType;
          if (cartResponse) {
            this.countInCart = this.count;
          }
        });
    }
  }

  updateFavorite() {
    if (this.authService.getIsLoggedIn()) {
      if (this.product.isInFavorite) {
        this.favoriteService
          .deleteFavorite(this.product.id)
          .pipe(takeUntil(this._destroyed$))
          .subscribe((data: DefaultResponseType) => {
            if (data.error) {
              this.toastService.showToast('error', 'Ошибка', 'Ошибка при удалении товара из избранное');
              throw new Error(data.message);
            }
            this.product.isInFavorite = false;
            this.toastService.showToast('success', 'Успешно', 'Товар успешно удален из избранное');
          });
      } else {
        this.favoriteService
          .addFavorite(this.product.id)
          .pipe(takeUntil(this._destroyed$))
          .subscribe({
            next: (data: FavoriteType | DefaultResponseType) => {
              let error = '';
              if ((data as DefaultResponseType).error !== undefined) {
                error = (data as DefaultResponseType).message;
                throw new Error(error);
              }
              this.toastService.showToast('success', 'Успешно', 'Товар успешно добавлен в избранное');
              this.product.isInFavorite = true;
            },
            error: (error) => {
              console.error(error);
              this.toastService.showToast('error', 'Ошибка', 'Ошибка при добавлении товара в избранное');
            },
          });
      }
    } else {
      this.toastService.showToast(
        'info',
        'Авторизуйтесь или зарегистрируйтесь',
        'Для того чтобы добавить товар в избранное нужно быть зарегистрированным',
        3000
      );
      this.router.navigate(['/login']);
    }
  }

  addToCart() {
    this.cartService
      .updateCart(this.product.id, this.count)
      .pipe(takeUntil(this._destroyed$))
      .subscribe({
        next: (result: CartType | DefaultResponseType) => {
          if ((result as DefaultResponseType).error !== undefined) {
            const error = (result as DefaultResponseType).message;
            throw new Error(error);
          }

          const cartResponse = result as CartType;
          if (cartResponse) {
            this.countInCart = this.count;

            this.toastService.showToast('success', 'Успешно', `Добавлено ${this.count} шт. товара "${this.product.name}" в корзину.`);
          }
        },
        error: (error) => {
          this.toastService.showToast('error', 'Ошибка', 'Ошибка при добавлении товара в корзину.');
          console.error(error);
        },
      });
  }

  removeFromCart() {
    this.cartService
      .updateCart(this.product.id, 0)
      .pipe(takeUntil(this._destroyed$))
      .subscribe({
        next: (result: CartType | DefaultResponseType) => {
          if ((result as DefaultResponseType).error !== undefined) {
            const error = (result as DefaultResponseType).message;
            throw new Error(error);
          }
          const cartResponse = result as CartType;
          if (cartResponse) {
            this.toastService.showToast(
              'success',
              'Успешно',
              `Товар "${this.product.name}" в количестве ${this.count} успешно удален из корзины.`
            );
            this.countInCart = 0;
            this.count = 1;
          }
        },
        error: (error) => {
          this.toastService.showToast('error', 'Ошибка', 'Ошибка при удалении товара из корзины.');
          console.error(error);
        },
      });
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
