import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { formatIncomingHeaders } from "../../utils/basic-format";

type GetUserRequest = Request<{},{},{},{}>;
export const getUser = async (req: GetUserRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const response = await assetlayer.users.raw.getUser(headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}