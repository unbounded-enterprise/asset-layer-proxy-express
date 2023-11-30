import { Request, NextFunction } from "express";
import { assetlayer, rolltopiaDB } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { formatIncomingHeaders } from "../../utils/basic-format";
import { Asset, BasicAnyObject, BasicError, BasicObject, BasicResult, User } from "@assetlayer/sdk";
import { ObjectId } from "mongodb";
import { randomRange } from "../../utils/basic-math";
import { RolltopiaRarity, RolltopiaUser, dbUsers, getDBUser } from "../users/handlers";
import { rolltopiaCurrencyId } from "../levels/handlers";
import { parseBasicError } from "../../utils/basic-error";

export const rolltopiaAppId = "64dc10469f07eb4ceb26ef14";
const initialRollieBreeds = [
  "652ef598ba3c02e6b1b08c66",
  "652f1b36ba3c02e6b1b09ad6"
]; // rollieBreeds.common
const rollieBreeds = {
  common: ["652ef598ba3c02e6b1b08c66", "652f1b36ba3c02e6b1b09ad6"],
  uncommon: ["652f1bf7ba3c02e6b1b09d6a", "652f1c80ba3c02e6b1b09fd1"],
  rare: ["652f1d23ba3c02e6b1b0a2ab", "652f1da0ba3c02e6b1b0a512", "652f1e1aba3c02e6b1b0a77f"],
  epic: ["652f1ea7ba3c02e6b1b0aab7", "652f1f2aba3c02e6b1b0ad24", "652f1fadba3c02e6b1b0af91"],
  legendary: ["652f2037ba3c02e6b1b0b370", "652f20abba3c02e6b1b0b5d7", "652f212dba3c02e6b1b0b83e"],
};
const breedRarities = [
  [[90,9,1,0,0],[45,45,9,1,0],[4.5,90,4.5,1,0],[5,45,45,5,0],[.5,4.5,90,4.5,.5]],
  [[45,45,9,1,0],[4.5,90,4.5,1,0],[.5,4.5,90,5,0],[.5,4.5,45,4.5,.5],[0,5,45,45,5]],
  [[4.5,90,4.5,1,0],[.5,4.5,90,5,0],[.5,4.5,45,4.5,.5],[.5,4.5,45,47.5,2.5],[0,.5,9.5,80,10]],
  [[5,45,45,5,0],[.5,4.5,45,4.5,.5],[.5,4.5,45,47.5,2.5],[0,.5,4.5,90,5],[0,.5,9.5,80,10]],
  [[.5,4.5,90,4.5,.5],[0,5,45,45,5],[0,.5,9.5,80,10],[0,.5,9.5,80,10],[0,0,5,70,25]],
];
const crystalCosts = {
  common: 1,
  uncommon: 2500,
  rare: 5000,
  epic: 10000,
  legendary: 25000,
};
function getRandomItem(arr:string[]) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};
function getMaxRarity(parentOneRarity:RolltopiaRarity, parentTwoRarity:RolltopiaRarity) {
  if (parentOneRarity === "legendary" || parentTwoRarity === "legendary") return "legendary";
  else if (parentOneRarity === "epic" || parentTwoRarity === "epic") return "epic";
  else if (parentOneRarity === "rare" || parentTwoRarity === "rare") return "rare";
  else if (parentOneRarity === "uncommon" || parentTwoRarity === "uncommon") return "uncommon";
  else return "common";
};
function rarityToInt(rarity:RolltopiaRarity) {
  switch (rarity) {
    case 'common': return 0;
    case 'uncommon': return 1;
    case 'rare': return 2;
    case 'epic': return 3;
    case 'legendary': return 4;
    default: throw new Error('Unknown rarity');
  }
}
function intToRarity(int:number) {
  switch (int) {
    case 0: return 'common';
    case 1: return 'uncommon';
    case 2: return 'rare';
    case 3: return 'epic';
    case 4: return 'legendary';
    default: throw new Error('Invalid index');
  }
}
function getBreed(parentOneRarity:RolltopiaRarity, parentTwoRarity:RolltopiaRarity) {
  const randomNum = Math.floor(Math.random() * 1000) / 1000;
  const parentOneRarityNum = rarityToInt(parentOneRarity);
  const parentTwoRarityNum = rarityToInt(parentTwoRarity);

  const breedRarityArray = breedRarities[parentOneRarityNum][parentTwoRarityNum];

  let sum = 0;
  let chosenRarity = 0;
  for (let i = 0; i < breedRarityArray.length; i++) {
    sum += breedRarityArray[i] / 100; 
    if (randomNum <= sum) {
      chosenRarity = i;
      break;
    }
  }

  const chosenBreedRarity = intToRarity(chosenRarity);
  return getRandomItem(rollieBreeds[chosenBreedRarity]);
};
async function incrementAchievementProgress(user:RolltopiaUser, achievementName:string, inc=1) {
  try {
    if (user.achievements[achievementName]) {
      const response = await dbUsers.updateOne({ _id: user._id }, {
        $inc: { [`achievements.${achievementName}.value`]: inc }
      });
      
      if (!response.modifiedCount) throw new Error(`${user._id.toString()} Not Modified (1)`);
    }
    else {
      const response = await dbUsers.updateOne({ _id: user._id, "achievements.Create New Rollies": { $exists: false }}, {
        $set: { [`achievements.${achievementName}`]: { value: 1, nextClaim: "common" } }
      });

      if (!response.modifiedCount) throw new Error(`${user._id.toString()} Not Modified (2)`);
      else if (!response.matchedCount) {
        const retryResponse = await dbUsers.updateOne({ _id: user._id, "achievements.Create New Rollies": { $exists: true }}, {
          $inc: { [`achievements.${achievementName}.value`]: inc }
        });
        if (!response.modifiedCount) throw new Error(`${user._id.toString()} Not Modified (3)`);
      }
    }
  }
  catch(e) {
    const error = parseBasicError(e);
    console.error(`${achievementName} Achievement Update Failed:`, error.message);
  }
};

