export default function InsightCard({ insight }) {
  const getSeverityColors = (severity) => {
    switch(severity) {
      case 'critical': return 'bg-danger/10 border-danger/30 text-danger';
      case 'warning': return 'bg-warning/10 border-warning/30 text-warning';
      default: return 'bg-primary/10 border-primary/30 text-primary';
    }
  };

  return (
    <div className={`glass-card p-4 border-l-4 border-l-solid ${getSeverityColors(insight.severity)}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{insight.icon}</span>
        <div>
          <p className="text-sm text-textPrimary mb-2 leading-relaxed">{insight.insight}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Action:</span>
            <span className="text-xs text-textSecondary">{insight.action}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
