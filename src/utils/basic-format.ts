import { BasicObject } from "@assetlayer/sdk";
import { IncomingHttpHeaders } from "http";

export function formatIncomingHeaders(headers?: IncomingHttpHeaders) {
    if (!headers) return undefined;

    const head = {} as BasicObject<string>;
    
    if (headers.didtoken) head.didtoken = headers.didtoken as string;

    for (const [key, value] of Object.entries(headers)) {
        console.log('header:', key, value);
    }

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