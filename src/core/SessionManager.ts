// src/core/SessionManager.ts
import { InMemoryCache } from './InMemoryCache';
import { userRepository } from '../database/repositories/UserRepository';

export interface UserSession {
    userId: number;
    currentState: string;
    symbolData?: {
        ownedSymbols: string[];
        listedSymbols: string[];
    };
    balanceData?: {
        available: number;
        locked: number;
    };
    lastActivity: Date;
}

export class SessionManager {
    private cache: InMemoryCache;
    private readonly SESSION_TTL = 30 * 60; // 30 минут

    constructor() {
        this.cache = new InMemoryCache();
    }

    async getSession(userId: number): Promise<UserSession> {
        const key = `session:${userId}`;
        const cached = await this.cache.get(key);
        
        if (cached) {
            return cached;
        }

        // Создаем новую сессию с данными из базы
        const user = await userRepository.findOrCreate(userId);
        
        const newSession: UserSession = {
            userId,
            currentState: user.currentState,
            balanceData: {
                available: user.balance,
                locked: user.lockedBalance
            },
            lastActivity: new Date()
        };

        await this.saveSession(userId, newSession);
        return newSession;
    }

    async saveSession(userId: number, session: UserSession): Promise<void> {
        const key = `session:${userId}`;
        session.lastActivity = new Date();
        
        // Обновляем состояние пользователя в базе
        await userRepository.updateState(userId, session.currentState);
        
        await this.cache.set(key, session, this.SESSION_TTL);
    }

    async updateSessionState(userId: number, newState: string): Promise<void> {
        const session = await this.getSession(userId);
        session.currentState = newState;
        await this.saveSession(userId, session);
    }

    async updateSymbolData(userId: number, symbolData: UserSession['symbolData']): Promise<void> {
        const session = await this.getSession(userId);
        session.symbolData = symbolData;
        await this.saveSession(userId, session);
    }

    async updateBalanceData(userId: number, balanceData: UserSession['balanceData']): Promise<void> {
        const session = await this.getSession(userId);
        session.balanceData = balanceData;
        
        // Обновляем баланс в базе
        if (balanceData) {
            await userRepository.updateBalance(userId, balanceData.available);
        }
        
        await this.saveSession(userId, session);
    }

    async invalidateSession(userId: number): Promise<void> {
        const key = `session:${userId}`;
        await this.cache.del(key);
    }

    // Для дебаггинга
    async getActiveSessions(): Promise<string[]> {
        const keys = await this.cache.keys('session:*');
        return keys;
    }
}

// Singleton instance
export const sessionManager = new SessionManager();
