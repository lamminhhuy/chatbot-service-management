import { Column, Entity, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity("media")
@Index("idx_media_ref", ["referenceType", "referenceId"])
@Index("idx_media_type", ["mediaType"])
@Index("idx_media_created_at", ["createdAt"])
export class Media {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @Column({name: "media_type", type: "varchar", length: 50, nullable: false })
  mediaType: string;

  @Column({name: "file_url", type: "varchar", length: 512, nullable: false })
  fileUrl: string;

  @Column({name: "reference_type", type: "varchar", length: 50, nullable: false })
  referenceType: string;

  @Column({name: "reference_id", type: "varchar", length: 255, nullable: false })
  referenceId: string;

  @Column({name: "thumbnail_url", type: "varchar", length: 512, nullable: true })
  thumbnailUrl: string | null;

  @Column({name: "mime_type", type: "varchar", length: 50, nullable: true })
  mimeType: string | null;

  @Column({name: "file_size", type: "bigint", nullable: true })
  fileSize: number | null;

  @Column({ name: "duration", type: "int", nullable: true })
  duration: number | null;

  @Column({name: "metadata", type: "json", nullable: true })
  metadata: any;
  
  @Column({name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
  
  @Column({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @Column({name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt: Date | null;

  static create(parms: {fileUrl: string, mediaType: string, referenceType: string, referenceId: string, mimeType: string}): Media {
    const media = new Media();
    media.fileUrl = parms.fileUrl;
    media.mediaType = parms.mediaType;
    media.referenceType = parms.referenceType;
    media.referenceId = parms.referenceId;
    return media;
}
}
