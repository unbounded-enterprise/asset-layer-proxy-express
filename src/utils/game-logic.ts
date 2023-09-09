import { ObjectId } from "mongodb";

const levelConfigs = [
  { // 1-5
    platformType: 0,
    minPlatformAmount: 20,
    maxPlatformAmount: 30,
    minPlayerMovingSpeed: 10,
    maxPlayerMovingSpeed: 15,
    platformDistanceFrequency: 0.1,
    minDistanceAmount: 3,
    maxDistanceAmount: 7,
    obstacleFrequency: 0.3,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.7,
    minCoinAmount: 1,
    maxCoinAmount: 5,
    obstacleSizes: '0000000001000000'
  },
  { // 5-10
    platformType: 1,
    minPlatformAmount: 20,
    maxPlatformAmount: 30,
    minPlayerMovingSpeed: 10,
    maxPlayerMovingSpeed: 15,
    platformDistanceFrequency: 0.1,
    minDistanceAmount: 3,
    maxDistanceAmount: 7,
    obstacleFrequency: 0.3,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.8,
    minCoinAmount: 2,
    maxCoinAmount: 6,
    obstacleSizes: '0000000001000000'
  },
  { // 10-15
    platformType: 2,
    minPlatformAmount: 20,
    maxPlatformAmount: 35,
    minPlayerMovingSpeed: 12,
    maxPlayerMovingSpeed: 17,
    platformDistanceFrequency: 0.2,
    minDistanceAmount: 3,
    maxDistanceAmount: 7,
    obstacleFrequency: 0.3,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.8,
    minCoinAmount: 2,
    maxCoinAmount: 6,
    obstacleSizes: '0000000001000000'
  },
  { // 15-20
    platformType: 3,
    minPlatformAmount: 20,
    maxPlatformAmount: 35,
    minPlayerMovingSpeed: 12,
    maxPlayerMovingSpeed: 17,
    platformDistanceFrequency: 0.2,
    minDistanceAmount: 3,
    maxDistanceAmount: 7,
    obstacleFrequency: 0.3,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.8,
    minCoinAmount: 2,
    maxCoinAmount: 6,
    obstacleSizes: '0000000001000000'
  },
  { // 20-25
    platformType: 4,
    minPlatformAmount: 25,
    maxPlatformAmount: 35,
    minPlayerMovingSpeed: 15,
    maxPlayerMovingSpeed: 20,
    platformDistanceFrequency: 0.2,
    minDistanceAmount: 4,
    maxDistanceAmount: 8,
    obstacleFrequency: 0.4,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.8,
    minCoinAmount: 2,
    maxCoinAmount: 6,
    obstacleSizes: '0000000002000000'
  },
  { // 25-30
    platformType: 5,
    minPlatformAmount: 25,
    maxPlatformAmount: 35,
    minPlayerMovingSpeed: 15,
    maxPlayerMovingSpeed: 20,
    platformDistanceFrequency: 0.2,
    minDistanceAmount: 4,
    maxDistanceAmount: 8,
    obstacleFrequency: 0.3,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.8,
    minCoinAmount: 2,
    maxCoinAmount: 6,
    obstacleSizes: '0100000002000000'
  },
  { // 30-35
    platformType: 6,
    minPlatformAmount: 25,
    maxPlatformAmount: 40,
    minPlayerMovingSpeed: 16,
    maxPlayerMovingSpeed: 22,
    platformDistanceFrequency: 0.3,
    minDistanceAmount: 4,
    maxDistanceAmount: 8,
    obstacleFrequency: 0.3,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.9,
    minCoinAmount: 2,
    maxCoinAmount: 6,
    obstacleSizes: '0100000002000000'
  },
  { // 35-40
    platformType: 7,
    minPlatformAmount: 25,
    maxPlatformAmount: 40,
    minPlayerMovingSpeed: 16,
    maxPlayerMovingSpeed: 22,
    platformDistanceFrequency: 0.3,
    minDistanceAmount: 4,
    maxDistanceAmount: 8,
    obstacleFrequency: 0.3,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.8,
    minCoinAmount: 2,
    maxCoinAmount: 6,
    obstacleSizes: '0000000002000000'
  },
  { // 40-45
    platformType: 8,
    minPlatformAmount: 30,
    maxPlatformAmount: 40,
    minPlayerMovingSpeed: 18,
    maxPlayerMovingSpeed: 25,
    platformDistanceFrequency: 0.3,
    minDistanceAmount: 4,
    maxDistanceAmount: 9,
    obstacleFrequency: 0.4,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.9,
    minCoinAmount: 2,
    maxCoinAmount: 6,
    obstacleSizes: '0100000002000000'
  },
  { // 45-50
    platformType: 9,
    minPlatformAmount: 30,
    maxPlatformAmount: 40,
    minPlayerMovingSpeed: 18,
    maxPlayerMovingSpeed: 25,
    platformDistanceFrequency: 0.3,
    minDistanceAmount: 4,
    maxDistanceAmount: 9,
    obstacleFrequency: 0.4,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.9,
    minCoinAmount: 2,
    maxCoinAmount: 6,
    obstacleSizes: '0100000002000000'
  },
  { // 50-55
    platformType: 0,
    minPlatformAmount: 30,
    maxPlatformAmount: 45,
    minPlayerMovingSpeed: 19,
    maxPlayerMovingSpeed: 27,
    platformDistanceFrequency: 0.35,
    minDistanceAmount: 3,
    maxDistanceAmount: 10,
    obstacleFrequency: 0.4,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.7,
    minCoinAmount: 3,
    maxCoinAmount: 7,
    obstacleSizes: '000000000100000002000000'
  },
  { // 55-60
    platformType: 1,
    minPlatformAmount: 30,
    maxPlatformAmount: 45,
    minPlayerMovingSpeed: 19,
    maxPlayerMovingSpeed: 27,
    platformDistanceFrequency: 0.35,
    minDistanceAmount: 3,
    maxDistanceAmount: 10,
    obstacleFrequency: 0.4,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.7,
    minCoinAmount: 3,
    maxCoinAmount: 7,
    obstacleSizes: '000000000100000002000000'
  },
  { // 60-65
    platformType: 2,
    minPlatformAmount: 35,
    maxPlatformAmount: 50,
    minPlayerMovingSpeed: 22,
    maxPlayerMovingSpeed: 30,
    platformDistanceFrequency: 0.2,
    minDistanceAmount: 4,
    maxDistanceAmount: 11,
    obstacleFrequency: 0.4,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.8,
    minCoinAmount: 2,
    maxCoinAmount: 7,
    obstacleSizes: '000000000100000002000000'
  },
  { // 65-70
    platformType: 3,
    minPlatformAmount: 35,
    maxPlatformAmount: 50,
    minPlayerMovingSpeed: 22,
    maxPlayerMovingSpeed: 30,
    platformDistanceFrequency: 0.2,
    minDistanceAmount: 4,
    maxDistanceAmount: 11,
    obstacleFrequency: 0.4,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.8,
    minCoinAmount: 2,
    maxCoinAmount: 7,
    obstacleSizes: '000000000100000002000000'
  },
  { // 70-75
    platformType: 4,
    minPlatformAmount: 40,
    maxPlatformAmount: 50,
    minPlayerMovingSpeed: 25,
    maxPlayerMovingSpeed: 30,
    platformDistanceFrequency: 0.2,
    minDistanceAmount: 3,
    maxDistanceAmount: 12,
    obstacleFrequency: 0.4,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.9,
    minCoinAmount: 2,
    maxCoinAmount: 5,
    obstacleSizes: '010000000200000003000000'
  },
  { // 75-80
    platformType: 5,
    minPlatformAmount: 40,
    maxPlatformAmount: 50,
    minPlayerMovingSpeed: 25,
    maxPlayerMovingSpeed: 30,
    platformDistanceFrequency: 0.2,
    minDistanceAmount: 3,
    maxDistanceAmount: 12,
    obstacleFrequency: 0.4,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.9,
    minCoinAmount: 2,
    maxCoinAmount: 5,
    obstacleSizes: '010000000200000003000000'
  },
  { // 80-85
    platformType: 6,
    minPlatformAmount: 40,
    maxPlatformAmount: 55,
    minPlayerMovingSpeed: 27,
    maxPlayerMovingSpeed: 33,
    platformDistanceFrequency: 0.4,
    minDistanceAmount: 3,
    maxDistanceAmount: 8,
    obstacleFrequency: 0.5,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.7,
    minCoinAmount: 3,
    maxCoinAmount: 8,
    obstacleSizes: '0300000004000000'
  },
  { // 85-90
    platformType: 7,
    minPlatformAmount: 40,
    maxPlatformAmount: 55,
    minPlayerMovingSpeed: 27,
    maxPlayerMovingSpeed: 33,
    platformDistanceFrequency: 0.4,
    minDistanceAmount: 3,
    maxDistanceAmount: 8,
    obstacleFrequency: 0.5,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.7,
    minCoinAmount: 3,
    maxCoinAmount: 8,
    obstacleSizes: '0300000004000000'
  },
  { // 90-95
    platformType: 8,
    minPlatformAmount: 45,
    maxPlatformAmount: 55,
    minPlayerMovingSpeed: 27,
    maxPlayerMovingSpeed: 35,
    platformDistanceFrequency: 0.4,
    minDistanceAmount: 3,
    maxDistanceAmount: 9,
    obstacleFrequency: 0.5,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.65,
    minCoinAmount: 3,
    maxCoinAmount: 8,
    obstacleSizes: '0300000004000000'
  },
  { // 95-100
    platformType: 9,
    minPlatformAmount: 45,
    maxPlatformAmount: 55,
    minPlayerMovingSpeed: 27,
    maxPlayerMovingSpeed: 35,
    platformDistanceFrequency: 0.4,
    minDistanceAmount: 3,
    maxDistanceAmount: 9,
    obstacleFrequency: 0.5,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.65,
    minCoinAmount: 3,
    maxCoinAmount: 8,
    obstacleSizes: '0300000004000000'
  },
  { // 100-105
    platformType: 0,
    minPlatformAmount: 45,
    maxPlatformAmount: 60,
    minPlayerMovingSpeed: 30,
    maxPlayerMovingSpeed: 38,
    platformDistanceFrequency: 0.35,
    minDistanceAmount: 4,
    maxDistanceAmount: 10,
    obstacleFrequency: 0.5,
    minObstacleAmount: 0,
    maxObstacleAmount: 3,
    coinFrequency: 0.75,
    minCoinAmount: 2,
    maxCoinAmount: 7,
    obstacleSizes: '000000000200000004000000'
  }
];

