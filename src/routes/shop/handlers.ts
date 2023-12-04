import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { BuyItemProps, NewItemProps, RemoveItemProps } from "@assetlayer/sdk";
import { formatIncomingHeaders } from "../../utils/basic-format";

/*
type NewItemRequest = Request<{},{},NewItemProps,NewItemProps>;
export const newItem = async (req: NewItemRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const response = await assetlayer.shop.raw.newItem({ ...req.body, ...req.query }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}
*/

type BuyItemRequest = Request<{},{},BuyItemProps,BuyItemProps>;
export const buyItem = async (req: BuyItemRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const response = await assetlayer.shop.raw.buyItem({ ...req.body, ...req.query }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type ShopSummaryRequest = Request<{},{},{},{}>;
export const shopSummary = async (req: ShopSummaryRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const response = await assetlayer.shop.raw.summary();

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

/*
type RemoveItemRequest = Request<{},{},RemoveItemProps,RemoveItemProps>;
export const removeItem = async (req: RemoveItemRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const response = await assetlayer.shop.raw.removeItem({ ...req.body, ...req.query }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}
*/