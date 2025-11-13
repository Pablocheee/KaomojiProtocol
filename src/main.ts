// src/main.ts
import { Telegraf, session } from 'telegraf';
import { Scenes } from 'telegraf';
import { mainTradingScene } from './bot/scenes/main-trading.scene';
import { symbolCreationScene } from './bot/scenes/symbol-creation.scene';
import * as dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);

const stage = new Scenes.Stage([mainTradingScene, symbolCreationScene]);

bot.use(session());
bot.use(stage.middleware());

// Команды
bot.command('start', (ctx) => ctx.scene.enter('main_trading'));
bot.command('trade', (ctx) => ctx.scene.enter('main_trading'));
bot.command('create', (ctx) => ctx.scene.enter('create_symbol'));

bot.launch().then(() => {
    console.log('🎭 Symbol Protocol бот запущен!');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
