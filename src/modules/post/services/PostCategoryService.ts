import { inject, injectable } from "tsyringe";
import { CreatePostCategoryDTOType } from "../dtos/CreatePostCategory.dto";
import { IPostCategoryRepository } from "../interfaces/IPostCategoryRepository";
import { PostCategory } from "../models/PostCategory";
import { BadRequestResponseError } from "@/shared/response/errors.response";
import { UpdatePostCategoryDTOType } from "../dtos/UpdatePostCategory.dto";

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
      await this.inputValidation(input);
    }
    if(input.friendlySlug !== postCategory.friendlySlug)
    {
      await this.inputValidation(input);
    }
   let parentCategories: PostCategory[] = []
    if (input.parentId) {
      const parent = await this.findParent(input.parentId);
      parentCategories = await this.postCategoryRepo.findAllParentsRecursive(input.parentId);
      postCategory.parentId = parent.id;
    }
    postCategory.name = input.name;
    postCategory.friendlySlug = input.friendlySlug;
    postCategory.updateSlug(input.friendlySlug,parentCategories);
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
  private async inputValidation(
    input: CreatePostCategoryDTOType | UpdatePostCategoryDTOType
  ): Promise<void> {
    const isExsitedByName = await this.postCategoryRepo.findByName(input.name);
    if (isExsitedByName) {
      throw new BadRequestResponseError("Post category name already exists");
    }
    if (input.friendlySlug) {
      const isExsitedByFriendlySlug =
        await this.postCategoryRepo.findByFriendlySlug(input.friendlySlug);
      if (isExsitedByFriendlySlug) {
        throw new BadRequestResponseError(
          "Post category friendly slug already exists"
        );
      }
    }

    if (input.parentId) {
      const parent = await this.findParent(input.parentId);
      if (!parent) {
        throw new BadRequestResponseError("Parent post category not found");
      }
      input.parentId = parent.id;
    }
  }
  
}

export default PostCategoryService;
