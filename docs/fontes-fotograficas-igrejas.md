# Fotografias da história cristã

Pesquisa e integração de 29 de outubro de 2026. O acervo distribui **18 arquivos originais**, ligados a oito tradições/igrejas e nove personalidades já presentes no atlas. Um arquivo relacionado a mais de uma ficha é contado apenas uma vez. A seleção reúne fotografias de templos, retratos de época e um documento de passaporte; o tipo do registro aparece em cada legenda.

## Origem e preservação

Os arquivos foram pesquisados por HTTP nas APIs da Wikipédia e do Wikimedia Commons. Para cada seleção, `imageinfo`, `extmetadata` e, nos casos necessários, o wikitext de licença foram lidos. O JSON versionado em `src/content/church-history/photos.json` registra fonte, URL do arquivo original, data consultada, título, autor, licença, condições, dimensões, bytes e SHA-256. A mesma cadeia de proveniência acompanha a distribuição em `public/church-history/proveniencia.json`.

Os arquivos originais foram baixados dos endereços de acervo e permanecem intactos, sem recorte, restauração, colorização, remoção de pessoas ou ampliação por IA. Um link nativo separado continua abrindo cada original integral preservado, com sua resolução e seu checksum de acervo.

Foram geradas **52 cópias de entrega WebP estáticas**, com Sharp 0.35.5/libvips 8.18.7, qualidade 95 e esforço de codificação 6. As larguras previstas são 480, 960, 1440, 2048 e 3840 px, usando somente valores menores que a largura da fonte. O processo redimensiona proporcionalmente e codifica, sem aumentar a resolução. Prévias e visor interativo selecionam essas cópias conforme a tela; uma fonte pequena sem variante reduzida continua usando seu original. O visor seleciona até 2048 px no celular e 3840 px no computador, respeitando os arquivos disponíveis. A seleção responsiva aponta diretamente para esses arquivos, sem depender de o otimizador da hospedagem reduzir um original muito grande. O registro de geração, parâmetros, dimensões, bytes e SHA-256 de cada cópia fica em `public/church-history/proveniencia-rendicoes.json`; o índice consumido pela interface é `src/content/church-history/photo-renditions.json`.

Para reproduzir a geração, use `node scripts/build-history-renditions.mjs`; para conferir arquivos, dimensões e checksums sem gerar novamente, use `node scripts/build-history-renditions.mjs --check`. A existência dos comandos não significa que uma execução futura tenha passado.

Essas cópias são versões redimensionadas e recodificadas, não novos originais históricos. Mantêm identificação, autoria, fonte e licença da fotografia correspondente; a transformação técnica é declarada na proveniência. Os direitos e condições de atribuição ou compartilhamento pela mesma licença continuam aplicáveis às versões distribuídas. Não houve restauração por IA nem criação de detalhes ausentes na fonte. A validação no domínio público é separada da geração e dos testes locais; este registro de preservação não atesta, sozinho, uma publicação concluída.

A reprodução da casa de oração Fluminense tem 7385 × 9812 pixels; o retrato de Ellen White tem 3058 × 4740. Existem também fontes antigas pequenas, como Sarah Kalley (263×448), Martha Watts (263×350) e Simonton (278×368). Esses limites são declarados. Os componentes usam `object-fit:scale-down`, preservando o aspecto e evitando apresentar um original pequeno como uma fotografia nova de alta resolução.

## Registros selecionados

