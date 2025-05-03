import { AppDataSource } from "@/database/PostgresDB";
import { IPostRepository } from "../interfaces/IPostRepository";
import { Post } from "../models/Post";
import { Repository } from "typeorm";

class PostRepository extends Repository<Post> implements IPostRepository {
    constructor() {
        super(Post, AppDataSource.manager);
    }
    findAll(): Promise<Post[]> {
        return this.find();
    }
    deletePost(post: Post): Promise<Post> {
        return this.remove(post);
    }
    findById(id: number): Promise<Post | null> {
        return this.findOne({ where: { id } });
    }
    
}

export default PostRepository;