export interface TrainMetrics {
  delay: number;
  speed: number;
  stationCount: number;
  occupancy?: number;
}

export interface AIInsightResult {
  severity: "Low" | "Moderate" | "High" | "Critical";
  riskScore: number;
  summary: string;
  recommendations: string[];
}

export function generateAIInsights(
  metrics: TrainMetrics
): AIInsightResult {
  let riskScore = 0;

  // Delay Analysis
  riskScore += metrics.delay * 1.5;

  // Speed Analysis
  if (metrics.speed < 40) {
    riskScore += 20;
  }

  // Long Route Risk
  if (metrics.stationCount > 15) {
    riskScore += 10;
  }

  // Occupancy Risk
  if (metrics.occupancy && metrics.occupancy > 85) {
    riskScore += 15;
  }

  // Clamp
  riskScore = Math.min(100, Math.round(riskScore));

  let severity: AIInsightResult["severity"] = "Low";

  if (riskScore >= 75) {
    severity = "Critical";
  } else if (riskScore >= 50) {
    severity = "High";
  } else if (riskScore >= 25) {
    severity = "Moderate";
  }

  const recommendations: string[] = [];

  if (metrics.delay > 30) {
    recommendations.push(
      "Passengers should expect significant arrival deviation."
    );
  }

  if (metrics.speed < 40) {
    recommendations.push(
      "Low train speed detected. Possible congestion ahead."
    );
  }

  if (metrics.occupancy && metrics.occupancy > 85) {
    recommendations.push(
      "Heavy occupancy observed. Platform crowd management advised."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Train operations currently appear stable."
    );
  }

  return {
    severity,
    riskScore,
    summary:
      severity === "Critical"
        ? "Major operational disruption likely."
        : severity === "High"
        ? "Potential delay escalation detected."
        : severity === "Moderate"
        ? "Minor operational irregularities observed."
        : "Train is operating within normal parameters.",
    recommendations,
  };
}