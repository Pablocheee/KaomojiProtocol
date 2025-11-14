// src/database/repositories/BaseRepository.ts
import { AppDataSource } from '../data-source';
import { Repository, ObjectLiteral } from 'typeorm';

export class BaseRepository<T extends ObjectLiteral> {
    protected repository: Repository<T>;

    constructor(entity: new () => T) {
        this.repository = AppDataSource.getRepository(entity);
    }

    async initialize(): Promise<void> {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
    }
}
