interface Props {
  summary?: string;
}

export default function AIInsights({
  summary,
}: Props) {
  if (!summary) return null;

  return (
    <div className="rt-ai-card">
      <div className="rt-ai-header">
        <div className="rt-ai-icon">
          AI
        </div>

        <div>
          <h3>AI Insights</h3>
          <p>
            Railway intelligence analysis
          </p>
        </div>
      </div>

      <div className="rt-ai-content">
        {summary}
      </div>

      <div className="rt-ai-tags">
        <span>Realtime</span>
        <span>Smart Analysis</span>
        <span>Railway AI</span>
      </div>
    </div>
  );
}