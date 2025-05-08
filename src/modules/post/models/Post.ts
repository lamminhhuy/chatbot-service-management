import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { PostCategory } from "./PostCategory";
import { transformToSlug } from "../utils/transformToSlug";

@Entity('posts')
export class Post {
    @Column({type: 'int', primary: true, generated: 'increment'})
    id: number;

    @ManyToOne(() => PostCategory, (postCategory) => postCategory.posts, { eager: true })
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
    
    @Column({type: 'varchar', nullable: false})
    slug: string;
    
    @Column({type: 'varchar', nullable: false})
    shortDescription: string;
    
    public updateTitle(title: string): void {
        this.title = title;
        this.slug =  `${this.category.fullSlug}/${transformToSlug(title)}`;
    }
    static create (title: string, content: string,shortDescription:string, category: PostCategory) {
        const post = new Post();
        post.title = title;
        post.content = content;
        post.category = category;
        post.shortDescription = shortDescription;
        post.slug =  `${category.fullSlug}/${transformToSlug(title)}`;
        return post;
    }
}
