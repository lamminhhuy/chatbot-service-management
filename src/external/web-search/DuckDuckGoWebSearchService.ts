// import { SafeSearchType, search, SearchResults } from 'duck-duck-scrape';

// interface ISearchService {
//     search(query: string, location?: string): Promise<string>;
// }

// interface IQueryOptimizer {
//     optimize(query: string): string;
// }

// interface IResultFormatter {
//     format(data: SearchResults): string;
// }

// interface ILocationParser {
//     getMarketRegion(location: string): string;
//     getRegion(location: string): string;
// }

// class DefaultQueryOptimizer implements IQueryOptimizer {
//     optimize(query: string): string {
//         let optimized = query.trim().replace(/\s+/g, ' ');
//         if (optimized.toLowerCase() === 'apple') {
//             optimized += ' -fruit';
//         }
//         return optimized;
//     }
// }

// class DefaultLocationParser implements ILocationParser {
//     getMarketRegion(location: string): string {
//         return location.split('-')[0];
//     }

//     getRegion(location: string): string {
//         return location.split('-')[0];
//     }
// }

// class DefaultResultFormatter implements IResultFormatter {
//     format(data: SearchResults): string {
//         if (!data.results?.length) {
//             return "Không tìm thấy kết quả phù hợp.";
//         }

//         const highQualityResults = data.results
//             .filter(result => 
//                 result.title && 
//                 result.url && 
//                 result.description &&
//                 !result.url.includes('login') &&
//                 !result.url.includes('signup')
//             )
//             .sort((a, b) => (b.description?.length || 0) - (a.description?.length || 0))
//             .slice(0, 10)
//             .map(result => `${result.title}: ${result.description}`);

//         return highQualityResults.length > 0 
//             ? highQualityResults.join("\n")
//             : "Không tìm thấy kết quả phù hợp.";
//     }
// }

// export class DuckDuckGoWebSearchService implements ISearchService {
//     constructor(
//         private readonly queryOptimizer: IQueryOptimizer = new DefaultQueryOptimizer(),
//         private readonly locationParser: ILocationParser = new DefaultLocationParser(),
//         private readonly resultFormatter: IResultFormatter = new DefaultResultFormatter()
//     ) {}

//     async search(query: string, location: string = 'vn-vi'): Promise<string> {
//         try {
//             const optimizedQuery = this.queryOptimizer.optimize(query);

//             const results = await search(optimizedQuery, {
//                 safeSearch: SafeSearchType.OFF,
//                 locale: location,
//                 marketRegion: this.locationParser.getMarketRegion(location),
//                 offset: 0,
//                 region: this.locationParser.getRegion(location),
//             });

//             return this.resultFormatter.format(results);
//         } catch (error) {
//             console.error("Error in webSearch:", error);
//             return "Không thể thực hiện tìm kiếm web.";
//         }
//     }
// }
