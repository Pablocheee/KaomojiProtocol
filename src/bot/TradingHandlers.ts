// src/bot/TradingHandlers.ts
import { nftSymbolExchange } from '../services/NFTSymbolExchange';
import { SessionAdapter } from '../core/SessionAdapter';
import { symbolService } from '../core/SymbolProtocolService';
import { DisplayUtils } from '../utils/DisplayUtils';

export class TradingHandlers {
    
    // Обработчик главной торговой площадки
    static async handleTradingPlatform(userId: number, symbol: string = '(^_^)'): Promise<string> {
        await SessionAdapter.setUserState(userId, 'viewing_market');
        
        return await nftSymbolExchange.generateTradingInterface(symbol);
    }

    // Обработчик деталей символа
    static async handleSymbolDetails(userId: number, symbol: string): Promise<string> {
        await SessionAdapter.setUserState(userId, 'viewing_details');
        
        return await nftSymbolExchange.getSymbolDetails(symbol);
    }

    // Обработчик стакана цен
    static async handleOrderBook(userId: number, symbol: string): Promise<string> {
        await SessionAdapter.setUserState(userId, 'viewing_orderbook');
        
        return nftSymbolExchange.getOrderBookDisplay(symbol);
    }

    // Обработчик покупки
    static async handleBuyIntent(userId: number, symbol: string): Promise<string> {
        await SessionAdapter.setUserState(userId, 'buying_symbol');
        
        const symbolData = await nftSymbolExchange.getSymbol(symbol);
        if (!symbolData) {
            return `❌ Символ "${symbol}" не найден`;
        }

        if (!symbolData.isListed) {
            return `❌ Символ "${symbol}" не выставлен на продажу`;
        }

        return `🛒 ПОКУПКА СИМВОЛА ${symbol}

Текущая цена: ${symbolData.currentPrice} TON
Владелец: ${symbolData.owner.toString().slice(0, 8)}...

Для покупки введите:
/купить ${symbol} [цена]

Или выберите из стакана цен:
/стакан ${symbol}`;
    }

    // Обработчик продажи
    static async handleSellIntent(userId: number, symbol: string): Promise<string> {
        await SessionAdapter.setUserState(userId, 'selling_symbol');
        
        const symbolData = await nftSymbolExchange.getSymbol(symbol);
        if (!symbolData) {
            return `❌ Символ "${symbol}" не найден`;
        }

        // Проверка владения
        // В реальности здесь будет проверка через блокчейн
        const userSession = await SessionAdapter.getUserSession(userId);
        const userSymbols = userSession.symbolData?.ownedSymbols || [];
        
        if (!userSymbols.includes(symbol)) {
            return `❌ Вы не владеете символом "${symbol}"`;
        }

        return `💰 ПРОДАЖА СИМВОЛА ${symbol}

Текущая рыночная цена: ${symbolData.currentPrice} TON
Ваша цена продажи: ${symbolData.listingPrice || symbolData.currentPrice} TON

Для продажи введите:
/продать ${symbol} [цена]

Или посмотрите стакан:
/стакан ${symbol}`;
    }

    // Обработчик топа символов
    static async handleTopSymbols(userId: number): Promise<string> {
        await SessionAdapter.setUserState(userId, 'viewing_top');
        
        const topSymbols = await nftSymbolExchange.getTopSymbols(5);
        
        let response = `🏆 ТОП NFT СИМВОЛОВ ПО ОБЪЕМУ:\n\n`;
        
        topSymbols.forEach((symbol: any, index: number) => {
            const change = DisplayUtils.formatPriceChange(symbol.currentPrice, symbol.previousPrice);
            response += `${index + 1}. ${symbol.symbol} - ${symbol.currentPrice} TON ${change}\n`;
            response += `   Объем: ${symbol.totalVolume} TON | Сделок: ${symbol.transactionCount}\n\n`;
        });

        return response;
    }

    // Обработчик обновления цены
    static async handlePriceUpdate(userId: number, symbol: string): Promise<string> {
        await SessionAdapter.setUserState(userId, 'refreshing_price');
        
        // В реальности здесь будет запрос к актуальным данным
        // Пока возвращаем текущий интерфейс
        return await nftSymbolExchange.generateTradingInterface(symbol);
    }

    // Обработчик поиска символов
    static async handleSymbolSearch(userId: number, query: string): Promise<string> {
        await SessionAdapter.setUserState(userId, 'searching_symbols');
        
        // Временная реализация поиска
        const symbolData = await nftSymbolExchange.getSymbol(query);
        if (!symbolData) {
            return `🔍 По запросу "${query}" ничего не найдено`;
        }

        return `🔍 РЕЗУЛЬТАТ ПОИСКА:
${symbolData.symbol} - ${symbolData.currentPrice} TON
Владелец: ${symbolData.owner.toString().slice(0, 8)}...
Сделок: ${symbolData.transactionCount}

/детали ${symbolData.symbol} - Подробнее`;
    }
}
