# Conferência de conteúdo desta iteração

Conferência técnica/editorial assistida realizada em **5 de novembro de 2026 (UTC)**, sobre os arquivos reais do repositório. **Não equivale a revisão teológica humana, aprovação pastoral/institucional ou comprovação de eficácia pedagógica.** As aulas continuam sendo um piloto educacional que aguarda revisão especializada e observação com estudantes.

## Acervo e referências estruturadas

O comando reproduzível é:

```sh
node scripts/verify-biblical-content.mjs --json
```

Resultado desta conferência: **634 ocorrências de referências estruturadas**, correspondentes a **420 referências distintas**, sem referência inexistente detectada no escopo abaixo. A repetição de uma passagem em várias explicações conta como várias ocorrências; esses números não são uma medida de profundidade ou de conhecimento adquirido.

| Grupo conferido | Ocorrências |
| --- | ---: |
| Primeira aula, incluindo referências das alternativas | 79 |
| Demais aulas do curso | 83 |
| Temas da busca bíblica | 157 |
| Histórias: 60 cenas e 15 indicações de próxima leitura | 75 |
| Etapas do percurso | 72 |
| Conexões bíblicas do museu | 4 |
| Passagens das narrações | 6 |
| Passagens-base dos jogos | 3 |
| Guias dos livros | 132 |
| Gestos do jogo do samaritano | 4 |
| Versículos das conexões entre passagens | 12 |
| Pistas do jogo dos pães | 3 |
| Referências da proveniência das quatro novas ilustrações | 4 |

O script usa os módulos TypeScript e JSON editoriais atuais e o corpus local, sem substituir a Bíblia por dados simulados. Confere livro, capítulo, início/fim quando esses campos existem, versículos não vazios, leituras dos jogos, alternativas corretas únicas nas perguntas dos pães, correspondência dos cartões do samaritano e as quatro cenas de cada uma das 15 histórias. Para uma referência que contém somente um versículo de entrada e um rótulo mais amplo, a checagem automática cobre a entrada estruturada; **não interpreta todos os intervalos escritos livremente no rótulo ou na prosa**.

A edição local conferida é **Bíblia Livre, TR, fevereiro de 2018 (`blivre-tr-2018.2.0`)**: 66 livros, 1.189 capítulos e 31.102 versículos. O SHA-256 do ZIP de origem corresponde ao registrado em `edition.json`. Na comparação desta iteração com `HEAD`, não havia alteração no texto do corpus, em sua edição nem nos textos narrativos de `stories/index.ts` e `stories/miracle-stories.ts`. Isso registra a comparação desta revisão, sem garantir que os arquivos não possam mudar posteriormente.

Essa edição tem cânon protestante de 66 livros. A presença desse acervo não constitui uma Bíblia com todos os cânones cristãos, e sua conferência técnica não afirma que a redação da tradução seja isenta de problemas editoriais. As limitações e a licença permanecem identificadas nos créditos da edição.

## Três jogos e leitura das passagens

Além de conferir a existência das referências, o agente leu os trechos locais abaixo e comparou seus detalhes com as perguntas e os retornos das atividades. Esta foi uma comparação textual assistida, **não uma aprovação feita por pastor, teólogo ou professor humano**.

| Atividade | Fonte e correspondência observada | Limite |
| --- | --- | --- |
| O caminho da compaixão | Lucas 10:25–37. A sequência é compaixão (v.33), aproximação/curativos/transporte/hospedaria (v.34), provisão de continuidade (v.35). Os versículos 36–37 retornam à pergunta pelo próximo e à misericórdia. | Os cartões são resumos, não transcrição de todas as ações. Não substituem o relato completo nem são uma prescrição de primeiros socorros. |
| Fios da Palavra | Lucas 10 é apresentado como parábola; Salmos 23:1–4 traz pastor, pastos, águas e vale em linguagem poética; João 6:11–14 narra a alimentação da multidão e chama o ocorrido de sinal (v.14). | Classificar formas literárias ajuda a ler; não esgota seus sentidos e não transforma a fé em uma nota. O milagre não é reduzido a uma metáfora. |
| Nas mãos de Jesus | João 6:9 menciona cinco pães de cevada e dois peixinhos; v.11 identifica Jesus tomando os pães e dando graças; vv.12–13 apresentam o recolhimento e doze cestos; v.14 chama o ocorrido de sinal. | A quantidade de objetos na ilustração não é prova de resposta. A leitura dos versículos orienta as alternativas. |

