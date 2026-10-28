# Ferramentas abertas na renovação visual

Entrega em desenvolvimento em 28 de outubro de 2026. O README registra a validação final executada. Este documento distingue bibliotecas de interface, geração antecipada de áudio e modelos ainda não usados em execução com visitantes.

## Bibliotecas de interface

| Ferramenta fixada | Fonte | Licença | Função |
| --- | --- | --- | --- |
| Motion 14.7.1 | https://github.com/motiondivision/motion | MIT | Movimento em interações e etapas, com respeito à preferência por movimento reduzido e conteúdo inicial visível |
| StPageFlip (`page-flip`) 2.0.7 | https://github.com/Nodlik/StPageFlip | MIT | Capa e folhas do capítulo bíblico real; o leitor simples permanece disponível |
| Embla Carousel React 8.6.0 | https://github.com/davidjerleke/embla-carousel | MIT | Percurso por estudos com toque, teclado e controles, sem reprodução automática |
| Phosphor Icons React 2.1.10 | https://github.com/phosphor-icons/react | MIT | Família consistente de ícones para navegação e ações |
| canvas-confetti 1.9.4 | https://github.com/catdad/canvas-confetti | ISC | Celebração opcional ao encerrar um estudo, sem vincular pontuação a vida espiritual |

PhotoSwipe 5.4.4 e Fuse.js 7.5.0 continuam ampliando fotografias e facilitando buscas. A presença de dependências não prova a qualidade da experiência; a integração, teclado, movimento reduzido e legibilidade devem ser verificados no build final. Os avisos originais acompanham a distribuição em `THIRD_PARTY_NOTICES.md` e arquivos de licença.

## Hugging Face: uma narração realmente produzida

Foi gerada uma mensagem **autoral em português brasileiro**, usando Kokoro v1.0 e a voz `pm_alex`, com inferência em CPU no ambiente de trabalho. O app recebe somente MP3/WAV estáticos, com reprodução escolhida pela pessoa. Não baixa pesos no navegador e não envia orações, notas ou textos de visitantes para um serviço de voz.

O componente é `src/components/scripture-audio/welcome-narration.tsx`; a integração deve renderizá-lo uma única vez na página inicial. O player usa controles nativos, `preload="none"`, sem autoplay, e oferece a transcrição completa em um painel expansível. A interface identifica **voz sintética em português**. O áudio não representa a voz de um pastor real ou de Rodrigo Silva, nem se apresenta como leitura de uma tradução bíblica.

Arquivos:

- `public/audio/bem-vindo-kokoro-ptbr.mp3`: distribuição web, 305.900 bytes; aproximadamente 25,46 segundos, incluindo quadros de codificação MP3.
- `public/audio/bem-vindo-kokoro-ptbr.wav`: referência PCM16 mono, 24 kHz, 25,396 segundos.
- `public/audio/bem-vindo-proveniencia.json`: texto integral, revisões, arquivos, hashes, versões do runtime e limites de revisão.
- `public/audio/geracao-referencia.py`: script usado na geração, para consulta/reprodução no ambiente de trabalho. Modelos e ambiente Python são dependências de geração; não são necessários para servir o app Next.js.

### Fontes efetivamente lidas

