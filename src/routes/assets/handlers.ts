import { Request, NextFunction } from "express";
import { assetlayer, rolltopiaDB } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { Asset, AssetCounts, AssetInfoProps, AssetSendProps, AssetUpdateProps, AssetUserProps, GetAssetHistoryProps, GetAssetOwnershipHistoryProps, GetUserCollectionAssetsProps, GetUserCollectionsAssetsProps, GetUserSlotAssetsProps, GetUserSlotsAssetsProps, MintAssetsProps, SendAssetProps, SendAssetsProps, SendCollectionAssetsProps, UpdateAssetProps, UpdateAssetsProps, UpdateCollectionAssetsProps } from "@assetlayer/sdk/dist/types/asset";
import { IncomingHttpHeaders } from "http";
import { formatIncomingHeaders } from "../../utils/basic-format";
import { BasicObject } from "@assetlayer/sdk";
import { RolltopiaUser, getRolltopiaUserInternal } from "../users/handlers";
import { ObjectId } from "mongodb";

export const rolliesSlotId = "651edf58aa4c0d48a4fe2c2c";
const rolliesCollectionIds = new Set([
  "652f212dba3c02e6b1b0b83e",
  "652f20abba3c02e6b1b0b5d7",
  "652f2037ba3c02e6b1b0b370",
  "652f1fadba3c02e6b1b0af91",
  "652f1f2aba3c02e6b1b0ad24",
  "652f1ea7ba3c02e6b1b0aab7",
  "652f1e1aba3c02e6b1b0a77f",
  "652f1da0ba3c02e6b1b0a512",
  "652f1d23ba3c02e6b1b0a2ab",
  "652f1c80ba3c02e6b1b09fd1",
  "652f1bf7ba3c02e6b1b09d6a",
  "652f1b36ba3c02e6b1b09ad6",
  "652ef598ba3c02e6b1b08c66",
  "651edf9aaa4c0d48a4fe2d45",
  "651ee146aa4c0d48a4fe329e",
  "651ee252aa4c0d48a4fe39e9",
]);

export function isTrue(bool?: boolean | string) {
  if (!bool) return false;

  return (bool === true || bool === 'True' || bool === 'true');
}

async function checkUserRollidex(data: AssetCounts, headers?: BasicObject<string>, filter?: boolean) {
  if (!headers?.didtoken) return;
  else if (!data) return;
  else if (Array.isArray(data)) return;

  const rollieKeys = (filter) ? Object.keys(data).filter(key => rolliesCollectionIds.has(key)) : Object.keys(data);
  if (!rollieKeys.length) return;

  const { result: user, error } = await assetlayer.users.safe.getUser(headers);
  if (!user) { 
    console.error(error);
    return;
  }
  const userOId = new ObjectId(user.userId);
  const { result: rolltopiaUser, error: error2 } = await getRolltopiaUserInternal(userOId);
  if (!rolltopiaUser) {
    console.error(error2);
    return;
  }
  else if (rolltopiaUser.achievements['Discover New Rollies']?.nextClaim === 'all') return;

  let dbUpdate: BasicObject<any> | undefined = undefined;
  for (const key of rollieKeys) {
    if (rolltopiaUser.rollidex[key]) continue;

    if (!dbUpdate) {
      const rollidexLength = Object.keys(rolltopiaUser.rollidex).length;
      if (!rolltopiaUser.achievements['Discover New Rollies']) dbUpdate = { ['achievements.Discover New Rollies']: { value: rollidexLength, nextClaim: 'common' } };
      else dbUpdate = { [`achievements.Discover New Rollies.value`]: rollidexLength };
    }

    dbUpdate[`rollidex.${key}`] = true;
    if (dbUpdate[`achievements.Discover New Rollies`]) dbUpdate[`achievements.Discover New Rollies`].value += 1;
    else dbUpdate[`achievements.Discover New Rollies.value`] += 1;
  }
  if (!dbUpdate) return;

  await rolltopiaDB.collection('users').updateOne({ _id: userOId }, { $set: dbUpdate });
}

async function formatThenCheckUserRollidex(assets: Asset[], headers?: BasicObject<string>, filter?: boolean) {
  if (!(assets.length > 0)) return;
  const userRollidex: AssetCounts = {};
  for (const asset of assets) {
    if (filter && !rolliesCollectionIds.has(asset.collectionId)) continue;
    if (!userRollidex[asset.collectionId]) userRollidex[asset.collectionId] = 1;
  }
  await checkUserRollidex(userRollidex, headers);
}

