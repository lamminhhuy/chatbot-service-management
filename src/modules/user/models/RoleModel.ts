import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./UserModel";

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('increment')
        id: number;
    @Column({type: "varchar", length: 50})
    @Unique(['name'])
    name: string;

    @Column({ type: "varchar", length: 50 })
    @Unique(['code'])
    code: string;
    @Column({ type: "varchar", length: 255 })
    description: string;
    createdAt: Date;
    updatedAt: Date;
    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}