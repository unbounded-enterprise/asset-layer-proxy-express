import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { GetUserAssetsProps, GetUserCollectionAssetsProps, GetUserCollectionsAssetsProps, GetUserSlotAssetsProps, GetUserSlotsAssetsProps, MintAssetsProps, SendAssetAllProps, SendAssetProps, SendAssetsProps, SendCollectionAssetsProps, UpdateAssetProps, UpdateAssetsProps, UpdateCollectionAssetsProps } from "@assetlayer/sdk/dist/types/asset";
import { IncomingHttpHeaders } from "http";
import { incomingHeadersToHeadersInit } from "../../utils/basic-format";

type GetAssetProps = { assetId?: string; assetIds?: string[]; };
type GetAssetRequest = Request<{},{},GetAssetProps,GetAssetProps>;
export const getAsset = async (req: GetAssetRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { assetId, assetIds } = { ...req.body, ...req.query };

    if (assetIds) return await getAssets(req, res, next);
    else if (!assetId) throw new Error('Missing assetId');

    const asset = await assetlayer.assets.getAsset({ assetId });

    return res.json(asset);
  }
  catch (e) {
    return next(e);
  }
}

export const getAssets = async (req: GetAssetRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { assetId, assetIds=[] } = { ...req.body, ...req.query };

    if (assetId) assetIds.push(assetId);

    const assets = await assetlayer.assets.getAssets({ assetIds });

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

type GetUserAssetsRequest = Request<{},{},GetUserAssetsProps,GetUserAssetsProps>;
export const getUserAssets = async (req: GetUserAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = incomingHeadersToHeadersInit(req.headers);
    const { walletUserId, idOnly } = { ...req.body, ...req.query };

    const assets = await assetlayer.assets.getUserAssets({ walletUserId, idOnly }, headers);

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

type GetUserCollectionAssetsRequest = Request<{},{},GetUserCollectionAssetsProps,GetUserCollectionAssetsProps>;
export const getUserCollectionAssets = async (req: GetUserCollectionAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = incomingHeadersToHeadersInit(req.headers);
    const { collectionId, walletUserId, serials, range, idOnly, countsOnly } = { ...req.body, ...req.query };

    const assets = await assetlayer.assets.getUserCollectionAssets({ collectionId, walletUserId, serials, range, idOnly, countsOnly }, headers);

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

type GetUserCollectionsAssetsRequest = Request<{},{},GetUserCollectionsAssetsProps,GetUserCollectionsAssetsProps>;
export const getUserCollectionsAssets = async (req: GetUserCollectionsAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = incomingHeadersToHeadersInit(req.headers);
    const { collectionIds, walletUserId, idOnly, countsOnly } = { ...req.body, ...req.query };

    const assets = await assetlayer.assets.getUserCollectionsAssets({ collectionIds, walletUserId, idOnly, countsOnly }, headers);

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

type GetUserSlotAssetsRequest = Request<{},{},GetUserSlotAssetsProps,GetUserSlotAssetsProps>;
export const getUserSlotAssets = async (req: GetUserSlotAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = incomingHeadersToHeadersInit(req.headers);
    const { slotId, walletUserId, idOnly, countsOnly } = { ...req.body, ...req.query };

    const assets = await assetlayer.assets.getUserSlotAssets({ slotId, walletUserId, idOnly, countsOnly }, headers);

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

type GetUserSlotsAssetsRequest = Request<{},{},GetUserSlotsAssetsProps,GetUserSlotsAssetsProps>;
export const getUserSlotsAssets = async (req: GetUserSlotsAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = incomingHeadersToHeadersInit(req.headers);
    const { slotIds, walletUserId, includeDeactivated, idOnly, countsOnly } = { ...req.body, ...req.query };

    const assets = await assetlayer.assets.getUserSlotsAssets({ slotIds, walletUserId, includeDeactivated, idOnly, countsOnly }, headers);

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

type MintAssetsRequest = Request<{},{},MintAssetsProps,MintAssetsProps>;
export const mintAssets = async (req: MintAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = incomingHeadersToHeadersInit(req.headers);
    const { collectionId, number, walletUserId } = { ...req.body, ...req.query };

    const result = await assetlayer.assets.mintAssets({ collectionId, number, walletUserId }, headers);

    return res.json(result);
  }
  catch (e) {
    return next(e);
  }
}

type SendRequest = Request<{},{},SendAssetAllProps,SendAssetAllProps>;
export const send = async (req: SendRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = incomingHeadersToHeadersInit(req.headers);
    const { receiver, walletUserId, assetId, assetIds, collectionId } = { ...req.body, ...req.query };

    if (!(assetId || assetIds || collectionId)) throw new Error('Must provide either assetId, assetIds or collectionId');

    const result = (assetId) ? await assetlayer.assets.sendAsset({ receiver, assetId, walletUserId }, headers)
      : (assetIds) ? await assetlayer.assets.sendAssets({ receiver, assetIds, walletUserId }, headers)
      : await assetlayer.assets.sendCollectionAssets({ receiver, collectionId: collectionId!, walletUserId }, headers);

    return res.json(result);
  }
  catch (e) {
    return next(e);
  }
}

type SendAssetRequest = Request<{},{},SendAssetProps,SendAssetProps>;
export const sendAsset = async (req: SendAssetRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = incomingHeadersToHeadersInit(req.headers);
    const { assetId, receiver, walletUserId } = { ...req.body, ...req.query };

    const result = await assetlayer.assets.sendAsset({ receiver, assetId, walletUserId }, headers);

    return res.json(result);
  }
  catch (e) {
    return next(e);
  }
}

type SendAssetsRequest = Request<{},{},SendAssetsProps,SendAssetsProps>;
export const sendAssets = async (req: SendAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = incomingHeadersToHeadersInit(req.headers);
    const { receiver, assetIds, walletUserId } = { ...req.body, ...req.query };

    const result = await assetlayer.assets.sendAssets({ receiver, assetIds, walletUserId }, headers);

    return res.json(result);
  }
  catch (e) {
    return next(e);
  }
}

type SendCollectionAssetsRequest = Request<{},{},SendCollectionAssetsProps,SendCollectionAssetsProps>;
export const sendCollectionAssets = async (req: SendCollectionAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = incomingHeadersToHeadersInit(req.headers);
    const { receiver, collectionId, walletUserId } = { ...req.body, ...req.query };

    const result = await assetlayer.assets.sendCollectionAssets({ receiver, collectionId, walletUserId }, headers);

    return res.json(result);
  }
  catch (e) {
    return next(e);
  }
}

type SendLowestAssetRequest = Request<{},{},SendCollectionAssetsProps,SendCollectionAssetsProps>;
export const sendLowestAsset = async (req: SendLowestAssetRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = incomingHeadersToHeadersInit(req.headers);
    const { receiver, collectionId, walletUserId } = { ...req.body, ...req.query };

    const result = await assetlayer.assets.sendLowestAsset({ receiver, collectionId, walletUserId }, headers);

    return res.json(result);
  }
  catch (e) {
    return next(e);
  }
}