| Ficha | Registro e data | Autoria / direitos da fonte |
| --- | --- | --- |
| Católica | Santuário Nacional de Aparecida, 2007 | Valter Campanato/Agência Brasil; CC BY 3.0 Brasil |
| Congregacional | Casa de oração da Igreja Evangélica Fluminense; captura não especificada | Marc Ferrez, acervo e digitalização IMS; PD-old-100-expired/IMS license |
| Presbiteriana | Interior da catedral do Rio, 2015; exterior do mesmo templo, 2018 | Wilfredor e Felipe Restrepo Acosta; CC BY-SA 4.0 |
| Metodista | Igreja de Santo Ângelo, 2018 | Eugenio Hansen, OFS; CC BY-SA 4.0 |
| Adventista | Primeiro templo de Gaspar Alto, identificado como 1896 | Reprodução histórica identificada como PD Old/CC-PD-Mark |
| CCB | Casa de oração central de Catanduva, 2010 | Manoel Messias de So… (nome como creditado no acervo Panoramio); CC BY-SA 3.0 |
| Universal | Templo de Salomão em São Paulo, 2014 | Vitor Mazuco; CC BY-SA 4.0 |
| Quadrangular | Angelus Temple, 2014; Aimee pregando no mesmo templo, por volta de 1923 | Bruce Boehner, CC BY-SA 3.0; Los Angeles Times Photographic Collection/UCLA, CC BY 4.0 |
| Ellen White | Retrato em Battle Creek, por volta de 1878 | F. J. Miller, Adventist Digital Library; PD-old-70-expired |
| Louis Francescon | Pedido de passaporte norte-americano de 10/06/1915, preservado por inteiro | Documento oficial dos EUA; PD-USGov, referência NARA/FamilySearch |
| Padre Zezinho | Igreja de São Francisco de Assis, São Paulo; data do arquivo 31/12/2012 | Cecioka; CC BY-SA 4.0 |
| Robert Kalley | Retrato identificado entre 1840 e 1850 | Autor não identificado; PD Old |
| Sarah Kalley | Retrato histórico; captura não confirmada | Autor não identificado; PD-old-70-expired. O 1907 associado na ficha é biográfico, não comprova captura |
| Martha Watts | Retrato reproduzido em Kennedy, 1928, p.49; captura não confirmada | Acervo metodista; PD-Brazil-URAA |
| Ashbel Simonton | Retrato reproduzido em história da família; captura não confirmada | Fonte credita William Simonton; PD Old |
| Edir Macedo | Registro de grupo na inauguração da Record News, 2007 | Ricardo Stuckert/Palácio do Planalto; Attribution-PresidenciaBr |

As licenças Creative Commons acompanham cada fotografia em ligação direta para o texto aplicável. No caso de reprodução permitida com atribuição ao Palácio do Planalto, a licença é identificada como tal; não é renomeada como Creative Commons. Nos registros de domínio público, a ficha mantém o fundamento apresentado pelo acervo em vez de atribuir autoria ao usuário que fez upload de uma reprodução antiga.

## Datas, templos e evolução

Uma comunidade pode ter sido fundada antes do edifício que aparece em uma fotografia. As legendas separam esses acontecimentos: a catedral presbiteriana fotografada em 2015/2018 não é anunciada como imagem da primeira comunidade de 1862; Aparecida não representa a missa de 1500; o templo paulistano da Universal em 2014 não é seu espaço inicial no Rio em 1977. A fotografia adventista é explicitamente identificada pela fonte como o primeiro templo de Gaspar Alto.

O registro de Aimee no Angelus Temple por volta de 1923 e a fachada do mesmo edifício em 2014 permitem acompanhar períodos distintos de uma mesma história, com pontos de vista diferentes. Não se apresenta uma falsa comparação antes/depois entre prédios de cidades ou igrejas diferentes. As fotos presbiterianas mostram interior e exterior, e assim são descritas.

## Seleções excluídas

- `Construção CCB BRÁS.jpg` foi rejeitada porque a própria descrição informa restauração por IA.
- `FridaVingren.jpg` foi rejeitada por informação de copyright contestada e cadeia de crédito insuficiente.
- O retrato de Gunnar Vingren datado 1908 e atribuído genericamente a Google não foi distribuído por não oferecer uma cadeia documental adequada para esta seleção. O download de pesquisa foi movido da pasta pública para o diretório temporário de evidência.
- Imagens de outros templos sem relação, pinturas indevidamente tratadas como fotografias e arquivos sem licença verificável não foram usados para completar uma quantidade.

As exceções de resolução e data são informadas no próprio registro. As fotografias não demonstram apoio de pessoas ou instituições ao aplicativo. O acervo continua aberto a documentação primária mais precisa e novas fotografias autorizadas; nenhuma ausência foi substituída por um retrato artificial.
