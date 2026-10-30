import { miracleStories } from "./miracle-stories";

export type StoryReference = Readonly<{ label: string; book: string; chapter: number; verse?: number }>;
export type StoryScene = Readonly<{ title: string; text: string; observe: string; reference: StoryReference }>;
export type BiblicalStory = Readonly<{
  id: string; title: string; subtitle: string; era: string; theme: string;
  art: "creation" | "exodus" | "galilee" | "hope"; image?: string; symbol: "sprout" | "water" | "star" | "road";
  introduction: string; context: string; connection: string; example: string;
  scenes: readonly StoryScene[];
  question: Readonly<{ prompt: string; options: readonly Readonly<{ text: string; feedback: string }>[] }>;
  nextReading: StoryReference;
}>;

const ref = (label: string, book: string, chapter: number, verse?: number): StoryReference => ({ label, book, chapter, ...(verse ? { verse } : {}) });
export function storyBibleUrl(reference: StoryReference) {
  return `/biblia?livro=${reference.book}&capitulo=${reference.chapter}${reference.verse ? `&versiculo=${reference.verse}#versiculo-${reference.verse}` : ""}`;
}

export const biblicalStories: readonly BiblicalStory[] = [
  {
    id: "criacao", title: "Um mundo recebido como presente", subtitle: "Criação, dignidade e cuidado", era: "As origens · Gênesis 1–3", theme: "Criação", art: "creation", symbol: "sprout",
    introduction: "Antes de perguntar o que precisamos fazer, a Bíblia nos convida a olhar para o que recebemos: a vida, o mundo e o outro. Vamos começar com admiração e com a Palavra aberta.",
    context: "Gênesis abre a Torá e a Bíblia cristã. Seus primeiros capítulos apresentam Deus, a criação e a condição humana. Cristãos interpretam de maneiras diferentes a relação desses relatos com a cronologia e as ciências; aqui acompanhamos os temas e a sequência do próprio texto.",
    connection: "A bondade da criação dá sentido ao drama que vem depois: relações feridas, responsabilidade e a busca por reconciliação. A história de Noé retoma a criação em meio à violência humana.",
    example: "Cuidar de uma pessoa idosa, repartir alimento e preservar a água são maneiras concretas de levar a sério uma vida que não tratamos como descartável. Essas aplicações nascem do tema do cuidado; não substituem a leitura do capítulo.",
    scenes: [
      { title: "A vida começa como dádiva", text: "Gênesis apresenta Deus criando e ordenando o mundo. A repetição da bondade da criação nos ensina a olhar para a existência com gratidão, antes de pensar em posse ou utilidade.", observe: "Observe as repetições e o movimento entre criar, distinguir e nomear. O que o narrador chama de bom?", reference: ref("Gênesis 1:1–25", "GEN", 1, 1) },
      { title: "O outro tem dignidade", text: "O relato apresenta a humanidade como imagem de Deus. Mulher e homem recebem uma dignidade que não depende de riqueza, força ou reconhecimento; o cuidado com o mundo aparece como responsabilidade compartilhada.", observe: "Leia a passagem inteira: a dignidade humana e a responsabilidade aparecem juntas.", reference: ref("Gênesis 1:26–31", "GEN", 1, 26) },
      { title: "Cultivar, guardar e descansar", text: "O descanso marca o relato da criação. No jardim, o ser humano recebe uma tarefa de cultivo e guarda. Trabalho e limite pertencem à mesma história: nem o mundo nem as pessoas existem para exploração sem medida.", observe: "Compare o descanso em Gênesis 2:1–3 com a tarefa recebida em 2:15.", reference: ref("Gênesis 2:1–17", "GEN", 2, 1) },
      { title: "Quando a confiança se rompe", text: "Em Gênesis 3, a desobediência é seguida por medo, acusações e afastamento. A narrativa não termina a história da humanidade ali; ela abre as perguntas sobre o mal, a responsabilidade e a necessidade de restauração.", observe: "Perceba o que muda na relação com Deus, com o outro e com a terra. Não reduza o relato a culpar um grupo de pessoas.", reference: ref("Gênesis 3", "GEN", 3, 1) }
    ],
    question: { prompt: "Como a dignidade apresentada em Gênesis pode aparecer numa atitude de hoje?", options: [
      { text: "Escutar e cuidar de alguém que costuma ser ignorado.", feedback: "Essa é uma aplicação coerente: se a dignidade é recebida de Deus, o valor de uma pessoa não depende de sua posição social. Volte a Gênesis 1:26–28 e procure a relação entre dignidade e responsabilidade." },
      { text: "Tratar o mundo apenas como algo que posso consumir.", feedback: "Vale voltar ao texto com calma. Gênesis 2:15 reúne cultivar e guardar. A tarefa humana envolve cuidado e responsabilidade, e não autorização para desprezar a vida." }
    ] }, nextReading: ref("Salmo 8", "PSA", 8, 1)
  },
  {
    id: "noe", image: "/visuals/story-noe.png", title: "Uma aliança depois da tempestade", subtitle: "Noé, violência e recomeço", era: "As origens · Gênesis 6–9", theme: "Aliança", art: "creation", symbol: "water",
    introduction: "Esta não é apenas uma história de animais e de um barco. O relato de Noé nos pede que encaremos a violência humana, a seriedade do juízo e a esperança de um recomeço.",
    context: "O dilúvio pertence às narrativas das origens em Gênesis. Sua leitura exige atenção à violência e à perda de vidas; não transformamos o sofrimento em brincadeira nem apresentamos uma ilustração como evidência arqueológica do acontecimento.",
    connection: "As águas e a terra reaparecem como numa retomada da criação. A aliança com Noé prepara a leitura das alianças posteriores, especialmente a promessa a Abraão.",
    example: "Depois de um conflito, recomeçar pede mais do que esquecer o ocorrido: é preciso reconhecer o dano, proteger quem foi ferido e assumir compromissos concretos. Isso ajuda a perceber a diferença entre um sinal bonito e uma aliança com responsabilidade.",
    scenes: [
      { title: "O texto começa com a violência", text: "Antes da arca, Gênesis descreve uma terra marcada pela corrupção e pela violência. O problema central não é uma aventura no mar: é o que seres humanos estão fazendo uns aos outros.", observe: "Leia o diagnóstico de Gênesis 6 antes de olhar para os animais ou para a embarcação.", reference: ref("Gênesis 6:5–13", "GEN", 6, 5) },
      { title: "Preparar-se e guardar a vida", text: "Noé recebe a tarefa de construir a arca, e o relato reúne sua família e seres vivos. A narrativa relaciona obediência, preservação e a gravidade do que está por vir.", observe: "Observe o cuidado com a continuidade da vida e evite acrescentar ao relato medidas ou cenas que o texto não descreve.", reference: ref("Gênesis 6:14–22", "GEN", 6, 14) },
      { title: "Esperar pela terra", text: "As águas não desaparecem de imediato. O relato acompanha espera, sinais e a saída da arca. O recomeço tem um tempo que Noé não controla completamente.", observe: "Veja a sequência das aves e os intervalos da espera, sem transformá-los numa regra para toda experiência pessoal.", reference: ref("Gênesis 8", "GEN", 8, 1) },
      { title: "O sinal e o compromisso", text: "A aliança de Gênesis 9 inclui Noé, seus descendentes e seres vivos. O arco é apresentado como sinal dessa aliança; a proteção da vida humana também aparece no capítulo.", observe: "Pergunte quem está incluído na aliança. Leia o sinal junto com o compromisso, não como um objeto isolado.", reference: ref("Gênesis 9:1–17", "GEN", 9, 1) }
    ], question: { prompt: "O que ajuda a compreender o arco na narrativa de Noé?", options: [
      { text: "Lê-lo como sinal ligado à aliança e ao valor da vida.", feedback: "Isso acompanha Gênesis 9: o sinal tem sentido porque está unido a uma promessa e a uma relação. Repare que a aliança é apresentada com alcance mais amplo do que uma única família." },
      { text: "Separá-lo de tudo que aconteceu e ficar só com a imagem.", feedback: "A imagem pode despertar interesse, mas o contexto é essencial. O relato fala de violência, juízo, preservação e aliança. A beleza do sinal não apaga a seriedade da história." }
    ] }, nextReading: ref("Gênesis 12:1–9", "GEN", 12, 1)
  },
  {
    id: "abraao", image: "/visuals/story-abraao.png", title: "Uma promessa que põe a caminho", subtitle: "Abraão, Sara e a confiança aprendida", era: "Os patriarcas · Gênesis 12–22", theme: "Promessa", art: "exodus", symbol: "star",
    introduction: "A caminhada de Abraão e Sara não é uma linha sem perguntas. Há partida, espera, fragilidade e promessa. Vamos acompanhar o texto sem esconder as dificuldades de seus personagens.",
    context: "Gênesis 12 inicia o ciclo de Abraão. Sua família está ligada às narrativas posteriores de Israel. Abraão também tem lugar importante no judaísmo e no islamismo; este percurso acompanha o texto de Gênesis e sua leitura cristã, sem confundir essas tradições.",
    connection: "A promessa de bênção às famílias da terra amplia o horizonte da história. A família de Abraão conduz o leitor a Isaque, Jacó e José; o caminho até o Egito prepara o Êxodo.",
    example: "Esperar uma resposta importante pode revelar ansiedade e desejo de controlar tudo. A história convida a conversar sobre confiança e responsabilidade, sem prometer que toda pessoa terá o mesmo desfecho de Abraão e Sara.",
    scenes: [
      { title: "Partir sem possuir tudo", text: "Abrão é chamado a deixar sua terra e recebe uma promessa de bênção. A partida inicia uma caminhada de confiança, mas não transforma cada decisão do personagem em modelo perfeito.", observe: "Procure no texto quem deverá ser alcançado pela bênção. A promessa não se encerra no benefício de um só homem.", reference: ref("Gênesis 12:1–9", "GEN", 12, 1) },
      { title: "Há espaço para perguntar", text: "Em Gênesis 15, Abrão apresenta a questão de sua descendência. O texto relaciona promessa e fé no interior de uma conversa marcada por espera e incerteza.", observe: "Note a pergunta do personagem antes da resposta. A narrativa não retrata confiança como ausência de toda pergunta.", reference: ref("Gênesis 15:1–6", "GEN", 15, 1) },
      { title: "Sara também está na história", text: "A promessa alcança Abraão e Sara em sua velhice. Os capítulos preservam reações humanas e tensões familiares; conhecer a história inclui prestar atenção às mulheres e às pessoas vulneráveis que ela menciona.", observe: "Leia Gênesis 18 e 21 com atenção a Sara. Não apague a dor de Agar e Ismael do contexto mais amplo.", reference: ref("Gênesis 18:1–15", "GEN", 18, 1) },
      { title: "A vida de Isaque é preservada", text: "Gênesis 22 apresenta uma prova extrema e difícil. A narrativa interrompe o sacrifício de Isaque e apresenta uma provisão. Sua leitura exige cuidado: não autoriza violência, abuso ou a obediência a pessoas que peçam dano.", observe: "Mantenha a atenção no movimento completo do relato e na interrupção do sacrifício, sem romantizar o medo ou a violência.", reference: ref("Gênesis 22:1–19", "GEN", 22, 1) }
    ], question: { prompt: "Como acompanhar os personagens de Gênesis sem perder o discernimento?", options: [
      { text: "Observar sua confiança e também suas falhas, lendo o relato inteiro.", feedback: "Esse cuidado permite aprender com a narrativa sem declarar perfeito tudo que uma personagem faz. A Bíblia também registra conflitos e consequências que pedem reflexão." },
      { text: "Repetir qualquer ato de Abraão porque ele aparece na Bíblia.", feedback: "Registrar um ato não é necessariamente recomendá-lo. Gênesis 22 deve ser lido em seu próprio contexto e nunca usado para justificar violência ou controle sobre outra pessoa." }
    ] }, nextReading: ref("Gênesis 21:1–7", "GEN", 21, 1)
  },
  {
    id: "jose", image: "/visuals/story-jose.png", title: "Quando uma família precisa de reconciliação", subtitle: "José, sofrimento e responsabilidade", era: "Da família ao Egito · Gênesis 37–50", theme: "Reconciliação", art: "exodus", symbol: "road",
    introduction: "José atravessa rejeição, escravidão, injustiça e responsabilidade pública. Sua história oferece esperança sem dizer que o mal sofrido foi pequeno ou que toda dor terá uma recompensa material.",
    context: "O ciclo de José encerra Gênesis e explica, dentro da narrativa, como a família de Jacó chegou ao Egito. O protagonista não é uma fórmula de enriquecimento: os capítulos tratam de relações familiares, fome, poder e preservação da vida.",
    connection: "A família permanece no Egito, onde Êxodo começa com novas gerações e um novo cenário de opressão. A ligação entre os livros ajuda a entender por que a história não termina com a posição de José.",
    example: "Reconciliação responsável pode exigir tempo, verdade e mudança de atitude. Perdoar não obriga uma pessoa ferida a ficar em situação de abuso nem dispensa a proteção de quem corre risco.",
    scenes: [
      { title: "Uma ferida dentro de casa", text: "Gênesis 37 apresenta uma família atravessada por favoritismo e rivalidade. José é vendido pelos irmãos. O relato chama a atenção para a gravidade do dano, em vez de o tratar como uma etapa inofensiva do sucesso.", observe: "Observe como decisões de vários personagens ampliam o sofrimento da família.", reference: ref("Gênesis 37", "GEN", 37, 1) },
      { title: "Integridade não evita toda injustiça", text: "No Egito, José enfrenta uma acusação e a prisão. Sua fidelidade não é apresentada como garantia de uma vida sem sofrimento; a narrativa demora a chegar à mudança de sua situação.", observe: "Leia Gênesis 39 antes de tirar conclusões de que quem sofre necessariamente fez algo errado.", reference: ref("Gênesis 39", "GEN", 39, 1) },
      { title: "Autoridade para preservar vidas", text: "Ao interpretar os sonhos do faraó, José propõe preparar o país para a fome. A autoridade recebida está ligada à administração de recursos em meio a uma crise coletiva.", observe: "Veja como a narrativa passa da experiência de uma pessoa ao cuidado com muitas vidas.", reference: ref("Gênesis 41:25–57", "GEN", 41, 25) },
      { title: "A verdade pode abrir um recomeço", text: "O reencontro com os irmãos não apaga imediatamente o passado. Os capítulos finais incluem reconhecimento, emoção e temor. José afirma uma esperança de preservação da vida sem declarar boa a maldade cometida.", observe: "Leia Gênesis 45 e 50 juntos. Esperança e reconhecimento do mal aparecem lado a lado.", reference: ref("Gênesis 50:15–21", "GEN", 50, 15) }
    ], question: { prompt: "O que a história de José permite dizer sobre esperança?", options: [
      { text: "Ela pode coexistir com o reconhecimento verdadeiro do mal sofrido.", feedback: "Em Gênesis 50:20, José distingue a intenção de seus irmãos do resultado de preservação da vida. A esperança não exige chamar a maldade de bondade." },
      { text: "Toda pessoa fiel acabará rica e poderosa.", feedback: "Essa conclusão vai além do que o relato ensina. A trajetória de José não é uma promessa individual de riqueza; o texto destaca a preservação de vidas em uma situação particular." }
    ] }, nextReading: ref("Êxodo 1", "EXO", 1, 1)
  },
  {
    id: "exodo", title: "Libertos para aprender a caminhar juntos", subtitle: "Moisés, saída do Egito e aliança", era: "Êxodo · do Egito ao Sinai", theme: "Libertação", art: "exodus", symbol: "water",
    introduction: "O Êxodo começa com pessoas oprimidas e com um clamor ouvido. A saída do Egito leva a uma pergunta que continua importante: como viver a liberdade com responsabilidade diante de Deus e do próximo?",
    context: "Êxodo dá continuidade à história de Gênesis e ocupa lugar central na memória de Israel. As datas e a reconstrução histórica do evento são debatidas; a sequência visual acompanha a narrativa bíblica, não pretende reconstituir uma filmagem do passado.",
    connection: "A libertação conduz à aliança no Sinai e à vida de uma comunidade. Os mandamentos serão retomados pelos profetas e por Jesus em suas conversas sobre o amor a Deus e ao próximo.",
    example: "Sair de uma situação injusta é importante; aprender a não reproduzir a opressão também é. Respeitar o descanso e recusar a exploração de quem depende de nós tornam essa conexão concreta.",
    scenes: [
      { title: "O clamor de quem sofre", text: "O início de Êxodo descreve trabalho forçado e violência contra um povo. Mulheres que preservam vidas também participam dessa abertura. O texto nos pede que enxerguemos pessoas antes de olhar para monumentos ou faraós.", observe: "Perceba o papel das parteiras em Êxodo 1 e o clamor lembrado em 2:23–25.", reference: ref("Êxodo 1", "EXO", 1, 1) },
      { title: "Um chamado em meio ao deserto", text: "Moisés encontra a sarça e recebe a missão de voltar ao Egito. Suas perguntas e dificuldades fazem parte da narrativa; o chamado não se baseia na autoconfiança sem limites de um herói.", observe: "Repare na relação entre a aflição do povo e a missão recebida por Moisés.", reference: ref("Êxodo 3:1–15", "EXO", 3, 1) },
      { title: "A saída não é o fim do caminho", text: "A Páscoa e a travessia marcam a saída do Egito. A celebração preserva a memória da libertação. O deserto que vem depois mostra que liberdade também precisa ser aprendida na convivência.", observe: "Leia a travessia no contexto dos capítulos anteriores; não transforme uma cena isolada em garantia de que nunca haverá dificuldades.", reference: ref("Êxodo 14", "EXO", 14, 1) },
      { title: "Mandamentos depois da libertação", text: "Em Êxodo 20, a apresentação dos mandamentos recorda a saída da servidão. O relacionamento com Deus e a responsabilidade com o próximo aparecem no interior dessa aliança.", observe: "Observe o início do capítulo antes da lista de mandamentos. A memória da libertação ajuda a compreender suas orientações.", reference: ref("Êxodo 20:1–17", "EXO", 20, 1) }
    ], question: { prompt: "Por que ler os mandamentos junto com a história do Êxodo?", options: [
      { text: "Porque eles aparecem ligados à libertação e à vida em aliança.", feedback: "Êxodo 20:2 recorda a libertação antes de apresentar os mandamentos. O contexto ajuda a perceber uma vida comunitária responsável, e não apenas uma lista solta." },
      { text: "Porque o contexto não muda a compreensão de uma lista.", feedback: "O contexto faz diferença. Sem ele, podemos esquecer quem está sendo instruído, qual história antecede as orientações e como a aliança organiza a vida do povo." }
    ] }, nextReading: ref("Deuteronômio 6:4–9", "DEU", 6, 4)
  },
  {
    id: "rute", image: "/visuals/story-rute.png", title: "O cuidado que atravessa fronteiras", subtitle: "Rute, Noemi e a acolhida", era: "No tempo dos juízes · Rute 1–4", theme: "Lealdade", art: "creation", symbol: "sprout",
    introduction: "Entre relatos de conflitos, encontramos a história de duas mulheres que precisam reconstruir a vida. Rute nos convida a enxergar fidelidade, trabalho e acolhida em gestos que parecem pequenos.",
    context: "O livro situa sua narrativa no tempo dos juízes. Rute é moabita e acompanha a israelita Noemi. A condição de viúva e de estrangeira ajuda a compreender a vulnerabilidade das personagens e a importância das redes de cuidado.",
    connection: "A narrativa termina com uma genealogia ligada a Davi. Uma história de acolhida e provisão se conecta, assim, à história da monarquia e à genealogia de Jesus em Mateus 1.",
    example: "Uma pessoa recém-chegada à cidade pode precisar de orientação, segurança e trabalho digno. Acolher inclui condições concretas de vida, além de palavras gentis.",
    scenes: [
      { title: "Quando a vida muda de repente", text: "Fome, deslocamento e luto atravessam o início do livro. Noemi decide retornar a Belém. Antes de qualquer final feliz, o relato nos convida a escutar uma perda real.", observe: "Preste atenção à maneira como Noemi fala de sua situação; não apresse a dor da personagem.", reference: ref("Rute 1:1–14", "RUT", 1, 1) },
      { title: "Uma companhia assumida", text: "Rute escolhe acompanhar Noemi. Sua decisão envolve vínculo e um futuro incerto, em outra terra. O texto dá importância a uma relação de cuidado entre duas mulheres.", observe: "Leia as palavras de Rute no diálogo com Noemi, e não como uma frase isolada de seu cenário.", reference: ref("Rute 1:15–22", "RUT", 1, 15) },
      { title: "Acolher também é proteger", text: "Rute recolhe espigas no campo de Boaz. O capítulo reúne trabalho, alimento e proteção. A generosidade é percebida em condições concretas para que uma estrangeira possa viver com dignidade.", observe: "Observe as orientações de Boaz aos trabalhadores e o cuidado com a segurança de Rute.", reference: ref("Rute 2", "RUT", 2, 1) },
      { title: "Uma história dentro de outra maior", text: "O desfecho envolve costumes familiares e legais daquele contexto, que não devem ser copiados sem compreensão. A genealogia final liga Obede, Jessé e Davi, conectando essa casa à história de Israel.", observe: "Distinga os costumes antigos do princípio de cuidado que podemos discutir hoje.", reference: ref("Rute 4:13–22", "RUT", 4, 13) }
    ], question: { prompt: "Que tipo de acolhida aparece no segundo capítulo de Rute?", options: [
      { text: "Uma acolhida que inclui alimento, trabalho e segurança.", feedback: "É uma observação importante: o cuidado se manifesta no campo, na provisão e na proteção. Leia Rute 2 com atenção a esses gestos concretos." },
      { text: "Somente uma boa intenção, sem consequência prática.", feedback: "O relato vai além da intenção. As decisões de Boaz afetam como Rute pode trabalhar, alimentar-se e permanecer em segurança." }
    ] }, nextReading: ref("Mateus 1:1–6", "MAT", 1, 1)
  },
  {
    id: "davi", image: "/visuals/story-davi.png", title: "Coragem, poder e um coração que precisa voltar", subtitle: "Davi sem esconder suas sombras", era: "A monarquia · 1 e 2 Samuel", theme: "Responsabilidade", art: "exodus", symbol: "star",
    introduction: "Conhecer Davi exige ir além da cena com Golias. A Bíblia conta sua coragem, mas também confronta seu abuso de poder. Podemos aprender com essa honestidade sem transformar um líder em alguém acima da responsabilidade.",
    context: "A trajetória de Davi se desenvolve nos livros de Samuel, na transição para a monarquia de Israel. Os relatos fazem avaliações distintas de seus atos. A tradição dos salmos também se relaciona a Davi, mas cada título e contexto precisam ser observados com cuidado.",
    connection: "A promessa ligada à casa de Davi atravessa a história posterior de Israel. Os Evangelhos usam a expressão Filho de Davi ao apresentar Jesus; compreender essa ligação exige conhecer tanto as promessas quanto as falhas da monarquia.",
    example: "Admiração por um líder não elimina a necessidade de limites, prestação de contas e proteção das pessoas vulneráveis. Reconhecer um erro não substitui enfrentar suas consequências.",
    scenes: [
      { title: "O que o olhar humano deixa passar", text: "Na escolha de Davi, o relato contrasta aparência e coração. A cena não oferece um atalho para julgar o interior de alguém, mas questiona os critérios de poder e prestígio usados por quem observa.", observe: "Leia a escolha no contexto da visita de Samuel à família de Jessé.", reference: ref("1 Samuel 16:1–13", "1SA", 16, 1) },
      { title: "A coragem diante de Golias", text: "O confronto coloca Davi diante de um adversário temido. O texto destaca sua confiança no Senhor. A cena não ensina que qualquer risco será vencido se alguém demonstrar coragem suficiente.", observe: "Observe o que Davi diz sobre a origem da vitória e resista a transformar a história em uma fórmula de sucesso.", reference: ref("1 Samuel 17:32–50", "1SA", 17, 32) },
      { title: "O poder também pode ferir", text: "Em 2 Samuel 11, o rei usa sua posição numa sequência que envolve Bate-Seba, Urias e uma morte planejada. A leitura responsável não suaviza o abuso nem transfere a culpa para quem estava em situação vulnerável.", observe: "Repare nas ordens e nos recursos que o rei mobiliza. Quem concentra poder nessa história?", reference: ref("2 Samuel 11", "2SA", 11, 1) },
      { title: "A Palavra confronta o rei", text: "Natã apresenta uma parábola e confronta Davi. O reconhecimento do pecado não apaga suas consequências. O próprio relato mostra que a posição de rei não o coloca acima da justiça.", observe: "Leia a parábola e sua aplicação juntas. O confronto não é um detalhe secundário da história.", reference: ref("2 Samuel 12:1–14", "2SA", 12, 1) }
    ], question: { prompt: "Como a Bíblia nos ajuda a olhar para a liderança na história de Davi?", options: [
      { text: "Com reconhecimento das qualidades e responsabilidade pelos danos.", feedback: "Os livros de Samuel preservam coragem e falhas graves. Natã confronta o rei; a narrativa não permite transformar admiração em imunidade moral." },
      { text: "Como se a posição de líder tornasse corretas todas as suas decisões.", feedback: "2 Samuel 12 mostra o contrário: Davi é confrontado. Uma liderança religiosa ou política não elimina a responsabilidade pelo cuidado e pela justiça." }
    ] }, nextReading: ref("Salmo 51", "PSA", 51, 1)
  },
  {
    id: "daniel", image: "/visuals/story-daniel.png", title: "Guardar a fé longe de casa", subtitle: "Daniel e seus companheiros no exílio", era: "Exílio e esperança · Daniel 1–7", theme: "Fidelidade", art: "hope", symbol: "star",
    introduction: "O livro de Daniel apresenta pessoas que precisam viver sob o poder de grandes impérios. A fé aparece em escolhas cotidianas, na recusa da idolatria e na esperança que ultrapassa os reinos humanos.",
    context: "A narrativa situa Daniel na Babilônia e depois no cenário persa. O livro reúne histórias de corte e visões apocalípticas; esses gêneros não são lidos do mesmo modo. Questões sobre sua composição e data são debatidas na pesquisa bíblica.",
    connection: "A experiência do exílio ajuda a compreender a esperança de restauração. As imagens de Daniel também aparecem no horizonte dos Evangelhos e do Apocalipse; é importante estudar essas ligações sem prever datas por meio de ilustrações.",
    example: "Uma pessoa pode manter convicções e, ao mesmo tempo, dialogar com respeito no trabalho ou na escola. Fidelidade não precisa ser confundida com desprezo por quem pensa diferente.",
    scenes: [
      { title: "Longe de casa, ainda com identidade", text: "Daniel e seus companheiros recebem formação na corte e nomes ligados ao novo ambiente. A narrativa acompanha a maneira como negociam sua vida cotidiana sem abandonar suas convicções.", observe: "Observe tanto os limites assumidos quanto a forma de conversar com os responsáveis pela alimentação.", reference: ref("Daniel 1", "DAN", 1, 1) },
      { title: "Não transformar o poder em deus", text: "Em Daniel 3, três companheiros se recusam a adorar uma imagem imposta pelo rei. Sua resposta não trata a fidelidade como uma garantia de escapar do sofrimento a qualquer custo.", observe: "Leia especialmente Daniel 3:16–18 e perceba a força da expressão de confiança mesmo diante do risco.", reference: ref("Daniel 3:13–30", "DAN", 3, 13) },
      { title: "A oração diante de uma proibição", text: "Daniel 6 narra um conflito entre um decreto e a prática de oração de Daniel. O relato denuncia uma armadilha montada por adversários e apresenta a permanência de sua devoção.", observe: "A perseguição narrada tem circunstâncias próprias; não rotule toda discordância cotidiana como a mesma situação.", reference: ref("Daniel 6", "DAN", 6, 1) },
      { title: "Os impérios não têm a última palavra", text: "As visões de Daniel 7 usam imagens simbólicas para falar de reinos, juízo e domínio. A esperança desloca o olhar do poder presente para a justiça de Deus, sem tornar cada símbolo uma fotografia literal.", observe: "Note que o próprio capítulo apresenta uma explicação para a visão. Gênero literário e contexto importam.", reference: ref("Daniel 7:1–18", "DAN", 7, 1) }
    ], question: { prompt: "O que ajuda a ler as visões de Daniel com cuidado?", options: [
      { text: "Reconhecer símbolos, contexto e as explicações oferecidas pelo próprio livro.", feedback: "Esse caminho respeita o gênero apocalíptico. A visão utiliza imagens para comunicar uma esperança; não precisamos forçar cada figura a funcionar como uma fotografia ou um calendário atual." },
      { text: "Associar imediatamente cada imagem a uma notícia de hoje.", feedback: "É melhor começar pelo próprio texto e seus destinatários. Associações rápidas podem substituir a mensagem do livro por nossas expectativas e produzir conclusões sem base." }
    ] }, nextReading: ref("Marcos 14:60–62", "MRK", 14, 60)
  },
  {
    id: "nascimento-de-jesus", image: "/visuals/story-nascimento-de-jesus.png", title: "A esperança chega à vida comum", subtitle: "O nascimento de Jesus nos Evangelhos", era: "Os Evangelhos · Mateus 1–2; Lucas 1–2", theme: "Encarnação", art: "galilee", symbol: "star",
    introduction: "Ao apresentar Jesus, os Evangelhos entram em casas, escutam perguntas e acompanham pessoas que recebem uma notícia maior do que conseguiam compreender. Vamos ler com reverência e atenção a cada relato.",
    context: "Mateus e Lucas contam o nascimento a partir de perspectivas e episódios próprios. A história ilustrada distingue seus relatos: os pastores aparecem em Lucas; os magos, em Mateus. O texto não informa o número dos magos nem uma data do calendário para o nascimento.",
    connection: "As genealogias, promessas e cânticos ligam Jesus à história de Israel. O nascimento abre o caminho para acompanhar seu ensino, seus encontros e a maneira como os Evangelhos anunciam quem ele é.",
    example: "Escutar alguém com atenção em meio à rotina, acolher uma família em dificuldade ou oferecer companhia a quem se sente esquecido pode ser uma resposta concreta ao tema da acolhida. Não precisamos inventar detalhes do nascimento para perceber seu significado cristão.",
    scenes: [
      { title: "Maria recebe uma notícia", text: "Lucas apresenta Maria em Nazaré diante do anúncio do nascimento de Jesus. Sua pergunta e sua resposta fazem parte do relato; a cena conserva a dimensão humana de quem escuta algo extraordinário.", observe: "Repare no que o mensageiro anuncia sobre Jesus e no que Maria pergunta, sem acrescentar uma descrição de sua aparência.", reference: ref("Lucas 1:26–38", "LUK", 1, 26) },
      { title: "José e o nome de Jesus", text: "Mateus acompanha a situação pela perspectiva de José. O anúncio liga o nome de Jesus à salvação e apresenta uma leitura das Escrituras de Israel. Os dois Evangelhos devem ser ouvidos antes de serem fundidos numa única cena.", observe: "Observe o nome, a promessa e a ação de José em Mateus 1.", reference: ref("Mateus 1:18–25", "MAT", 1, 18) },
      { title: "Uma manjedoura e os pastores", text: "Lucas narra o nascimento em Belém e a visita dos pastores. A notícia alcança trabalhadores em sua atividade cotidiana; a cena combina simplicidade e um anúncio de grande alegria.", observe: "O que os pastores ouvem, procuram e contam? Acompanhe a sequência do relato.", reference: ref("Lucas 2:1–20", "LUK", 2, 1) },
      { title: "Buscar, adorar e proteger", text: "Em Mateus, os magos chegam do Oriente e Herodes reage com ameaça. O capítulo inclui deslocamento e a fuga da família para o Egito. A alegria do nascimento não apaga o cenário de vulnerabilidade.", observe: "Distinga a visita dos magos da visita dos pastores. Não transforme tradições artísticas posteriores em informações que o texto afirma.", reference: ref("Mateus 2:1–15", "MAT", 2, 1) }
    ], question: { prompt: "Por que distinguir os relatos de Mateus e Lucas?", options: [
      { text: "Para ouvir os detalhes e a ênfase de cada Evangelho com atenção.", feedback: "Isso torna a leitura mais rica e responsável. Pastores e magos pertencem a episódios distintos; reconhecer a diferença ajuda a separar o texto bíblico de convenções de presépios e filmes." },
      { text: "Para preencher as lacunas com detalhes de filmes.", feedback: "As imagens podem nos ajudar a imaginar um ambiente, mas não completam o texto como fonte histórica. A arte desta área também é uma interpretação, não uma fotografia do nascimento." }
    ] }, nextReading: ref("Lucas 2:22–38", "LUK", 2, 22)
  },
  {
    id: "bom-samaritano", image: "/visuals/story-bom-samaritano.png", title: "O amor que atravessa a estrada", subtitle: "A parábola do bom samaritano", era: "O ensino de Jesus · Lucas 10:25–37", theme: "Misericórdia", art: "galilee", symbol: "road",
    introduction: "Às vezes queremos saber quem merece nosso cuidado. Jesus conta uma história que nos leva a outra pergunta: de quem eu posso me aproximar com misericórdia? Vamos escutá-la sem pressa.",
    context: "Lucas apresenta esta parábola num diálogo sobre a vida eterna e o amor a Deus e ao próximo. Samaritanos e judeus possuíam tensões históricas; o papel do samaritano surpreende dentro da narrativa. Não é uma autorização para desprezar qualquer povo ou religião.",
    connection: "A parábola se liga ao mandamento do amor e à vida prática do discípulo. O estudo Aprendendo com Jesus a nos tornar próximos aprofunda a mesma passagem com atividades de leitura.",
    example: "Ajudar alguém caído pode envolver chamar socorro, garantir segurança e procurar apoio adequado. Cuidado responsável não significa assumir sozinho uma situação para a qual não se tem preparo.",
    scenes: [
      { title: "Uma pergunta diante de Jesus", text: "Um intérprete da Lei pergunta a Jesus sobre a vida eterna. O diálogo recupera o amor a Deus e ao próximo. O relato começa nas Escrituras antes de nos levar à estrada.", observe: "Leia a conversa anterior à parábola: qual nova pergunta o interlocutor faz em Lucas 10:29?", reference: ref("Lucas 10:25–29", "LUK", 10, 25) },
      { title: "Há uma pessoa ferida no caminho", text: "Na história contada por Jesus, um homem é assaltado e deixado ferido. Um sacerdote e um levita passam. A necessidade humana permanece no centro da cena, antes de qualquer classificação sobre quem a pessoa é.", observe: "O narrador não dá nome ou biografia ao homem ferido. Não precisamos conhecê-los para reconhecer sua necessidade.", reference: ref("Lucas 10:30–32", "LUK", 10, 30) },
      { title: "A compaixão se torna ação", text: "O samaritano vê, aproxima-se e cuida. A misericórdia assume a forma de tempo, recursos, transporte e continuidade. Não é apenas um sentimento bonito que termina à distância.", observe: "Procure os verbos que descrevem o cuidado. O que cada ação acrescenta à anterior?", reference: ref("Lucas 10:33–35", "LUK", 10, 33) },
      { title: "Tornar-se próximo", text: "Ao terminar a parábola, Jesus pergunta quem se fez próximo do homem ferido. A conversa se move da busca por limites para o compromisso com a misericórdia.", observe: "Compare a pergunta de Lucas 10:29 com a de 10:36. Perceba o deslocamento produzido pela história.", reference: ref("Lucas 10:36–37", "LUK", 10, 36) }
    ], question: { prompt: "Qual gesto acompanha o movimento da parábola?", options: [
      { text: "Perceber uma necessidade e buscar uma ajuda concreta e segura.", feedback: "A história une compaixão e ação. O samaritano se aproxima, cuida e organiza continuidade. Hoje isso também pode incluir pedir ajuda profissional quando necessário." },
      { text: "Discutir primeiro se a pessoa pertence ao meu grupo.", feedback: "A pergunta final de Jesus desloca o foco para quem se faz próximo. A necessidade da pessoa ferida não espera que definamos se ela merece pertencer ao nosso grupo." }
    ] }, nextReading: ref("Levítico 19:18, 33–34", "LEV", 19, 18)
  },
  ...miracleStories,
  {
    id: "cruz-e-ressurreicao", title: "A esperança diante da cruz", subtitle: "Paixão, ressurreição e encontro", era: "O centro da fé cristã · Os Evangelhos", theme: "Páscoa", art: "hope", symbol: "road",
    introduction: "Aqui nos aproximamos do centro da fé cristã com reverência. Os Evangelhos não escondem o sofrimento de Jesus nem o medo de seus discípulos; anunciam a ressurreição como uma esperança que transforma o encontro com ele.",
    context: "Os quatro Evangelhos narram a paixão e a ressurreição com suas próprias ênfases. Este percurso seleciona episódios e identifica a fonte de cada um. A crucificação ocorreu sob autoridade romana; o texto jamais deve ser usado para culpar coletivamente o povo judeu.",
    connection: "A Páscoa cristã retoma temas de promessa, aliança e libertação. O encontro com o Ressuscitado prepara a missão narrada em Atos e o desenvolvimento das primeiras comunidades.",
    example: "Acompanhar uma pessoa enlutada pede presença e escuta. A esperança cristã pode ser confessada sem exigir que alguém pare de chorar, sem marcar prazo para a dor e sem transformar o sofrimento em falta de fé.",
    scenes: [
      { title: "À mesa, serviço e memória", text: "Os relatos da última ceia apresentam Jesus à mesa com os discípulos. Em Lucas, o pão e o cálice são relacionados à sua entrega e à aliança. A cena deve ser lida no horizonte da Páscoa e da paixão que se aproxima.", observe: "Observe as palavras e os gestos na sequência da refeição. Tradições cristãs explicam a ceia de maneiras diferentes, que precisam ser identificadas ao aprofundar o estudo.", reference: ref("Lucas 22:14–20", "LUK", 22, 14) },
      { title: "A cruz não é um espetáculo", text: "Lucas narra a crucificação, o sofrimento e a morte de Jesus. Aproximamo-nos dessa passagem sem imagens gráficas ou curiosidade pela violência. O testemunho cristão contempla a entrega de Cristo e a gravidade da injustiça.", observe: "Leia quem age em cada parte do relato. Não substitua personagens e autoridades específicas por acusações contra um povo inteiro.", reference: ref("Lucas 23:33–49", "LUK", 23, 33) },
      { title: "Uma notícia que pede escuta", text: "Lucas apresenta mulheres que vão ao túmulo e recebem o anúncio da ressurreição. A reação dos discípulos inclui dificuldade para acolher o testemunho. A narrativa preserva a surpresa e o lugar dessas testemunhas.", observe: "Repare em quem encontra o túmulo e em quem anuncia a notícia aos demais discípulos.", reference: ref("Lucas 24:1–12", "LUK", 24, 1) },
      { title: "O encontro que abre um caminho", text: "No caminho de Emaús, dois discípulos conversam sobre sua tristeza e são acompanhados por Jesus. O relato une escuta, interpretação das Escrituras e reconhecimento, antes de seu retorno à comunidade.", observe: "Acompanhe a mudança da conversa ao longo do caminho. O que os discípulos fazem depois do encontro?", reference: ref("Lucas 24:13–35", "LUK", 24, 13) }
    ], question: { prompt: "Como acolher alguém em luto à luz dessa esperança?", options: [
      { text: "Oferecer presença, escuta e cuidado sem cobrar o fim imediato da tristeza.", feedback: "A esperança não precisa apagar a dor de quem sofre. Os próprios relatos preservam lágrimas, medo e perguntas. O cuidado respeita o tempo da pessoa e pode buscar apoio adequado." },
      { text: "Dizer que chorar demonstra falta de fé.", feedback: "Essa cobrança pode ferir e não faz justiça aos Evangelhos. Há espaço para tristeza e esperança na vida cristã; João 11:35 também registra o choro de Jesus." }
    ] }, nextReading: ref("João 20:1–18", "JHN", 20, 1)
  },
  {
    id: "pentecostes", image: "/visuals/story-pentecostes.png", title: "Uma Palavra que cruza fronteiras", subtitle: "Pentecostes e as primeiras comunidades", era: "A missão · Atos 1–15", theme: "Comunidade", art: "hope", symbol: "water",
    introduction: "O livro de Atos nos apresenta uma comunidade que aprende a testemunhar, repartir e reconhecer pessoas além de suas fronteiras habituais. Há alegria e também conflitos que precisam ser enfrentados.",
    context: "Atos é a continuação do Evangelho de Lucas. O relato acompanha a expansão do testemunho de Jerusalém a outros lugares do mundo mediterrâneo. Não descreve todas as comunidades nem toda a história posterior do cristianismo.",
    connection: "As viagens e os debates de Atos ajudam a ler as cartas do Novo Testamento. Depois do período apostólico, a história documentada das igrejas exige outras fontes; a rede de igrejas do app distingue essas etapas e suas relações.",
    example: "Uma comunidade pode acolher pessoas de origens diferentes, organizar ajuda e ouvir quem foi esquecido na distribuição de recursos. Unidade não significa nunca ter conflito, mas aprender a enfrentá-lo com responsabilidade.",
    scenes: [
      { title: "Testemunhar além do lugar conhecido", text: "Antes do Pentecostes, Atos apresenta uma promessa ligada ao Espírito e ao testemunho. O horizonte do relato se amplia de Jerusalém a outros lugares, preparando o movimento de todo o livro.", observe: "Use Atos 1:8 como uma chave de organização da narrativa, sem reduzir as pessoas a destinos num mapa.", reference: ref("Atos 1:6–11", "ACT", 1, 6) },
      { title: "Uma notícia ouvida em muitas línguas", text: "Em Atos 2, a vinda do Espírito é acompanhada por uma comunicação que alcança pessoas de diferentes procedências. Pedro interpreta o acontecimento à luz das Escrituras e anuncia Jesus.", observe: "Leia a lista de procedências e depois o discurso de Pedro. O sinal está ligado ao testemunho, não apenas ao espanto.", reference: ref("Atos 2:1–24", "ACT", 2, 1) },
      { title: "Aprender, repartir e corrigir", text: "A vida comunitária reúne ensino, oração, refeições e partilha. Atos 6 também registra uma reclamação na assistência às viúvas. O relato não esconde o problema: a comunidade precisa ouvi-lo e agir.", observe: "Compare Atos 2:42–47 com 6:1–7. A descrição de comunhão não elimina a necessidade de corrigir injustiças.", reference: ref("Atos 6:1–7", "ACT", 6, 1) },
      { title: "Fronteiras que precisam ser revistas", text: "O encontro de Pedro com Cornélio e o debate de Atos 15 acompanham a entrada de gentios na comunidade. A expansão exige escuta e discernimento; não é apenas o crescimento de um número.", observe: "Observe como experiências, Escrituras e debate aparecem no relato. Não confunda esses episódios com a fundação direta de uma denominação moderna.", reference: ref("Atos 15:1–21", "ACT", 15, 1) }
    ], question: { prompt: "O que Atos permite perceber sobre a vida em comunidade?", options: [
      { text: "Que comunhão também exige ouvir reclamações e organizar o cuidado.", feedback: "Atos 6 mostra um problema real na distribuição cotidiana e uma resposta organizada. Uma comunidade não precisa esconder dificuldades para ser comprometida com o cuidado." },
      { text: "Que uma comunidade fiel nunca terá conflitos.", feedback: "O próprio livro relata conflitos e decisões difíceis. O modo de enfrentá-los faz parte do testemunho e da aprendizagem da comunidade." }
    ] }, nextReading: ref("1 Coríntios 12:12–27", "1CO", 12, 12)
  }
];

export function getBiblicalStory(id: string) { return biblicalStories.find(story => story.id === id); }

export const storyStageIds: Readonly<Record<string,string>> = {
  criacao:"criacao-e-comecos",noe:"criacao-e-comecos",abraao:"promessa-e-alianca",jose:"promessa-e-alianca",exodo:"exodo-e-libertacao",rute:"rute-e-acolhimento",davi:"samuel-e-davi",daniel:"profetas-e-esperanca",
  "nascimento-de-jesus":"chegada-de-jesus","bom-samaritano":"jesus-e-seu-reino","cruz-e-ressurreicao":"cruz-e-entrega",pentecostes:"pentecostes-e-comunidade", "multiplicacao-dos-paes":"jesus-e-seu-reino", "jesus-acalma-a-tempestade":"jesus-e-seu-reino", lazaro:"jesus-e-seu-reino"
};
