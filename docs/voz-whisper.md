# Entrada por voz com Whisper

A experiência de voz é um componente reutilizável em `src/components/multimodal/voice-input.tsx`. O aluno pode gravar pelo microfone ou escolher um áudio curto, ouvir o arquivo, pedir a transcrição, corrigir as palavras e somente então levá-las à busca ou à atividade oral. Abrir a página ou selecionar um arquivo não inicia o modelo.

## Modelo e execução reais

- Modelo: [onnx-community/whisper-tiny](https://huggingface.co/onnx-community/whisper-tiny), revisão fixa `ff4177021cc41f7db950912b73ea4fdf7d01d8e7`.
- Origem: [OpenAI Whisper](https://github.com/openai/whisper), código e pesos sob MIT. Esta é a versão multilíngue, com português explicitamente selecionado; não usamos o modelo `.en`.
- Runtime: `@huggingface/transformers` 4.3.2, inferência quantizada q8 num Web Worker, backend ONNX WebAssembly com uma thread. Os módulos e binários WASM usados são distribuídos em `/models/runtime/` a partir da versão fixada pelo lockfile.
- O frontend pede os arquivos do modelo ao repositório público do Hugging Face somente ao preparar a voz ou transcrever por escolha do aluno. O navegador pode manter os arquivos do modelo no seu cache para próximos usos. Nenhum arquivo de gravação ou texto do aluno é colocado nesse cache.
- Os dois arquivos ONNX efetivamente usados são o encoder q8 de 10.124.990 bytes e o decoder merged q8 de 30.719.241 bytes. Tokenizador, configurações e runtime têm tamanhos adicionais. As origens e hashes dos arquivos quantizados estão em `src/lib/voice/model.ts`; o runtime não precisa baixar pesos para o servidor Next.js.

O processamento de voz ocorre no aparelho do aluno. Não se usa a API de reconhecimento de voz de um provedor de navegador, um endpoint de transcrição remoto ou uma gravação humana substituta apresentada como resultado de IA. Arquivos prontos da narração Kokoro são outro recurso, separado do reconhecimento Whisper.

## Limites e controle do aluno

São aceitos áudios de até 8 MB e aproximadamente 60 segundos. A decodificação usa a API nativa de áudio; os canais são combinados e reamostrados para PCM mono de 16 kHz, o formato esperado pelo Whisper. Arquivos vazios, formatos inadequados, amostras inválidas, silêncio e duração excedida produzem mensagens claras. A compatibilidade dos contêineres depende do navegador; MP3 e WAV são opções alternativas à gravação WebM/M4A.

O microfone é solicitado apenas por clique e exige HTTPS ou loopback local. Ao encerrar, cancelar ou sair da experiência, os tracks do microfone, timers, worker, preview e object URLs são liberados. O primeiro download ou a inferência podem demorar conforme conexão e aparelho; há progresso de preparação e opção de fechar durante o processamento.

A transcrição é editável e nunca é enviada automaticamente à busca. Nomes bíblicos, sotaques, ruído e silêncio podem produzir erros ou palavras que não foram ditas; a conferência não é apresentada como uma avaliação de fé ou santidade. O visitante pode continuar escrevendo quando o recurso não estiver disponível.

## Verificações realizadas

Os testes em `tests/unit/voice-audio.test.mjs` verificam a preservação de um tom conhecido de 1 kHz ao converter estéreo de 48 kHz para mono de 16 kHz; também verificam silêncio, valores inválidos, um minuto de duração, tipos e tamanhos de arquivo. Esses testes não substituem inferência real.

Uma inferência real com os arquivos oficiais q8 e o backend ONNX Runtime CPU foi executada sobre os 19,636 segundos da oração autoral Kokoro já distribuída no app. Os arquivos do encoder e decoder foram verificados por SHA-256 contra os metadados LFS da revisão fixada. O reconhecimento em português identificou “Senhor”, “Jesus”, “Palavra”, “fé” e “amor”. A taxa de erro de palavras dessa única amostra sintética foi cerca de 13%; por exemplo, “Amém” foi reconhecido como “amanhã”. Esse resultado reforça a necessidade da revisão editável e não representa precisão geral medida com estudantes ou gravações de microfone. A inicialização e inferência levaram cerca de 39 segundos nesse ambiente e não são uma previsão para celulares.

A evidência dessa execução fica no ambiente em `/tmp/injessus-whisper-real-inference-report.json`, com o texto completo produzido, referência e parâmetros. A conferência no navegador é registrada separadamente do teste nativo de CPU e da publicação externa.
