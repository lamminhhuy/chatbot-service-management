import { AppDataSource } from "@/shared/infrastructure/database/PostgresDB";
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
  async getTotalPostWithMonthlyGrowth(): Promise<{
    total: number;
    currentMonth: number;
    previousMonth: number;
    growthRate: number;
  }> {
    const now = new Date();
  
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  
    const [totalResult, currentResult, previousResult] = await Promise.all([
      this.createQueryBuilder('post')
        .select('COUNT(*)', 'count')
        .getRawOne(),
  
      this.createQueryBuilder('post')
        .select('COUNT(*)', 'count')
        .where('post."createdAt" BETWEEN :start AND :end', {
          start: currentMonthStart,
          end: currentMonthEnd,
        })
        .getRawOne(),
  
      this.createQueryBuilder('post')
        .select('COUNT(*)', 'count')
        .where('post."createdAt" BETWEEN :start AND :end', {
          start: previousMonthStart,
          end: previousMonthEnd,
        })
        .getRawOne(),
    ]);
  
    const total = Number(totalResult?.count ?? 0);
    const currentMonth = Number(currentResult?.count ?? 0);
    const previousMonth = Number(previousResult?.count ?? 0);
  
    const growthRate =
      previousMonth === 0
        ? currentMonth > 0 ? 100 : 0
        : ((currentMonth - previousMonth) / previousMonth) * 100;
  
    return {
      total,
      currentMonth,
      previousMonth,
      growthRate: parseFloat(growthRate.toFixed(2)),
    };
  }
}

export default PostRepository;