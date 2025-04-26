import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import PostController from "../controllers/PostController";
import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { container } from "tsyringe";
import { CreatePostDTOSchema } from "../interfaces/CreatePost.dto";


const postController = container.resolve(PostController);

export const postModule: ModuleConfig = {
  prefix: '/posts',
  routes: [
    {
      method: 'post',
      path: '/',
      handler: postController.handleCreate.bind(postController),
      middlewares: [validateRequest(CreatePostDTOSchema)]
    },
    {
      method: 'get',
      path: '/',
      handler: postController.handleGetAll.bind(postController)
    },
    {
      method: 'put',
      path: '/:id',
      handler: postController.handleUpdate.bind(postController)
    },
    {
      method: 'delete',
      path: '/:id',
      handler: postController.handleDelete.bind(postController)
    }
  ]
}