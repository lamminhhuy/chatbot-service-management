import { AppDataSource } from "@/shared/infrastructure/database/PostgresDB";
import { IUnitOfWorkService } from "@/modules/user/interfaces/IUnitOfWorkService";
import { EntityManager, DataSource } from "typeorm";
import { injectable } from 'tsyringe';

@injectable()
export class TypeOrmUnitOfWork implements IUnitOfWorkService {
  constructor(private dataSource: DataSource = AppDataSource) {
    if (!dataSource.isInitialized) {
      throw new Error('DataSource is not initialized');
    }
  }

  async runTransaction<T>(fn: (entityManager: EntityManager) => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await fn(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async beginTransaction(): Promise<void> {
    throw new Error('Use runTransaction instead');
  }

  async commit(): Promise<void> {
    throw new Error('Use runTransaction instead');
  }

  async rollback(): Promise<void> {
    throw new Error('Use runTransaction instead');
  }
}