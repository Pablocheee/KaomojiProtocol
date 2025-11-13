// src/bot/scenes/symbol-creation.scene.ts
import { Scenes } from 'telegraf';

export const symbolCreationScene = new Scenes.BaseScene<Scenes.SceneContext>('create_symbol');

symbolCreationScene.enter((ctx) => {
    ctx.reply('Введи символ который хочешь зарегистрировать как NFT:\n\nПримеры: 🚀, 💎, 🌟, 😊, (^_^)', {
        reply_markup: {
            inline_keyboard: [[{ text: '◀️ Отмена', callback_data: 'cancel' }]]
        }
    });
});

symbolCreationScene.on('text', async (ctx) => {
    const symbol = ctx.message.text;
    
    if (symbol.length > 10) {
        return ctx.reply('❌ Символ слишком длинный. Максимум 10 символов.');
    }
    
    await ctx.reply(
        '✅ Символ: ' + symbol + '\n' +
        '💰 Стоимость: 5 TON\n' +
        '📋 Для создания отправь 5 TON на адрес контракта\n\n' +
        'Адрес будет здесь после деплоя контракта',
        { reply_markup: { 
            inline_keyboard: [
                [{ text: '🔄 Создать другой символ', callback_data: 'new_symbol' }],
                [{ text: '◀️ В главное меню', callback_data: 'main_menu' }]
            ] 
        }}
    );
});

symbolCreationScene.action('cancel', (ctx) => {
    ctx.scene.enter('main_trading');
});

symbolCreationScene.action('new_symbol', (ctx) => {
    ctx.scene.reenter();
});

symbolCreationScene.action('main_menu', (ctx) => {
    ctx.scene.enter('main_trading');
});
