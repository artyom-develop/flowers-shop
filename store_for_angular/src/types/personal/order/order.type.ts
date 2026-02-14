import {DeliveryType} from "./delivery.enum";
import {PaymentType} from "./payment.enum";

export type OrderType = {
  deliveryType: DeliveryType,
  firstName: string,
  lastName: string,
  fatherName?: string,
  phone: string,
  paymentType: PaymentType,
  email: string,
  street?: string,
  house?: string,
  entrance?: string,
  apartment?: string,
  comment?: string,
  items?: [
    {
      id: string,
      quantity: number,
      price: number,
      total: number
    }
  ]
}
