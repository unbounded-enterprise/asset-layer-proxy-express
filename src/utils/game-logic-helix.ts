import { BasicError } from "@assetlayer/sdk";
import { ObjectId } from "mongodb";
import { inRange, randomRange } from "./basic-math";

export interface LevelConfigHelix {
  minPlayerFallingSpeed: number;
  maxPlayerFallingSpeed: number;
  minRotatingSpeed: number;
  maxRotatingSpeed: number;
  coinFrequency: number;
  minCoinAmount: number;
  maxCoinAmount: number;
  magnetFrequency: number;
  activeMagnetTime: number;
  listHelixPackConfiguration: HelixPackConfig[];
}
export interface HelixPackConfig {
  minHelixAmount: number;
  maxHelixAmount: number;
  minDisablePieceAmount: number;
  maxDisablePieceAmount: number;
  minDeadlyPieceAmount: number;
  maxDeadlyPieceAmount: number;
}

const defaultHelixBoundsY = 1;
const defaultHelixSpacing = 7;
const defaultHelixDistance = defaultHelixBoundsY + defaultHelixSpacing;
const levelConfigs: LevelConfigHelix[] = [
  // level 1-4
  {
    minPlayerFallingSpeed: 20,
    maxPlayerFallingSpeed: 22,
    minRotatingSpeed: 60,
    maxRotatingSpeed: 80,
    coinFrequency: 0.7,
    minCoinAmount: 1,
    maxCoinAmount: 5,
    magnetFrequency: 0.1,
    activeMagnetTime: 10,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 25,
        maxHelixAmount: 30,
        minDisablePieceAmount: 2,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 2
      }
    ]
  },
  // level 5-9
  {
    minPlayerFallingSpeed: 20,
    maxPlayerFallingSpeed: 22,
    minRotatingSpeed: 60,
    maxRotatingSpeed: 80,
    coinFrequency: 0.6,
    minCoinAmount: 2,
    maxCoinAmount: 4,
    magnetFrequency: 0.1,
    activeMagnetTime: 10,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 25,
        maxHelixAmount: 30,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      }
    ]
  },
  // level 10-14
  {
    minPlayerFallingSpeed: 20,
    maxPlayerFallingSpeed: 24,
    minRotatingSpeed: 60,
    maxRotatingSpeed: 90,
    coinFrequency: 0.65,
    minCoinAmount: 1,
    maxCoinAmount: 5,
    magnetFrequency: 0.05,
    activeMagnetTime: 15,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 25,
        maxHelixAmount: 35,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 3
      }
    ]
  },
  // level 15-19
  {
    minPlayerFallingSpeed: 20,
    maxPlayerFallingSpeed: 24,
    minRotatingSpeed: 60,
    maxRotatingSpeed: 90,
    coinFrequency: 0.7,
    minCoinAmount: 1,
    maxCoinAmount: 6,
    magnetFrequency: 0.05,
    activeMagnetTime: 15,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 25,
        maxHelixAmount: 35,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 3
      }
    ]
  },
  // levels 20-24
  {
    minPlayerFallingSpeed: 22,
    maxPlayerFallingSpeed: 25,
    minRotatingSpeed: 70,
    maxRotatingSpeed: 100,
    coinFrequency: 0.5,
    minCoinAmount: 2,
    maxCoinAmount: 6,
    magnetFrequency: 0.07,
    activeMagnetTime: 13,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 15,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 4
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 3,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 3
      }
    ]
  },
  // levels 25-29
  {
    minPlayerFallingSpeed: 22,
    maxPlayerFallingSpeed: 25,
    minRotatingSpeed: 70,
    maxRotatingSpeed: 100,
    coinFrequency: 0.6,
    minCoinAmount: 1,
    maxCoinAmount: 5,
    magnetFrequency: 0.07,
    activeMagnetTime: 13,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 15,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 4
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 3,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 3
      }
    ]
  },
  // levels 30-34
  {
    minPlayerFallingSpeed: 24,
    maxPlayerFallingSpeed: 28,
    minRotatingSpeed: 80,
    maxRotatingSpeed: 110,
    coinFrequency: 0.9,
    minCoinAmount: 1,
    maxCoinAmount: 5,
    magnetFrequency: 0.08,
    activeMagnetTime: 15,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 5
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 5
      }
    ]
  },
  // levels 35-39
  {
    minPlayerFallingSpeed: 24,
    maxPlayerFallingSpeed: 28,
    minRotatingSpeed: 80,
    maxRotatingSpeed: 110,
    coinFrequency: 0.7,
    minCoinAmount: 1,
    maxCoinAmount: 6,
    magnetFrequency: 0.07,
    activeMagnetTime: 15,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 3,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 4
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 3,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 4
      }
    ]
  },
  // levels 40-44
  {
    minPlayerFallingSpeed: 26,
    maxPlayerFallingSpeed: 30,
    minRotatingSpeed: 80,
    maxRotatingSpeed: 120,
    coinFrequency: 0.5,
    minCoinAmount: 2,
    maxCoinAmount: 5,
    magnetFrequency: 0.08,
    activeMagnetTime: 15,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 3,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 4
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 5
      }
    ]
  },
  // levels 45-49
  {
    minPlayerFallingSpeed: 26,
    maxPlayerFallingSpeed: 30,
    minRotatingSpeed: 80,
    maxRotatingSpeed: 120,
    coinFrequency: 0.5,
    minCoinAmount: 2,
    maxCoinAmount: 5,
    magnetFrequency: 0.08,
    activeMagnetTime: 15,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 3,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 4
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 5
      }
    ]
  },
  // levels 50-54
  {
    minPlayerFallingSpeed: 28,
    maxPlayerFallingSpeed: 30,
    minRotatingSpeed: 90,
    maxRotatingSpeed: 120,
    coinFrequency: 0.6,
    minCoinAmount: 2,
    maxCoinAmount: 5,
    magnetFrequency: 0.09,
    activeMagnetTime: 15,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 3,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 4
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 5
      }
    ]
  },
  // levels 55-59
  {
    minPlayerFallingSpeed: 28,
    maxPlayerFallingSpeed: 30,
    minRotatingSpeed: 90,
    maxRotatingSpeed: 120,
    coinFrequency: 0.7,
    minCoinAmount: 1,
    maxCoinAmount: 5,
    magnetFrequency: 0.09,
    activeMagnetTime: 15,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 3,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 4
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 5
      }
    ]
  },
  // levels 60-64
  {
    minPlayerFallingSpeed: 30,
    maxPlayerFallingSpeed: 35,
    minRotatingSpeed: 100,
    maxRotatingSpeed: 130,
    coinFrequency: 0.5,
    minCoinAmount: 1,
    maxCoinAmount: 4,
    magnetFrequency: 0.1,
    activeMagnetTime: 10,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 3,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 5
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 4
      }
    ]
  },
  // levels 65-69
  {
    minPlayerFallingSpeed: 30,
    maxPlayerFallingSpeed: 35,
    minRotatingSpeed: 100,
    maxRotatingSpeed: 130,
    coinFrequency: 0.65,
    minCoinAmount: 1,
    maxCoinAmount: 4,
    magnetFrequency: 0.1,
    activeMagnetTime: 10,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 3,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 5
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 4
      }
    ]
  },
  // levels 70-74
  {
    minPlayerFallingSpeed: 33,
    maxPlayerFallingSpeed: 35,
    minRotatingSpeed: 100,
    maxRotatingSpeed: 140,
    coinFrequency: 0.7,
    minCoinAmount: 1,
    maxCoinAmount: 4,
    magnetFrequency: 0.1,
    activeMagnetTime: 10,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 3,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 4
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 4
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 3
      }
    ]
  },
  // levels 75-79
  {
    minPlayerFallingSpeed: 33,
    maxPlayerFallingSpeed: 35,
    minRotatingSpeed: 100,
    maxRotatingSpeed: 140,
    coinFrequency: 0.6,
    minCoinAmount: 1,
    maxCoinAmount: 4,
    magnetFrequency: 0.1,
    activeMagnetTime: 10,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 3,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 4
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 4
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 3
      }
    ]
  },
  // levels 80-84
  {
    minPlayerFallingSpeed: 33,
    maxPlayerFallingSpeed: 40,
    minRotatingSpeed: 105,
    maxRotatingSpeed: 140,
    coinFrequency: 0.7,
    minCoinAmount: 1,
    maxCoinAmount: 4,
    magnetFrequency: 0.05,
    activeMagnetTime: 15,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 3,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 2,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 4
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 3
      }
    ]
  },
  // levels 85-89
  {
    minPlayerFallingSpeed: 33,
    maxPlayerFallingSpeed: 40,
    minRotatingSpeed: 105,
    maxRotatingSpeed: 140,
    coinFrequency: 0.8,
    minCoinAmount: 1,
    maxCoinAmount: 4,
    magnetFrequency: 0.05,
    activeMagnetTime: 15,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 3,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 2,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 4
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 3
      }
    ]
  },
  // levels 90-94
  {
    minPlayerFallingSpeed: 35,
    maxPlayerFallingSpeed: 42,
    minRotatingSpeed: 110,
    maxRotatingSpeed: 140,
    coinFrequency: 0.6,
    minCoinAmount: 1,
    maxCoinAmount: 4,
    magnetFrequency: 0.08,
    activeMagnetTime: 15,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 3,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 2,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 4
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 2,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 3
      }
    ]
  },
  // levels 95-99
  {
    minPlayerFallingSpeed: 35,
    maxPlayerFallingSpeed: 42,
    minRotatingSpeed: 110,
    maxRotatingSpeed: 140,
    coinFrequency: 0.7,
    minCoinAmount: 1,
    maxCoinAmount: 4,
    magnetFrequency: 0.08,
    activeMagnetTime: 15,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 3,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 2,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 4
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 2,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 3
      }
    ]
  },
  // levels 100-104
  {
    minPlayerFallingSpeed: 35,
    maxPlayerFallingSpeed: 45,
    minRotatingSpeed: 110,
    maxRotatingSpeed: 150,
    coinFrequency: 0.5,
    minCoinAmount: 1,
    maxCoinAmount: 4,
    magnetFrequency: 0.1,
    activeMagnetTime: 10,
    listHelixPackConfiguration: [
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 3,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 2,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 0,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 2,
        maxDisablePieceAmount: 4,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 3
      },
      {
        minHelixAmount: 15,
        maxHelixAmount: 20,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 1,
        maxDeadlyPieceAmount: 4
      },
      {
        minHelixAmount: 20,
        maxHelixAmount: 25,
        minDisablePieceAmount: 1,
        maxDisablePieceAmount: 5,
        minDeadlyPieceAmount: 2,
        maxDeadlyPieceAmount: 4
      }
    ]
  }
];