function inRange(num: number, min = 0, max = 999) {
    return ((num > max) ? false : ((num < min) ? false : true)); }

function randomRange(min :number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export type DBPlay = {
  _id: ObjectId;
  playId: ObjectId;
  playerSpeed: number;
  serverStartedAt: number;
  clientStartedAt: number;
  minRunTime: number;
  maxCoins: number;
  platformGaps: number[];
  platformCoins: number[];
}

export type StartLevelProps = { userId: string; number: number; startedAt: number; };
export type GeneratedLevelProps = {
  playId: ObjectId;
  totalPlatformAmount: number;
  playerMovingSpeed: number;
  platformProps: GeneratedPlatformProps[];
};
export type GeneratedPlatformProps = {
  isGap: boolean;
  gapAmount: number;
  isObstacle: boolean;
  obstacleAmount: number;
  isCoin: boolean;
  coinAmount: number;
}

export async function generateLevelProps(number: number) {
  const config = levelConfigs[Math.floor(number / 5)];
  const totalPlatformAmount = randomRange(config.minPlatformAmount, config.maxPlatformAmount); // roll for platform amount
  const playerMovingSpeed = randomRange(config.minPlayerMovingSpeed, config.maxPlayerMovingSpeed); // roll for move speed
  const platformProps = [] as GeneratedPlatformProps[];
  const gaps = [] as number[];
  const coins = [] as number[];
  let minRunTime = 0;
  let maxCoins = 0;

  for (let i = 0; i < totalPlatformAmount; i++) {
    if (i < 2) {
      gaps.push(0);
      minRunTime += (10 / playerMovingSpeed); // reduced to add 1 platform of leeway
      coins.push(0);
      continue;
    }

    const isGap = !!(Math.random() <= config.platformDistanceFrequency); // roll for isGap / DistanceFrequency
    const gapAmount = (isGap) ? randomRange(config.minDistanceAmount, config.maxDistanceAmount) : 0; // roll for DistanceAmount
    gaps.push(gapAmount);
    minRunTime += (20 + gapAmount) / playerMovingSpeed;
    const isObstacle = !!(Math.random() <= config.obstacleFrequency); // roll for isObstacle / ObstacleFrequency
    const obstacleAmount = (isObstacle) ? randomRange(config.minObstacleAmount, config.maxObstacleAmount) : 0; // roll for ObstacleAmount
    const isCoin = !!(Math.random() <= config.coinFrequency);
    const coinAmount = (isCoin) ? randomRange(config.minCoinAmount, config.maxCoinAmount) : 0;
    coins.push(coinAmount);
    maxCoins += coinAmount;

    platformProps.push({ isGap, gapAmount, isObstacle, obstacleAmount, isCoin, coinAmount });
  }
  minRunTime = Math.floor(minRunTime * 1000);

  const levelProps: GeneratedLevelProps = { playId: new ObjectId(), totalPlatformAmount, playerMovingSpeed, platformProps };
  
  return [levelProps, minRunTime, maxCoins, gaps, coins] as const;
}

export type EndLevelProps = { userId: string; playId: string; coins: number; completed: boolean; endedAt: number; };
export type HandleLevelEndProps = { coins: number; completed: boolean; endedAt: number; };

export async function handleLevelEnd({ coins, completed, endedAt }: HandleLevelEndProps, dbPlay: DBPlay) {
  if (coins > dbPlay.maxCoins) throw new Error('Max coins exceeded');
  else if (endedAt - dbPlay.clientStartedAt < dbPlay.minRunTime) throw new Error('Completed too quickly');
  const now = Date.now();
  if (completed) {
    if (now - dbPlay.serverStartedAt < (dbPlay.minRunTime - 5000)) throw new Error('Completed too early');
  }
  else {
    const timeElapsed = now - dbPlay.serverStartedAt;
    let currentMinTime = 20 / dbPlay.playerSpeed;
    let currentMaxCoins = 0;
    for (let i = 2; i < dbPlay.platformGaps.length; i++) {
      const [platformDistance, platformCoins] = [(20 + dbPlay.platformGaps[i]), dbPlay.platformCoins[i]];
      currentMinTime += (platformDistance / dbPlay.playerSpeed) * 1000;
      currentMaxCoins += platformCoins;
      if (currentMinTime > timeElapsed) {
        if (coins > currentMaxCoins) {
          if (!inRange(now - endedAt, 0, 3500) || !inRange(dbPlay.serverStartedAt - dbPlay.clientStartedAt, 0, 3500)) throw new Error('Timing out of sync');
          else {
            const clientTimeElapsed = endedAt - dbPlay.clientStartedAt;
            if (!inRange(clientTimeElapsed - timeElapsed, 0, 5000)) throw new Error('Session out of sync');
            else if (currentMinTime > clientTimeElapsed) throw new Error('Coins collected too quickly');
          }
        }
        else break;
      }
    }
  }
  
  return coins;
}