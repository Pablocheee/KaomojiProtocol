// src/index.ts
import { startBot } from './bot/bot';
import { symbolService } from './core/SymbolProtocolService';
import { DemoDataService } from './services/DemoDataService';
import * as dotenv from 'dotenv';

// Явно загружаем .env
dotenv.config();

async function main() {
    console.log('🎭 Symbol Protocol - Starting System Services...');
    
    try {
        // Инициализация демо-данных
        console.log('📦 Initializing demo data...');
        await DemoDataService.initializeDemoData();
        
        // Инициализация системных сервисов
        console.log('📦 Initializing system components...');
        const stats = await symbolService.getSystemStats();
        console.log('✅ System services initialized:', stats);
        
        // Запуск бота
        await startBot();
        
    } catch (error) {
        console.error('❌ Failed to start Symbol Protocol:', error);
        process.exit(1);
    }
}

// Обработка неперехваченных ошибок
process.on('unhandledRejection', (error) => {
    console.error('⚠️ Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    process.exit(1);
});

// Запуск приложения
main();
