import {OrderStatus} from "../../../types/personal/orders/order-status.type";

export class OrderStatusUtil {

  static getStatusAndColor(status: OrderStatus | undefined | null): { name: string, color: string } {
    let name = 'Новый';
    let color = '#456f49';

    switch (status) {
      case OrderStatus.delivery:
        name = 'Доставка';
        break;
      case OrderStatus.cancelled:
        name = 'Отменен';
        color = "#FF7575";
        break;
      case OrderStatus.pending:
        name = 'Обработка';
        break;
      case OrderStatus.success:
        name = 'Выполнен';
        color = "#b6d5b9";
        break;
    }

    return {
      name,
      color
    };
  }
}