export type DBPlayHelix = {
  _id: ObjectId;
  playId: ObjectId;
  fallingSpeed: number;
  serverStartedAt: number;
  clientStartedAt: number;
  level: number;
  minRunTime: number;
  maxCoins: number;
  helixCoins: number[];
};

function randomIndexOrder(length: number) {
  const order = [] as number[];
  for (let i = 0; i < length; i++) order.push(i);
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * length);
    const temp = order[i];
    order[i] = order[randomIndex];
    order[randomIndex] = temp;
  }
  return order;
}

export type GeneratedHelixProps = {
  coinAmount: number;
};
export type GeneratedHelixPackProps = {
  helixAmount: number;
  helixProps: GeneratedHelixProps[];
};
export type GeneratedLevelProps = {
  playId: ObjectId;
  rotatingSpeed: number;
  fallingSpeed: number;
  totalHelixAmount: number;
  helixPackOrder: number[];
  helixPacks: GeneratedHelixPackProps[];
};
export async function generateLevelPropsHelix(number: number) {
  const config = levelConfigs[Math.floor(number / 5)];
  const rotatingSpeed = randomRange(config.minRotatingSpeed, config.maxRotatingSpeed); // roll for rotating speed
  const fallingSpeed = randomRange(config.minPlayerFallingSpeed, config.maxPlayerFallingSpeed); // roll for player falling speed
  const helixPacks = [] as GeneratedHelixPackProps[];
  const helixPackOrder = randomIndexOrder(config.listHelixPackConfiguration.length);
  const coins = [] as number[];
  let totalHelixAmount = 0;
  let minRunTime = 0;
  let maxCoins = 0;

  for (let i = 0; i < helixPackOrder.length; i++) {
    const index = helixPackOrder[i];
    const helixAmount = randomRange(config.listHelixPackConfiguration[index].minHelixAmount, config.listHelixPackConfiguration[index].maxHelixAmount);
    const helixPack = { helixAmount, helixProps: [] as GeneratedHelixProps[] };
    
    for (let ii = 0; ii < helixAmount; ii++) {
      const coinAmount = randomRange(config.minCoinAmount, config.maxCoinAmount);
      helixPack.helixProps.push({ coinAmount });
      coins.push(coinAmount);
      maxCoins += coinAmount;
      minRunTime += (defaultHelixDistance) / fallingSpeed;
    }

    helixPacks.push(helixPack);
    totalHelixAmount += helixAmount;
  }
  minRunTime = Math.floor(minRunTime * 1000);

  const levelProps: GeneratedLevelProps = { playId: new ObjectId(), rotatingSpeed, fallingSpeed, totalHelixAmount, helixPackOrder, helixPacks };
  
  return [levelProps, minRunTime, maxCoins, coins] as const;
}

