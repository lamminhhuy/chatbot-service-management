import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import PostController from "../controllers/PostController";
import { validateRequest, validateRequestQueryParams } from "@/shared/middlewares/validateRequest/validateRequest";
import { container } from "tsyringe";
import { CreatePostDTOSchema } from "../dtos/CreatePost.dto";
import PostCategoryController from "../controllers/PostCategoryController";
import { PostQueryParamsDTOSchema } from "../dtos/PostQueryParams.dto";


const postController = container.resolve(PostController);
const postCategoryController = container.resolve(PostCategoryController);
export const postModule: ModuleConfig = {
  prefix: '/posts',
  moduleName: 'post',
  routes: [
    {
      method: 'POST',
      path: '/',
      handler: { controller: 'post',
                  action:  postController.handleCreate.bind(postController)},
      middlewares: [validateRequest(CreatePostDTOSchema)]
    },
    {
      method: 'GET',
      path: '/',
      handler: { controller: 'post',
                  action:  postController.handleGetAll.bind(postController)}
    },
    {
      method: 'PUT',
      path: '/:id',
      handler: { controller: 'post',
                  action:  postController.handleUpdate.bind(postController)}
    },
    {
      method: 'DELETE',
      path: '/:id',
      handler: { controller: 'post',
                  action:  postController.handleDelete.bind(postController)}
    },
    {
      method: 'GET',
      path: '/:id',
      handler: { controller: 'post',
                  action:  postController.handleGetById.bind(postController)}
    },
    {
      method: 'GET',
      path: '/categories',
      handler: { controller: 'postCategory',
                  action:  postCategoryController.getAllPostCategory.bind(postCategoryController)}
    },
    {
      method: 'POST',
      path: '/categories',
      handler: { controller: 'postCategory',
                  action:  postCategoryController.createPostCategory.bind(postCategoryController)}
    },
    {
      method: 'PUT',
      path: '/categories/:id',
      handler: { controller: 'postCategory',
                  action:  postCategoryController.updatePostCategory.bind(postCategoryController)}
    },
    {
      method: 'DELETE',
      path: '/categories/:id',
      handler: { controller: 'postCategory',
                  action:  postCategoryController.deletePostCategory.bind(postCategoryController)}
    },
    {
      method: 'GET',
      path: '/:id',
      handler: { controller: 'post',
                  action:  postController.handleGetById.bind(postController)}
    },
    {
      method: 'GET',
      path: '/paginated',
      handler: { controller: 'post',
                  action:  postController.handleGetPaginatedPosts.bind(postController)},
     middlewares: [validateRequestQueryParams(PostQueryParamsDTOSchema)]
    }
  ]
}