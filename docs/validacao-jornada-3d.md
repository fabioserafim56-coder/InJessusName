# Validação da jornada 3D ampliada — 06/11/2026

A ampliação de `/jogos/caminho-da-compaixao` acrescenta um mundo de 84 × 170 unidades, vale com ponte, hospedaria com interior acessível, três gestos sustentados de cuidado e três pontos de leitura opcionais. Os dois personagens atravessam juntos; o animal segue o trajeto percorrido, inclusive nas curvas. A câmera oferece aproximação, afastamento e centralização; o passo rápido está disponível quando sozinho. Sair do cenário libera os gráficos e permite retomar o ponto durante a mesma visita. Recarregar ou recomeçar reinicia a missão.

O jogo não realiza inferência paga, não usa câmera ou microfone e não salva gameplay em conta ou armazenamento local. A edição bíblica permanece intacta. Cenário, ponte, sequência de gestos e interior são adaptações artísticas da parábola, identificadas na interface. Os gestos não constituem instruções de atendimento médico.

## Verificações técnicas

- `npm run build`: compilação de produção concluída.
- `npm run lint` e `npm run typecheck`: passaram.
- `node --test tests/unit/*.test.mjs`: **71 testes passaram**, sem falhas ou omissões. Nove casos da missão verificam referências, proximidade, recursos, ordem dos gestos, acompanhante, travessia, continuidade, exploração opcional e reinício. Seis casos de navegação verificam paredes com porta, colisões, movimento sem atravessar sólidos, curvas e limite do rastro do acompanhante.
- `node scripts/verify-biblical-content.mjs`: **647 ocorrências / 424 referências estruturadas distintas**, incluindo os novos gestos e as leituras opcionais. São quatro jogos, seis objetivos na jornada, três gestos e três leituras opcionais. Os 66 livros, 1.189 capítulos e 31.102 versículos e o hash do ZIP de origem conferem.
- As seis texturas locais tiveram bytes, SHA-256 e dimensões conferidos; o texto legal CC0 também teve seu hash verificado. O total é **1.321.172 bytes** de mapas WebP. Origem, autores e transformações constam em `public/games3d/materials/proveniencia.json`.

As verificações automatizadas não equivalem a revisão teológica humana nem demonstram eficácia pedagógica. Os comentários editoriais continuam sujeitos à revisão especializada e a estudos com alunos.

## Navegador e limites

A missão inteira passou no computador e com eventos de toque, incluindo os três gestos, a ponte, a entrada real pela porta e a continuidade com o hospedeiro. Também passaram pausa, consulta aos treze versículos exatos, retomada em memória, liberação do contexto e leitura sem JavaScript/WebGL. Após liberar a aproximação do mirante, os dois casos de câmera, passo rápido e exploração opcional passaram. Os casos de entrada/carregamento também foram repetidos e passaram na compilação final. Assim, os dez casos distintos do arquivo 3D receberam resultado aprovado nas execuções da ampliação; não foram omitidos casos nem removidas colisões.

Os **16 casos de regressão passaram** na compilação final, cobrindo os três jogos anteriores, página inicial/primeira aula, navegação, fotografias e peças do museu, manifesto e recuperação após desconexão. Um erro de carregamento da nova imagem na página inicial foi corrigido antes da publicação; a imagem agora tem um nome próprio, sem parâmetros de consulta no `next/image`. A página inicial e a otimização da nova imagem retornaram HTTP 200.

Capturas adicionais em 390 × 844, 320 × 720 e 844 × 390 ficaram sem erros de página nem rolagem lateral. A orientação começa recolhida no celular; os ajustes da câmera ficaram separados do minimapa, inclusive na horizontal. Uma nova visita controlada ao interior confirmou a retirada da estrada, pedras pequenas e vegetação do piso da sala.

As entradas dos testes usam teclado e eventos de toque reais do protocolo do navegador. Não há API de teletransporte, remoção de colisões ou substituição do estado para obter conclusão. A travessia completa usa a opção Leve, disponível ao usuário. A nova rota de teste entra pela porta, chega ao lado do leito e contorna o mobiliário para chegar ao hospedeiro.

Capturas contínuas de framebuffer e snapshots de DOM do trace estão desativados somente nos testes 3D, pois o rasterizador de software e o protocolo de depuração provocavam atrasos durante teclas pressionadas. Trace de chamadas e fontes, captura de falha e verificações funcionais permanecem. Os pulsos de entrada são limitados, com verificação de avanço e interrupção se houver bloqueio. O orçamento maior do teste completo acompanha a estrada ampliada, os três gestos e a entrada na hospedaria.

O Chromium desta máquina usa rasterização de software. Emulação de uma tela de celular não equivale a ensaio em telefones físicos, e os resultados não prometem uma taxa de quadros universal. A opção Leve limita a escala gráfica a 0,75, preservando a definição dos textos e botões HTML; o modo automático adapta resolução e sombras.

Os materiais são servidos pelo aplicativo depois de entrar, sem CDN externa ou download de pesos de IA. Geometria e animação dos personagens são produzidas pelo código. Não foram integrados modelos humanos GLB ou os geradores TripoSR/TRELLIS apenas pesquisados.

## Artefatos medidos

O chunk que contém o renderizador mede **597.422 bytes**, ou **152.208 bytes com gzip**. Isso mede um artefato do build, não o tráfego total da página. As texturas somam mais 1.321.172 bytes de arquivos. A captura de apresentação vem do próprio mundo antes da ponte, em qualidade Detalhada; sua interface foi ocultada apenas para fotografar a tela. O PNG tem 1440 × 912 pixels e 1.048.377 bytes, com SHA-256 em `public/games3d/proveniencia.json`. A prévia anterior permanece disponível para compatibilidade; as entradas do app usam a nova imagem.

A auditoria de conteúdo verifica também integridade e dimensões da captura. A licença MIT do Three.js corresponde byte a byte à instalada. A conferência da publicação deve comparar a versão e os arquivos servidos, além dos testes locais de produção.
