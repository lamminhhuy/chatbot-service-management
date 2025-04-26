import { DeleteResult, Repository } from "typeorm";
import { Media } from "../models/MediaModel";

export interface IMediaRepository {
    save: (media: Media) => Promise<Media>;
    saveMany: (media: Media[]) => Promise<Media[]>;
    existByReferenceId(id: string): Promise<boolean>;
    findByReferenceId(id: string): Promise<Media | null>;
    findByReferenceIds(ids: string[]): Promise<Media[]>;
    findById(id: string): Promise<Media | null>;
    deleteMedia(id: string): Promise<DeleteResult>;
}