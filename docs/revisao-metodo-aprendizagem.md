# Revisão do método de aprendizagem

Data: 25 de outubro de 2026. Escopo: auditoria do desenho da primeira aula e do plano de estudos, confrontada com um guia de formação de professores, uma síntese institucional e artigos de pesquisa acessíveis. **Não é uma avaliação de eficácia com estudantes.**

## O que esta revisão permite concluir

O projeto adota práticas que têm fundamentação na literatura de aprendizagem: objetivos observáveis, exemplo resolvido, prática com apoio, tentativa de recuperação antes da consulta, feedback explicativo, aplicação em outra passagem e retomadas em outros dias. A adaptação ao app precisa preservar a diferença entre praticar com ajuda, reconhecer uma alternativa e conseguir explicar e aplicar o procedimento de forma independente.

Não existe um método único demonstrado como “o melhor” para todo conteúdo, idade e contexto. Também não há evidência de que combinar essas práticas no InJessusName já tenha produzido aprendizagem superior. O nome do método, as quatro etapas, as seis lentes e o S.O.A.P. organizam a experiência; sua presença não comprova eficácia. Cada recurso deve ajudar o objetivo, sem exigir seis explicações longas quando uma pergunta simples bastar.

Foram inspecionados o conteúdo de [primeiros-passos.ts](../src/content/lessons/primeiros-passos.ts), a interface de [lesson-player.tsx](../src/components/lesson-player.tsx), o cálculo de [study-progress.ts](../src/lib/study-progress.ts) e as propostas de [learning-path.ts](../src/lib/learning-path.ts). A revisão de código verifica o desenho disponível, sem substituir revisão teológica, avaliação de acessibilidade com usuários ou acompanhamento de aprendizagem.

## Fontes externas consultadas e limites

O repositório oficial de formação de instrutores de The Carpentries foi obtido por Git HTTPS, no commit `2c5559f28c613a317843175c9c285028fa2169ac`. Foram lidos os capítulos indicados e os trechos relevantes dos PDFs de pesquisa e síntese ali disponíveis. Os links abaixo fixam essa cópia consultada, em vez de apontarem silenciosamente para uma versão mutável. Data de consulta: 25 de outubro de 2026. Não foi incorporado ao app texto, imagem ou PDF dessas obras; as decisões e explicações abaixo são uma síntese autoral.

