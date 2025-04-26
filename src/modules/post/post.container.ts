import { container } from "tsyringe";
import PostRepository from "./repositories/PostRepository";
import PostService from "./services/PostService";

export function registerPostDependencies() {
    container.register('IPostRepository', { useClass: PostRepository });
    container.register(PostService, { useClass: PostService });
}