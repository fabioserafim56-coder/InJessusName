# Histórias bíblicas ilustradas

Implementação editorial de 28 de outubro de 2026. Esta área acrescenta **12 histórias autorais e 48 cenas**, com abertura da passagem correspondente, explicações de contexto, conexões narrativas, exemplos cotidianos e reflexão com feedback. Não se apresenta como um comentário de toda a Bíblia nem substitui os capítulos completos.

## Organização e método

A coleção segue um fio reconhecível: criação → violência e aliança no relato de Noé → promessa a Abraão → família de José e deslocamento ao Egito → Êxodo → acolhida em Rute → monarquia e responsabilidade em Davi → exílio e esperança em Daniel → nascimento e ensino de Jesus → cruz e ressurreição → Pentecostes e primeiras comunidades.

Cada história tem quatro cenas. Em cada uma, a pessoa encontra uma síntese de um trecho, uma pergunta de observação e um link para ler o capítulo com o versículo destacado. Depois das cenas, três seções distinguem contexto, conexão com outras leituras e uma possível aplicação cotidiana. Uma pergunta final oferece duas possibilidades acompanhadas de explicações; não atribui nota à fé, não exige testemunho pessoal e não armazena respostas.

Os links de continuação situam a história numa das 24 etapas do percurso. A galeria permite explorar sem seguir uma ordem obrigatória; a sequência é oferecida como ajuda para compreender relações, sem cadeados, urgência, recompensas obrigatórias ou progresso inventado.

## Texto e fontes

A fonte primária de cada cena é a passagem bíblica identificada no próprio cartão. `src/content/stories/index.ts` contém os identificadores de livro, capítulo e versículo utilizados pelos links. A edição aberta no leitor é Bíblia Livre TR 2018, com os créditos e a licença já apresentados pelo leitor. As narrativas desta área são **paráfrases editoriais autorais**, e não transcrições daquela tradução.

Distinções preservadas:

- narrativa bíblica, aplicação cotidiana e reconstrução histórica não são tratadas como equivalentes;
- os relatos do nascimento em Mateus e Lucas são identificados individualmente; não se inventam número de magos, aparência de personagens ou data natalina;
- cenas difíceis de violência, luto, poder e sacrifício não se tornam espetáculo nem autorização para abuso;
- os Evangelhos não são usados para atribuir culpa coletiva ao povo judeu;
- histórias de corte e visões apocalípticas de Daniel têm gêneros distintos;
- uma personagem bíblica não é declarada moralmente perfeita por estar presente no texto;
- tradições cristãs possuem interpretações distintas da criação, da ceia e de outros temas; a síntese não se declara pronunciamento oficial de uma igreja.

A revisão humana especializada de história, teologia e linguagem pastoral continua recomendada antes de apresentar a área como referência acadêmica ou catequese oficial.

## Imagens e interação

Doze ilustrações originais de alta resolução acompanham as doze histórias: nove composições narrativas próprias para Noé, Abraão, José, Rute, Davi, Daniel, o nascimento de Jesus, o bom samaritano e Pentecostes; as histórias da criação, do Êxodo e da cruz e ressurreição utilizam três das ilustrações ambientais originais da coleção inicial. Cada história mantém uma composição de referência ao longo de suas quatro cenas, com recortes; não se apresenta como filme ou quatro quadros diferentes. A arte não representa uma reconstrução exata das cenas nem documenta a aparência histórica de Jesus, Moisés ou outros personagens. Símbolos vetoriais decorativos e títulos reforçam o tema. A origem, os arquivos e os hashes estão em `/visuals/historias-proveniencia.json` (coleção ambiental inicial) e `/visuals/historias-narrativas-proveniencia.json` (nove composições narrativas). Os arquivos gerados foram copiados sem edição de pixels; as imagens são servidas pelo otimizador do Next.js com qualidade90 e dimensões responsivas.

As cenas têm navegação por botão, arraste e teclado, sem reprodução automática. A preferência por movimento reduzido torna os deslocamentos imediatos. Os quatro artigos estão presentes no HTML inicial: sem JavaScript, o contêiner conserva rolagem horizontal nativa e a reflexão pode ser lida em um `details` nativo. Links, títulos, texto e explicações não dependem das imagens.

A busca, a Bíblia, os estudos e as histórias são áreas complementares: uma síntese visual desperta perguntas, o leitor permite conferir o texto e o percurso ajuda a situar o que foi lido. A história do cristianismo depois do período apostólico direciona para a área de igrejas, onde são necessárias fontes históricas adicionais.
