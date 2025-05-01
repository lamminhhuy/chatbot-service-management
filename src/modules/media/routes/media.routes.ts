import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";

import MediaController from "../controllers/MediaController";
import { container } from "tsyringe";
import {  UploadFileMiddleware } from "../middlewares/upload.middleware";

const mediaController = container.resolve(MediaController);

export const mediaModule: ModuleConfig = {
  prefix: '/media',
  moduleName: 'media',
  routes: [{
    method: 'POST',
    path: '/',
    handler: { controller: 'media',
                action:  mediaController.handleUpload.bind(mediaController)},
    middlewares: [UploadFileMiddleware]
  }]
}