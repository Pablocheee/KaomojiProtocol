// bot/scenes/main-trading.scene.ts
import { Scenes } from 'telegraf';

export const mainTradingScene = new Scenes.BaseScene<Scenes.SceneContext>('main_trading');

mainTradingScene.enter((ctx) => {
    ctx.reply('?? обро пожаловать в Kaomoji Protocol!', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '?? Торговать', callback_data: 'trade' }],
                [{ text: '?? ортфель', callback_data: 'portfolio' }],
                [{ text: '?? Создать токен', callback_data: 'create_token' }]
            ]
        }
    });
});

mainTradingScene.action('trade', (ctx) => {
    ctx.editMessageText('?? аздел торговли');
});

mainTradingScene.action('portfolio', (ctx) => {
    ctx.editMessageText('?? аш портфель');
});

mainTradingScene.action('create_token', (ctx) => {
    ctx.editMessageText('?? Создание нового токена');
});
