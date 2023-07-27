import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";

type GetAppProps = { appId?: string; appIds?: string[]; };
type GetAppRequest = Request<{},{},GetAppProps,GetAppProps>;
export const getApp = async (req: GetAppRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { appId, appIds } = { ...req.body, ...req.query };

    if (appIds) return await getApps(req, res, next);
    else if (!appId) throw new Error('Missing appId');

    const app = await assetlayer.apps.getApp(appId);

    console.log('app', app);

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

    const app = await assetlayer.apps.getApps(appIds);

    return res.json(app);
  }
  catch (e) {
    return next(e);
  }
}

type GetAppSlotsProps = { appId: string; idOnly?: boolean; };
type GetAppSlotsRequest = Request<{},{},GetAppSlotsProps,GetAppSlotsProps>;
export const getAppSlots = async (req: GetAppSlotsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { appId, idOnly } = { ...req.body, ...req.query };

    const slots = null; // await assetlayer.apps.getAppSlots(appId, idOnly);

    return res.json(slots);
  }
  catch (e) {
    return next(e);
  }
}