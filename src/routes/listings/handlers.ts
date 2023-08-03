import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { BuyListingProps, CreateListingAllProps, GetAppListingsProps, GetCollectionListingsProps, GetListingProps, GetUserListingsProps, RemoveListingProps, UpdateListingProps } from "@assetlayer/sdk/dist/types/listing";
import { incomingHeadersToHeadersInit } from "../../utils/basic-format";

type GetListingRequest = Request<{},{},GetListingProps,GetListingProps>;
export const getListing = async (req: GetListingRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const listingId = req.query.listingId || req.body.listingId;

    const listing = await assetlayer.listings.getListing({ listingId });

    return res.json(listing);
  }
  catch (e) {
    return next(e);
  }
}

type GetUserListingsRequest = Request<{},{},GetUserListingsProps,GetUserListingsProps>;
export const getUserListings = async (req: GetUserListingsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = incomingHeadersToHeadersInit(req.headers);
    const { sellerOnly, buyerOnly, status, collectionId, countsOnly, walletUserId } = { ...req.body, ...req.query };

    const listings = await assetlayer.listings.getUserListings({ sellerOnly, buyerOnly, status, collectionId, countsOnly, walletUserId }, headers);

    return res.json(listings);
  }
  catch (e) {
    return next(e);
  }
}

type GetCollectionListingsRequest = Request<{},{},GetCollectionListingsProps,GetCollectionListingsProps>;
export const getCollectionListings = async (req: GetCollectionListingsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, collectionIds, status, lastUpdatedAt, countsOnly, collectionStats } = { ...req.body, ...req.query };

    const listings = await assetlayer.listings.getCollectionListings({ collectionId, collectionIds, status, lastUpdatedAt, countsOnly, collectionStats });

    return res.json(listings);
  }
  catch (e) {
    return next(e);
  }
}

type GetAppListingsRequest = Request<{},{},GetAppListingsProps,GetAppListingsProps>;
export const getAppListings = async (req: GetAppListingsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { appId, status, lastUpdatedAt, countsOnly, collectionStats } = { ...req.body, ...req.query };

    const listings = await assetlayer.listings.getAppListings({ appId, status, lastUpdatedAt, countsOnly, collectionStats });

    return res.json(listings);
  }
  catch (e) {
    return next(e);
  }
}

type CreateListingRequest = Request<{},{},CreateListingAllProps,CreateListingAllProps>;
export const createListing = async (req: CreateListingRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = incomingHeadersToHeadersInit(req.headers);
    const { price, assetId, assetIds, collectionId, liveTime, status, walletUserId } = { ...req.body, ...req.query };

    if (!(assetId || assetIds || collectionId)) throw new Error('Must provide either assetId, assetIds, or collectionId');

    const result = (assetId) ? await assetlayer.listings.createListing({ price, assetId, liveTime, status, walletUserId }, headers)
      : (assetIds) ? await assetlayer.listings.createListings({ price, assetIds, liveTime, status, walletUserId }, headers)
      : await assetlayer.listings.createCollectionListings({ price, collectionId: collectionId!, liveTime, status, walletUserId }, headers);

    return res.json(result);
  }
  catch (e) {
    return next(e);
  }
}

type BuyListingRequest = Request<{},{},BuyListingProps,BuyListingProps>;
export const buyListing = async (req: BuyListingRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = incomingHeadersToHeadersInit(req.headers);
    const { listingId, price } = { ...req.body, ...req.query };

    const success = await assetlayer.listings.buyListing({ listingId, price }, headers);

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateListingRequest = Request<{},{},UpdateListingProps,UpdateListingProps>;
export const updateListing = async (req: UpdateListingRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = incomingHeadersToHeadersInit(req.headers);
    const { listingId, price, liveTime, status, walletUserId } = { ...req.body, ...req.query };

    const success = await assetlayer.listings.updateListing({ listingId, price, liveTime, status, walletUserId }, headers);

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}

type RemoveListingRequest = Request<{},{},RemoveListingProps,RemoveListingProps>;
export const removeListing = async (req: RemoveListingRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = incomingHeadersToHeadersInit(req.headers);
    const { listingId, walletUserId } = { ...req.body, ...req.query };

    const success = await assetlayer.listings.removeListing({ listingId, walletUserId }, headers);

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}