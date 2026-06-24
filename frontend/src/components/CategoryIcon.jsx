import { AlertTriangle, Droplets, Lightbulb, Trash2, Waves, MoreHorizontal } from 'lucide-react';

export default function CategoryIcon({ category, size = 20 }) {
  switch (category) {
    case 'POTHOLE':
      return <AlertTriangle size={size} className="text-danger" />;
    case 'WATER_LEAK':
      return <Droplets size={size} className="text-primary" />;
    case 'STREETLIGHT':
      return <Lightbulb size={size} className="text-warning" />;
    case 'GARBAGE':
      return <Trash2 size={size} className="text-success" />;
    case 'DRAINAGE':
      return <Waves size={size} className="text-secondary" />;
    default:
      return <MoreHorizontal size={size} className="text-textSecondary" />;
  }
}
