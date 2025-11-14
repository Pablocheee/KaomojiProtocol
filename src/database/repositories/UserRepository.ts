// src/database/repositories/UserRepository.ts
import { BaseRepository } from './BaseRepository';
import { User } from '../entities/User';

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super(User);
    }

    async findOrCreate(userId: number, username?: string): Promise<User> {
        await this.initialize();
        
        let user = await this.repository.findOne({ where: { id: userId } });
        
        if (!user) {
            user = this.repository.create({
                id: userId,
                username: username,
                balance: 100, // Начальный баланс для демо
                lockedBalance: 0,
                currentState: 'idle'
            });
            await this.repository.save(user);
        }
        
        return user;
    }

    async updateBalance(userId: number, newBalance: number): Promise<void> {
        await this.initialize();
        await this.repository.update(userId, { balance: newBalance });
    }

    async updateState(userId: number, state: string): Promise<void> {
        await this.initialize();
        await this.repository.update(userId, { currentState: state });
    }
}

export const userRepository = new UserRepository();
