import { 
    Entity, Column, PrimaryGeneratedColumn, ManyToOne, 
    JoinColumn, Index, CreateDateColumn, 
    JoinTable
} from 'typeorm';
import { User } from './UserModel';

@Entity('user_sessions')
export class UserSession {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number; 

    @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE', eager: true,nullable: false })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id'})
    user: User;

    @Index('idx_access_token') 
    @Column({ type: 'text', name: 'access_token', nullable: false })
    accessToken: string;

    @Index('idx_refresh_token') 
    @Column({ type: 'text', name: 'refresh_token', nullable: false })
    refreshToken: string;

    @Column({ type: 'varchar', length: 255, name: 'device_info', nullable: true })
    deviceInfo?: string;

    @Column({ type: 'varchar', length: 45, name: 'ip_address', nullable: true })
    ipAddress?: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', name: 'expires_at', nullable: true })
    expiresAt?: Date;
    
    @Column({ type: 'boolean', name: 'is_revoked', default: false })
    isRevoked: boolean;

    static create(data: {accessToken: string, refreshToken: string, user: User} ): UserSession {
        const userSession = new UserSession();
        userSession.accessToken = data.accessToken;
        userSession.refreshToken = data.refreshToken;
        userSession.user = data.user;
        return userSession;
    }
}
