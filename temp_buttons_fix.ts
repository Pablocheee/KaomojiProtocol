// Обработка текстовых команд (кнопки)
bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const text = ctx.message.text;
    console.log('📝 Text message from buttons:', userId, text);

    try {
        if (text === 'ОБНОВИТЬ' || text === 'обновить') {
            console.log('🔄 Refresh button pressed');
            const updateMessage = await TradingHandlers.handlePriceUpdate(userId, '(^_^)');
            await ctx.reply(updateMessage);
        } 
        else if (text === 'КУПИТЬ' || text === 'купить') {
            console.log('🛒 Buy button pressed');
            const buyMessage = await TradingHandlers.handleBuyIntent(userId, '(^_^)');
            await ctx.reply(buyMessage);
        }
        else if (text === 'ПРОДАТЬ' || text === 'продать') {
            console.log('💰 Sell button pressed');
            const sellMessage = await TradingHandlers.handleSellIntent(userId, '(^_^)');
            await ctx.reply(sellMessage);
        }
        else if (text === 'ДЕТАЛИ' || text === 'детали') {
            console.log('📊 Details button pressed');
            const details = await TradingHandlers.handleSymbolDetails(userId, '(^_^)');
            await ctx.reply(details);
        }
        else if (text === 'ГРАФИК' || text === 'график') {
            console.log('📈 Graph button pressed');
            const orderBook = await TradingHandlers.handleOrderBook(userId, '(^_^)');
            await ctx.reply(orderBook);
        }
        else if (text === 'МЕНЮ' || text === 'меню') {
            console.log('📋 Menu button pressed');
            await ctx.reply(`📋 ГЛАВНОЕ МЕНЮ:
/торги - Торговая площадка
/создать - Создать символ (1 TON)
/топ - Топ символов
/кошелек - Кошелек протокола
/баланс - Ваш баланс
/статистика - Статистика системы`);
        }
        else {
            console.log('🔍 Unknown text, showing trading interface');
            const tradingInterface = await TradingHandlers.handleTradingPlatform(userId);
            await ctx.reply(tradingInterface);
        }
    } catch (error) {
        console.error('❌ Text command error:', error);
        await ctx.reply('❌ Ошибка при обработке команды');
    }
});
