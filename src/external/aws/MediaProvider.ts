import { IMediaProvider } from '@/modules/media/interfaces/IMediaProvider';
import AWS from 'aws-sdk';

class MediaProvider implements IMediaProvider {
    private s3: AWS.S3;
    private bucketName: string;
  constructor(config: {accessKeyId: string; secretAccessKey: string; region:string, bucketName: string}) {

    this.s3 = new AWS.S3({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region
    });
    this.bucketName = config.bucketName;
  }

  async uploadFile(fileBuffer: Buffer, key: string, contentType: string) {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'public-read' 
    };

    try {
      const data = await this.s3.upload(params).promise();
      return data.Location;
    } catch (error) {
      throw new Error(`Lỗi khi tải lên S3: ${error}`);
    }
  }

  async deleteFile(key: string) {
    const params = {
      Bucket: this.bucketName,
      Key: key
    };

    try {
      await this.s3.deleteObject(params).promise();
    } catch (error) {
      throw new Error(`Lỗi khi xóa tệp trên S3: ${error}`);
    }
  }

  getFileUrl(key: string) {
    return `https://${this.bucketName}.s3.${this.s3.config.region}.amazonaws.com/${key}`;
  }

  async getSignedUrl(key: string, expiresIn = 3600) {
    try {
      const url = await this.s3.getSignedUrlPromise('getObject', {
        Bucket: this.bucketName,
        Key: key,
        Expires: expiresIn
      });
      return url;
    } catch (error) {
      throw new Error(`Lỗi khi tạo signed URL: ${error}`);
    }
  }
}

export default MediaProvider