import { Media } from "@/modules/media/models/MediaModel";
import { Column, CreateDateColumn, Entity } from "typeorm";

@Entity('posts')
export class Post {
    @Column({type: 'int', primary: true, generated: 'increment'})
    id: number;

    @Column({type: 'varchar', nullable: false})
    title: string;

    @Column({type: 'text', nullable: false})
    content: string;

    @CreateDateColumn({type: 'timestamp', nullable: false})
    createdAt: Date;

    @CreateDateColumn({type: 'timestamp', nullable: false})
    updatedAt: Date;
    
    static create (title: string, content: string) {
        const post = new Post();
        post.title = title;
        post.content = content;
        return post;
    }
}
