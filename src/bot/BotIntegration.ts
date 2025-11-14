// src/bot/BotIntegration.ts
import { symbolService } from '../core/SymbolProtocolService';
import { SessionAdapter } from '../core/SessionAdapter';
import { eventBus, EventData } from '../core/EventBus';

export class BotIntegration {
    
    // Обработчик команды баланса с кэшированием
    static async handleBalanceCommand(userId: number): Promise<string> {
        await SessionAdapter.setUserState(userId, 'viewing_balance');
        
        const userData = await symbolService.getUserData(userId);
        const balance = userData.cachedBalance;
        
        if (!balance) {
            return `💰 Баланс недоступен`;
        }
        
        return `💰 Ваш баланс:
┌ Доступно: ${balance.available} TON
├ Заблокировано: ${balance.locked} TON  
└ Итого: ${balance.available + balance.locked} TON`;
    }

    // Обработчик команды топа символов
    static async handleTopSymbolsCommand(userId: number): Promise<string> {
        await SessionAdapter.setUserState(userId, 'viewing_top');
        
        const topSymbols = await symbolService.getTopSymbols();
        
        let response = `🏆 Топ символов:\n\n`;
        topSymbols.forEach((symbol: any, index: number) => {
            response += `${index + 1}. ${symbol.symbol} - ${symbol.price} TON\n`;
            response += `   Объем: ${symbol.volume} | Владельцев: ${symbol.ownerCount}\n\n`;
        });
        
        return response;
    }

    // Обработчик торговли
    static async handleTradeCommand(userId: number, symbol: string, action: 'buy' | 'sell', amount: number, price: number): Promise<string> {
        await SessionAdapter.setUserState(userId, 'trading');
        
        // Создаем ордер
        const order = {
            orderId: `order_${Date.now()}`,
            userId,
            symbol,
            type: action,
            amount,
            price,
            status: 'pending' as const
        };

        // Здесь будет логика матчинга ордеров
        // Пока заглушка
        if (action === 'buy') {
            return `✅ Ордер на покупку создан:
┌ Символ: ${symbol}
├ Количество: ${amount}
└ Цена: ${price} TON`;
        } else {
            return `✅ Ордер на продажу создан:
┌ Символ: ${symbol}  
├ Количество: ${amount}
└ Цена: ${price} TON`;
        }
    }

    // Инициализация пользователя при старте
    static async initializeUserSession(userId: number): Promise<void> {
        await symbolService.initializeUser(userId);
        console.log(`User ${userId} integrated with system services`);
    }

    // Обработчик выхода/очистки
    static async handleLogout(userId: number): Promise<string> {
        await SessionAdapter.clearUserSession(userId);
        return `👋 Сессия завершена. Данные очищены.`;
    }
}

// Интеграция уведомлений с ботом
eventBus.subscribe('SYMBOL_SOLD', async (event: EventData) => {
    // Здесь будет отправка уведомления через Telegram API
    console.log(`📨 Уведомление для пользователя ${event.userId}: Символ ${event.symbol} продан за ${event.price} TON`);
});

eventBus.subscribe('PRICE_ALERT', async (event: EventData) => {
    console.log(`📈 Price alert sent to user ${event.userId} for ${event.symbol} at ${event.price} TON`);
});
