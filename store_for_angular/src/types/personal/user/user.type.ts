import {DeliveryType} from "../order/delivery.enum";
import {PaymentType} from "../order/payment.enum";

export interface User {

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
}
