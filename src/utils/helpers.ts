import { User } from '../models/User';

export function formatNumber(num: number, decimals: number = 2): string {
    return num.toFixed(decimals);
}

export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export async function getUser(telegramId: number): Promise<User> {
    return {
        telegramId,
        walletAddress: 'EQD...',
        balance: 150.25,
        portfolio: new Map([['(^_^)', 45], ['(⌐■_■)', 12]]),
        createdAt: new Date()
    };
}
