import { NextFunction, Request, Response } from 'express';

export type CustomResponse<T = unknown> = Response<T, {
  id?: string;
}>;

export class CustomError extends Error {
  custom?: string;

  constructor(message: string, custom: string) {
    super(message);
    this.custom = custom;
  }
}

export type HandlerProps<T> = [Request<{},{},T,T>, CustomResponse, NextFunction];