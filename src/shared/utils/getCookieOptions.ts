import { env } from "@/configs/envConfig";
import { CookieOptions } from "express";

export const getCookieOptions = (customMaxAge: number): CookieOptions => ({
    secure:   true,
    httpOnly:   true,
    sameSite: 'none',
    maxAge: customMaxAge,
  });