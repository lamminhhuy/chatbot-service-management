import { CookieOptions } from "express";


export const getRefreshTokenCookieOptions = (customMaxAge: number): CookieOptions => ({
    secure: false,
    httpOnly: true,
    sameSite: 'none',
    maxAge: customMaxAge,
  });