# Estado da ampliação multimodal — 31/10/2026

Este registro descreve a implementação e as execuções locais da ampliação, separadas da publicação anterior `5a7acab`. O frontend público é hospedado na Vercel; ele não provisiona o serviço Python opcional nem confirma que um modelo externo esteja disponível. A implantação e a conferência desta ampliação no domínio público são etapas próprias.

## As seis experiências

`/explorar` tem entrada pela navegação do app, pelo início e por `/aprender`. O parâmetro `modo` abre cada experiência diretamente. A Bíblia, os estudos, as histórias e as fichas do museu continuam sendo os destinos para conferir texto, contexto e fontes.

| Experiência | Implementação e cobertura reais | Limite atual |
| --- | --- | --- |
| `ouvir` — Ler e ouvir | 49 versículos de seis passagens, 311,808 s de MP3s gerados antecipadamente por Kokoro/pm_alex; destaque e continuação por versículo. Integrada ao leitor e às histórias de criação, samaritano, multiplicação dos pães e tempestade | Seleção inicial, sem narração de toda a edição nem alinhamento palavra por palavra. Pronúncia e naturalidade aguardam escuta humana especializada |
| `perguntar` — Trazer minha pergunta | Escrita ou transcrição portuguesa editável por Whisper Tiny q8; recuperação por sentido com embeddings reais de multilingual E5 small q8, referências e texto bíblico verificável | 421 entradas selecionadas dos 66 livros, sem pesquisa semântica integral nos 31.102 versículos. Não gera resposta doutrinária ou mede probabilidade de uma interpretação correta |
| `camera` — Abrir pela câmera | Foto por câmera ou arquivo, reconhecimento português com Tesseract.js 7 no aparelho, correção e busca de referência/trecho na Bíblia do app | OCR pode trocar letras e números; correspondências precisam de conferência. PaddleOCR é uma alternativa separada que exige serviço privado |
| `contar` — Contar o que aprendi | Três práticas de recordação sobre o bom samaritano, os pães e o Salmo 23; voz ou escrita, leitura ao lado e três pontos de conferência por prática | Autoavaliação explícita, sem correção generativa, nota automática, gravação em conta ou prova de aprendizagem duradoura |
| `historias` — Caminhar na história | Cena 2D de João 6 com PixiJS 8.22.0, cinco momentos, personagem, referências, pergunta explicada, teclado e preferência por movimento reduzido; comparação estática de ampliação Swin2SR real | Cena artística interpretativa. Um recorte de 240×192 foi ampliado para 480×384; não é transformação de todas as imagens em 4K nem restauração histórica |
| `museu` — Olhar a história de perto | Quatro fotografias documentadas, 12 pontos de observação e perguntas com comentários editoriais; links às fichas e suas fontes. Adaptadores de análise visual para OpenAI, Gemini ou serviço privado Qwen | Perguntas livres requerem provedor explicitamente escolhido e chave privada, ou serviço privado válido. APIs comerciais não são modelos abertos nem prova de execução Qwen. Sem configuração, a interface informa indisponibilidade e oferece a visita editorial completa |

As passagens narradas são Salmo 23:1–6, Atos 17:10–12, João 6:1–15, Marcos 4:35–41, Lucas 10:25–37 e Gênesis 1:1–5. São 49 arquivos MP3, totalizando 3.757.964 bytes. O primeiro áudio depende de escolha; a continuação opcional pertence à sessão de escuta iniciada pela pessoa. O texto vem da Bíblia Livre TR, fevereiro de 2018, sem reescrita, com atribuição a Diego Santos, Mario Sérgio e Marco Teles e licença CC BY 3.0 Brasil.

O índice E5 reúne 157 leituras dos 52 temas, 132 dos 66 guias de livros, 72 passagens das 24 etapas e 60 cenas das 15 histórias. Cada uma das 421 entradas tem referência, contexto editorial separado da citação e 384 valores Float32 normalizados. Uma passagem pode aparecer em mais de um contexto; a interface elimina repetições do mesmo endereço. A busca literal continua cobrindo os 31.102 versículos.

## Modelos, downloads e armazenamento

Kokoro e Swin2SR foram executados antes da publicação em CPU. Seus pesos permanecem fora do repositório e da aplicação distribuída. O visitante recebe áudio e imagens estáticos com proveniência; não há geração de voz ou super-resolução de fotografias pessoais no frontend.

