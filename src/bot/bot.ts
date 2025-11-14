// src/bot/bot.ts
import { Telegraf, Context } from 'telegraf';
import { BotIntegration } from './BotIntegration';
import { TradingHandlers } from './TradingHandlers';
import { symbolService } from '../core/SymbolProtocolService';
import { nftSymbolExchange } from '../services/NFTSymbolExchange';
import { paymentService } from '../blockchain/payment-service';
import { rateLimitMiddleware } from '../middleware/rateLimit';

const bot = new Telegraf("8352166156:AAFscbuJZRFjiuyHJS17MGyhmF3ffkhldwg");

// Middleware для rate limiting
bot.use(rateLimitMiddleware);

// Middleware для инициализации сессии пользователя
bot.use(async (ctx, next) => {
    if (ctx.from) {
        const userId = ctx.from.id;
        await BotIntegration.initializeUserSession(userId);
    }
    return next();
});

// Команда старта
bot.start(async (ctx) => {
    const userId = ctx.from.id;
    await BotIntegration.initializeUserSession(userId);
    
    await ctx.reply(`🎭 Добро пожаловать в Symbol Protocol!

💫 Биржа NFT символов на TON
💰 Все платежи через TON блокчейн
🎨 Создавайте и торгуйте уникальными символами

Используйте команды для торговли:`);

    const tradingInterface = await TradingHandlers.handleTradingPlatform(userId);
    await ctx.reply(tradingInterface);
});

// Команда создания символа
bot.command('создать', async (ctx) => {
    const parts = ctx.message.text.split(' ');
    const symbol = parts[1];
    
    if (!symbol) {
        await ctx.reply('❌ Укажите символ: /создать [символ]');
        return;
    }

    if (symbol.length > 10) {
        await ctx.reply('❌ Символ не может быть длиннее 10 символов');
        return;
    }

    // В реальности здесь будет получение кошелька пользователя
    const userWallet = 'user_wallet_placeholder'; 
    
    const result = await nftSymbolExchange.createNewSymbol(
        symbol, 
        ctx.from.id, 
        userWallet
    );
    
    await ctx.reply(result);
});

// Команда моего кошелька
bot.command('кошелек', async (ctx) => {
    const protocolBalance = await paymentService.getProtocolBalance();
    await ctx.reply(`💼 Кошелек протокола:
UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY

💎 Все платежи идут на этот адрес
📊 Баланс протокола: ${protocolBalance} TON`);
});

// Существующие команды...
bot.command('торги', async (ctx) => {
    const tradingInterface = await TradingHandlers.handleTradingPlatform(ctx.from.id);
    await ctx.reply(tradingInterface);
});

bot.command('детали', async (ctx) => {
    const symbol = ctx.message.text.split(' ')[1] || '(^_^)';
    const details = await TradingHandlers.handleSymbolDetails(ctx.from.id, symbol);
    await ctx.reply(details);
});

bot.command('стакан', async (ctx) => {
    const symbol = ctx.message.text.split(' ')[1] || '(^_^)';
    const orderBook = await TradingHandlers.handleOrderBook(ctx.from.id, symbol);
    await ctx.reply(orderBook);
});

bot.command('купить', async (ctx) => {
    const parts = ctx.message.text.split(' ');
    const symbol = parts[1] || '(^_^)';
    const price = parseFloat(parts[2]) || 1.0;
    
    const buyMessage = await TradingHandlers.handleBuyIntent(ctx.from.id, symbol);
    await ctx.reply(buyMessage);
});

bot.command('продать', async (ctx) => {
    const parts = ctx.message.text.split(' ');
    const symbol = parts[1] || '(^_^)';
    const sellMessage = await TradingHandlers.handleSellIntent(ctx.from.id, symbol);
    await ctx.reply(sellMessage);
});

bot.command('топ', async (ctx) => {
    const topMessage = await TradingHandlers.handleTopSymbols(ctx.from.id);
    await ctx.reply(topMessage);
});

bot.command('обновить', async (ctx) => {
    const parts = ctx.message.text.split(' ');
    const symbol = parts[1] || '(^_^)';
    const updateMessage = await TradingHandlers.handlePriceUpdate(ctx.from.id, symbol);
    await ctx.reply(updateMessage);
});

bot.command('поиск', async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ') || '';
    if (!query) {
        await ctx.reply('🔍 Введите запрос для поиска: /поиск [символ]');
        return;
    }
    const searchResults = await TradingHandlers.handleSymbolSearch(ctx.from.id, query);
    await ctx.reply(searchResults);
});

bot.command('баланс', async (ctx) => {
    const balanceMessage = await BotIntegration.handleBalanceCommand(ctx.from.id);
    await ctx.reply(balanceMessage);
});

bot.command('статистика', async (ctx) => {
    const stats = await symbolService.getSystemStats();
    const protocolBalance = await paymentService.getProtocolBalance();
    
    await ctx.reply(`📈 Статистика Symbol Protocol:
┌ Активных пользователей: ${stats.activeUsers}
├ Символов в торговле: 3
├ Общий объем: 5720 TON
├ Баланс протокола: ${protocolBalance} TON
└ Время: ${stats.timestamp.toLocaleTimeString()}`);
});

bot.command('выход', async (ctx) => {
    const logoutMessage = await BotIntegration.handleLogout(ctx.from.id);
    await ctx.reply(logoutMessage);
});

// Обработка текстовых команд (кнопки)
bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const text = ctx.message.text;

    if (text === 'ОБНОВИТЬ' || text === 'обновить') {
        const updateMessage = await TradingHandlers.handlePriceUpdate(userId, '(^_^)');
        await ctx.reply(updateMessage);
    } 
    else if (text === 'КУПИТЬ' || text === 'купить') {
        const buyMessage = await TradingHandlers.handleBuyIntent(userId, '(^_^)');
        await ctx.reply(buyMessage);
    }
    else if (text === 'ПРОДАТЬ' || text === 'продать') {
        const sellMessage = await TradingHandlers.handleSellIntent(userId, '(^_^)');
        await ctx.reply(sellMessage);
    }
    else if (text === 'ДЕТАЛИ' || text === 'детали') {
        const details = await TradingHandlers.handleSymbolDetails(userId, '(^_^)');
        await ctx.reply(details);
    }
    else if (text === 'ГРАФИК' || text === 'график') {
        const orderBook = await TradingHandlers.handleOrderBook(userId, '(^_^)');
        await ctx.reply(orderBook);
    }
    else if (text === 'МЕНЮ' || text === 'меню') {
        await ctx.reply(`📋 ГЛАВНОЕ МЕНЮ:
/торги - Торговая площадка
/создать - Создать символ (1 TON)
/топ - Топ символов
/кошелек - Кошелек протокола
/баланс - Ваш баланс
/поиск - Поиск символов
/статистика - Статистика системы
/выход - Выйти`);
    }
    else {
        const tradingInterface = await TradingHandlers.handleTradingPlatform(userId);
        await ctx.reply(tradingInterface);
    }
});

// Запуск бота
async function startBot() {
    try {
        console.log('🚀 Starting Symbol Protocol with Rate Limiting...');
        await bot.launch();
        console.log('✅ Bot started with security features');
    } catch (error) {
        console.error('❌ Bot startup failed:', error);
    }
}

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

export { bot, startBot };
