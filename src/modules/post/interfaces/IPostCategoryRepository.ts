import { PostCategory } from "../models/PostCategory";

export interface IPostCategoryRepository {
    findAll(): Promise<PostCategory[]>;
    findById(id: number): Promise<PostCategory | null>;
    existedByName(name: string): Promise<boolean>;
    save(postCategory: PostCategory): Promise<PostCategory>;
    deletePost(postCategory: PostCategory): Promise<PostCategory>;
    findByName(name: string): Promise<PostCategory| null>;
    findByFriendlySlug(friendlySlug: string): Promise<PostCategory| null>;
    findAllParentsRecursive(childParentId: number): Promise<PostCategory[]>;
}
