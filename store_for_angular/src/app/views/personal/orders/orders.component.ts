import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { DefaultResponseType } from '../../../../types/common/DefaultResponse.type';
import { OrdersType } from '../../../../types/personal/orders/orders.type';
import { ToastService } from '../../../shared/services/toast.service';
import { trackById, trackByIndex } from '../../../shared/utils/track-by';
import { OrderStatusUtil } from '../../../shared/utils/order-status.util';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  private _destroy$: Subject<void> = new Subject<void>();

  orders: OrdersType[] = [];

  isShow: boolean = false;

  constructor(private orderService: OrderService, private router: Router, private toastService: ToastService) {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  ngOnInit(): void {
    this.orderService.getOrders()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (data: DefaultResponseType | OrdersType[]) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          this.orders = (data as OrdersType[]).map((item) => {
            const status = OrderStatusUtil.getStatusAndColor(item.status);
            item.statusRus = status.name;
            item.color = status.color;
            return item;
          });
          this.isShow = true;
        },
        error: (err: HttpErrorResponse) => {
          if (err.error && err.error.hasOwnProperty('message')) {
            this.toastService.showToast('error', 'Ошибка', err.error.message);
            this.router.navigate(['/']);
          } else {
            this.toastService.showToast('error', 'Ошибка', 'Ошибка при получении заказов пользователя');
            this.router.navigate(['/']);
          }
        },
      });
  }

  protected readonly trackByIndex = trackByIndex;

  protected readonly trackById = trackById;

  protected readonly OrderStatusUtil = OrderStatusUtil;
}
