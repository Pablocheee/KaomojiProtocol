import { Telegraf, session } from 'telegraf';
import { Scenes } from 'telegraf';
import { securityMiddleware } from './bot/middleware/security.middleware';
import { Database } from './database/db';
import { Token } from './models/Token';
import * as dotenv from 'dotenv';

// Загружаем .env файл
dotenv.config();

// Проверяем наличие токена
if (!process.env.BOT_TOKEN) {
    console.error('❌ BOT_TOKEN не найден в .env файле');
    process.exit(1);
}

// Импорт сцен
import { tradingScene } from './bot/scenes/trading/trading.scene';
import { buyScene } from './bot/scenes/trading/buy.scene';
import { sellScene } from './bot/scenes/trading/sell.scene';
import { chartDetailScene } from './bot/scenes/trading/chart-detail.scene';
import { portfolioScene } from './bot/scenes/portfolio/portfolio.scene';
import { adminScene } from './bot/scenes/admin/admin.scene';
import { orderBookScene } from './bot/scenes/trading/order-book.scene';

interface SessionData extends Scenes.SceneSessionData {
    // можно добавить кастомные данные сессии
}

interface BotContext extends Scenes.SceneContext {
    // можно добавить кастомные поля контекста
}

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN);

const stage = new Scenes.Stage<BotContext>([
    tradingScene as any, 
    buyScene as any, 
    sellScene as any, 
    chartDetailScene as any,
    portfolioScene as any,
    adminScene as any,
    orderBookScene as any
]);

// Middleware
bot.use(session());
bot.use(stage.middleware());
bot.use(securityMiddleware as any);

// Команды бота
bot.command('start', (ctx) => {
    ctx.reply('Добро пожаловать в Kaomoji Protocol! 🎭', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📊 ТОРГОВАТЬ', callback_data: 'trade' }],
                [{ text: '💰 ПОРТФЕЛЬ', callback_data: 'portfolio' }],
                [{ text: 'ℹ️ ПОМОЩЬ', callback_data: 'help' }]
            ]
        }
    });
});

bot.command('trade', (ctx) => ctx.scene.enter('trading'));
bot.command('portfolio', (ctx) => ctx.scene.enter('portfolio'));
bot.command('admin', (ctx) => ctx.scene.enter('admin'));

// Обработчики callback
bot.action('trade', (ctx) => ctx.scene.enter('trading'));
bot.action('portfolio', (ctx) => ctx.scene.enter('portfolio'));

// Обработка ошибок
bot.catch((err, ctx) => {
    console.error(`Error for ${ctx.updateType}:`, err);
    ctx.reply('❌ Произошла ошибка. Попробуйте позже.');
});

// Запуск сервисов
const startServices = async () => {
    const db = new Database();
    
    const testTokens: Token[] = [
        {
            symbol: '(^_^)',
            address: 'EQD123...',
            name: 'Smile Token',
            decimals: 9,
            liquidity: 50000,
            volume24h: 12000,
            price: 5.24,
            change24h: 15
        },
        {
            symbol: '(⌐■_■)',
            address: 'EQD456...',
            name: 'Cool Token',
            decimals: 9,
            liquidity: 30000,
            volume24h: 8000,
            price: 3.15,
            change24h: -5
        }
    ];

    for (const token of testTokens) {
        await db.saveToken(token);
    }
    console.log('Services initialized');
};

// Запуск бота
startServices().then(() => {
    bot.launch().then(() => {
        console.log('🎭 Kaomoji Protocol bot started successfully');
        console.log('📊 Available commands: /start, /trade, /portfolio');
    });
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));