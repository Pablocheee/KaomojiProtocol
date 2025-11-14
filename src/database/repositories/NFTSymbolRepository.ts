// src/database/repositories/NFTSymbolRepository.ts
import { BaseRepository } from './BaseRepository';
import { NFTSymbol } from '../entities/NFTSymbol';
import { User } from '../entities/User';

export class NFTSymbolRepository extends BaseRepository<NFTSymbol> {
    constructor() {
        super(NFTSymbol);
    }

    async saveSymbol(symbol: NFTSymbol): Promise<NFTSymbol> {
        await this.initialize();
        return await this.repository.save(symbol);
    }

    async findBySymbol(symbol: string): Promise<NFTSymbol | null> {
        await this.initialize();
        const result = await this.repository.findOne({ 
            where: { symbol },
            relations: ['owner', 'creator'] 
        });
        
        if (result && result.priceHistory) {
            // Преобразуем JSON строку обратно в массив
            result.priceHistory = JSON.parse(result.priceHistory as any);
        }
        
        return result;
    }

    async createSymbol(symbol: string, creator: User, initialPrice: number = 1.00): Promise<NFTSymbol> {
        await this.initialize();
        
        const nftSymbol = this.repository.create({
            symbol,
            creator,
            owner: creator,
            currentPrice: initialPrice,
            previousPrice: initialPrice,
            priceHistory: JSON.stringify([initialPrice]),
            totalVolume: 0,
            transactionCount: 0,
            royalty: 5,
            isListed: false
        });
        
        return await this.repository.save(nftSymbol);
    }

    async updatePrice(symbol: string, newPrice: number): Promise<void> {
        await this.initialize();
        
        const nftSymbol = await this.findBySymbol(symbol);
        if (nftSymbol) {
            nftSymbol.previousPrice = nftSymbol.currentPrice;
            nftSymbol.currentPrice = newPrice;
            
            let history = [];
            if (nftSymbol.priceHistory && typeof nftSymbol.priceHistory === 'string') {
                history = JSON.parse(nftSymbol.priceHistory);
            }
            history.push(newPrice);
            
            if (history.length > 50) {
                history = history.slice(-50);
            }
            
            nftSymbol.priceHistory = JSON.stringify(history);
            
            await this.repository.save(nftSymbol);
        }
    }

    async getTopSymbols(limit: number = 10): Promise<NFTSymbol[]> {
        await this.initialize();
        const symbols = await this.repository.find({
            order: { totalVolume: 'DESC' },
            take: limit,
            relations: ['owner', 'creator']
        });
        
        return symbols.map(symbol => {
            if (symbol.priceHistory && typeof symbol.priceHistory === 'string') {
                symbol.priceHistory = JSON.parse(symbol.priceHistory);
            }
            return symbol;
        });
    }

    async searchSymbols(query: string): Promise<NFTSymbol[]> {
        await this.initialize();
        const symbols = await this.repository
            .createQueryBuilder('symbol')
            .where('symbol.symbol LIKE :query', { query: `%${query}%` })
            .leftJoinAndSelect('symbol.owner', 'owner')
            .leftJoinAndSelect('symbol.creator', 'creator')
            .take(10)
            .getMany();
            
        return symbols.map(symbol => {
            if (symbol.priceHistory && typeof symbol.priceHistory === 'string') {
                symbol.priceHistory = JSON.parse(symbol.priceHistory);
            }
            return symbol;
        });
    }
}

export const nftSymbolRepository = new NFTSymbolRepository();
