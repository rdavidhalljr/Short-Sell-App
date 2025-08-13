
export type Candle = { t: string; o: number; h: number; l: number; c: number; v: number; };

export type ModelParams = {
  bias: number;
  weights: Record<string, number>;
  lr: number;
};

export type Recommendation = {
  symbol: string;
  probability: number;
  projectedGain: number;
  positionSize: number;
  rationale: string[];
};
