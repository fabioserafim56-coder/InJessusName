# Primeira edição bíblica do leitor

Verificação da fonte: 25 de outubro de 2026. Este documento descreve o acervo efetivamente incluído no código, sem atribuir revisão teológica humana a uma importação técnica.

## Edição e permissão

A primeira edição é **Bíblia Livre (BLIVRE), variante TR, versão 2018.2.0, fevereiro de 2018**, em português. O próprio [repositório do projeto](https://github.com/blivre/BibliaLivre) afirma conter os arquivos-fonte da tradução; seu [README da versão](https://github.com/blivre/BibliaLivre/blob/2018.2.0/README.md) identifica autores e licença da obra. Não se trata de inferir direitos do texto a partir de uma licença de software de terceiros.

O [texto integral da licença do projeto](https://github.com/blivre/BibliaLivre/blob/2018.2.0/LICENCA.md), copiado sem alterações em `src/content/bible/source/LICENCA.md`, é **Creative Commons Atribuição 3.0 Brasil**. Suas seções 3 e 4 permitem reprodução, distribuição e adaptações com atribuição, preservação do aviso de licença e identificação de mudanças. O identificador da licença é <https://creativecommons.org/licenses/by/3.0/br/>.

Créditos preservados: **Bíblia Livre (BLIVRE), Copyright © Diego Santos, Mario Sérgio e Marco Teles — fevereiro de 2018**, projeto <https://sites.google.com/site/biblialivre/>. O leitor identifica a versão, autores, licença e origem. O uso da obra não representa patrocínio ou apoio de seus autores ao InJessusName. A redação dos créditos sugerida pelo projeto e a lista de contribuidores estão copiadas em `source/README.md` e `source/Contribuidores.md`.

## Fonte preservada e transformação

Arquivo oficial: [`bliv-tr_vpl.zip`, release 2018.2.0](https://github.com/blivre/BibliaLivre/releases/download/2018.2.0/bliv-tr_vpl.zip). Tamanho: **1.275.470 bytes**. SHA-256:

```text
af8d9876919c4ca67195b8d8adcb9998a63f25ea4509750574ab6a7eedb9e2f1
```

O ZIP original está preservado em `src/content/bible/source/bliv-tr_vpl.zip`. Sua única entrada, `bliv-tr_vpl.txt`, tem **4.225.844 bytes** e um versículo por linha. Esse formato do próprio projeto omite notas e formatação editorial da edição; por isso o leitor não afirma conter suas notas de tradução ou um aparato crítico.

O tag `2018.2.0` aponta para o commit `a386942daee9984c654ebc8cea95ec9d3661b183`. Os três documentos de direitos/autoria preservados foram também comparados byte a byte com esse commit fixo. Evidência imutável de licença: <https://github.com/blivre/BibliaLivre/blob/a386942daee9984c654ebc8cea95ec9d3661b183/LICENCA.md>. SHA-256 do documento: `6ff396843c629e408e3dbad8b16653acbfed6448fe4011bbde4e13baaae706b7`.

O importador `scripts/import-bible.mjs` verifica o SHA-256 do arquivo antes de descompactá-lo em memória. Ele valida cada localizador, sequência, unicidade, texto não vazio, total de livros e presença dos capítulos. Converte apenas a estrutura VPL para JSON, nomes de livros para o seletor e códigos dos livros para USFM: por exemplo, `JOH` → `JHN`, `MAR` → `MRK`, `SOL` → `SNG`, `EZE` → `EZK`, `JOE` → `JOL`, `NAH` → `NAM`, `PHI` → `PHP`, `JAM` → `JAS`, `1JO`/`2JO`/`3JO` → `1JN`/`2JN`/`3JN`. Não normaliza versificação, não mistura variantes e não corrige a redação ou os colchetes dos tradutores.

Resultado: **66 livros, 1.189 capítulos e 31.102 versículos**. SHA-256 do JSON `blivre-tr-2018.json`:

```text
d9dc1ff27d9c4d5893accfc532c85c3c493d75d1e59b437d83a789c51e2eeaa0
```

É possível reproduzir a conversão, sem internet ou serviços externos, com:

```sh
node scripts/import-bible.mjs
node scripts/import-bible.mjs --check
```

O segundo comando compara todos os bytes gerados com o JSON incluído. Uma divergência interrompe a verificação; não é contornada alterando o checksum esperado. Atualizações da edição exigem nova verificação editorial e de direitos antes de trocar artefato ou checksum. A aplicação lê apenas o capítulo necessário no servidor e entrega esse capítulo ao navegador; não depende de uma API bíblica externa durante a leitura.

## Alcance e limites editoriais

- A edição tem os **66 livros do cânon protestante**. Não contém os deuterocanônicos nem representa, sozinha, todos os cânones cristãos. A arquitetura admite novas edições, mas elas não estão incluídas por isso.
- A variante TR é identificada pelo projeto como baseada no *Textus Receptus* no Novo Testamento. A variante N4 do mesmo projeto não foi incluída. Uma não é apresentada como se fosse a outra, nem como edição crítica BHS ou NA28.
- Os autores descrevem a tradução como **trabalho em andamento**. Usamos o release estável de fevereiro de 2018 em vez do arquivo de trabalho atual. Incluir o release inteiro não significa declarar cada tradução ou interpretação infalível, revisada pelo projeto InJessusName ou aprovada por uma denominação.
- A importação é uma verificação técnica de fidelidade e cobertura. Revisão humana bíblica, linguística, histórica e de adequação pedagógica permanece necessária para os comentários e aulas. A primeira aula deve continuar identificada como piloto educacional enquanto essa revisão estiver pendente.
- Outras traduções, conteúdos de editoras, áudios, vídeos, notas de estudo e mapas precisam de sua própria permissão. A licença desta obra não os autoriza.

As páginas eBible e um domínio de busca inicial foram bloqueados pela política de rede; não serviram como evidência de direitos nem foram usadas como origem. A verificação efetiva veio dos documentos e do release do próprio projeto BLIVRE no GitHub. O serviço `abibliadigital.com.br` não foi consultado ou incorporado.
