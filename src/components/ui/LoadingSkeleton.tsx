export default function LoadingSkeleton() {
  return (
    <div className="rt-skeleton-wrap">
      <div className="rt-skeleton rt-skeleton-lg" />

      <div className="rt-skeleton-grid">
        <div className="rt-skeleton-card" />
        <div className="rt-skeleton-card" />
        <div className="rt-skeleton-card" />
        <div className="rt-skeleton-card" />
      </div>

      <div className="rt-skeleton-route">
        <div className="rt-skeleton-line" />
        <div className="rt-skeleton-line" />
        <div className="rt-skeleton-line" />
      </div>
    </div>
  );
}