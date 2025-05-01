interface ExtractedResource {
    resource: string;
    id?: string | number;
  }
  
  interface ExtractedResult {
    resources: ExtractedResource[];
    action?: string;
    queryParams?: Record<string, string>;
    version?: string;
  }
  export function extractResourcesAndAction(modulePrefix: string, actionName: string) {
        return 
  }