export type HandleLevelEndProps = { 
  coins: number;
  completed: boolean;
  endedAt: number;
};
export async function handleLevelEndHelix({ coins, completed, endedAt }: HandleLevelEndProps, dbPlay: DBPlayHelix) {
  if (coins > dbPlay.maxCoins) throw new Error('Max coins exceeded');

  const now = Date.now();
  console.log(`helix-ended[${dbPlay.level}]: ${dbPlay._id.toString()} @${now}//${endedAt}//${now - endedAt}`);

  if (completed) {
    if (endedAt - dbPlay.clientStartedAt < dbPlay.minRunTime) throw new BasicError('Completed too quickly', 400);
    if (now - dbPlay.serverStartedAt < (dbPlay.minRunTime - 5000)) throw new BasicError('Completed too early', 400);
  }
  else {
    const timeElapsed = now - dbPlay.serverStartedAt;
    let currentMinTime = 0;
    let currentMaxCoins = 0;
    for (let i = 0; i < dbPlay.helixCoins.length; i++) {
      const helixCoins = dbPlay.helixCoins[i];
      currentMinTime += (defaultHelixDistance / dbPlay.fallingSpeed) * 1000;
      currentMaxCoins += helixCoins;
      if (currentMinTime > timeElapsed) {
        if (coins > currentMaxCoins) {
          const clientDifferential = dbPlay.serverStartedAt - dbPlay.clientStartedAt;
          if (!inRange(clientDifferential, 0, 5000)) throw new BasicError('Start time out of sync', 400);
          else {
            const clientTimeElapsed = now - dbPlay.clientStartedAt;
            if (currentMinTime > clientTimeElapsed) throw new BasicError('Coins collected too quickly', 400);
          }
        }
        else break;
      }
    }
  }
  
  return coins;
}