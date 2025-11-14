// src/blockchain/payment-service.ts
import { tonService } from './ton-service';

export class PaymentService {
    private protocolWallet = 'UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY';

    // Проверка входящих платежей
    async checkIncomingPayment(sender: string, expectedAmount: number, memo?: string): Promise<boolean> {
        try {
            // В реальности здесь будет проверка транзакций в блокчейне
            // Пока заглушка - всегда возвращаем true для тестов
            console.log(`Checking payment: ${sender} -> ${this.protocolWallet}, amount: ${expectedAmount} TON, memo: ${memo}`);
            return true;
        } catch (error) {
            console.error('Error checking payment:', error);
            return false;
        }
    }

    // Создание ссылки для оплаты
    createPaymentLink(amount: number, memo?: string): string {
        const baseUrl = `ton://transfer/${this.protocolWallet}`;
        const params = new URLSearchParams({
            amount: amount.toString(),
            text: memo || 'Symbol Protocol Payment'
        });
        return `${baseUrl}?${params.toString()}`;
    }

    // Получение баланса протокола
    async getProtocolBalance(): Promise<number> {
        return await tonService.getWalletBalance(this.protocolWallet);
    }

    // Комиссия за создание символа
    async processSymbolCreationFee(userWallet: string, symbol: string): Promise<boolean> {
        const creationFee = 1.0; // 1 TON
        const memo = `Create symbol: ${symbol}`;
        
        return await this.checkIncomingPayment(userWallet, creationFee, memo);
    }

    // Комиссия за торговлю
    async processTradeFee(buyerWallet: string, amount: number, symbol: string): Promise<boolean> {
        const tradeFee = amount * 0.01; // 1%
        const memo = `Trade fee: ${symbol}`;
        
        return await this.checkIncomingPayment(buyerWallet, tradeFee, memo);
    }
}

export const paymentService = new PaymentService();
