"use client";
import { useEffect, useRef } from 'react';
import maplibregl, { Map as MapLibreMap } from 'maplibre-gl';
import { supabase } from '../lib/supabaseClient';

type Mode = 'territories' | 'peoples' | 'data' | 'history';

interface MapComponentProps {
  mode: Mode;
  onSelectFeature: (feature: any | null) => void;
}

// Choropleth: green gradient from low (#d9f0d9) to high (#1a3a2a)
function popToColor(value: number, min: number, max: number): string {
  const t = max > min ? (value - min) / (max - min) : 0;
  // interpolate between #d9f0d9 (217,240,217) and #1a3a2a (26,58,42)
  const r = Math.round(217 + (26 - 217) * t);
  const g = Math.round(240 + (58 - 240) * t);
  const b = Math.round(217 + (42 - 217) * t);
  return `rgb(${r},${g},${b})`;
}

export default function MapComponent({ mode, onSelectFeature }: MapComponentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-54, -14],
      zoom: 3.5,
    });
    mapRef.current = map;

    setTimeout(() => map.resize(), 0);
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    map.on('load', async () => {
      // --- Territories source + layers ---
      map.addSource('territories', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      // Territórios mode: solid green fill
      map.addLayer({
        id: 'territories-fill',
        type: 'fill',
        source: 'territories',
        paint: {
          'fill-color': '#2d6a4f',
          'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.55, 0.3],
        },
      });

      // Dados mode: choropleth fill driven by feature-state 'choropleth'
      map.addLayer({
        id: 'territories-choropleth',
        type: 'fill',
        source: 'territories',
        layout: { visibility: 'none' },
        paint: {
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'hasData'], false],
            ['feature-state', 'choropleth'],
            '#e5e7eb',
          ],
          'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.9, 0.7],
        },
      });

      // História mode: color by legal status
      map.addLayer({
        id: 'territories-status',
        type: 'fill',
        source: 'territories',
        layout: { visibility: 'none' },
        paint: {
          'fill-color': [
            'match', ['get', 'status'],
            'Homologada',    '#1a3a2a',
            'Regularizada',  '#2d6a4f',
            'Declarada',     '#c9a94a',
            'Delimitada',    '#8b7355',
            'Em estudo',     '#a0522d',
            '#6b7280',
          ],
          'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.85, 0.6],
        },
      });

      map.addLayer({
        id: 'territories-outline',
        type: 'line',
        source: 'territories',
        paint: { 'line-color': '#1a3a2a', 'line-width': 1 },
      });

      // --- Peoples source + layers ---
      map.addSource('peoples', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
      map.addLayer({
        id: 'peoples-point',
        type: 'circle',
        source: 'peoples',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': ['case', ['boolean', ['feature-state', 'hover'], false], 7, 5],
          'circle-color': '#c9a94a',
          'circle-stroke-color': '#1a3a2a',
          'circle-stroke-width': 1.5,
        },
      });

      // --- Fetch data from Supabase ---
      if (supabase) {
        const [{ data: territories }, { data: peoples }] = await Promise.all([
          supabase.from('territories').select('id, name_pt, name_en, summary_pt, summary_en, facts_pt, population, status, uf_code, geometry'),
          supabase.from('peoples').select('id, name_pt, name_en, summary_pt, summary_en, facts_pt, population, geometry'),
        ]);

        if (territories) {
          const validTerritories = territories.filter((t) => {
            if (!t.geometry) return false;
            const ring =
              t.geometry.type === 'MultiPolygon'
                ? t.geometry.coordinates?.[0]?.[0]
                : t.geometry.coordinates?.[0];
            return Array.isArray(ring) && ring.length > 5;
          });

          (map.getSource('territories') as maplibregl.GeoJSONSource).setData({
            type: 'FeatureCollection',
            features: validTerritories.map((t) => ({
              type: 'Feature' as const,
              id: t.id,
              geometry: t.geometry,
              properties: {
                id: t.id,
                name_pt: t.name_pt,
                name_en: t.name_en,
                summary_pt: t.summary_pt,
                summary_en: t.summary_en,
                facts_pt: t.facts_pt,
                population: t.population,
                status: t.status,
                uf_code: t.uf_code,
              },
            })),
          });

          // --- Choropleth: fetch population by state and apply feature-state ---
          const { data: indicator } = await supabase
            .from('indicators')
            .select('id')
            .eq('key', 'indigenous_population_by_state')
            .single();

          if (indicator) {
            const { data: stateValues } = await supabase
              .from('indicator_values')
              .select('uf_code, value')
              .eq('indicator_id', indicator.id)
              .not('uf_code', 'is', null);

            if (stateValues && stateValues.length > 0) {
              const popByUf: Record<string, number> = {};
              stateValues.forEach((sv) => { popByUf[sv.uf_code] = sv.value; });

              const values = Object.values(popByUf);
              const min = Math.min(...values);
              const max = Math.max(...values);

              validTerritories.forEach((t) => {
                const uf = t.uf_code;
                if (uf && popByUf[uf] !== undefined) {
                  const color = popToColor(popByUf[uf], min, max);
                  map.setFeatureState(
                    { source: 'territories', id: t.id },
                    { choropleth: color, hasData: true }
                  );
                }
              });
            }
          }
        }

        if (peoples) {
          (map.getSource('peoples') as maplibregl.GeoJSONSource).setData({
            type: 'FeatureCollection',
            features: peoples.filter((p) => p.geometry).map((p) => ({
              type: 'Feature' as const,
              id: p.id,
              geometry: p.geometry,
              properties: {
                id: p.id,
                name_pt: p.name_pt,
                name_en: p.name_en,
                summary_pt: p.summary_pt,
                summary_en: p.summary_en,
                facts_pt: p.facts_pt,
                population: p.population,
              },
            })),
          });
        }
      }
    });

    // --- Hover states ---
    let hoveredId: string | number | null = null;
    let hoveredSource = 'territories';

    const setHover = (source: string, id: string | number | null) => {
      if (hoveredId !== null) map.setFeatureState({ source: hoveredSource, id: hoveredId }, { hover: false });
      hoveredSource = source;
      hoveredId = id;
      if (id !== null) map.setFeatureState({ source, id }, { hover: true });
    };

    const TERRITORY_FILL_LAYERS = ['territories-fill', 'territories-choropleth', 'territories-status'];
    TERRITORY_FILL_LAYERS.forEach((layerId) => {
      map.on('mousemove', layerId, (e) => {
        map.getCanvas().style.cursor = 'pointer';
        const id = e.features?.[0]?.id ?? null;
        setHover('territories', id as string | number | null);
      });
      map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
        setHover('territories', null);
      });
    });

    map.on('mousemove', 'peoples-point', () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'peoples-point', () => { map.getCanvas().style.cursor = ''; });

    // --- Click to select feature ---
    map.on('click', (e) => {
      const allLayers = ['territories-fill', 'territories-choropleth', 'territories-status', 'peoples-point'];
      const layers = allLayers.filter((l) => map.getLayer(l));
      const features = map.queryRenderedFeatures(e.point, { layers });
      onSelectFeature(features.length > 0 ? features[0] : null);
    });

    const ro = new ResizeObserver(() => map.resize());
    ro.observe(containerRef.current!);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, [onSelectFeature]);

  // Update layer visibility based on mode
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const visMap: Record<Mode, Record<string, string>> = {
      territories: {
        'territories-fill':       'visible',
        'territories-choropleth': 'none',
        'territories-status':     'none',
        'territories-outline':    'visible',
        'peoples-point':          'none',
      },
      peoples: {
        'territories-fill':       'none',
        'territories-choropleth': 'none',
        'territories-status':     'none',
        'territories-outline':    'none',
        'peoples-point':          'visible',
      },
      data: {
        'territories-fill':       'none',
        'territories-choropleth': 'visible',
        'territories-status':     'none',
        'territories-outline':    'visible',
        'peoples-point':          'none',
      },
      history: {
        'territories-fill':       'none',
        'territories-choropleth': 'none',
        'territories-status':     'visible',
        'territories-outline':    'visible',
        'peoples-point':          'none',
      },
    };

    const vis = visMap[mode];
    Object.entries(vis).forEach(([layer, visibility]) => {
      if (map.getLayer(layer)) map.setLayoutProperty(layer, 'visibility', visibility);
    });
  }, [mode]);

  return <div ref={containerRef} className="w-full h-full" />;
}
