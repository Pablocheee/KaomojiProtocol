// src/core/InMemoryCache.ts
export class InMemoryCache {
    private storage = new Map<string, { data: any; expires: number }>();

    async set(key: string, value: any, ttl: number = 300): Promise<void> {
        const expires = Date.now() + ttl * 1000;
        this.storage.set(key, { data: value, expires });
    }

    async get(key: string): Promise<any | null> {
        const item = this.storage.get(key);
        if (!item) return null;
        
        if (Date.now() > item.expires) {
            this.storage.delete(key);
            return null;
        }
        
        return item.data;
    }

    async del(key: string): Promise<void> {
        this.storage.delete(key);
    }

    async keys(pattern: string): Promise<string[]> {
        const allKeys = Array.from(this.storage.keys());
        return allKeys.filter(key => key.includes(pattern.replace('*', '')));
    }

    async dbsize(): Promise<number> {
        return this.storage.size;
    }
}
