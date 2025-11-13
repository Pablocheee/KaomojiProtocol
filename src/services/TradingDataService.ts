// src/services/TradingDataService.ts
export interface SymbolData {
    symbol: string;
    price: number;
    change24h: number;
    volume: number;
    trades: number;
    priceHistory: number[];
    lastUpdate: Date;
}

export class TradingDataService {
    private symbols = new Map<string, SymbolData>();
    
    constructor() {
        this.initializeSymbols();
        setInterval(() => this.updatePrices(), 10000);
    }
    
    private initializeSymbols() {
        const baseSymbols = [
            { symbol: '(^_^)', basePrice: 5.24 },
            { symbol: '🚀', basePrice: 0.15 },
            { symbol: '💎', basePrice: 0.08 },
            { symbol: '🌟', basePrice: 0.22 }
        ];
        
        baseSymbols.forEach(({ symbol, basePrice }) => {
            this.symbols.set(symbol, {
                symbol,
                price: basePrice,
                change24h: this.randomChange(-20, 30),
                volume: Math.random() * 1000 + 100,
                trades: Math.floor(Math.random() * 100) + 10,
                priceHistory: this.generatePriceHistory(basePrice),
                lastUpdate: new Date()
            });
        });
    }
    
    private randomChange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    private generatePriceHistory(basePrice: number): number[] {
        const history = [];
        let currentPrice = basePrice;
        
        for (let i = 0; i < 20; i++) {
            const change = (Math.random() - 0.5) * 0.1;
            currentPrice = Math.max(0.01, currentPrice * (1 + change));
            history.unshift(Number(currentPrice.toFixed(3)));
        }
        
        return history;
    }
    
    private updatePrices() {
        this.symbols.forEach((data, symbol) => {
            const change = (Math.random() - 0.5) * 0.02;
            const newPrice = Math.max(0.01, data.price * (1 + change));
            
            data.price = Number(newPrice.toFixed(3));
            data.change24h = this.randomChange(-25, 35);
            data.volume += Math.random() * 10 - 5;
            data.trades += Math.floor(Math.random() * 5);
            data.priceHistory.pop();
            data.priceHistory.unshift(data.price);
            data.lastUpdate = new Date();
        });
    }
    
    getSymbolData(symbol: string): SymbolData | undefined {
        return this.symbols.get(symbol);
    }
    
    getAllSymbols(): SymbolData[] {
        return Array.from(this.symbols.values());
    }
    
    generateChart(priceHistory: number[]): string {
        const max = Math.max(...priceHistory);
        const min = Math.min(...priceHistory);
        const range = max - min;
        
        if (range === 0) return '▁▂▃▄▅▆▇█'.repeat(3);
        
        const chartBars = '▁▂▃▄▅▆▇█';
        let chart = '';
        
        priceHistory.slice(0, 12).forEach(price => {
            const normalized = (price - min) / range;
            const barIndex = Math.floor(normalized * (chartBars.length - 1));
            chart += chartBars[barIndex];
        });
        
        return chart;
    }
    
    getRecentTrades(): string[] {
        const now = new Date();
        const trades = [];
        
        for (let i = 0; i < 6; i++) {
            const minutesAgo = 5 + i * 5;
            const time = new Date(now.getTime() - minutesAgo * 60000);
            const priceChange = Math.random() > 0.5 ? '⬆️' : '⬇️';
            const price = 5.20 + Math.random() * 0.15;
            
            trades.push(this.formatTime(time) + ' ' + priceChange + price.toFixed(2));
        }
        
        return trades;
    }
    
    private formatTime(date: Date): string {
        return date.getHours().toString().padStart(2, '0') + ':' + 
               date.getMinutes().toString().padStart(2, '0');
    }
}
