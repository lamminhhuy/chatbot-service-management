import { env } from "@/shared/infrastructure/configs/envConfig";
import { CookieOptions } from "express";

export const getCookieOptions = (customMaxAge: number): CookieOptions => ({
    secure:   true,
    httpOnly:   true,
    sameSite: 'none',
    maxAge: customMaxAge,
  });