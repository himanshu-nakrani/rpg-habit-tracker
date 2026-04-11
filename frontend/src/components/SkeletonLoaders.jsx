export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-circle" />
        <div className="skeleton-lines">
          <div className="skeleton-line skeleton-line-title" />
          <div className="skeleton-line skeleton-line-desc" />
        </div>
      </div>
      <div className="skeleton-footer">
        <div className="skeleton-line skeleton-line-meta" />
        <div className="skeleton-circle skeleton-circle-sm" />
      </div>
    </div>
  );
}

export function SkeletonSidebar() {
  return (
    <div className="skeleton-sidebar">
      <div className="skeleton-box skeleton-streak" />
      <div className="skeleton-box skeleton-progress" />
    </div>
  );
}

export function SkeletonHUD() {
  return (
    <div className="skeleton-hud">
      <div className="skeleton-line" style={{ width: 120, height: 36 }} />
      <div className="skeleton-line" style={{ flex: 1, maxWidth: 400, height: 20 }} />
      <div className="skeleton-line" style={{ width: 80, height: 36 }} />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton">
      <div className="skeleton-hud-bar">
        <SkeletonHUD />
      </div>
      <div className="skeleton-main">
        <div className="skeleton-left">
          <SkeletonSidebar />
        </div>
        <div className="skeleton-right">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>

    </div>
  );
}
