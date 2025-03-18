import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm';
import { UserRole } from './UserRoleModel';

@Entity('users')
@Index('idx_email', ['email'])
@Index('idx_google_id', ['googleId'])
@Index('idx_fullname', ['fullName'])
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true})
  email: string;

  @Column({ type: 'varchar', length: 50, unique: true})
  fullName: string; 

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100, unique: true})
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

  @OneToMany(() => UserRole, (userRole) => userRole.user, { cascade: true })
  userRoles: UserRole[];
}