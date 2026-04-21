"use client";
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

interface MiniMapProps {
  geometry: any; // GeoJSON geometry of the feature to display.
}

/**
 * MiniMap renders a small MapLibre map focused on a specific feature. It
 * highlights the provided geometry using a fill or circle depending on
 * whether the geometry is a polygon or point. This component is client‑only.
 */
export default function MiniMap({ geometry }: MiniMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [ -54, -14 ],
      zoom: 3,
      interactive: false,
    });
    mapRef.current = map;

    map.on('load', () => {
      // Add feature source.
      map.addSource('feature', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: geometry,
        },
      });
      // Determine layer type based on geometry.
      if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
        map.addLayer({
          id: 'feature-fill',
          type: 'fill',
          source: 'feature',
          paint: {
            'fill-color': '#154734',
            'fill-opacity': 0.4,
          },
        });
        map.addLayer({
          id: 'feature-outline',
          type: 'line',
          source: 'feature',
          paint: {
            'line-color': '#154734',
            'line-width': 2,
          },
        });
      } else if (geometry.type === 'Point' || geometry.type === 'MultiPoint') {
        map.addLayer({
          id: 'feature-point',
          type: 'circle',
          source: 'feature',
          paint: {
            'circle-radius': 6,
            'circle-color': '#C9A94A',
            'circle-stroke-color': '#154734',
            'circle-stroke-width': 1,
          },
        });
      }
      // Fit map to feature bounds.
      const bounds = new maplibregl.LngLatBounds();
      if (geometry.type === 'Point') {
        bounds.extend(geometry.coordinates as [number, number]);
      } else if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
        const coords = geometry.type === 'Polygon' ? geometry.coordinates : geometry.coordinates[0];
        coords.forEach((ring: any) => {
          ring.forEach((coord: any) => bounds.extend(coord));
        });
      }
      if (bounds.isEmpty()) {
        map.setCenter([-54, -14]);
        map.setZoom(3);
      } else {
        map.fitBounds(bounds, { padding: 20, maxZoom: 9 });
      }
    });
    return () => {
      map.remove();
    };
  }, [geometry]);

  return <div ref={containerRef} className="w-full h-48 rounded border" />;
}