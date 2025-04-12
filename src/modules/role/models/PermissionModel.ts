import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToMany, Unique } from "typeorm";
import { Role } from "./RoleModel";

@Entity('permissions')
export class Permission {

    constructor(name: string, code: string, description: string)
    {
        this.name = name;
        this.code = code;
        this.description = description;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string; 

    @Column({ type: 'varchar', length: 255, unique:true })
    code: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @ManyToMany(() => Role, (role) => role.permissions)
    roles: Role[];
}