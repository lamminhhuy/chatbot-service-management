export interface ICacheProvider<T> {
    set(key: string, value: T): Promise<void>;
    get(key: string): Promise<T | null>;
    delete(key: string): Promise<void>;
    setEx(key: string, value: T, ttl: number): Promise<void>;
  }