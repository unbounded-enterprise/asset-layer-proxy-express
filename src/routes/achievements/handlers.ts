import { Request, NextFunction } from "express";
import { assetlayer, mdb, rolltopiaDB } from "../../server";
import { CustomResponse } from "../../types/basic-types";
import { formatIncomingHeaders } from "../../utils/basic-format";
import { BasicAnyObject, BasicError, BasicObject, BasicResult, User } from "@assetlayer/sdk";
import { ObjectId } from "mongodb";
import { randomRange } from "../../utils/basic-math";
import { RolltopiaAchievement, RolltopiaRarity, RolltopiaRarityProgress, RolltopiaUser, dbUsers, getDBUser } from "../users/handlers";
import { rolltopiaCurrencyId } from "../levels/handlers";
import { parseBasicError } from "../../utils/basic-error";

const rolltopiaAchievements: RolltopiaAchievement[] = [
  {
    appName: "Rolltopia",
    name: "Discover New Rollies",
    type: "tiered",
    tiers: {
      common: {
        description: "Discover 2 total rollie breeds",
        neededValue: 2,
        reward: { currencyId: rolltopiaCurrencyId, amount: 2500 },
      },
      uncommon: {
        description: "Discover 5 total rollie breeds",
        neededValue: 5,
        reward: { currencyId: rolltopiaCurrencyId, amount: 5000 },
      },
      rare: {
        description: "Discover 10 total rollie breeds",
        neededValue: 10,
        reward: { currencyId: rolltopiaCurrencyId, amount: 10000 },
      },
      epic: {
        description: "Discover 20 total rollie breeds",
        neededValue: 20,
        reward: { currencyId: rolltopiaCurrencyId, amount: 25000 },
      },
      legendary: {
        description: "Discover all rollie breeds",
        neededValue: 30,
        reward: { currencyId: rolltopiaCurrencyId, amount: 50000 },
      },
    },
  },
  {
    appName: "Rolltopia",
    name: "Create New Rollies",
    type: "tiered",
    tiers: {
      common: {
        description: "Create a rollie using a creation crystals",
        neededValue: 1,
        reward: { currencyId: rolltopiaCurrencyId, amount: 2500 },
      },

      uncommon: {
        description: "Create 5 rollies using creation crystals",
        neededValue: 5,
        reward: { currencyId: rolltopiaCurrencyId, amount: 5000 },
      },

      rare: {
        description: "Create 10 rollies using creation crystals",
        neededValue: 10,
        reward: { currencyId: rolltopiaCurrencyId, amount: 10000 },
      },

      epic: {
        description: "Create 25 rollies using creation crystals",
        neededValue: 25,
        reward: { currencyId: rolltopiaCurrencyId, amount: 25000 },
      },

      legendary: {
        description: "Create 50 rollies using creation crystals",
        neededValue: 50,
        reward: { currencyId: rolltopiaCurrencyId, amount: 50000 },
      },
    },
  },
];

export const runwayRollerAchievements: RolltopiaAchievement[] = [
  {
    appName: "Runway Roller",
    name: "Runway Roller Levels",
    type: "tiered",
    tiers: {
      common: {
        description: "Beat level 1 of Runway Roller",
        neededValue: 1,
        reward: { currencyId: rolltopiaCurrencyId, amount: 2500 },
      },

      uncommon: {
        description: "Beat level 10 of Runway Roller",
        neededValue: 10,
        reward: { currencyId: rolltopiaCurrencyId, amount: 5000 },
      },

      rare: {
        description: "Beat level 25 of Runway Roller",
        neededValue: 25,
        reward: { currencyId: rolltopiaCurrencyId, amount: 10000 },
      },

      epic: {
        description: "Beat level 50 of Runway Roller",
        neededValue: 50,
        reward: { currencyId: rolltopiaCurrencyId, amount: 25000 },
      },

      legendary: {
        description: "Beat level 100 of Runway Roller",
        neededValue: 100,
        reward: { currencyId: rolltopiaCurrencyId, amount: 50000 },
      },
    },
  },
];

