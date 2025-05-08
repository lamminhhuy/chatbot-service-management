import { AppDataSource } from "@/database/PostgresDB";
import { IPostRepository } from "../interfaces/IPostRepository";
import { Post } from "../models/Post";
import { Not, Repository } from "typeorm";
import { PostQueryParamsDTO } from "../dtos/PostQueryParams.dto";

class PostRepository extends Repository<Post> implements IPostRepository {
  constructor() {
    if (!AppDataSource.isInitialized) {
      throw new Error("AppDataSource is not initialized");
    }
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

    queryBuilder.leftJoinAndSelect("post.category", "category");

    if (categoryId) {
      let recursiveQuery: string;
      let queryParamsArray: any[];

      recursiveQuery = `
        WITH RECURSIVE category_hierarchy AS (
          SELECT id
          FROM post_categories
          WHERE id = $1
          UNION ALL
          SELECT c.id
          FROM post_categories c
          INNER JOIN category_hierarchy ch ON c."parentId" = ch.id
        )
        SELECT id FROM category_hierarchy
      `;
      queryParamsArray = [categoryId];

      try {
        const categoryIds = await this.manager
          .query(recursiveQuery, queryParamsArray)
          .then((results) => results.map((row: { id: number }) => row.id));

        if (categoryIds.length > 0) {
          queryBuilder.andWhere("post.categoryId IN (:...categoryIds)", { categoryIds });
        } else {
          queryBuilder.andWhere("1 = 0");
        }
      } catch (error) {
        throw new Error(`Failed to fetch category hierarchy: ${error}`);
      }
    }

    if (search) {
      queryBuilder.andWhere("post.title ILIKE :search", { search: `%${search}%` });
    }

    if (sort && order) {
      const allowedSortFields = ["title", "createdAt", "updatedAt"];
      if (allowedSortFields.includes(sort)) {
        queryBuilder.orderBy(`post.${sort}`, order);
      }
    }

    queryBuilder.orderBy(`post.${sort ? sort : "createdAt"}`, order ? order : "DESC");

    queryBuilder.skip(offset).take(limit);

    try {
      const [items, total] = await queryBuilder.getManyAndCount();
      return { items, total };
    } catch (error) {
      throw new Error(`Failed to fetch paginated posts: ${error}`);
    }
  }

  async getRelatedPosts(id: number): Promise<Post[]> {
    return this.find({
      where: {
        id: Not(id),
      },
      relations: {
        category: true,
      },
      order: {
        createdAt: "DESC",
      },
      take: 5,
    });
  }

  async deletePost(post: Post): Promise<Post> {
    return this.remove(post);
  }
}

export default PostRepository;