import { AppDataSource } from "@/database/PostgresDB";
import { IPostRepository } from "../interfaces/IPostRepository";
import { Post } from "../models/Post";
import { Repository } from "typeorm";
import { PostQueryParamsDTO } from "../dtos/PostQueryParams.dto";

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
    async getPaginatedPosts(queryParams: PostQueryParamsDTO): Promise<Post[]> {
        const { offset, limit, search, categoryId, sort, order } = queryParams;
    
        const queryBuilder = this.createQueryBuilder('post')
            .skip(offset)
            .take(limit);
    
        if (search) {
            queryBuilder.andWhere('post.title ILIKE :search', { search: `%${search}%` });
        }
    
        if (categoryId) {
            queryBuilder.andWhere('post.categoryId = :categoryId', { categoryId });
        }
    
        if (sort && order) {
            const allowedSortFields = ['title', 'createdAt', 'updatedAt']; 
            if (allowedSortFields.includes(sort)) {
                queryBuilder.orderBy(`post.${sort}`, order);
            }
        }
    
        return await queryBuilder.getMany();
    }
    
}

export default PostRepository;