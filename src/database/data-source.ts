// src/database/data-source.ts
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { NFTSymbol } from './entities/NFTSymbol';
import { Trade } from './entities/Trade';
import { Order } from './entities/Order';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'symbol_protocol.sqlite',
    synchronize: true,
    logging: false,
    entities: [User, NFTSymbol, Trade, Order],
    subscribers: [],
    migrations: [],
});
