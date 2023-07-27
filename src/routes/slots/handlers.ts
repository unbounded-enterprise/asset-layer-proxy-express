import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";

type GetSlotProps = { slotId: string; };
type GetSlotRequest = Request<{},{},GetSlotProps,GetSlotProps>;
export const getSlot = async (req: GetSlotRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const slotId = req.query.slotId || req.body.slotId;

    const slot = await assetlayer.slots.getSlot(slotId);

    return res.json(slot);
  }
  catch (e) {
    return next(e);
  }
}

type GetSlotCollectionsProps = { slotId: string; idOnly?: boolean; includeDeactivated?: boolean; };
type GetSlotCollectionsRequest = Request<{},{},GetSlotCollectionsProps,GetSlotCollectionsProps>;
export const getSlotCollections = async (req: GetSlotCollectionsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { slotId, idOnly, includeDeactivated } = { ...req.body, ...req.query };

    const slot = null; // await assetlayer.slots.getSlotCollections(slotId, idOnly, includeDeactivated);

    return res.json(slot);
  }
  catch (e) {
    return next(e);
  }
}