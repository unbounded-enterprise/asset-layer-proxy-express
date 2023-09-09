import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { DecreaseCurrencyBalanceProps, GetCurrencyBalanceProps, GetCurrencyProps, GetCurrencySummaryProps, IncreaseCurrencyBalanceProps, TransferCurrencyProps } from "@assetlayer/sdk";
import { formatIncomingHeaders } from "../../utils/basic-format";

type GetCurrencyRequest = Request<{},{},GetCurrencyProps,GetCurrencyProps>;
export const getCurrency = async (req: GetCurrencyRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const response = await assetlayer.currencies.raw.getCurrency({ ...req.body, ...req.query });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type GetCurrencyBalanceRequest = Request<{},{},GetCurrencyBalanceProps,GetCurrencyBalanceProps>;
export const getCurrencyBalance = async (req: GetCurrencyBalanceRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const response = await assetlayer.currencies.raw.getCurrencyBalance({ ...req.body, ...req.query }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type GetCurrencySummaryRequest = Request<{},{},GetCurrencySummaryProps,GetCurrencySummaryProps>;
export const getCurrencySummary = async (req: GetCurrencySummaryRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const response = await assetlayer.currencies.raw.getCurrencySummary({ ...req.body, ...req.query });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type IncreaseCurrencyBalanceRequest = Request<{},{},IncreaseCurrencyBalanceProps,IncreaseCurrencyBalanceProps>;
export const increaseCurrencyBalance = async (req: IncreaseCurrencyBalanceRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const response = await assetlayer.currencies.raw.increaseCurrencyBalance({ ...req.body, ...req.query });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type DecreaseCurrencyBalanceRequest = Request<{},{},DecreaseCurrencyBalanceProps,DecreaseCurrencyBalanceProps>;
export const decreaseCurrencyBalance = async (req: DecreaseCurrencyBalanceRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const response = await assetlayer.currencies.raw.decreaseCurrencyBalance({ ...req.body, ...req.query });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type TransferCurrencyRequest = Request<{},{},TransferCurrencyProps,TransferCurrencyProps>;
export const transferCurrency = async (req: TransferCurrencyRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const response = await assetlayer.currencies.raw.transferCurrency({ ...req.body, ...req.query });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}
