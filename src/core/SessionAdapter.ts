// src/core/SessionAdapter.ts
import { sessionManager, UserSession } from './SessionManager';

export class SessionAdapter {
    
    // Получить сессию пользователя с автоматическим созданием если нет
    static async getUserSession(userId: number): Promise<UserSession> {
        return await sessionManager.getSession(userId);
    }

    // Обновить состояние пользователя (например: 'trading', 'viewing_symbols', 'idle')
    static async setUserState(userId: number, state: string): Promise<void> {
        await sessionManager.updateSessionState(userId, state);
    }

    // Обновить данные символов пользователя
    static async updateUserSymbols(userId: number, ownedSymbols: string[], listedSymbols: string[]): Promise<void> {
        await sessionManager.updateSymbolData(userId, {
            ownedSymbols,
            listedSymbols
        });
    }

    // Обновить баланс пользователя
    static async updateUserBalance(userId: number, available: number, locked: number): Promise<void> {
        await sessionManager.updateBalanceData(userId, {
            available,
            locked
        });
    }

    // Очистить сессию (при logout или ошибках)
    static async clearUserSession(userId: number): Promise<void> {
        await sessionManager.invalidateSession(userId);
    }

    // Получить текущее состояние пользователя
    static async getCurrentState(userId: number): Promise<string> {
        const session = await sessionManager.getSession(userId);
        return session.currentState;
    }
}