type SendRandomAssetRequest = Request<{},{},SendCollectionAssetsProps,SendCollectionAssetsProps>;
export const sendRandomAsset = async (req: SendRandomAssetRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = incomingHeadersToHeadersInit(req.headers);
    const { receiver, collectionId, walletUserId } = { ...req.body, ...req.query };

    const result = await assetlayer.assets.sendRandomAsset({ receiver, collectionId, walletUserId }, headers);

    return res.json(result);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateAssetRequest = Request<{},{},UpdateAssetProps,UpdateAssetProps>;
export const updateAsset = async (req: UpdateAssetRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { properties, assetId } = { ...req.body, ...req.query };

    const result = await assetlayer.assets.updateAsset({ properties, assetId });

    return res.json(result);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateAssetsRequest = Request<{},{},UpdateAssetsProps,UpdateAssetsProps>;
export const updateAssets = async (req: UpdateAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { properties, assetIds } = { ...req.body, ...req.query };

    const result = await assetlayer.assets.updateAssets({ properties, assetIds });

    return res.json(result);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateCollectionAssetsRequest = Request<{},{},UpdateCollectionAssetsProps,UpdateCollectionAssetsProps>;
export const updateCollectionAssets = async (req: UpdateCollectionAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { properties, collectionId } = { ...req.body, ...req.query };

    const result = await assetlayer.assets.updateCollectionAssets({ properties, collectionId });

    return res.json(result);
  }
  catch (e) {
    return next(e);
  }
}
