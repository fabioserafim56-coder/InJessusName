# Ouvir e acompanhar a Palavra

A primeira coleção de leitura sincronizada reúne **49 versículos em seis passagens**: Salmo 23:1–6, Atos 17:10–12, João 6:1–15, Marcos 4:35–41, Lucas 10:25–37 e Gênesis 1:1–5. É uma seleção inicial; a edição inteira ainda não possui gravações geradas por Kokoro. Histórias compatíveis oferecem uma entrada contextual para ouvir sua passagem bíblica.

Cada versículo tem um arquivo MP3 próprio. O player mantém o texto desse versículo em destaque e pode continuar para o próximo quando a reprodução termina. Não se anuncia alinhamento palavra por palavra. A pessoa pode pausar, repetir, selecionar outro versículo, desativar a continuação ou abrir o capítulo completo. O primeiro áudio não toca automaticamente; a continuidade acompanha uma sessão de escuta iniciada por escolha. O player nativo e o texto continuam disponíveis sem JavaScript; seleção e destaque interativo dependem de JavaScript.

## Texto, voz e fontes

O texto vem diretamente de `src/content/bible/blivre-tr-2018.json`, sem paráfrase ou revisão da tradução. A edição é Bíblia Livre TR, fevereiro de 2018, de Diego Santos, Mario Sérgio e Marco Teles, sob [CC BY 3.0 Brasil](https://creativecommons.org/licenses/by/3.0/br/). Fonte, autores e licença aparecem junto da leitura e na proveniência pública. Conversão do texto licenciado para uma gravação sintética é identificada como tal.

Foi usado o modelo aberto [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M), revisão `f3ff3571791e39611d31c381e3a41a3af07b4987`, e a [conversão ONNX](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX), revisão `1939ad2a8e416c0acfeecc08a694d14ef25f2231`, Apache-2.0. A voz é `pm_alex`, identificada pelo modelo como português brasileiro. A geração usa CPU, com duas threads, `kokoro-onnx 0.6.1` e `onnxruntime 1.31.1`, sem pesos ou runtime Python no navegador. As licenças anteriormente adquiridas permanecem em `public/audio/`.

O script `scripts/generate-scripture-narration.py` verifica SHA-256 do modelo, voz e vocabulário antes da inferência, gera cada versículo, confere a forma de onda e codifica MP3 de 96 kb/s. Os metadados incluem texto, referência, duração medida com ffprobe, tamanho e SHA-256 de cada MP3. O corpus original também tem checksum. `src/content/narration/recordings.json` e `/audio/scripture/proveniencia.json` contêm a mesma proveniência. Nenhuma gravação do visitante é necessária para a reprodução.

## Reprodução e conferência

No ambiente Python descrito em `docs/ferramentas-visuais-abertas.md`, com os arquivos nas revisões fixadas disponíveis em `INJESSUS_TTS_MODELS` (padrão `/tmp/injessus-kokoro-model`):

```bash
python scripts/generate-scripture-narration.py
python scripts/generate-scripture-narration.py --check
```

A geração retoma passagens completas cujos arquivos, hashes e textos continuem válidos. Não baixa nem executa pickle de terceiros e não altera a tradução. Modelos não ficam no repositório. O verificador exige todas as passagens declaradas e não aceita MP3s sem registro.

Os testes técnicos não substituem escuta humana. A revisão de pronúncia, nomes bíblicos, naturalidade e adequação pastoral permanece pendente e é identificada na interface. Não foi atribuído selo fictício de revisão, eficácia com alunos ou validação institucional.
