import { getUser } from '../utils/helpers';

export class AuthService {
    private authorizedUsers = new Set<number>();

    async authorizeUser(telegramId: number): Promise<boolean> {
        this.authorizedUsers.add(telegramId);
        return true;
    }

    isUserAuthorized(telegramId: number): boolean {
        return this.authorizedUsers.has(telegramId);
    }

    async validateTransaction(userId: number, amount: number): Promise<boolean> {
        const user = await getUser(userId);
        return amount > 0 && amount <= user.balance * 0.1;
    }
}
