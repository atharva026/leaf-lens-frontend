type Cache<T> = {
  data: T;
  expiresAt: number;
};

/**
 * Get cached data from localStorage if it exists and is not expired.
 * @param key The key to retrieve the cached data from localStorage.
 * @returns The cached data or null if not found or expired.
 */
export function getCached<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const cache: Cache<T> = JSON.parse(raw);

    if (cache.expiresAt <= Date.now()) {
      localStorage.removeItem(key);
      return null;
    }

    return cache.data;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Set cached data in localStorage with an expiration time.
 * @param key The key to store the cached data in localStorage.
 * @param data The data to cache.
 */
export function setCached<T>(
  key: string, 
  data: T, 
  ttl: number = 60 * 60 * 1000,
): void {
  if (typeof window === "undefined") return;

  const cache: Cache<T> = {
    data,
    expiresAt: Date.now() + ttl,
  };

  localStorage.setItem(key, JSON.stringify(cache));
}

/**
 * Delete cached data from localStorage.
 * @param key The key to delete the cached data from localStorage.
 */
export function deleteCached(key: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}