1. [Card original do Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M/blob/f3ff3571791e39611d31c381e3a41a3af07b4987/README.md), revisão `f3ff3571791e39611d31c381e3a41a3af07b4987`: declara Apache-2.0 para o modelo e identifica sua arquitetura e usos.
2. [VOICES.md original](https://huggingface.co/hexgrad/Kokoro-82M/blob/f3ff3571791e39611d31c381e3a41a3af07b4987/VOICES.md): lista `pm_alex` em português brasileiro, o código `p` e espeak-ng `pt-br`. O SHA-256 completo do arquivo original `voices/pm_alex.pt` adquirido foi `cf0ba8c573c2480fc54123683a35cf1e2ae130428e441eb91f9149bdb188a526`, correspondente ao prefixo documentado pelo autor.
3. [Conversão ONNX da comunidade](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/tree/1939ad2a8e416c0acfeecc08a694d14ef25f2231), revisão `1939ad2a8e416c0acfeecc08a694d14ef25f2231`: card também declara Apache-2.0. Foram adquiridos `onnx/model_quantized.onnx` e `voices/pm_alex.bin` diretamente desse repositório. O tensor da voz foi comparado **byte a byte** com o storage do `.pt` original, lido como ZIP sem executar pickle, e corresponde integralmente.
4. [kokoro-onnx](https://github.com/thewh1teagle/kokoro-onnx), versão instalada 0.6.1, documentação, código de geração e licença MIT. O código oficial [hexgrad/kokoro](https://github.com/hexgrad/kokoro) declara Apache-2.0. Os textos de licença lidos foram preservados em `public/audio/KOKORO-APACHE-2.0.txt` e `public/audio/KOKORO-ONNX-MIT.txt`.

A indicação Apache é a declaração dos repositórios do modelo/conversão. Não foi inventada uma licença separada de pessoa ou estúdio para `pm_alex`; essa voz é um dos pesos listados no acervo original. Também não se transfere automaticamente a licença do modelo para o texto autoral ou o arquivo de áudio. O app não redistribui os pesos nem o runtime Python. A proveniência e o uso de uma voz sintética são identificados ao visitante.

### Geração e integridade

O ambiente isolado em `/tmp/injessus-kokoro-venv` recebeu `kokoro-onnx==0.6.1`, `onnxruntime==1.31.1`, `phonemizer==3.4.0`, `espeakng-loader==0.2.4`, `numpy==2.5.4` e `soundfile==0.14.0`. A fonemização usa a biblioteca espeak-ng fornecida pelo loader; o modelo faz a síntese. A geração usou CPU, duas threads de inferência, velocidade 0,91 e pausa de 0,42 s entre cinco trechos autorais. Eventos de telemetria do ONNX Runtime foram desativados no script antes de criar a sessão.

Os downloads mantiveram TLS e a origem HTTPS. Os hashes e tamanhos do modelo ONNX e da voz foram conferidos contra os ponteiros Git LFS retornados pelo próprio repositório na revisão fixada, com correspondência integral. O script de referência também exige esses hashes antes da inferência. Para reproduzir, criar o venv, instalar as versões acima, baixar os arquivos nas revisões indicadas e conferir seus hashes antes de usar o script:

| Arquivo | SHA-256 |
| --- | --- |
| `model_quantized.onnx` | `fbae9257e1e05ffc727e951ef9b9c98418e6d79f1c9b6b13bd59f5c9028a1478` |
| `pm_alex.bin` | `0175c753f59c54e7fd5a995bedef0c5ff2fb67e0043dd3dcb2ae74ec2acbeb2a` |
| `bem-vindo-kokoro-ptbr.wav` | `b48a2910adc166312ab7f5d3b50f4075049e406e40f0f05f8356b1614b23ca3c` |
| `bem-vindo-kokoro-ptbr.mp3` | `5bde969da98dc42d1308a50e537234837d4698fcc207944f555109de5d31b091` |

A conversão de entrega usou `ffmpeg -i bem-vindo-kokoro-ptbr.wav -codec:a libmp3lame -b:a 96k bem-vindo-kokoro-ptbr.mp3`. Checks técnicos confirmaram 609.504 amostras PCM válidas, sem NaN/infinito nem clipping, taxa correta, duração e codificação MP3 reconhecida por ffprobe. Isso **não equivale a escuta humana**: uma revisão de naturalidade, pronúncia e adequação pastoral permanece pendente. Nenhuma ferramenta de escuta/transcrição estava disponível nesta etapa; não foi registrado um selo fictício de revisão de áudio.

A expansão para narração de capítulos ou tutor de perguntas continua em avaliação. Esta entrega implementa uma mensagem fixa de boas-vindas, não uma Bíblia inteira narrada nem um tutor generativo.
