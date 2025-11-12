import { CacheService } from './CacheService';
import { DexService } from './DexService';

export class PriceService {
    private cache = new CacheService();
    private dexService = new DexService();

    async getTokenPrice(symbol: string): Promise<{ price: number; change: number }> {
        const cacheKey = `price:${symbol}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached) return cached;

        const tokenAddress = this.getTokenAddress(symbol);
        const tokenPrice = await this.dexService.getTokenPrice(tokenAddress);
        const change = await this.getPriceChange24h(symbol);
        
        const result = { price: tokenPrice, change };
        this.cache.set(cacheKey, result, 10000);
        
        return result;
    }

    async getRecentTrades(symbol: string): Promise<{ time: string; price: number; direction: 'up' | 'down' }[]> {
        return [
            { time: '15:30', price: 5.28, direction: 'up' },
            { time: '15:25', price: 5.22, direction: 'down' }
        ];
    }

    async getPriceHistory(symbol: string, period: '1h' | '24h' | '7d'): Promise<number[]> {
        return [5.2, 5.15, 5.18, 5.22, 5.25, 5.28, 5.24, 5.26, 5.23, 5.24];
    }

    private getTokenAddress(symbol: string): string {
        const tokenMap: { [key: string]: string } = {
            '(^_^)': 'EQD123...',
            '(⌐■_■)': 'EQD456...',
            '(-_-)': 'EQD789...'
        };
        return tokenMap[symbol] || 'EQD000...';
    }

    private async getPriceChange24h(symbol: string): Promise<number> {
        const changes: { [key: string]: number } = {
            '(^_^)': 15,
            '(⌐■_■)': -5,
            '(-_-)': 2
        };
        return changes[symbol] || 0;
    }
}