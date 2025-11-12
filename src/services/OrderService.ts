import { Order } from '../models/Order';
import { DexService } from './DexService';
import { TONService } from './TONService';
import { generateId } from '../utils/helpers';
import { getUser } from '../utils/helpers';

export class OrderService {
    private orders = new Map<string, Order>();
    private userOrders = new Map<number, string[]>();

    async createOrder(userId: number, symbol: string, type: 'buy' | 'sell', amount: number, price: number): Promise<Order> {
        const order: Order = {
            id: generateId(),
            userId,
            symbol,
            type,
            amount,
            price,
            status: 'pending',
            createdAt: new Date()
        };

        this.orders.set(order.id, order);
        
        if (!this.userOrders.has(userId)) {
            this.userOrders.set(userId, []);
        }
        this.userOrders.get(userId)!.push(order.id);

        await this.executeOrder(order);
        return order;
    }

    private async executeOrder(order: Order) {
        try {
            const dexService = new DexService();
            const tonService = new TONService();
            
            const result = await dexService.createSwapOrder(
                order.type === 'buy' ? 'TON' : order.symbol,
                order.type === 'buy' ? order.symbol : 'TON',
                order.amount
            );

            if (result.success) {
                order.status = 'filled';
                order.filledAt = new Date();
            }
        } catch (error) {
            console.error('Order execution failed:', error);
            order.status = 'cancelled';
        }
    }

    async getUserOrders(userId: number): Promise<Order[]> {
        const orderIds = this.userOrders.get(userId) || [];
        return orderIds.map(id => this.orders.get(id)!).filter(Boolean);
    }

    async cancelOrder(orderId: string): Promise<boolean> {
        const order = this.orders.get(orderId);
        if (order && order.status === 'pending') {
            order.status = 'cancelled';
            return true;
        }
        return false;
    }
}
