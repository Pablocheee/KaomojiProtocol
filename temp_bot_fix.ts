// src/bot/bot.ts - добавим в начало startBot функции
async function startBot() {
    try {
        console.log('🚀 Starting Symbol Protocol with Rate Limiting...');
        
        // Добавим логирование webhook
        bot.catch((err, ctx) => {
            console.error('❌ Bot error:', err);
        });
        
        await bot.launch();
        console.log('✅ Bot started with security features');
        console.log('📱 Bot is listening for messages...');
    } catch (error) {
        console.error('❌ Bot startup failed:', error);
    }
}
