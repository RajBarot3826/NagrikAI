import clsx from 'clsx';

export default function SeverityBadge({ severity }) {
  let colorClass = '';
  switch (severity) {
    case 1:
      colorClass = 'bg-success/20 text-success border-success/30';
      break;
    case 2:
      colorClass = 'bg-success/20 text-success border-success/30';
      break;
    case 3:
      colorClass = 'bg-warning/20 text-warning border-warning/30';
      break;
    case 4:
      colorClass = 'bg-danger/20 text-danger border-danger/30';
      break;
    case 5:
      colorClass = 'bg-danger/20 text-danger border-danger/30 animate-pulse';
      break;
    default:
      colorClass = 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }

  return (
    <span className={clsx('px-2 py-1 text-xs font-bold rounded-full border', colorClass)}>
      Level {severity}
    </span>
  );
}
