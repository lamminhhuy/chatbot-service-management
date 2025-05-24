export const getRefreshTokenCookieName = (origin: string | undefined): string => {
    if (!origin) {
      return 'refreshToken'; 
    }
    try {
      const url = new URL(origin);
      return `refreshToken_${url.hostname.replace(/\./g, '_')}`;
    } catch {
      return 'refreshToken';
    }
  };
  