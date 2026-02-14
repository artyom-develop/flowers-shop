import {Component, OnDestroy, OnInit} from '@angular/core';
import {trackById, trackByIndex} from "../../../shared/utils/track-by";
import {CartService} from "../../../shared/services/cart.service";
import {Subject, takeUntil} from "rxjs";
import {CartType} from "../../../../types/cart/product-cart.type";
import {environment} from "../../../../environments/environment";
import {DefaultResponseType} from "../../../../types/common/DefaultResponse.type";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cart: CartType | null = null;
  count: number | null = null;
  totalAmount: number = 0;
  totalCount: number = 0;
  private _destroyed$: Subject<void> = new Subject<void>();

  constructor(private cartService: CartService) {
  }


  ngOnInit(): void {
    this.cartService.getCart()
      .pipe(takeUntil(this._destroyed$))
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.cart = data as CartType;
        this.calculateTotal();
      });
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }


  changeCount(id: string, value: number) {

    if (this.cart) {
      this.cartService.updateCart(id, value)
        .pipe(takeUntil(this._destroyed$),
        ).subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        const cartResponse = data as CartType;
        if (cartResponse) {
          this.cart = data as CartType;
          this.calculateTotal();
        }
      });
    }
  }


  calculateTotal() {
    this.totalAmount = 0;
    this.totalCount = 0;
    if (this.cart) {
      this.cart.items.forEach(item => {
        this.totalAmount += item.product.price * item.quantity;
        this.totalCount += item.quantity;
      });
    }
  }

  protected readonly trackById = trackById;
  protected readonly trackByIndex = trackByIndex;
  protected readonly environment = environment;
}
