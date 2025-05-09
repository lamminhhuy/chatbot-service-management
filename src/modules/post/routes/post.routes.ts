import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import PostController from "../controllers/PostController";
import { validateRequest, validateRequestQueryParams } from "@/shared/middlewares/validateRequest/validateRequest";
import { container } from "tsyringe";
import { CreatePostDTOSchema } from "../dtos/CreatePost.dto";
import { PostQueryParamsDTOSchema } from "../dtos/PostQueryParams.dto";
import { UpdatePostDTOSchema } from "../dtos/UpdatePost.dto";


const postController = container.resolve(PostController);
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
      isPublic: true,
      handler: { controller: 'post',
                  action:  postController.handleGetAll.bind(postController)}
    },
    {
      method: 'PUT',
      path: '/:id',
      
      handler: { controller: 'post',
                  action:  postController.handleUpdate.bind(postController)},
      middlewares: [validateRequest(UpdatePostDTOSchema)]
    },
    {
      method: 'DELETE',
      path: '/:id',
      handler: { controller: 'post',
                  action:  postController.handleDelete.bind(postController)}
    },
    {
      method: 'GET',
      path: '/paginated',
      isPublic: true,
      handler: { controller: 'post',
                  action:  postController.handleGetPaginatedPosts.bind(postController)},
     middlewares: [validateRequestQueryParams(PostQueryParamsDTOSchema)]
    },
    {
      method: 'GET',
      path: '/:id',
      isPublic: true,
      handler: { controller: 'post',
                  action:  postController.handleGetById.bind(postController)}
    },
    {
      method: 'GET',
      path: '/*',
      isPublic: true,
      handler: { controller: 'post',
                  action:  postController.handleGetBySlug.bind(postController)}
    },
  
  ]
}