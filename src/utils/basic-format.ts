import { BasicObject } from "@assetlayer/sdk";
import { IncomingHttpHeaders } from "http";

export function formatIncomingHeaders(headers: IncomingHttpHeaders) {
    const head = {} as BasicObject<string>;
    
    if (headers.didtoken) head.didtoken = headers.didtoken as string;

    return head;
}

export function incomingHeadersToHeadersInit(headers?: IncomingHttpHeaders) {
    if (!headers) return undefined;
    const headersInit: HeadersInit = {};
  
    for (const [key, value] of Object.entries(headers)) {
        if (!value) continue;
        
        headersInit[key] = Array.isArray(value) ? value.join(', ') : value;
    }
    
    return headersInit;
}