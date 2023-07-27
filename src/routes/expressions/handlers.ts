import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";

type GetAppQuery = {
  appId?: string;
  appIds?: string[];
}
export const getApp = async (req: Request, res: CustomResponse, next: NextFunction) => {
  try {
    const { appId, appIds } = { ...req.body, ...req.query } as GetAppQuery;

    if (!appId) throw new Error('Missing appId');

    const app = await assetlayer.apps.getApp(appId);

    return res.json(app);
  }
  catch (e) {
    return next(e);
  }
}