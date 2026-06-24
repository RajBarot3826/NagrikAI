export default function StatCard({ title, value, prefix = "", suffix = "", icon, trend }) {
  return (
    <div className="glass-card p-6 flex items-center justify-between">
      <div>
        <p className="text-textSecondary text-sm font-medium mb-1">{title}</p>
        <h3 className="font-display text-3xl font-bold text-textPrimary">
          {prefix}
          {value}
          {suffix}
        </h3>
        {trend && (
          <p className="text-xs mt-2 text-success font-medium flex items-center gap-1">
            ↑ {trend}
          </p>
        )}
      </div>
      <div className="p-4 bg-primary/10 rounded-full text-primary">
        {icon}
      </div>
    </div>
  );
}
