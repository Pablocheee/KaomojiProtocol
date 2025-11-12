import { Scenes } from 'telegraf';
import { getUser } from '../../../utils/helpers';

interface PortfolioContext extends Scenes.SceneContext {
    // можно добавить кастомные поля
}

export const portfolioScene = new Scenes.BaseScene<PortfolioContext>('portfolio');

portfolioScene.enter(async (ctx) => {
    const user = await getUser(ctx.from!.id);
    
    let portfolioText = '💰 ВАШ ПОРТФЕЛЬ:\n\n';
    portfolioText += `TON: ${user.balance.toFixed(2)}\n\n`;
    
    user.portfolio.forEach((amount, symbol) => {
        portfolioText += `${symbol}: ${amount}\n`;
    });

    await ctx.reply(portfolioText, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📊 ТОРГОВАТЬ', callback_data: 'trade' }],
                [{ text: '🔄 ОБНОВИТЬ', callback_data: 'refresh' }],
                [{ text: '← НАЗАД', callback_data: 'back' }]
            ]
        }
    });
});

portfolioScene.action('trade', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.scene.enter('trading');
});

portfolioScene.action('refresh', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.scene.enter('portfolio');
});

portfolioScene.action('back', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.scene.leave();
});