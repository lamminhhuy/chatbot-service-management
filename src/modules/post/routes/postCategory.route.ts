import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import { validateRequest, validateRequestQueryParams } from "@/shared/middlewares/validateRequest/validateRequest";
import PostCategoryController from "../controllers/PostCategoryController";
import { CreatePostCategoryDTOSchema } from "../dtos/CreatePostCategory.dto";
import { UpdatePostCategoryDTOSchema } from "../dtos/UpdatePostCategory.dto";
import { container } from "tsyringe";
import { PostCategoryQueryParamsDTOSchema } from "../dtos/PostCategoryQueryParams.dto";

const postCategoryController = container.resolve(PostCategoryController);
export const postCategoryModule: ModuleConfig = {
    prefix: '/post-categories',
    moduleName: 'postCategory',
    routes: [{
        method: 'GET',
        path: '/',
        handler: { controller: 'postCategory',
                    action:  postCategoryController.getAllPostCategory.bind(postCategoryController)}
    },
{
    method: 'POST',
    path: '/',
    handler: { controller: 'postCategory',
                action:  postCategoryController.createPostCategory.bind(postCategoryController)},
    middlewares: [validateRequest(CreatePostCategoryDTOSchema)]
},
{
    method: 'PUT',
    path: '/:id',
    handler: { controller: 'postCategory',
                action:  postCategoryController.updatePostCategory.bind(postCategoryController)},
    middlewares: [validateRequest(UpdatePostCategoryDTOSchema)]
},
{
    method: 'DELETE',
    path: '/:id',
    handler: { controller: 'postCategory',
                action:  postCategoryController.deletePostCategory.bind(postCategoryController)}
},{
    method: 'GET',
    path: '/paginated',
    handler: { controller: 'postCategory',
                action:  postCategoryController.getPaginatedPostCategory.bind(postCategoryController)},
    middlewares: [validateRequestQueryParams(PostCategoryQueryParamsDTOSchema)]
}]
}
