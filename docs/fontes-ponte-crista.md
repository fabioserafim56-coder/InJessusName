# Da narrativa bíblica à história das igrejas

Pesquisa e implementação em 29 de outubro de 2026. O componente `ChristianHistoryBridge` oferece doze marcos que conectam a leitura de Atos à investigação das igrejas no Brasil. Ele não pretende substituir uma história geral do cristianismo, uma formação acadêmica ou a memória própria de todas as tradições.

## Organização

Os dados autorais ficam em `src/content/christian-history/index.ts`, separados do atlas brasileiro. Cada marco possui período, resumo, contexto, explicação da conexão pedagógica, fontes e links de continuação. Há distinção explícita entre texto bíblico, pesquisa histórica, documento imperial, memória institucional e enciclopédia colaborativa.

A coleção fica recolhida por padrão para preservar o espaço do painel de conexões. A pessoa pode abrir os doze marcos e, em cada um, expandir contexto e fontes com `details` nativo. O conteúdo está no HTML inicial e não depende de JavaScript, chamadas externas, imagens ou animações. Não são coletadas respostas, consultas ou escolhas religiosas por este componente.

Os períodos se sobrepõem deliberadamente. A sequência orienta a leitura de temas que atravessam regiões e séculos, sem sugerir que uma tradição desapareceu quando outra começou. A chegada colonial ao Brasil e a Reforma europeia, por exemplo, são histórias parcialmente simultâneas.

## Fontes efetivamente consultadas

As páginas abaixo responderam HTTP 200 na pesquisa e tiveram seu conteúdo pertinente conferido. Nos artigos da Britannica, a síntese foi confrontada com o corpo do artigo, não apenas com perguntas e respostas automáticas exibidas pelo site. A evidência técnica de consulta foi preservada no ambiente de execução em `/tmp/bridge-final-research/verification.json`; não se versionam as páginas integrais de terceiros.

| Fonte | Uso na síntese |
| --- | --- |
| [Christianity: The history of Christianity — Britannica](https://www.britannica.com/topic/Christianity/The-history-of-Christianity) | Contexto judaico do movimento cristão e distinção entre narrativa religiosa e investigação histórica. |
| [Coptic Orthodox Church of Alexandria — Britannica](https://www.britannica.com/topic/Coptic-Orthodox-Church-of-Alexandria) | Presença africana, identidade copta e controvérsias cristológicas. |
| [Syriac Orthodox Patriarchate of Antioch and All the East — Britannica](https://www.britannica.com/topic/Syriac-Orthodox-Patriarchate-of-Antioch-and-All-the-East) | Tradição síria, língua litúrgica e distinção entre igrejas ortodoxas orientais e bizantinas. |
| [Edict of Milan — Britannica](https://www.britannica.com/topic/Edict-of-Milan) | Tolerância em 313 e diferença em relação à posterior política imperial. |
| [Theodosius I — Britannica](https://www.britannica.com/biography/Theodosius-I) | Édito de 380 e contexto da imposição de uma orientação nicena. |
| [Theodosian Code XVI.1.2 — Fordham University](https://sourcebooks.fordham.edu/source/theodcodeXVI.asp) | Tradução do texto imperial, identificada como documento histórico e não norma atual do aplicativo. |
| [First Council of Nicaea — Britannica](https://www.britannica.com/event/First-Council-of-Nicaea-325) | Concílio de 325 e controvérsias sobre Pai e Filho. |
| [First Council of Constantinople — Britannica](https://www.britannica.com/event/First-Council-of-Constantinople-381) | Concílio de 381 e discussão sobre o Espírito Santo. |
| [Council of Chalcedon — Britannica](https://www.britannica.com/event/Council-of-Chalcedon) | Concílio de 451 e linguagem cristológica. |
| [East-West Schism — Britannica](https://www.britannica.com/event/East-West-Schism-1054) | Ruptura progressiva, marco de 1054 e aprofundamento do conflito em 1204. |
| [Johannes Gutenberg — Britannica](https://www.britannica.com/biography/Johannes-Gutenberg) | Imprensa europeia e Bíblia da década de 1450, sem apagar a transmissão manuscrita anterior. |
| [Reformation — Britannica](https://www.britannica.com/event/Reformation) | Marco de 1517 e diversidade das reformas, sem genealogia institucional automática. |
| [Igreja Católica no Brasil — Wikipédia](https://pt.wikipedia.org/wiki/Igreja_Cat%C3%B3lica_no_Brasil) | Marco colonial de 1500; fonte enciclopédica colaborativa identificada, com referências para aprofundamento. |
| [França Antártica — Wikipédia](https://pt.wikipedia.org/wiki/Fran%C3%A7a_Ant%C3%A1rtica) | Experiência reformada na Guanabara em 1557, distinguida da implantação duradoura de denominações posteriores. |
| [História da IECLB — Portal Luterano](https://www.luterano.org.br/conheca-a-ieclb/historia-da-ieclb/) | Memória institucional da presença comunitária luterana em 1824 e posterior organização. |
| [Nossa História — Convenção Batista Brasileira](https://www.convencaobatista.com.br/site/pagina.php?MEN_ID=24) | Distinção entre comunidade imigrante de 1871 e missão em português em Salvador em 1882. |
| [Pentecostalism — Britannica](https://www.britannica.com/topic/Pentecostalism) | Rua Azusa, William Seymour e circulação internacional pentecostal, sem tratar o movimento como uma única organização. |
| [World Council of Churches — Britannica](https://www.britannica.com/topic/World-Council-of-Churches) | Fundação em 1948, função de diálogo e ausência de governo sobre as igrejas; a Igreja Católica não é membro do conselho. |
| Atos 2:42–47; 11:19–26; 15 — Bíblia Livre TR 2018 | Fonte bíblica para as primeiras comunidades, apresentada como tal. O texto completo e seus créditos permanecem no leitor existente. |

URLs testadas que retornaram 404, redirecionaram a páginas sem relação ou exibiram bloqueio não foram incluídas como evidência. Entre elas estavam páginas presumidas sobre a Carta de Caminha, uma URL da Igreja Assíria do Oriente e uma URL do édito de Tessalônica. Para 380 foram usados o artigo de Teodósio e o documento do Código Teodosiano; não se inferiu conteúdo de uma página ausente.

## Limites e cuidados

- Os relatos de Atos são identificados como fonte bíblica. A síntese histórica não os converte em documento administrativo de uma denominação brasileira.
- A história antiga inclui Egito e mundo sírio. Nenhuma narrativa sugere que o cristianismo só se tornou africano ou asiático depois de missões europeias modernas.
- A tolerância associada a 313 é distinguida da política imperial de 380; não se atribui a Constantino a criação do cristianismo.
- Calcedônia e o cisma entre Roma e Constantinopla são questões distintas. Não se caracteriza a fé copta ou siríaca como simples negação da humanidade de Cristo.
- A impressão europeia do século XV não é apresentada como a invenção da Bíblia ou da impressão em toda a história mundial.
- A colonização brasileira é situada diante da existência anterior de povos e culturas indígenas. Não se romantiza coerção religiosa ou desigualdade de poder.
- As reformas não são uma origem única para todas as igrejas posteriores. Relação teológica, viagem missionária e fundação institucional são categorias diferentes.
- O marco contemporâneo não inclui percentuais demográficos, listagem de líderes atuais ou alegação de representar todo o cristianismo. A revisão humana especializada e o aprofundamento acadêmico continuam necessários.

As explicações e exemplos são textos originais do aplicativo. Não foram reproduzidos artigos integrais, fotografias, hinos ou documentos protegidos.
