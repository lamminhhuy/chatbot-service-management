import { AppDataSource } from "@/database/PostgresDB";
import { PostCategory } from "../models/PostCategory";
import { Like, Repository } from "typeorm";
import { IPostCategoryRepository } from "../interfaces/IPostCategoryRepository";
import { PostCategoryQueryParamsDTO } from "../dtos/PostCategoryQueryParams.dto";

export default class PostCategoryRepository extends Repository<PostCategory> implements IPostCategoryRepository {
    constructor() {
        super(PostCategory, AppDataSource.manager);
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

    findByName(name: string): Promise<PostCategory | null> {
        return this.findOneBy({ name });
    }

    findByFriendlySlug(friendlySlug: string): Promise<PostCategory | null> {
        return this.findOneBy({ friendlySlug });
    }

    getAllParentPostCategory(parentId: number): Promise<PostCategory[]> {
        return this.find({ where: { parent: { id: parentId } } });
    }

    async findAllParentsRecursive(childParentId: number): Promise<PostCategory[]> {
        const parents: PostCategory[] = [];

        let current = await this.findOne({
            where: { id: childParentId },
            relations: ['parent'],
        });

        while (current?.parent) {
            parents.push(current.parent);
            current = await this.findOne({
                where: { id: current.parent.id },
                relations: ['parent'],
            });
        }

        return parents;
    }
    async findFullSlug(slug: string): Promise<PostCategory | null> {
        return this.findOneBy({ fullSlug: slug });
    }

    existedByName(name: string): Promise<boolean> {
        return this.existsBy({ name });
    }
    async getPaginatedPostCategories(
        queryParams: PostCategoryQueryParamsDTO
      ): Promise<{ items: PostCategory[]; total: number }> {
        const {
          limit = 10,
          offset = 0,
          search,
          sort,
          order = 'ASC',
        } = queryParams;
      
        const where = search
          ? [
              { name: Like(`%${search}%`) },
              { friendlySlug: Like(`%${search}%`) },
            ]
          : {};
      
        const findOptions: any = {
          where,
          take: limit,
          skip: offset,
        };
      
        if (sort) {
          findOptions.order = {
            [sort]: order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
          };
        }
      
        const [items, total] = await this.findAndCount(findOptions);
      
        return { items, total };
      
    }
}
