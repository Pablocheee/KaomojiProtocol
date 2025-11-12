import { Scenes } from 'telegraf';

interface BuyContext extends Scenes.SceneContext {
    // можно добавить кастомные поля
}

export const buyScene = new Scenes.BaseScene<BuyContext>('buy');

buyScene.enter(async (ctx) => {
    await ctx.reply('Введите количество (^_^) для покупки:');
});

buyScene.on('text', async (ctx) => {
    const amount = parseFloat(ctx.message.text);
    if (isNaN(amount) || amount <= 0) {
        await ctx.reply('❌ Введите корректное количество');
        return;
    }

    await ctx.reply(`🔄 Покупка ${amount} (^_^)...`);
    await ctx.scene.enter('trading');
});