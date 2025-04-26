import { Post } from "../models/Post";

export interface IPostRepository {
    save: (post: Post) => Promise<Post>;
    findAll: () => Promise<Post[]>;
    findById: (id: number) => Promise<Post | null>;
    deletePost: (post: Post) => Promise<Post>;
}