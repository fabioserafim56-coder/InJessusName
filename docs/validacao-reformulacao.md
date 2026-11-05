# Validação da reformulação de novembro de 2026

Comandos executados no ambiente de desenvolvimento, com a edição bíblica e os serviços locais reais do projeto:

- `npm run lint`: passou, sem avisos.
- `npm run typecheck`: passou.
- `npm run build`: passou na versão final, com 175 páginas geradas.
- `node --test tests/unit/*.test.mjs`: 56 testes passaram; nenhum falhou ou foi omitido.
- `node scripts/verify-biblical-content.mjs`: 634 ocorrências/420 referências distintas conferidas; 15 histórias/60 cenas, 3 jogos e 4 novas ilustrações. O script também verifica os bytes/hashes documentados; não certifica teologia, pedagogia ou fidelidade visual.
- `node scripts/human-narration/validate.mjs`: manifesto vazio conferido. Isso não significa que há gravação humana disponível.

A bateria completa de navegador executou 98 casos em computador, celular e ambiente de prévia: 95 passaram na primeira execução. Três falharam porque ainda procuravam a busca bíblica fechada por padrão ou a antiga navegação fixa. Os testes foram adaptados aos controles reais, preservando as conferências de texto, referência, identidade, consentimento, persistência e revogação. Depois da compilação final, a reexecução dirigida de 8 casos passou integralmente, incluindo os 3 casos afetados nos tamanhos aplicáveis e a consulta ao museu. Não houve teste omitido ou substituição do comportamento por um mock para obter esses resultados.

As verificações de navegador incluem os três jogos com erro/tentativa/conclusão, reconstrução das histórias, quatro artes com ampliação original, navegação e retorno do foco, buscas literais e temáticas, Salmo 119 com seus 176 versículos reconstruídos exatamente após repaginação, modo igreja, conclusão das aulas, consentimento de progresso, contas isoladas e recuperação da prévia. As checagens manuais adicionais alcançaram 320 px de largura, fonte 38 px e navegação por teclado.

A consulta editorial do museu usa Fuse e textos/fontes reais; seis testes cobrem relevância, ausência de resultados, acentos e preservação dos parágrafos publicados. Os contratos das APIs comerciais usam fixtures de transporte e não estabelecem qualidade ou acesso a modelos pagos. Nenhuma inferência comercial foi executada para esta publicação.

O rastreamento da função de visão permaneceu em aproximadamente 2,06 MB, com apenas as quatro fotografias do museu entre os arquivos públicos. As novas ilustrações são assets estáticos, sem inclusão de todo o diretório público nessa função.

Os relatórios e capturas de execução ficam em arquivos temporários do ambiente; os testes e scripts reproduzíveis estão versionados. A verificação no endereço público é uma etapa separada após a publicação. A revisão bíblica especializada, a gravação humana autorizada PT-BR e um estudo de eficácia com alunos continuam pendentes, conforme os documentos de conteúdo e produto.
