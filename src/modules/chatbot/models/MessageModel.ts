import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ChatRole } from "../enums/ChatRole";
import { Media } from "@/modules/media/models/MediaModel";


@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum'})
  role: ChatRole;

  @Column({ type: 'json', nullable: true })
  metadata?: Media; 

}