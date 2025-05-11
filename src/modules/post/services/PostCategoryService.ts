import { inject, injectable } from "tsyringe";
import { CreatePostCategoryDTOType } from "../dtos/CreatePostCategory.dto";
import { IPostCategoryRepository } from "../interfaces/IPostCategoryRepository";
import { PostCategory } from "../models/PostCategory";
import { BadRequestResponseError } from "@/shared/response/errors.response";
import { UpdatePostCategoryDTOType } from "../dtos/UpdatePostCategory.dto";
import { transformToSlug } from "../utils/transformToSlug";
import { PostCategoryQueryParamsDTO } from "../dtos/PostCategoryQueryParams.dto";
import { PaginatedResponse, PaginatedResponseSchema } from "@/shared/dtos/PaginatedResponse.dto";
import { buildPaginatedResponse } from "@/shared/utils/buildPaginatedResponse";
import { PostCategoryResponseDTO, PostCategoryResponseDTOSchema } from "../dtos/PostCategory.dto";

@injectable()
class PostCategoryService {
  constructor(
    @inject("IPostCategoryRepository")
    private readonly postCategoryRepo: IPostCategoryRepository
  ) {
    this.postCategoryRepo = postCategoryRepo;
  }
  async createPostCategory(
    input: CreatePostCategoryDTOType
  ): Promise<PostCategory> {
    let parents: PostCategory[] | null = [];
    let childParent: PostCategory | null = null;
    const isExsitedByName = await this.postCategoryRepo.existedByName(input.name);
    if(isExsitedByName)
    {
      throw new BadRequestResponseError("Post category name already exists");
    }
    
    if(input.parentId)
    {
   await this.findParent(input.parentId);
   childParent = await this.findParent(input.parentId);
    parents = await this.postCategoryRepo.findAllParentsRecursive(input.parentId);
    parents.push(childParent);
    }
    
    const postCategory = await this.postCategoryRepo.save(
      PostCategory.create(input.name, input.friendlySlug, parents)
    );
    return postCategory;
  }
  async getAll(): Promise<PostCategory[]> {
    return this.postCategoryRepo.findAll();
  }
  async deletePostCategory(id: number): Promise<PostCategory> {
    const postCategory = await this.postCategoryRepo.findById(id);
    if (!postCategory) {
      throw new BadRequestResponseError("Post category not found");
    }
    return this.postCategoryRepo.deletePost(postCategory);
  }
  async updatePostCategory(
    id: number,
    input: UpdatePostCategoryDTOType
  ): Promise<PostCategory> {
    const postCategory = await this.postCategoryRepo.findById(id);
    if (!postCategory) {
      throw new BadRequestResponseError("Post category not found");
    }
    if(input.name !== postCategory.name)
    {
      await this.nameValidation(input.name);
    }
    if(input.friendlySlug !== postCategory.friendlySlug)
    {
      await this.friendlySlugValidation(input.friendlySlug);
    }
   let parentCategories: PostCategory[] = []
    if (input.parentId) {
      const parent = await this.findParent(input.parentId);
      parentCategories = await this.postCategoryRepo.findAllParentsRecursive(input.parentId);
      postCategory.parentId = parent.id;
    }
    postCategory.name = input.name;
    postCategory.friendlySlug = input.friendlySlug || transformToSlug(input.name).slug;
    postCategory.updateSlug(postCategory.friendlySlug,parentCategories);
    return this.postCategoryRepo.save(postCategory);
  }

  private async findParent(parentId: number): Promise<PostCategory> {
    const parent = await this.postCategoryRepo.findById(parentId);
    if (!parent) {
      throw new BadRequestResponseError("Parent post category not found");
    }
    return parent;
  }
  getBySlug(slug: string): Promise<PostCategory|null> {
    const category = this.postCategoryRepo.findByFriendlySlug(slug);
    return category;
  }
  async getById(id: number): Promise<PostCategory> {
    const postCategory = await this.postCategoryRepo.findById(id);
    if (!postCategory) {
      throw new BadRequestResponseError("Post category not found");
    }
    return postCategory;
  }
  async getAllPostCategory(): Promise<PostCategory[]> {
    return this.postCategoryRepo.findAll();
  }
 private async nameValidation(name: string): Promise<boolean> {
    const isExsitedByName = await this.postCategoryRepo.findByName(name);
    if (isExsitedByName) {
      throw new BadRequestResponseError("Post category name already exists");
    }
    return true;
  }
async  friendlySlugValidation(friendlySlug: string): Promise<boolean> {
    const isExsitedByFriendlySlug =
      await this.postCategoryRepo.findByFriendlySlug(friendlySlug);
    if (isExsitedByFriendlySlug) {
      throw new BadRequestResponseError(
        "Post category friendly slug already exists"
      );
    }
    return true;
  }
  async getPaginatedPostCategories(queryParams: PostCategoryQueryParamsDTO): Promise<PaginatedResponse<PostCategoryResponseDTO>> {
    const { items, total } = await this.postCategoryRepo.getPaginatedPostCategories(queryParams);
    const paginatedPostCategories = buildPaginatedResponse({
      items: items,
      meta: {
        total,
        limit: queryParams.limit,
        offset: queryParams.offset
      }
    });
    return paginatedPostCategories;
  }
}

export default PostCategoryService;
