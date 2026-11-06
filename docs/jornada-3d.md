# O caminho da compaixão

A primeira jornada controlável do aplicativo está em `/jogos/caminho-da-compaixao`, com entrada pela página inicial e pelo catálogo de jogos. O aluno controla um personagem em terceira pessoa, explora um cenário tridimensional e acompanha seis gestos inspirados em Lucas 10:25–37: parar junto ao viajante, buscar os recursos, representar o cuidado das feridas, preparar o transporte, acompanhar até a hospedaria e providenciar a continuidade no dia seguinte.

## Ações com sentido na passagem

A missão verifica ordem, proximidade, recursos e chegada do acompanhante. Estar longe não permite realizar uma ação. A bolsa precisa ser recolhida e usada; o animal com o viajante acompanha o percurso; chegar sozinho ao destino não conclui o acolhimento. O avanço acontece pelas ações no mundo, sem prova de alternativas, cronômetro ou pontuação de fé.

A ampliação de 06/11/2026 acrescenta três gestos sustentados de cuidado, consumindo separadamente panos, azeite/vinho e ataduras. Soltar o controle interrompe o gesto sem gastar o recurso. A estrada percorre um vale com ponte: personagem e acompanhante precisam atravessá-la juntos. A hospedaria tem porta, paredes com colisão, interior, leito e hospedeiro acessíveis. O animal acompanha o trajeto percorrido pelo jogador, inclusive nas curvas. Três pontos opcionais convidam a observar Lucas 10 no caminho, sem bloquear a missão nem atribuir nota à fé.

Jesus conta uma parábola ao responder à pergunta sobre o próximo. A estrada condensada, a ponte, os pontos de observação, o interior da hospedaria, a câmera, os controles, a bolsa, a sequência dos gestos e a aparência dos personagens são adaptações do jogo. O jumento é uma escolha visual: Lucas menciona o animal, sem determinar sua espécie. Os gestos representam a narrativa e não são instruções de atendimento médico. A passagem para a última etapa identifica o dia seguinte, conforme Lucas 10:35. Não se apresenta o cenário como localização arqueológica ou reconstituição autenticada.

Os treze versículos de Lucas 10:25–37 vêm diretamente do corpus da Bíblia Livre TR 2018, com redação, autoria e licença preservadas. A consulta durante o jogo pausa a exploração. Os textos de orientação são comentários editoriais, separados da citação bíblica. A missão não substitui a aplicação da misericórdia na vida real, nem comprova por si só eficácia pedagógica. Revisão especializada e avaliação com alunos continuam necessárias.

## Controles e continuidade

- **Computador:** W, A, S, D ou setas para caminhar; Shift para correr quando estiver sozinho; E ou o botão de ação quando estiver perto; arrastar o cenário para orientar a câmera. Roda do mouse ou botões ajustam a distância; C ou o botão centraliza atrás do personagem.
- **Celular:** controle direcional por toque e botão de ação; arrastar a área do cenário com outro dedo para olhar ao redor. O passo rápido funciona enquanto seu botão estiver pressionado e o jogador estiver sozinho. Botões ajustam a câmera; a orientação pode ser expandida.
- **Cuidado:** segurar o controle visível, Espaço ou Enter acompanha cada gesto; soltar permite tentar novamente, sem prazo para concluir a missão.
- **Pausa:** permite consultar a passagem, escolher a qualidade gráfica, recomeçar ou sair do cenário. Escape fecha a consulta e devolve o foco aos controles.
- **Sem WebGL2 ou JavaScript:** a leitura da passagem permanece disponível e há ligação para a prática em duas dimensões.

A visita fica somente na memória da página. Sair do cenário libera os gráficos e permite retomar o ponto durante a mesma visita. Recomeçar explicitamente ou recarregar reinicia a experiência; não há salvamento automático em conta, banco, cookies ou armazenamento local. Câmera e microfone não são solicitados.

## Motor, recursos e orçamento

Three.js 0.187.0, MIT, renderiza a cena. O projeto implementa missão, colisões, câmera, controle e animação. Terreno, caminho, pessoas, animal, hospedaria, plantas e pedras são construídos pelo código. Seis texturas fotográficas de chão, pedra e madeira do Poly Haven, CC0, totalizam 1.321.172 bytes e acrescentam cor e relevo aos materiais. [Origem, licença e preparação](jogo3d-assets.md) estão documentadas. Não há download de um jogo comercial, modelo de IA ou pacote de personagens de terceiros para jogar.

O módulo do motor só é importado após escolher entrar. O renderizador limita a escala de resolução, oferece qualidade leve e ajusta o modo automático; elementos repetidos usam instâncias e a hospedaria reúne geometria para reduzir chamadas de desenho. O mundo pausa ao perder visibilidade e libera animação, observadores, eventos, geometrias, materiais, texturas e contexto WebGL ao sair. O código não realiza inferência paga ou requisição de gameplay a uma API.

Essas escolhas reduzem o trabalho por aparelho e evitam cobrança por token a cada jogador. Hospedagem e transferência de arquivos continuam tendo custos e limites. Emulação de tela de celular e medição em Chromium de teste não equivalem a um ensaio em telefones físicos de diversas capacidades; não há promessa de uma taxa de quadros universal.

A pesquisa e as licenças das ferramentas avaliadas estão em [jogo3d-ferramentas.md](jogo3d-ferramentas.md). TripoSR, TRELLIS e Hunyuan3D foram pesquisados, não executados ou incluídos na distribuição. O acervo existente e os recursos de IA opcionais do aplicativo mantêm suas condições próprias.
