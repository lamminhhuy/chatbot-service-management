import { inject } from "tsyringe";
import PostCategoryService from "../services/PostCategoryService";
import { injectable } from "tsyringe";;
import { SuccessResponse } from "@/shared/response/success.response";
import { Request, Response } from "express";
import { CreatePostCategoryDTOType } from "../dtos/CreatePostCategory.dto";
import { UpdatePostCategoryDTOType } from "../dtos/UpdatePostCategory.dto";

@injectable()
export default class PostCategoryController {
    constructor(@inject(PostCategoryService) private readonly postCategoryService: PostCategoryService) {
    }

    async createPostCategory(req: Request<{},{},CreatePostCategoryDTOType>, res: Response) {
        const postCategory = await this.postCategoryService.createPostCategory(req.body);
        new SuccessResponse({
            message: 'Post category created successfully',
            data: postCategory
        }).send(res);
    }
    async updatePostCategory(req: Request<{id: number}, {}, UpdatePostCategoryDTOType>, res: Response) {
        const postCategory = await this.postCategoryService.updatePostCategory(req.params.id, req.body);
        new SuccessResponse({
            message: 'Post category updated successfully',
            data: postCategory
        }).send(res);
    }
    async deletePostCategory(req: Request<{id: number}>, res: Response) {
        const postCategory = await this.postCategoryService.deletePostCategory(req.params.id);
        new SuccessResponse({
            message: 'Post category deleted successfully',
            data: postCategory
        }).send(res);
    }
    async getAllPostCategory(req: Request, res: Response) {
        const postCategory = await this.postCategoryService.getAllPostCategory();
        new SuccessResponse({
            message: 'Post category fetched successfully',
            data: postCategory
        }).send(res);
    }
}
    
