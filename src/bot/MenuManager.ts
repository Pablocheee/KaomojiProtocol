// src/bot/MenuManager.ts - минималистичный дизайн
import { TradingDataService } from '../services/TradingDataService';

interface MenuData {
    text: string;
    keyboard: any;
}

export class MenuManager {
    private userStates = new Map<number, { messageId?: number }>();
    private tradingService = new TradingDataService();

    getMainMenu(): MenuData {
        return {
            text: 'SYMBOL PROTOCOL\\n\\n' +
                  'Торговая площадка символов\\n\\n' +
                  '[1 TON ЗА СОЗДАНИЕ]\\n' +
                  '[5% РОЯЛТИ С ПРОДАЖ]\\n\\n' +
                  'ВЫБЕРИ ДЕЙСТВИЕ:',
            keyboard: {
                inline_keyboard: [
                    [{ text: '[СОЗДАТЬ СИМВОЛ]', callback_data: 'create_symbol' }],
                    [{ text: '[ТОРГОВЛЯ]', callback_data: 'trading' }],
                    [{ text: '[ПОРТФЕЛЬ]', callback_data: 'portfolio' }],
                    [{ text: '[ТОП СИМВОЛОВ]', callback_data: 'top_symbols' }]
                ]
            }
        };
    }

    getCreateMenu(): MenuData {
        return {
            text: 'СОЗДАНИЕ СИМВОЛА\\n\\n' +
                  'ЦЕНА: 1 TON\\n' +
                  'МАКС: 10 СИМВОЛОВ\\n' +
                  'РОЯЛТИ: 5% С ПРОДАЖ\\n\\n' +
                  'ОТПРАВЬ СИМВОЛ ДЛЯ РЕГИСТРАЦИИ\\n' +
                  '🚀 💎 🌟 😊 (^_^)\\n\\n' +
                  'ИЛИ ВЫБЕРИ ПРИМЕР:',
            keyboard: {
                inline_keyboard: [
                    [{ text: '[🚀 ROCKET]', callback_data: 'example_rocket' }],
                    [{ text: '[💎 DIAMOND]', callback_data: 'example_diamond' }],
                    [{ text: '[🌟 STAR]', callback_data: 'example_star' }],
                    [{ text: '[НАЗАД]', callback_data: 'main_menu' }]
                ]
            }
        };
    }

    getTradingMenu(): MenuData {
        const symbolData = this.tradingService.getSymbolData('(^_^)');
        if (!symbolData) return this.getMainMenu();

        const chart = this.tradingService.generateChart(symbolData.priceHistory);
        const recentTrades = this.tradingService.getRecentTrades();
        const changeIcon = symbolData.change24h >= 0 ? '↗️' : '↘️';

        const text = 'ТОРГОВАЯ ПЛОЩАДКА\\n\\n' +
              '(^_^) ' + symbolData.price.toFixed(2) + ' TON ' + changeIcon + Math.abs(symbolData.change24h) + '%\\n' +
              chart + '\\n\\n' +
              recentTrades.join('  ') + '\\n' +
              (recentTrades.slice(3).join('  ') || '') + '\\n\\n' +
              'ВЫБЕРИ ДЕЙСТВИЕ:';

        return {
            text: text,
            keyboard: {
                inline_keyboard: [
                    [
                        { text: '[КУПИТЬ]', callback_data: 'buy_smile' },
                        { text: '[ПРОДАТЬ]', callback_data: 'sell_smile' }
                    ],
                    [
                        { text: '[ДЕТАЛИ]', callback_data: 'chart_detail' },
                        { text: '[ГРАФИК]', callback_data: 'show_chart' }
                    ],
                    [
                        { text: '[ОБНОВИТЬ]', callback_data: 'refresh_trading' },
                        { text: '[МЕНЮ]', callback_data: 'main_menu' }
                    ]
                ]
            }
        };
    }

