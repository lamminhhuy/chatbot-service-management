import { promises as fs } from 'fs';
import path from 'path';
import { IMediaProvider } from '@/modules/media/interfaces/IMediaProvider';
import { env } from 'process';

export class LocalMediaProvider implements IMediaProvider {
  private readonly uploadDir: string;
  private readonly uploadPath: string;
  private readonly baseUrl: string;
  private readonly localBaseUrl: string;

  constructor(uploadDir: string, baseUrl: string, localBaseUrl: string ) {
    this.uploadDir = uploadDir;
    this.uploadPath = path.join(process.cwd(), uploadDir);
    this.baseUrl = baseUrl;
    this.localBaseUrl = localBaseUrl;
    this.ensureUploadDir();
  }

  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.mkdir(this.uploadPath, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create upload directory: ${error}`);
    }
  }

  async uploadFile(fileBuffer: Buffer, key: string, contentType: string): Promise<string> {
    try {
      const filePath = path.join(this.uploadPath, key);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, fileBuffer);

      return this.getFileUrl(key);
    } catch (error) {
      throw new Error(`Failed to upload file: ${error}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const filePath = path.join(this.uploadPath, key);
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return;
      }
      throw new Error(`Failed to delete file: ${error}`);
    }
  }

  getFileUrl(key: string): string {
    return `${this.baseUrl}/${this.uploadDir}/${key}`;
  }

  async getSignedUrl(key: string, expiresIn: number): Promise<string> {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ key }, env.JWT_ACCESS_SECRET, { expiresIn });
    return `${this.getFileUrl(key)}?token=${token}`;
  }
}