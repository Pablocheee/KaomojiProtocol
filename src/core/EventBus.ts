// src/core/EventBus.ts
import { sessionManager } from './SessionManager';

export type EventType = 
    | 'SYMBOL_SOLD' 
    | 'SYMBOL_BOUGHT' 
    | 'PRICE_ALERT' 
    | 'BALANCE_CHANGED'
    | 'NEW_LISTING';

export interface EventData {
    type: EventType;
    userId: number;
    symbol?: string;
    price?: number;
    amount?: number;
    timestamp: Date;
}

export class EventBus {
    private listeners: Map<EventType, Function[]> = new Map();

    // Подписка на события
    subscribe(eventType: EventType, callback: Function): void {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        this.listeners.get(eventType)!.push(callback);
    }

    // Публикация события
    async publish(event: EventData): Promise<void> {
        const listeners = this.listeners.get(event.type) || [];
        
        for (const listener of listeners) {
            try {
                await listener(event);
            } catch (error) {
                console.error('Event listener error:', error);
            }
        }
    }

    // Отправка уведомления о продаже символа
    async notifySymbolSold(sellerId: number, symbol: string, price: number): Promise<void> {
        await this.publish({
            type: 'SYMBOL_SOLD',
            userId: sellerId,
            symbol,
            price,
            timestamp: new Date()
        });
    }

    // Отправка уведомления о покупке символа
    async notifySymbolBought(buyerId: number, symbol: string, price: number): Promise<void> {
        await this.publish({
            type: 'SYMBOL_BOUGHT',
            userId: buyerId,
            symbol,
            price,
            timestamp: new Date()
        });
    }

    // Уведомление о достижении целевой цены
    async notifyPriceAlert(userId: number, symbol: string, targetPrice: number): Promise<void> {
        await this.publish({
            type: 'PRICE_ALERT',
            userId,
            symbol,
            price: targetPrice,
            timestamp: new Date()
        });
    }
}

export const eventBus = new EventBus();

// Обработчик для Telegram уведомлений
eventBus.subscribe('SYMBOL_SOLD', async (event: EventData) => {
    const session = await sessionManager.getSession(event.userId);
    // Здесь будет интеграция с Telegram API для отправки уведомления
    console.log(`🔔 Symbol ${event.symbol} sold for ${event.price} TON to user ${event.userId}`);
});

eventBus.subscribe('SYMBOL_BOUGHT', async (event: EventData) => {
    console.log(`🛒 User ${event.userId} bought symbol ${event.symbol} for ${event.price} TON`);
});

eventBus.subscribe('PRICE_ALERT', async (event: EventData) => {
    console.log(`📈 Price alert for ${event.symbol}: reached ${event.price} TON`);
});
