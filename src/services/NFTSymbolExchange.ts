// src/services/NFTSymbolExchange.ts
import { DisplayUtils } from '../utils/DisplayUtils';
import { nftSymbolRepository } from '../database/repositories/NFTSymbolRepository';
import { userRepository } from '../database/repositories/UserRepository';
import { tonService } from '../blockchain/ton-service';
import { paymentService } from '../blockchain/payment-service';

export class NFTSymbolExchange {
    
    // Создание нового символа с оплатой
    async createNewSymbol(symbol: string, creatorUserId: number, creatorWallet: string): Promise<string> {
        try {
            // Проверяем уникальность символа
            const existing = await nftSymbolRepository.findBySymbol(symbol);
            if (existing) {
                return `❌ Символ "${symbol}" уже существует`;
            }

            // Проверяем оплату
            const paymentVerified = await paymentService.processSymbolCreationFee(creatorWallet, symbol);
            if (!paymentVerified) {
                const paymentLink = paymentService.createPaymentLink(1.0, `Create: ${symbol}`);
                return `❌ Оплата не подтверждена

Для создания символа оплатите 1.0 TON:
${paymentLink}

После оплаты повторите команду:
/создать ${symbol}`;
            }

            // Получаем пользователя
            const creator = await userRepository.findOrCreate(creatorUserId);
            
            // Создаем NFT в блокчейне
            const nftAddress = await tonService.createSymbolNFT(symbol, creatorWallet);
            
            // Сохраняем в базу данных
            await nftSymbolRepository.createSymbol(symbol, creator, 1.00);
            
            return `✅ Символ "${symbol}" успешно создан!
💎 Оплата 1.0 TON подтверждена
📍 Адрес NFT: ${nftAddress}
🎨 Начальная цена: 1.00 TON
📊 Роялти создателя: 5%`;

        } catch (error) {
            console.error('Error creating symbol:', error);
            return `❌ Ошибка при создании символа: ${error.message}`;
        }
    }

    // Покупка символа с комиссией протокола
    async buySymbol(symbol: string, buyerUserId: number, buyerWallet: string, price: number): Promise<string> {
        try {
            const symbolData = await nftSymbolRepository.findBySymbol(symbol);
            if (!symbolData) {
                return `❌ Символ "${symbol}" не найден`;
            }

            if (!symbolData.isListed) {
                return `❌ Символ "${symbol}" не выставлен на продажу`;
            }

            // Проверяем баланс покупателя
            const buyerBalance = await tonService.getWalletBalance(buyerWallet);
            if (buyerBalance < price) {
                return `❌ Недостаточно средств: ${buyerBalance} TON < ${price} TON`;
            }

            // Проверяем оплату комиссии протокола
            const feeVerified = await paymentService.processTradeFee(buyerWallet, price, symbol);
            if (!feeVerified) {
                const feeAmount = price * 0.01;
                const paymentLink = paymentService.createPaymentLink(feeAmount, `Trade fee: ${symbol}`);
                return `❌ Комиссия не оплачена

Для покупки оплатите комиссию ${feeAmount.toFixed(3)} TON:
${paymentLink}

После оплаты повторите покупку:
/купить ${symbol} ${price}`;
            }

            // Проверяем владение продавца
            const sellerOwnership = await tonService.verifySymbolOwnership(
                symbolData.owner.id.toString(), 
                symbol
            );
            
            if (!sellerOwnership) {
                return `❌ Продавец не владеет символом "${symbol}"`;
            }

            // Выполняем перевод в блокчейне
            const transferSuccess = await tonService.transferSymbol(
                symbol, 
                symbolData.owner.id.toString(), 
                buyerWallet
            );

            if (!transferSuccess) {
                return `❌ Ошибка при переводе символа в блокчейне`;
            }

            // Обновляем данные в базе
            const buyer = await userRepository.findOrCreate(buyerUserId);
            symbolData.owner = buyer;
            symbolData.currentPrice = price;
            symbolData.isListed = false;
            await nftSymbolRepository.saveSymbol(symbolData);

            return `✅ Символ "${symbol}" успешно куплен!
💰 Цена: ${price} TON
💎 Комиссия протокола: ${(price * 0.01).toFixed(3)} TON оплачена
👤 Новый владелец: ${buyerWallet.slice(0, 8)}...
🎉 Сделка завершена!`;

        } catch (error) {
            console.error('Error buying symbol:', error);
            return `❌ Ошибка при покупке символа: ${error.message}`;
        }
    }