Dois detalhes receberam atenção específica:

- **Doze cestos em João 6:13, sete em Marcos 8:8.** O retorno da alternativa incorreta distingue os dois relatos e cita a passagem correspondente, em vez de misturá-los.
- **Distribuição em João 6:11.** Na edição TR usada no app, Jesus reparte aos discípulos, e os discípulos aos que estavam sentados. O retorno explica isso como redação desta edição; não apresenta essa forma como se todas as traduções fossem idênticas.

As passagens mostradas pelos jogos são obtidas de `getBibleChapter` e recortadas por número do versículo em `app/jogos/page.tsx`; as instruções e os comentários ficam separados. O trecho “Vai, e faze da mesma maneira.” no destaque corresponde a parte de Lucas 10:37 da edição local e está identificado como trecho, não como versículo integral. O componente também informa que as práticas verificam compreensão do texto e não avaliam fé, santidade ou inteligência.

## As quatro novas ilustrações

| Cena | Passagem vinculada na proveniência | Correspondência textual conferida |
| --- | --- | --- |
| Menino e alimento | João 6:8–10 | André menciona o menino, os cinco pães de cevada e os dois peixinhos; Jesus manda assentar as pessoas. |
| Recolhimento dos pães | João 6:12–13 | Depois de saciados, os discípulos recebem ordem de recolher as sobras; o texto fala em doze cestos. |
| Calmaria no barco | Marcos 4:39–41 | Jesus repreende o vento, fala ao mar e há grande bonança; os discípulos perguntam quem ele é. |
| Cuidado do samaritano | Lucas 10:33–35 | O samaritano se compadece, aproxima-se, trata as feridas, transporta e cuida da continuidade do acolhimento. |

O script confere os quatro arquivos PNG da proveniência: existência, SHA-256, bytes e dimensões **1536 × 1024**, além do vínculo a uma história/cena válida. Essa é uma conferência dos arquivos e de suas referências, **não uma autenticação visual, arqueológica ou histórica**. O texto dos rótulos os apresenta como ilustrações artísticas geradas, não fotografias dos acontecimentos. Roupas, aparência, enquadramento, quantidade de pessoas visíveis e composição precisam continuar tratados como interpretação artística. Nenhuma dessas imagens deve servir como fonte para contar pães, peixes, discípulos ou cestos em uma avaliação.

## Revisão humana ainda necessária

Antes de divulgar o curso como conteúdo especializado revisado, registrar as pessoas responsáveis, a data, a versão e o escopo de uma revisão bíblica/pastoral e pedagógica. Conferir, em especial:

1. Fidelidade dos recontos e aplicações às passagens inteiras, distinção entre citação e comentário e tratamento respeitoso das diferenças entre tradições cristãs.
2. Linguagem de acolhimento e cuidado nos temas de sofrimento, luto, milagres, salvação e fé, sem prometer prosperidade automática ou atribuir culpa espiritual a quem sofre.
3. Leitura visual das ilustrações, inclusive detalhes que a geração de imagens possa ter representado de forma inadequada.
4. Experiência com estudantes reais: compreensão antes/depois, lembrança após um intervalo, transferência para outra passagem, dúvidas recorrentes, legibilidade e acessibilidade. Concluir atividades ou receber uma animação de celebração não comprova aprendizagem duradoura.
5. Escuta e licença de qualquer futura gravação humana, conforme [voz-humana.md](./voz-humana.md). Nesta iteração não foi adicionada gravação humana verificada.

Não há parecer humano especializado anexado a esta conferência. A existência das referências e a integridade técnica não autorizam anunciar “teologicamente revisado”, “sem erros” ou resultados de aprendizagem ainda não medidos.