type ClaimInitialRollieProps = { 
  userId: string;
};
type ClaimInitialRollieRequest = Request<{},{},ClaimInitialRollieProps,{}>;
export const claimInitialRollie = async (req: ClaimInitialRollieRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { userId } = req.body;

    if (!userId) throw new BasicError('Missing userId', 400);
    else if (typeof userId !== 'string') throw new BasicError('Invalid userId', 400);

    const breed = initialRollieBreeds[randomRange(0, 1)];

    const claimResult = await dbUsers.updateOne(
      { _id: new ObjectId(userId), initialRollieClaimed: false },
      { $set: { initialRollieClaimed: true } }
    );

    if (!claimResult.modifiedCount) {
      if (claimResult.matchedCount > 0) throw new BasicError('User Initial Rollie Claim Failed', 400);
      else {
        const user = await getDBUser(new ObjectId(userId));

        if (!user) throw new BasicError('Rolltopia User Not Found', 404);
        else if (user.initialRollieClaimed) throw new BasicError('User Initial Rollie Already Claimed', 400);
        else throw new BasicError('User Initial Rollie Claim Failed', 400);
      }
    }

    const mintProps = {
      collectionId: breed,
      number: 1,
      mintTo: userId,
    };

    const { result: mintResult, error } = await assetlayer.assets.safe.mint(mintProps);
    if (error) {
      console.error('Rolltopia Initial Rollie Mint Error', error.message);

      const undoResult = await dbUsers.updateOne(
        { _id: new ObjectId(userId), initialRollieClaimed: true },
        { $set: { initialRollieClaimed: false } }
      );
      
      throw error;
    };

    return res.json({ success: true, message: 'Successfully minted asset' });
  }
  catch (e) {
    return next(e);
  }
}

