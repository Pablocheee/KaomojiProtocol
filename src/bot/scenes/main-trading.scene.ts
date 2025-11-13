// src/bot/scenes/main-trading.scene.ts
import { Scenes } from 'telegraf';
import { TONService } from '../../services/TONService';

const tonService = new TONService();

export const mainTradingScene = new Scenes.BaseScene<Scenes.SceneContext>('main_trading');

mainTradingScene.enter((ctx) => {
    ctx.reply('🎭 Symbol Protocol - Торговая площадка', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '💰 Купить символ', callback_data: 'buy_symbol' }],
                [{ text: '🔄 Создать символ', callback_data: 'create_symbol' }],
                [{ text: '👛 Мой портфель', callback_data: 'portfolio' }],
                [{ text: '📊 Топ символов', callback_data: 'top_symbols' }]
            ]
        }
    });
});

mainTradingScene.action('create_symbol', async (ctx) => {
    await ctx.editMessageText(
        '🔄 Создание нового символа NFT\\n\\n' +
        '💎 Цена: 5 TON\\n' +
        '📝 Отправь символ который хочешь зарегистрировать:',
        { reply_markup: { inline_keyboard: [[{ text: '◀️ Назад', callback_data: 'back' }]] } }
    );
    
    ctx.scene.enter('create_symbol');
});

mainTradingScene.action('buy_symbol', (ctx) => {
    ctx.editMessageText('💰 Раздел покупки символов');
});

mainTradingScene.action('portfolio', (ctx) => {
    ctx.editMessageText('👛 Твой портфель символов');
});

mainTradingScene.action('top_symbols', (ctx) => {
    ctx.editMessageText('📊 Топ популярных символов');
});

mainTradingScene.action('back', (ctx) => {
    ctx.scene.reenter();
});
