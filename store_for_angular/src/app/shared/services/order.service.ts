import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/common/DefaultResponse.type";
import {OrderType} from "../../../types/personal/order/order.type";
import {OrdersType} from "../../../types/personal/orders/orders.type";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) {
  }

  getOrders(): Observable<OrdersType[] | DefaultResponseType> {
    return this.http.get<OrdersType[]  | DefaultResponseType>(environment.api + '/orders', );
  }

  createOrder(params:OrderType ): Observable<OrderType | DefaultResponseType> {
    return this.http.post<OrderType | DefaultResponseType>(environment.api + '/orders', params, {withCredentials: true});
  }

}
