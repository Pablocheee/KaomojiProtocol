// src/database/entities/Trade.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { NFTSymbol } from './NFTSymbol';

@Entity('trades')
export class Trade {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => NFTSymbol, symbol => symbol.trades)
    symbol: NFTSymbol;

    @ManyToOne(() => User, user => user.buyTrades)
    buyer: User;

    @ManyToOne(() => User, user => user.sellTrades)
    seller: User;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ default: 1 })
    amount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    totalValue: number;

    @Column('decimal', { precision: 10, scale: 2 })
    royaltyFee: number;

    @Column('decimal', { precision: 10, scale: 2 })
    protocolFee: number;

    @CreateDateColumn()
    tradedAt: Date;
}
