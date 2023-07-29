import { BasicError } from "../types/basic-types";

export function parseBasicError(error:any, fallbackCode:number = 500): BasicError {
    if (!error) return new BasicError('Unknown Error', fallbackCode);
  
    const message = error.response?.data?.error || error.response?.data?.message || error.response?.data
      || error.data?.error || error.data?.message || error.data?.errorMessage || error.data || error.message || 'Unknown Error Message';
    const status = error.response?.data?.statusCode || error.response?.status
      || error.data?.status || error.data?.statusCode || error.status || fallbackCode;
    
    return new BasicError(message, status);
  }