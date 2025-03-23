import { Column, Entity, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity("media")
@Index("idx_media_ref", ["referenceType", "referenceId"])
@Index("idx_media_type", ["mediaType"])
@Index("idx_media_created_at", ["createdAt"])
export class Media {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  mediaType: string;

  @Column({ type: "varchar", length: 512, nullable: false })
  fileUrl: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  referenceType: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  referenceId: string;

  @Column({ type: "varchar", length: 512, nullable: true })
  thumbnailUrl: string | null;

  @Column({ type: "varchar", length: 50, nullable: true })
  mimeType: string | null;

  @Column({ type: "bigint", nullable: true })
  fileSize: number | null;

  @Column({ type: "int", nullable: true })
  duration: number | null;

  @Column({ type: "json", nullable: true })
  metadata: any;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deletedAt: Date | null;
}