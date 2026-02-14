import {OrderStatus} from "./order-status.type";
import {DeliveryType} from "../order/delivery.enum";
import {PaymentType} from "../order/payment.enum";

export interface OrdersType {

  items?: {
    id: string,
    name: string,
    quantity: number,
    price: number,
    total: number
  }[],

  deliveryType: DeliveryType,
  firstName?: string,
  lastName?: string,
  fatherName?: string,
  phone?: string,
  paymentType: PaymentType,
  email: string,
  street?: string,
  house?: string,
  entrance?: string,
  apartment?: string,

  totalAmount?: number,
  comment?: string,
  status?: OrderStatus,


  statusRus?:string,
  color?: string,
}
