import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, Index } from "typeorm";
import { Post } from "./Post";
import { generateSlug } from "../utils/generateSlug";

@Entity('post_categories')
export class PostCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, unique: true, nullable: false })
    name: string;
    @ManyToOne(() => PostCategory, (parent) => parent.children, { nullable: true })
    parent: PostCategory;

    @Column({ type: "varchar", length: 255, name: "friendly_slug", unique: true, nullable: true })
    friendlySlug: string;

    @Column({ type: "int", nullable: true })
    @Index()
    parentId: number | null;

    @OneToMany(() => PostCategory, (child) => child.parent)
    children: PostCategory[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Post, (post) => post.category)
    posts: Post[];

    static create(name: string, friendlySlug: string, parentId: number| null): PostCategory {
        const postCategory = new PostCategory();
        postCategory.name = name;
        postCategory.friendlySlug = friendlySlug || generateSlug(name);
        postCategory.parentId = parentId;
        return postCategory;
    }
}
