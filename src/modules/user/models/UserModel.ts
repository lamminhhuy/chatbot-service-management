import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany, ManyToMany, JoinTable } from 'typeorm';

import { UserSession } from './UserSessionModel';
import { Message } from '@/modules/conversation/models/Message';
import { Conversation } from '@/modules/conversation/models/Conversation';
import { UserSubscription } from '@/modules/subscription/models/UserSubscription';
import { Role } from '@/modules/authorization/models/RoleModel';

@Entity('users')
@Index('idx_email', ['email'])
@Index('idx_google_id', ['googleId'])
@Index('idx_username', ['username'])
export class User {
  constructor(
    email: string,
    username: string,
    phoneNumber: string | null,
    password: string,
    avatarUrl: string | null,
    roles: Role[],
  ) {
    this.email = email;
    this.username = username;
    this.phoneNumber = phoneNumber;
    this.password =  password;
    this.avatarUrl = avatarUrl ?? null;
    this.roles =roles
  }
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true})
  email: string;

  @Column({ type: 'varchar', length: 50, unique: false})
  username: string; 

  @Column({ type: 'varchar', length: 15, unique: true, nullable: true, name:'phone_number' })
  phoneNumber: string| null; 

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true,name:'avatar_url' })
  avatarUrl: string | null;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'banned', 'pending'],
    default: 'active',
  })
  status: 'active' | 'inactive' | 'banned' | 'pending'; 

  @Column({ type: 'boolean', default: false,name: 'email_verified' })
  emailVerified: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'last_login_at' })
  lastLoginAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  jwtRefreshTokenExpiresAt: Date | null;


  @ManyToMany(() => Role, (role) => role.users, { cascade: true, eager:true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },

  },)
  roles: Role[];

  @Column({ type: 'varchar', length: 255, nullable: true, name:'google_id' })
  googleId: string;

  @OneToMany(()=> UserSession, (session)=> session.user )
  sessions: UserSession[]

  @OneToMany(()=> Message, (message)=> message.sender)
  messages: Message[]

  @ManyToMany(() => Conversation, (conversation) => conversation.users, { cascade: true })
  conversations: Conversation[]

  public static getChatBot(): User {
  return {
    id: 999999,
    username: 'chatbot',
    roles: [{
      id: 1,
      name: 'assistant',
      code: 'ASSISTANT',
      description: 'Chatbot Assistant',
      createdAt: new Date(),
      updatedAt: new Date()
    }],
  } as unknown as User;
  }
  
  public assginRole(role: Role): User {
    this.roles.push(role)
    return this
  }

  public removeRole(role: Role): User {
    this.roles = this.roles.filter(r => r.id !== role.id)
    return this
  }
  userSubscription: UserSubscription;
}