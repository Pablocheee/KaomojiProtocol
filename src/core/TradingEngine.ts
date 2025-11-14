// src/core/TradingEngine.ts
import { sessionManager } from './SessionManager';

export interface TradeOrder {
    orderId: string;
    userId: number;
    symbol: string;
    type: 'buy' | 'sell';
    amount: number;
    price: number;
    status: 'pending' | 'filled' | 'cancelled';
}

export class TradingEngine {
    private executingTrades = new Set<string>(); // Для предотвращения дублирования

    // Атомарное исполнение сделки
    async executeTrade(buyOrder: TradeOrder, sellOrder: TradeOrder): Promise<boolean> {
        const tradeKey = `trade:${buyOrder.orderId}:${sellOrder.orderId}`;
        
        // Проверяем что сделка уже не исполняется
        if (this.executingTrades.has(tradeKey)) {
            return false;
        }

        this.executingTrades.add(tradeKey);

        try {
            // Имитация транзакционной базы данных
            // В реальности здесь будет работа с БД
            await this.atomicTradeExecution(buyOrder, sellOrder);
            return true;
        } catch (error) {
            console.error('Trade execution failed:', error);
            return false;
        } finally {
            this.executingTrades.delete(tradeKey);
        }
    }

    private async atomicTradeExecution(buyOrder: TradeOrder, sellOrder: TradeOrder): Promise<void> {
        // Проверка балансов
        const buyerSession = await sessionManager.getSession(buyOrder.userId);
        const sellerSession = await sessionManager.getSession(sellOrder.userId);

        if (!buyerSession.balanceData || buyerSession.balanceData.available < buyOrder.amount * buyOrder.price) {
            throw new Error('Insufficient buyer balance');
        }

        if (!sellerSession.symbolData?.ownedSymbols.includes(sellOrder.symbol)) {
            throw new Error('Seller does not own the symbol');
        }

        // Атомарные обновления (в реальности через транзакцию БД)
        await this.updateBalances(buyOrder, sellOrder);
        await this.updateSymbolOwnership(buyOrder, sellOrder);
        await this.markOrdersFilled(buyOrder, sellOrder);
    }

    private async updateBalances(buyOrder: TradeOrder, sellOrder: TradeOrder): Promise<void> {
        const tradeAmount = buyOrder.amount * buyOrder.price;
        
        // Обновляем баланс покупателя
        const buyerSession = await sessionManager.getSession(buyOrder.userId);
        if (buyerSession.balanceData) {
            buyerSession.balanceData.available -= tradeAmount;
            await sessionManager.updateBalanceData(buyOrder.userId, buyerSession.balanceData);
        }

        // Обновляем баланс продавца
        const sellerSession = await sessionManager.getSession(sellOrder.userId);
        if (sellerSession.balanceData) {
            sellerSession.balanceData.available += tradeAmount;
            await sessionManager.updateBalanceData(sellOrder.userId, sellerSession.balanceData);
        }
    }

    private async updateSymbolOwnership(buyOrder: TradeOrder, sellOrder: TradeOrder): Promise<void> {
        // Убираем символ у продавца
        const sellerSession = await sessionManager.getSession(sellOrder.userId);
        if (sellerSession.symbolData) {
            sellerSession.symbolData.ownedSymbols = sellerSession.symbolData.ownedSymbols.filter(
                s => s !== sellOrder.symbol
            );
            await sessionManager.updateSymbolData(sellOrder.userId, sellerSession.symbolData);
        }

        // Добавляем символ покупателю
        const buyerSession = await sessionManager.getSession(buyOrder.userId);
        if (buyerSession.symbolData) {
            buyerSession.symbolData.ownedSymbols.push(sellOrder.symbol);
            await sessionManager.updateSymbolData(buyOrder.userId, buyerSession.symbolData);
        }
    }

    private async markOrdersFilled(buyOrder: TradeOrder, sellOrder: TradeOrder): Promise<void> {
        buyOrder.status = 'filled';
        sellOrder.status = 'filled';
        // Здесь будет сохранение в базу данных
        console.log('Orders filled:', buyOrder.orderId, sellOrder.orderId);
    }
}

export const tradingEngine = new TradingEngine();
