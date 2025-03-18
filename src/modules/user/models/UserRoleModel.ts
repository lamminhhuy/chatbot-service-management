import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./UserModel";
@Entity('users_roles')
export class UserRole {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'enum', enum: ['admin', 'user', 'manager'], default: 'user' })
    role: string; 
    @ManyToOne(() => User, user => user.userRoles)
    user: User;
}