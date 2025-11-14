// src/database/entities/Order.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { NFTSymbol } from './NFTSymbol';

export enum OrderType {
    BUY = 'buy',
    SELL = 'sell'
}

export enum OrderStatus {
    PENDING = 'pending',
    FILLED = 'filled',
    CANCELLED = 'cancelled',
    PARTIAL = 'partial'
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User, user => user.orders)
    user!: User;

    @ManyToOne(() => NFTSymbol, symbol => symbol.orders)
    symbol!: NFTSymbol;

    @Column({ type: 'text' })
    type!: string; // 'buy' or 'sell'

    @Column('decimal', { precision: 10, scale: 2 })
    price!: number;

    @Column({ default: 1 })
    amount!: number;

    @Column({ default: 1 })
    filledAmount!: number;

    @Column({ type: 'text', default: 'pending' })
    status!: string; // 'pending', 'filled', 'cancelled', 'partial'

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
