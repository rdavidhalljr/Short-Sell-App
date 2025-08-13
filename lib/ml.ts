
import type { ModelParams } from './types';

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

export function predict(params: ModelParams, feats: Record<string, number>) {
  let z = params.bias;
  for (const [k, v] of Object.entries(feats)) {
    const w = params.weights[k] ?? 0;
    z += w * v;
  }
  return sigmoid(z);
}

export function sgdUpdate(params: ModelParams, feats: Record<string, number>, label: number) {
  const p = predict(params, feats);
  const err = p - label; // dLoss/dz for logloss
  // update bias
  params.bias -= params.lr * err;
  for (const [k, v] of Object.entries(feats)) {
    const w = params.weights[k] ?? 0;
    params.weights[k] = w - params.lr * err * v;
  }
  return params;
}

export function defaultParams(): ModelParams {
  return { bias: 0, weights: {}, lr: 0.05 };
}
