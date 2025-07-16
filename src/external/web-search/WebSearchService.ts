import axios from "axios";


export class WebSearchService  {
    private static webSearchUrl = 'https://google.serper.dev/search';
    constructor(private webSearchApiKey: string) { }
 
    async search(query: string)  {
    try {
     const response = await axios.request(this.getConfig(query));
     return this.formatSearchResults(response.data.organic);
    } catch (error) {
      console.error("Error in webSearch:", error);
      return "Không thể thực hiện tìm kiếm web.";
    }
    }
    

    private getConfig(query: string){
        const data = JSON.stringify({
            "q": query
          });

        return {
            method: 'POST',
            maxBodyLength: Number.POSITIVE_INFINITY,
            url: WebSearchService.webSearchUrl,
            headers: { 
              'X-API-KEY': this.webSearchApiKey, 
              'Content-Type': 'application/json'
            },
            data: data
          };
    }
    private formatSearchResults(results: any[]): string {
        const formattedResults = results.map(result => `${result.title}: ${result.snippet}`).join("\n");
        return formattedResults || "Không tìm thấy kết quả phù hợp.";
    }
}