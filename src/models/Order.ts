export interface Order {
    id: string;
    userId: number;
    symbol: string;
    type: 'buy' | 'sell';
    amount: number;
    price: number;
    status: 'pending' | 'filled' | 'cancelled';
    createdAt: Date;
    filledAt?: Date;
}
