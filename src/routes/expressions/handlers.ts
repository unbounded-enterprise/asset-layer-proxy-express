import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { CreateExpressionProps, UpdateAssetExpressionValuesProps, UpdateAssetsExpressionValuesProps, UpdateBulkExpressionValuesProps, UpdateCollectionExpressionValuesProps, UpdateExpressionProps } from "dubby-sdk-test/dist/types/expression";

export const getExpressionTypes = async (req: Request, res: CustomResponse, next: NextFunction) => {
  try {
    const expressionTypes = await assetlayer.expressions.getExpressionTypes();

    return res.json(expressionTypes);
  }
  catch (e) {
    return next(e);
  }
}

type GetSlotExpressionsProps = { slotId: string; };
type GetSlotExpressionsRequest = Request<{},{},GetSlotExpressionsProps,GetSlotExpressionsProps>;
export const getSlotExpressions = async (req: GetSlotExpressionsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const slotId = req.query.slotId || req.body.slotId;

    const expressions = await assetlayer.expressions.getSlotExpressions(slotId);

    return res.json(expressions);
  }
  catch (e) {
    return next(e);
  }
}

type CreateExpressionRequest = Request<{},{},CreateExpressionProps,CreateExpressionProps>;
export const createExpression = async (req: CreateExpressionRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { slotId, expressionTypeId, expressionName, description } = { ...req.body, ...req.query };

    const success = await assetlayer.expressions.createExpression({ slotId, expressionTypeId, expressionName, description });

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateExpressionRequest = Request<{},{},UpdateExpressionProps,UpdateExpressionProps>;
export const updateExpression = async (req: UpdateExpressionRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { expressionId, expressionTypeId, expressionName, description } = { ...req.body, ...req.query };

    const success = await assetlayer.expressions.updateExpression({ expressionId, expressionTypeId, expressionName, description });

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateAssetExpressionValuesRequest = Request<{},{},UpdateAssetExpressionValuesProps,UpdateAssetExpressionValuesProps>;
export const updateAssetExpressionValues = async (req: UpdateAssetExpressionValuesRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { nftId, expressionAttributeName, value, expressionId, expressionName } = { ...req.body, ...req.query };

    const success = await assetlayer.expressions.updateAssetExpressionValues({ nftId, expressionAttributeName, value, expressionId, expressionName });

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateAssetsExpressionValuesRequest = Request<{},{},UpdateAssetsExpressionValuesProps,UpdateAssetsExpressionValuesProps>;
export const updateAssetsExpressionValues = async (req: UpdateAssetsExpressionValuesRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { expressionAttributeName, value, nftIds, collectionId, expressionId, expressionName } = { ...req.body, ...req.query };

    const success = await assetlayer.expressions.updateAssetsExpressionValues({ expressionAttributeName, value, nftIds, collectionId, expressionId, expressionName });

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateCollectionExpressionValuesRequest = Request<{},{},UpdateCollectionExpressionValuesProps,UpdateCollectionExpressionValuesProps>;
export const updateCollectionExpressionValues = async (req: UpdateCollectionExpressionValuesRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, expressionAttributeName, value, expressionId, expressionName } = { ...req.body, ...req.query };

    const success = await assetlayer.expressions.updateCollectionExpressionValues({ collectionId, expressionAttributeName, value, expressionId, expressionName });

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateBulkExpressionValuesRequest = Request<{},{},UpdateBulkExpressionValuesProps,UpdateBulkExpressionValuesProps>;
export const updateBulkExpressionValues = async (req: UpdateBulkExpressionValuesRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, value } = { ...req.body, ...req.query };

    const success = await assetlayer.expressions.updateBulkExpressionValues({ collectionId, value });

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}