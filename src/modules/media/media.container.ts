import { container } from "tsyringe";
import { MediaService } from "./services/MediaService";
import MediaRepository from "./repositories/MediaRepository";
import MediaProvider from "@/external/aws/MediaProvider";
import { env } from "@/configs/envConfig";
import { s3Config } from "./configs/s3";


export function registerMediaContainer(){
    container.register('IMediaProvider', { useValue: new MediaProvider(s3Config) })
    container.register('IMediaRepository', { useClass: MediaRepository })
    container.register(MediaService, { useClass: MediaService })
}