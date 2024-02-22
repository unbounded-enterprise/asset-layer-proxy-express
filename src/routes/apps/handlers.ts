import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { AppInfoProps, AppSlotsProps } from "@assetlayer/sdk/dist/types/app";
import { parseBasicError } from "../../utils/basic-error";
import { BasicError } from "@assetlayer/sdk/dist/types/basic-types";

type AppInfoRequest = Request<{},{},AppInfoProps,AppInfoProps>;
export const info = async (req: AppInfoRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { appId, appIds } = { ...req.body, ...req.query };

    if (!(appId || appIds)) throw new BasicError('Missing appId(s)', 400);

    const response = await assetlayer.apps.raw.info({ appId, appIds });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type AppSlotsRequest = Request<{},{},AppSlotsProps,AppSlotsProps>;
export const slots = async (req: AppSlotsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const response = await assetlayer.apps.raw.getAppSlots({ ...req.body, ...req.query });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}