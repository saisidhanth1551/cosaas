/**
 * CoSaaS Local ML Engine
 * Zero-dependency mathematical implementations of classic Machine Learning models
 */

/**
 * Fits a time-series Ordinary Least Squares (OLS) Linear Regression model: y = mx + c
 * @param {Array<{x: number, y: number}>} points 
 * @returns {{ slope: number, intercept: number, predict: (x: number) => number }}
 */
function fitLinearRegression(points) {
  const n = points.length;
  if (n === 0) {
    return { slope: 0, intercept: 0, predict: () => 0 };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumXX += p.x * p.x;
  }

  const denominator = (n * sumXX - sumX * sumX);
  const slope = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  return {
    slope,
    intercept,
    predict: (x) => {
      // Clamped between 0 and 100 for occupancy forecasts
      const val = slope * x + intercept;
      return Math.max(0, Math.min(100, Math.round(val)));
    }
  };
}

/**
 * Pre-compiled historical training dataset representing tenant retention records
 * Features array indices:
 * [0] - occupancyDuration (normalized 0.0 - 1.0)
 * [1] - bookingFrequency (normalized 0.0 - 1.0)
 * [2] - roomUsage (normalized 0.0 - 1.0)
 * [3] - ticketSatisfaction (normalized 0.0 - 1.0)
 * [4] - recentActivity (normalized 0.0 - 1.0)
 * 
 * Label: 1 = Active Renewal, 0 = Churned/Cancelled
 */
const HISTORICAL_CHURN_DATA = [
  // High satisfaction and high usage => Renewed (1)
  { features: [0.95, 0.92, 0.88, 0.90, 0.96], label: 1 },
  { features: [0.85, 0.80, 0.75, 0.85, 0.90], label: 1 },
  { features: [0.90, 0.95, 0.85, 0.95, 0.92], label: 1 },
  { features: [0.75, 0.70, 0.60, 0.80, 0.72], label: 1 },
  { features: [0.80, 0.85, 0.70, 0.80, 0.85], label: 1 },
  { features: [0.88, 0.78, 0.82, 0.92, 0.89], label: 1 },

  // Low satisfaction and low usage => Churned (0)
  { features: [0.30, 0.25, 0.20, 0.40, 0.15], label: 0 },
  { features: [0.42, 0.35, 0.30, 0.20, 0.25], label: 0 },
  { features: [0.20, 0.15, 0.10, 0.30, 0.05], label: 0 },
  { features: [0.35, 0.30, 0.25, 0.30, 0.40], label: 0 },
  { features: [0.45, 0.40, 0.35, 0.50, 0.30], label: 0 },
  { features: [0.15, 0.10, 0.05, 0.20, 0.10], label: 0 },

  // Medium satisfaction and engagement => Mixed boundaries
  { features: [0.60, 0.55, 0.65, 0.75, 0.52], label: 1 },
  { features: [0.55, 0.50, 0.60, 0.65, 0.58], label: 1 },
  { features: [0.62, 0.58, 0.70, 0.60, 0.64], label: 1 },
  { features: [0.48, 0.45, 0.40, 0.55, 0.42], label: 0 },
  { features: [0.50, 0.42, 0.38, 0.45, 0.40], label: 0 }
];

/**
 * Trains a Multi-Feature Logistic Regression model using Gradient Descent
 * Probability calculated using Sigmoid: 1 / (1 + e^-z)
 * @param {Array<{features: number[], label: number}>} data 
 * @param {number} epochs 
 * @param {number} lr - Learning Rate 
 * @returns {{ weights: number[], bias: number, predict: (features: number[]) => number }}
 */
function trainLogisticRegression(data = HISTORICAL_CHURN_DATA, epochs = 300, lr = 0.15) {
  const numFeatures = 5;
  const weights = Array(numFeatures).fill(0.1);
  let bias = 0.0;

  const sigmoid = (z) => 1 / (1 + Math.exp(-z));

  // Gradient descent loop
  for (let epoch = 0; epoch < epochs; epoch++) {
    const dw = Array(numFeatures).fill(0);
    let db = 0;

    for (const item of data) {
      let z = bias;
      for (let i = 0; i < numFeatures; i++) {
        z += weights[i] * item.features[i];
      }

      const prediction = sigmoid(z);
      const error = prediction - item.label;

      for (let i = 0; i < numFeatures; i++) {
        dw[i] += error * item.features[i];
      }
      db += error;
    }

    // Gradient updates
    const m = data.length;
    for (let i = 0; i < numFeatures; i++) {
      weights[i] -= lr * (dw[i] / m);
    }
    bias -= lr * (db / m);
  }

  return {
    weights,
    bias,
    predict: (features) => {
      let z = bias;
      for (let i = 0; i < numFeatures; i++) {
        z += weights[i] * features[i];
      }
      return sigmoid(z);
    }
  };
}

module.exports = {
  fitLinearRegression,
  trainLogisticRegression,
  HISTORICAL_CHURN_DATA
};
