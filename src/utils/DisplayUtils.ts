// src/utils/DisplayUtils.ts
export class DisplayUtils {
    
    // Генерация ASCII графика
    static generateSparkline(prices: number[], height: number = 4): string {
        if (prices.length === 0) return '▁▂▃▄▅▆▇█';
        
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const range = max - min || 1;
        
        const bars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
        return prices.map(price => {
            const normalized = (price - min) / range;
            const index = Math.floor(normalized * (bars.length - 1));
            return bars[index];
        }).join('');
    }

    // Форматирование цены с изменением
    static formatPriceChange(current: number, previous: number): string {
        const change = current - previous;
        const percent = previous > 0 ? (change / previous) * 100 : 0;
        const arrow = change >= 0 ? '↗️' : '↘️';
        const sign = change >= 0 ? '+' : '';
        return `${arrow}${sign}${percent.toFixed(1)}%`;
    }

    // Форматирование времени
    static formatTime(date: Date): string {
        return date.toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    }

    // Создание заголовка торговой площадки
    static createTradingHeader(symbol: string, currentPrice: number, changePercent: string): string {
        return `🎭 ${symbol} ${currentPrice.toFixed(2)} TON ${changePercent}`;
    }

    // Создание графика с данными
    static createChart(prices: number[]): string {
        return this.generateSparkline(prices, 6);
    }

    // Создание строки с последними ценами
    static createPriceHistory(currentPrice: number, previousPrices: number[]): string {
        const now = new Date();
        const prevTime = new Date(now.getTime() - 5 * 60 * 1000); // 5 минут назад
        
        return `${this.formatTime(now)} ⬆️${currentPrice.toFixed(2)} ${this.formatTime(prevTime)} ⬇️${previousPrices[0]?.toFixed(2) || currentPrice.toFixed(2)}`;
    }

    // Создание меню действий
    static createActionMenu(): string {
        return `ВЫБЕРИ ДЕЙСТВИЕ:
[КУПИТЬ] [ПРОДАТЬ]
[ДЕТАЛИ] [ГРАФИК]
[ОБНОВИТЬ] [МЕНЮ]`;
    }

    // Полный интерфейс торговой площадки
    static createTradingInterface(symbol: string, priceData: {
        current: number;
        previous: number;
        history: number[];
    }): string {
        const change = this.formatPriceChange(priceData.current, priceData.previous);
        const header = this.createTradingHeader(symbol, priceData.current, change);
        const chart = this.createChart(priceData.history);
        const prices = this.createPriceHistory(priceData.current, priceData.history.slice(-2));
        const menu = this.createActionMenu();

        return `${header}
${chart}

${prices}

${menu}`;
    }
}
