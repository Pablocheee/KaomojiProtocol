import { Scenes } from 'telegraf';

interface ChartDetailContext extends Scenes.SceneContext {
    // можно добавить кастомные поля
}

export const chartDetailScene = new Scenes.BaseScene<ChartDetailContext>('chart_detail');

chartDetailScene.enter(async (ctx) => {
    await ctx.reply('📈 Детальный график (^_^)\n\nВ разработке...', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '← НАЗАД', callback_data: 'back_to_trading' }]
            ]
        }
    });
});

chartDetailScene.action('back_to_trading', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.scene.enter('trading');
});