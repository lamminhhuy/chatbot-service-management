import { inject, injectable } from "tsyringe";
import { MediaService } from "../services/MediaService";
import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "@/shared/response/success.response";
import {  UploadTextPayLoadDTO } from "../interfaces/Upload.dto";
@injectable()
class MediaController{
    constructor(@inject(MediaService) private mediaService: MediaService) {}
   async  handleUpload(req: Request<{},{}, UploadTextPayLoadDTO>, res: Response, next: NextFunction) {
         const file = req.file!;
         await this.mediaService.create({file,referenceType: req.body.referenceType, referenceId: req.body.referenceId});
         new SuccessResponse({
             message: 'File uploaded successfully',
             data: null
         }); 
 
 }
    async deleteFile(req: Request, res: Response, next: NextFunction) {
        const { key } = req.params;
        try {
            await this.mediaService.delete(key);
            new SuccessResponse({
                message: 'File deleted successfully',
                data: { key }
            });
        } catch (error) {
            next(error);
        }
    }
}

export default MediaController