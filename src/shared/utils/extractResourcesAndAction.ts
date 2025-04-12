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
  export function extractResourcesAndAction(endpoint: string, method: string): ExtractedResult {
    const methodActionMapper = {
      GET: 'findAll',
      POST: 'create',
      PUT: 'update',
      DELETE: 'delete',
      PATCH: 'edit'
    };
  
    const normalizedMethod = method.toUpperCase();
  
    const [path, queryString] = endpoint.split('?');
    const queryParams = queryString
      ? Object.fromEntries(new URLSearchParams(queryString).entries())
      : undefined;
  
    const segments = path.split('/').filter(segment => segment !== '');
    
    if (segments.length === 0) {
      return {
        resources: [],
        action: methodActionMapper[normalizedMethod as keyof typeof methodActionMapper],
        queryParams
      };
    }
  
    const resources: ExtractedResource[] = [];
    let action: string | undefined;
  
    for (let i = 0; i < segments.length; i++) {
      const current = segments[i];
      const next = segments[i + 1];
  
      if (i === segments.length - 1) {
        if (resources.length === 0 || typeof resources[resources.length - 1].id !== 'undefined') {
          resources.push({ resource: current });
        
          if (current === ':id' && normalizedMethod === 'GET') {
            resources[resources.length - 1].id = ':id';
            action = 'findOne';
          } else {
            action = normalizedMethod === 'GET' && resources.some(r => r.id !== undefined && r.id !== ':id')
              ? 'findOne'
              : methodActionMapper[normalizedMethod as keyof typeof methodActionMapper];
          }
        } else {
          action = current; 
        }
        break;
      }
  
      const isId = !isNaN(Number(next)) || /^[0-9a-fA-F-]{36}$/.test(next) || next === ':id';
      
      if (isId) {
        resources.push({
          resource: current,
          id: !isNaN(Number(next)) ? Number(next) : next
        });
        i++; 
      } else {
        resources.push({ resource: current });
        if (!next || i === segments.length - 2) {
          action = next || (normalizedMethod === 'GET' && resources.some(r => r.id !== undefined && r.id !== ':id')
            ? 'findOne'
            : methodActionMapper[normalizedMethod as keyof typeof methodActionMapper]);
          break;
        }
      }
    }
  
    if (!action) {
      action = (normalizedMethod === 'GET' && 
        (resources.some(r => r.id !== undefined && r.id !== ':id') || resources.some(r => r.id === ':id')))
        ? 'findOne'
        : methodActionMapper[normalizedMethod as keyof typeof methodActionMapper];
    }
  
    return {
      resources,
      action,
      queryParams: queryParams && Object.keys(queryParams).length > 0 ? queryParams : undefined
    };
  }