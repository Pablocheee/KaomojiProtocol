import { Scenes } from 'telegraf';

interface SellContext extends Scenes.SceneContext {
    // можно добавить кастомные поля
}

export const sellScene = new Scenes.BaseScene<SellContext>('sell');

sellScene.enter(async (ctx) => {
    await ctx.reply('Введите количество (^_^) для продажи:');
});

sellScene.on('text', async (ctx) => {
    const amount = parseFloat(ctx.message.text);
    if (isNaN(amount) || amount <= 0) {
        await ctx.reply('❌ Введите корректное количество');
        return;
    }

    await ctx.reply(`🔄 Продажа ${amount} (^_^)...`);
    await ctx.scene.enter('trading');
});