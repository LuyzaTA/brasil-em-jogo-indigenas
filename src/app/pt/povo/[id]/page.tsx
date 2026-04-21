import { Metadata } from 'next';
import { supabase } from '../../../../lib/supabaseClient';
import MiniMap from '../../../../components/MiniMap';

interface Params {
  id: string;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return {
    title: `${params.id} – Povo Indígena`,
  };
}

/**
 * Detail page for an Indigenous people (povo) in Portuguese. Fetches data
 * from Supabase and displays it. If not available, falls back to the
 * Yanomami example.
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
      name_pt: 'Povo Yanomami',
      summary_pt:
        'Um dos povos indígenas mais conhecidos da Amazônia, o povo Yanomami habita regiões remotas da floresta e mantém modos de vida tradicionais.',
      facts_pt:
        'A cultura Yanomami destaca a relação profunda com a floresta e o conhecimento tradicional sobre plantas medicinais.',
      population: null,
      languages: 'Yanomamö',
      distribution_pt: 'Amazonas e Roraima',
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
        <h1 className="text-xl font-semibold mb-2">Povo não encontrado</h1>
        <p className="text-sm">Dados oficiais indisponíveis.</p>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">{people.name_pt}</h1>
      {people.summary_pt && <p className="text-sm">{people.summary_pt}</p>}
      {people.facts_pt && (
        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-1">Fatos interessantes</h2>
          <p className="text-sm">{people.facts_pt}</p>
        </div>
      )}
      {people.population && (
        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-1">População (oficial)</h2>
          <p className="text-sm">{people.population}</p>
        </div>
      )}
      {people.languages && (
        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-1">Línguas</h2>
          <p className="text-sm">{people.languages}</p>
        </div>
      )}
      {people.distribution_pt && (
        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-1">Distribuição</h2>
          <p className="text-sm">{people.distribution_pt}</p>
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
          Fonte oficial
        </a>
      </div>
    </div>
  );
}