// src/middleware/rateLimit.ts
import { Context } from 'telegraf';

export class RateLimiter {
    private requests = new Map<number, number[]>();
    private readonly WINDOW_MS = 60000; // 1 minute
    private readonly MAX_REQUESTS = 20; // 20 requests per minute

    isRateLimited(userId: number): boolean {
        const now = Date.now();
        const userRequests = this.requests.get(userId) || [];
        
        // Remove old requests outside the window
        const recentRequests = userRequests.filter(time => now - time < this.WINDOW_MS);
        
        if (recentRequests.length >= this.MAX_REQUESTS) {
            return true;
        }
        
        // Add current request
        recentRequests.push(now);
        this.requests.set(userId, recentRequests);
        
        return false;
    }

    getRemainingRequests(userId: number): number {
        const now = Date.now();
        const userRequests = this.requests.get(userId) || [];
        const recentRequests = userRequests.filter(time => now - time < this.WINDOW_MS);
        return Math.max(0, this.MAX_REQUESTS - recentRequests.length);
    }
}

export const rateLimiter = new RateLimiter();

// Middleware для Telegraf
export function rateLimitMiddleware(ctx: Context, next: Function) {
    if (!ctx.from) return next();
    
    const userId = ctx.from.id;
    
    if (rateLimiter.isRateLimited(userId)) {
        const remaining = rateLimiter.getRemainingRequests(userId);
        ctx.reply(`❌ Слишком много запросов. Попробуйте через минуту.`);
        return;
    }
    
    return next();
}
