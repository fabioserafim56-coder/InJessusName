# Serviço privado de análise multimodal

Este serviço opcional executa PaddleOCR para imagens de texto e pode executar Qwen2.5-VL para perguntas sobre imagens acompanhadas de uma ficha documental. A navegação, as quatro peças com pontos de observação e seus comentários editoriais funcionam no aplicativo sem ele. Não há saída de IA simulada quando o serviço não está configurado.

## O que é executado

- `POST /ocr`: arquivo multipart `image` (JPEG, PNG ou WebP, até 8 MB e 12 milhões de pixels). Usa `PaddleOCR`, português/modelo latino, detecção `PP-OCRv5_mobile_det` e reconhecimento `latin_PP-OCRv5_mobile_rec`. Responde `{text, lines: [{text, confidence}], provider: "paddleocr", language, model}`.
- `POST /vision`: JSON `{imageBase64, mimeType, question, context}`. A imagem é enviada em bytes; este serviço não recebe nem busca URLs de imagens. O aplicativo envia somente suas quatro peças conhecidas, com a documentação correspondente. Responde `{answer, model}`.
- `GET /health`: configuração e estado de carregamento, sem carregar modelos nem informar segredos. O indicador `enabled` representa uma configuração; não é prova de que um modelo já foi baixado ou executado.

PaddleOCR e Qwen carregam sob demanda. As fotografias recebidas não são gravadas pelo código do serviço. O parser multipart pode usar um arquivo temporário administrado pelo framework durante o envio; ele é encerrado ao concluir a requisição. Não há banco de fotografias, áudios ou perguntas. Um provedor externo configurado tem suas próprias condições de retenção, que precisam ser consideradas antes de ativá-lo.

## Executar OCR em CPU

Python 3.12. O arquivo `.env.example` contém apenas nomes e exemplos; forneça os valores reais fora do repositório.

```bash
python -m venv .venv
.venv/bin/pip install -r requirements.txt -r requirements-ocr.txt
export INJESSUS_MULTIMODAL_SERVICE_TOKEN='substitua-por-um-token-privado'
.venv/bin/uvicorn app:app --host 127.0.0.1 --port 8000 --workers 1 --no-access-log
```

O primeiro reconhecimento baixa os pesos dos dois modelos escolhidos. Para preparar o serviço antes de abri-lo ao aplicativo:

```bash
.venv/bin/python -c 'from app import paddle_engine; paddle_engine(); print("PaddleOCR preparado")'
```

`cpu_threads` usa dois núcleos por padrão. Uma análise de cada vez evita carregar vários trabalhos pesados simultaneamente; pedidos concorrentes recebem 429, em vez de uma fila ilimitada. O aplicativo pode usar o OCR local do navegador enquanto este serviço está indisponível.

## Qwen local ou provedor existente

O modelo padrão é `Qwen/Qwen2.5-VL-7B-Instruct`, revisão `cc594898137f460bfe9f0759e9844b3ce807cfb5`, com pesos declarados Apache-2.0. Ele é grande e não acompanha o repositório nem o navegador. A versão completa exige memória significativa para pesos, imagens e geração; a execução em CPU pode ultrapassar o tempo de resposta do app. Avalie um servidor de inferência adequado e prepare o modelo antes de ativá-lo publicamente.

Para uma instalação CPU de referência, instale o par compatível de PyTorch e torchvision e depois as dependências do modelo:

```bash
.venv/bin/pip install torch==2.7.1 torchvision==0.22.1 --index-url https://download.pytorch.org/whl/cpu
.venv/bin/pip install -r requirements-vision.txt
export INJESSUS_VISION_ENABLED=1
export INJESSUS_VISION_PROVIDER=qwen-local
export INJESSUS_VISION_MODEL=Qwen/Qwen2.5-VL-7B-Instruct
.venv/bin/python -c 'from app import qwen_engine; qwen_engine(); print("Modelo visual preparado")'
```

Para GPU, use a distribuição PyTorch/CUDA correspondente ao servidor. `INJESSUS_VISION_DEVICE=auto` escolhe CUDA quando disponível. O código usa `trust_remote_code=False`. Não baixa pesos na instalação base nem durante um simples health check.

Um serviço já existente que aceite entrada de imagem no formato OpenAI pode ser configurado com `INJESSUS_VISION_PROVIDER=openai-compatible`, `INJESSUS_VISION_BASE_URL` (base que termina, por exemplo, em `/v1`), `INJESSUS_VISION_API_KEY` e o identificador real em `INJESSUS_VISION_MODEL`. O serviço envia `POST /chat/completions`, limita resposta/tempo e retorna o nome de modelo informado pelo provedor; não renomeia uma resposta de outro modelo como Qwen. A conectividade com um fornecedor só pode ser validada depois que seus dados forem configurados.

## Conectar o aplicativo Next.js

No servidor do aplicativo, configure:

```text
INJESSUS_MULTIMODAL_SERVICE_URL=https://seu-servico.example
INJESSUS_MULTIMODAL_SERVICE_TOKEN=token-privado-igual-ao-do-servico
```

Essas variáveis nunca usam `NEXT_PUBLIC_`. O navegador acessa as rotas do próprio aplicativo. No museu, o servidor escolhe a imagem a partir de uma lista fixa de peças; o visitante não fornece um caminho ou URL. A pergunta tem até 500 caracteres e acompanha a ficha, seus limites e referências. As fontes exibidas pelo app vêm da ficha original, não de URLs inventadas na resposta.

O adaptador Next.js exige HTTPS e token para serviço remoto. HTTP é aceito somente em loopback para desenvolvimento. O backend também exige autenticação; sem token ele atende apenas o cliente loopback. Publique o serviço atrás de HTTPS, com controle de acesso e recursos compatíveis, mantendo o token privado. O frontend na Vercel não provisiona esse servidor automaticamente.

## Docker

```bash
docker build -t injessus-multimodal .
docker run --rm -p 127.0.0.1:8000:8000 --env-file /caminho/privado/multimodal.env injessus-multimodal
```

A imagem padrão instala o OCR. `--build-arg ENABLE_VISION=1` também prepara as bibliotecas do exemplo CPU; os pesos continuam sob demanda. O processo usa um usuário sem privilégios, um worker e não registra corpos de requisição. Não inclua segredos no build nem no Git.

## Verificações e proveniência

```bash
.venv/bin/python -m unittest discover -s tests -v
```

Os testes de contrato verificam autenticação, limites, entradas malformadas e transporte para uma função de modelo explicitamente substituída. Eles não são apresentados como inferência real. Uma execução real de PaddleOCR ou Qwen deve ser registrada separadamente com versões, modelos, entrada conhecida e saída obtida. A documentação de entrega informa o que foi efetivamente executado.

Fontes dos projetos:

- [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR), [PaddlePaddle](https://github.com/PaddlePaddle/Paddle): Apache-2.0.
- [Qwen2.5-VL-7B-Instruct](https://huggingface.co/Qwen/Qwen2.5-VL-7B-Instruct): card declara Apache-2.0; a revisão/modelo efetivamente implantado deve ser registrada pelo operador.
- [Transformers](https://github.com/huggingface/transformers): Apache-2.0.
- [FastAPI](https://github.com/fastapi/fastapi): MIT. [HTTPX](https://github.com/encode/httpx): BSD-3-Clause. As dependências instaladas preservam suas licenças próprias.

O contexto e a instrução de análise evitam tratar a fotografia como uma autenticação de inscrição, data ou acontecimento. A IA acompanha a observação; a comparação com documentos e a revisão humana continuam parte do trabalho histórico.
