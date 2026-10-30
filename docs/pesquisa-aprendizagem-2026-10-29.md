# Aprender: propósito, prática e uma presença mais acolhedora

Pesquisa e implementação de 29 de outubro de 2026. Foram consultadas fontes representativas de seis plataformas de aprendizagem e leitura, além do 21st.dev e de código aberto no GitHub. Isso **não equivale a analisar milhares de aplicativos**, medir resultados com os nossos estudantes ou certificar o método do InJessusName.

## Fontes acessadas e o que foi aproveitado

As URLs finais abaixo responderam HTTP 200 e tiveram o conteúdo pertinente lido. Respostas e evidências de acesso permanecem no ambiente em `/tmp/learning-method-research/`; não se copiam páginas integrais de terceiros para o repositório.

| Referência | Observação real | Adaptação ao aplicativo |
| --- | --- | --- |
| [Duolingo Research](https://research.duolingo.com/) | O catálogo inclui *A Trainable Spaced Repetition Model for Language Learning* (Settles e Meeder, ACL 2016) e dados de recuperação com intervalos entre práticas. | Recordar e revisitar fazem parte do percurso. Não se afirma que o aplicativo possui esse algoritmo ou um calendário automático de revisão; a revisão espaçada continua limitada a propostas de retorno. |
| [Khan Academy: Why Mastery Learning, by Sal Khan](https://support.khanacademy.org/hc/en-us/articles/360030753412-Why-Mastery-Learning-by-Sal-Khan) | A explicação liga domínio à possibilidade de continuar trabalhando uma habilidade e aplicá-la em outro contexto. | Cada encontro torna visível uma habilidade concreta, oferece exemplo e permite reler e tentar novamente. Não se transforma acerto imediato em certificação de aprendizagem duradoura. |
| [Brilliant](https://brilliant.org/) | A página consultada apresenta em 2026 um tutor visual com espaço interativo e feedback, explicitando compreensão e prática. | Observar → tentar → receber explicação. A interface oferece uma pequena prática real; não foi adicionado um tutor de IA nem copiada a experiência de Koji. |
| [Coursera: What Is Microlearning?](https://www.coursera.org/enterprise/articles/what-is-microlearning) | O artigo descreve unidades curtas orientadas a uma necessidade específica e apresenta referências para aprofundamento. | Um propósito por encontro, objetivos legíveis e continuidade. Os minutos são estimativas, sem cronômetro, pressa artificial ou corte arbitrário de textos bíblicos. |
| [BibleProject Classroom](https://bibleproject.com/classroom/) | A apresentação convida a estudar a beleza e complexidade da Bíblia no próprio ritmo ou em comunidade, com prévia de sessão e classes. | Mostrar por que uma leitura vem agora, sua ligação à próxima e uma prévia do que será praticado. Nenhum vídeo, curso, imagem ou comentário do BibleProject foi copiado. |
| [YouVersion: Bible App](https://www.youversion.com/bible-app) | O produto integra leitura, escuta, oração e ritmos espirituais cotidianos; a página também apresenta planos. | Palavra, oração opcional e aplicação à vida como partes coerentes do estudo. Sem notificações de cobrança, competição por devoção ou inferência de maturidade espiritual. |
| [21st.dev: Border Beam](https://21st.dev/@dillionverma/components/border-beam) | Foi consultada a apresentação do componente e rastreada a implementação aberta correspondente no MagicUI. | Um contorno de luz discreto acompanha **uma escolha explícita de encontro**, uma única vez. Ele não anima indefinidamente, não atribui pontos e respeita movimento reduzido. |

A página Duolingo `/approach` respondeu 200, mas depende de renderização e não forneceu texto substantivo suficiente nesta consulta; não foi usada como prova detalhada do método. Duas URLs presumidas do blog retornaram 404 e foram descartadas. A página inicial do blog serviu apenas para localizar o portal de pesquisa. Não se inferiu conteúdo de fontes ausentes.

## Código aberto efetivamente usado

`src/components/learning-sanctuary/focus-border.tsx` adapta a geometria e o movimento de **BorderBeam, MagicUI**, mantendo o Motion já instalado. O código foi obtido no GitHub com revisão fixa:

- Repositório: [magicuidesign/magicui](https://github.com/magicuidesign/magicui).
- Revisão: `efe76fc5755eca1142dd4f74c1d6f0ace2887e3c`.
- [Código original](https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/apps/www/registry/magicui/border-beam.tsx).
- [Licença original MIT](https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/LICENSE.md), preservada integralmente em `src/components/learning-sanctuary/MAGICUI-LICENSE.txt`.
- SHA-256 da licença: `0147b84235ed916b8b4e89c1f80655351c5afe7d211b629be61f553a227b34ba`.

A adaptação removeu dependências de utilitários de classe e Tailwind específicos do componente original; usa CSS próprio, tons de dourado e verde e duração única de cinco segundos após seleção. Não existe repetição infinita, animação necessária à compreensão, efeito de desfoque ou dependência nova de pacote. A preferência de movimento reduzido suprime o adorno.

O desenho da sala de leitura em `sanctuary-scene.tsx` é uma composição vetorial original do projeto. Continua nítido ao redimensionar, não depende de imagens raster e não é apresentado como fotografia ou reprodução de uma igreja histórica.

## Por que a caminhada começa em Atos 17

Os seis encontros iniciais preservam sua ordem e seus identificadores. Primeiro se pratica localizar e acompanhar uma passagem, tomando Atos 17:10–12 como companhia para o cuidado com as Escrituras. Depois se conhecem formas literárias e se aproximam criação, amor ao próximo, oração e testemunho. O mapa de panorama, por sua vez, começa em Gênesis e segue até a nova criação. Essa distinção aparece na interface, para que o estudante não confunda aula de preparação com ordem histórica da narrativa.

Cada encontro tem um propósito próprio, três ações concretas a praticar, um exemplo cotidiano e a ligação com o próximo. A página não funciona como uma vitrine de materiais independentes; o mapa, os 66 guias e a busca aparecem como aprofundamentos com papéis distintos.

A linguagem expressa convicção cristã: Deus ama, age e faz maravilhas; oração, confiança e serviço fazem parte do caminho. O estudo do contexto é apresentado como cuidado para acolher a Palavra, sem pretender esgotar a ação divina. Explicações e exemplos são autorais, não citações bíblicas inventadas nem declarações oficiais de uma denominação.

## Recompensas e limites

A pequena prática da página revela uma explicação e um selo de descoberta **somente depois de uma escolha feita pelo estudante**. Não há aumento fictício de inteligência, nível espiritual, medalha por crença, urgência de retorno ou punição por ausência. A indicação de leitura retomada vem apenas do contexto real do mapa nesta visita; uma etapa aberta não é rotulada como aula concluída. As seis aulas também têm uma lista separada de encontros praticados: seus players registram o encerramento somente depois da prática correta. O santuário usa essa lista para exibir selos e o próximo encontro ainda não praticado, sem confundir aula com etapa do panorama. Todos os seis praticados conduzem ao mapa, sem bloquear a revisão das aulas.

As respostas da preparação e a seleção do encontro ficam no estado React da página, sem armazenamento ou envio ao servidor. Os seis links de aula, explicações iniciais, detalhes nativos e portas de aprofundamento permanecem disponíveis sem JavaScript. A avaliação pedagógica com estudantes e a revisão humana especializada continuam necessárias.

A oração opcional de preparação é recebida como conteúdo de servidor pelo santuário. A voz sintética é identificada, o texto é autoral e o player só toca por escolha da pessoa. Um convite adicional conduz à multiplicação dos pães, conectando o estudo à contemplação dos sinais de Jesus, sem prometer um resultado pessoal automático.
