import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './UserModel';



@Entity('user_sessions')
export class UserSession {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'bigint', name: 'user_id', nullable: false })
    userId: number;

    @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE', eager:true })
    @JoinColumn({ name: 'user_id' }) 
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
    is_revoked: boolean
}
