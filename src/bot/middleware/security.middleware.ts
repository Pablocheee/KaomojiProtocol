import { AuthService } from '../../services/AuthService';

export const securityMiddleware = async (ctx: any, next: any) => {
    const authService = new AuthService();
    
    if (!authService.isUserAuthorized(ctx.from.id)) {
        await authService.authorizeUser(ctx.from.id);
    }

    console.log(`User ${ctx.from.id} executed: ${ctx.updateType}`);
    await next();
};