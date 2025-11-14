// src/core/SymbolProtocolService.ts
import { sessionManager } from './SessionManager';
import { SessionAdapter } from './SessionAdapter';
import { tradingEngine } from './TradingEngine';
import { cacheManager } from './CacheManager';
import { eventBus } from './EventBus';

export class SymbolProtocolService {
    
    // Инициализация пользовательской сессии
    async initializeUser(userId: number): Promise<void> {
        await SessionAdapter.setUserState(userId, 'idle');
        console.log(`User ${userId} session initialized`);
    }

    // Получение топа символов с кэшированием
    async getTopSymbols(): Promise<any[]> {
        // Пробуем получить из кэша
        const cached = await cacheManager.getTopSymbols();
        if (cached) {
            console.log('Cache hit for top symbols');
            return cached;
        }

        // Если нет в кэше - вычисляем (заглушка)
        console.log('Cache miss for top symbols, calculating...');
        const topSymbols = await this.calculateTopSymbols();
        
        // Сохраняем в кэш
        await cacheManager.cacheTopSymbols(topSymbols);
        return topSymbols;
    }

    // Исполнение сделки с полным циклом событий
    async executeSafeTrade(buyOrder: any, sellOrder: any): Promise<boolean> {
        try {
            const success = await tradingEngine.executeTrade(buyOrder, sellOrder);
            
            if (success) {
                // Отправляем уведомления
                await eventBus.notifySymbolSold(sellOrder.userId, sellOrder.symbol, sellOrder.price);
                await eventBus.notifySymbolBought(buyOrder.userId, buyOrder.symbol, buyOrder.price);
                
                // Инвалидируем кэш
                await cacheManager.invalidateTopSymbols();
                await cacheManager.invalidateUserBalance(buyOrder.userId);
                await cacheManager.invalidateUserBalance(sellOrder.userId);
                
                console.log('Trade executed successfully with notifications');
            }
            
            return success;
        } catch (error) {
            console.error('Trade execution failed:', error);
            return false;
        }
    }

    // Обновление баланса пользователя с кэшированием
    async updateUserBalance(userId: number, available: number, locked: number): Promise<void> {
        await SessionAdapter.updateUserBalance(userId, available, locked);
        await cacheManager.cacheUserBalance(userId, { available, locked });
        
        // Отправляем событие об изменении баланса
        await eventBus.publish({
            type: 'BALANCE_CHANGED',
            userId,
            amount: available,
            timestamp: new Date()
        });
    }

    // Получение данных пользователя (сессия + кэш)
    async getUserData(userId: number): Promise<any> {
        const session = await SessionAdapter.getUserSession(userId);
        const cachedBalance = await cacheManager.getUserBalance(userId);
        
        return {
            session,
            cachedBalance: cachedBalance || session.balanceData
        };
    }

    // Заглушка для расчета топа символов
    private async calculateTopSymbols(): Promise<any[]> {
        // В реальности здесь будет агрегация из базы данных
        return [
            { symbol: '🚀', volume: 1000, price: 15, ownerCount: 5 },
            { symbol: '🌟', volume: 800, price: 12, ownerCount: 3 },
            { symbol: '💎', volume: 600, price: 20, ownerCount: 2 }
        ];
    }

    // Статистика системы
    async getSystemStats(): Promise<any> {
        const activeSessions = await sessionManager.getActiveSessions();
        const cacheStats = await cacheManager.getCacheStats();
        
        return {
            activeUsers: activeSessions.length,
            cacheStats,
            timestamp: new Date()
        };
    }
}

export const symbolService = new SymbolProtocolService();
