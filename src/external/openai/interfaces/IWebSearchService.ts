export interface IWebSearchService {
    search(query: string): Promise<string>
}