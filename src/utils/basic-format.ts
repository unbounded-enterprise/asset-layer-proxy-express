import { IncomingHttpHeaders } from "http";

export function incomingHeadersToHeadersInit(headers?: IncomingHttpHeaders) {
    if (!headers) return undefined;
    const headersInit: HeadersInit = {};
  
    for (const [key, value] of Object.entries(headers)) {
        if (!value) continue;
        
        headersInit[key] = Array.isArray(value) ? value.join(', ') : value;
    }
    
    return headersInit;
}