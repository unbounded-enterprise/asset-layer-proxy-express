import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { ActivateCollectionProps, CollectionAssetsProps, CollectionInfoProps, CreateCollectionProps, GetCollectionAssetsProps, UpdateCollectionImageProps, UpdateCollectionProps } from "@assetlayer/sdk/dist/types/collection";
import { formatIncomingHeaders } from "../../utils/basic-format";
import { BasicError } from "@assetlayer/sdk/dist/types/basic-types";

type CollectionInfoRequest = Request<{},{},CollectionInfoProps,CollectionInfoProps>;
export const info = async (req: CollectionInfoRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, collectionIds, includeSubmissionData } = { ...req.body, ...req.query };

    if (!(collectionId || collectionIds)) throw new BasicError('Missing collectionId(s)', 400);

    const response = await assetlayer.collections.raw.info({ collectionId, collectionIds, includeSubmissionData });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type CollectionAssetsRequest = Request<{},{},CollectionAssetsProps,CollectionAssetsProps>;
export const assets = async (req: CollectionAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, serials, idOnly } = { ...req.body, ...req.query };

    const response = await assetlayer.collections.raw.assets({ collectionId, serials, idOnly });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type CreateCollectionRequest = Request<{},{},CreateCollectionProps>;
export const createCollection = async (req: CreateCollectionRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const {
      collectionName, slotId, type, maximum, description, tags, royaltyRecipient, 
      collectionImage, collectionBanner, properties, walletUserId, defaultProperties, draft
    } = req.body;

    const response = await assetlayer.collections.raw.createCollection({ 
      collectionName, slotId, type, maximum, description, tags, royaltyRecipient, 
      collectionImage, collectionBanner, properties, walletUserId, defaultProperties, draft
    }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateCollectionRequest = Request<{},{},UpdateCollectionProps>;
export const updateCollection = async (req: UpdateCollectionRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { 
      collectionId, collectionName, description, tags, royaltyRecipient, 
      collectionImage, collectionBanner, properties, defaultProperties 
    } = req.body;

    const response = await assetlayer.collections.raw.updateCollection({ 
      collectionId, collectionName, description, tags, royaltyRecipient, 
      collectionImage, collectionBanner, properties, defaultProperties
    });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type ActivateCollectionRequest = Request<{},{},ActivateCollectionProps>;
export const activateCollection = async (req: ActivateCollectionRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const collectionId = req.body.collectionId;

    const response = await assetlayer.collections.raw.activateCollection({ collectionId });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

export const deactivateCollection = async (req: ActivateCollectionRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const collectionId = req.body.collectionId;

    const response = await assetlayer.collections.raw.deactivateCollection({ collectionId });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateCollectionImageRequest = Request<{},{},UpdateCollectionImageProps>;
export const updateCollectionImage = async (req: UpdateCollectionImageRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, value } = req.body;

    const response = await assetlayer.collections.raw.updateCollectionImage({ collectionId, value });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}