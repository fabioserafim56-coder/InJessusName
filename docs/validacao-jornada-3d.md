# Validação da jornada 3D — 06/11/2026

A entrega acrescenta a missão controlável `/jogos/caminho-da-compaixao` e suas entradas na página inicial e no catálogo. O código do jogo não usa inferência paga, câmera, microfone nem salvamento de gameplay. A tradução da Bíblia permanece intacta.

## Verificações executadas

- `npm run build`: compilação de produção concluída com a nova rota.
- `npm run lint` e `npm run typecheck`: passaram.
- `node --test tests/unit/*.test.mjs`: **63 testes passaram**, sem falhas ou omissões. Os sete novos testes da missão usam o reducer e a edição bíblica reais para conferir referências, proximidade, ordem, recursos, acompanhante, continuidade e reinício.
- `node scripts/verify-biblical-content.mjs`: **641 ocorrências / 421 referências estruturadas distintas**, quatro jogos, uma jornada 3D com seis objetivos e nenhum erro detectado. A validação técnica não equivale a revisão teológica humana ou estudo de eficácia pedagógica.
- Oito casos de navegador 3D passaram contra a compilação de produção, com um único worker: computador e tela de celular, entrada por escolha, contexto WebGL2 real, movimento, missão inteira, multitoque, pausa, texto bíblico, reinício, descarte do contexto, leitura sem JavaScript e navegador iniciado com WebGL desativado.
- Outros **16 casos de regressão passaram**, cobrindo os três jogos anteriores, entrada no primeiro estudo, navegação, consulta ao museu, manifesto e recuperação após desconexão.

Nenhum caso foi omitido. Movimento e missão foram exercitados pelos controles reais, sem API de teletransporte ou alteração do estado do jogador para obter conclusão. As seis etapas foram concluídas com teclado e com eventos de toque reais do protocolo do navegador. Na travessia completa foi selecionada a opção de qualidade Leve, disponível ao próprio usuário.

As capturas contínuas de framebuffer e os snapshots de DOM do trace foram desativados somente neste arquivo de testes 3D, pois o rasterizador de software e o protocolo de depuração provocavam atrasos que mantinham teclas pressionadas durante a instrumentação. O trace de chamadas e fontes, a captura em caso de falha e as verificações funcionais permanecem. Os comandos de entrada são enviados em pulsos limitados; o teste interrompe a travessia se o personagem deixar de avançar. Colisões e regras do jogo não foram removidas para atender aos testes.

## Orçamento e limites observados

Os testes conferem a presença de um contexto WebGL2 ativo e medições do próprio renderizador: chamadas de desenho positivas e até 200, entre 1.000 e 200.000 triângulos e escala de resolução limitada. Esses limites foram respeitados nas execuções verificadas. São medições e limites deste cenário, sem promessa de desempenho em todos os aparelhos.

O chunk compilado que contém o renderizador mediu **577.006 bytes**, ou **144.953 bytes comprimidos com gzip**. É uma medição de um artefato do build, não do tráfego total da página. A entrada precisa também da base do aplicativo e de seus demais arquivos. A cena usa geometria e materiais procedurais próprios; não há download de pesos de IA ou de um jogo comercial para jogar. A auditoria de rede confirmou que o código do motor não foi carregado antes de escolher entrar.

O ambiente de teste usa Chromium com renderização disponível nesta máquina; uma tela de celular emulada não representa ensaio em telefones físicos variados. A opção Leve limita a escala gráfica a 0,75, sem diminuir a nitidez dos textos e botões HTML. O modo automático adapta a resolução e as sombras. Experimentos com alunos e dispositivos reais continuam necessários.

A captura usada nas entradas do jogo vem do próprio cenário, com interface ocultada apenas para fotografar a tela. A proveniência registra dimensões, bytes e SHA-256 em `/games3d/proveniencia.json`. A licença MIT do Three.js foi comparada byte a byte com a instalada. A verificação da versão publicada é feita separadamente após o envio ao GitHub e a conclusão da Vercel.
