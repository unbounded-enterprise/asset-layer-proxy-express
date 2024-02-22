import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { CreateExpressionProps, GetSlotExpressionsProps, UpdateBulkExpressionValuesProps, UpdateExpressionValuesProps, UpdateExpressionProps } from "@assetlayer/sdk/dist/types/expression";
import { BasicError } from "@assetlayer/sdk";

export const getExpressionTypes = async (req: Request, res: CustomResponse, next: NextFunction) => {
  try {
    const response = await assetlayer.expressions.raw.getExpressionTypes();

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type GetSlotExpressionsRequest = Request<{},{},GetSlotExpressionsProps,GetSlotExpressionsProps>;
export const getSlotExpressions = async (req: GetSlotExpressionsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const slotId = req.query.slotId || req.body.slotId;

    const response = await assetlayer.expressions.raw.getSlotExpressions({ slotId });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

/*
type CreateExpressionRequest = Request<{},{},CreateExpressionProps>;
export const createExpression = async (req: CreateExpressionRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { slotId, expressionTypeId, expressionName, description } = req.body;

    const response = await assetlayer.expressions.raw.createExpression({ slotId, expressionTypeId, expressionName, description });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateExpressionRequest = Request<{},{},UpdateExpressionProps>;
export const updateExpression = async (req: UpdateExpressionRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { expressionId, expressionTypeId, expressionName, description } = req.body;

    const response = await assetlayer.expressions.raw.updateExpression({ expressionId, expressionTypeId, expressionName, description });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateExpressionValuesRequest = Request<{},{},UpdateExpressionValuesProps>;
export const updateExpressionValues = async (req: UpdateExpressionValuesRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { expressionAttributeName, value, expressionId, expressionName, assetId, assetIds, collectionId } = req.body;

    if (!(assetId || assetIds || collectionId)) throw new BasicError('Missing assetId(s) or collectionId', 400);

    const result = await assetlayer.expressions.raw.updateExpressionValues({ expressionAttributeName, value, expressionId, expressionName, assetId, assetIds, collectionId });

    return res.json(result);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateBulkExpressionValuesRequest = Request<{},{},UpdateBulkExpressionValuesProps>;
export const updateBulkExpressionValues = async (req: UpdateBulkExpressionValuesRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, value } = req.body;

    const response = await assetlayer.expressions.raw.updateBulkExpressionValues({ collectionId, value });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}
*/