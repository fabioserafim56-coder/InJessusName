# Verificação da ampliação de 29/10/2026

O escopo desta entrega é leitura, pesquisa e conexões entre conteúdo bíblico e história cristã: 24 etapas, 66 guias, 52 temas, 12 histórias e o atlas inicial de 11 igrejas/27 personalidades. O conteúdo é introdutório e autoral; integridade técnica não certifica revisão teológica ou eficácia pedagógica.

## Verificações executadas

- `npm run lint`: aprovado.
- `npm run typecheck`: aprovado; o build também executou TypeScript.
- `node --test tests/unit/*.test.mjs`: 15 testes aprovados. Incluem correspondência ao corpus intacto,132 intervalos dos guias,72 referências do percurso, leituras temáticas, conexões históricas válidas e virada do calendário de Brasília durante um ano de seleção diária.
- `npm run test:e2e`: 60 cenários aprovados em 3,4 minutos, sem falhas ou testes ignorados. Foram exercitados computador/celular, leitura integral de Salmo 119 com 176 versículos, ampliação e virada, busca literal/temática, cenas, reflexões, biblioteca, mapa em memória, fontes e malha de conexões, funcionamento sem JavaScript, contas/consentimento/isolamento e recuperação da prévia. Restaram zero contas sintéticas.
- Depois da suíte, houve somente um ajuste de espaço no CSS da ponte histórica para telas pequenas. O aplicativo foi reconstruído; conferências específicas em produção em 1440 px, 320 px e 390 px sem JavaScript passaram. Os 12 marcos e 19 fontes continuam acessíveis; em 320 px o parágrafo tem 214 px de largura e fonte 16 px, sem corte horizontal ou erro de execução.
- Treze artes originais foram comparadas por SHA-256 com suas proveniências e com os arquivos gerados preservados. Nenhuma imagem artística substituiu uma fotografia do museu nem foi anunciada como evidência histórica.

O build final gerou 169 páginas estáticas/SSG, além das rotas dinâmicas. A suíte completa precedeu o último ajuste exclusivamente visual descrito acima; a conferência posterior foi focalizada nesse ajuste, sem alegar uma segunda execução integral.

## Limites preservados

Os novos marcos do mapa ficam em memória nesta visita e não são sincronizados com a conta. Não se transforma a consulta a uma página em conclusão de curso. Não foram criados registros fictícios de revisão humana, uma formação teológica completa ou um catálogo universal de igrejas e líderes. A edição disponível tem os 66 livros do cânon protestante; os livros adicionais de outras tradições continuam fora desta tradução.

Os testes locais e o envio ao GitHub são distintos da publicação. A atualização pública deve ser conferida em `https://in-jessus-name.vercel.app/` após o envio, verificando os novos conteúdos e recursos no endereço real.
