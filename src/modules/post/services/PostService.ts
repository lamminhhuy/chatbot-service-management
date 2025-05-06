import { BadRequestResponseError } from "@/shared/response/errors.response";
import { IPostRepository } from "../interfaces/IPostRepository";
import { Post } from "../models/Post";
import { inject } from "tsyringe";
import { CreatePostPayloadDTO } from "../dtos/CreatePost.dto";
import { UpdatePostPayloadDTO } from "../dtos/UpdatePost.dto";
import { MediaService } from "@/modules/media/services/MediaService";
import { injectable } from "tsyringe";
import { PostWithMedia } from "../types/post.type";
import { Transactional } from "typeorm-transactional";
import { PostQueryParamsDTO } from "../dtos/PostQueryParams.dto";
import { MediaReferenceType } from "@/modules/media/enums/MediaType";
import PostCategoryService from "./PostCategoryService";
@injectable()
class PostService {
  constructor(
    @inject("IPostRepository") private postRepo: IPostRepository,
    @inject(MediaService) private mediaService: MediaService,
    @inject(PostCategoryService) private postCategoryService: PostCategoryService
  ) {}
  @Transactional()
  async createPost(input: CreatePostPayloadDTO): Promise<PostWithMedia> {
    const category = await this.postCategoryService.getById(input.categoryId);
    if(!category)
    {
      throw new BadRequestResponseError("Category not found");
    }
    const post = await this.postRepo.save(
      Post.create(input.title, input.content,category)
    );
    const media = await this.mediaService.updateByReference({
      referenceType: MediaReferenceType.POST,
      referenceId: String(post.id),
      id: input.mediaId,
    });
    return { ...post, media };
  }

  async deletePost(postId: number): Promise<void> {
    const post = await this.postRepo.findById(postId);
    if (!post) {
      throw new BadRequestResponseError("Post not found");
    }
    await this.postRepo.deletePost(post);
  }
  async updatePost(id: number, input: UpdatePostPayloadDTO): Promise<Post> {
    const post = await this.postRepo.findById(id);
    if (!post) {
      throw new BadRequestResponseError("Post not found");
    }
    post.title = input.title;
    post.content = input.content;
    return this.postRepo.save(post);
  }
  async getAll(): Promise<PostWithMedia[]> {
    const posts = await this.postRepo.findAll();
    const mediaIds = posts.map((post) => String(post.id));
    const medias = await this.mediaService.getByReferenceIds(mediaIds);
    return posts.map((post) => {
      const media =
        medias.find((media) => media.referenceId === String(post.id)) || null;
      return { ...post, media };
    });
  }
  async getById(id: number): Promise<PostWithMedia> {
    const post = await this.postRepo.findById(id);
    if (!post) {
      throw new BadRequestResponseError("Post not found");
    }
    const media = await this.mediaService.getByReferenceId(String(post.id));
    return { ...post, media };
  }
  async getPaginatedPosts(
    queryParams: PostQueryParamsDTO
  ): Promise<PostWithMedia[]> {
    const posts = await this.postRepo.getPaginatedPosts(queryParams);
    const mediaIds = posts.map((post) => String(post.id));
    const medias = await this.mediaService.getByReferenceIds(mediaIds);
    return posts.map((post) => {
      const media =
        medias.find((media) => media.referenceId === String(post.id)) || null;
      return { ...post, media };
    });
  }
}
export default PostService;
