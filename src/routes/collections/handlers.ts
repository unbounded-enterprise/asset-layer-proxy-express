import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { CreateCollectionProps, UpdateCollectionProps } from "dubby-sdk-test/dist/types/collection";

type GetCollectionProps = { collectionId?: string; collectionIds?: string[]; };
type GetCollectionRequest = Request<{},{},GetCollectionProps,GetCollectionProps>;
export const getCollection = async (req: GetCollectionRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, collectionIds } = { ...req.body, ...req.query };

    if (collectionIds) return await getCollections(req, res, next)
    else if (!collectionId) throw new Error('Missing collectionId');

    const collection = await assetlayer.collections.getCollection(collectionId);

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

    const collections = await assetlayer.collections.getCollections(collectionIds);

    return res.json(collections);
  }
  catch (e) {
    return next(e);
  }
}

type GetCollectionAssetsProps = { collectionId: string; serials?: string; idOnly?: boolean; };
type GetCollectionAssetsRequest = Request<{},{},GetCollectionAssetsProps,GetCollectionAssetsProps>;
export const getCollectionAssets = async (req: GetCollectionAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, serials, idOnly } = { ...req.body, ...req.query };

    const assets = await assetlayer.collections.getCollectionAssets(collectionId, serials, idOnly);

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

type CreateCollectionRequest = Request<{},{},CreateCollectionProps,CreateCollectionProps>;
export const createCollection = async (req: CreateCollectionRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionName, slotId, type, maximum, handle, description, tags, royaltyHandle, 
      collectionImage, collectionBanner, properties } = { ...req.body, ...req.query };

    const success = await assetlayer.collections.createCollection({ 
      collectionName, slotId, type, maximum, handle, description, tags, 
      royaltyHandle, collectionImage, collectionBanner, properties 
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
    const { collectionId, description, tags, royaltyHandle, collectionImage, collectionBanner, properties } = { ...req.body, ...req.query };

    const success = await assetlayer.collections.updateCollection({ 
      collectionId, description, tags, royaltyHandle, collectionImage, collectionBanner, properties 
    });

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}

type ActivateCollectionProps = { collectionId: string; };
type ActivateCollectionRequest = Request<{},{},ActivateCollectionProps,ActivateCollectionProps>;
export const activateCollection = async (req: ActivateCollectionRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const collectionId = req.query.collectionId || req.body.collectionId;

    const success = await assetlayer.collections.activateCollection(collectionId);

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}

type DeactivateCollectionProps = { collectionId: string; };
type DeactivateCollectionRequest = Request<{},{},DeactivateCollectionProps,DeactivateCollectionProps>;
export const deactivateCollection = async (req: DeactivateCollectionRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const collectionId = req.query.collectionId || req.body.collectionId;

    const success = await assetlayer.collections.deactivateCollection(collectionId);

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateCollectionImageProps = { collectionId: string; value: string; };
type UpdateCollectionImageRequest = Request<{},{},UpdateCollectionImageProps,UpdateCollectionImageProps>;
export const updateCollectionImage = async (req: UpdateCollectionImageRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, value } = { ...req.body, ...req.query };

    const success = await assetlayer.collections.updateCollectionImage(collectionId, value);

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}