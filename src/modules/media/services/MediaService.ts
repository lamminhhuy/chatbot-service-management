import { inject, injectable } from "tsyringe";
import { IMediaProvider } from "../interfaces/IMediaProvider";
import { IMediaRepository } from "../interfaces/IMediaRepository";
import { Media } from "../models/MediaModel";
import { MediaType } from "../enums/MediaType";
import { UploadPayloadDTO } from "../interfaces/Upload.dto";
import { BadRequestResponseError } from "@/shared/response/errors.response";

@injectable()
export class MediaService {
    constructor(@inject('IMediaProvider') private  mediaProvider: IMediaProvider, @inject('IMediaRepository') private readonly mediaRepository: IMediaRepository) { }

    async create(input: UploadPayloadDTO): Promise<void> {
      const isExistedMedia= await this.mediaRepository.existByReferenceId(input.referenceId) 
      if(isExistedMedia)
      {
        throw new BadRequestResponseError('File already exists');
      }

     const url = await this.mediaProvider.uploadFile(input.file.buffer, input.file.originalname, input.file.mimetype);
    const media = Media.create({
            fileUrl: url,
            mediaType: MediaType.IMAGE,
            referenceType: input.referenceType,
            referenceId: input.referenceId,
            mimeType: input.file.mimetype
    })
    this.mediaRepository.save(media)
    }

    async delete(key: string): Promise<void> {
        await this.mediaProvider.deleteFile(key);
    }
}       