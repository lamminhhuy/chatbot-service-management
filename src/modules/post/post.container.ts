import { container } from "tsyringe";
import PostRepository from "./repositories/PostRepository";
import PostService from "./services/PostService";
import PostCategoryService from "./services/PostCategoryService";
import PostCategoryRepository from "./repositories/PostCategoryRepository";

export function registerPostDependencies() {
    container.register('IPostRepository', { useClass: PostRepository });
    container.register(PostService, { useClass: PostService });
    container.register('IPostCategoryRepository', { useClass: PostCategoryRepository });
    container.register(PostCategoryService, { useClass: PostCategoryService });
}