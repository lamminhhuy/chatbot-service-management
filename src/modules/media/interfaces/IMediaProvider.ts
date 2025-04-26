export interface IMediaProvider {
    uploadFile(fileBuffer: Buffer, key: string, contentType: string): Promise<string>;
    deleteFile(key: string): Promise<void>;
    getFileUrl(key: string): string;
    getSignedUrl(key: string, expiresIn: number): Promise<string>;
}