import { Metadata } from 'next';
import { supabase } from '../../../../lib/supabaseClient';
import MiniMap from '../../../../components/MiniMap';

interface Params {
  id: string;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return {
    title: `${params.id} – Indigenous Territory`,
  };
}

/**
 * English version of the territory detail page. It fetches the record from
 * Supabase and displays English fields. If Supabase is not configured or
 * data is missing, it falls back to a placeholder for the Yanomami
 * territory.
 */
export default async function TerritoryDetailPage({ params }: { params: Params }) {
  const { id } = params;
  let territory: any = null;
  if (supabase) {
    const { data, error } = await supabase
      .from('territories')
      .select('*')
      .eq('id', id)
      .single();
    territory = data || null;
  }
  if (!territory && id === 'ti-yanomami') {
    territory = {
      id: 'ti-yanomami',
      name_en: 'Yanomami Indigenous Land',
      summary_en:
        'Territory located in the Amazon region, inhabited by the Yanomami people. This territory is officially recognised and protected by the 1988 Constitution.',
      facts_en:
        'It contains one of the largest continuous forests in the world and is crucial for biodiversity preservation.',
      population: null,
      area_ha: null,
      status: 'Demarcated',
      geometry: {
        type: 'Polygon',
        coordinates: [[[-65, -2], [-61, -2], [-61, 4], [-65, 4], [-65, -2]]],
      },
      source: 'Funai',
      url: 'https://www.gov.br/funai/pt-br/assuntos/atuacao/gestao-ambiental-e-territorial/geoprocessamento-e-mapas',
    };
  }
  if (!territory) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-xl font-semibold mb-2">Territory not found</h1>
        <p className="text-sm">Official data unavailable.</p>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">{territory.name_en || territory.name_pt}</h1>
      {territory.summary_en && <p className="text-sm">{territory.summary_en}</p>}
      {territory.facts_en && (
        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-1">Interesting facts</h2>
          <p className="text-sm">{territory.facts_en}</p>
        </div>
      )}
      {territory.population && (
        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-1">Indigenous population (official)</h2>
          <p className="text-sm">{territory.population}</p>
        </div>
      )}
      {territory.area_ha && (
        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-1">Total area (ha)</h2>
          <p className="text-sm">{territory.area_ha}</p>
        </div>
      )}
      {territory.status && (
        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-1">Status</h2>
          <p className="text-sm">{territory.status}</p>
        </div>
      )}
      {territory.geometry && <MiniMap geometry={territory.geometry} />}
      <div className="mt-4">
        <a
          href={territory.url || '#'}
          className="text-primary underline text-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Official source
        </a>
      </div>
    </div>
  );
}