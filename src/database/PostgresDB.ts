// src/database/index.ts
import { DataSource } from 'typeorm';
import { env } from '@/configs/envConfig';
import { User } from '@/modules/user/models/UserModel';
import { UserRole } from '@/modules/user/models/UserRoleModel';
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    entities: [User,UserRole],
    synchronize: true, 
    logging: env.NODE_ENV === 'dev',
    migrations: ['src/database/migrations/*.ts'],
    poolSize: env.POSTGRES_MAX_POOL_SIZE || 10,
    ssl: true
});

export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

export const closeDatabase = async () => {
    try {
        await AppDataSource.destroy();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error closing database:', error);
        throw error;
    }
};

