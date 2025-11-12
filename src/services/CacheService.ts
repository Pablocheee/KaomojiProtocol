export class CacheService {
    private cache = new Map();
    private ttl = new Map();

    set(key: string, value: any, ttl: number = 30000) {
        this.cache.set(key, value);
        this.ttl.set(key, Date.now() + ttl);
        setTimeout(() => this.delete(key), ttl);
    }

    get(key: string): any {
        if (this.ttl.get(key) < Date.now()) {
            this.delete(key);
            return null;
        }
        return this.cache.get(key);
    }

    delete(key: string) {
        this.cache.delete(key);
        this.ttl.delete(key);
    }
}
