export interface IUnitOfWorkService {
    runTransaction<T>(callback: (transaction: any) => Promise<T>): Promise<T>;
    beginTransaction(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
}