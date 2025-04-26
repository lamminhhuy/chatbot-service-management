// src/middleware/upload.ts
import multer from 'multer';
import { NextFunction } from 'express';
import { ErrorsResponse } from '@/shared/response/errors.response';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new ErrorsResponse('Chỉ cho phép JPEG, PNG, hoặc PDF', 400));
    }   
    cb(null, true);
  }
});

export const UploadFileMiddleware = (req: any, res: any, next: NextFunction) => {
  upload.single('file')(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json(new ErrorsResponse(err.message, 400));
    } else if (err) {
      return res.status(err.status || 400).json(err);
    }
    if (!req.file) {
      return res.status(400).json(new ErrorsResponse('Không có file được upload', 400));
    } 
    next();
  });
};
  