Whisper e E5 são executados em Web Workers com Transformers.js 4.3.2 e ONNX Runtime WebAssembly. O carregamento dos modelos públicos do Hugging Face começa por escolha explícita, sem exigir conta do visitante. O Whisper usa português e a revisão fixa `ff4177021cc41f7db950912b73ea4fdf7d01d8e7`; os arquivos ONNX q8 do encoder/decoder somam 40.844.231 bytes, além de tokenizer e configurações. O E5 usa `Xenova/multilingual-e5-small`, revisão `761b726dd34fb83930e26aab4e9ac3899aa1fa78`: pesos e tokenizer somam aproximadamente 135 MB, além dos arquivos da busca e do runtime. Conexão, memória e aparelho influenciam a preparação e o tempo de resposta.

O navegador pode conservar esses modelos no seu cache. O app não grava consultas, transcrições, gravações ou resultados nesse cache, em conta ou banco. Os quatro arquivos ESM/WASM em `/models/runtime/` somam aproximadamente 41,2 MB decimais; são arquivos do motor de execução, não pesos Whisper/E5. A licença Microsoft MIT, os avisos de terceiros, versões e hashes acompanham a distribuição.

O OCR local usa worker, três variantes compatíveis do core WebAssembly e `por.traineddata.gz` hospedados em `/ocr/`; o aparelho escolhe uma variante do core. O modelo de idioma vem de `tessdata_fast`, revisão `65727574dfcd264acbb0c3e07860e4e9e9b22185`, Apache-2.0. Esse dado treinado de OCR é um asset distribuído, distinto dos pesos maiores mantidos fora do repositório. Seu cache de modelos em IndexedDB foi desativado. Os assets começam a ser preparados quando a pessoa pede o reconhecimento.

## Consulta ao museu sem inferência paga

A visita também oferece consulta local às fichas com Fuse.js: recupera parágrafos documentados e suas fontes; não produz explicação generativa, não autentica uma imagem e deixa explícito quando não encontra um trecho. Essa consulta funciona independentemente da disponibilidade do endpoint visual.

## Dados em cada fluxo

- **Áudio narrado e cena:** arquivos estáticos; respostas da cena e escolhas da visita ficam em memória. A reprodução não necessita de gravação da pessoa.
- **Voz:** câmera e microfone não são pedidos ao abrir a página. O microfone exige gesto e HTTPS ou loopback; os áudios de até 8 MB/60 s são decodificados e reamostrados para PCM mono a 16 kHz no aparelho. A transcrição é revisável e só é transferida à pergunta ou à prática quando a pessoa confirma. Tracks, workers, timers e URLs de prévia são liberados ao cancelar ou sair.
- **Pergunta por sentido:** o texto é processado pelo E5 no navegador. Hugging Face fornece arquivos de modelo; a consulta não é enviada a uma API de inferência.
- **OCR local:** a fotografia fica no aparelho. Para localizar a passagem, somente o texto confirmado, até 4.000 caracteres, é enviado a `POST /api/multimodal/locate`, no próprio aplicativo, sem salvamento em conta ou banco.
- **OCR remoto opcional:** selecionar PaddleOCR e pedir o reconhecimento envia a foto ao serviço configurado, como informado antes da ação. A rota do app limita o envio a 4 MB; o serviço tem seus próprios limites. O processamento local continua disponível.
- **Museu com IA opcional:** somente uma das quatro peças conhecidas é aceita. O servidor escolhe sua imagem pública; pergunta de até 500 caracteres, imagem e ficha são enviadas ao provedor configurado (OpenAI, Gemini ou serviço privado). A interface informa esse envio antes da ação. O navegador não fornece URL arbitrária ou fotografia pessoal. As fontes mostradas são as da ficha, não referências inventadas pelo modelo.

O código do serviço Python não mantém banco de fotos ou perguntas nem grava esses corpos em logs. O processamento multipart pode usar um arquivo temporário administrado pelo framework durante a requisição. Um provedor externo configurado tem condições próprias; o app não pode prometer sua política de retenção. Nada nesta ampliação torna a Bíblia inteira, os modelos ou os recursos de conta disponíveis offline.

## Visão com OpenAI ou Gemini

O servidor Next.js pode chamar diretamente as APIs visuais da OpenAI ou do Gemini, sem instalar o serviço Python. Chamadas comerciais ficam desligadas por padrão. Sua ativação exige `INJESSUS_ENABLE_PAID_VISION=1`, além de `INJESSUS_VISION_PROVIDER=openai` ou `gemini` e a chave privada correspondente, `OPENAI_API_KEY` ou `GEMINI_API_KEY`. As substituições opcionais de modelo são `INJESSUS_OPENAI_VISION_MODEL` e `INJESSUS_GEMINI_VISION_MODEL`. Nenhuma dessas variáveis usa `NEXT_PUBLIC_`.

