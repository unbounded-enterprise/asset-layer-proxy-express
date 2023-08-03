import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { ActivateCollectionProps, CreateCollectionProps, GetCollectionAssetsProps, UpdateCollectionImageProps, UpdateCollectionProps } from "@assetlayer/sdk/dist/types/collection";

type GetCollectionProps = { collectionId?: string; collectionIds?: string[]; };
type GetCollectionRequest = Request<{},{},GetCollectionProps,GetCollectionProps>;
export const getCollection = async (req: GetCollectionRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, collectionIds } = { ...req.body, ...req.query };

    if (collectionIds) return await getCollections(req, res, next)
    else if (!collectionId) throw new Error('Missing collectionId');

    const collection = await assetlayer.collections.getCollection({ collectionId });

    return res.json(collection);
  }
  catch (e) {
    return next(e);
  }
}

export const getCollections = async (req: GetCollectionRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, collectionIds=[] } = { ...req.body, ...req.query };

    if (collectionId) collectionIds.push(collectionId);

    const collections = await assetlayer.collections.getCollections({ collectionIds });

    return res.json(collections);
  }
  catch (e) {
    return next(e);
  }
}

type GetCollectionAssetsRequest = Request<{},{},GetCollectionAssetsProps,GetCollectionAssetsProps>;
export const getCollectionAssets = async (req: GetCollectionAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, serials, idOnly } = { ...req.body, ...req.query };

    const assets = await assetlayer.collections.getCollectionAssets({ collectionId, serials, idOnly });

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

type CreateCollectionRequest = Request<{},{},CreateCollectionProps,CreateCollectionProps>;
export const createCollection = async (req: CreateCollectionRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionName, slotId, type, maximum, description, tags, royaltyRecipient, 
      collectionImage, collectionBanner, properties, walletUserId } = { ...req.body, ...req.query };

    const success = await assetlayer.collections.createCollection({ 
      collectionName, slotId, type, maximum, description, tags, royaltyRecipient, 
      collectionImage, collectionBanner, properties, walletUserId
    });

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateCollectionRequest = Request<{},{},UpdateCollectionProps,UpdateCollectionProps>;
export const updateCollection = async (req: UpdateCollectionRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, description, tags, royaltyRecipient, collectionImage, collectionBanner, properties } = { ...req.body, ...req.query };

    const success = await assetlayer.collections.updateCollection({ 
      collectionId, description, tags, royaltyRecipient, collectionImage, collectionBanner, properties 
    });

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}

type ActivateCollectionRequest = Request<{},{},ActivateCollectionProps,ActivateCollectionProps>;
export const activateCollection = async (req: ActivateCollectionRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const collectionId = req.query.collectionId || req.body.collectionId;

    const success = await assetlayer.collections.activateCollection({ collectionId });

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}

export const deactivateCollection = async (req: ActivateCollectionRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const collectionId = req.query.collectionId || req.body.collectionId;

    const success = await assetlayer.collections.deactivateCollection({ collectionId });

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateCollectionImageRequest = Request<{},{},UpdateCollectionImageProps,UpdateCollectionImageProps>;
export const updateCollectionImage = async (req: UpdateCollectionImageRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, value } = { ...req.body, ...req.query };

    const success = await assetlayer.collections.updateCollectionImage({ collectionId, value });

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}