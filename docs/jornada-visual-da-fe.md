# Uma caminhada visual na Palavra

Implementação de 29 de outubro de 2026. `FaithWorld` é um cenário vetorial interativo em perspectiva 2.5D, incorporado ao mapa público de 24 etapas. A composição e o personagem são desenhos autorais em SVG: mantêm linhas nítidas em qualquer densidade de tela e não dependem de imagens raster ampliadas ou de um motor 3D pesado.

## O que o cenário representa

As seis paisagens seguem os agrupamentos reais do currículo: começos e aliança; terra, acolhimento e monarquia; oração e profetas; Evangelhos; primeiras comunidades; perseverança, cuidado e nova criação. Cada parada abre a etapa correspondente, com texto bíblico, explicação, exemplo e prática. O cenário não é apresentado como geografia da Palestina ou reconstrução de um lugar antigo.

Botões, setas de teclado e pontos selecionáveis movem o personagem; a câmera o acompanha. A visão geral permite localizar o conjunto. Escolher ou visitar uma parada não a marca como praticada. Uma resposta correta conferida é o evento real que já gera o marco das 24 leituras.

O personagem recebe uma lanterna após uma atividade de estudo, uma bolsa depois de três e um detalhe de manto após seis. O cálculo considera as etapas com prática conferida e os estudos guiados efetivamente concluídos, mantendo os dois registros separados. Esses detalhes são lembranças da dedicação ao estudo. Não significam inteligência medida, santidade, salvação, favor divino, um sacramento recebido ou eficácia pedagógica comprovada.

## Vocações e companhia

Família e comunidade são opções da representação, disponíveis desde o início. Não se exige casamento ou filhos e não se desbloqueia um familiar como recompensa espiritual. A imagem de família é ilustrativa; não declara o estado civil ou a composição real da família do usuário. A representação pode ser neutra, feminina ou masculina, com faixa de vida escolhida. Essas escolhas permanecem em memória e não são usadas para atribuir sexo biológico, papéis religiosos ou conteúdo obrigatório.

O estudo do batismo tem um acesso próprio às passagens já disponíveis. Um clique ou uma resposta no aplicativo não realiza batismo e não coleta uma declaração sobre a vida sacramental da pessoa.

Fontes bíblicas primárias, consultáveis na Bíblia Livre TR2018 do próprio aplicativo:

- 1 Coríntios 7:7–8,32–35: Paulo reconhece caminhos e dons diferentes; casamento não é requisito universal de maturidade cristã.
- 1 Coríntios 12:12–27: muitos membros e dons, um só corpo.
- Gálatas 5:22–25: o fruto do Espírito não se reduz a uma pontuação ou aparência.
- Mateus 28:18–20 e Romanos 6:1–4: leituras sobre batismo, discipulado e vida em Cristo, com diferenças confessionais identificadas no guia temático.

Como documento confessional complementar, foi consultado o [Catecismo da Igreja Católica, §§ 1618–1620](https://www.vatican.va/archive/cathechism_po/index_new/p2s2cap3_1533-1666_po.html), que apresenta a virgindade pelo Reino e o matrimônio como vocações com sentido próprio. A página foi acessada e seus parágrafos lidos em 29/10/2026. Essa referência é identificada como católica, não como autoridade institucional de todas as tradições. As sínteses do aplicativo não são transcrições nem declarações oficiais de líderes.

## Ferramentas abertas e escolha técnica

O repositório [PixiJS](https://github.com/pixijs/pixijs), sua [licença MIT](https://raw.githubusercontent.com/pixijs/pixijs/dev/LICENSE) e o projeto [Motion](https://github.com/motiondivision/motion) foram consultados. PixiJS é uma alternativa para renderização de cenas; não foi instalado nem distribuído nesta entrega. O desenho vetorial e Motion já presente no projeto permitem uma cena nítida, interação e transição de câmera sem acrescentar uma dependência gráfica.

Não há laço contínuo de animação criado pelo cenário. O deslocamento responde a uma ação e termina. A preferência de movimento reduzido remove as transições; o observador de tamanho é desconectado ao desmontar. Todos os links das 24 etapas permanecem no mapa HTML; sem JavaScript, a ilustração, a leitura inicial e a lista completa continuam disponíveis.

## Estado e privacidade

`JourneySessionProvider` mantém em memória `practiced`, `completedLessons`, `currentStageId` e `visualProfile`. Não escreve em cookies, localStorage, sessionStorage ou banco. Recarregar fecha essa visita e reinicia seus dados. Limpar marcos das 24 etapas não apaga silenciosamente as conclusões dos estudos guiados. Não houve mudança de esquema ou de consentimento do perfil salvo.

O cenário auxilia orientação e vínculo com o estudo. Revisão humana especializada de teologia, história, acessibilidade e avaliação com estudantes continua necessária antes de alegar eficácia ou formação completa.

## Verificações desta implementação

ESLint dos arquivos modificados e TypeScript passaram. Conferências no navegador em 1440 px e 320 px demonstraram seleção e movimento, preferências de aparência/companhia, navegação à leitura e retorno com prática real. Somente escolher a parada manteve zero práticas; responder corretamente produziu o marco e sua lembrança visual. Não houve overflow horizontal, erros de execução ou gravação em storage. Sem JavaScript, o cenário inicial, o acesso à leitura e os 24 links do mapa permaneceram disponíveis. Uma conferência adicional sem movimento reduzido mediu posições intermediária e final diferentes durante a animação, confirmando deslocamento real do personagem.

Evidências locais: `/tmp/injessus-faith-world-report.json`, screenshots de computador/celular e o roteiro de conferência em `/tmp/injessus-faith-world-check.cjs`. Elas verificam funcionamento técnico no ambiente de trabalho; não substituem a validação do build final e da publicação.
