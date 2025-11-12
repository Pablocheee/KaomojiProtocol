// services/DexService.ts
interface SwapQuote {
    fromToken: string;
    toToken: string;
    amountIn: number;
    amountOut: number;
    minAmountOut: number;
    route: any[];
}

export class DexService {
    private stonFiApi = 'https://api.ston.fi/v1';
    private dedustApi = 'https://api.dedust.io/v1';

    // Получение цены токена
    async getTokenPrice(tokenAddress: string): Promise<number> {
        try {
            const response = await fetch(`${this.stonFiApi}/assets/${tokenAddress}`);
            const data = await response.json();
            return data.price_usdt || data.price;
        } catch (error) {
            return this.getPriceFromDedust(tokenAddress);
        }
    }

    // Получение котировки свопа
    async getSwapQuote(fromToken: string, toToken: string, amount: number): Promise<SwapQuote> {
        const response = await fetch(`${this.stonFiApi}/quote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                offer_address: fromToken,
                ask_address: toToken,
                units: amount * 1000000000, // nano units
                slippage_tolerance: 0.01 // 1%
            })
        });
        
        const data = await response.json();
        return {
            fromToken,
            toToken,
            amountIn: amount,
            amountOut: data.ask_amount / 1000000000,
            minAmountOut: data.min_ask_amount / 1000000000,
            route: data.route
        };
    }

    // Создание свопа через Tonkeeper
    createSwapDeeplink(quote: SwapQuote): string {
        return `tonkeeper://swap?` + new URLSearchParams({
            from: quote.fromToken,
            to: quote.toToken,
            amount: quote.amountIn.toString(),
            minAmount: quote.minAmountOut.toString()
        }).toString();
    }
}