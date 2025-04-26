import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";

import MediaController from "../controllers/MediaController";
import { container } from "tsyringe";
import {  UploadFileMiddleware } from "../middlewares/upload.middleware";

const mediaController = container.resolve(MediaController);

export const mediaModule: ModuleConfig = {
  prefix: '/media',
  routes: [{
    method: 'post',
    path: '/',
    handler: mediaController.handleUpload.bind(mediaController),
    middlewares: [UploadFileMiddleware]
  }]
}