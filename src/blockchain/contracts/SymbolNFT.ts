// src/blockchain/contracts/SymbolNFT.ts
// Базовый интерфейс для NFT символа в TON блокчейне
export interface SymbolNFTData {
    symbol: string;
    creator: string;
    owner: string;
    royalty: number; // в процентах
    createdAt: number;
    currentPrice: number;
}

// Функции которые будет поддерживать наш NFT контракт
export class SymbolNFTContract {
    // Создание нового NFT символа
    static createMintPayload(symbol: string, creator: string, royalty: number = 5): any {
        // Временная заглушка - в реальности будет создание ячейки для деплоя
        console.log(`Creating NFT for symbol: ${symbol}`);
        return {};
    }

    // Создание payload для передачи владения
    static createTransferPayload(newOwner: string, price: number): any {
        // Временная заглушка
        console.log(`Creating transfer to: ${newOwner} for ${price} TON`);
        return {};
    }

    // Получение данных NFT
    static parseNFTData(cell: any): SymbolNFTData {
        // Временная заглушка
        return {
            symbol: 'test',
            creator: 'creator',
            owner: 'owner', 
            royalty: 5,
            createdAt: Date.now(),
            currentPrice: 1.0
        };
    }
}
