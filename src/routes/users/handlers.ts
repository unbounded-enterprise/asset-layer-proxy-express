import { Request, NextFunction } from "express";
import { assetlayer, dbUsers } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { formatIncomingHeaders } from "../../utils/basic-format";
import { BasicAnyObject, BasicError, BasicObject, BasicResult, User } from "@assetlayer/sdk";
import { ObjectId } from "mongodb";

export async function getDBUser(_id: ObjectId) {
  return await dbUsers.findOne({ _id });
}

function newUserProps(user: User, _id=(new ObjectId(user.userId)), now=Date.now()) {
  return {
    _id, handle: user.handle, email: user.email, 
    initialRollieClaimed: false, rollidex: {}, achievements: {},
    lastDailyClaimedAt: 0, consecutiveDailies: 0,
    lastHelixDailyClaimedAt: 0, consecutiveHelixDailies: 0,
    createdAt: now, updatedAt: now,
  } as RolltopiaUser;
}

async function addUserToDB(user: User, _id=(new ObjectId(user.userId)), newUser=(newUserProps(user))) {
  return await dbUsers.updateOne({ _id }, { $setOnInsert: newUser }, { upsert: true });
}

async function addUserToDBSafe(user?: User) {
  if (!user) return false;

  try {
    const result = await addUserToDB(user);

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

    addUserToDBSafe(response?.body?.user);

    return res.json(response);
  }
  catch (e) {
    return next(e);
  }
}

export type RolltopiaRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type RolltopiaRarityProgress = RolltopiaRarity | 'all';
export type RolltopiaAchievementReward = {
  currencyId?: string;
  collectionId?: string;
  amount?: number;
}
export type RolltopiaAchievementTier = {
  // rarity: RolltopiaRarity;
  description: string;
  neededValue: number;
  reward?: RolltopiaAchievementReward;
  icon?: string;

}
// Defining a type for keys
type KeyType = string | number | symbol;

// Mapped type
export type BasicObject2<T, K extends KeyType = string> = {
    [P in K]: T;
}
export type RolltopiaAchievement = {
  // _id: ObjectId;
  appName: string; 
  name: string;
  type: 'tiered' | 'single';
  tiers?: BasicObject<RolltopiaAchievementTier>;
}
export type RolltopiaAchievementProgress = {
  value: number;
  nextClaim: RolltopiaRarityProgress;
}
export type RolltopiaUser = {
  _id: ObjectId;
  handle: string;
  email: string;
  initialRollieClaimed: boolean;
  rollidex: BasicObject<boolean>;
  achievements: BasicObject<RolltopiaAchievementProgress>;
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
    else if (typeof userId !== 'string') throw new BasicError('Invalid userId', 400);

    const user = await getDBUser(new ObjectId(userId));
    if (!user) throw new Error('User not found');

    return res.json(user);
  }
  catch (e) {
    return next(e);
  }
}

type NewRolltopiaUserRequest = Request<{},{},{},{}>;
export const newUser = async (req: NewRolltopiaUserRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);

    if (!headers?.didtoken) throw new BasicError('Missing didtoken', 400);

    const user = await assetlayer.users.getUser(headers);
    const newUser = newUserProps(user);
    const result = await addUserToDB(user);

    if (!result.upsertedCount) throw new BasicError('Failed to upsert user', 500);

    return res.json({ statusCode: 200, success: true, body: { newUser } });
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