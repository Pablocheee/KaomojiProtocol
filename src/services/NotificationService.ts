import { Order } from '../models/Order';

export class NotificationService {
    async sendPriceAlert(userId: number, symbol: string, targetPrice: number, currentPrice: number) {
        const message = \🔔 \ достиг цены \ TON (цель: \ TON)\;
        console.log(\Notification to \: \\);
    }

    async sendOrderFilled(userId: number, order: Order) {
        const message = \✅ Ордер \ \ исполнен\n\ +
                       \Цена: \ TON\n\ +
                       \Количество: \\;
        console.log(\Order filled notification to \: \\);
    }
}
