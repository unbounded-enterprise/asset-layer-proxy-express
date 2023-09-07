import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";

type GetUserRequest = Request<{},{},{},{}>;
export const getUser = async (req: GetUserRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const response = await assetlayer.users.raw.getUser();

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}