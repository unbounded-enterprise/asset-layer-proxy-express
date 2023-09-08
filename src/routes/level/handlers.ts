import { Request, NextFunction } from "express";
import { CustomResponse } from "../../types/basic-types";
import { EndLevelProps, StartLevelProps, generateLevelProps, handleLevelEnd } from "../../utils/game-logic";

type StartLevelRequest = Request<{},{},StartLevelProps,StartLevelProps>;
export const start = async (req: StartLevelRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { number } = { ...req.body, ...req.query };

    const levelProps = await generateLevelProps({ number });

    return res.json({ statusCode: 200, success: true, body: levelProps });
  }
  catch (e) {
    return next(e);
  }
}

type EndLevelRequest = Request<{},{},EndLevelProps,EndLevelProps>;
export const end = async (req: EndLevelRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { coins, complete, endedAt } = { ...req.body, ...req.query };

    const completionProps = await handleLevelEnd({ coins, complete, endedAt });

    return res.json({ statusCode: 200, success: true, body: completionProps });
  }
  catch (e) {
    return next(e);
  }
}