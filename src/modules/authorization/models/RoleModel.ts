import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../../user/models/UserModel";
import { Permission } from "./PermissionModel";
import { CreateRoleDTO } from "../dtos/CreateRole.dto";

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

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "created_at" })
    createdAt: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "updated_at" })
    updatedAt: Date;
    
    @ManyToMany(() => User, (user) => user.roles)
    users: User[];

    @ManyToMany(() => Permission, (permission) => permission.roles)
    @JoinTable({name: 'role_permissions', joinColumns: [{name: 'role_id', referencedColumnName: 'id'}],
    inverseJoinColumns: [{name: 'permission_id', referencedColumnName: 'id'}]})
    permissions: Permission[];

    static createRole(roleData: CreateRoleDTO): Role {
        const role = new Role();
        role.name = roleData.name;
        role.code = roleData.code;
        role.description = roleData.description;
        return role;
    }

    public addPermission(permission: Permission): void {
        this.permissions.push(permission);
    }

    public removePermission(permission: Permission): void {
        this.permissions = this.permissions.filter(p => p.id !== permission.id);
    }
}
