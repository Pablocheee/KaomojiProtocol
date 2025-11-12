export class ChartService {
    generateSparkline(prices: number[]): string {
        if (prices.length === 0) return '';
        
        const bars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        
        if (min === max) return bars[4].repeat(prices.length);
        
        const range = max - min;
        
        return prices.map(price => {
            const index = Math.floor(((price - min) / range) * (bars.length - 1));
            return bars[Math.max(0, Math.min(bars.length - 1, index))];
        }).join('');
    }

    formatPriceChange(change: number): string {
        return change >= 0 ? `↗️${change}%` : `↘️${Math.abs(change)}%`;
    }
}