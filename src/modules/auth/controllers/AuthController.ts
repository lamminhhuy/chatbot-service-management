// src/presentation/controllers/AuthController.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  constructor(private authService: AuthService) {}

  async googleLogin(req: Request, res: Response) {
  
  }

  getGoogleAuthUrl(req: Request, res: Response) {
 
  }
}