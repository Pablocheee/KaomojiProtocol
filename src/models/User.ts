export interface User {
    telegramId: number;
    walletAddress: string;
    balance: number;
    portfolio: Map<string, number>;
    createdAt: Date;
}
