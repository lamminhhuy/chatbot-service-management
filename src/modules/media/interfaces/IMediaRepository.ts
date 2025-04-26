import { Media } from "../models/MediaModel";

export interface IMediaRepository {
    save: (media: Media) => Promise<Media>;
    existByReferenceId(id: string): Promise<boolean>;
    findByReferenceId(id: string): Promise<Media | null>;
}