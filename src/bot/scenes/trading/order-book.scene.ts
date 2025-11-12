import { Scenes } from 'telegraf';

interface OrderBookSession extends Scenes.SceneSessionData {
    symbol?: string;
}

interface OrderBookContext extends Scenes.SceneContext {
    scene: Scenes.SceneContextScene<OrderBookContext, OrderBookSession>;
}

export const orderBookScene = new Scenes.BaseScene<OrderBookContext>('order_book');

orderBookScene.enter(async (ctx) => {
    const symbol = (ctx.scene.state as any)?.symbol || '(^_^)';
    
    const bids = [{ price: 5.23, amount: 100 }, { price: 5.22, amount: 50 }];
    const asks = [{ price: 5.25, amount: 75 }, { price: 5.26, amount: 120 }];

    let orderBookText = `📊 СТАКАН: ${symbol}\n\n`;
    orderBookText += `ПРОДАЖИ:\n`;
    asks.slice(0, 5).forEach(order => {
        orderBookText += `${order.price} TON - ${order.amount}\n`;
    });
    
    orderBookText += `\nПОКУПКИ:\n`;
    bids.slice(0, 5).forEach(order => {
        orderBookText += `${order.price} TON - ${order.amount}\n`;
    });

    await ctx.reply(orderBookText, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '🛒 БЫСТРАЯ ПОКУПКА', callback_data: 'quick_buy' },
                    { text: '💰 БЫСТРАЯ ПРОДАЖА', callback_data: 'quick_sell' }
                ],
                [{ text: '← НАЗАД', callback_data: 'back_to_trading' }]
            ]
        }
    });
});

orderBookScene.action('back_to_trading', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.scene.enter('trading');
});