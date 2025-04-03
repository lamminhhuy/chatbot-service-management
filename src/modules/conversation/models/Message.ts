import { User } from "@/modules/user/models/UserModel";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Conversation } from "./Conversation";
import { ChatRole } from "../enums/ChatRole";
import { Exclude } from "class-transformer";

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('increment')
    id: number; 
   
    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn({name:'created_at'})
    createdAt: Date;

    @Column({ 
        type: 'enum', 
        enum: ChatRole, 
        default: ChatRole.User 
    })
    role: ChatRole;

    @ManyToOne(() => User, (user) => user.messages, { nullable: true })
    @JoinColumn({
        name: 'sender_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_message_sender'
    })
    sender: User;

    @ManyToOne(() => Conversation, (conversation) => conversation.messages)
    @JoinColumn({
        name: 'conversation_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_message_conversation'
    })
    @Exclude()
    conversation: Conversation;

    public static createMessage(content: string, sender: User, role: ChatRole, conversation: Conversation) {
        const message = new Message();
        message.content = content;
        message.sender = sender;
        message.role = role;
        message.conversation = conversation;
        return message;
    }
}