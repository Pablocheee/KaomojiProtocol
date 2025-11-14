// src/services/DemoDataService.ts
import { nftSymbolRepository } from '../database/repositories/NFTSymbolRepository';
import { userRepository } from '../database/repositories/UserRepository';

export class DemoDataService {
    
    // Создание демо-символов при первом запуске
    static async initializeDemoData(): Promise<void> {
        try {
            console.log('📦 Initializing demo data...');
            
            // Создаем демо-пользователя
            const demoUser = await userRepository.findOrCreate(123, 'demo_user');
            
            // Создаем демо-символы если их нет
            const demoSymbols = [
                { symbol: '(^_^)', initialPrice: 5.24 },
                { symbol: '🚀', initialPrice: 15.75 },
                { symbol: '🌟', initialPrice: 12.30 },
                { symbol: '💎', initialPrice: 8.50 },
                { symbol: '🔥', initialPrice: 3.20 }
            ];
            
            for (const demoSymbol of demoSymbols) {
                const existing = await nftSymbolRepository.findBySymbol(demoSymbol.symbol);
                if (!existing) {
                    await nftSymbolRepository.createSymbol(
                        demoSymbol.symbol, 
                        demoUser, 
                        demoSymbol.initialPrice
                    );
                    console.log(`✅ Created demo symbol: ${demoSymbol.symbol}`);
                }
            }
            
            console.log('🎉 Demo data initialized successfully');
        } catch (error) {
            console.error('❌ Demo data initialization failed:', error);
        }
    }
}
