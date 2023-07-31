import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { GetAppSlotsProps } from "@assetlayer/sdk/dist/types/app";
import { parseBasicError } from "../../utils/basic-error";

type GetAppProps = { appId?: string; appIds?: string[]; };
type GetAppRequest = Request<{},{},GetAppProps,GetAppProps>;
export const getApp = async (req: GetAppRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { appId, appIds } = { ...req.body, ...req.query };

    if (appIds) return await getApps(req, res, next);
    else if (!appId) throw new Error('Missing appId');

    const app = await assetlayer.apps.getApp({ appId });

    return res.json(app);
  }
  catch (e) {
    return next(e);
  }
}

export const getApps = async (req: GetAppRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { appId, appIds=[] } = { ...req.body, ...req.query };

    if (appId) appIds.push(appId);

    const app = await assetlayer.apps.getApps({ appIds });

    return res.json(app);
  }
  catch (e) {
    return next(e);
  }
}

type GetAppSlotsRequest = Request<{},{},GetAppSlotsProps,GetAppSlotsProps>;
export const getAppSlots = async (req: GetAppSlotsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const slots = await assetlayer.apps.getAppSlots({ ...req.body, ...req.query });

    return res.json(slots);
  }
  catch (e) {
    return next(e);
  }
}