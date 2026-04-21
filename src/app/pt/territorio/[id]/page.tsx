import { Metadata } from 'next';
import { supabase } from '../../../../lib/supabaseClient';
import MiniMap from '../../../../components/MiniMap';

interface Params {
  id: string;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return {
    title: `${params.id} – Território Indígena`,
  };
}

/**
 * This page displays detailed information about an Indigenous Territory. It
 * fetches metadata from the Supabase database using the territory id. If
 * Supabase is not configured, it falls back to a placeholder example
 * defined in the seed. All textual content is shown in Portuguese
 * because this file is under the /pt/ route. For English, a separate
 * file under /en/territory/[id] would be used.
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
  // Fallback placeholder if no data is found.
  if (!territory && id === 'ti-yanomami') {
    territory = {
      id: 'ti-yanomami',
      name_pt: 'Terra Indígena Yanomami',
      summary_pt:
        'Território localizado na região amazônica, habitado pelo povo Yanomami. Este território é reconhecido oficialmente e está protegido pela Constituição de 1988.',
      facts_pt:
        'Abriga uma das maiores florestas contínuas do mundo e é fundamental para a preservação da biodiversidade.',
      population: null,
      area_ha: null,
      status: 'Demarcada',
      geometry: {
        type: 'Polygon',
        coordinates: [[[-65, -2], [-61, -2], [-61, 4], [-65, 4], [-65, -2]]],
      },
      source: 'Funai',
      url: 'https://www.gov.br/funai/pt-br/assuntos/atuacao/gestao-ambiental-e-territorial/geoprocessamento-e-mapas',
    };
  }
  // When no data exists, inform the user.
  if (!territory) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-xl font-semibold mb-2">Território não encontrado</h1>
        <p className="text-sm">Dados oficiais indisponíveis.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">{territory.name_pt}</h1>
      {territory.summary_pt && <p className="text-sm">{territory.summary_pt}</p>}
      {territory.facts_pt && (
        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-1">Fatos interessantes</h2>
          <p className="text-sm">{territory.facts_pt}</p>
        </div>
      )}
      {territory.population && (
        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-1">População indígena (oficial)</h2>
          <p className="text-sm">{territory.population}</p>
        </div>
      )}
      {territory.area_ha && (
        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-1">Área total (ha)</h2>
          <p className="text-sm">{territory.area_ha}</p>
        </div>
      )}
      {territory.status && (
        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-1">Status</h2>
          <p className="text-sm">{territory.status}</p>
        </div>
      )}
      {/* Mini map displaying the territory geometry */}
      {territory.geometry && <MiniMap geometry={territory.geometry} />}
      {/* Source and links */}
      <div className="mt-4">
        <a
          href={territory.url || '#'}
          className="text-primary underline text-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fonte oficial
        </a>
      </div>
    </div>
  );
}