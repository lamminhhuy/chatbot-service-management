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
  
    // Chuẩn hóa method
    const normalizedMethod = method.toUpperCase();
  
    // Tách path và query string
    const [path, queryString] = endpoint.split('?');
    const queryParams = queryString
      ? Object.fromEntries(new URLSearchParams(queryString).entries())
      : undefined;
  
    // Tách các segment, loại bỏ các segment rỗng
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
  
    // Xử lý từng cặp segment
    for (let i = 0; i < segments.length; i++) {
      const current = segments[i];
      const next = segments[i + 1];
  
      // Nếu là segment cuối
      if (i === segments.length - 1) {
        if (resources.length === 0 || typeof resources[resources.length - 1].id !== 'undefined') {
          resources.push({ resource: current });
          // Xử lý trường hợp đặc biệt: nếu cuối là :id và method là GET thì action là findOne
          if (current === ':id' && normalizedMethod === 'GET') {
            resources[resources.length - 1].id = ':id';
            action = 'findOne';
          } else {
            action = normalizedMethod === 'GET' && resources.some(r => r.id !== undefined && r.id !== ':id')
              ? 'findOne'
              : methodActionMapper[normalizedMethod as keyof typeof methodActionMapper];
          }
        } else {
          action = current; // Segment cuối là action
        }
        break;
      }
  
      // Nếu next là ID (số, UUID hoặc :id)
      const isId = !isNaN(Number(next)) || /^[0-9a-fA-F-]{36}$/.test(next) || next === ':id';
      
      if (isId) {
        resources.push({
          resource: current,
          id: !isNaN(Number(next)) ? Number(next) : next
        });
        i++; // Bỏ qua segment ID
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
  
    // Xử lý trường hợp cuối cùng nếu không có action được gán
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