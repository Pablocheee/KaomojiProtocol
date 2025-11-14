// src/main.ts - минималистичный стиль
import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
import { MenuManager } from './bot/MenuManager';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);
const menuManager = new MenuManager();

// лавное меню
bot.command('start', (ctx) => menuManager.showMenu(ctx, 'main_menu'));
bot.command('menu', (ctx) => menuManager.showMenu(ctx, 'main_menu'));

// бработка callback кнопок - Я
bot.action('main_menu', (ctx) => menuManager.showMenu(ctx, 'main_menu'));
bot.action('create_symbol', (ctx) => menuManager.showMenu(ctx, 'create_symbol'));
bot.action('trading', (ctx) => menuManager.showMenu(ctx, 'trading'));
bot.action('portfolio', (ctx) => menuManager.showMenu(ctx, 'portfolio'));
bot.action('top_symbols', (ctx) => menuManager.showMenu(ctx, 'top_symbols'));
bot.action('chart_detail', (ctx) => menuManager.showMenu(ctx, 'chart_detail'));

// бновление торговых данных
bot.action('refresh_trading', async (ctx) => {
    await ctx.answerCbQuery('Ы Ы');
    await menuManager.showMenu(ctx, 'trading');
});

// римеры символов
bot.action('example_rocket', (ctx) => {
    ctx.answerCbQuery('СЬ С: 🚀');
    setTimeout(() => {
        ctx.reply('🚀').catch(() => {});
    }, 100);
});

bot.action('example_diamond', (ctx) => {
    ctx.answerCbQuery('СЬ С: 💎');
    setTimeout(() => {
        ctx.reply('💎').catch(() => {});
    }, 100);
});

bot.action('example_star', (ctx) => {
    ctx.answerCbQuery('СЬ С: 🌟');
    setTimeout(() => {
        ctx.reply('🌟').catch(() => {});
    }, 100);
});

// Торговые кнопки (заглушки)
bot.action('buy_smile', (ctx) => ctx.answerCbQuery(' (^_^) С Т СТ'));
bot.action('sell_smile', (ctx) => ctx.answerCbQuery(' (^_^) С Т СТ'));
bot.action('buy_rocket', (ctx) => ctx.answerCbQuery(' ROCKET С Т СТ'));
bot.action('buy_diamond', (ctx) => ctx.answerCbQuery(' DIAMOND С Т СТ'));
bot.action('buy_star', (ctx) => ctx.answerCbQuery(' STAR С Т СТ'));
bot.action('show_chart', (ctx) => ctx.answerCbQuery('СШЫ  С Т СТ'));

// бработка создания символа
bot.on('text', (ctx) => {
    const text = ctx.message.text.trim();
    
    // гнорируем команды
    if (text.startsWith('/')) return;
    
    // сли текст похож на символ для создания
    if (text.length <= 10 && text.length > 0) {
        ctx.reply(
            'С ЯТ\\n\\n' +
            '🎯 ' + text + '\\n' +
            '💰 СТСТЬ СЯ: 1 TON\\n' +
            '👑 ТЫ ШЬ 5% С  \\n\\n' +
            'Я СЯ ТЬ 1 TON  С:\\n' +
            'UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY\\n\\n' +
            'С ТЫ С Т  Т Т!',
            { parse_mode: 'Markdown' }
        ).then(() => {
            setTimeout(() => menuManager.showMenu(ctx, 'main_menu'), 3000);
        });
    } else if (text.length > 10) {
        ctx.reply('❌ С СШ Ы! С 10 С.')
            .then(() => {
                setTimeout(() => menuManager.showMenu(ctx, 'create_symbol'), 2000);
            });
    }
});

bot.launch().then(() => {
    console.log('SYMBOL PROTOCOL Щ С СТЫ !');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
