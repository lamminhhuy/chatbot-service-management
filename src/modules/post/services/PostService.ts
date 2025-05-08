import { BadRequestResponseError } from "@/shared/response/errors.response";
import { IPostRepository } from "../interfaces/IPostRepository";
import { Post } from "../models/Post";
import { inject, injectable } from "tsyringe";
import { CreatePostPayloadDTO } from "../dtos/CreatePost.dto";
import { UpdatePostPayloadDTO } from "../dtos/UpdatePost.dto";
import { MediaService } from "@/modules/media/services/MediaService";
import { Transactional } from "typeorm-transactional";
import { PostQueryParamsDTO } from "../dtos/PostQueryParams.dto";
import { MediaReferenceType } from "@/modules/media/enums/MediaType";
import PostCategoryService from "./PostCategoryService";
import {
  DetailPostResponseDTO,
  PostResponseDTO,
  PostResponseDTOSchema,
} from "../dtos/PostResponse.dto";
import { PostWithMedia } from "../types/post.type";
import { Media } from "@/modules/media/models/MediaModel";
import { aggregateData } from "@/shared/utils/aggregateData";
import { buildPaginatedResponse } from "@/shared/utils/buildPaginatedResponse";
import {
  PaginatedResponse,
  PaginatedResponseSchema,
} from "@/shared/dtos/PaginatedResponse.dto";
import { PostCategory } from "../models/PostCategory";

@injectable()
class PostService {
  constructor(
    @inject("IPostRepository") private postRepo: IPostRepository,
    @inject(MediaService) private mediaService: MediaService,
    @inject(PostCategoryService)
    private postCategoryService: PostCategoryService
  ) {}

  @Transactional()
  async createPost(input: CreatePostPayloadDTO): Promise<PostWithMedia> {
    const category = await this.postCategoryService.getById(input.categoryId);
    if (!category) {
      throw new BadRequestResponseError(
        `Category with ID ${input.categoryId} not found`
      );
    }

    const post = await this.postRepo.save(
      Post.create(input.title, input.content, input.shortDescription, category)
    );

    const media = input.mediaId
      ? await this.mediaService.updateByReference({
          referenceType: MediaReferenceType.POST,
          referenceId: String(post.id),
          id: input.mediaId,
        })
      : null;

    return aggregateData<Post, { media: Media | null }>(post, { media });
  }

  async deletePost(postId: number): Promise<void> {
    const post = await this.postRepo.findById(postId);
    if (!post) {
      throw new BadRequestResponseError(`Post with ID ${postId} not found`);
    }
    await this.postRepo.deletePost(post);
  }

  @Transactional()
  async updatePost(
    id: number,
    input: UpdatePostPayloadDTO
  ): Promise<PostWithMedia> {
    const post = await this.postRepo.findById(id);
    if (!post) {
      throw new BadRequestResponseError(`Post with ID ${id} not found`);
    }

    const category = await this.postCategoryService.getById(input.categoryId);
    if (!category) {
      throw new BadRequestResponseError(
        `Category with ID ${input.categoryId} not found`
      );
    }

    let media = await this.mediaService.getByReferenceId(String(post.id));
    if (!media) {
      throw new BadRequestResponseError(
        `Media with reference ID ${post.id} not found`
      );
    }

    post.category = category;
    post.updateTitle(input.title);
    post.content = input.content;
    post.shortDescription = input.shortDescription;

    if (String(input.mediaId) !== media.id) {
      media = await this.mediaService.updateByReference({
        referenceType: MediaReferenceType.POST,
        referenceId: String(post.id),
        id: input.mediaId,
      });
    }
    const savedPost = await this.postRepo.save(post);
    return aggregateData<Post, { media: Media | null }>(savedPost, { media });
  }

  async getAll(): Promise<PostWithMedia[]> {
    const posts = await this.postRepo.findAll();
    return this.attachMediaToPosts(posts);
  }

  async getById(id: number): Promise<PostWithMedia> {
    const post = await this.postRepo.findById(id);
    if (!post) {
      throw new BadRequestResponseError(`Post with ID ${id} not found`);
    }
    const posts = await this.attachMediaToPosts([post]);
    return posts[0];
  }

  async getPaginatedPosts(
    queryParams: PostQueryParamsDTO
  ): Promise<PaginatedResponse<PostResponseDTO>> {
    let category: PostCategory | null = null;
    const extraData: any = {};
    if (queryParams.categoryId) {
      category = await this.postCategoryService.getById(queryParams.categoryId);
      extraData.categoryName = category.name;
    }
    if (queryParams.categorySlug) {
      category = await this.postCategoryService.getBySlug(
        queryParams.categorySlug
      );
      if (!category) {
        throw new BadRequestResponseError(
          `Category with slug ${queryParams.categorySlug} not found`
        );
      }
      queryParams.categoryId = category.id;
      extraData.categoryName = category.name;
    }
    
    const { items, total } = await this.postRepo.getPaginatedPosts(queryParams);
    const posts = await this.attachMediaToPosts(items);
    const paginatedPosts = buildPaginatedResponse({
      items: posts,
    meta:{
        ...extraData,
        total,
        limit: queryParams.limit,
        offset: queryParams.offset
    }
    });
    return PaginatedResponseSchema(PostResponseDTOSchema).parse(paginatedPosts);
  }

  private async attachMediaToPosts(posts: Post[]): Promise<PostWithMedia[]> {
    if (!posts.length) return [];

    const mediaIds = posts.map((post) => String(post.id));
    const medias = await this.mediaService.getByReferenceIds(mediaIds);

    return posts.map((post) =>
      aggregateData<Post, { media: Media | null }>(post, {
        media:
          medias.find((media) => media.referenceId === String(post.id)) || null,
      })
    );
  }

  async getBySlug(slug: string): Promise<DetailPostResponseDTO> {
    const post = await this.postRepo.findBySlug(slug);
    if (!post) {
      throw new BadRequestResponseError(`Post with slug ${slug} not found`);
    }

    const [media, relatedPosts] = await Promise.all([
      this.mediaService.getByReferenceId(String(post.id)),
      this.postRepo.getRelatedPosts(post.id),
    ]);

    const relatedPostsWithMedia = await this.attachMediaToPosts(relatedPosts);

    return aggregateData<
      Post,
      { media: Media | null; relatedPosts: PostWithMedia[] }
    >(post, {
      media: media || null,
      relatedPosts: relatedPostsWithMedia,
    });
  }
}

export default PostService;
