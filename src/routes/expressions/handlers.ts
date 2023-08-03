import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { CreateExpressionProps, GetSlotExpressionsProps, UpdateAssetsExpressionValueProps, UpdateBulkExpressionValuesProps, UpdateCollectionAssetsExpressionValueProps, UpdateAssetExpressionValueAllProps, UpdateExpressionProps } from "@assetlayer/sdk/dist/types/expression";

export const getExpressionTypes = async (req: Request, res: CustomResponse, next: NextFunction) => {
  try {
    const expressionTypes = await assetlayer.expressions.getExpressionTypes();

    return res.json(expressionTypes);
  }
  catch (e) {
    return next(e);
  }
}

type GetSlotExpressionsRequest = Request<{},{},GetSlotExpressionsProps,GetSlotExpressionsProps>;
export const getSlotExpressions = async (req: GetSlotExpressionsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const slotId = req.query.slotId || req.body.slotId;

    const expressions = await assetlayer.expressions.getSlotExpressions({ slotId });

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

type UpdateAssetExpressionValuesRequest = Request<{},{},UpdateAssetExpressionValueAllProps,UpdateAssetExpressionValueAllProps>;
export const updateAssetExpressionValue = async (req: UpdateAssetExpressionValuesRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { expressionAttributeName, value, expressionId, expressionName, assetId, assetIds, collectionId } = { ...req.body, ...req.query };

    if (!(assetId || assetIds || collectionId)) throw new Error('Must provide either assetId, assetIds, or collectionId');

    const success = (assetId) ? await assetlayer.expressions.updateAssetExpressionValue({ assetId, expressionAttributeName, value, expressionId, expressionName })
      : (assetIds) ? await assetlayer.expressions.updateAssetsExpressionValue({ assetIds, expressionAttributeName, value, expressionId, expressionName })
      : await assetlayer.expressions.updateCollectionAssetsExpressionValue({ collectionId: collectionId!, expressionAttributeName, value, expressionId, expressionName });

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateAssetsExpressionValuesRequest = Request<{},{},UpdateAssetsExpressionValueProps,UpdateAssetsExpressionValueProps>;
export const updateAssetsExpressionValue = async (req: UpdateAssetsExpressionValuesRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { assetIds, expressionAttributeName, value, expressionId, expressionName } = { ...req.body, ...req.query };

    const success = await assetlayer.expressions.updateAssetsExpressionValue({ expressionAttributeName, value, assetIds, expressionId, expressionName });

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateCollectionExpressionValuesRequest = Request<{},{},UpdateCollectionAssetsExpressionValueProps,UpdateCollectionAssetsExpressionValueProps>;
export const updateCollectionAssetsExpressionValue = async (req: UpdateCollectionExpressionValuesRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, expressionAttributeName, value, expressionId, expressionName } = { ...req.body, ...req.query };

    const success = await assetlayer.expressions.updateCollectionAssetsExpressionValue({ collectionId, expressionAttributeName, value, expressionId, expressionName });

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