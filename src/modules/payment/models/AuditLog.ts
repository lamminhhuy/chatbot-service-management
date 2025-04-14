import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { AuditAction } from "../enums/AuditAction";
import { ActionByType } from "../enums/ActionByType";

@Entity('audit_logs')
@Index(['entityType', 'entityId'])
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({type: 'varchar', length: 50, name: 'entity_type'})
    entityType: string;
    @Column({type: 'bigint', name: 'entity_id', nullable: false})
    entityId: number;
    @Column({type: 'enum', enum: AuditAction, name: 'action'})
    action: AuditAction;
    @Column({type: 'varchar', length: 100, name: 'action_by'})
    actionBy: string;
    @Column({type: 'enum', enum: ActionByType, name: 'action_by_type'})
    actionByType: ActionByType;
    @Column({name:'old_data', type: 'jsonb', nullable: true})
    oldData: Record<string, any> | null;
    @Column({name:'new_data', type: 'jsonb', nullable: true})
    newData: Record<string, any> | null;
    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;
    @Column({name:'diff', type: 'jsonb', nullable: true})
    diff: Record<string, any> | null;
    @Column({
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    })
    updatedAt: Date;
    @Column({name: 'reason', type: 'varchar', length: 255, nullable: true})
    reason: string | null;
    @Column({ type: "timestamp", nullable: true })
    deletedAt: Date | null;
}   
