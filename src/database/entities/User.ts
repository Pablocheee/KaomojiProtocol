// src/database/entities/User.ts
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { NFTSymbol } from './NFTSymbol';
import { Trade } from './Trade';
import { Order } from './Order';

@Entity('users')
export class User {
    @PrimaryColumn()
    id: number; // Telegram user ID

    @Column({ nullable: true })
    username: string;

    @Column({ default: 0 })
    balance: number; // TON balance

    @Column({ default: 0 })
    lockedBalance: number; // Locked in orders

    @Column({ default: 'idle' })
    currentState: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => NFTSymbol, symbol => symbol.owner)
    ownedSymbols: NFTSymbol[];

    @OneToMany(() => NFTSymbol, symbol => symbol.creator)
    createdSymbols: NFTSymbol[];

    @OneToMany(() => Trade, trade => trade.buyer)
    buyTrades: Trade[];

    @OneToMany(() => Trade, trade => trade.seller)
    sellTrades: Trade[];

    @OneToMany(() => Order, order => order.user)
    orders: Order[];
}