type AssetInfoRequest = Request<{},{},AssetInfoProps,AssetInfoProps>;
export const info = async (req: AssetInfoRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { assetId, assetIds } = { ...req.body, ...req.query };

    if (!(assetId || assetIds)) throw new Error('Missing assetId(s)');

    const response = await assetlayer.assets.raw.info({ assetId, assetIds });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type AssetUserRequest = Request<{},{},AssetUserProps,AssetUserProps>;
export const user = async (req: AssetUserRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { walletUserId, idOnly } = { ...req.body, ...req.query };

    const response = await assetlayer.assets.raw.user({ walletUserId, idOnly }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type GetUserCollectionAssetsRequest = Request<{},{},GetUserCollectionAssetsProps,GetUserCollectionAssetsProps>;
export const getUserCollectionAssets = async (req: GetUserCollectionAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { collectionId, walletUserId, serials, range, idOnly, countsOnly } = { ...req.body, ...req.query };

    const response = await assetlayer.assets.raw.getUserCollectionAssets({ collectionId, walletUserId, serials, range, idOnly, countsOnly }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type GetUserCollectionsAssetsRequest = Request<{},{},GetUserCollectionsAssetsProps,GetUserCollectionsAssetsProps>;
export const getUserCollectionsAssets = async (req: GetUserCollectionsAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { collectionIds, walletUserId, idOnly, countsOnly } = { ...req.body, ...req.query };

    const response = await assetlayer.assets.raw.getUserCollectionsAssets({ collectionIds, walletUserId, idOnly, countsOnly }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type GetUserSlotAssetsRequest = Request<{},{},GetUserSlotAssetsProps,GetUserSlotAssetsProps>;
export const getUserSlotAssets = async (req: GetUserSlotAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { slotId, walletUserId, idOnly, countsOnly } = { ...req.body, ...req.query };

    const response = await assetlayer.assets.raw.getUserSlotAssets({ slotId, walletUserId, idOnly, countsOnly }, headers);
    if (isTrue(countsOnly) && slotId === rolliesSlotId) checkUserRollidex(response.body.assets as AssetCounts, headers);
    else if (!isTrue(idOnly) && slotId === rolliesSlotId) formatThenCheckUserRollidex(response.body.assets as Asset[], headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type GetUserSlotsAssetsRequest = Request<{},{},GetUserSlotsAssetsProps,GetUserSlotsAssetsProps>;
export const getUserSlotsAssets = async (req: GetUserSlotsAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { slotIds, walletUserId, includeDeactivated, idOnly, countsOnly } = { ...req.body, ...req.query };

    const response = await assetlayer.assets.raw.getUserSlotsAssets({ slotIds, walletUserId, includeDeactivated, idOnly, countsOnly }, headers);
    if (isTrue(countsOnly) && slotIds.includes(rolliesSlotId)) checkUserRollidex(response.body.assets as AssetCounts, headers, true);
    else if (!isTrue(idOnly) && slotIds.includes(rolliesSlotId)) formatThenCheckUserRollidex(response.body.assets as Asset[], headers, true);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type GetAssetHistoryRequest = Request<{},{},GetAssetHistoryProps,GetAssetHistoryProps>;
export const getAssetHistory = async (req: GetAssetHistoryRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { assetId, limit, start } = { ...req.body, ...req.query };

    const response = await assetlayer.assets.raw.getAssetHistory({ assetId, limit, start }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type GetAssetMarketHistoryRequest = Request<{},{},GetAssetHistoryProps,GetAssetHistoryProps>;
export const getAssetMarketHistory = async (req: GetAssetMarketHistoryRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { assetId, limit, start } = { ...req.body, ...req.query };

    const response = await assetlayer.assets.raw.getAssetMarketHistory({ assetId, limit, start }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type GetAssetOwnershipHistoryRequest = Request<{},{},GetAssetOwnershipHistoryProps,GetAssetOwnershipHistoryProps>;
export const getAssetOwnershipHistory = async (req: GetAssetOwnershipHistoryRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { assetId, limit, start, ownersOnly } = { ...req.body, ...req.query };

    const response = await assetlayer.assets.raw.getAssetOwnershipHistory({ assetId, limit, start, ownersOnly }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type MintAssetsRequest = Request<{},{},MintAssetsProps,MintAssetsProps>;
export const mintAssets = async (req: MintAssetsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { collectionId, number, mintTo, walletUserId } = { ...req.body, ...req.query };

    const response = await assetlayer.assets.raw.mint({ collectionId, number, mintTo, walletUserId }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type AssetSendRequest = Request<{},{},AssetSendProps,AssetSendProps>;
export const send = async (req: AssetSendRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { receiver, walletUserId, assetId, assetIds, collectionId } = { ...req.body, ...req.query };

    if (!(assetId || assetIds || collectionId)) throw new Error('Missing assetId(s) or collectionId');

    const response = await assetlayer.assets.raw.send({ receiver, walletUserId, assetId, assetIds, collectionId }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type SendLowestAssetRequest = Request<{},{},SendCollectionAssetsProps,SendCollectionAssetsProps>;
export const sendLowestAsset = async (req: SendLowestAssetRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { receiver, collectionId, walletUserId } = { ...req.body, ...req.query };

    const response = await assetlayer.assets.raw.sendLowestAsset({ receiver, collectionId, walletUserId }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type SendRandomAssetRequest = Request<{},{},SendCollectionAssetsProps,SendCollectionAssetsProps>;
export const sendRandomAsset = async (req: SendRandomAssetRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { receiver, collectionId, walletUserId } = { ...req.body, ...req.query };

    const response = await assetlayer.assets.raw.sendRandomAsset({ receiver, collectionId, walletUserId }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type AssetUpdateRequest = Request<{},{},AssetUpdateProps,AssetUpdateProps>;
export const update = async (req: AssetUpdateRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { properties, assetId, assetIds, collectionId } = { ...req.body, ...req.query };
    
    if (!(assetId || assetIds || collectionId)) throw new Error('Missing assetId(s) or collectionId');

    const response = await assetlayer.assets.raw.update({ properties, assetId, assetIds, collectionId }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}
