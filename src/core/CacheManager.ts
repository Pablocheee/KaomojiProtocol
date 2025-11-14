// src/core/CacheManager.ts
import { InMemoryCache } from './InMemoryCache';

export interface TopSymbol {
    symbol: string;
    volume: number;
    price: number;
    ownerCount: number;
}

export class CacheManager {
    private cache: InMemoryCache;
    private readonly CACHE_TTL = 5 * 60; // 5 минут

    constructor() {
        this.cache = new InMemoryCache();
    }

    // Кэширование топа символов
    async cacheTopSymbols(symbols: TopSymbol[]): Promise<void> {
        await this.cache.set('top_symbols', symbols, this.CACHE_TTL);
    }

    // Получение топа символов из кэша
    async getTopSymbols(): Promise<TopSymbol[] | null> {
        return await this.cache.get('top_symbols');
    }

    // Кэширование баланса пользователя
    async cacheUserBalance(userId: number, balance: { available: number; locked: number }): Promise<void> {
        const key = `user_balance:${userId}`;
        await this.cache.set(key, balance, this.CACHE_TTL);
    }

    // Получение баланса из кэша
    async getUserBalance(userId: number): Promise<{ available: number; locked: number } | null> {
        return await this.cache.get(`user_balance:${userId}`);
    }

    // Инвалидация кэша при изменениях
    async invalidateTopSymbols(): Promise<void> {
        await this.cache.del('top_symbols');
    }

    async invalidateUserBalance(userId: number): Promise<void> {
        await this.cache.del(`user_balance:${userId}`);
    }

    // Статистика кэша для мониторинга
    async getCacheStats(): Promise<{ hits: number; misses: number; keys: number }> {
        const keys = await this.cache.dbsize();
        return {
            hits: 0,
            misses: 0,
            keys
        };
    }
}

export const cacheManager = new CacheManager();
