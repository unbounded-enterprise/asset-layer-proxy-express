import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { GetUserCollectionAssetsProps, GetUserCollectionsAssetsProps, GetUserSlotAssetsProps, GetUserSlotsAssetsProps, UpdateAssetProps } from "dubby-sdk-test/dist/types/asset";

type GetAssetProps = { assetId?: string; assetIds?: string[]; };
type GetAssetRequest = Request<{},{},GetAssetProps,GetAssetProps>;
export const getAsset = async (req: GetAssetRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { assetId, assetIds } = { ...req.body, ...req.query };

    if (assetIds) return await getAssets(req, res, next);
    else if (!assetId) throw new Error('Missing assetId');

    const asset = await assetlayer.assets.getAsset(assetId);

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

    const assets = await assetlayer.assets.getAssets(assetIds);

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

type GetUserAssetsProps = { userId: string; idOnly?: boolean; };
type GetUserAssetsRequest = Request<{},{},GetUserAssetsProps,GetUserAssetsProps>;
export const getUserAssets = async (req: GetUserAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { userId, idOnly } = { ...req.body, ...req.query };

    const assets = await assetlayer.assets.getUserAssets(userId, idOnly);

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

type GetUserCollectionAssetsRequest = Request<{},{},GetUserCollectionAssetsProps,GetUserCollectionAssetsProps>;
export const getUserCollectionAssets = async (req: GetUserCollectionAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, handle, serials, range, idOnly, countsOnly } = { ...req.body, ...req.query };

    const assets = await assetlayer.assets.getUserCollectionAssets({ collectionId, handle, serials, range, idOnly, countsOnly });

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

type GetUserCollectionsAssetsRequest = Request<{},{},GetUserCollectionsAssetsProps,GetUserCollectionsAssetsProps>;
export const getUserCollectionsAssets = async (req: GetUserCollectionsAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionIds, handle, idOnly, countsOnly } = { ...req.body, ...req.query };

    const assets = await assetlayer.assets.getUserCollectionsAssets({ collectionIds, handle, idOnly, countsOnly });

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

type GetUserSlotAssetsRequest = Request<{},{},GetUserSlotAssetsProps,GetUserSlotAssetsProps>;
export const getUserSlotAssets = async (req: GetUserSlotAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { slotId, handle, idOnly, countsOnly } = { ...req.body, ...req.query };

    const assets = await assetlayer.assets.getUserSlotAssets({ slotId, handle, idOnly, countsOnly });

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

type GetUserSlotsAssetsRequest = Request<{},{},GetUserSlotsAssetsProps,GetUserSlotsAssetsProps>;
export const getUserSlotsAssets = async (req: GetUserSlotsAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { slotIds, handle, includeDeactivated, idOnly, countsOnly } = { ...req.body, ...req.query };

    const assets = await assetlayer.assets.getUserSlotsAssets({ slotIds, handle, includeDeactivated, idOnly, countsOnly });

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

type MintAssetsProps = { collectionId: string; amount: number; handle: string; };
type MintAssetsRequest = Request<{},{},MintAssetsProps,MintAssetsProps>;
export const mintAssets = async (req: MintAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, amount, handle } = { ...req.body, ...req.query };

    const assets = await assetlayer.assets.mintAssets(collectionId, amount, handle);

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

type SendAssetProps = { recipientHandle: string; handle: string; nftId?: string; nftIds?: string[]; };
type SendAssetRequest = Request<{},{},SendAssetProps,SendAssetProps>;
export const sendAsset = async (req: SendAssetRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { recipientHandle, handle, nftId, nftIds } = { ...req.body, ...req.query };

    if (nftIds) return await sendAssets(req, res, next)
    else if (!nftId) throw new Error('Missing nftId');

    const assets = await assetlayer.assets.sendAsset(recipientHandle, nftId, handle);

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

export const sendAssets = async (req: SendAssetRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { recipientHandle, handle, nftId, nftIds=[] } = { ...req.body, ...req.query };

    if (nftId) nftIds.push(nftId);

    const assets = await assetlayer.assets.sendAssets(recipientHandle, nftIds, handle);

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

type SendCollectionAssetsProps = { recipientHandle: string; collectionId: string; handle: string; };
type SendCollectionAssetsRequest = Request<{},{},SendCollectionAssetsProps,SendCollectionAssetsProps>;
export const sendCollectionAssets = async (req: SendCollectionAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { recipientHandle, collectionId, handle } = { ...req.body, ...req.query };

    const assets = await assetlayer.assets.sendCollectionAssets(recipientHandle, collectionId, handle);

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

type SendLowestAssetRequest = Request<{},{},SendCollectionAssetsProps,SendCollectionAssetsProps>;
export const sendLowestAsset = async (req: SendLowestAssetRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { recipientHandle, collectionId, handle } = { ...req.body, ...req.query };

    const assets = await assetlayer.assets.sendLowestAsset(recipientHandle, collectionId, handle);

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

type SendRandomAssetRequest = Request<{},{},SendCollectionAssetsProps,SendCollectionAssetsProps>;
export const sendRandomAsset = async (req: SendRandomAssetRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { recipientHandle, collectionId, handle } = { ...req.body, ...req.query };

    const assets = await assetlayer.assets.sendRandomAsset(recipientHandle, collectionId, handle);

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateAssetRequest = Request<{},{},UpdateAssetProps,UpdateAssetProps>;
export const updateAsset = async (req: UpdateAssetRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { properties, nftId, nftIds, collectionId } = { ...req.body, ...req.query };

    const assets = await assetlayer.assets.updateAsset({ properties, nftId, nftIds, collectionId });

    return res.json(assets);
  }
  catch (e) {
    return next(e);
  }
}