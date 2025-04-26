import { inject, injectable } from "tsyringe";
import { IMediaProvider } from "../interfaces/IMediaProvider";
import { IMediaRepository } from "../interfaces/IMediaRepository";
import { Media } from "../models/MediaModel";
import { MediaType } from "../enums/MediaType";
import { BadRequestResponseError, ErrorsResponse } from "@/shared/response/errors.response";

@injectable()
export class MediaService {
    constructor(@inject('IMediaProvider') private  mediaProvider: IMediaProvider, @inject('IMediaRepository') private readonly mediaRepository: IMediaRepository) { }

    async uploadImage(file: Express.Multer.File): Promise<Media> {
  
   const url = await this.mediaProvider.uploadFile(file.buffer, file.originalname, file.mimetype);
const media = Media.create({
        fileUrl: url,
        mediaType: MediaType.IMAGE,
        mimeType: file.mimetype
})
  return  this.mediaRepository.save(media)
    }
    async updateByReference(input: {referenceType: string, referenceId:string, id: string }): Promise<Media> {
      const media = await this.mediaRepository.findById(input.id);
      if(!media) throw new ErrorsResponse('Media not found',408);
      if(media.referenceId) throw new BadRequestResponseError('Media already has a reference');
      media.referenceType = input.referenceType;
      media.referenceId = input.referenceId;
      return this.mediaRepository.save(media)
    }
  
    async delete(key: string): Promise<void> {
        await this.mediaProvider.deleteFile(key);
    }
    async getByReferenceIds(ids: string[]): Promise<Media[]> {
        return this.mediaRepository.findByReferenceIds(ids);
    }
    async getByReferenceId(id: string): Promise<Media | null> {
        return this.mediaRepository.findByReferenceId(id);
    }
}       