import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { GetEquipsProps, RemoveEquipProps, SetEquipProps } from "@assetlayer/sdk/dist/types/equip";

type GetEquipRequest = Request<{},{},GetEquipsProps,GetEquipsProps>;
export const getEquips = async (req: GetEquipRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const asset = await assetlayer.equips.getEquips({ ...req.body, ...req.query });

    return res.json(asset);
  }
  catch (e) {
    return next(e);
  }
}

type SetEquipRequest = Request<{},{},SetEquipProps,SetEquipProps>;
export const setEquip = async (req: SetEquipRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const asset = await assetlayer.equips.setEquip({ ...req.body, ...req.query });

    return res.json(asset);
  }
  catch (e) {
    return next(e);
  }
}

type RemoveEquipRequest = Request<{},{},RemoveEquipProps,RemoveEquipProps>;
export const removeEquip = async (req: RemoveEquipRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const asset = await assetlayer.equips.removeEquip({ ...req.body, ...req.query });

    return res.json(asset);
  }
  catch (e) {
    return next(e);
  }
}