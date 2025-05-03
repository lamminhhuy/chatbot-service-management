import { inject, injectable } from "tsyringe";
import { CreatePostCategoryPayloadDTOType } from "../dtos/CreatePostCategory.dto";
import { IPostCategoryRepository } from "../interfaces/IPostCategoryRepository";
import {PostCategory} from "../models/PostCategory";
import { BadRequestResponseError } from "@/shared/response/errors.response";
import { UpdatePostCategoryPayloadDTOType } from "../dtos/UpdatePostCategory.dto";

@injectable()
class PostCategoryService {
    constructor(@inject('IPostCategoryRepository') private readonly postCategoryRepo: IPostCategoryRepository) {
        this.postCategoryRepo = postCategoryRepo;
    }
    async createPostCategory(input: CreatePostCategoryPayloadDTOType): Promise<PostCategory> {
        if(input.parentId) {
            const parent = await this.findParent(input.parentId);
            input.parentId = parent.id;
        }
        const postCategory = await this.postCategoryRepo.save(PostCategory.create(input.name, input.friendlySlug, input.parentId));
        return postCategory;
    }
    async getAll(): Promise<PostCategory[]> {
        return this.postCategoryRepo.findAll();
    }
    async deletePostCategory(id: number): Promise<PostCategory> {
        const postCategory = await this.postCategoryRepo.findById(id);
        if(!postCategory) {
            throw new BadRequestResponseError('Post category not found');
        }
        return this.postCategoryRepo.deletePost(postCategory);
    }
    async updatePostCategory(id: number, input: UpdatePostCategoryPayloadDTOType): Promise<PostCategory> {
        const postCategory = await this.postCategoryRepo.findById(id);
        if(!postCategory) {
            throw new BadRequestResponseError('Post category not found');
        }
        if(input.parentId) {
            const parent = await this.findParent(input.parentId);
            postCategory.parentId = parent.id;
        }
        postCategory.name = input.name;
        postCategory.friendlySlug = input.friendlySlug;
        return this.postCategoryRepo.save(postCategory);
    }

    private async findParent(parentId: number): Promise<PostCategory> {
        const parent = await this.postCategoryRepo.findById(parentId);
        if(!parent) {
            throw new BadRequestResponseError('Parent post category not found');
        }
        return parent;
    }
    async getById(id: number): Promise<PostCategory> {
        const postCategory = await this.postCategoryRepo.findById(id);
        if(!postCategory) {
            throw new BadRequestResponseError('Post category not found');
        }
        return postCategory;
    }
    async getAllPostCategory(): Promise<PostCategory[]> {
        return this.postCategoryRepo.findAll();
    }
}

export default PostCategoryService;
