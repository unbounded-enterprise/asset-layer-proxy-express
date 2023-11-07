import { Request, NextFunction } from "express";
import { assetlayer, rolltopiaDB } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { formatIncomingHeaders } from "../../utils/basic-format";
import { BasicAnyObject, BasicObject, BasicResult, User } from "@assetlayer/sdk";
import { ObjectId, WithId } from "mongodb";
import { defaultRolltopiaAchievements } from "../levels/handlers";

async function getDBUser(id: ObjectId) {
  return await rolltopiaDB.collection('users').findOne({ _id: id });
}

async function addUserToDB(user?: User) {
  if (!user) return false;

  try {
    const id = new ObjectId(user.userId);
    const now = Date.now();
    const update = { 
      _id: id, handle: user.handle, email: user.email, 
      initialRollieClaimed: false, rollidex: {}, achievements: {},
      lastDailyClaimedAt: 0, consecutiveDailies: 0,
      lastHelixDailyClaimedAt: 0, consecutiveHelixDailies: 0,
      createdAt: now, updatedAt: now,
    };
    const result = await rolltopiaDB.collection('users').updateOne({ _id: id }, { $setOnInsert: update }, { upsert: true });

    return !!result.upsertedCount;
  }
  catch (e) {
    return false;
  }
}

type GetUserRequest = Request<{},{},{},{}>;
export const getUser = async (req: GetUserRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);
    const response = await assetlayer.users.raw.getUser(headers);

    addUserToDB(response?.body?.user);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

export type RolltopiaAchievementReward = {
  currencyId?: string;
  collectionId?: string;
  amount?: number;
}
export type RolltopiaAchievementTier = {
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  description: string;
  icon?: string;
  reward?: RolltopiaAchievementReward;

}
export type RolltopiaAchievement = {
  _id: ObjectId;
  name: string;
  type: 'tiered' | 'single';
  tiers?: RolltopiaAchievementTier[];
}
export type RolltopiaUser = {
  _id: ObjectId;
  handle: string;
  email: string;
  initialRollieClaimed: boolean;
  rollidex: BasicObject<boolean>;
  achievements: BasicAnyObject;
  lastDailyClaimedAt: number;
  consecutiveDailies: number;
  lastHelixDailyClaimedAt: number;
  consecutiveHelixDailies: number;
  createdAt: number;
  updatedAt: number;
}
type GetRolltopiaUserProps = { userId: string; };
type GetRolltopiaUserRequest = Request<{},{},GetRolltopiaUserProps,GetRolltopiaUserProps>;
export const getRolltopiaUser = async (req: GetRolltopiaUserRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { userId } = { ...req.body, ...req.query };
    if (!userId) throw new Error('Missing userId');

    const user = await getDBUser(new ObjectId(userId));
    if (!user) throw new Error('User not found');

    return res.json(user);
  }
  catch (e) {
    return next(e);
  }
}

export const getRolltopiaUserInternal = async (userId: ObjectId) : Promise<BasicResult<RolltopiaUser>> => {
  try {
    if (!userId) throw new Error('Missing userId');

    const user = await getDBUser(userId);
    if (!user) throw new Error('User not found');

    return { result: user as RolltopiaUser };
  }
  catch (e: any) {
    return { error: e?.message || 'Error Retrieving User' };
  }
}