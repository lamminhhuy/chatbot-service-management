import { container } from "tsyringe";
import { MediaService } from "./services/MediaService";
import MediaRepository from "./repositories/MediaRepository";
import { env } from "@/configs/envConfig";
import { LocalMediaProvider } from "@/infrastructure/media/LocalMediaProvider";


export function registerMediaContainer(){
    container.register('IMediaProvider', { useValue: new LocalMediaProvider('uploads', env.BASE_URL, env.LOCAL_BASE_URL) })
    container.register('IMediaRepository', { useClass: MediaRepository })
    container.register(MediaService, { useClass: MediaService })
}