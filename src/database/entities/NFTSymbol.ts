// src/database/entities/NFTSymbol.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { Trade } from './Trade';
import { Order } from './Order';

@Entity('nft_symbols')
export class NFTSymbol {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    symbol!: string;

    @ManyToOne(() => User, user => user.createdSymbols)
    creator!: User;

    @ManyToOne(() => User, user => user.ownedSymbols)
    owner!: User;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    currentPrice!: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    previousPrice!: number;

    @Column('simple-json', { default: '[]' })
    priceHistory!: string; // JSON string for SQLite

    @Column('decimal', { precision: 15, scale: 2, default: 0 })
    totalVolume!: number;

    @Column({ default: 0 })
    transactionCount!: number;

    @Column('decimal', { precision: 5, scale: 2, default: 5 })
    royalty!: number;

    @Column({ default: false })
    isListed!: boolean;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    listingPrice!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Trade, trade => trade.symbol)
    trades!: Trade[];

    @OneToMany(() => Order, order => order.symbol)
    orders!: Order[];
}
