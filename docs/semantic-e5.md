# Busca por sentido com multilingual E5

Esta integração produz representações numéricas reais com multilingual E5 small e compara consultas e leituras por similaridade de cosseno. Não substitui a busca literal da Bíblia nem produz respostas generativas. A interface convida a abrir a passagem e acompanhar seu contexto.

## Fontes e modelo efetivamente usados

- Modelo original: [intfloat/multilingual-e5-small](https://huggingface.co/intfloat/multilingual-e5-small), revisão `614241f622f53c4eeff9890bdc4f31cfecc418b3`; licença MIT declarada pelo repositório original, Microsoft. O card indica o uso de prefixos `query:` e `passage:`, média dos tokens e normalização L2.
- Conversão ONNX: [Xenova/multilingual-e5-small](https://huggingface.co/Xenova/multilingual-e5-small), revisão `761b726dd34fb83930e26aab4e9ac3899aa1fa78`. O card identifica expressamente o modelo intfloat como base; não declara licença adicional independente. O tokenizer tem os mesmos bytes documentados no original.
- Pesos q8: `onnx/model_quantized.onnx`, 118.308.185 bytes, SHA-256 `f80102d3f2a1229f387d3c81909990d8945513e347b0eab049f7de3c6f98c193`.
- Tokenizer: 17.082.730 bytes, SHA-256 `0b44a9d7b51c3c62626640cda0e2c2f70fdacdc25bbbd68038369d14ebdf4c39`.
- Runtime: Transformers.js 4.3.2, Apache-2.0, instalado pelo projeto. A geração usa ONNX Runtime no ambiente; a consulta usa WebAssembly num worker no navegador.

Os pesos ficam fora do repositório e da publicação. O navegador os solicita ao Hugging Face na revisão fixada somente quando a pessoa escolhe buscar por sentido. Modelo e tokenizer somam aproximadamente 135 MB; o motor de execução e os arquivos da busca representam transferência adicional. O navegador pode conservar os pesos no cache. O app não armazena consultas ou resultados, e a pergunta é processada localmente, sem envio a uma API de inferência.

## Acervo pesquisável

O gerador reúne 421 entradas editoriais ligadas a passagens da edição Bíblia Livre TR2018: 157 leituras dos 52 temas, 132 leituras dos 66 guias, 72 passagens das 24 etapas e 60 cenas das 15 histórias. Os 66 livros estão representados, mas isso não constitui pesquisa semântica integral nos 31.102 versículos. Uma mesma passagem pode ter mais de um contexto editorial; a apresentação elimina repetições do mesmo endereço.

Cada entrada conserva livro, capítulo, versículo inicial/final, referência, trecho original, contexto editorial, origem e ligação para a Bíblia. O texto bíblico é extraído sem reescrita. A redação do contexto é autoral e separada da citação. A atribuição da edição e a licença CC BY 3.0 Brasil acompanham as leituras.

O arquivo vetorial contém 421 × 384 números Float32 L2-normalizados. A proveniência pública registra hashes, contagens, modelo, configuração e a avaliação inicial. Scores são aproximações de sentido; não são probabilidade de resposta correta, autorização doutrinária ou medida da fé.

## Reprodução e verificação

1. Instale o projeto pelo lockfile. Baixe os arquivos de configuração/tokenizer e `onnx/model_quantized.onnx` da revisão fixada para `/tmp/injessus-e5-model` ou indique `INJESSUS_E5_MODEL_DIR`.
2. Confira os hashes acima. O script também exige os hashes antes da geração.
3. Execute `node scripts/build-semantic-index.mjs`. O script deriva novamente as referências dos arquivos reais, gera embeddings com prefixo `passage:`, média e normalização, grava `public/semantic/documents.json`, `vectors.f32`, `proveniencia.json` e `validacao.json`.
4. Execute `node --test tests/unit/semantic-index.test.mjs`. As verificações conferem bytes, vetores normalizados, citações exatas e cobertura declarada; não alteram a Bíblia nem simulam resultados.

As dez perguntas em português exercitam paráfrases de perdão, preocupações, pães, justiça, luto, batismo, oração, criação, tempestade e cuidado com quem foi ferido. A presença de um livro esperado entre seis resultados é apenas um teste inicial de recuperação. Não substitui julgamento especializado da relevância, avaliação com alunos ou revisão teológica humana. Os resultados concretos ficam em `public/semantic/validacao.json`.

Sem JavaScript ou sem suporte a WebAssembly, o link para busca literal continua disponível. Falha de download ou memória gera mensagem clara; a tela não apresenta correspondências lexicais como se tivessem sido calculadas pelo modelo.
