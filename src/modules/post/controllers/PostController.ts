import { inject, injectable } from "tsyringe";
import PostService from "../services/PostService";
import { NextFunction } from "express";
import { CreatePostPayloadDTO } from "../dtos/CreatePost.dto";
import { Request, Response } from "express";
import { DetailPostResponseDTOSchema, PostResponseDTOSchema, PostResponseDTOsSchema } from "../dtos/PostResponse.dto";
import { SuccessResponse } from "@/shared/response/success.response";
import { PostQueryParamsDTO } from "../dtos/PostQueryParams.dto";

@injectable()
class PostController {
    constructor(@inject(PostService) private  postService: PostService) {}
  async  handleCreate(req: Request<{},{},CreatePostPayloadDTO>, res: Response, next: NextFunction) {
    const result = await  this.postService.createPost(req.body);
     new SuccessResponse({
         message: 'Post created successfully',
         data: PostResponseDTOSchema.parse(result)
     }).send(res);
 }
 async handleUpdate(req: Request<{id: number}, {}, CreatePostPayloadDTO>, res: Response, next: NextFunction) {
    const result = await  this.postService.updatePost(req.params.id,req.body);
     new SuccessResponse({
         message: 'Post updated successfully',
         data: PostResponseDTOSchema.parse(result)
     }).send(res);
 }
 async handleDelete(req: Request<{id: number}>, res: Response, next: NextFunction) {
    await  this.postService.deletePost(req.params.id);
    new SuccessResponse({
        message: 'Post deleted successfully',
        data: null
    }).send(res);
}
 async handleGetAll(req: Request, res: Response, next: NextFunction) {
    const posts = await this.postService.getAll();
    new SuccessResponse({
        message: 'Posts fetched successfully',
        data: PostResponseDTOsSchema.parse(posts)
    }).send(res);
}
async handleGetById(req: Request<{id: number}>, res: Response, next: NextFunction) {
    const post = await this.postService.getById(req.params.id);
    new SuccessResponse({
        message: 'Post fetched successfully',
        data: PostResponseDTOSchema.parse(post)
    }).send(res);
}
async handleGetPaginatedPosts(
    req: Request<{}, {}, {}, PostQueryParamsDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const posts = await this.postService.getPaginatedPosts(req.query);
      new SuccessResponse({
        message: 'Posts fetched successfully',
        data: posts,
      }).send(res);
    } catch (err) {
      next(err);
    }
  }
async handleGetBySlug(req: Request, res: Response, next: NextFunction) {
    const post = await this.postService.getBySlug(req.params[0]);
    new SuccessResponse({
        message: 'Post fetched successfully',
        data: DetailPostResponseDTOSchema.parse(post)
    }).send(res);
}

}

export default PostController
