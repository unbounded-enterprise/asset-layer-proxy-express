import { Request, NextFunction } from "express";
import { BasicError, CustomResponse } from "../../types/basic-types";
import { DBPlay, generateLevelProps, handleLevelEnd } from "../../utils/game-logic";
import { assetlayer, rolltopiaDB } from "../../server";
import { ObjectId } from "mongodb";
import { formatIncomingHeaders } from "../../utils/basic-format";
import { DBPlayHelix, generateLevelPropsHelix, handleLevelEndHelix } from "../../utils/game-logic-helix";
import { RolltopiaUser } from "../users/handlers";

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

    return res.json({ statusCode: 200, success: true, body: { balance, rewardAmount } });
  }
  catch (e) {
    return next(e);
  }
}


export const startHelix = async (req: StartLevelRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const now = Date.now();
    const { userId, number, startedAt } = { ...req.body, ...req.query };
    console.log(`helix-started[${number}]: ${userId} @${now}//${startedAt}//${now - startedAt}`);
    if (number > 100) throw new BasicError('Max level is 100', 400);

    const [levelProps, minRunTime, maxCoins, helixCoins] = await generateLevelPropsHelix(number);
    const dbPlay = { _id: new ObjectId(userId), playId: levelProps.playId, fallingSpeed: levelProps.fallingSpeed, serverStartedAt: now, clientStartedAt: startedAt, level: number, minRunTime, maxCoins, helixCoins };
    
    await rolltopiaDB.collection('plays-helix').replaceOne({ _id: dbPlay._id }, dbPlay, { upsert: true }); 

    return res.json({ statusCode: 200, success: true, body: levelProps });
  }
  catch (e) {
    return next(e);
  }
}

export type HelixLimiter = {
  _id: ObjectId;
  lastPlays: {
    start: number;
    earned: number;
  }[];
}

const oneHourMS = 1000 * 60 * 60;
const coinsPerHour = 1000;
function getCoinLimit(start: number, earned: number, limiter: HelixLimiter | null) {
  if (!limiter || limiter.lastPlays.length < 10) return 0;

  const now = Date.now();
  const elapsed = now - limiter.lastPlays[0].start;
  if (elapsed > oneHourMS) return 0;
  
  const playDuration = now - start;
  const limited = Math.round((coinsPerHour * (playDuration / oneHourMS)) * playDuration);
  if (earned <= limited) return 0;

  const coinsEarned = limiter.lastPlays.reduce((acc, curr) => acc + curr.earned, 0) + earned;
  const maxEarnings = coinsPerHour * (elapsed / oneHourMS);
  if (coinsEarned <= maxEarnings) return 0;

  console.log('Coins Limited:', limited)

  return limited;
}

export const endHelix = async (req: EndLevelRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { userId, playId, coins, completed, endedAt, adWatched } = { ...req.body, ...req.query };
    const userOId = new ObjectId(userId);
    const [dbPlay, dbLimiter] = (await Promise.all([
      rolltopiaDB.collection('plays-helix').findOne({ _id: userOId }), 
      rolltopiaDB.collection('limiter-helix').findOne({ _id: userOId })
    ])) as [DBPlayHelix | null, HelixLimiter | null];

    if (!dbPlay) throw new BasicError('Play not found', 404);
    else if (dbPlay.playId.toString() !== playId) throw new BasicError('Play ID mismatch', 400);

    const coinsEarned = await handleLevelEndHelix({ coins, completed, endedAt }, dbPlay);
    let multiplier = 1 + (dbPlay.level / 100);
    if (adWatched && completed) multiplier *= 2;
    const coinLimit = getCoinLimit(dbPlay.serverStartedAt, coinsEarned, dbLimiter);
    const coinBase = coinLimit || coinsEarned;
    const rewardAmount = Math.round(((completed) ? coinBase + 50 : coinBase) * multiplier);
    
    const balance = await assetlayer.currencies.increaseCurrencyBalance({ currencyId: rolltopiaCurrencyId, amount: rewardAmount }, headers);
    const updatedLimiter = { lastPlays: dbLimiter?.lastPlays || [] };
    if (updatedLimiter.lastPlays.length >= 10) updatedLimiter.lastPlays.shift();
    updatedLimiter.lastPlays.push({ start: dbPlay.serverStartedAt, earned: coinsEarned });

    await Promise.all([
      rolltopiaDB.collection('plays-helix').deleteOne({ _id: dbPlay._id }),
      rolltopiaDB.collection('limiter-helix').updateOne({ _id: userOId }, { $set: updatedLimiter }, { upsert: true })
    ]);

    return res.json({ statusCode: 200, success: true, body: { balance, rewardAmount } });
  }
  catch (e) {
    return next(e);
  }
}