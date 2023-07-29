import { NextFunction, Request, Response } from 'express';

export class BasicError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

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