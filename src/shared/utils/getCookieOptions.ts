import { env } from "@/configs/envConfig";
import { CookieOptions } from "express";

export const getCookieOptions = (customMaxAge: number): CookieOptions => ({
    secure: ['test','pro'].includes(env.NODE_ENV) ?  true: false,
    httpOnly: ['test','pro'].includes(env.NODE_ENV) ? true: false,
    sameSite: 'none',
    maxAge: customMaxAge,
  });