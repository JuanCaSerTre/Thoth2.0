/**
 * Cache Service - LocalStorage-based caching for recommendations
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

const CACHE_PREFIX = 'thoth_cache_';

export const cacheService = {
  /**
   * Set a cache item with expiration
   */
  set<T>(key: string, data: T, expiresInMinutes: number = 60): void {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresIn: expiresInMinutes * 60 * 1000
      };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Cache set error:', error);
    }
  },

  /**
   * Get a cache item if not expired
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(CACHE_PREFIX + key);
      if (!item) return null;

      const cached: CacheItem<T> = JSON.parse(item);
      const now = Date.now();

      if (now - cached.timestamp > cached.expiresIn) {
        this.remove(key);
        return null;
      }

      return cached.data;
    } catch (error) {
      console.warn('Cache get error:', error);
      return null;
    }
  },

  /**
   * Remove a cache item
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
      console.warn('Cache remove error:', error);
    }
  },

  /**
   * Clear all cache items
   */
  clearAll(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  },

  /**
   * Clear expired cache items
   */
  clearExpired(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          const item = localStorage.getItem(key);
          if (item) {
            const cached = JSON.parse(item);
            if (Date.now() - cached.timestamp > cached.expiresIn) {
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.warn('Cache clear expired error:', error);
    }
  }
};
