import { Scenes } from 'telegraf';
import { ChartService } from '../../../services/ChartService';
import { PriceService } from '../../../services/PriceService';

interface TradingContext extends Scenes.SceneContext {
    // можно добавить кастомные поля
}

export const tradingScene = new Scenes.BaseScene<TradingContext>('trading');

tradingScene.enter(async (ctx) => {
    const symbol = '(^_^)';
    const chartService = new ChartService();
    const priceService = new PriceService();

    const [priceData, recentTrades] = await Promise.all([
        priceService.getTokenPrice(symbol),
        priceService.getRecentTrades(symbol)
    ]);

    const sparklineData = await priceService.getPriceHistory(symbol, '1h');
    const chart = chartService.generateSparkline(sparklineData);

    const tradesText = recentTrades.map(trade => 
        `${trade.time} ${trade.direction === 'up' ? '⬆️' : '⬇️'}${trade.price}`
    ).join(' ');

    const message = `
${symbol} ${priceData.price} TON ${chartService.formatPriceChange(priceData.change)}

${chart}

${tradesText}
    `.trim();

    await ctx.reply(message, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'КУПИТЬ', callback_data: 'buy' },
                    { text: 'ПРОДАТЬ', callback_data: 'sell' },
                    { text: '📊', callback_data: 'chart' }
                ],
                [
                    { text: '📈 СТАКАН', callback_data: 'order_book' },
                    { text: '💼 ПОРТФЕЛЬ', callback_data: 'portfolio' }
                ]
            ]
        }
    });
});

tradingScene.action('buy', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.scene.enter('buy');
});

tradingScene.action('sell', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.scene.enter('sell');
});

tradingScene.action('chart', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.scene.enter('chart_detail');
});

tradingScene.action('order_book', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.scene.enter('order_book', { symbol: '(^_^)' });
});

tradingScene.action('portfolio', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.scene.enter('portfolio');
});