| Obra consultada | O que a leitura sustenta no desenho | Limite de aplicação ao produto |
| --- | --- | --- |
| The Carpentries, *Instructor Training*: [02 — Practice Learning](https://github.com/carpentries/instructor-training/blob/2c5559f28c613a317843175c9c285028fa2169ac/episodes/02-practice-learning.md), [05 — Memory](https://github.com/carpentries/instructor-training/blob/2c5559f28c613a317843175c9c285028fa2169ac/episodes/05-memory.md), [06 — Feedback](https://github.com/carpentries/instructor-training/blob/2c5559f28c613a317843175c9c285028fa2169ac/episodes/06-feedback.md), [08 — Motivation](https://github.com/carpentries/instructor-training/blob/2c5559f28c613a317843175c9c285028fa2169ac/episodes/08-motivation.md) | Avaliação formativa durante o ensino para detectar dificuldades; alternativas associadas a erros esperados; prática guiada e redução gradual do apoio; limitar conceitos e distrações; usar retorno dos estudantes para modificar o ensino | Guia de formação para oficinas de computação, especialmente adultos. É uma fonte pedagógica de implementação, não um ensaio do InJessusName ou fonte de autoridade teológica. Afirmações confessionais não devem ser classificadas como erros por analogia com exemplos de computação |
| Deans for Impact (2015), *The Science of Learning*. [PDF consultado no repositório](https://github.com/carpentries/instructor-training/blob/2c5559f28c613a317843175c9c285028fa2169ac/episodes/files/papers/science-of-learning-2015.pdf), seções 1–6 | Exemplos resolvidos e retirada gradual de apoio; prática distribuída; tentativa de recordar; feedback claro, específico e voltado à tarefa; transferência depende do conhecimento e da estrutura do problema; não adaptar a supostos estilos de aprendizagem | Síntese institucional com bibliografia, não estudo experimental próprio nem revisão atualizada até 2026. Os estudos originais citados precisam de leitura independente quando uma decisão depender de seus detalhes |
| Mayer e Moreno (2003), *Nine Ways to Reduce Cognitive Load in Multimedia Learning*, *Educational Psychologist*, 38(1), 43–52. [PDF consultado](https://github.com/carpentries/instructor-training/blob/2c5559f28c613a317843175c9c285028fa2169ac/episodes/files/papers/mayer-reduce-cognitive-load-2003.pdf), especialmente introdução e segmentação | Modelo de capacidade limitada; apresentar segmentos sob controle do estudante, alinhar informação relevante e evitar competição entre meios; distinguir lembrar o que foi apresentado de resolver um problema novo | Artigo dos pesquisadores que sintetiza seus experimentos com explicações multimídia de sistemas, como mecanismos e fenômenos naturais. Não demonstra que uma interface bíblica específica ou seis lentes sejam superiores; os autores apontam limitações na separação entre efeito de segmentação e interatividade |
| Koedinger et al. (2015), *Learning Is Not a Spectator Sport: Doing Is Better than Watching for Learning from a MOOC*, L@S 2015, 111–120. [PDF consultado](https://github.com/carpentries/instructor-training/blob/2c5559f28c613a317843175c9c285028fa2169ac/episodes/files/papers/koedinger-doing-watching-2015.pdf), resumo, introdução e desenho do curso; DOI 10.1145/2724660.2724681 | Fazer atividades com feedback e apoio deve integrar o curso; assistir ou ler não é suficiente como indicador de aprendizagem. O desenho deve vincular atividades a objetivos e acompanhar quem abandona | Estudo primário com dados de MOOC de psicologia. Os autores caracterizam os dados como correlacionais e empregam mecanismos de inferência causal; isso não autoriza aplicar ao app um multiplicador de ganho, prometer causalidade nem desprezar leitura atenta |

### Referências originais ainda pendentes de consulta direta

As tentativas HTTPS para IES, Sage, PubMed, FSU, ERIC e PMC foram bloqueadas pelo proxy do ambiente com `CONNECT 403`. A repetição solicitada com permissão adicional foi abortada enquanto aguardava autorização. Não foi desativada a verificação TLS nem contornada a política de rede. As obras abaixo são referências para aprofundamento, e não fontes declaradas como lidas diretamente nesta etapa. Parte de seus temas aparece nas sínteses consultadas acima; isso não equivale a verificar o estudo original.

| Referência para verificação | Contribuição que se pretende conferir | Limite de aplicação ao produto |
| --- | --- | --- |
| Pashler et al. (2007), *Organizing Instruction and Study to Improve Student Learning*, IES/NCER 2007-2004. [Guia oficial](https://ies.ed.gov/ncee/wwc/PracticeGuide/1) | Espaçamento, alternância de exemplos e problemas, integração de representação verbal e gráfica, perguntas explicativas e testes de recuperação | Guia de ensino e estudo; não é avaliação deste aplicativo nem validação de um curso de teologia |
| Dunlosky et al. (2013), *Improving Students’ Learning With Effective Learning Techniques*. [DOI 10.1177/1529100612453266](https://doi.org/10.1177/1529100612453266) | Revisão de técnicas, incluindo prática de testes e prática distribuída; diferença entre uma sensação de familiaridade e aprendizagem duradoura | Uma classificação geral de técnicas não determina o melhor desenho de cada aula, o intervalo ideal ou a adequação por idade |
| Roediger e Karpicke (2006), *Test-Enhanced Learning: Taking Memory Tests Improves Long-Term Retention*. [Registro PubMed pretendido](https://pubmed.ncbi.nlm.nih.gov/16507066/) | Diferença entre desempenho imediato de estudo e recuperação posterior | Experimento de memória não demonstra compreensão teológica, capacidade de serviço ou benefício espiritual; as condições e os intervalos precisam ser conferidos no artigo |
| Shute (2008), *Focus on Formative Feedback*. [DOI 10.3102/0034654307313795](https://doi.org/10.3102/0034654307313795) | Feedback que oferece informação sobre a tarefa e orienta a próxima ação | A explicação precisa ser correta, compreensível e adequada ao erro; elogio genérico ou revelar o gabarito não é medida de domínio |
| Butler (2010), *Repeated Testing Produces Superior Transfer of Learning Relative to Repeated Studying*. [DOI 10.1037/a0019902](https://doi.org/10.1037/a0019902) | Possibilidade de avaliar recuperação e aplicação além da repetição idêntica | Transferência tem alcance limitado pelas tarefas e conhecimentos estudados; acertar uma pergunta de escolha em Lucas não comprova interpretação independente de qualquer texto |

## Adaptação das práticas ao app

| Necessidade do estudante | Decisão aplicada na primeira aula | O que se consegue observar hoje | Próxima verificação |
| --- | --- | --- | --- |
| Entender o que precisa aprender | Quatro objetivos de localizar, observar, conferir e aplicar; critérios de sucesso no conteúdo | Conclusão de atividades correspondentes | Pedir ao participante que explique o objetivo com suas palavras; cortar termos que precisem de explicação não oferecida |
| Começar sem já dominar o procedimento | Exemplo resolvido em voz de professor, legenda de referência e prática guiada antes das missões | Participante pode consultar o exemplo e as pistas | Ver se consegue localizar outra referência sem repetir a mesma legenda; ajustar apoio ao erro observado |
| Não sobrecarregar a atenção | Quatro etapas, uma missão por vez, seis lentes selecionáveis, tempo sugerido e pausa livre | Navegação, consultas e respostas na sessão | Observar leitura em tela pequena e leitores iniciantes; reduzir conteúdo que compete com o objetivo. Não acrescentar vídeo, mapa ou animação apenas para preencher uma seção |
| Aprender com o erro | Explicação específica por alternativa, localizador da fonte, dica e nova tentativa | Primeira tentativa, dica/consulta e correção são distinguidas | Revisar se as alternativas erradas correspondem a erros reais. Eliminar uma opção após errar facilita acertar e não pode ser tratado como domínio |
| Tentar recordar antes de reler | Texto recolhido nas três perguntas de lembrança; alternativas só aparecem após o convite a responder oralmente ou no papel | O app registra escolha e ajuda solicitada; não verifica o que foi dito ou escrito fora dele | Avaliação humana opcional com rubrica para resposta produzida sem alternativas. O resultado eletrônico atual continua sendo reconhecimento |
| Aplicar o procedimento a uma situação diferente | Atos 17:10–12 no exemplo; Lucas 10:25–37 na aplicação, com consulta permitida | Reconhecimento de uma ação de contextualização no novo texto | Pergunta de justificativa e outra passagem inédita; separar primeira tentativa de conclusão após feedback |
| Retomar sem depender de uma única sessão | Datas propostas de um e sete dias e tarefas no caderno, associadas à conclusão salva quando o adulto opta por isso | Datas de retomada; não há avaliação automática de retenção posterior | Instrumentos paralelos e retorno real dos participantes. D+1/D+7 são uma regra inicial de produto a testar, não intervalos universais ótimos |
| Ter um percurso compreensível | Idade orienta linguagem proposta; objetivo e tradição orientam temas e perspectiva declarada | Roteiro proposto; não diagnóstico de capacidade | Usar conhecimento prévio e erros de tarefa para decidir apoio. Idade, batismo e denominação não determinam habilidade, “estilo de aprendizagem” ou maturidade espiritual |

## Lacunas que precisam permanecer visíveis

1. **Escolha não equivale a explicação.** As alternativas permitem adivinhação e reconhecimento. O convite ao caderno favorece elaboração, mas não fornece ao servidor evidência do raciocínio produzido. A rubrica exige avaliação por pessoa para sustentar uma conclusão sobre explicação independente.
2. **Correção não equivale a retenção.** Depois de feedback e eliminação de alternativas, o acerto é prática corrigida. Os resultados precisam mostrar ajuda e nova tentativa. A aplicação em outro texto também deve distinguir primeira tentativa de correção.
3. **Retorno planejado não equivale a avaliação executada.** O app propõe datas; não há neste bloco um motor de avaliação tardia, lembrete enviado ou estudo com participantes. Os dois itens `delayedQuestions` no arquivo de conteúdo reutilizam alternativas anteriores; não devem ser apresentados como forma paralela independente ou prova inédita de retenção.
4. **O diagnóstico é curto e próximo do que será ensinado.** Uma questão inicial ajuda a iniciar a conversa, mas não estima de forma confiável nível de leitura, conhecimento bíblico ou necessidade de apoio. Não usar sua resposta para restringir acesso ou classificar a pessoa.
5. **Exigência de acertar para avançar pode esconder dificuldade.** Permitir correção é útil para prática; medir apenas conclusões excluiria quem desistiu. O piloto precisa registrar onde a pessoa travou, sem inferir incapacidade ou falta de fé.
6. **A aula não tem validação por público.** A linguagem foi escrita para introdução, mas não foi demonstrada adequada a crianças, adolescentes, baixa familiaridade de leitura ou leitores de tela. Começar a avaliação acompanhada por adultos e criar adaptações após observação.

## Protocolo inicial para avaliar e melhorar

### Primeira rodada: compreender a experiência

Convidar inicialmente 5–8 adultos, com consentimento, variando familiaridade com leitura bíblica e uso de celular. Esse número é uma decisão prática para encontrar dificuldades de usabilidade; não é amostra de eficácia nem garantia de saturação. Acompanhar a primeira aula sem ensinar a resposta durante a tentativa inicial. Anotar problemas de localização, compreensão das instruções, uso de dicas, leitura da fonte e motivos de abandono. Pedir que a pessoa explique no papel ou oralmente onde encontrou apoio para uma resposta. Não solicitar oração, testemunho íntimo, denominação ou informações de terceiros.

Corrigir antes da próxima rodada qualquer fonte incorreta, alternativa ambígua, barreira de teclado/leitor de tela ou instrução que mais de um participante entenda de modo diferente do pretendido. Conservar as evidências observadas e a versão da aula; a correção não autoriza apagar o registro de que houve problema.

### Segunda rodada: acompanhar aprendizagem

Antes de recrutar, definir os instrumentos, critérios e análise; revisão humana das questões é pré-requisito. A quantidade de participantes e eventual comparação entre desenhos precisam de planejamento próprio, considerando objetivo, variação esperada, perdas de acompanhamento e recursos. Não transformar uma turma pequena em evidência de superioridade mundial.

| Momento | Tarefa proposta | O que separar no registro |
| --- | --- | --- |
| Antes da aula | Localizar uma referência diferente da usada no exemplo; indicar como conferiria uma afirmação curta | Resposta sem apoio, ajuda oferecida e familiaridade declarada com a tarefa; sem usar denominação como substituto de conhecimento |
| Depois da prática | Nova referência e afirmação, com critérios equivalentes; justificativa oral ou no papel | Acerto inicial, qualidade da evidência, ajuda e correção; não comparar apenas a repetição exata do diagnóstico |
| Cerca de um dia depois | Forma paralela inédita, começando sem alternativas/consulta; após a tentativa, permitir conferência e feedback | Recordação produzida, reconhecimento posterior, consulta e atraso real desde a aula |
| Cerca de sete dias depois | Outra forma paralela e uma passagem que não foi usada no exemplo nem no teste anterior | Retenção da habilidade, transferência e ajuda; o teste do primeiro retorno também ensina, portanto os dois retornos não são observações independentes |

Uma forma paralela mantém a habilidade e dificuldade pretendidas, alterando passagem, formulação e alternativas; precisa ser revisada para não acrescentar um pré-requisito que a aula não ensina. Apenas trocar a ordem das opções não cria uma nova tarefa. Se houver comparação entre métodos, distribuir condições de modo planejado, oferecer conteúdo e tempo comparáveis e considerar diferenças iniciais. Um antes/depois isolado pode indicar progresso observado, mas não prova que o desenho do app causou o ganho.

### Rubrica curta para justificativa

| Habilidade | 0 — ainda não demonstrada | 1 — com apoio ou incompleta | 2 — independente na tarefa |
| --- | --- | --- | --- |
| Localizar | Não encontra o texto solicitado | Encontra seguindo uma dica ou confunde parte da referência | Encontra a nova referência e explica livro, capítulo e versículos |
| Observar e conferir | Responde sem identificar evidência ou acrescenta detalhe como se estivesse escrito | Identifica parte da evidência após orientação | Aponta a passagem e distingue observação, hipótese e aplicação |
| Contextualizar e transferir | Repete os detalhes do exemplo no novo texto | Consulta o entorno com uma pergunta-guia | Justifica por que o entorno importa no novo texto e reconhece um limite |

Avaliar uma resposta com diferença confessional exige examinar a perspectiva e a evidência; discordar de uma interpretação não é automaticamente erro de aprendizagem. A rubrica mede tarefas de estudo, sem classificar fé, salvação, santidade ou aptidão ministerial.

### Critérios de decisão e transparência

- Relatar todos os participantes que iniciaram, concluíram e retornaram; sempre apresentar o denominador. Não excluir quem precisou de ajuda nem considerar ausência como erro ou acerto.
- Informar por habilidade a primeira tentativa, a ajuda e a correção. Um critério operacional inicial pode ser demonstrar as três habilidades com nota 2 em uma tarefa nova; isso é um alvo definido para o piloto, não limiar cientificamente validado nem requisito de valor pessoal.
- Definir previamente metas de compreensão das instruções, acesso e aprendizagem conforme o público e os instrumentos revisados. Não escolher uma porcentagem após ver os resultados para declarar sucesso.
- Medir tempo apenas se necessário para identificar esforço e barreiras, com consentimento. Tempo curto ou sequência diária não são prova de compreensão. A aplicação atual não implementa pesquisa de uso nem telemetria de abandono.
- Guardar resultados de pesquisa somente com finalidade e retenção explícitas, separados da personalização religiosa. A implementação atual guarda, quando autorizado, progresso individual; isso não constitui consentimento para pesquisa nem autoriza exportação de respostas para terceiros.
- Divulgar resultados e limitações por versão, corrigir as dificuldades encontradas e repetir a rodada afetada. Para alegar benefício pedagógico ou superioridade, obter avaliação independente proporcional à afirmação.

O próximo avanço confiável é uma aula compreendida e utilizável, com fontes corretas e problemas observados corrigidos. A expansão do catálogo deve usar esse retorno; quantidade de aulas, IA, jogos ou pontos não substituem a demonstração de aprendizagem.
