import { AppDataSource } from "@/database/PostgresDB";
import { IPostRepository } from "../interfaces/IPostRepository";
import { Post } from "../models/Post";
import { Not, Repository } from "typeorm";
import { PostQueryParamsDTO } from "../dtos/PostQueryParams.dto";

class PostRepository extends Repository<Post> implements IPostRepository {
  constructor() {
    super(Post, AppDataSource.manager);
  }

  async findAll(): Promise<Post[]> {
    return this.find();
  }

  async findById(id: number): Promise<Post | null> {
    return this.findOne({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Post | null> {
    return this.findOne({ where: { slug } });
  }



  async getPaginatedPosts(queryParams: PostQueryParamsDTO): Promise<{ items: Post[]; total: number }> {
    const { offset, limit, search, categoryId, sort, order } = queryParams;

    const queryBuilder = this.createQueryBuilder("post");

    if (search) {
      queryBuilder.andWhere("post.title ILIKE :search", { search: `%${search}%` });
    }

    if (categoryId) {
      queryBuilder.andWhere("post.category = :categoryId", { categoryId });
    }

    if (sort && order) {
      const allowedSortFields = ["title", "createdAt", "updatedAt"];
      if (allowedSortFields.includes(sort)) {
        queryBuilder.orderBy(`post.${sort}`, order);
      }
    }

    queryBuilder.skip(offset).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }


  async getRelatedPosts(id: number): Promise<Post[]> {
    return this.find({
        where: {
            id: Not(id)
        },
        relations: {
            category: true
        },
        order: {
            createdAt: 'DESC'
        },
        take: 5
    });
  }
  deletePost(post: Post): Promise<Post> {
    return this.remove(post);
  }
}

export default PostRepository;