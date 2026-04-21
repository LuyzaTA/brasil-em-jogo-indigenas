import { Metadata } from 'next';
import { supabase } from '../../../../lib/supabaseClient';
import MiniMap from '../../../../components/MiniMap';

interface Params {
  id: string;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return {
    title: `${params.id} – Indigenous People`,
  };
}

/**
 * English version of the people detail page. Retrieves data from Supabase
 * when available and falls back to the Yanomami example otherwise.
 */
export default async function PeopleDetailPage({ params }: { params: Params }) {
  const { id } = params;
  let people: any = null;
  if (supabase) {
    const { data, error } = await supabase
      .from('peoples')
      .select('*')
      .eq('id', id)
      .single();
    people = data || null;
  }
  if (!people && id === 'povo-yanomami') {
    people = {
      id: 'povo-yanomami',
      name_en: 'Yanomami People',
      summary_en:
        'One of the best known Indigenous peoples in the Amazon, the Yanomami inhabit remote forest areas and maintain traditional ways of life.',
      facts_en:
        'Yanomami culture highlights a deep relationship with the forest and traditional knowledge about medicinal plants.',
      population: null,
      languages: 'Yanomamö',
      distribution_en: 'Amazonas and Roraima',
      geometry: {
        type: 'Point',
        coordinates: [-63.0, 1.0],
      },
      source: 'Funai',
      url: 'https://www.gov.br/funai/pt-br/assuntos/atuacao/gestao-ambiental-e-territorial/geoprocessamento-e-mapas',
    };
  }
  if (!people) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-xl font-semibold mb-2">People not found</h1>
        <p className="text-sm">Official data unavailable.</p>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">{people.name_en || people.name_pt}</h1>
      {people.summary_en && <p className="text-sm">{people.summary_en}</p>}
      {people.facts_en && (
        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-1">Interesting facts</h2>
          <p className="text-sm">{people.facts_en}</p>
        </div>
      )}
      {people.population && (
        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-1">Population (official)</h2>
          <p className="text-sm">{people.population}</p>
        </div>
      )}
      {people.languages && (
        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-1">Languages</h2>
          <p className="text-sm">{people.languages}</p>
        </div>
      )}
      {people.distribution_en && (
        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-1">Distribution</h2>
          <p className="text-sm">{people.distribution_en}</p>
        </div>
      )}
      {people.geometry && <MiniMap geometry={people.geometry} />}
      <div className="mt-4">
        <a
          href={people.url || '#'}
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