    getChartDetailMenu(): MenuData {
        const symbolData = this.tradingService.getSymbolData('(^_^)');
        if (!symbolData) return this.getMainMenu();

        const changeIcon = symbolData.change24h >= 0 ? '↗️' : '↘️';
        const maxPrice = Math.max(...symbolData.priceHistory).toFixed(2);
        const minPrice = Math.min(...symbolData.priceHistory).toFixed(2);
        const marketCap = (symbolData.price * 2387).toFixed(0);

        const text = 'ДЕТАЛИ СИМВОЛА (^_^)\\n\\n' +
              'ЦЕНА: ' + symbolData.price.toFixed(3) + ' TON\\n' +
              'ИЗМЕНЕНИЕ: ' + changeIcon + Math.abs(symbolData.change24h) + '% (24ч)\\n' +
              'ОБЪЕМ: ' + symbolData.volume.toFixed(0) + ' TON\\n' +
              'СДЕЛКИ: ' + symbolData.trades + ' (24ч)\\n\\n' +
              'СТАТИСТИКА:\\n' +
              'МАКС: ' + maxPrice + ' TON | МИН: ' + minPrice + ' TON\\n' +
              'КАПИТАЛИЗАЦИЯ: ' + marketCap + ' TON\\n\\n' +
              'ВЛАДЕЛЬЦЫ: 247';

        return {
            text: text,
            keyboard: {
                inline_keyboard: [
                    [
                        { text: '[КУПИТЬ]', callback_data: 'buy_smile' },
                        { text: '[ПРОДАТЬ]', callback_data: 'sell_smile' }
                    ],
                    [
                        { text: '[НАЗАД]', callback_data: 'trading' }
                    ]
                ]
            }
        };
    }

    getPortfolioMenu(): MenuData {
        return {
            text: 'МОЙ ПОРТФЕЛЬ\\n\\n' +
                  'БАЛАНС: 0 TON\\n' +
                  'СИМВОЛОВ: 0\\n\\n' +
                  'ТВОИ NFT СИМВОЛЫ:\\n' +
                  'ПОКА ПУСТО...\\n\\n' +
                  'СОЗДАЙ ПЕРВЫЙ СИМВОЛ ЗА 1 TON!',
            keyboard: {
                inline_keyboard: [
                    [{ text: '[СОЗДАТЬ]', callback_data: 'create_symbol' }],
                    [{ text: '[ТОРГОВЛЯ]', callback_data: 'trading' }],
                    [{ text: '[МЕНЮ]', callback_data: 'main_menu' }]
                ]
            }
        };
    }

    getTopSymbolsMenu(): MenuData {
        return {
            text: 'ТОП СИМВОЛОВ\\n\\n' +
                  'САМЫЕ ПОПУЛЯРНЫЕ:\\n' +
                  '1. 🚀 ROCKET - 150 TON ОБЪЕМ\\n' +
                  '2. 💎 DIAMOND - 89 TON ОБЪЕМ\\n' +
                  '3. 🌟 STAR - 75 TON ОБЪЕМ\\n\\n' +
                  'ТРЕНДОВЫЕ:\\n' +
                  '⭐ NEW MOON - +45% ЗА ДЕНЬ\\n' +
                  '⚡ LIGHTNING - +32% ЗА ДЕНЬ',
            keyboard: {
                inline_keyboard: [
                    [{ text: '[КУПИТЬ ROCKET]', callback_data: 'buy_rocket' }],
                    [{ text: '[КУПИТЬ DIAMOND]', callback_data: 'buy_diamond' }],
                    [{ text: '[МЕНЮ]', callback_data: 'main_menu' }]
                ]
            }
        };
    }

    async showMenu(ctx: any, menuName: string) {
        const userId = ctx.from.id;
        let menuData: MenuData;

        switch (menuName) {
            case 'main_menu':
                menuData = this.getMainMenu();
                break;
            case 'create_symbol':
                menuData = this.getCreateMenu();
                break;
            case 'trading':
                menuData = this.getTradingMenu();
                break;
            case 'portfolio':
                menuData = this.getPortfolioMenu();
                break;
            case 'top_symbols':
                menuData = this.getTopSymbolsMenu();
                break;
            case 'chart_detail':
                menuData = this.getChartDetailMenu();
                break;
            default:
                menuData = this.getMainMenu();
        }

        if (ctx.callbackQuery) {
            await ctx.editMessageText(menuData.text, {
                parse_mode: 'Markdown',
                reply_markup: menuData.keyboard
            });
        } else {
            const message = await ctx.reply(menuData.text, {
                parse_mode: 'Markdown', 
                reply_markup: menuData.keyboard
            });
            this.userStates.set(userId, { messageId: message.message_id });
        }
    }
}
