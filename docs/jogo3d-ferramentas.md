# Ferramentas para o jogo bíblico 3D

Pesquisa de fontes oficiais realizada em **5 de novembro de 2026**. A decisão desta etapa é usar **Three.js** para um cenário autoral controlável no navegador. O motor renderiza a cena; regras de movimento, interação, missão e ligação com a passagem são trabalho do aplicativo. Não há inferência paga necessária para jogar.

## O que cada ferramenta resolve

| Ferramenta e versão consultada | Licença conferida | Uso e decisão nesta etapa |
| --- | --- | --- |
| [Three.js 0.187.0](https://github.com/mrdoob/three.js) | [MIT](https://github.com/mrdoob/three.js/blob/master/LICENSE) | Selecionado para renderização 3D, câmera, iluminação, malhas e animação. Permite carregar o jogo por escolha, dentro da aplicação atual. A versão instalada deve permanecer fixada em `package.json` e no lockfile. |
| [Babylon.js Core 9.34.0](https://github.com/BabylonJS/Babylon.js) | [Apache-2.0](https://github.com/BabylonJS/Babylon.js/blob/master/license.md) | Motor completo alternativo, com ferramentas próprias de cena e interação. Pesquisado, não integrado a esta implementação. |
| [PlayCanvas 2.23.3](https://github.com/playcanvas/engine) | [MIT](https://github.com/playcanvas/engine/blob/main/LICENSE) | Alternativa de motor WebGL2/WebGPU. O motor aberto e a oferta comercial de editor/hospedagem são coisas distintas. Pesquisado, não integrado. |
| [Godot 4.7.2 estável](https://github.com/godotengine/godot/releases/tag/4.7.2-stable) | [MIT](https://github.com/godotengine/godot/blob/master/LICENSE.txt) | Pode exportar jogos para WebAssembly/WebGL2. Seria útil para uma produção com editor e pipeline próprios, mas exige integrar o pacote exportado, seu carregamento e suas opções de execução ao aplicativo. Pesquisado, não integrado. |
| [Emscripten](https://github.com/emscripten-core/emscripten) | MIT ou University of Illinois/NCSA, conforme o projeto | Compila código C/C++ para WebAssembly. É uma ferramenta de portabilidade de código compatível, não um conversor automático de qualquer jogo comercial em um jogo leve para celular. Pesquisado, não integrado. |
| [meshoptimizer / gltfpack](https://github.com/zeux/meshoptimizer) e [glTF Transform 4.5.1](https://github.com/donmccurdy/glTF-Transform) | MIT | Ferramentas possíveis de preparação de modelos: simplificação, organização de malhas e compressão. Só fazem parte de uma entrega quando realmente usadas sobre assets e acompanhadas de verificação visual. Não foram usadas para alegar uma redução que não foi medida. |

As versões acima vieram dos registros oficiais npm (`three`, `@babylonjs/core`, `playcanvas`, `@gltf-transform/cli`) e da versão estável publicada pelo Godot no momento da consulta. Não significam que todos esses pacotes foram instalados.

## Hugging Face: produzir um objeto não é executar um jogo

Os modelos abaixo geram ou reconstroem assets 3D. O resultado ainda precisa de inspeção, escala, orientação, colisões, materiais, animação quando necessária e orçamento de desempenho. Eles não fornecem, por si, as regras, os controles ou a fidelidade bíblica de um jogo.

| Modelo | Evidência oficial | Alcance e decisão |
| --- | --- | --- |
| [TripoSR](https://github.com/VAST-AI-Research/TripoSR), pesos [stabilityai/TripoSR](https://huggingface.co/stabilityai/TripoSR) | O README declara MIT para código, pesos e demo; a ficha dos pesos também informa MIT. Revisão conferida: `5b521936b01fbe1890f6f9baed0254ab6351c04a`. | Reconstrução de um objeto a partir de imagem. O README informa aproximadamente **6 GB de VRAM** na configuração padrão e mede velocidade em uma **NVIDIA A100**. Essa medida não demonstra inferência em um telefone. Candidato a produção antecipada de assets; não executado nem integrado nesta etapa. |
| [TRELLIS](https://github.com/microsoft/TRELLIS), pesos [microsoft/TRELLIS-image-large](https://huggingface.co/microsoft/TRELLIS-image-large) | A ficha informa MIT; o README declara que os modelos e a maior parte do código são MIT e identifica submódulos com outras licenças. Revisão dos pesos conferida: `25e0d31ffbebe4b5a97464dd851910efc3002d96`. | Produz representações como malhas e gaussianas. O pipeline oficial consultado exige GPU NVIDIA com **pelo menos 16 GB de memória**. Candidato a produção fora do aparelho do aluno; não executado nem incluído no jogo. Licenças dos submódulos precisam ser conferidas para o caminho usado. |
| [Hunyuan3D-2](https://github.com/Tencent-Hunyuan/Hunyuan3D-2), pesos [tencent/Hunyuan3D-2](https://huggingface.co/tencent/Hunyuan3D-2) | A ficha usa licença `other`, com nome `tencent-hunyuan-community`, e a [licença completa](https://github.com/Tencent-Hunyuan/Hunyuan3D-2/blob/main/LICENSE) contém condições próprias. Revisão dos pesos conferida: `9cd649ba6913f7a852e3286bad86bfa9a2d83dcf`. | Não escolhido para a distribuição mundial pretendida. A licença consultada exclui União Europeia, Reino Unido e Coreia do Sul e estende condições territoriais a outputs. Também contém termos comerciais adicionais ligados a mais de um milhão de usuários mensais, na condição de data de lançamento descrita no contrato. Não deve ser apresentado como equivalente a MIT ou como permissão comercial irrestrita. Não executado ou integrado. |

Uma demo pública do Hugging Face pode ter fila, limite de GPU, exigência de conta ou indisponibilidade. Não é infraestrutura gratuita garantida para cada aluno. Se um desses modelos vier a ser usado para produzir um objeto, o jogo deve receber o asset final otimizado e documentado, sem depender de gerar novamente esse objeto a cada visita.

## Por que não copiar ou portar um jogo pesado nesta etapa

Portabilidade, engenharia reversa, geração de assets e otimização são atividades distintas. Um port para WebAssembly exige código e dependências compatíveis; ter o motor aberto não dá automaticamente direito de redistribuir modelos, músicas, mapas e personagens de outro jogo. Mesmo um port autorizado continua limitado pela GPU, memória, rede e energia do aparelho. O objetivo aqui é construir a missão bíblica com um mundo próprio e um orçamento compatível com o navegador.

O [README oficial do Emscripten](https://github.com/emscripten-core/emscripten#readme) descreve compilação de C/C++ para WebAssembly. A [documentação oficial de exportação web do Godot](https://github.com/godotengine/godot-docs/blob/master/tutorials/export/exporting_for_web.rst) esclarece que o renderizador web usa WebGL2 no modo Compatibility, registra particularidades de celular e descreve isolamento entre origens para exportação com threads. Exportação de uma única thread também é uma opção documentada; não é necessário ativar esses cabeçalhos globais para a implementação direta com Three.js.

## Critérios para a implementação e sua verificação

- **Controle real:** deslocamento do personagem, câmera e interação por proximidade. Teclado e toque devem poder concluir a mesma missão.
- **Ensino pelas ações:** observar a necessidade, aproximar-se, cuidar e acompanhar a continuidade do cuidado, com ligação explícita à passagem. A missão não deve transformar compaixão em corrida por pontos de fé.
- **Separação editorial:** cenário e falas de orientação são interpretações do aplicativo, identificadas; o texto da edição bíblica permanece preservado na consulta. Um cenário 3D não constitui reconstrução arqueológica certificada.
- **Carregamento por escolha:** não carregar motor, modelos ou texturas do jogo ao abrir uma aula ou a Bíblia. Não realizar inferência generativa para cada jogador.
- **Orçamento gráfico:** limitar resolução efetiva, reutilizar geometrias e materiais, usar instâncias para elementos repetidos e evitar cadeias de pós-processamento custosas. O [manual de resolução do Three.js](https://github.com/mrdoob/three.js/blob/master/manual/pages/responsive.html) explica por que telas com alta densidade podem multiplicar excessivamente o trabalho da GPU; a [implementação de InstancedMesh](https://github.com/mrdoob/three.js/blob/master/src/objects/InstancedMesh.js) descreve a redução de draw calls.
- **Ciclo de vida:** pausar quando a cena estiver oculta, liberar animação, eventos, geometrias, materiais, texturas e renderizador ao sair. O [manual de limpeza](https://github.com/mrdoob/three.js/blob/master/manual/pages/cleanup.html) explica a liberação explícita de recursos gráficos.
- **Compatibilidade demonstrada:** o [WebGLRenderer consultado](https://github.com/mrdoob/three.js/blob/master/src/renderers/WebGLRenderer.js) usa WebGL2; WebGL1 não é suportado desde r163. Sem suporte, o aplicativo deve explicar o motivo e oferecer um caminho de estudo acessível. Emulação de tela pequena não prova fluidez em um telefone físico.
- **Medição:** registrar tamanho do carregamento, triângulos, draw calls, tempo de quadro e recuperação após sair/reabrir. Metas de desempenho devem ser distinguidas dos resultados realmente observados e do aparelho/navegador que os produziu. Não há promessa de 60 FPS em todos os celulares.

Para um eventual acervo externo, o [Kenney Nature Kit](https://kenney.nl/assets/nature-kit) declara **CC0**, e o [suporte do autor](https://kenney.nl/support) confirma uso comercial dos assets desse catálogo. Isso o torna um candidato possível a elementos naturais, sujeito à direção de arte e ao contexto da cena. A pesquisa não significa que esse pack foi incorporado: os arquivos efetivamente usados precisam ter origem, licença e transformações registradas.

Esta nota documenta pesquisa e decisão técnica. A implementação, seus assets reais e os resultados de testes devem ser apresentados a partir dos arquivos e medições da entrega, sem transformar ferramentas apenas pesquisadas em funcionalidades supostamente instaladas.
