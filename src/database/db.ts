import { User } from '../models/User';
import { Token } from '../models/Token';

export class Database {
    private users = new Map<number, User>();
    private tokens = new Map<string, Token>();

    async saveUser(user: User): Promise<void> {
        this.users.set(user.telegramId, user);
    }

    async getUser(telegramId: number): Promise<User | null> {
        return this.users.get(telegramId) || null;
    }

    async saveToken(token: Token): Promise<void> {
        this.tokens.set(token.symbol, token);
    }

    async getToken(symbol: string): Promise<Token | null> {
        return this.tokens.get(symbol) || null;
    }

    async getAllTokens(): Promise<Token[]> {
        return Array.from(this.tokens.values());
    }
}
