interface Props {
  status?: string;

  insights?: {
    severity: string;
    riskScore: number;
    summary: string;
    recommendations: string[];
  };

  occupancy?: number;

  delay?: number;
}

export default function TrainMetrics({
  status,
  insights,
  occupancy,
  delay,
}: Props) {
  return (
    <>
      <div className="rt-metrics-grid">

        <div className="rt-metric-card">
          <span>Average Delay</span>
          <strong>{delay || 0} mins</strong>
        </div>

        <div className="rt-metric-card">
  <span>AI Severity</span>

  <strong
    className={
      insights?.severity === "Critical"
        ? "rt-severity-critical"
        : insights?.severity === "High"
        ? "rt-severity-high"
        : insights?.severity === "Moderate"
        ? "rt-severity-moderate"
        : "rt-severity-low"
    }
  >
    {insights?.severity || "Low"}
  </strong>
</div>

        <div className="rt-metric-card">
          <span>Occupancy</span>
          <strong>{occupancy || 0}%</strong>
        </div>

      </div>

      {insights && (
        <div className="rt-ai-card">
          <h2>AI Risk Analysis</h2>

          <p>
            <strong>Risk Score:</strong>{" "}
            {insights.riskScore}/100
          </p>

          <p>{insights.summary}</p>

          <ul>
            {insights.recommendations.map(
              (item, index) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>
        </div>
      )}
    </>
  );
}