Uma chave presente não ativa um provedor automaticamente. Se a seleção explícita não estiver utilizável, o app informa indisponibilidade; não tenta outro provedor. Sem seleção explícita, o caminho anterior de serviço privado continua disponível quando sua URL e autenticação são válidas. `INJESSUS_VISION_PROVIDER=qwen` seleciona esse mesmo serviço, cujo modelo efetivamente retornado deve ser identificado na resposta. O GET de disponibilidade verifica configuração, sem pagar por uma inferência nem comprovar acesso ao modelo.

Essas APIs comerciais têm condições de acesso, cobrança e tratamento de dados próprias; não são distribuídas como modelos abertos e não substituem uma execução Qwen. A integração e seus testes de transporte não significam inferência paga validada ou ativação no domínio público. O [guia de configuração](configurar-visao.md) explica chaves novas, variáveis privadas na Vercel, redeploy e conferência.

## Serviço Python opcional

`services/multimodal` implementa FastAPI, autenticação, limites de entrada, carregamento sob demanda e os contratos `/health`, `/ocr` e `/vision`. O OCR usa PaddlePaddle 3.3.1/PaddleOCR 3.7.0 e `PP-OCRv5_mobile_det + latin_PP-OCRv5_mobile_rec`. A visão pode usar Qwen2.5-VL-7B-Instruct, revisão `cc594898137f460bfe9f0759e9844b3ce807cfb5`, ou um provedor que aceite imagem no formato OpenAI. O identificador retornado pelo provedor é preservado, sem renomear outro modelo como Qwen.

A conexão exige `INJESSUS_MULTIMODAL_SERVICE_URL` e, para destino remoto, `INJESSUS_MULTIMODAL_SERVICE_TOKEN`, apenas no servidor. HTTPS é obrigatório fora do loopback. Nenhuma dessas variáveis usa `NEXT_PUBLIC_`. O guia de instalação, Docker, dependências e comandos está no [README do serviço](../services/multimodal/README.md).

PaddleOCR foi executado de fato em CPU sobre uma imagem sintética de texto português. Qwen não foi baixado nem executado nesta entrega: o adaptador e o caminho de implantação existem, mas sua execução exige endpoint, autenticação e infraestrutura adequados. OpenAI/Gemini são alternativas independentes configuradas no Next.js. A presença de configuração ou um teste de transporte não comprova inferência de um modelo nem disponibilidade pública. Não há respostas de IA pré-fabricadas para esconder essa indisponibilidade.

## Evidência de execução

Os registros abaixo são evidências técnicas de escopo limitado. Arquivos em `/tmp` pertencem ao ambiente de validação e podem ser removidos; não são assets publicados nem links do aplicativo.

