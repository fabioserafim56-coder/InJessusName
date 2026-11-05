# Voz humana em português brasileiro

Estado verificado em **5 de novembro de 2026**: **nenhuma gravação humana foi adicionada** nesta etapa. O catálogo `src/content/human-narration/manifest.json` está vazio intencionalmente. As narrações Kokoro existentes são **sintéticas** e devem continuar identificadas assim. Uma licença de código aberto de um modelo não transforma sua saída em uma gravação humana.

## Fontes realmente verificadas

| Fonte | O que foi confirmado | Por que não foi importado áudio |
| --- | --- | --- |
| [Door43-Catalog/pt-br_obs, versão 3.2.3](https://git.door43.org/Door43-Catalog/pt-br_obs/releases/tag/v3.2.3) | O [manifesto](https://git.door43.org/Door43-Catalog/pt-br_obs/raw/commit/44ddf5c5086838472d123912c5a2e601fc0fdf2f/manifest.yaml) identifica `pt-br`, texto/Markdown e revisores da comunidade brasileira. A [licença](https://git.door43.org/Door43-Catalog/pt-br_obs/raw/commit/44ddf5c5086838472d123912c5a2e601fc0fdf2f/LICENSE.md) do reconto é CC BY-SA 4.0, permitindo uso comercial com suas condições. | O [media.yaml](https://git.door43.org/Door43-Catalog/pt-br_obs/raw/commit/44ddf5c5086838472d123912c5a2e601fc0fdf2f/media.yaml) lista PDF e página Door43; a publicação consultada tem somente um PDF anexado. Nenhuma gravação foi encontrada nessas fontes. A licença do texto, sozinha, não comprova a licença de uma gravação obtida em outro lugar. |
| [Catálogo oficial legado de OBS pt-br](https://cdn.door43.org/v2/ts/obs/pt-br/resources.json) | Identifica o mesmo texto 3.2.3 e aponta para sua fonte. O [repositório oficial no GitHub](https://github.com/unfoldingWord/obs-pt-br) também apresenta texto e imagens sob licenças abertas. | Nenhum arquivo de áudio ou crédito de narrador foi identificado nas entradas consultadas. Isso não prova que nenhuma gravação exista em outro acervo. |
| [LibriVox: Bíblia (ALM) 01: Gênesis, leitura de Leni](https://archive.org/details/biblia_alm_genesis_librivox) | Os [metadados do depósito da LibriVox](https://archive.org/metadata/biblia_alm_genesis_librivox) descrevem leitura por uma pessoa, texto Almeida de 1860, publicação em 2010 e `licenseurl` de domínio público. São leituras de capítulos, não o roteiro de histórias do aplicativo. | O depósito informa `por`, sem atestar português **brasileiro**. Não foi confirmada a situação internacional dos direitos conexos da gravação nem feita escuta humana neste ambiente. As páginas da LibriVox e de sua política retornaram HTTP 403. Uma etiqueta genérica de domínio público não resolve esses pontos. |

Não foram baixados áudios protegidos de YouVersion, Bible.is/BibleBrain ou Faith Comes By Hearing. Não foram clonadas vozes. Não houve ferramenta de escuta humana disponível nesta pesquisa; nenhum resultado foi descrito como ouvido, aprovado ou natural sem essa revisão.

O bloqueio é específico: falta um conjunto que reúna **gravação humana + variante brasileira demonstrada + direitos da gravação + texto correspondente + revisão de escuta**. Não se deve apresentar um player sem áudio nem substituir versículos da Bíblia Livre por uma leitura Almeida ou por uma paráfrase.

## Caminho viável sem cobrança de IA por ouvinte

Gravar os roteiros aprovados uma vez, com uma pessoa brasileira que autorize a publicação, produz MP3s estáticos que todos podem ouvir. Essa reprodução não exige token, chave de API, conta de IA ou execução de um modelo no aparelho. A hospedagem e a banda continuam tendo limites e custos: um arquivo de 1 MB reproduzido um milhão de vezes representa aproximadamente 1 TB de transferência. Usar arquivos compactos, cache/CDN e carregamento só após escolha do aluno evita downloads desnecessários.

Começar com **Criação**, **o bom samaritano** e **Jesus acalma a tempestade**, em faixas curtas por cena. Gravar o texto já revisado de cada cena, e registrar sua versão/hash, evita uma narração que conte algo diferente da tela. Os três roteiros podem ser gravados pela mesma pessoa, preservando a familiaridade da voz. A entrega pode ser cordial, brasileira, clara e serena, com pausas para contemplar; “sem sotaque” não é um critério verificável, pois toda voz possui características regionais.

1. **Aprovar o roteiro antes da gravação.** Separar citação literal (com edição/licença exatas) de reconto, aplicação e convite à oração. Não inventar falas de Deus ou de personagens para apresentá-las como Escritura. Para este catálogo, gravar somente **recontos bíblicos**, com referências visíveis.
2. **Obter autorização real do narrador.** A pessoa deve saber que sua voz será distribuída publicamente em um aplicativo que pode ser comercial. Definir crédito, edição, alcance da licença e remuneração, se houver. Guardar documentos pessoais e consentimentos assinados em arquivo privado. Nenhuma autorização para gravação deve ser interpretada como autorização para clonagem ou treinamento de modelos.
3. **Publicar os direitos do áudio e do texto separadamente.** Este catálogo aceita CC0 1.0, CC BY 4.0 ou CC BY-SA 4.0, com evidência publicada pelo titular. Um narrador contratado pode escolher uma dessas licenças por escrito; não presumir a cessão. Se o roteiro adaptar OBS, preservar a atribuição e cumprir o compartilhamento pela mesma licença da obra adaptada. As condições do roteiro e da gravação precisam ser compatíveis.
4. **Gravar e editar.** Usar ambiente silencioso e microfone próximo, preservar respirações naturais e evitar música sob palavras essenciais. Conservar o WAV original em arquivo de produção; distribuir MP3 mono de 64–96 kb/s após escuta em fone e alto-falante de celular. Evitar compressão/remoção de ruído que distorça a voz.
5. **Revisar por pessoas identificadas.** Um ouvinte brasileiro avalia clareza, acolhimento, pronúncia de nomes e volume. Um revisor bíblico confere cada frase com as passagens citadas. Conferir a transcrição ouvindo o arquivo final, e marcar início/fim de cada trecho real; não estimar tempos pela quantidade de palavras.
6. **Cadastrar e conferir o arquivo final.** Salvar o MP3 em `public/audio/human/`, preencher o manifesto e executar o validador abaixo. Só depois habilitar a apresentação “narração humana”. Uma alteração posterior no áudio muda o hash e exige rever a transcrição/alinhamento.

## Contrato para a integração futura

Cada item de `recordings` deve conter:

```json
{
  "id": "criacao-cena-1",
  "storyId": "criacao",
  "title": "A vida começa como dádiva",
  "voiceKind": "human-recording",
  "locale": "pt-BR",
  "localeEvidence": "Declaração publicada do narrador e revisão de escuta brasileira.",
  "narratorCredit": "Crédito autorizado pela pessoa que gravou",
  "sourceUrl": "https://dominio-do-projeto.example/creditos/criacao-cena-1",
  "src": "/audio/human/criacao-cena-1.mp3",
  "durationSeconds": 0,
  "bytes": 0,
  "sha256": "Preencher com o hash dos bytes finais; este exemplo não é publicável.",
  "audioRights": {
    "license": "CC-BY-4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "evidenceUrl": "https://dominio-do-projeto.example/creditos/criacao-cena-1",
    "attribution": "Crédito e termos autorizados do áudio"
  },
  "textRights": {
    "license": "CC-BY-4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "evidenceUrl": "https://dominio-do-projeto.example/creditos/roteiro-criacao-cena-1",
    "attribution": "Autor, versão e crédito do roteiro efetivamente lido"
  },
  "reviews": {
    "rights": { "reviewer": "", "date": "", "approved": false },
    "listening": { "reviewer": "", "date": "", "approved": false },
    "biblical": { "reviewer": "", "date": "", "approved": false },
    "transcriptAlignment": { "reviewer": "", "date": "", "approved": false }
  },
  "frames": [
    { "startSeconds": 0, "endSeconds": 0, "text": "Transcrição literal da gravação final.", "reference": "Gênesis 1:1–25" }
  ]
}
```

Este é um **exemplo incompleto**, sem direitos ou aprovações concedidos. Não foi inserido no manifesto real. URLs de exemplo, créditos e campos vazios precisam ser substituídos por evidências reais. A licença escolhida no exemplo não licencia automaticamente os roteiros existentes.

```sh
node scripts/human-narration/validate.mjs
node scripts/human-narration/validate.mjs --require-recordings
```

O primeiro comando confere os itens cadastrados e admite um catálogo vazio, deixando a ausência explícita. O segundo falha enquanto não houver gravação cadastrada. Ambos conferem os metadados obrigatórios, o arquivo local, tamanho, SHA-256 e intervalos da transcrição. O programa não ouve, não avalia fidelidade bíblica e não substitui a autorização do titular. Revisões identificadas são declarações humanas que precisam corresponder a trabalho realmente realizado.

A futura interface pode buscar por `storyId`, usar `<audio controls preload="none">`, apresentar “Reconto bíblico · voz humana em português brasileiro”, oferecer transcrição/créditos recolhíveis e manter o link para a passagem bíblica. Não tocar automaticamente. Em histórias sem gravação aprovada, simplesmente não mostrar a opção humana. O modo de leitura de versículos continua separado, respeitando a tradução que aparece na tela.
