import { Request, NextFunction } from "express";
import { BasicError, CustomResponse } from "../../types/basic-types";
import { DBPlay, generateLevelProps, handleLevelEnd } from "../../utils/game-logic";
import { assetlayer, dbLimiterHelix, dbPlays, dbPlaysHelix, dbUsers, rolltopiaDB } from "../../server";
import { ObjectId } from "mongodb";
import { formatIncomingHeaders } from "../../utils/basic-format";
import { DBPlayHelix, generateLevelPropsHelix, handleLevelEndHelix } from "../../utils/game-logic-helix";
import { RolltopiaUser } from "../users/handlers";

export const rolltopiaCurrencyId = "6579e87778a838b7d59433fc";
    
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
    
    await dbPlays.replaceOne({ _id: dbPlay._id }, dbPlay, { upsert: true }); 

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
};
type EndLevelRequest = Request<{},{},EndLevelProps,EndLevelProps>;
export const end = async (req: EndLevelRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { userId, playId, coins, completed, endedAt } = { ...req.body, ...req.query };
    const userOId = new ObjectId(userId);
    const [dbUser, dbPlay] = await Promise.all([
      (completed) ? dbUsers.findOne({ _id: userOId }) : null,
      dbPlays.findOne({ _id: userOId })
    ]) as [RolltopiaUser | null, DBPlay | null];

    if (completed && !dbUser) throw new BasicError('User not found', 404);
    else if (!dbPlay) throw new BasicError('Play not found', 404);
    else if (dbPlay.playId.toString() !== playId) throw new BasicError('Play ID mismatch', 400);

    const rewardAmount = await handleLevelEnd({ coins, completed, endedAt }, dbPlay);
    const balance = await assetlayer.currencies.increaseCurrencyBalance({ currencyId: rolltopiaCurrencyId, amount: rewardAmount }, headers);
    const isNewLevel = ((completed && dbPlay.level <= 100 && dbUser) && (!dbUser.achievements["Runway Roller Levels"] || dbUser.achievements["Runway Roller Levels"].value < dbPlay.level));

    await Promise.all([
      (!isNewLevel) ? null : ((!dbUser.achievements["Runway Roller Levels"]) ? (
        dbUsers.updateOne({ _id: userOId }, { $set: { [`achievements.Runway Roller Levels`]: { value: dbPlay.level, nextClaim: "common" } } })
      ) : (
        dbUsers.updateOne({ _id: userOId }, { $set: { [`achievements.Runway Roller Levels.value`]: dbPlay.level } })
      )),
      dbPlays.deleteOne({ _id: dbPlay._id })
    ]);

    return res.json({ statusCode: 200, success: true, body: { balance } });
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
    
    await dbPlaysHelix.replaceOne({ _id: dbPlay._id }, dbPlay, { upsert: true }); 

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

function calculateRewardMultiplier(level: number, completed: boolean) {
  let multiplier = 1 + (level / 100);

  return multiplier;
}

const oneHourMS = 1000 * 60 * 60;
const coinsPerHour = 8000;
function getCoinLimit(start: number, earned: number, limiter: HelixLimiter | null) {
  if (!limiter || limiter.lastPlays.length < 10) return 0;

  const now = Date.now();
  const elapsed = now - limiter.lastPlays[0].start;
  if (elapsed > oneHourMS) return 0;
  
  const playDuration = now - start;
  const limited = Math.round(coinsPerHour * (playDuration / oneHourMS));
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
    const { userId, playId, coins, completed, endedAt } = { ...req.body, ...req.query };
    const userOId = new ObjectId(userId);
    const [dbUser, dbPlay, dbLimiter] = (await Promise.all([
      (completed) ? dbUsers.findOne({ _id: userOId }) : null,
      dbPlaysHelix.findOne({ _id: userOId }), 
      dbLimiterHelix.findOne({ _id: userOId })
    ])) as [RolltopiaUser | null, DBPlayHelix | null, HelixLimiter | null];

    if (completed && !dbUser) throw new BasicError('User not found', 404);
    else if (!dbPlay) throw new BasicError('Play not found', 404);
    else if (dbPlay.playId.toString() !== playId) throw new BasicError('Play ID mismatch', 400);

    const coinsEarned = await handleLevelEndHelix({ coins, completed, endedAt }, dbPlay);
    const multiplier = calculateRewardMultiplier(dbPlay.level, completed);
    const coinsLimit = getCoinLimit(dbPlay.serverStartedAt, coinsEarned, dbLimiter);
    const coinsBase = coinsLimit || coinsEarned;
    const rewardAmount = Math.round(((completed) ? coinsBase + 75 : coinsBase) * multiplier);
    const isNewLevel = ((completed && dbPlay.level <= 100 && dbUser) && (!dbUser.achievements["Rollie Jump Levels"] || dbUser.achievements["Rollie Jump Levels"].value < dbPlay.level));
    
    const balance = await assetlayer.currencies.increaseCurrencyBalance({ currencyId: rolltopiaCurrencyId, amount: rewardAmount }, headers);
    const updatedLimiter = { lastPlays: dbLimiter?.lastPlays || [] };
    if (updatedLimiter.lastPlays.length >= 10) updatedLimiter.lastPlays.shift();
    updatedLimiter.lastPlays.push({ start: dbPlay.serverStartedAt, earned: coinsEarned });

    await Promise.all([
      (!isNewLevel) ? null : ((!dbUser.achievements["Rollie Jump Levels"]) ? (
        dbUsers.updateOne({ _id: userOId }, { $set: { [`achievements.Rollie Jump Levels`]: { value: dbPlay.level, nextClaim: "common" } } })
      ) : (
        dbUsers.updateOne({ _id: userOId }, { $set: { [`achievements.Rollie Jump Levels.value`]: dbPlay.level } })
      )),
      dbPlaysHelix.deleteOne({ _id: dbPlay._id }),
      dbLimiterHelix.updateOne({ _id: userOId }, { $set: updatedLimiter }, { upsert: true })
    ]);

    return res.json({ statusCode: 200, success: true, body: { balance, coinsBase, coinsLimit, rewardAmount } });
  }
  catch (e) {
    return next(e);
  }
}