| Verificação executada | Evidência e alcance |
| --- | --- |
| Kokoro real | `public/audio/scripture/proveniencia.json`: revisões, texto de cada versículo, duração, bytes e SHA-256; 49 MP3s, 311,808 s. O script reproduz e verifica a coleção |
| Whisper real em CPU nativa | `/tmp/injessus-whisper-real-inference-report.json`: 19,636 s da oração sintética autoral reconhecidos em português; cerca de 13% de erro de palavras nessa única amostra. Não mede precisão geral em vozes de estudantes |
| Whisper real no navegador | `/tmp/injessus-voice-browser-report.json`: transcrição real pela interface em cerca de 58,6 s. A conferência posterior `/tmp/injessus-voice-pin-microphone-report.json` confirmou downloads nas revisões fixadas, prévia de gravação, parada do microfone, limpeza e ausência de erros; a entrada de microfone foi simulada com WAV Kokoro, sem alegar teste de hardware físico |
| Whisper real no navegador em 04/11 | `/tmp/injessus-whisper-browser-audit.json`: download normal do Hugging Face na revisão fixada e transcrição real do MP3 sintético de 3,37 s de Salmo 23:1, em cerca de 29 s no ambiente. Produziu “Salmo de Davi, o Senhor é meu pastor nada me faltará.”; edição e transferência exata à pergunta foram conferidas, com encerramento do único worker, sem erros de página, falhas de requisição ou envio do áudio a APIs. Não é teste de microfone físico nem medida geral de precisão |
| E5 real | `public/semantic/proveniencia.json` e `validacao.json`: 421 embeddings gerados em CPU; dez consultas portuguesas obtiveram um livro esperado nos seis primeiros resultados. Isso é um critério inicial de recuperação, não avaliação especializada da relevância nem eficácia pedagógica |
| Tesseract real no navegador | `/tmp/injessus-camera-qa/report.json`: reconheceu João 3:16 e Salmo 23 em imagens preparadas, em larguras 1440 e 320; nenhum asset OCR antes da escolha e nenhuma foto enviada. Não mede desempenho em todas as páginas impressas ou câmeras |
| PaddleOCR real em CPU | `/tmp/injessus-paddle-proof/report.json`: reconheceu exatamente “João 3:16”, “Deus amou o mundo.” e “Salmos 23:1” em 16,443 s, com as versões/modelos acima. Prova local separada da disponibilidade pública |
| Swin2SR real | `public/visuals/enhanced/swin2sr-proveniencia.json`: ONNX Runtime CPU 1.31.1, uma thread, recorte 240×192 → 480×384 e hashes de origem/saída. Não mede fidelidade de detalhes estimados |
| Contratos do serviço | Seis testes Python passaram na rodada inicial. Eles substituem explicitamente as funções de modelo; não contam como inferência Qwen/Paddle |
| Auditoria real em Chromium em 04/11 | `/tmp/injessus-multimodal-audit/report.json`: seis modos em 1440 e 390 px, sem download antecipado de modelos; cinco momentos PixiJS e 12 observações do museu nos dois tamanhos; MP3 até o fim; Tesseract reconheceu João 3:16 e o localizador retornou o versículo canônico; consulta E5 real sobre perdão, baixando a revisão fixada do Hugging Face, colocou Efésios 4:31–32 em primeiro lugar. Dez registros de auditoria, sem erros de página; são verificações adicionais, separadas da contagem da suíte Playwright |

## Consolidação de 04/11/2026

ESLint, TypeScript e 45 testes unitários passaram: 31 verificações de conteúdo, integridade e processamento local e 14 novos contratos dos provedores. Os contratos usam respostas substituídas explicitamente; verificam seleção, formato, autenticação, erros, limites e preservação do modelo retornado, sem inferência real OpenAI/Gemini. O build de produção passou. Após restringir a leitura de fotografias da rota visual ao diretório do museu, os 14 contratos foram repetidos com aprovação e o build final foi conferido novamente.

A execução completa de navegador aprovou 85 dos 86 cenários na primeira rodada. O caso restante, de uma imagem de história em desktop, ultrapassou a espera de cinco segundos. O trace registrou WebP válido com HTTP 200; a conferência em página nova decodificou a imagem sem erros, e o mesmo caso passou ao ser repetido sem alteração de código ou teste. Os 86 cenários distintos tiveram aprovação, sem casos pulados. Esse resultado registra uma repetição por tempo de carregamento; não representa 86 aprovações na primeira execução. A indisponibilidade dos serviços opcionais continua explícita por 503.

Não houve inferência paga com OpenAI/Gemini nem uso de chaves compartilhadas em chat. A ativação desses provedores exige configuração privada com chave nova e uma chamada real na implantação correspondente. Resultados históricos no README não substituem esta rodada; os testes locais e a configuração dos adaptadores não confirmam a publicação da ampliação ou sua ativação no domínio público.

## Fontes, direitos e revisão

As fontes e revisões detalhadas estão em [narração](narracao-multimodal.md), [voz Whisper](voz-whisper.md), [busca E5](semantic-e5.md), [PixiJS/Swin2SR](pixi-swin.md) e [museu multimodal](museu-multimodal.md). As licenças integrais e avisos aplicáveis estão em `public/licenses/`, `public/audio/`, `public/semantic/E5-MIT.txt`, `public/models/runtime/ONNXRUNTIME-LICENSE.txt` e `public/ocr/licenses/`, com atribuições em [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md). Conversões ONNX sem licença independente declarada são identificadas como conversões dos respectivos modelos de origem, sem inventar permissão adicional.

As fotografias do museu e da história das igrejas não foram ampliadas, restauradas ou reescritas por IA. O experimento Swin2SR usa apenas um recorte de arte interpretativa e estima pixels; não autentica detalhes. Licenças de software ou modelos não substituem os direitos próprios do texto bíblico, das imagens e da redação autoral.

Revisão teológica/arqueológica humana especializada, escuta dos áudios e avaliação com estudantes permanecem pendentes. Nenhuma interface atribui selo de revisão, precisão universal ou resultado espiritual a essas execuções técnicas.
