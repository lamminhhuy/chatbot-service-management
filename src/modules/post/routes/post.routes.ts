import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import PostController from "../controllers/PostController";
import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { container } from "tsyringe";
import { CreatePostDTOSchema } from "../interfaces/CreatePost.dto";


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
    }
  ]
}