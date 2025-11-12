// services/TONService.ts
import { Address, TonClient, fromNano, toNano } from '@ton/ton';
import { JettonMaster, JettonWallet } from '@ton/ton';

export class TONService {
    private client: TonClient;
    
    constructor() {
        this.client = new TonClient({
            endpoint: process.env.TON_RPC_URL || 'https://toncenter.com/api/v2/jsonRPC'
        });
    }

    // Получение баланса TON
    async getBalance(walletAddress: string): Promise<number> {
        try {
            const balance = await this.client.getBalance(Address.parse(walletAddress));
            return parseFloat(fromNano(balance));
        } catch (error) {
            console.error('Balance error:', error);
            return 0;
        }
    }

    // Получение баланса Jetton
    async getJettonBalance(walletAddress: string, jettonMaster: string): Promise<number> {
        try {
            const jettonMasterContract = this.client.open(JettonMaster.create(Address.parse(jettonMaster)));
            const jettonWalletAddress = await jettonMasterContract.getWalletAddress(Address.parse(walletAddress));
            const jettonWallet = this.client.open(JettonWallet.create(jettonWalletAddress));
            const balance = await jettonWallet.getBalance();
            return parseFloat(fromNano(balance));
        } catch (error) {
            console.error('Jetton balance error:', error);
            return 0;
        }
    }

    // Создание deeplink для Tonkeeper
    createTonkeeperDeepLink(toAddress: string, amount: number, jettonAddress?: string): string {
        const baseUrl = 'tonkeeper://transfer/';
        const params = new URLSearchParams({
            address: toAddress,
            amount: toNano(amount).toString(),
            ...(jettonAddress && { jetton: jettonAddress })
        });
        return `${baseUrl}?${params.toString()}`;
    }

    // Проверка транзакции
    async checkTransaction(hash: string): Promise<boolean> {
        try {
            const transaction = await this.client.getTransaction(Address.parse('EQD...'), hash);
            return !!transaction;
        } catch (error) {
            return false;
        }
    }
}