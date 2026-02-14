import {Component, OnInit} from '@angular/core';
import {CartService} from '../../../shared/services/cart.service';
import {DefaultResponseType} from '../../../../types/common/DefaultResponse.type';
import {CartType} from '../../../../types/cart/product-cart.type';
import {Subject, takeUntil} from 'rxjs';
import {ToastService} from "../../../shared/services/toast.service";
import {Router} from "@angular/router";
import {DeliveryType} from "../../../../types/personal/order/delivery.enum";
import {FormBuilder, Validators} from "@angular/forms";
import {PaymentType} from "../../../../types/personal/order/payment.enum";
import {OrderService} from "../../../shared/services/order.service";
import {OrderType} from "../../../../types/personal/order/order.type";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../../core/auth/auth.service";
import {UserService} from "../../../shared/services/user.service";
import {User} from "../../../../types/personal/user/user.type";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  DeliveryType = DeliveryType;
  PaymentType = PaymentType;
  deliveryType: DeliveryType = DeliveryType.delivery;
  cart: CartType | null = null;
  count: number | null = null;
  totalAmount: number = 0;
  totalCount: number = 0;
  visible: boolean = false;
  private _destroyed$: Subject<void> = new Subject<void>();

  constructor(private cartService: CartService, private toastService: ToastService, private router: Router, private fb: FormBuilder, private orderService: OrderService,
              private authService: AuthService,
              private userService: UserService,) {
    this.updateDeliveryTypeValidation();
  }

  toggleDeliveryType(value: DeliveryType): void {
    this.deliveryType = value;
    this.updateDeliveryTypeValidation();

  }

  updateDeliveryTypeValidation() {
    if (this.deliveryType === DeliveryType.delivery) {
      this.orderForm.get('street')?.setValidators([Validators.required]);
      this.orderForm.get('house')?.setValidators([Validators.required]);
    } else {
      this.orderForm.get('street')?.removeValidators([Validators.required]);
      this.orderForm.get('house')?.removeValidators([Validators.required]);

      this.orderForm.get('street')?.setValue('');
      this.orderForm.get('house')?.setValue('');
      this.orderForm.get('entrance')?.setValue('');
      this.orderForm.get('apartment')?.setValue('');

    }

    this.orderForm.get('street')?.updateValueAndValidity();
    this.orderForm.get('house')?.updateValueAndValidity();
  }

  orderForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    fatherName: [''],
    phone: ['', Validators.required],
    paymentType: [PaymentType.cashToCourier],
    email: ['', [Validators.required, Validators.email]],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],
    comment: [''],
  });

  ngOnInit(): void {
    this.cartService
      .getCart()
      .pipe(takeUntil(this._destroyed$))
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.cart = data as CartType;
        if (this.cart && this.cart.items.length === 0) {
          this.toastService.showToast('info', "Корзина пуста", 'Ваша корзина пуста, добавьте товары в корзину чтобы перейти на страницу оформления заказа!', 4000);
          this.router.navigate(['/catalog']);
        }
        this.calculateTotal();
        if (this.authService.getIsLoggedIn()) {
          this.userService.getUserInfo().subscribe(
            {
              next: (data: User | DefaultResponseType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  throw new Error((data as DefaultResponseType).message);
                }
                const dataUser = data as User;

                const paramToUpdate = {
                  firstName: dataUser.firstName ? dataUser.firstName : '',
                  lastName: dataUser.lastName ? dataUser.lastName : '',
                  fatherName: dataUser.fatherName ? dataUser.fatherName : '',
                  phone: dataUser.phone ? dataUser.phone : '',
                  paymentType: dataUser.paymentType ? dataUser.paymentType : PaymentType.cashToCourier,
                  email: dataUser.email ? dataUser.email : '',
                  street: dataUser.street ? dataUser.street : '',
                  house: dataUser.house ? dataUser.house : '',
                  entrance: dataUser.entrance ? dataUser.entrance : '',
                  apartment: dataUser.apartment ? dataUser.apartment : '',
                  comment: '',
                };
                this.orderForm.setValue(paramToUpdate);
                this.deliveryType = dataUser.deliveryType ? dataUser.deliveryType : this.DeliveryType.self;
                this.updateDeliveryTypeValidation();
              },
              error: (err: HttpErrorResponse) => {
                if (err.error && err.error.hasOwnProperty("message")) {
                  this.toastService.showToast('error', "Ошибка", err.error.message);
                } else {
                  this.toastService.showToast('error', "Ошибка", "Ошибка при получении данных пользователя");
                }
              }
            }
          );
        }
      });
  }

  calculateTotal() {
    this.totalAmount = 0;
    this.totalCount = 0;
    if (this.cart) {
      this.cart.items.forEach((item) => {
        this.totalAmount += item.product.price * item.quantity;
        this.totalCount += item.quantity;
      });
    }
  }

  createOrder() {

    if (this.orderForm.valid
      && this.orderForm.value.firstName
      && this.orderForm.value.lastName
      && this.orderForm.value.phone
      && this.orderForm.value.paymentType
      && this.orderForm.value.email
    ) {
      const paramsObject: OrderType = {
        deliveryType: this.deliveryType,
        firstName: this.orderForm.value.firstName,
        lastName: this.orderForm.value.lastName,
        phone: this.orderForm.value.phone,
        paymentType: this.orderForm.value.paymentType,
        email: this.orderForm.value.email,
      };
      if (this.deliveryType === DeliveryType.delivery) {
        if (this.orderForm.value.street) {
          paramsObject.street = this.orderForm.value.street;
        }
        if (this.orderForm.value.entrance) {
          paramsObject.entrance = this.orderForm.value.entrance;
        }
        if (this.orderForm.value.house) {
          paramsObject.house = this.orderForm.value.house;
        }
        if (this.orderForm.value.apartment) {
          paramsObject.apartment = this.orderForm.value.apartment;
        }
      }
      if (this.orderForm.value.comment) {
        paramsObject.comment = this.orderForm.value.comment;
      }
      this.orderService.createOrder(paramsObject)
        .pipe(takeUntil(this._destroyed$))
        .subscribe({
          next: (data: OrderType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message);
            }
            const orderResult = data as OrderType;
            if (orderResult) {
              this.openDialog();
              this.cartService.setCount(0);
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.hasOwnProperty("message")) {
              this.toastService.showToast('error', "Ошибка", errorResponse.error.message);
            } else {
              this.toastService.showToast('error', "Ошибка", "Возникла ошибка при создании заказа");
            }
            console.error(errorResponse);
          }
        });

    } else {
      this.orderForm.markAllAsTouched();
      this.toastService.showToast('info', "Заполните все поля", "Обязательно заполните все выделенные поля, чтобы создать заказ!", 3000);
    }
  }


  openDialog() {
    this.visible = true;
  }

  closeModal() {
    this.visible = false;
    if (this.authService.getIsLoggedIn()) {
      this.router.navigate(['/orders']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
