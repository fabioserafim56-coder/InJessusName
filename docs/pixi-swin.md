# Encontro visual em João 6 e ampliação artística

## PixiJS

`StoryWorld` apresenta cinco momentos de João 6:1–15, com passagens para conferir e uma pergunta com explicação. A caminhada do personagem acompanha a seleção de cada momento; não representa uma reconstrução do lugar, santidade, salvação nem uma técnica para produzir o sinal. A composição mantém o foco no cuidado e na identidade de Jesus e aponta para João 6:35.

A cena usa PixiJS 8.22.0 (MIT) somente depois de escolher “Entrar na história”. O cenário combina a ilustração autoral já distribuída no projeto, formas vetoriais e um personagem. O desenho raster original tem 1774×887 pixels; não se afirma resolução 4K. O renderer adapta sua área ao espaço disponível e limita a densidade a 2 para conter a memória em celulares.

Há um ticker privado da aplicação, iniciado quando o personagem/câmera se desloca e interrompido ao chegar ao destino. A preferência por movimento reduzido posiciona ambos imediatamente, sem caminhada animada. Fechar a cena destrói aplicação, canvas e ticker, desconecta o observador de tamanho e devolve o foco ao botão de entrada. O carregamento assíncrono protege o caso de fechar antes da inicialização terminar. A textura em cache pertence ao gerenciador de assets; a aplicação não destrói uma textura compartilhada por outra visita.

Controles HTML permitem avançar, voltar e escolher cada momento sem depender do clique no canvas. Os cinco relatos e seus links permanecem num painel nativo de texto, inclusive sem JavaScript. Se WebGL não estiver disponível, o app explica a indisponibilidade e mantém a leitura. O Canvas é uma experiência 2D; não é anunciado como jogo 3D.

Fontes: [PixiJS](https://github.com/pixijs/pixijs), sua documentação instalada em `node_modules/pixi.js/lib/app/Application.d.ts`, e o texto de João 6 recuperável na edição identificada do app. A história e a pergunta são redações autorais; os números de pães/peixes e as ligações ao capítulo seguem a narrativa bíblica.

## Swin2SR

O experimento usa um recorte de 240×192 pixels da arte interpretativa da multiplicação dos pães, ampliado para 480×384. Ele não processa fotografias documentais, pessoas visitantes ou inscrições arqueológicas. O modelo estima novos pixels, sem comprovar recuperação de detalhes que existiram historicamente.

- Modelo de origem: [caidas/swin2SR-classical-sr-x2-64](https://huggingface.co/caidas/swin2SR-classical-sr-x2-64), revisão `cee1c923c6a37361c6e5650b65dcf4be821e5d52`, Apache-2.0 conforme o card original.
- Conversão ONNX: [Xenova/swin2SR-classical-sr-x2-64](https://huggingface.co/Xenova/swin2SR-classical-sr-x2-64), revisão `93dfc9089abda257351d3a58d5771e2c1ff69442`. O README identifica o modelo de origem; não foi inventada uma licença independente da conversão.
- Arquivo de pesos: `onnx/model.onnx`, 54.428.699 bytes, SHA-256 `6dde3fe2440543ccae7c40d175609f83c18aeaa3d8456745c4329ef97ae744bd` conferido contra o registro Git LFS da revisão.
- Inferência: ONNX Runtime CPU, uma thread, RGB normalizado em [0,1], formato BCHW e padding refletido para janela de oito. A saída é limitada a [0,1] e codificada em PNG sem criar uma alegação de melhoria percentual.

Os scripts `scripts/enhance-illustrations.mjs` e `.py` exigem os hashes da fonte e do modelo antes da execução. Os pesos e o ambiente de inferência permanecem fora da aplicação publicada. O navegador recebe duas imagens estáticas e sua proveniência; nenhuma imagem do visitante é enviada a um modelo. Os detalhes da execução, duração, dimensões, bytes e hashes das duas imagens ficam em `public/visuals/enhanced/swin2sr-proveniencia.json` após a geração bem-sucedida.

Reprodução: preparar o modelo na pasta apontada por `INJESSUS_SWIN_MODEL_DIR` e um Python com NumPy/ONNX Runtime em `INJESSUS_SWIN_PYTHON`; executar `node scripts/enhance-illustrations.mjs`. O helper tem limite de 256 pixels por lado e não executa pickle. A licença do modelo não transfere automaticamente uma licença ao texto ou à arte autoral de origem.

## Estado de validação

A validação técnica de geração e da interface é registrada pela execução desta entrega. Uma imagem de maior dimensão, por si só, não demonstra fidelidade histórica ou melhor aprendizagem. A cena não altera gabaritos de outras aulas, não registra respostas em armazenamento persistente e não concede marcos espirituais.
