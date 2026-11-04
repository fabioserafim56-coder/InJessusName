# Observar, perguntar e conferir no museu

O componente `MuseumGuide` acrescenta uma visita visual às quatro peças do acervo: Merneptah, Mesa, Obelisco Negro e Pedra de Roseta. Cada peça tem três pontos de observação, uma pergunta com explicação editorial, fontes específicas e uma conexão com a Bíblia. Os pontos foram posicionados depois de inspecionar as quatro fotografias preservadas. Eles indicam áreas visíveis da composição; não pretendem localizar ou traduzir automaticamente palavras nas inscrições antigas.

## Experiência que funciona sem um modelo externo

- Escolher uma peça altera fotografia, pontos, explicações e referências.
- Tocar um marcador na imagem ou escolher seu equivalente textual abre a mesma observação.
- As perguntas editoriais revelam uma explicação associada àquele ponto. A interface identifica esse conteúdo como comentário editorial, sem chamá-lo de resposta de IA.
- Fontes, imagem original e ficha completa continuam acessíveis. A versão sem JavaScript oferece links para as quatro fichas.
- Os comentários preservam os limites já registrados no acervo: a menção a Israel não identifica o faraó do Êxodo; a recomposição da Estela de Mesa importa para sua leitura; o relevo assírio não é um retrato pessoal autenticado; a Pedra de Roseta tem uma ligação temática com o contexto egípcio, não é um objeto citado em Atos 7.

As fotografias são as mesmas reproduções históricas documentadas em `src/content/museum/exhibits.json`. Não foram geradas, restauradas, colorizadas ou ampliadas por IA. Os textos da visita são composições editoriais do projeto baseadas nas fichas e fontes existentes, não uma nova revisão arqueológica humana certificada.

## Perguntas livres com análise de imagem

A área também possui um formulário para análise visual de uma pergunta sobre a peça. Ele só fica disponível quando o servidor do aplicativo tem um provedor configurado. Sem essa configuração, a interface informa a indisponibilidade e mantém a visita documentada inteira funcional.

`GET /api/multimodal/vision` informa disponibilidade de configuração e identificação do provedor, sem expor endereço ou credencial nem fazer uma inferência. `POST` aceita somente `exhibitId` de uma das quatro peças e uma pergunta de até 500 caracteres. A rota confere origem, corpo JSON e peça; escolhe a fotografia no próprio servidor e acompanha a imagem com a ficha, referências e limites históricos. Não aceita uma URL, caminho de arquivo ou fotografia pessoal fornecidos pelo navegador. Antes do envio, a interface informa que pergunta, foto pública e contexto irão ao provedor selecionado. O aplicativo apresenta as fontes da ficha original; não usa URLs inventadas por um modelo como fontes verificadas.

O Next.js possui adaptadores HTTP diretos para OpenAI e Gemini. É preciso escolher `INJESSUS_VISION_PROVIDER=openai` ou `gemini` e configurar, somente no servidor, `OPENAI_API_KEY` ou `GEMINI_API_KEY`. As APIs têm condições comerciais e de dados próprias, sem alegação de modelo aberto ou execução de Qwen. Uma chave isolada não seleciona o provedor; configuração inválida não aciona outro provedor como alternativa automática. Os passos locais e na Vercel estão no [guia de configuração](configurar-visao.md).

O serviço privado opcional em `services/multimodal` oferece:

1. PaddleOCR em CPU para a área de câmera, com reconhecimento latino/português.
2. Qwen2.5-VL-7B-Instruct carregado sob demanda, ou adaptação para um provedor visual existente compatível com o formato OpenAI.

O frontend na Vercel não instala ou provisiona automaticamente essa infraestrutura. As variáveis privadas `INJESSUS_MULTIMODAL_SERVICE_URL` e `INJESSUS_MULTIMODAL_SERVICE_TOKEN` conectam o app ao serviço, selecionado por `INJESSUS_VISION_PROVIDER=qwen` ou pelo comportamento anterior quando essa variável está vazia. O guia de implantação, dependências fixadas, limites de imagem, autenticação, comandos e testes estão no [README do serviço](../services/multimodal/README.md). O registro de configuração não equivale a uma inferência já validada. Sem endpoint, autenticação e recursos adequados, esse caminho permanece indisponível. Uma resposta de outro modelo nunca é renomeada como Qwen.

O modelo responde em português e recebe a instrução de distinguir observação visual, documentação e incerteza. Essa orientação reduz extrapolações, mas não transforma geração automática em autenticação de um objeto. A resposta é identificada como assistida por IA e convida a conferir a ficha e as fontes.

## Fontes das ferramentas

- [Qwen2.5-VL-7B-Instruct](https://huggingface.co/Qwen/Qwen2.5-VL-7B-Instruct), card Apache-2.0: visão e texto para geração; não foi baixado nem executado como parte da criação do guia editorial.
- [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR), Apache-2.0: modelo de detecção e reconhecimento de texto. Uma execução real é registrada separadamente dos testes de transporte.
- [FastAPI](https://github.com/fastapi/fastapi), MIT, e [HTTPX](https://github.com/encode/httpx), BSD-3-Clause: serviço e adaptação HTTP privados.
- [OpenAI](https://developers.openai.com/api/docs/guides/images-vision) e [Gemini](https://ai.google.dev/gemini-api/docs/image-understanding): contratos das APIs comerciais de imagem e texto, sem pesos distribuídos pelo aplicativo.
- Fotografias e documentação: fichas e arquivos de proveniência do museu já incluídos no repositório.

Os testes de contrato do serviço verificam entradas e transporte com funções de modelo explicitamente substituídas; não são anunciados como avaliação de Qwen ou Paddle. Os registros de execução reais e da interface são informados ao responsável pela entrega depois de concluídos.