export const rollieJumpAchievements: RolltopiaAchievement[] = [
  {
    appName: "Rollie Jump",
    name: "Rollie Jump Levels",
    type: "tiered",
    tiers: {
      common: {
        description: "Beat level 1 of Rollie Jump",
        neededValue: 1,
        reward: { currencyId: rolltopiaCurrencyId, amount: 2500 },
      },

      uncommon: {
        description: "Beat level 10 of Rollie Jump",
        neededValue: 10,
        reward: { currencyId: rolltopiaCurrencyId, amount: 5000 },
      },

      rare: {
        description: "Beat level 25 of Rollie Jump",
        neededValue: 25,
        reward: { currencyId: rolltopiaCurrencyId, amount: 10000 },
      },

      epic: {
        description: "Beat level 50 of Rollie Jump",
        neededValue: 50,
        reward: { currencyId: rolltopiaCurrencyId, amount: 25000 },
      },

      legendary: {
        description: "Beat level 100 of Rollie Jump",
        neededValue: 100,
        reward: { currencyId: rolltopiaCurrencyId, amount: 50000 },
      },
    },
  },
];

const allAchievements: BasicObject<RolltopiaAchievement> = {
  "Discover New Rollies": rolltopiaAchievements[0],
  "Create New Rollies": rolltopiaAchievements[1],
  "Runway Roller Levels": runwayRollerAchievements[0],
  "Rollie Jump Levels": rollieJumpAchievements[0],
};

const rewardAmounts = {
  common: 2500,
  uncommon: 5000,
  rare: 10000,
  epic: 25000,
  legendary: 50000,
};

const nextReward = {
  common: "uncommon",
  uncommon: "rare",
  rare: "epic",
  epic: "legendary",
  legendary: "all",
} as const;

export async function incrementAchievementProgress(user:RolltopiaUser, achievementName:string, inc=1) {
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

async function updateUserTieredAchievement(userId: string, achievementName: string) {
  const achievementTiers = allAchievements[achievementName].tiers;
  if (!achievementTiers) throw new BasicError('Achievement Tier Not Found', 404);

  const neededTierValues = Object.entries(achievementTiers).reduce((acc, [key, value]) => {
    acc[key] = value.neededValue;

    return acc;
  }, {} as BasicObject<number>);
  let currentNextClaim: RolltopiaRarityProgress;

  const session = mdb.startSession();
  session.startTransaction();

  try {
    const userOID = new ObjectId(userId);
    const dbUser = await getDBUser(userOID);

    if (!dbUser) throw new BasicError('User Not Found', 404);
    else if (!dbUser.achievements[achievementName]) throw new BasicError('Achievement Progress Not Found', 404);

    const { nextClaim, value } = (dbUser as RolltopiaUser).achievements[achievementName];

    if (nextClaim === 'all') {
      await session.abortTransaction();

      throw new BasicError('All Achievement Tiers Already Complete', 400);
    }
    else if (value < neededTierValues[nextClaim]) {
      await session.abortTransaction();

      throw new BasicError('Achievement Tier Not Complete', 400);
    }
    
    const result = await dbUsers.updateOne({ _id: userOID }, { $set: { [`achievements.${achievementName}.nextClaim`]: nextReward[nextClaim] } });

    if (!result.modifiedCount) {
      await session.abortTransaction();

      throw new BasicError('Achievement Update Failed', 400);
    }

    currentNextClaim = nextClaim;
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }

  return currentNextClaim as RolltopiaRarity;
}

type ClaimAchievementProps = { 
  userId: string;
  achievementName: string;
};
type ClaimAchievementRequest = Request<{},{},ClaimAchievementProps,{}>;
export const claimAchievement = async (req: ClaimAchievementRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { userId, achievementName } = req.body;
    const headers = formatIncomingHeaders(req.headers);

    if (!userId) throw new BasicError('Missing userId', 400);
    else if (typeof userId !== 'string') throw new BasicError('Invalid userId', 400);
    else if (!headers?.didtoken) throw new BasicError('Missing didtoken', 400);
    else if (!achievementName) throw new BasicError('Missing achievementName', 400);
    
    const nextClaim = await updateUserTieredAchievement(userId, achievementName);
    const { result: rewardResult, error } = await assetlayer.currencies.safe.increaseCurrencyBalance({ currencyId: rolltopiaCurrencyId, amount: rewardAmounts[nextClaim] }, headers);

    if (error) {
      const undoResult = await dbUsers.updateOne({ _id: new ObjectId(userId) }, { $set: { [`achievements.${achievementName}.nextClaim`]: nextClaim } });
      
      throw error;
    }

    return res.json({ success: true, message: 'Reward claimed and user updated successfully' });
  }
  catch (e) {
    return next(e);
  }
}