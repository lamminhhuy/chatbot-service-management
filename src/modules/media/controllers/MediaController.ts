import { inject, injectable } from "tsyringe";
import { MediaService } from "../services/MediaService";
import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "@/shared/response/success.response";
@injectable()
class MediaController{
    constructor(@inject(MediaService) private mediaService: MediaService) {}
   async  handleUpload(req: Request, res: Response, next: NextFunction) {
         const file = req.file!;
        const result =  await this.mediaService.uploadImage(file);
         new SuccessResponse({
             message: 'File uploaded successfully',
             data: result
         }).send(res); 
 
 }
    async deleteFile(req: Request, res: Response, next: NextFunction) {
        const { key } = req.params;
            await this.mediaService.delete(key);
            new SuccessResponse({
                message: 'File deleted successfully',
                data: { key }
            }).send(res);
        
    }
}

export default MediaController