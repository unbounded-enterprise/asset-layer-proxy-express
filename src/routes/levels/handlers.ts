import { Request, NextFunction } from "express";
import { BasicError, CustomResponse } from "../../types/basic-types";
import { DBPlay, generateLevelProps, handleLevelEnd } from "../../utils/game-logic";
import { assetlayer, rolltopiaDB } from "../../server";
import { ObjectId } from "mongodb";
import { formatIncomingHeaders } from "../../utils/basic-format";

export const rolltopiaCurrencyId = "64f774cb151a6a3dee16df7c";

export type StartLevelProps = { 
  userId: string; // ObjectId used to save play
  number: number; // level number
  startedAt: number; // started timestamp (milliseconds) set before request
};
type StartLevelRequest = Request<{},{},StartLevelProps,StartLevelProps>;
export const start = async (req: StartLevelRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const now = Date.now();
    const { userId, number, startedAt } = { ...req.body, ...req.query };
    console.log(`started[${number}]: ${userId} @${now}//${startedAt}//${now - startedAt}`);
    if (number > 100) throw new BasicError('Max level is 100', 400);

    const [levelProps, minRunTime, maxCoins, platformGaps, platformCoins] = await generateLevelProps(number);
    const dbPlay = { _id: new ObjectId(userId), playId: levelProps.playId, playerSpeed: levelProps.playerMovingSpeed, serverStartedAt: now, clientStartedAt: startedAt, level: number, minRunTime, maxCoins, platformGaps, platformCoins };
    
    await rolltopiaDB.collection('plays').replaceOne({ _id: dbPlay._id }, dbPlay, { upsert: true }); 

    return res.json({ statusCode: 200, success: true, body: levelProps });
  }
  catch (e) {
    return next(e);
  }
}

export type EndLevelProps = { 
  userId: string; // userId used to save play
  playId: string;  // playId returned from start
  coins: number; // coins collected by player
  completed: boolean; // whether player completed level
  endedAt: number; // ended timestamp (milliseconds) set before request
  adWatched: boolean; // TEMPORARY: whether player watched ad for bonus (completed only)
};
type EndLevelRequest = Request<{},{},EndLevelProps,EndLevelProps>;
export const end = async (req: EndLevelRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { userId, playId, coins, completed, endedAt, adWatched } = { ...req.body, ...req.query };
    const dbPlay = (await rolltopiaDB.collection('plays').findOne({ _id: new ObjectId(userId) })) as DBPlay | null;

    if (!dbPlay) throw new BasicError('Play not found', 404);
    else if (dbPlay.playId.toString() !== playId) throw new BasicError('Play ID mismatch', 400);

    const rewardAmount = await handleLevelEnd({ coins, completed, endedAt, adWatched }, dbPlay);
    const balance = await assetlayer.currencies.increaseCurrencyBalance({ currencyId: rolltopiaCurrencyId, amount: rewardAmount }, headers);

    await rolltopiaDB.collection('plays').deleteOne({ _id: dbPlay._id });

    return res.json({ statusCode: 200, success: true, body: { balance } });
  }
  catch (e) {
    return next(e);
  }
}