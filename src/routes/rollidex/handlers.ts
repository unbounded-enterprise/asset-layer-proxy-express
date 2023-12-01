import { Request, NextFunction } from "express";
import { assetlayer, dbUsers, rolltopiaDB } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { AssetCounts, AssetInfoProps, AssetSendProps, AssetUpdateProps, AssetUserProps, GetAssetHistoryProps, GetAssetOwnershipHistoryProps, GetUserCollectionAssetsProps, GetUserCollectionsAssetsProps, GetUserSlotAssetsProps, GetUserSlotsAssetsProps, MintAssetsProps, SendAssetProps, SendAssetsProps, SendCollectionAssetsProps, UpdateAssetProps, UpdateAssetsProps, UpdateCollectionAssetsProps } from "@assetlayer/sdk/dist/types/asset";
import { IncomingHttpHeaders } from "http";
import { formatIncomingHeaders } from "../../utils/basic-format";
import { AssetLayer, BasicObject } from "@assetlayer/sdk";
import { RolltopiaUser, getDBUser, getRolltopiaUserInternal } from "../users/handlers";
import { ObjectId } from "mongodb";

/*
const rolltopiaApiUrl = 'https://asset-layer-proxy-express-0eab8c53bc1d.herokuapp.com/api';
async function getUserRolliesBalance(didToken: string) {
  const assetLayerInstance = new AssetLayer({ baseUrl: rolltopiaApiUrl, didToken });
  const balance = await assetLayerInstance.assets.getUserSlotAssets({ slotId: rolliesSlotId, countsOnly: true });
}
async function getUserRolliesBalance2() {
  const balance = await assetLayerClient.assets.getUserSlotAssets({ slotId: rolliesSlotId, countsOnly: true }, undefined, { baseUrl: rolltopiaApiUrl });
}

async function updateRollidex(didtoken: string) {
  try {
    const response = await axios.post(`${rolltopiaApiUrl}/rollidex/update`, {}, { headers: { didtoken } });

    return response.data.body.updated;
  }
  catch (e) {
    return false;
  }
}
function checkForNewRollies(user: RolltopiaUser, balance: AssetCounts) {
  if (!user.achievements['Discover New Rollies']) return false;
  else if (user.achievements['Discover New Rollies'].nextClaim === 'all') return false;

  const rollieKeys = [...(new Set(Object.keys(balance)))];
  if (!rollieKeys.length) return false;

  for (const key of rollieKeys) {
    if (user.rollidex[key]) continue;
    else return true;
  }

  return false;
}
*/

export const rolliesSlotId = "651edf58aa4c0d48a4fe2c2c";
const defaultGetUserRollieAssetsProps = { slotId: rolliesSlotId, countsOnly: true };

async function checkUserRollidex(data: AssetCounts, headers?: BasicObject<string>) {
  let rollieKeys = Object.keys(data);
  if (!rollieKeys.length) return [false];

  const user = await assetlayer.users.getUser(headers);
  const userOId = new ObjectId(user.userId);
  const rolltopiaUser = await getDBUser(userOId);
  if (!rolltopiaUser) throw new Error('Rolltopia user not found');
  else if (rolltopiaUser.achievements['Discover New Rollies']?.nextClaim === 'all') return [false];

  const updatedRollidex = rolltopiaUser.rollidex;
  let dbUpdate: BasicObject<any> | undefined = undefined;
  for (const key of rollieKeys) {
    if (rolltopiaUser.rollidex[key]) continue;

    if (!dbUpdate) {
      const rollidexLength = Object.keys(rolltopiaUser.rollidex).length;
      if (!rolltopiaUser.achievements['Discover New Rollies']) dbUpdate = { ['achievements.Discover New Rollies']: { value: rollidexLength, nextClaim: 'common' } };
      else dbUpdate = { [`achievements.Discover New Rollies.value`]: rollidexLength };
    }

    updatedRollidex[key] = true;
    dbUpdate[`rollidex.${key}`] = true;
    if (dbUpdate[`achievements.Discover New Rollies`]) dbUpdate[`achievements.Discover New Rollies`].value += 1;
    else dbUpdate[`achievements.Discover New Rollies.value`] += 1;
  }
  if (!dbUpdate) return [false];

  const updated = await dbUsers.updateOne({ _id: userOId }, { $set: dbUpdate });
  if (updated.modifiedCount) return [true, updatedRollidex];
  else return [false];
}

type UpdateUserRollidexRequest = Request<{},{},{},{}>;
export const updateUserRollidex = async (req: UpdateUserRollidexRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const headers = formatIncomingHeaders(req.headers);

    if (!headers?.didtoken) throw new Error('Missing DID token');

    const response = await assetlayer.assets.raw.getUserSlotAssets(defaultGetUserRollieAssetsProps, headers);
    const [updated, updatedRollidex] = await checkUserRollidex(response.body.assets as AssetCounts, headers);

    return res.json({ statusCode: 200, success: true, body: { updated, updatedRollidex } });
  }
  catch (e) {
    return next(e);
  }
}