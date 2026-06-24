import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

export default function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 15,
      max: 1.0,
      gradient: {
        0.2: '#00D4FF', // Cyan
        0.5: '#7C3AED', // Violet
        0.8: '#F59E0B', // Amber
        1.0: '#EF4444'  // Coral Red
      }
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}
