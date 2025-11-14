// src/services/MarketDataService.ts
import { DisplayUtils } from '../utils/DisplayUtils';

export interface SymbolData {
    symbol: string;
    currentPrice: number;
    previousPrice: number;
    priceHistory: number[];
    volume: number;
    owners: number;
    lastUpdate: Date;
    marketCap: number;
}

export class MarketDataService {
    private marketData: Map<string, SymbolData> = new Map();

    constructor() {
        this.initializeRealMarketData();
    }

    // Инициализация реальных данных (временно демо, потом из БД)
    private initializeRealMarketData(): void {
        // Эти данные будут получаться из базы данных транзакций
        const realData: SymbolData[] = [
            {
                symbol: '(^_^)',
                currentPrice: 5.24,
                previousPrice: 5.22,
                priceHistory: [5.20, 5.21, 5.22, 5.23, 5.24, 5.25, 5.24],
                volume: 1250,
                owners: 8,
                lastUpdate: new Date(),
                marketCap: 41.92
            },
            {
                symbol: '🚀',
                currentPrice: 15.75,
                previousPrice: 15.70,
                priceHistory: [15.60, 15.65, 15.70, 15.72, 15.75, 15.78, 15.75],
                volume: 850,
                owners: 5,
                lastUpdate: new Date(),
                marketCap: 78.75
            },
            {
                symbol: '🌟',
                currentPrice: 12.30,
                previousPrice: 12.25,
                priceHistory: [12.20, 12.22, 12.25, 12.28, 12.30, 12.32, 12.30],
                volume: 620,
                owners: 3,
                lastUpdate: new Date(),
                marketCap: 36.90
            }
        ];

        realData.forEach(data => {
            this.marketData.set(data.symbol, data);
        });
    }

    // Получение данных по символу
    getSymbolData(symbol: string): SymbolData | undefined {
        return this.marketData.get(symbol);
    }

    // Обновление цены на основе реальных сделок
    updatePriceFromTrade(symbol: string, tradePrice: number, tradeVolume: number): void {
        const data = this.marketData.get(symbol);
        if (!data) return;

        // Сохраняем предыдущую цену
        data.previousPrice = data.currentPrice;
        
        // Новая цена = средневзвешенная от последних сделок
        // В реальности здесь сложная логика из базы сделок
        data.currentPrice = tradePrice;
        
        // Обновляем историю
        data.priceHistory.push(tradePrice);
        if (data.priceHistory.length > 20) {
            data.priceHistory.shift();
        }
        
        // Обновляем объем
        data.volume += tradeVolume;
        data.lastUpdate = new Date();
        
        // Пересчитываем рыночную капитализацию
        data.marketCap = data.currentPrice * data.owners;
    }

    // Добавление новой сделки в систему
    addTrade(symbol: string, price: number, volume: number): void {
        this.updatePriceFromTrade(symbol, price, volume);
        
        // Здесь будет запись в базу данных транзакций
        console.log(`📊 Trade recorded: ${symbol} @ ${price} TON, volume: ${volume}`);
    }

    // Получение топа символов по объему
    getTopSymbols(limit: number = 5): SymbolData[] {
        return Array.from(this.marketData.values())
            .sort((a, b) => b.volume - a.volume)
            .slice(0, limit);
    }

    // Получение символов с наибольшим ростом
    getTopGainers(limit: number = 5): SymbolData[] {
        return Array.from(this.marketData.values())
            .filter(data => data.currentPrice > data.previousPrice)
            .sort((a, b) => {
                const changeA = (a.currentPrice - a.previousPrice) / a.previousPrice;
                const changeB = (b.currentPrice - b.previousPrice) / b.previousPrice;
                return changeB - changeA;
            })
            .slice(0, limit);
    }

    // Получение символов с наибольшим падением
    getTopLosers(limit: number = 5): SymbolData[] {
        return Array.from(this.marketData.values())
            .filter(data => data.currentPrice < data.previousPrice)
            .sort((a, b) => {
                const changeA = (a.currentPrice - a.previousPrice) / a.previousPrice;
                const changeB = (b.currentPrice - b.previousPrice) / b.previousPrice;
                return changeA - changeB;
            })
            .slice(0, limit);
    }

    // Генерация интерфейса торговой площадки
    generateTradingInterface(symbol: string): string {
        const data = this.getSymbolData(symbol);
        if (!data) {
            return `❌ Символ "${symbol}" не найден`;
        }

        return DisplayUtils.createTradingInterface(symbol, {
            current: data.currentPrice,
            previous: data.previousPrice,
            history: data.priceHistory
        });
    }

    // Получение детальной информации о символе
    getSymbolDetails(symbol: string): string {
        const data = this.getSymbolData(symbol);
        if (!data) {
            return `❌ Символ "${symbol}" не найден`;
        }

        const change = DisplayUtils.formatPriceChange(data.currentPrice, data.previousPrice);

        return `📊 ДЕТАЛИ СИМВОЛА ${symbol}
┌ Текущая цена: ${data.currentPrice} TON
├ Изменение: ${change}
├ Объем торгов: ${data.volume} TON
├ Рыночная кап: ${data.marketCap.toFixed(2)} TON
├ Владельцев: ${data.owners}
└ Обновлено: ${DisplayUtils.formatTime(data.lastUpdate)}

📈 Последние цены:
${data.priceHistory.slice(-8).map((price, i, arr) => {
    const minutesAgo = (arr.length - 1 - i) * 5;
    return `${minutesAgo} мин: ${price.toFixed(2)} TON`;
}).join('\n')}`;
    }

    // Поиск символов
    searchSymbols(query: string): SymbolData[] {
        const lowerQuery = query.toLowerCase();
        return Array.from(this.marketData.values())
            .filter(data => data.symbol.toLowerCase().includes(lowerQuery))
            .slice(0, 10);
    }

    // Получение статистики рынка
    getMarketStats(): { totalVolume: number; totalSymbols: number; averagePrice: number } {
        const symbols = Array.from(this.marketData.values());
        const totalVolume = symbols.reduce((sum, data) => sum + data.volume, 0);
        const totalValue = symbols.reduce((sum, data) => sum + data.marketCap, 0);
        const averagePrice = totalValue / symbols.length;

        return {
            totalVolume,
            totalSymbols: symbols.length,
            averagePrice: Number(averagePrice.toFixed(2))
        };
    }
}

export const marketDataService = new MarketDataService();
