import { AppDataSource } from "@/database/PostgresDB";
import { PostCategory } from "../models/PostCategory";
import { Repository } from "typeorm";
import { IPostCategoryRepository } from "../interfaces/IPostCategoryRepository";

export default class PostCategoryRepository extends Repository<PostCategory> implements IPostCategoryRepository {
    constructor() {
        super( PostCategory, AppDataSource.manager );
    }

    findAll(): Promise<PostCategory[]> {
        return this.find();
    }

    findById(id: number): Promise<PostCategory | null> {
        return this.findOneBy({ id });
    }

    deletePost(postCategory: PostCategory): Promise<PostCategory> {
        return this.remove(postCategory);
    }
}
