import { Request, NextFunction } from "express";
import { CustomResponse } from "../../types/basic-types";
import { ObjectId } from "mongodb";
import { assetlayer, rolltopiaDB } from "../../server";
import { rolltopiaCurrencyId } from "../levels/handlers";
import { formatIncomingHeaders } from "../../utils/basic-format";

type ClaimRewardProps = { userId: string };
type ClaimRewardRequest = Request<{},{},ClaimRewardProps,ClaimRewardProps>;
export const claim = async (req: ClaimRewardRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { userId } = { ...req.body, ...req.query };

    const user = await rolltopiaDB.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) throw new Error('User not found');

    const now = Date.now();
    if (now - user.lastDailyClaimedAt < (86400000 - 300000)) throw new Error('Daily already claimed'); // 5 minute leeway in case of client timestamping

    const consecutiveDailies = (now - user.lastDailyClaimedAt > (172800000 + 300000) || user.consecutiveDailies >= 9) ? 1 : user.consecutiveDailies + 1;
    await assetlayer.currencies.increaseCurrencyBalance({ currencyId: rolltopiaCurrencyId, amount: consecutiveDailies * 100 }, headers);

    const update = { lastDailyClaimedAt: now, consecutiveDailies };
    await rolltopiaDB.collection('users').updateOne({ _id: user._id }, { $set: update });

    return res.json(update);
  }
  catch (e) {
    return next(e);
  }
}

export const claimHelix = async (req: ClaimRewardRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const { userId } = { ...req.body, ...req.query };

    const user = await rolltopiaDB.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) throw new Error('User not found');

    const now = Date.now();
    if (now - user.lastHelixDailyClaimedAt < (86400000 - 300000)) throw new Error('Daily already claimed'); // 5 minute leeway in case of client timestamping

    const consecutiveHelixDailies = (now - user.lastHelixDailyClaimedAt > (172800000 + 300000) || user.consecutiveHelixDailies >= 9) ? 1 : user.consecutiveHelixDailies + 1;
    await assetlayer.currencies.increaseCurrencyBalance({ currencyId: rolltopiaCurrencyId, amount: consecutiveHelixDailies * 100 }, headers);

    const update = { lastHelixDailyClaimedAt: now, consecutiveHelixDailies };
    await rolltopiaDB.collection('users').updateOne({ _id: user._id }, { $set: update });

    return res.json(update);
  }
  catch (e) {
    return next(e);
  }
}