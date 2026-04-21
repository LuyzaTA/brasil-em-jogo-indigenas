# Brasil em Jogo — Povos Indígenas

**Slogan:** *O Território. O Tempo. Os Dados.*

Este repositório contém um MVP para a plataforma web **Brasil em Jogo — Povos Indígenas**. O objetivo é oferecer um portal interativo e bilíngue (PT‑BR e EN) que apresente terras e povos indígenas do Brasil através de um mapa de alta qualidade, linha do tempo histórica, dados oficiais e seções culturais.

## Visão Geral

O MVP foi implementado com **Next.js** (App Router) e **Tailwind CSS** no frontend. Os dados são armazenados em um banco **PostgreSQL** hospedado no Supabase, com tabelas especificadas em `db/schema.sql`. A aplicação utiliza **MapLibre GL JS** para renderizar camadas geoespaciais de Terras Indígenas, povos e indicadores. Todo o conteúdo textual segue as regras de compliance: apenas fontes oficiais, linguagem respeitosa e sem estereótipos.

### Funcionalidades principais

1. **Mapa interativo** com quatro modos:
   - **Territórios**: exibe polígonos de Terras Indígenas. Ao clicar, abre detalhes no painel lateral.
   - **Povos**: mostra pontos representando povos indígenas com informações resumidas.
   - **Dados**: (em desenvolvimento) oferece camadas coropléticas por estado/município baseadas em indicadores oficiais.
   - **História**: (em desenvolvimento) integra eventos da linha do tempo diretamente no mapa.

2. **Página de História** (`/historia`): linha do tempo com marcos oficiais como a criação do SPI, da Funai, o Estatuto do Índio e a Constituição de 1988, com links para as fontes【170532731035740†L360-L368】【134047138975418†L15-L34】.

3. **Página “O que podemos aprender com eles”** (`/aprender`): apresenta princípios universais aprendidos com os povos indígenas (relação com o território, conhecimento tradicional, governança comunitária, memória oral e sustentabilidade), com exemplos, sugestões de aplicação e fontes oficiais.

4. **Páginas de detalhe** de territórios e povos (rotas dinâmicas): `/pt/territorio/[id]`, `/en/territory/[id]`, `/pt/povo/[id]`, `/en/people/[id]`. Estas páginas carregam metadados do banco de dados e mostram um mapa reduzido.

## Como rodar o projeto

1. Instale as dependências:

   ```bash
   cd brasil-em-jogo-indigenas
   npm install
   ```

2. Crie um arquivo `.env.local` na raiz do projeto com as chaves do Supabase:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<sua-instancia>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua-anon-key>
   ```

3. Inicialize o banco de dados:

   - Crie as tabelas executando o conteúdo de `db/schema.sql` no PostgreSQL.
   - Importe dados preliminares com `db/seed_data.sql` (opcional) ou utilize o script de importação.

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:3000` no navegador.

## Script de importação

O script `scripts/import_data.ts` permite importar GeoJSON simplificado ou registros de indicadores para o Supabase. Ele utiliza a biblioteca `@supabase/supabase-js` e espera que as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estejam configuradas. Exemplo de uso:

```bash
ts-node scripts/import_data.ts --file=data/territories.json --table=territories
```

O arquivo JSON deve conter um array de objetos com campos compatíveis com as colunas da tabela alvo.

## Atualização de datasets

Para atualizar ou adicionar novos datasets oficiais:

1. Cadastre o dataset na tabela `datasets` com nome, órgão, link, data de atualização e licença.
2. Carregue os dados geoespaciais (GeoJSON) em `territories` ou `peoples` via script de importação ou interface do Supabase.
3. Inclua novos indicadores na tabela `indicators` e associe valores na tabela `indicator_values`.
4. Cite sempre a fonte e o ano nas descrições e títulos das páginas e componentes.

## Política de fontes

Todas as informações exibidas nesta plataforma devem derivar de fontes oficiais e organismos governamentais, como o **IBGE**, **Funai**, Iphan e outras secretarias. É proibido utilizar blogs, wikis ou dados não verificados. Sempre cite a fonte, forneça o link e indique o ano ou versão do dado. Em caso de ausência de informações oficiais, exiba "Dados oficiais indisponíveis" para informar claramente a falta de dados.

## Licença

Este projeto está publicado sob a licença MIT. Contudo, os dados utilizados permanecem sob as licenças originais de suas respectivas fontes.