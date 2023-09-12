import { Request, NextFunction } from "express";
import { CustomResponse } from "../../types/basic-types";
import { DBPlay, EndLevelProps, StartLevelProps, generateLevelProps, handleLevelEnd } from "../../utils/game-logic";
import { assetlayer, rolltopiaDB } from "../../server";
import { ObjectId } from "mongodb";
import { formatIncomingHeaders } from "../../utils/basic-format";

export const rolltopiaCurrencyId = "64f774cb151a6a3dee16df7c";

type StartLevelRequest = Request<{},{},StartLevelProps,StartLevelProps>;
export const start = async (req: StartLevelRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const now = Date.now();
    const { userId, number, startedAt } = { ...req.body, ...req.query };
    console.log(`started[${number}]: ${userId} @${now}//${startedAt}//${now - startedAt}`);

    const [levelProps, minRunTime, maxCoins, platformGaps, platformCoins] = await generateLevelProps(number);
    const dbPlay = { _id: new ObjectId(userId), playId: levelProps.playId, playerSpeed: levelProps.playerMovingSpeed, serverStartedAt: now, clientStartedAt: startedAt, minRunTime, maxCoins, platformGaps, platformCoins };
    
    await rolltopiaDB.collection('plays').replaceOne({ _id: dbPlay._id }, dbPlay, { upsert: true }); 

    return res.json({ statusCode: 200, success: true, body: levelProps });
  }
  catch (e) {
    return next(e);
  }
}

type EndLevelRequest = Request<{},{},EndLevelProps,EndLevelProps>;
export const end = async (req: EndLevelRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { userId, playId, coins, completed, endedAt } = { ...req.body, ...req.query };
    const dbPlay = (await rolltopiaDB.collection('plays').findOne({ _id: new ObjectId(userId) })) as DBPlay | null;

    if (!dbPlay) throw new Error('Play not found');
    else if (dbPlay.playId.toString() !== playId) throw new Error('Play ID mismatch');

    const rewardAmount = await handleLevelEnd({ coins, completed, endedAt }, dbPlay);
    const balance = await assetlayer.currencies.increaseCurrencyBalance({ currencyId: rolltopiaCurrencyId, amount: rewardAmount }, headers);

    await rolltopiaDB.collection('plays').deleteOne({ _id: dbPlay._id });

    return res.json({ statusCode: 200, success: true, body: { balance } });
  }
  catch (e) {
    return next(e);
  }
}