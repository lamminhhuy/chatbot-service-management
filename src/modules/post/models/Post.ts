import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { PostCategory } from "./PostCategory";

@Entity('posts')
export class Post {
    @Column({type: 'int', primary: true, generated: 'increment'})
    id: number;

    @ManyToOne(() => PostCategory, (postCategory) => postCategory.posts,{eager: true, cascade:true})
    category: PostCategory;

    @Column({type: 'int', nullable: true})
    categoryId: number;

    @Column({type: 'varchar', nullable: false})
    title: string;

    @Column({type: 'text', nullable: false})
    content: string;

    @CreateDateColumn({type: 'timestamp', nullable: false})
    createdAt: Date;

    @CreateDateColumn({type: 'timestamp', nullable: false})
    updatedAt: Date;
    
    static create (title: string, content: string, category: PostCategory) {
        const post = new Post();
        post.title = title;
        post.content = content;
        post.category = category;
        return post;
    }
}
