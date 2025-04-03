import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Message } from "./Message";
import { User } from "@/modules/user/models/UserModel";

@Entity('conversations')
export class Conversation {

    constructor( title: string) {
        this.title = title;
    }
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: "text" })
    title: string;

    @CreateDateColumn({name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name:'updated_at'})
    updatedAt: Date;

    @ManyToMany(() => User, (user) => user.conversations)
    @JoinTable({
      name: 'conversation_participants',
      joinColumn: { name: 'conversation_id', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    })
    users: User[];


    @OneToMany(() => Message, (message) => message.conversation)
    messages: Message[];

    static createConversation(title: string): Conversation {
        return new Conversation(title)
    }
}