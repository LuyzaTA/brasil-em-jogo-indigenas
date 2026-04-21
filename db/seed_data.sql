-- Sample seed data for the MVP. These records illustrate how official
-- sources and geographic entities can be registered. Replace with real
-- values once datasets are obtained.

-- Insert datasets. These entries reference official sources (IBGE and Funai).
INSERT INTO datasets (name, organisation, url, date_updated, license, description_pt, description_en)
VALUES
  (
    'Censo 2022 – População Indígena',
    'IBGE',
    'https://www.ibge.gov.br/estatisticas/sociais/populacao/17270-indigenas.html',
    '2023-12-22',
    'Pública (uso não comercial)',
    'Resultados preliminares do Censo Demográfico 2022 que contabilizam a população indígena no Brasil【623741258978374†L24-L29】.',
    'Preliminary results from the 2022 Demographic Census counting the Indigenous population in Brazil【623741258978374†L24-L29】.'
  ),
  (
    'Geoprocessamento e Terras Indígenas',
    'Funai',
    'https://www.gov.br/funai/pt-br/assuntos/atuacao/gestao-ambiental-e-territorial/geoprocessamento-e-mapas',
    '2024-01-01',
    'Pública (uso não comercial)',
    'Camadas geoespaciais de Terras Indígenas disponibilizadas pela Funai em formatos abertos【132905997468862†L320-L331】.',
    'Geospatial layers of Indigenous Lands provided by Funai in open formats【132905997468862†L320-L331】.'
  );

-- Insert a sample territory record (placeholder geometry). Replace the geometry
-- with the official polygon for the Yanomami territory once available.
INSERT INTO territories (
  id, dataset_id, name_pt, name_en, summary_pt, summary_en, facts_pt, facts_en,
  population, area_ha, status, uf_code, municipality_code, geometry
)
VALUES (
  'ti-yanomami',
  -- Assumes the Funai dataset is id 2; adjust if the dataset order changes.
  2,
  'Terra Indígena Yanomami',
  'Yanomami Indigenous Land',
  'Território localizado na região amazônica, habitado pelo povo Yanomami. Este território é reconhecido oficialmente e está protegido pela Constituição de 1988【779737577385470†L340-L365】.',
  'Territory located in the Amazon region, inhabited by the Yanomami people. This territory is officially recognised and protected by the 1988 Constitution【779737577385470†L340-L365】.',
  'Abriga uma das maiores florestas contínuas do mundo e é fundamental para a preservação da biodiversidade.',
  'It contains one of the largest continuous forests in the world and is crucial for biodiversity preservation.',
  NULL,
  NULL,
  'Demarcada',
  NULL,
  NULL,
  '{"type":"Polygon","coordinates":[[[-65,-2],[-61,-2],[-61,4],[-65,4],[-65,-2]]]}'
);

-- Insert a sample people record associated with the same territory.
INSERT INTO peoples (
  id, dataset_id, name_pt, name_en, summary_pt, summary_en,
  facts_pt, facts_en, population, languages, distribution_pt,
  distribution_en, geometry
)
VALUES (
  'povo-yanomami',
  2,
  'Povo Yanomami',
  'Yanomami People',
  'Um dos povos indígenas mais conhecidos da Amazônia, o povo Yanomami habita regiões remotas da floresta e mantém modos de vida tradicionais.',
  'One of the best known Indigenous peoples in the Amazon, the Yanomami inhabit remote forest areas and maintain traditional ways of life.',
  'A cultura Yanomami destaca a relação profunda com a floresta e o conhecimento tradicional sobre plantas medicinais.',
  'Yanomami culture highlights a deep relationship with the forest and traditional knowledge about medicinal plants.',
  NULL,
  'Yanomamö',
  'Amazonas e Roraima',
  'Amazonas and Roraima',
  '{"type":"Point","coordinates":[-63.0,1.0]}'
);

-- Insert indicator definitions. These are examples and can be expanded.
INSERT INTO indicators (key, name_pt, name_en, description_pt, description_en, unit, dataset_id)
VALUES
  (
    'indigenous_population',
    'População Indígena',
    'Indigenous Population',
    'Número de indígenas residentes em cada unidade federativa, conforme o Censo 2022.',
    'Number of Indigenous people residing in each federative unit, according to the 2022 Census.',
    'pessoas',
    1
  );

-- Insert sample indicator values for two states (UF codes). Values are placeholders.
INSERT INTO indicator_values (indicator_id, uf_code, value)
VALUES
  (1, 'AM', 200000),
  (1, 'RR', 100000);

-- Seed the timeline events used in the História page.
INSERT INTO timeline_events (date, title_pt, title_en, description_pt, description_en, source, url)
VALUES
  ('1910-06-20',
    'Criação do Serviço de Proteção aos Índios (SPI)',
    'Creation of the Indian Protection Service (SPI)',
    'O Serviço de Proteção aos Índios surgiu em 1910 com a missão de proteger os povos indígenas das violências coloniais【170532731035740†L360-L368】.',
    'The Indian Protection Service was created in 1910 to protect Indigenous peoples from colonial violence【170532731035740†L360-L368】.',
    'Funai',
    'https://www.gov.br/funai/pt-br/assuntos/noticias/2024/funai-completa-57-anos-com-avancos-na-politica-indigenista-e-consolida-protecao-aos-povos-indigenas'
  ),
  ('1967-12-05',
    'Criação da Fundação Nacional do Índio (Funai)',
    'Creation of the National Indian Foundation (Funai)',
    'A Funai foi instituída pela Lei nº 5.371, de 5 de dezembro de 1967, substituindo o SPI e assegurando a posse permanente das terras indígenas【134047138975418†L15-L34】.',
    'Funai was established by Law No. 5,371 on 5 December 1967 to replace the SPI and guarantee Indigenous peoples permanent possession of their lands【134047138975418†L15-L34】.',
    'Planalto',
    'https://www.planalto.gov.br/ccivil_03/leis/1950-1969/l5371.htm'
  ),
  ('1973-12-19',
    'Publicação do Estatuto do Índio (Lei 6001/73)',
    'Publication of the Indian Statute (Law 6001/73)',
    'O Estatuto do Índio reforçou direitos dos povos indígenas, mas manteve o regime tutelar e definiu a integração progressiva à comunhão nacional【170532731035740†L425-L432】.',
    'The Indian Statute reinforced Indigenous rights but maintained a tutelary regime and aimed at progressive integration into national society【170532731035740†L425-L432】.',
    'Planalto',
    'https://www.planalto.gov.br/ccivil_03/leis/l6001.htm'
  ),
  ('1988-10-05',
    'Promulgação da Constituição Federal de 1988',
    'Promulgation of the 1988 Constitution',
    'A Constituição de 1988 reconheceu a pluralidade étnica e assegurou aos povos indígenas sua organização social, línguas, crenças e os direitos originários sobre as terras que tradicionalmente ocupam【779737577385470†L340-L365】.',
    'The 1988 Constitution recognised ethnic diversity and guaranteed Indigenous peoples their social organisation, languages, beliefs and original rights to the lands they traditionally occupy【779737577385470†L340-L365】.',
    'Funai',
    'https://www.gov.br/funai/pt-br/assuntos/noticias/2023/35-anos-da-constituicao-federal-avanco-ao-reconhecimento-dos-direitos-dos-povos-indigenas-e-o-desafio-da-efetivacao-plena'
  );