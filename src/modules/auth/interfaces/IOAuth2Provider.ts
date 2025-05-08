export interface IOAuth2Provider {
    verifyIdToken(token: string): Promise<any>;
}