// src/bot/bot.ts
import { Telegraf, Context } from 'telegraf';
import { BotIntegration } from './BotIntegration';
import { TradingHandlers } from './TradingHandlers';
import { symbolService } from '../core/SymbolProtocolService';
import { nftSymbolExchange } from '../services/NFTSymbolExchange';
import { paymentService } from '../blockchain/payment-service';
import { rateLimitMiddleware } from '../middleware/rateLimit';

const bot = new Telegraf("8352166156:AAFscbuJZRFjiuyHJS17MGyhmF3ffkhldwg");

// Обработка ошибок
bot.catch((err, ctx) => {
    console.error('❌ Bot error for update:', ctx.updateType, err);
});

// Middleware для rate limiting
bot.use(rateLimitMiddleware);

// Middleware для инициализации сессии пользователя
bot.use(async (ctx, next) => {
    if (ctx.from) {
        const userId = ctx.from.id;
        console.log('📱 User interaction:', userId, ctx.updateType);
        await BotIntegration.initializeUserSession(userId);
    }
    return next();
});

// Команда старта с улучшенным логированием
bot.start(async (ctx) => {
    console.log('🎯 Start command from:', ctx.from.id, ctx.from.username);
    const userId = ctx.from.id;
    
    try {
        await BotIntegration.initializeUserSession(userId);
        await ctx.reply(`🎭 Добро пожаловать в Symbol Protocol!`);
        
        const tradingInterface = await TradingHandlers.handleTradingPlatform(userId);
        await ctx.reply(tradingInterface);
        console.log('✅ Start command processed successfully');
    } catch (error) {
        console.error('❌ Start command error:', error);
        await ctx.reply('❌ Ошибка при запуске. Попробуйте позже.');
    }
});

// Команда создания символа
bot.command('создать', async (ctx) => {
    console.log('🎨 Create command from:', ctx.from.id);
    const parts = ctx.message.text.split(' ');
    const symbol = parts[1];
    
    if (!symbol) {
        await ctx.reply('❌ Укажите символ: /создать [символ]');
        return;
    }

    const userWallet = 'user_wallet_placeholder'; 
    
    try {
        const result = await nftSymbolExchange.createNewSymbol(symbol, ctx.from.id, userWallet);
        await ctx.reply(result);
    } catch (error) {
        console.error('Create symbol error:', error);
        await ctx.reply('❌ Ошибка при создании символа');
    }
});

// Команда моего кошелька
bot.command('кошелек', async (ctx) => {
    try {
        const protocolBalance = await paymentService.getProtocolBalance();
        await ctx.reply(`💼 Кошелек протокола:
UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY

💎 Все платежи идут на этот адрес
📊 Баланс протокола: ${protocolBalance} TON`);
    } catch (error) {
        console.error('Wallet command error:', error);
        await ctx.reply('❌ Ошибка при получении данных кошелька');
    }
});

// Основные торговые команды
bot.command('торги', async (ctx) => {
    try {
        const tradingInterface = await TradingHandlers.handleTradingPlatform(ctx.from.id);
        await ctx.reply(tradingInterface);
    } catch (error) {
        console.error('Trading command error:', error);
        await ctx.reply('❌ Ошибка при загрузке торговой площадки');
    }
});

bot.command('детали', async (ctx) => {
    const symbol = ctx.message.text.split(' ')[1] || '(^_^)';
    try {
        const details = await TradingHandlers.handleSymbolDetails(ctx.from.id, symbol);
        await ctx.reply(details);
    } catch (error) {
        console.error('Details command error:', error);
        await ctx.reply('❌ Ошибка при получении деталей');
    }
});

bot.command('баланс', async (ctx) => {
    try {
        const balanceMessage = await BotIntegration.handleBalanceCommand(ctx.from.id);
        await ctx.reply(balanceMessage);
    } catch (error) {
        console.error('Balance command error:', error);
        await ctx.reply('❌ Ошибка при получении баланса');
    }
});

// Обработка текстовых команд (кнопки)
bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const text = ctx.message.text;
    console.log('📝 Text message:', userId, text);

    try {
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
        else if (text === 'МЕНЮ' || text === 'меню') {
            await ctx.reply(`📋 ГЛАВНОЕ МЕНЮ:
/торги - Торговая площадка
/создать - Создать символ (1 TON)
/топ - Топ символов
/кошелек - Кошелек протокола
/баланс - Ваш баланс
/статистика - Статистика системы`);
        }
        else {
            const tradingInterface = await TradingHandlers.handleTradingPlatform(userId);
            await ctx.reply(tradingInterface);
        }
    } catch (error) {
        console.error('Text command error:', error);
        await ctx.reply('❌ Ошибка при обработке команды');
    }
});

// Запуск бота с улучшенной обработкой
async function startBot() {
    try {
        console.log('🚀 Starting Symbol Protocol...');
        
        await bot.launch();
        console.log('✅ Bot started successfully!');
        console.log('🤖 Bot is now listening for messages...');
        
    } catch (error) {
        console.error('❌ Bot startup failed:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

export { bot, startBot };

