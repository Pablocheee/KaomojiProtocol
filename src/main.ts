// src/main.ts - полная версия
import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
import { MenuManager } from './bot/MenuManager';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);
const menuManager = new MenuManager();

// Главное меню
bot.command('start', (ctx) => menuManager.showMenu(ctx, 'main_menu'));
bot.command('menu', (ctx) => menuManager.showMenu(ctx, 'main_menu'));

// Обработка callback кнопок - НАВИГАЦИЯ
bot.action('main_menu', (ctx) => menuManager.showMenu(ctx, 'main_menu'));
bot.action('create_symbol', (ctx) => menuManager.showMenu(ctx, 'create_symbol'));
bot.action('trading', (ctx) => menuManager.showMenu(ctx, 'trading'));
bot.action('portfolio', (ctx) => menuManager.showMenu(ctx, 'portfolio'));
bot.action('top_symbols', (ctx) => menuManager.showMenu(ctx, 'top_symbols'));
bot.action('chart_detail', (ctx) => menuManager.showMenu(ctx, 'chart_detail'));

// Обновление торговых данных
bot.action('refresh_trading', async (ctx) => {
    await ctx.answerCbQuery('📊 Данные обновлены!');
    await menuManager.showMenu(ctx, 'trading');
});

// Примеры символов
bot.action('example_rocket', (ctx) => {
    ctx.answerCbQuery('🚀 Используй символ: 🚀');
    setTimeout(() => {
        ctx.reply('🚀').catch(() => {});
    }, 100);
});

bot.action('example_diamond', (ctx) => {
    ctx.answerCbQuery('💎 Используй символ: 💎');
    setTimeout(() => {
        ctx.reply('💎').catch(() => {});
    }, 100);
});

bot.action('example_star', (ctx) => {
    ctx.answerCbQuery('🌟 Используй символ: 🌟');
    setTimeout(() => {
        ctx.reply('🌟').catch(() => {});
    }, 100);
});

// Торговые кнопки (заглушки)
bot.action('buy_smile', (ctx) => ctx.answerCbQuery('🟢 Покупка (^_^) скоро будет доступна!'));
bot.action('sell_smile', (ctx) => ctx.answerCbQuery('🔴 Продажа (^_^) скоро будет доступна!'));
bot.action('buy_rocket', (ctx) => ctx.answerCbQuery('🚀 Покупка Rocket скоро будет доступна!'));
bot.action('buy_diamond', (ctx) => ctx.answerCbQuery('💎 Покупка Diamond скоро будет доступна!'));
bot.action('buy_star', (ctx) => ctx.answerCbQuery('🌟 Покупка Star скоро будет доступна!'));
bot.action('show_chart', (ctx) => ctx.answerCbQuery('📈 Расширенный график скоро будет доступен!'));

// Обработка создания символа
bot.on('text', (ctx) => {
    const text = ctx.message.text.trim();
    
    // Игнорируем команды
    if (text.startsWith('/')) return;
    
    // Если текст похож на символ для создания
    if (text.length <= 10 && text.length > 0) {
        ctx.reply(
            '✅ *Символ принят!*\\n\\n' +
            '🎯 *' + text + '*\\n' +
            '💰 *Стоимость создания: 1 TON* (обновлено!)\\n' +
            '👑 *Ты получишь 5% с каждой перепродажи*\\n\\n' +
            '📋 *Для создания отправь 1 TON на адрес:*\\n' +
            'UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY\\n\\n' +
            '*После оплаты символ будет в твоем портфеле!*',
            { parse_mode: 'Markdown' }
        ).then(() => {
            setTimeout(() => menuManager.showMenu(ctx, 'main_menu'), 3000);
        });
    } else if (text.length > 10) {
        ctx.reply('❌ Символ слишком длинный! Максимум 10 символов.')
            .then(() => {
                setTimeout(() => menuManager.showMenu(ctx, 'create_symbol'), 2000);
            });
    }
});

bot.launch().then(() => {
    console.log('🎭 Symbol Protocol бот запущен с новой экономикой!');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
