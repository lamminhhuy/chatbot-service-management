import { inject, injectable } from "tsyringe";
import PostService from "../services/PostService";
import { NextFunction } from "express";
import { CreatePostPayloadDTO } from "../interfaces/CreatePost.dto";
import { Request, Response } from "express";
import { PostResponseDTOSchema, PostResponseDTOsSchema } from "../interfaces/PostResponse.dto";
import { SuccessResponse } from "@/shared/response/success.response";

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
         data: result
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
}

export default PostController
