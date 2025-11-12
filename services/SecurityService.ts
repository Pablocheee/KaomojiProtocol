// services/SecurityService.ts
export class SecurityService {
    private dailyLimits = new Map<number, number>();
    private spamDetection = new Map<number, number>();

    // роверка лимитов пользователя
    checkUserLimit(userId: number, operation: string): boolean {
        const userLimit = this.dailyLimits.get(userId) || 0;
        const operationCost = this.getOperationCost(operation);
        
        if (userLimit + operationCost > 1000) { // дневной лимит
            return false;
        }
        
        this.dailyLimits.set(userId, userLimit + operationCost);
        return true;
    }

    // ащита от спама
    checkSpam(userId: number): boolean {
        const userSpamCount = this.spamDetection.get(userId) || 0;
        if (userSpamCount > 10) { // больше 10 операций в минуту
            return false;
        }
        
        this.spamDetection.set(userId, userSpamCount + 1);
        setTimeout(() => {
            const current = this.spamDetection.get(userId) || 0;
            this.spamDetection.set(userId, Math.max(0, current - 1));
        }, 60000); // сбрасываем счетчик через минуту
        
        return true;
    }

    private getOperationCost(operation: string): number {
        const costs: { [key: string]: number } = {
            'create_token': 100,
            'trade': 10,
            'refresh': 1
        };
        return costs[operation] || 1;
    }
}
