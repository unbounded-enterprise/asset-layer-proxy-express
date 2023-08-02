/*
import { Request, NextFunction } from "express";
import { CustomResponse } from "../../types/basic-types";

export const getDID = async (req: any, res: CustomResponse, next: NextFunction) => {
  try {
    return res.sendFile('did.html', { root: 'src/routes/magic' });
  }
  catch (e) {
    return next(e);
  }
}
*/