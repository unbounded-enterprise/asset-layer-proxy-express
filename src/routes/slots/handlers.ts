import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { GetSlotProps, SlotCollectionsProps } from "@assetlayer/sdk/dist/types/slot";

type GetSlotRequest = Request<{},{},GetSlotProps,GetSlotProps>;
export const getSlot = async (req: GetSlotRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const slotId = req.query.slotId || req.body.slotId;

    const response = await assetlayer.slots.raw.getSlot({ slotId });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

type SlotCollectionsRequest = Request<{},{},SlotCollectionsProps,SlotCollectionsProps>;
export const collections = async (req: SlotCollectionsRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { slotId, idOnly, includeDeactivated, includeDrafts, includeSubmissionData } = { ...req.body, ...req.query };

    const response = await assetlayer.slots.raw.collections({ slotId, idOnly, includeDeactivated, includeDrafts, includeSubmissionData });

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}