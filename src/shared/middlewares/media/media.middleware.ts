import express from 'express';
import path from 'path';

export const staticMiddleware = (folderPath: string) => {
  return express.static(path.join(process.cwd(), folderPath));
};

