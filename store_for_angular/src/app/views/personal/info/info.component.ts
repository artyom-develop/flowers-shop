import {Component, OnInit} from '@angular/core';
import {DeliveryType} from "../../../../types/personal/order/delivery.enum";
import {PaymentType} from "../../../../types/personal/order/payment.enum";
import {CartType} from "../../../../types/cart/product-cart.type";
import {Subject, takeUntil} from "rxjs";
import {CartService} from "../../../shared/services/cart.service";
import {ToastService} from "../../../shared/services/toast.service";
import {Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/common/DefaultResponse.type";
import {UserService} from "../../../shared/services/user.service";
import {User} from "../../../../types/personal/user/user.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  DeliveryType = DeliveryType;
  deliveryType: DeliveryType = DeliveryType.delivery;
  PaymentType = PaymentType;
  cart: CartType | null = null;
  count: number | null = null;

  private _destroyed$: Subject<void> = new Subject<void>();

  constructor(private cartService: CartService, private toastService: ToastService, private router: Router, private fb: FormBuilder,
              private userService: UserService,) {

  }

  toggleDeliveryType(value: DeliveryType): void {
    this.deliveryType = value;

    this.userInfoForm.markAsDirty();
  }


  userInfoForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    fatherName: [''],
    phone: [''],
    paymentType: [PaymentType.cashToCourier],
    email: ['', [Validators.required, Validators.email]],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],

  });

  ngOnInit(): void {

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
          };
          this.userInfoForm.setValue(paramToUpdate);
          this.deliveryType = dataUser.deliveryType ? dataUser.deliveryType : this.DeliveryType.self;
        },
        error: (err: HttpErrorResponse) => {
          if (err.error && err.error.hasOwnProperty("message")) {
            this.toastService.showToast('error', "Ошибка", err.error.message);
            this.router.navigate(['/']);
          } else {
            this.toastService.showToast('error', "Ошибка", "Ошибка при получении данных пользователя");
            this.router.navigate(['/']);
          }
        }
      }
    );

  }

  updateUserInfo() {
    if (this.userInfoForm.valid) {
      const paramObject: User = {
        email: this.userInfoForm.value.email ? this.userInfoForm.value.email : '',
        deliveryType: this.deliveryType,
        paymentType: this.userInfoForm.value.paymentType ? this.userInfoForm.value.paymentType : this.PaymentType.cashToCourier,
      };

      if (this.userInfoForm.value.firstName) {
        paramObject.firstName = this.userInfoForm.value.firstName;
      }
      if (this.userInfoForm.value.lastName) {
        paramObject.lastName = this.userInfoForm.value.lastName;
      }
      if (this.userInfoForm.value.fatherName) {
        paramObject.fatherName = this.userInfoForm.value.fatherName;
      }

      if (this.userInfoForm.value.phone) {
        paramObject.phone = this.userInfoForm.value.phone;
      }
      if (this.userInfoForm.value.street) {
        paramObject.street = this.userInfoForm.value.street;
      }
      if (this.userInfoForm.value.house) {
        paramObject.house = this.userInfoForm.value.house;
      }
      if (this.userInfoForm.value.apartment) {
        paramObject.apartment = this.userInfoForm.value.apartment;
      }
      if (this.userInfoForm.value.entrance) {
        paramObject.entrance = this.userInfoForm.value.entrance;
      }


      this.userService.updateUser(paramObject)
        .pipe(takeUntil(this._destroyed$)).subscribe(
        {
          next: ((data: DefaultResponseType) => {
            if (data.error) {
              this.toastService.showToast("error", "Ошибка", data.message);
            } else {
              this.toastService.showToast("success", "Успешно", "Вы успешно обновили данные для профиля",);
              this.userInfoForm.markAsPristine();
            }
          }),
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.hasOwnProperty("message")) {
              this.toastService.showToast('error', "Ошибка", errorResponse.error.message);
            } else {
              this.toastService.showToast('error', "Ошибка", "Возникла ошибка при редактировании профиля");
            }
            console.error(errorResponse);
          }

        }
      );
    }

  }
}
