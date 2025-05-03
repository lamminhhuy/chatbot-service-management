import { PostCategory } from "../models/PostCategory";

export interface IPostCategoryRepository {
    findAll(): Promise<PostCategory[]>;
    findById(id: number): Promise<PostCategory | null>;
    save(postCategory: PostCategory): Promise<PostCategory>;
    deletePost(postCategory: PostCategory): Promise<PostCategory>;
}
