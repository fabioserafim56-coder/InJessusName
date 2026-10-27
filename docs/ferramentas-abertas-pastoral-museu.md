# Ferramentas abertas para acolher, ensinar e explorar o mundo bíblico

Pesquisa: 27 de outubro de 2026. Foram consultados os repositórios oficiais, documentos de licença e metadados dos pacotes indicados abaixo. A escolha procura servir a uma experiência concreta: ler com atenção, encontrar uma peça, ampliar sua fotografia e ser acompanhado por uma linguagem cristã cuidadosa. Uma biblioteca ou modelo não fornece, por si, discernimento pastoral, veracidade histórica ou qualidade de ensino.

## Escolhas para esta entrega

**PhotoSwipe 5.4.4** e **Fuse.js 7.5.0** estão integrados e fixados nas dependências do projeto. `ExhibitImage` usa PhotoSwipe para abrir e ampliar a fotografia da peça; `MuseumGallery` e `CourseCatalog` usam Fuse para busca aproximada local, com acentos normalizados. Os testes de navegador exercitam imagens carregadas, busca com letra omitida, abertura, Escape e retorno do foco. Os resultados executados estão registrados no README.

| Ferramenta | Fonte e licença verificadas | Aplicação no projeto | Condições práticas |
| --- | --- | --- | --- |
| PhotoSwipe 5.4.4 | [Código da versão](https://github.com/dimsemenov/PhotoSwipe/tree/v5.4.4), [MIT](https://github.com/dimsemenov/PhotoSwipe/blob/v5.4.4/LICENSE). Tag `fd85184b450f451bc4aa2697f6d0a79304d13473` | Ampliar fotografias reais do museu, navegar por imagens e examinar detalhes sem sair da peça | Fotografias locais com dimensões corretas; crédito e procedência continuam disponíveis. A licença do visualizador não licencia a fotografia. Conferir teclado, foco, fechar e zoom no celular |
| Fuse.js 7.5.0 | [Código da versão](https://github.com/krisk/Fuse/tree/v7.5.0), [Apache 2.0](https://github.com/krisk/Fuse/blob/v7.5.0/LICENSE). Tag `2c34c70dbd2553dfdc241db16126d5d4ca9d6c51` | Busca local por título, época, lugar e assunto, tolerando pequenas diferenças na escrita | O README oficial descreve uma biblioteca sem dependências para busca aproximada em conjuntos pequenos e médios. Normalizar acentos, calibrar limiar com exemplos em português e mostrar os resultados como sugestões. Sem enviar consultas religiosas a um serviço externo |

Essas duas funções se complementam: a busca ajuda a chegar à peça e a ampliação permite observá-la. Os textos originais de licença e avisos de autoria acompanham a distribuição em `THIRD_PARTY_NOTICES.md` e `public/licenses/`. A atribuição da edição bíblica e os direitos de cada imagem são registros próprios.

## Outras ferramentas verificadas e quando elas fazem sentido

| Ferramenta | Versão e fonte oficial | Licença lida | Decisão de uso |
| --- | --- | --- | --- |
| OpenSeadragon | [6.1.1](https://github.com/openseadragon/openseadragon/tree/v6.1.1), tag `96bdae63fc78de7cfb0721480b4e0560e0ce6b96` | [BSD 3-Clause](https://github.com/openseadragon/openseadragon/blob/v6.1.1/LICENSE.txt) | Candidato para manuscritos, mosaicos e inscrições em imagens de resolução muito alta ou serviços IIIF. Reavaliar quando o acervo oferecer esse material; fotografias comuns já podem ser examinadas com PhotoSwipe |
| Leaflet | [1.9.4](https://github.com/Leaflet/Leaflet/tree/v1.9.4), tag `91900f7b177e6a926dfc3a75c86dc11fd4f2cf34` | [BSD 2-Clause](https://github.com/Leaflet/Leaflet/blob/v1.9.4/LICENSE) | Candidato para mapa de locais e percursos. A biblioteca não inclui autorização para consumir qualquer servidor de mapas. Escolher fonte cartográfica, atribuição, tráfego e política de tiles antes da integração; coordenadas aproximadas precisam ser identificadas |
| Embla Carousel | [8.6.0](https://github.com/davidjerleke/embla-carousel/tree/v8.6.0), tag `0fe65834136f1aa35e4c1a4a477e5ccb4bb5ee54` | [MIT](https://github.com/davidjerleke/embla-carousel/blob/v8.6.0/LICENSE) | Candidato para uma visita guiada com várias imagens ou estações. Adotar quando a sequência acrescentar contexto e conservar botões e leitura por teclado. O catálogo atual não precisa de um carrossel apenas decorativo |

Os metadados de versão/licença no registro npm foram conferidos com os documentos dos projetos. As ferramentas desta seção foram pesquisadas; não são anunciadas como já instaladas ou ativas no app.

## Modelos e narração em português

Aqui é necessário distinguir o programa que executa um modelo, seus pesos, as vozes e os dados de treinamento. Uma licença de código não libera automaticamente o conjunto inteiro.

### Kokoro: candidato para narração editorial

Fonte consultada: [repositório oficial hexgrad/kokoro](https://github.com/hexgrad/kokoro/tree/dfb907a02bba8152ca444717ca5d78747ccb4bec), commit `dfb907a02bba8152ca444717ca5d78747ccb4bec`. O `pyproject.toml` declara a versão **0.9.4**; o arquivo `LICENSE`, lido pelo Git, contém Apache 2.0. O [README consultado](https://github.com/hexgrad/kokoro/blob/dfb907a02bba8152ca444717ca5d78747ccb4bec/README.md) identifica o modelo **Kokoro-82M**, declara pesos Apache e inclui português brasileiro com o código de idioma `p`.

Aplicação possível: produzir uma narração institucional serena a partir de textos autorais já revisados, permitindo ouvir a leitura e pausar. O jeito de acompanhar nasce primeiro da escrita e da revisão; a voz sintética não deve ser apresentada como uma pessoa que participou da aula.

O autor aponta para [hexgrad/Kokoro-82M no Hugging Face](https://huggingface.co/hexgrad/Kokoro-82M). Nesta pesquisa, a documentação diretamente lida foi a do autor no GitHub; não foram baixados os pesos nem verificada uma execução local do modelo ou cada arquivo de voz. Antes de disponibilizar áudio, conferir o model card e a voz exata, fixar os artefatos e avaliar pronúncia de nomes bíblicos, pausas e português brasileiro. Uma primeira implantação pode gerar áudios revisados antecipadamente; não exige inferência em cada visita ao app.

Os 82 milhões de parâmetros informam uma característica do modelo, não o tamanho total de instalação ou a latência do serviço. Bibliotecas, fonemização, vozes e runtime também consomem recursos. Não foi prometida execução do modelo no ambiente serverless atual da Vercel.

### Piper: alternativa para leitura local

Fonte consultada: [OHF-Voice/piper1-gpl](https://github.com/OHF-Voice/piper1-gpl/tree/74ac24e7e8e2e57a5e1fada5505c74e3d9c1843a), commit `74ac24e7e8e2e57a5e1fada5505c74e3d9c1843a`. O arquivo `COPYING` contém **GPL versão 3**. O [documento de vozes](https://github.com/OHF-Voice/piper1-gpl/blob/74ac24e7e8e2e57a5e1fada5505c74e3d9c1843a/docs/VOICES.md) inclui português do Brasil e de Portugal e instrui conferir o `MODEL_CARD` individual: algumas vozes têm condições próprias.

Aplicação possível: leitor de textos com execução local ou em um serviço separado, após escolher uma voz com licença e qualidade adequadas. Não foram incorporados o motor, pesos ONNX ou vozes nesta entrega. A análise das obrigações de distribuição GPL e de cada voz é parte da escolha de arquitetura, não uma suposição de que todo o conjunto usa uma única licença.

### Qwen3: pesquisa para um futuro acompanhante de estudo

Fonte consultada: [QwenLM/Qwen3](https://github.com/QwenLM/Qwen3/tree/7a2f61ffc7a20d47efcd2bf97f6f2bf52729042e), commit `7a2f61ffc7a20d47efcd2bf97f6f2bf52729042e`. O README apresenta modelos densos a partir de **0.6B parâmetros**, capacidades multilíngues e declara, em “License Agreement”, que seus modelos de pesos abertos usam Apache 2.0; orienta localizar o arquivo de licença em cada repositório Hugging Face.

Essa é uma declaração verificada do autor sobre os pesos. O repositório consultado não continha um arquivo `LICENSE` na raiz; não se atribui automaticamente Apache 2.0 a todos os seus arquivos ou a qualquer derivação que use o nome Qwen. O card, a revisão e a licença do artefato exato precisam ser lidos antes de importar um modelo. Referência para essa próxima checagem: [Qwen/Qwen3-0.6B](https://huggingface.co/Qwen/Qwen3-0.6B).

Aplicação possível: ajudar a encontrar explicações em um acervo curado e responder com passagens e fontes rastreáveis. A qualidade em português e em questões bíblicas precisa de avaliação própria; pequeno tamanho e licença aberta não demonstram domínio das Escrituras. Um serviço de inferência, política de dados e avaliação de respostas seriam necessários. Nenhum peso, tutor generativo ou envio de oração e história pessoal a modelos foi integrado por esta pesquisa.

## Caminho de evolução

1. Entregar o museu com peças reais, documentação, fotografias autorizadas, busca e ampliação que funcionem no celular.
2. Consolidar a voz pastoral nos textos autorais e na forma de acolher dúvidas, com leitura humana bíblica e pedagógica. A pessoa deve sentir acompanhamento sem receber promessas inventadas ou ser avaliada espiritualmente pelo resultado de uma atividade.
3. Avaliar um pequeno conjunto de narrações em português, comparar compreensão e conforto e publicar somente as versões revisadas, com identificação adequada.
4. Prototipar um tutor restrito ao acervo curado, com fontes abertas e perspectiva identificada, se isso responder a uma necessidade observada. Medir respostas e limitações antes de abrir perguntas ilimitadas.

Rodrigo Silva foi indicado pelo usuário como uma referência para tornar a arqueologia bíblica próxima das pessoas. Esta pesquisa não consultou, reproduziu ou licenciou um curso, vídeo, voz ou acervo particular dele e não indica vínculo institucional. As peças do museu precisam de fontes arqueológicas e direitos próprios, registrados em `docs/fontes-museu.md`.

Não foram instalados nem executados os modelos de voz ou linguagem. A pesquisa amplia as possibilidades do projeto; as funções efetivamente entregues e validadas devem permanecer distintas das opções para uma próxima etapa.
