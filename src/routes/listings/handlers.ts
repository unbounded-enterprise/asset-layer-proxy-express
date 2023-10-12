import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { BuyListingProps, GetAppListingsProps, GetCollectionListingsProps, GetListingProps, GetUserListingsProps, ListingAppProps, ListingCollectionProps, ListingNewProps, ListingUserProps, RemoveListingProps, UpdateListingProps } from "@assetlayer/sdk/dist/types/listing";
import { formatIncomingHeaders } from "../../utils/basic-format";

type ListingInfoRequest = Request<{},{},GetListingProps,GetListingProps>;
export const info = async (req: ListingInfoRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const listingId = req.query.listingId || req.body.listingId;

    const response = await assetlayer.listings.raw.getListing({ listingId });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type ListingUserRequest = Request<{},{},ListingUserProps,ListingUserProps>;
export const user = async (req: ListingUserRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { sellerOnly, buyerOnly, status, collectionId, countsOnly, walletUserId } = { ...req.body, ...req.query };

    const response = await assetlayer.listings.raw.user({ sellerOnly, buyerOnly, status, collectionId, countsOnly, walletUserId }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type ListingCollectionRequest = Request<{},{},ListingCollectionProps,ListingCollectionProps>;
export const collection = async (req: ListingCollectionRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, collectionIds, status, lastUpdatedAt, countsOnly, collectionStats } = { ...req.body, ...req.query };

    const response = await assetlayer.listings.raw.collection({ collectionId, collectionIds, status, lastUpdatedAt, countsOnly, collectionStats });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type ListingAppRequest = Request<{},{},ListingAppProps,ListingAppProps>;
export const app = async (req: ListingAppRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { appId, status, lastUpdatedAt, countsOnly, collectionStats, includeForeignSlots } = { ...req.body, ...req.query };

    const response = await assetlayer.listings.raw.app({ appId, status, lastUpdatedAt, countsOnly, collectionStats, includeForeignSlots });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type ListingNewRequest = Request<{},{},ListingNewProps,ListingNewProps>;
export const newListing = async (req: ListingNewRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { price, currency, currencyId, assetId, assetIds, collectionId, liveTime, status, walletUserId } = { ...req.body, ...req.query };

    if (!(assetId || assetIds || collectionId)) throw new Error('Must provide either assetId, assetIds, or collectionId');

    const response = await assetlayer.listings.raw.new({ price, currency, currencyId, assetId, assetIds, collectionId, liveTime, status, walletUserId }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type BuyListingRequest = Request<{},{},BuyListingProps,BuyListingProps>;
export const buyListing = async (req: BuyListingRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { listingId, price, currency, currencyId } = { ...req.body, ...req.query };

    const response = await assetlayer.listings.raw.buyListing({ listingId, price, currency, currencyId }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type UpdateListingRequest = Request<{},{},UpdateListingProps,UpdateListingProps>;
export const updateListing = async (req: UpdateListingRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { listingId, price, currency, currencyId, liveTime, status, walletUserId } = { ...req.body, ...req.query };

    const response = await assetlayer.listings.raw.updateListing({ listingId, price, currency, currencyId, liveTime, status, walletUserId }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type RemoveListingRequest = Request<{},{},RemoveListingProps,RemoveListingProps>;
export const removeListing = async (req: RemoveListingRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { listingId, walletUserId } = { ...req.body, ...req.query };

    const response = await assetlayer.listings.raw.removeListing({ listingId, walletUserId }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}