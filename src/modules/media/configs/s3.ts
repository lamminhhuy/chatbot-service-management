import { env } from "@/configs/envConfig";

export const s3Config = {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region: env.S3_REGION,
    bucketName: env.S3_BUCKET_NAME
}