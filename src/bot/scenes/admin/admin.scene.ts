import { Scenes } from 'telegraf';

interface AdminContext extends Scenes.SceneContext {
    // можно добавить кастомные поля
}

function isAdmin(userId: number): boolean {
    const admins = [123456789];
    return admins.includes(userId);
}

export const adminScene = new Scenes.BaseScene<AdminContext>('admin');

adminScene.enter(async (ctx) => {
    if (!isAdmin(ctx.from!.id)) {
        await ctx.reply('⛔ Доступ запрещен');
        return;
    }

    await ctx.reply('⚙️ АДМИН ПАНЕЛЬ', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📊 СТАТИСТИКА', callback_data: 'stats' }],
                [{ text: '🔄 ОБНОВИТЬ ТОКЕНЫ', callback_data: 'refresh_tokens' }],
                [{ text: '← НАЗАД', callback_data: 'back' }]
            ]
        }
    });
});

adminScene.action('back', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.scene.leave();
});