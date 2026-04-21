-- Additional timeline events for the História page.
-- Sources: Funai, Planalto, IBGE — all official government sources.
-- Population estimates: pre-census figures sourced from Funai / academic consensus;
-- 2010 and 2022 figures are exact IBGE Census values.

-- Ensure the unique constraint exists so ON CONFLICT works correctly.
ALTER TABLE timeline_events
  DROP CONSTRAINT IF EXISTS timeline_events_date_title_unique;
ALTER TABLE timeline_events
  ADD CONSTRAINT timeline_events_date_title_unique UNIQUE (date, title_pt);

-- Add population column if it does not yet exist.
ALTER TABLE timeline_events ADD COLUMN IF NOT EXISTS population BIGINT;

INSERT INTO timeline_events (date, title_pt, title_en, description_pt, description_en, source, url, population)
VALUES
  ('1500-04-22',
   'Chegada dos Portugueses ao Brasil',
   'Portuguese Arrival in Brazil',
   'Em 22 de abril de 1500, a frota de Pedro Álvares Cabral chegou ao litoral brasileiro. O encontro com os povos indígenas marcou o início de um longo e violento processo de colonização.',
   'On April 22, 1500, Pedro Álvares Cabral''s fleet arrived on the Brazilian coast, marking the beginning of a long and violent colonisation process for indigenous peoples.',
   'Funai',
   'https://www.gov.br/funai/pt-br/atuacao/povos-indigenas/gestao-ambiental-e-territorial',
   5000000
  ),
  ('1758-05-07',
   'Diretório dos Índios (Marquês de Pombal)',
   'Indian Directory (Marquis of Pombal)',
   'O Diretório dos Índios de 1758 proibiu as línguas indígenas nas escolas e forçou a integração dos povos originários à sociedade colonial portuguesa, destruindo comunidades inteiras.',
   'The 1758 Indian Directory banned indigenous languages in schools and forced the integration of indigenous peoples into Portuguese colonial society, destroying entire communities.',
   'Planalto',
   'https://www.planalto.gov.br/ccivil_03/leis/1750-1801/L17580.htm',
   2000000
  ),
  ('1910-06-20',
   'Criação do Serviço de Proteção aos Índios (SPI)',
   'Creation of the Indian Protection Service (SPI)',
   'O Serviço de Proteção aos Índios surgiu em 1910 com a missão de proteger os povos indígenas das violências coloniais.',
   'The Indian Protection Service was created in 1910 to protect indigenous peoples from colonial violence.',
   'Funai',
   'https://www.gov.br/funai/pt-br/assuntos/noticias/2024/funai-completa-57-anos-com-avancos-na-politica-indigenista-e-consolida-protecao-aos-povos-indigenas',
   1000000
  ),
  ('1967-12-05',
   'Criação da Fundação Nacional do Índio (Funai)',
   'Creation of the National Indian Foundation (Funai)',
   'A Funai foi instituída pela Lei nº 5.371/1967, substituindo o SPI e assegurando a posse permanente das terras indígenas.',
   'Funai was established by Law No. 5,371/1967 to replace the SPI and guarantee indigenous peoples permanent possession of their lands.',
   'Planalto',
   'https://www.planalto.gov.br/ccivil_03/leis/1950-1969/l5371.htm',
   100000
  ),
  ('1973-12-19',
   'Publicação do Estatuto do Índio (Lei 6001/73)',
   'Publication of the Indian Statute (Law 6001/73)',
   'O Estatuto do Índio reforçou direitos dos povos indígenas, mas manteve o regime tutelar e definiu a integração progressiva à comunhão nacional.',
   'The Indian Statute reinforced indigenous rights but maintained a tutelary regime and aimed at progressive integration into national society.',
   'Planalto',
   'https://www.planalto.gov.br/ccivil_03/leis/l6001.htm',
   110000
  ),
  ('1988-10-05',
   'Promulgação da Constituição Federal de 1988',
   'Promulgation of the 1988 Federal Constitution',
   'A Constituição de 1988 reconheceu a pluralidade étnica e assegurou aos povos indígenas sua organização social, línguas, crenças e os direitos originários sobre as terras que tradicionalmente ocupam.',
   'The 1988 Constitution recognised ethnic diversity and guaranteed indigenous peoples their social organisation, languages, beliefs and original rights to the lands they traditionally occupy.',
   'Funai',
   'https://www.gov.br/funai/pt-br/assuntos/noticias/2023/35-anos-da-constituicao-federal-avanco-ao-reconhecimento-dos-direitos-dos-povos-indigenas-e-o-desafio-da-efetivacao-plena',
   220000
  ),
  ('1992-06-05',
   'Criação do Departamento de Assuntos Indígenas (Rio-92)',
   'Rio-92 and Indigenous Rights',
   'A Conferência das Nações Unidas sobre Meio Ambiente e Desenvolvimento (Rio-92) reconheceu o papel dos povos indígenas na preservação ambiental e influenciou políticas nacionais.',
   'The 1992 UN Conference on Environment and Development (Rio-92) recognised the role of indigenous peoples in environmental preservation and influenced national policies.',
   'IBGE',
   'https://www.ibge.gov.br/estatisticas/sociais/populacao/17270-indigenas.html',
   300000
  ),
  ('2010-08-05',
   'Censo 2010: 896 mil indígenas registrados',
   '2010 Census: 896,000 Indigenous People Recorded',
   'O Censo Demográfico de 2010 do IBGE registrou 896.917 pessoas que se declararam indígenas no Brasil, identificando 305 etnias e 274 línguas.',
   'The 2010 IBGE Demographic Census recorded 896,917 people who declared themselves indigenous in Brazil, identifying 305 ethnic groups and 274 languages.',
   'IBGE',
   'https://www.ibge.gov.br/indigenas',
   896917
  ),
  ('2022-08-01',
   'Censo 2022: 1,69 milhão de indígenas — 391 etnias',
   '2022 Census: 1.69 Million Indigenous — 391 Ethnic Groups',
   'O Censo 2022 registrou 1.694.836 pessoas indígenas no Brasil — um crescimento de 89% em relação a 2010 — identificando 391 etnias e 295 línguas indígenas.',
   'The 2022 Census recorded 1,694,836 indigenous people in Brazil — a 89% increase since 2010 — identifying 391 ethnic groups and 295 indigenous languages.',
   'IBGE',
   'https://agenciadenoticias.ibge.gov.br/agencia-noticias/2012-agencia-de-noticias/noticias/44848-censo-2022-brasil-tem-391-etnias-e-295-linguas-indigenas',
   1694836
  )
ON CONFLICT (date, title_pt) DO UPDATE SET population = EXCLUDED.population;
