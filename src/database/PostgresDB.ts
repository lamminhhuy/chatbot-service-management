// src/database/index.ts
import { DataSource } from 'typeorm';
import { env } from '@/configs/envConfig';
import { Role } from '@/modules/role/models/RoleModel';
import { User } from '@/modules/user/models/UserModel';
import { UserSession } from '@/modules/user/models/UserSessionModel';
import { Conversation } from '@/modules/conversation/models/Conversation';
import { Message } from '@/modules/conversation/models/Message';
import { Permission } from '@/modules/role/models/PermissionModel';
import { Subscription } from '@/modules/subscription/models/Subscription';
import { UserSubscription } from '@/modules/subscription/models/UserSubscription';
import Payment from '@/modules/payment/models/Payment';
import { AuditLog } from '@/modules/payment/models/AuditLog';
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    entities: [Role, User, UserSession, Message, Conversation, Permission,Subscription,UserSubscription,Payment,AuditLog],
    synchronize: env.NODE_ENV === 'dev', 
    logging: env.NODE_ENV === 'dev',
    migrations: env.NODE_ENV === 'dev' ? ['src/database/migration/*.ts']: ['dist/database/migration/*.js'],
    poolSize: env.POSTGRES_MAX_POOL_SIZE || 10,
    ssl:  false
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

