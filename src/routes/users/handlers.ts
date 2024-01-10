import { Request, NextFunction } from "express";
import { assetlayer } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { formatIncomingHeaders } from "../../utils/basic-format";
import { RegisterUserProps } from "@assetlayer/sdk";

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

/*
type RegisterUserRequest = Request<{},{},RegisterUserProps,{}>;
export const registerUser = async (req: RegisterUserRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { otp } = req.body;

    const response = await assetlayer.users.raw.register({ otp }, headers);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}
*/