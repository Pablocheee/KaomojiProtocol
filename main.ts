// main.ts (���������� ������)
import { Telegraf, session } from 'telegraf';
import { Scenes } from 'telegraf';
import { mainTradingScene } from './bot/scenes/main-trading.scene';
import * as dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);

const stage = new Scenes.Stage([mainTradingScene]);

bot.use(session());
bot.use(stage.middleware());

// �� ������� ����� � ������� �����
bot.command('start', (ctx) => ctx.scene.enter('main_trading'));
bot.command('trade', (ctx) => ctx.scene.enter('main_trading'));
bot.command('portfolio', (ctx) => ctx.scene.enter('main_trading'));

bot.launch().then(() => {
    console.log('?? Kaomoji Protocol ������� � ������ ������� ����!');
});
