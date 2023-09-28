import { Request, NextFunction } from "express";
import { assetlayer, rolltopiaDB } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { formatIncomingHeaders } from "../../utils/basic-format";
import { User } from "@assetlayer/sdk";
import { ObjectId } from "mongodb";

async function addUserToDB(user?: User) {
  if (!user) return false;

  try {
    const id = new ObjectId(user.userId);
    const update = { _id: id, handle: user.handle, email: user.email, lastDailyClaimedAt: 0, consecutiveDailies: 0, levelsCompleted: 0 };
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

type GetRolltopiaUserProps = { userId: string; };
type GetRolltopiaUserRequest = Request<{},{},GetRolltopiaUserProps,GetRolltopiaUserProps>;
export const getRolltopiaUser = async (req: GetRolltopiaUserRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { userId } = { ...req.body, ...req.query };
    if (!userId) throw new Error('Missing userId');

    let user = await rolltopiaDB.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) throw new Error('User not found');

    return res.json(user);
  }
  catch (e) {
    return next(e);
  }
}