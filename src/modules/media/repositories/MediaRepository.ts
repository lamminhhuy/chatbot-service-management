import { Media } from "../models/MediaModel";
import { Repository, DataSource, In, UpdateResult, DeleteResult } from "typeorm";
import { AppDataSource } from "@/database/PostgresDB";
import { IMediaRepository } from "../interfaces/IMediaRepository";
class MediaRepository extends Repository<Media> implements IMediaRepository {
    constructor(dataSource: DataSource = AppDataSource) {
        super(Media, dataSource.manager);
    }
    existByReferenceId(id: string): Promise<boolean> {
        return this.exists({ where: { referenceId: id } });
    }
    findByReferenceId(id: string): Promise<Media | null> {
        return this.findOne({ where: { referenceId: id } });
    }
    findByReferenceIds(ids: string[]): Promise<Media[]> {
        return this.find({ where: { referenceId: In(ids) } });
    }
    updateByReference(input: Media): Promise<Media> {
        return this.save(
            input
        );
    }
    updateByReferences(input: Media[]): Promise<Media[]> {
        return this.save(
            input
);
    }
    findById(id: string): Promise<Media | null> {
        return this.findOne({ where: { id } });
    }
    saveMany(media: Media[]): Promise<Media[]> {
        return this.save(media);
    }
    deleteMedia(id: string): Promise<DeleteResult> {
        return this.delete(id);
    }
}
export default MediaRepository;