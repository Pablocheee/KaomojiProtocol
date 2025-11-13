// src/bot/MenuManager.ts
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
            text: '🎭 *Symbol Protocol* - Торговая площадка символов\\n\\n' +
                  '💎 *Создавай* NFT символы за 1 TON\\n' +
                  '💰 *Торгуй* редкими символами\\n' +
                  '👑 *Получай 5%* с каждой перепродажи\\n\\n' +
                  'Выбери действие:',
            keyboard: {
                inline_keyboard: [
                    [{ text: '🔄 Создать символ', callback_data: 'create_symbol' }],
                    [{ text: '💰 Торговая площадка', callback_data: 'trading' }],
                    [{ text: '👛 Мой портфель', callback_data: 'portfolio' }],
                    [{ text: '📊 Топ символов', callback_data: 'top_symbols' }]
                ]
            }
        };
    }

    getCreateMenu(): MenuData {
        return {
            text: '🔄 *Создание NFT символа*\\n\\n' +
                  '💎 Цена: *1 TON* (обновлено!)\\n' +
                  '📝 Максимум: *10 символов*\\n\\n' +
                  '🎯 *Ты получаешь 5% с каждой перепродажи!*\\n\\n' +
                  'Отправь символ для регистрации:\\n' +
                  '🚀 💎 🌟 😊 (^_^)\\n\\n' +
                  '*Или выбери действие:*',
            keyboard: {
                inline_keyboard: [
                    [{ text: '🚀 Пример: Rocket', callback_data: 'example_rocket' }],
                    [{ text: '💎 Пример: Diamond', callback_data: 'example_diamond' }],
                    [{ text: '🌟 Пример: Star', callback_data: 'example_star' }],
                    [{ text: '◀️ Назад в меню', callback_data: 'main_menu' }]
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

        const text = '💰 *ТОРГОВАЯ ПЛОЩАДКА*\\n\\n' +
              '*(^_^) ' + symbolData.price.toFixed(2) + ' TON ' + changeIcon + Math.abs(symbolData.change24h) + '%*\\n' +
              chart + '\\n\\n' +
              recentTrades.join('  ') + '\\n' +
              (recentTrades.slice(3).join('  ') || '') + '\\n\\n' +
              '*Выбери действие:*';

        return {
            text: text,
            keyboard: {
                inline_keyboard: [
                    [
                        { text: '🟢 КУПИТЬ', callback_data: 'buy_smile' },
                        { text: '🔴 ПРОДАТЬ', callback_data: 'sell_smile' }
                    ],
                    [
                        { text: '📊 Детали', callback_data: 'chart_detail' },
                        { text: '📈 График', callback_data: 'show_chart' }
                    ],
                    [
                        { text: '🔄 Обновить', callback_data: 'refresh_trading' },
                        { text: '◀️ Меню', callback_data: 'main_menu' }
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

        const text = '📊 *ДЕТАЛИ СИМВОЛА (^_^)*\\n\\n' +
              '💰 *Цена:* ' + symbolData.price.toFixed(3) + ' TON\\n' +
              '📈 *Изменение:* ' + changeIcon + Math.abs(symbolData.change24h) + '% (24ч)\\n' +
              '💧 *Объем:* ' + symbolData.volume.toFixed(0) + ' TON\\n' +
              '🔄 *Сделки:* ' + symbolData.trades + ' (24ч)\\n\\n' +
              '*Статистика:*\\n' +
              'Макс: ' + maxPrice + ' TON | Мин: ' + minPrice + ' TON\\n' +
              'Капитализация: ' + marketCap + ' TON\\n\\n' +
              '*Владельцы:* 247';

        return {
            text: text,
            keyboard: {
                inline_keyboard: [
                    [
                        { text: '🟢 КУПИТЬ', callback_data: 'buy_smile' },
                        { text: '🔴 ПРОДАТЬ', callback_data: 'sell_smile' }
                    ],
                    [
                        { text: '◀️ Назад', callback_data: 'trading' }
                    ]
                ]
            }
        };
    }

    getPortfolioMenu(): MenuData {
        return {
            text: '👛 *Мой портфель*\\n\\n' +
                  '💰 *Баланс:* 0 TON\\n' +
                  '🎯 *Символов:* 0\\n\\n' +
                  '*Твои NFT символы:*\\n' +
                  'Пока пусто...\\n\\n' +
                  'Создай свой первый символ за 1 TON!',
            keyboard: {
                inline_keyboard: [
                    [{ text: '🔄 Создать символ', callback_data: 'create_symbol' }],
                    [{ text: '💰 Торговая площадка', callback_data: 'trading' }],
                    [{ text: '◀️ Назад в меню', callback_data: 'main_menu' }]
                ]
            }
        };
    }

    getTopSymbolsMenu(): MenuData {
        return {
            text: '📊 *Топ символов*\\n\\n' +
                  '🏆 *Самые популярные:*\\n' +
                  '1. 🚀 Rocket - 150 TON объем\\n' +
                  '2. 💎 Diamond - 89 TON объем\\n' +
                  '3. 🌟 Star - 75 TON объем\\n\\n' +
                  '🔥 *Трендовые:*\\n' +
                  '⭐ New Moon - +45% за день\\n' +
                  '⚡ Lightning - +32% за день',
            keyboard: {
                inline_keyboard: [
                    [{ text: '🚀 Купить Rocket', callback_data: 'buy_rocket' }],
                    [{ text: '💎 Купить Diamond', callback_data: 'buy_diamond' }],
                    [{ text: '◀️ Назад в меню', callback_data: 'main_menu' }]
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
