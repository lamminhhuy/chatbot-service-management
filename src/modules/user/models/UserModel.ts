import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany, ManyToMany, JoinTable } from 'typeorm';

import { UserSession } from './UserSessionModel';
import { Role } from '../../role/models/RoleModel';
@Entity('users')
@Index('idx_email', ['email'])
@Index('idx_google_id', ['googleId'])
@Index('idx_username', ['username'])
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true})
  email: string;

  @Column({ type: 'varchar', length: 50, unique: true})
  username: string; 

  @Column({ type: 'varchar', length: 15, unique: true, nullable: true})
  phoneNumber: string| null; 

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true})
  googleId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatarUrl: string | null;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'banned', 'pending'],
    default: 'pending',
  })
  status: 'active' | 'inactive' | 'banned' | 'pending'; 

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  jwtRefreshTokenExpiresAt: Date | null;

  @ManyToMany(() => Role, (role) => role.users, { cascade: true, eager:true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },

  },)
  roles: Role[];
  
  @OneToMany(()=> UserSession, (session)=> session.user )
  sessions: UserSession[]
}