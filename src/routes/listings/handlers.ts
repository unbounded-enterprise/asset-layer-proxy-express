import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";

type GetListingProps = { listingId: string; };
type GetListingRequest = Request<{},{},GetListingProps,GetListingProps>;
export const getListing = async (req: GetListingRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const listingId = req.query.listingId || req.body.listingId;

    const listing = await assetlayer.listings.getListing(listingId);

    return res.json(listing);
  }
  catch (e) {
    return next(e);
  }
}

/*
type GetUserListingsRequest = Request<{},{},GetUserListingsProps,GetUserListingsProps>;
export const getUserListings = async (req: GetUserListingsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { handle, sellerOnly, buyerOnly, status, collectionId, countsOnly } = { ...req.body, ...req.query };

    const listings = await assetlayer.listings.getUserListings(listingId);

    return res.json(listing);
  }
  catch (e) {
    return next(e);
  }
}
*/

/*
type GetCollectionListingsRequest = Request<{},{},GetCollectionListingsProps,GetCollectionListingsProps>;
export const getCollectionListings = async (req: GetCollectionListingsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { collectionId, collectionIds, status, lastUpdatedAt, countsOnly, collectionStats } = { ...req.body, ...req.query };

    const listings = await assetlayer.listings.getCollectionListings({ collectionId, collectionIds, status, lastUpdatedAt, countsOnly, collectionStats });

    return res.json(listing);
  }
  catch (e) {
    return next(e);
  }
}
*/

/*
type GetAppListingsRequest = Request<{},{},GetAppListingsProps,GetAppListingsProps>;
export const getAppListings = async (req: GetAppListingsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { appId, status, lastUpdatedAt, countsOnly, collectionStats } = { ...req.body, ...req.query };

    const listings = await assetlayer.listings.getAppListings({ appId, status, lastUpdatedAt, countsOnly, collectionStats });

    return res.json(listing);
  }
  catch (e) {
    return next(e);
  }
}
*/

/*
type CreateListingRequest = Request<{},{},CreateListingProps,CreateListingProps>;
export const createListing = async (req: CreateListingRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { handle, price, nftId, nftIds, collectionId, liveTime, status } = { ...req.body, ...req.query };

    const success = null; // await assetlayer.listings.createListing({ handle, price, nftId, nftIds, collectionId, liveTime, status });

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}
*/

type BuyListingProps = { listingId: string; handle: string; price?: number; };
type BuyListingRequest = Request<{},{},BuyListingProps,BuyListingProps>;
export const buyListing = async (req: BuyListingRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { listingId, handle, price } = { ...req.body, ...req.query };

    const success = null; // await assetlayer.listings.buyListing(listingId, handle, price);

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}

/*
type UpdateListingRequest = Request<{},{},UpdateListingProps,UpdateListingProps>;
export const updateListing = async (req: UpdateListingRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { listingId, handle, price, liveTime, status } = { ...req.body, ...req.query };

    const success = await assetlayer.listings.updateListing({ listingId, handle, price, liveTime, status });

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}
*/

type RemoveListingProps = { listingId: string; handle: string; };
type RemoveListingRequest = Request<{},{},RemoveListingProps,RemoveListingProps>;
export const removeListing = async (req: RemoveListingRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { listingId, handle } = { ...req.body, ...req.query };

    const success = null; // await assetlayer.listings.removeListing(listingId, handle);

    return res.json(success);
  }
  catch (e) {
    return next(e);
  }
}