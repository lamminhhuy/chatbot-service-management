import { Media } from "../models/MediaModel";
import { Repository, DataSource } from "typeorm";
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
}
export default MediaRepository;