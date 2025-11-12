// bot/scenes/main-trading.scene.ts
import { Scenes } from 'telegraf';
import { ChartService } from '../../services/ChartService';
import { PriceService } from '../../services/PriceService';
import { TONService } from '../../services/TONService';
import { DexService } from '../../services/DexService';

interface MainTradingState {
    selectedToken: string;
    balance: number;
    portfolio: Map<string, number>;
    lastUpdate: number;
}

export const mainTradingScene = new Scenes.BaseScene<Scenes.SceneContext>('main_trading');

mainTradingScene.enter(async (ctx) => {
    await showMainInterface(ctx);
});

// Главный интерфейс
async function showMainInterface(ctx: any) {
    const tonService = new TONService();
    const priceService = new PriceService();
    const chartService = new ChartService();

    // Получаем все данные сразу
    const [priceData, balance, portfolio] = await Promise.all([
        priceService.getTokenPrice('(^_^)'),
        tonService.getBalance('user_wallet_address'),
        getUserPortfolio(ctx.from.id)
    ]);

    const sparklineData = await priceService.getPriceHistory('(^_^)', '1h');
    const chart = chartService.generateSparkline(sparklineData);

    const message = `
🎭 **KAOMOJI PROTOCOL** - Единый терминал

📊 **ТОРГОВЛЯ**
(^_^) ${priceData.price} TON ${chartService.formatPriceChange(priceData.change)}
${chart}

💰 **БАЛАНС**
TON: ${balance.toFixed(2)}
(^_^): ${portfolio.get('(^_^)') || 0}

⚡ **БЫСТРЫЕ ДЕЙСТВИЯ**
    `.trim();

    await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                // Первая строка - основные действия
                [
                    { text: '🛒 КУПИТЬ', callback_data: 'quick_buy' },
                    { text: '💰 ПРОДАТЬ', callback_data: 'quick_sell' },
                    { text: '🔄 ОБНОВИТЬ', callback_data: 'refresh' }
                ],
                // Вторая строка - навигация
                [
                    { text: '📈 ГРАФИК', callback_data: 'chart_detail' },
                    { text: '📊 СТАКАН', callback_data: 'order_book' },
                    { text: '💼 ПОРТФЕЛЬ', callback_data: 'portfolio' }
                ],
                // Третья строка - управление
                [
                    { text: '⚙️ НАСТРОЙКИ', callback_data: 'settings' },
                    { text: '🔗 TONKEEPER', callback_data: 'connect_wallet' }
                ]
            ]
        }
    });
}

// Обработчики действий в одном месте
mainTradingScene.action('quick_buy', async (ctx) => {
    await showBuyInterface(ctx);
});

mainTradingScene.action('quick_sell', async (ctx) => {
    await showSellInterface(ctx);
});

mainTradingScene.action('refresh', async (ctx) => {
    await showMainInterface(ctx);
});

// Интерфейс покупки (в том же окне)
async function showBuyInterface(ctx: any) {
    const message = `
🛒 **БЫСТРАЯ ПОКУПКА**

Выберите количество (^_^) для покупки:

Текущая цена: 5.24 TON
Ваш баланс: 150.25 TON
    `.trim();

    await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '10 (^_^)', callback_data: 'buy_10' },
                    { text: '25 (^_^)', callback_data: 'buy_25' },
                    { text: '50 (^_^)', callback_data: 'buy_50' }
                ],
                [
                    { text: 'MAX', callback_data: 'buy_max' },
                    { text: 'СВОЁ', callback_data: 'buy_custom' }
                ],
                [
                    { text: '← НАЗАД', callback_data: 'back_to_main' }
                ]
            ]
        }
    });
}

// Обработка покупки
mainTradingScene.action(/buy_/, async (ctx) => {
    const action = ctx.callbackQuery.data;
    const amount = action === 'buy_max' ? await getMaxBuyAmount(ctx.from.id) : 
                   parseInt(action.replace('buy_', ''));

    const dexService = new DexService();
    const quote = await dexService.getSwapQuote('TON', 'EQD123...', amount); // TON -> (^_^)
    
    const tonService = new TONService();
    const deeplink = tonService.createTonkeeperDeepLink(
        'swap_contract_address',
        quote.amountIn,
        'EQD123...' // jetton address
    );

    await ctx.editMessageText(`
✅ **ГОТОВО К ПОКУПКЕ**

Покупка: ${amount} (^_^)
Стоимость: ${quote.amountIn} TON
Получите: ~${quote.amountOut.toFixed(2)} (^_^)

📱 **Нажмите для оплаты в Tonkeeper:**
    `, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '📱 ОПЛАТИТЬ В TONKEEPER', url: deeplink }],
                [{ text: '🔄 ПРОВЕРИТЬ СТАТУС', callback_data: 'check_tx_status' }],
                [{ text: '← НАЗАД', callback_data: 'back_to_main' }]
            ]
        }
    });
});

// Авто-обновление интерфейса
mainTradingScene.action('refresh', async (ctx) => {
    await showMainInterface(ctx);
    // Планируем следующее обновление
    setTimeout(() => autoRefresh(ctx), 5000);
});

function autoRefresh(ctx: any) {
    if (ctx.scene?.current?.id === 'main_trading') {
        showMainInterface(ctx);
    }
}