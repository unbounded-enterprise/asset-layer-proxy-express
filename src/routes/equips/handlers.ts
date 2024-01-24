import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { GetEquipsProps, RemoveEquipProps, SetEquipProps } from "@assetlayer/sdk/dist/types/equip";
import { formatIncomingHeaders } from "../../utils/basic-format";

type GetEquipRequest = Request<{},{},GetEquipsProps,GetEquipsProps>;
export const getEquips = async (req: GetEquipRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const response = await assetlayer.equips.raw.getEquips({ ...req.body, ...req.query }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type SetEquipRequest = Request<{},{},SetEquipProps>;
export const setEquip = async (req: SetEquipRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const response = await assetlayer.equips.raw.setEquip(req.body, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type RemoveEquipRequest = Request<{},{},RemoveEquipProps>;
export const removeEquip = async (req: RemoveEquipRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const response = await assetlayer.equips.raw.removeEquip(req.body, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}