    // Остальные методы без изменений...
    async generateTradingInterface(symbol: string): Promise<string> {
        const symbolData = await nftSymbolRepository.findBySymbol(symbol);
        if (!symbolData) {
            return `❌ Символ "${symbol}" не найден на бирже`;
        }

        let priceHistory: number[] = [];
        if (typeof symbolData.priceHistory === 'string') {
            priceHistory = JSON.parse(symbolData.priceHistory);
        } else if (Array.isArray(symbolData.priceHistory)) {
            priceHistory = symbolData.priceHistory;
        }

        return DisplayUtils.createTradingInterface(symbol, {
            current: symbolData.currentPrice,
            previous: symbolData.previousPrice,
            history: priceHistory.slice(-10)
        });
    }

    async getSymbolDetails(symbol: string): Promise<string> {
        const symbolData = await nftSymbolRepository.findBySymbol(symbol);
        if (!symbolData) {
            return `❌ Символ "${symbol}" не найден`;
        }

        let priceHistory: number[] = [];
        if (typeof symbolData.priceHistory === 'string') {
            priceHistory = JSON.parse(symbolData.priceHistory);
        } else if (Array.isArray(symbolData.priceHistory)) {
            priceHistory = symbolData.priceHistory;
        }

        const change = DisplayUtils.formatPriceChange(symbolData.currentPrice, symbolData.previousPrice);

        return `📊 ДЕТАЛИ NFT СИМВОЛА ${symbol}
┌ Текущая цена: ${symbolData.currentPrice} TON
├ Изменение: ${change}
├ Общий объем: ${symbolData.totalVolume} TON
├ Количество сделок: ${symbolData.transactionCount}
├ Владелец: ${symbolData.owner.id}
├ Создатель: ${symbolData.creator.id} (${symbolData.royalty}% роялти)
├ Создан: ${symbolData.createdAt.toLocaleDateString('ru-RU')}
└ Обновлено: ${DisplayUtils.formatTime(symbolData.updatedAt)}

📈 История цен:
${priceHistory.slice(-8).map((price, i, arr) => {
    const minutesAgo = (arr.length - 1 - i) * 5;
    return `${minutesAgo} мин: ${price.toFixed(2)} TON`;
}).join('\n')}`;
    }

    async getTopSymbols(limit: number = 5): Promise<any[]> {
        const symbols = await nftSymbolRepository.getTopSymbols(limit);
        return symbols.map(symbol => ({
            symbol: symbol.symbol,
            currentPrice: symbol.currentPrice,
            previousPrice: symbol.previousPrice,
            totalVolume: symbol.totalVolume,
            transactionCount: symbol.transactionCount
        }));
    }

    getOrderBookDisplay(symbol: string): string {
        let display = `📊 СТАКАН ЦЕН ${symbol}\n\n`;
        display += `🟢 ПОКУПКА (BIDS):\n`;
        display += `1. 5.10 TON × 1\n`;
        display += `2. 5.05 TON × 1\n`;
        display += `3. 5.00 TON × 2\n`;
        display += `\n🔴 ПРОДАЖА (ASKS):\n`;
        display += `1. 5.30 TON × 1\n`;
        display += `2. 5.35 TON × 1\n`;
        display += `3. 5.40 TON × 1\n`;
        return display;
    }

    async getSymbol(symbol: string): Promise<any> {
        const symbolData = await nftSymbolRepository.findBySymbol(symbol);
        if (!symbolData) return null;

        let priceHistory: number[] = [];
        if (typeof symbolData.priceHistory === 'string') {
            priceHistory = JSON.parse(symbolData.priceHistory);
        } else if (Array.isArray(symbolData.priceHistory)) {
            priceHistory = symbolData.priceHistory;
        }

        return {
            symbol: symbolData.symbol,
            currentPrice: symbolData.currentPrice,
            previousPrice: symbolData.previousPrice,
            priceHistory: priceHistory,
            totalVolume: symbolData.totalVolume,
            transactionCount: symbolData.transactionCount,
            owner: symbolData.owner.id,
            creator: symbolData.creator.id,
            royalty: symbolData.royalty,
            isListed: symbolData.isListed,
            listingPrice: symbolData.listingPrice,
            lastTradeAt: symbolData.updatedAt
        };
    }
}

export const nftSymbolExchange = new NFTSymbolExchange();