type BreedRolliesProps = { 
  userId: string;
  parentOneId: string;
  parentTwoId: string;
};
type BreedRolliesRequest = Request<{},{},BreedRolliesProps,{}>;
export const breedRollies = async (req: BreedRolliesRequest, res: CustomResponse, next: NextFunction) => {
  let balanceDecreased;

  try {
    const { userId, parentOneId, parentTwoId } = req.body;
    const headers = formatIncomingHeaders(req.headers);
    
    if (!userId) throw new BasicError('Missing userId', 400);
    else if (typeof userId !== 'string') throw new BasicError('Invalid userId', 400);
    else if (!headers?.didtoken) throw new BasicError('Missing didtoken', 400);
    else if (!parentOneId) throw new BasicError('Missing parentOneId', 400);
    else if (!parentTwoId) throw new BasicError('Missing parentTwoId', 400);
    else if (parentOneId === parentTwoId) throw new BasicError('Cannot breed a rollie with itself', 400);
    
    const [assetlayerUser, user] = await Promise.all([
      assetlayer.users.getUser(headers),
      getDBUser(new ObjectId(userId))
    ]) as [User | undefined, RolltopiaUser | undefined];
    if (!assetlayerUser) throw new BasicError('User Not Found', 404);
    else if (!user) throw new BasicError('Rolltopia User Not Found', 404);
    else if (assetlayerUser.userId !== userId) throw new BasicError('User Not Authorized', 401);

    const [parentOne, parentTwo] = await assetlayer.assets.getAssets({ assetIds: [parentOneId, parentTwoId] });
    const [parentOneRarity, parentTwoRarity] = [parentOne.properties?.[rolltopiaAppId]?.rarity, parentTwo.properties?.[rolltopiaAppId]?.rarity];
    if (!parentOneRarity) throw new BasicError('Parent One Missing Rarity', 404);
    else if (!parentTwoRarity) throw new BasicError('Parent Two Missing Rarity', 404);
    else if (parentOne.user.userId !== userId) throw new BasicError('Parent One Not Owned By User', 400);
    else if (parentTwo.user.userId !== userId) throw new BasicError('Parent Two Not Owned By User', 400);
    else if (parentOne.properties?.[rolltopiaAppId]?.children?.length || 0 >= 5) throw new BasicError('Parent One Breed Count Exceeded', 400);
    else if (parentTwo.properties?.[rolltopiaAppId]?.children?.length || 0 >= 5) throw new BasicError('Parent Two Breed Count Exceeded', 400);

    const maxRarity = getMaxRarity(parentOneRarity, parentTwoRarity);
    const chosenBreed = getBreed(parentOneRarity, parentTwoRarity);
    const balanceResult = await assetlayer.currencies.balance({ appId: rolltopiaAppId }, headers);
    const balance = balanceResult.find((currency) => currency.currencyId === rolltopiaCurrencyId)?.balance;
    if (!balance) throw new BasicError('Crystals Balance Insufficient', 404);
    else if (balance < crystalCosts[maxRarity]) throw new BasicError('Not enough crystals to breed', 400);
    
    const spendResult = await assetlayer.currencies.decreaseCurrencyBalance({ 
      currencyId: rolltopiaCurrencyId, 
      amount: crystalCosts[maxRarity]
    }, headers);
    balanceDecreased = crystalCosts[maxRarity];

    const mintResult = await assetlayer.assets.mint({
      collectionId: chosenBreed,
      number: 1,
      mintTo: userId,
      includeAssetIds: true,
    });

    try {
      const childId = mintResult[0];
      const updateResults = await Promise.all([
        assetlayer.assets.updateAsset({ assetId: parentOne.assetId, properties: { children: [childId] }}),
        assetlayer.assets.updateAsset({ assetId: parentTwo.assetId, properties: { children: [childId] }}),
        assetlayer.assets.updateAsset({ assetId: childId, properties: { name: null, children: null, parents: [parentOne.assetId, parentTwo.assetId] }}),
      ]);
      
      await incrementAchievementProgress(user, "Create New Rollies", 1)
    }
    catch(e) {
      const error = parseBasicError(e);
      console.error('Breed Rollies Update Failed', error.message);
    }

    return res.json({ success: true, message: 'Successfully minted asset' });
  }
  catch (e) {
    if (balanceDecreased) {
      const headers = formatIncomingHeaders(req.headers);
      const { result: refundResult, error } = await assetlayer.currencies.safe.increaseCurrencyBalance({ 
        currencyId: rolltopiaCurrencyId, 
        amount: balanceDecreased
      }, headers);

      if (error) console.error('User Crystal Refund Failed', error.message);
    }

    return next(e);
  }
}