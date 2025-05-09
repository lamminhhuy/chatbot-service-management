import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, Index } from "typeorm";
import { Post } from "./Post";
import { transformToSlug } from "../utils/transformToSlug";

@Entity('post_categories')
export class PostCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;

    @ManyToOne(() => PostCategory, (parent) => parent.children, { nullable: true })
    parent: PostCategory | null;

    @Column({ type: "varchar", length: 255, name: "friendly_slug", nullable: true })
    friendlySlug: string;

    @Column({ type: "varchar", length: 255, name: "full_slug", nullable: true,unique: true  })
     fullSlug: string;

    @Column({ type: "int", nullable: true, default: null })
    @Index()
    parentId: number | null;

    @OneToMany(() => PostCategory, (child) => child.parent, { onDelete: 'CASCADE' })
    children: PostCategory[];

    @CreateDateColumn({name: "created_at"})
    createdAt: Date;

    @UpdateDateColumn({name: "updated_at"})
    updatedAt: Date;

    @OneToMany(() => Post, (post) => post.category)
    posts: Post[];

    static create(name: string, friendlySlug: string | null, parents: PostCategory[] | null): PostCategory {
        const postCategory = new PostCategory();
        postCategory.name = name;
        postCategory.friendlySlug = friendlySlug || transformToSlug(name).slug;

        postCategory.parent = parents && parents.length > 0 ? parents[parents.length - 1] : null;

        if (parents && parents.length > 0) {
            const parentSlugs = parents.map(parent => parent.friendlySlug).join('/');
            postCategory.fullSlug = `${parentSlugs}/${postCategory.friendlySlug}`;
        } else {
            postCategory.fullSlug = postCategory.friendlySlug;
        }

        return postCategory;
    }

    updateSlug(friendlySlug: string, parents: PostCategory[] | null): void {
        this.friendlySlug = friendlySlug;

        if (parents && parents.length > 0) {
            const parentSlugs = parents.map(parent => parent.friendlySlug).join('/');
            this.fullSlug = `${parentSlugs}/${this.friendlySlug}`;
        } else {
            this.fullSlug = this.friendlySlug;
        }
    }
}