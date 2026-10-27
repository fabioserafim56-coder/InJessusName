export type ScriptureReference = {
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  label: string;
};

export type TeachingCard = {
  id: string;
  title: string;
  body: string[];
  task: string;
  sourceRefs: ScriptureReference[];
};

type ActivityBase = {
  id: string;
  prompt: string;
  hint: string;
  skill: string;
  sourceRefs: ScriptureReference[];
};

export type ChoiceActivity = ActivityBase & {
  kind: "choice";
  options: { id: string; text: string; feedback: string }[];
  correctOptionId: string;
};

export type ClassifyActivity = ActivityBase & {
  kind: "classify";
  categories: { id: string; label: string }[];
  items: { id: string; text: string; categoryId: string; feedback: string; correction: string }[];
};

export type OrderActivity = ActivityBase & {
  kind: "order";
  items: { id: string; text: string }[];
  correctOrder: string[];
  correctFeedback: string;
  incorrectFeedback: string;
};

export type CourseActivity = ChoiceActivity | ClassifyActivity | OrderActivity;

export type CourseLesson = {
  id: string;
  title: string;
  subtitle: string;
  theme: string;
  estimatedMinutes: number;
  objectives: string[];
  passages: ScriptureReference[];
  cards: TeachingCard[];
  workedExample: { title: string; prompt: string; steps: string[]; answer: string; sourceRefs: ScriptureReference[] };
  guidedPractice: { prompt: string; hints: string[]; modelResponse: string; sourceRefs: ScriptureReference[] };
  activities: CourseActivity[];
  reflection: { scripture: string; observation: string; application: string; prayer: string };
  recap: string[];
  reviewPrompt: string;
  editorialStatus: "educational-pilot";
};

export const courseEditorialNote = "Conteúdo autoral introdutório. Revisão humana especializada e avaliação com estudantes pendentes. Não representa aprovação de uma igreja nem habilitação ministerial.";

export const courseSourceNote = "As passagens indicadas são as fontes primárias dos comentários. O texto bíblico é fornecido pela edição identificada no leitor, com seus próprios créditos e licença; não foi copiado neste conteúdo.";

function reference(book: string, chapter: number, startVerse: number, endVerse: number, label: string): ScriptureReference {
  return { book, chapter, startVerse, endVerse, label };
}

const genesisOpening = reference("GEN", 1, 1, 5, "Gênesis 1:1–5");
const creationPeople = reference("GEN", 1, 26, 31, "Gênesis 1:26–31");
const creationEvaluation = reference("GEN", 1, 31, 31, "Gênesis 1:31");
const seventhDay = reference("GEN", 2, 1, 3, "Gênesis 2:1–3");
const gardenCare = reference("GEN", 2, 15, 17, "Gênesis 2:15–17");
const gardenTask = reference("GEN", 2, 15, 15, "Gênesis 2:15");
const psalm23 = reference("PSA", 23, 1, 6, "Salmo 23:1–6");
const lukeStory = reference("LUK", 10, 25, 37, "Lucas 10:25–37");
const lukeQuestion = reference("LUK", 10, 25, 29, "Lucas 10:25–29");
const lukeWho = reference("LUK", 10, 29, 29, "Lucas 10:29");
const lukeCare = reference("LUK", 10, 33, 35, "Lucas 10:33–35");
const lukeEnding = reference("LUK", 10, 36, 37, "Lucas 10:36–37");
const prayerContext = reference("MAT", 6, 5, 8, "Mateus 6:5–8");
const prayerModel = reference("MAT", 6, 9, 13, "Mateus 6:9–13");
const prayerWhole = reference("MAT", 6, 5, 13, "Mateus 6:5–13");
const respect = reference("1PE", 3, 15, 16, "1 Pedro 3:15–16");
const athensOpening = reference("ACT", 17, 22, 24, "Atos 17:22–24");
const athensSpeech = reference("ACT", 17, 22, 31, "Atos 17:22–31");
const romansLove = reference("ROM", 12, 9, 18, "Romanos 12:9–18");
const romansParticipation = reference("ROM", 12, 15, 15, "Romanos 12:15");

export const additionalLessons: CourseLesson[] = [
  {
    id: "panorama-biblico",
    title: "Uma biblioteca, muitas formas de ensinar",
    subtitle: "Aprenda a reconhecer narrativa, poesia e carta antes de explicar uma passagem.",
    theme: "Bíblia",
    estimatedMinutes: 15,
    editorialStatus: "educational-pilot",
    objectives: [
      "Reconhecer diferenças entre uma narrativa, um poema e uma orientação em carta.",
      "Explicar como o tipo de texto muda a pergunta que fazemos durante a leitura.",
      "Conferir uma interpretação com mais de um versículo da mesma unidade."
    ],
    passages: [psalm23, genesisOpening, lukeStory, romansLove],
    cards: [
      {
        id: "panorama-library", title: "Comece pela forma do texto",
        body: ["A Bíblia reúne textos com formas diferentes. Gênesis 1 apresenta uma sequência de ações; o Salmo 23 trabalha imagens de cuidado; Romanos 12 reúne orientações de convivência. Perceber essas diferenças ajuda a formular perguntas melhores.", "O leitor atual contém uma edição de 66 livros. Outras tradições cristãs reconhecem cânones diferentes; esta aula trabalha passagens compartilhadas pelas trilhas previstas."],
        task: "Abra o Salmo 23 e procure uma imagem que ajude a expressar confiança.",
        sourceRefs: [genesisOpening, psalm23, romansLove]
      },
      {
        id: "panorama-narrative", title: "Narrativa: acompanhe o que acontece",
        body: ["Em Lucas 10, uma conversa introduz uma história contada por Jesus. Observe quem pergunta, quais personagens aparecem e como a conversa termina. O diálogo ao redor ajuda a entender a função da narrativa.", "Narrativas podem conter falas, ações e parábolas. Antes de transformar um detalhe em regra, pergunte o que está sendo contado e a que pergunta a história responde."],
        task: "Compare a pergunta de Lucas 10:29 com a pergunta de Jesus em 10:36.",
        sourceRefs: [lukeQuestion, lukeEnding]
      },
      {
        id: "panorama-poetry", title: "Poesia: escute as imagens",
        body: ["O Salmo 23 usa imagens de pastor, caminho, vale e mesa. Elas expressam cuidado, confiança e presença. Leia o poema inteiro para perceber como essas imagens se relacionam.", "O versículo 4 inclui uma situação de perigo no próprio poema. A confiança expressa ali acompanha a dificuldade; a leitura precisa levar em conta esse verso ao explicar o conjunto."],
        task: "Identifique uma imagem de cuidado e uma menção à dificuldade no mesmo salmo.",
        sourceRefs: [psalm23]
      },
      {
        id: "panorama-letter", title: "Carta: situe a orientação",
        body: ["Romanos 12:9–18 apresenta ações ligadas a amor, hospitalidade, alegria, sofrimento e paz. Procure a relação entre as orientações da seção, em vez de usar uma frase solta como resposta para qualquer situação.", "Uma boa nota de estudo reúne referência, observação e uma pergunta: o que essa seção ensina e como a aplicação respeita o contexto da pessoa?"],
        task: "Leia Romanos 12:15 e descreva as duas situações às quais a orientação se dirige.",
        sourceRefs: [romansLove]
      }
    ],
    workedExample: {
      sourceRefs: [psalm23],
      title: "Como conferir uma leitura de um poema",
      prompt: "Uma pessoa diz que o Salmo 23 promete uma vida sem qualquer perigo. Como você confere essa conclusão?",
      steps: ["Localize o Salmo 23 e leia seus seis versículos.", "Observe a imagem do pastor e os caminhos mencionados.", "Confira a dificuldade apresentada no versículo 4.", "Formule um resumo que conserve tanto a confiança quanto a presença da dificuldade."],
      answer: "O poema expressa confiança no cuidado de Deus em meio às situações descritas. O perigo mencionado no versículo 4 precisa fazer parte da explicação; recortar apenas uma imagem deixa de fora uma parte importante do texto."
    },
    guidedPractice: {
      sourceRefs: [romansParticipation],
      prompt: "Leia Romanos 12:15. Que duas experiências humanas aparecem e como você resumiria a orientação?",
      hints: ["Procure duas ações correspondentes a duas situações diferentes.", "Observe a relação com outras pessoas, sem exigir que elas escondam seus sentimentos.", "Separe a orientação do texto de um exemplo que você criaria para hoje."],
      modelResponse: "A seção orienta a participar da alegria e do sofrimento de outras pessoas. Ouvir um amigo em dificuldade é uma aplicação possível; o exemplo atual deve ser apresentado como aplicação, com atenção às necessidades reais dele."
    },
    activities: [
      {
        kind: "choice", id: "panorama-choice", skill: "Ler o conjunto", sourceRefs: [psalm23],
        prompt: "Qual conferência ajuda a avaliar a afirmação de que o Salmo 23 exclui qualquer perigo da vida?",
        hint: "Leia também a situação mencionada no versículo 4.",
        options: [
          { id: "isolated", text: "Usar apenas a primeira imagem do salmo e dispensar o restante.", feedback: "A imagem inicial faz parte de um poema inteiro. Releia os demais versos para conferir como confiança e dificuldade aparecem juntos." },
          { id: "whole", text: "Ler o poema inteiro, incluindo a dificuldade do versículo 4.", feedback: "Essa leitura conserva a evidência do conjunto. O salmo apresenta confiança e também menciona uma situação difícil; ambas precisam entrar no resumo." },
          { id: "literal-animal", text: "Concluir que toda referência a pastor descreve apenas criação de animais.", feedback: "No poema, a imagem do pastor comunica cuidado. Observe como ela se liga ao restante antes de decidir que o texto trata somente de uma atividade rural." }
        ],
        correctOptionId: "whole"
      },
      {
        kind: "classify", id: "panorama-classify", skill: "Reconhecer formas de texto", sourceRefs: [lukeStory, psalm23, romansLove],
        prompt: "Associe cada descrição à forma de texto que estamos observando.",
        hint: "Procure sequência de acontecimentos, imagens poéticas ou orientações em uma carta.",
        categories: [{ id: "narrative", label: "Narrativa" }, { id: "poetry", label: "Poesia" }, { id: "letter", label: "Carta com orientações" }],
        items: [
          { id: "luke-scenes", text: "Os encontros e ações contados por Jesus em Lucas 10.", categoryId: "narrative", feedback: "Você reconheceu uma sequência narrativa dentro de uma conversa.", correction: "Observe os personagens, encontros e ações em Lucas 10:30–35. Nesta atividade, estamos reconhecendo a forma narrativa." },
          { id: "psalm-images", text: "As imagens de pastor, caminho e mesa no Salmo 23.", categoryId: "poetry", feedback: "Essas imagens fazem parte da linguagem poética do salmo.", correction: "O conjunto usa imagens para expressar cuidado e confiança. Nesta comparação, ele corresponde à poesia." },
          { id: "romans-instructions", text: "As recomendações de convivência de Romanos 12:9–18.", categoryId: "letter", feedback: "São orientações encontradas em uma seção da carta aos Romanos.", correction: "Localize a seção de Romanos 12. A descrição se refere às orientações dessa carta, mesmo que elas possam usar recursos de linguagem variados." },
          { id: "luke-dialogue", text: "A conversa que introduz e encerra a história em Lucas 10.", categoryId: "narrative", feedback: "O diálogo faz parte da organização narrativa da passagem.", correction: "As perguntas e respostas são acontecimentos relatados na unidade de Lucas 10. Aqui elas compõem a narrativa." }
        ]
      },
      {
        kind: "order", id: "panorama-order", skill: "Acompanhar uma unidade", sourceRefs: [lukeStory],
        prompt: "Reconstitua a sequência da unidade de Lucas 10:25–37.",
        hint: "Comece pela conversa que dá origem à história e termine pelo convite à prática.",
        items: [
          { id: "story", text: "Jesus conta a história do homem ferido e dos encontros no caminho." },
          { id: "invitation", text: "A resposta identifica quem agiu com misericórdia, e Jesus convida à prática." },
          { id: "opening", text: "Um estudioso da Lei conversa com Jesus e pergunta sobre o próximo." },
          { id: "closing-question", text: "Jesus pergunta quem se tornou próximo do homem ferido." }
        ],
        correctOrder: ["opening", "story", "closing-question", "invitation"],
        correctFeedback: "A história está situada entre uma conversa inicial e uma pergunta final. A sequência ajuda a explicar a função da parábola.",
        incorrectFeedback: "Confira Lucas 10:25–29, depois 30–35 e, por fim, 36–37. Reorganize os cartões seguindo a sequência relatada, sem retirar a história do diálogo."
      }
    ],
    reflection: {
      scripture: "Anote a edição usada e uma das passagens desta aula.",
      observation: "Que característica da passagem ajudou você a reconhecer sua forma? Aponte uma referência.",
      application: "Antes de compartilhar uma frase bíblica nesta semana, como você pode conferir o tipo de texto e o seu entorno?",
      prayer: "Se desejar, leve à oração uma pergunta que surgiu durante a leitura. Essa nota fica no seu caderno."
    },
    recap: ["A forma do texto orienta as perguntas de leitura.", "O entorno ajuda a conferir a interpretação.", "Uma aplicação atual precisa conservar sua base e seus limites."],
    reviewPrompt: "Em outro dia, leia Salmo 121:1–4. Antes de consultar esta aula, identifique uma imagem, uma afirmação e a referência que sustenta sua observação.",
  },
  {
    id: "criacao-e-cuidado",
    title: "Criação, dignidade e cuidado",
    subtitle: "Leia o começo de Gênesis e relacione observação do texto com responsabilidade na vida.",
    theme: "Criação",
    estimatedMinutes: 18,
    editorialStatus: "educational-pilot",
    objectives: [
      "Acompanhar a organização das primeiras cenas de Gênesis.",
      "Identificar no texto a linguagem de imagem de Deus, bênção e cuidado.",
      "Distinguir uma observação da passagem de uma aplicação ética atual."
    ],
    passages: [genesisOpening, creationPeople, seventhDay, gardenCare],
    cards: [
      {
        id: "creation-opening", title: "Observe o começo do relato",
        body: ["Gênesis 1 começa apresentando Deus como Criador. Nos versículos 1–5, acompanhe o que é descrito, o que Deus diz e as mudanças que o relato apresenta. Essa é uma primeira leitura: localizar ações e sua sequência.", "O estudo de cronologias e das relações entre ciência e interpretação bíblica exige perguntas e fontes próprias. Aqui, vamos trabalhar a organização do relato e suas perguntas sobre a vida."],
        task: "Leia Gênesis 1:1–5 e encontre duas ações atribuídas a Deus.",
        sourceRefs: [genesisOpening]
      },
      {
        id: "creation-pattern", title: "Perceba os padrões",
        body: ["A fala divina, o acontecimento relatado e a avaliação da criação ajudam a organizar a leitura de Gênesis 1. Procure essas ações nos versículos 3–5 e compare com a avaliação do conjunto no versículo 31.", "Uma repetição chama a atenção para a forma do texto. Registre onde você a encontrou e confira se sua conclusão corresponde à passagem inteira."],
        task: "Explique com suas palavras o que acontece depois da fala sobre a luz.",
        sourceRefs: [genesisOpening, creationPeople]
      },
      {
        id: "creation-dignity", title: "Pense na dignidade humana",
        body: ["Gênesis 1:26–28 apresenta o ser humano em relação com a imagem de Deus e a bênção divina. Leia os participantes e as responsabilidades nomeadas antes de construir uma aplicação.", "Na reflexão cristã proposta nesta aula, essa linguagem orienta a pensar a dignidade das pessoas e a responsabilidade por sua convivência. Uma aplicação possível é perguntar como nossas escolhas tratam a vida de quem está perto."],
        task: "Separe uma observação de Gênesis 1:27 de uma atitude atual que você deseja praticar.",
        sourceRefs: [creationPeople]
      },
      {
        id: "creation-care", title: "Cuidado inclui tarefa e limite",
        body: ["Gênesis 2:15 descreve uma tarefa de cultivo e guarda no jardim. O encerramento de 2:1–3 apresenta conclusão, repouso e bênção. Esses elementos permitem refletir sobre cuidado, responsabilidade e ritmo.", "Cristãos discutem de modos diferentes os dias da criação e as práticas de descanso. A aplicação desta aula é modesta: identificar uma responsabilidade concreta e uma forma de exercê-la com atenção à vida."],
        task: "Escolha um cuidado possível com uma pessoa, um espaço ou um recurso que esteja sob sua responsabilidade.",
        sourceRefs: [gardenCare, seventhDay]
      }
    ],
    workedExample: {
      sourceRefs: [gardenTask],
      title: "Observação e aplicação não são a mesma frase",
      prompt: "Como passar de Gênesis 2:15 a uma atitude de cuidado sem acrescentar uma regra que o versículo não informa?",
      steps: ["Localize a pessoa, o lugar e a tarefa descritos em Gênesis 2:15.", "Resuma a tarefa de cultivo e guarda como observação do relato.", "Pense em uma responsabilidade atual que você realmente possa exercer.", "Apresente essa proposta como aplicação e indique a passagem que motivou a reflexão."],
      answer: "O texto descreve uma tarefa no jardim. Cuidar com constância de um espaço compartilhado pode ser uma aplicação atual; o horário, o lugar e o plano concreto pertencem à situação de hoje. Essa distinção deixa o raciocínio conferível."
    },
    guidedPractice: {
      sourceRefs: [creationEvaluation, seventhDay],
      prompt: "Compare Gênesis 1:31 com 2:1–3. Que avaliação aparece e como o relato apresenta seu encerramento?",
      hints: ["Procure a avaliação do que foi feito no fim de Gênesis 1.", "Observe os verbos usados nos três primeiros versículos do capítulo 2.", "Conserve separadas sua descrição e a atitude que você deseja praticar hoje."],
      modelResponse: "O final de Gênesis 1 avalia o conjunto da criação como muito bom. O início do capítulo 2 apresenta conclusão, repouso e bênção. Pensar em um ritmo de cuidado é uma proposta de aplicação; não transforma a atividade do app em regra de calendário para todas as tradições."
    },
    activities: [
      {
        kind: "choice", id: "creation-choice", skill: "Conferir uma afirmação", sourceRefs: [gardenCare],
        prompt: "Qual anotação distingue melhor o relato de Gênesis 2:15 de uma aplicação atual?",
        hint: "Uma frase deve descrever a passagem; a outra, identificar explicitamente uma proposta para hoje.",
        options: [
          { id: "fixed-plan", text: "O versículo estabelece o mesmo plano de tarefas e horário para toda pessoa hoje.", feedback: "O versículo apresenta uma tarefa no jardim, mas não informa o plano e o horário de cada pessoa atual. Releia e identifique o que você acrescentou." },
          { id: "no-application", text: "Como minha situação é diferente, nenhuma reflexão sobre cuidado é possível.", feedback: "Podemos refletir a partir da passagem, mantendo visível a ponte entre relato e situação atual. A diferença de contexto pede cuidado na aplicação." },
          { id: "distinguish", text: "O relato apresenta cultivo e guarda; proponho cuidar de um espaço compartilhado como aplicação.", feedback: "A anotação identifica a base textual e a proposta atual. Outra pessoa pode conferir a primeira e conversar sobre a adequação da segunda." }
        ],
        correctOptionId: "distinguish"
      },
      {
        kind: "classify", id: "creation-classify", skill: "Distinguir evidência e aplicação", sourceRefs: [genesisOpening, creationPeople, seventhDay, gardenCare],
        prompt: "Classifique cada afirmação conforme sua relação com as passagens lidas.",
        hint: "Pergunte: consigo apontar isso no relato, é uma proposta atual ou a informação não foi fornecida?",
        categories: [{ id: "observation", label: "Observação do texto" }, { id: "application", label: "Aplicação atual" }, { id: "not-given", label: "Informação não fornecida" }],
        items: [
          { id: "good", text: "Gênesis 1:31 apresenta uma avaliação positiva do conjunto da criação.", categoryId: "observation", feedback: "A afirmação pode ser conferida na avaliação apresentada no versículo.", correction: "Confira Gênesis 1:31. Essa avaliação pertence ao relato, por isso é uma observação do texto." },
          { id: "shared-space", text: "Hoje vou organizar uma forma constante de cuidar de um espaço compartilhado.", categoryId: "application", feedback: "Você identificou uma decisão atual motivada pela reflexão sobre cuidado.", correction: "A passagem não descreve esse plano pessoal. Ele é uma proposta atual e deve ser identificado como aplicação." },
          { id: "modern-date", text: "As passagens informam a data do primeiro dia em um calendário moderno.", categoryId: "not-given", feedback: "Os versículos lidos não fornecem essa data de calendário moderno.", correction: "Procure essa informação nos localizadores indicados. Ela não é fornecida por essas passagens e exigiria outra investigação." },
          { id: "rest", text: "Gênesis 2:1–3 relaciona o encerramento da obra com repouso e bênção.", categoryId: "observation", feedback: "Essas ações aparecem no encerramento lido, sem precisar definir aqui uma prática confessional atual.", correction: "Leia os três versículos de Gênesis 2. O encerramento, o repouso e a bênção estão no texto; sua aplicação atual é outra etapa." }
        ]
      },
      {
        kind: "order", id: "creation-order", skill: "Acompanhar a sequência do relato", sourceRefs: [genesisOpening],
        prompt: "Organize estas ações na ordem em que aparecem em Gênesis 1:3–5.",
        hint: "A atividade segue a sequência narrativa dos versículos, sem converter os dias em uma cronologia moderna.",
        items: [
          { id: "names", text: "Deus nomeia Dia e Noite." },
          { id: "light", text: "A luz passa a estar presente no relato." },
          { id: "speaks", text: "Deus fala sobre a existência da luz." },
          { id: "evaluates", text: "Deus avalia a luz e a separa das trevas." }
        ],
        correctOrder: ["speaks", "light", "evaluates", "names"],
        correctFeedback: "Você acompanhou a sequência apresentada nesses versículos: fala, acontecimento, avaliação e separação, nomeação.",
        incorrectFeedback: "Releia Gênesis 1:3, 4 e 5 nessa ordem. Localize primeiro a fala, depois o acontecimento e as ações que o relato apresenta em seguida."
      }
    ],
    reflection: {
      scripture: "Registre uma das passagens de Gênesis e a edição lida.",
      observation: "Que ação, avaliação ou responsabilidade você conseguiu localizar no texto?",
      application: "Qual cuidado concreto e viável você pode assumir hoje? Escreva como aplicação, com respeito às pessoas envolvidas.",
      prayer: "Se desejar, expresse gratidão e uma pergunta sobre responsabilidade e cuidado em sua oração pessoal."
    },
    recap: ["Observe ações e padrões antes de acrescentar explicações.", "A reflexão sobre dignidade e cuidado precisa mostrar sua base textual.", "Relato e aplicação atual podem ser relacionados sem serem confundidos."],
    reviewPrompt: "Em outro dia, leia Gênesis 2:8–9. Sem seguir o exemplo desta aula, anote o que o texto descreve e uma pergunta que ainda exigiria investigação.",
  },
  {
    id: "jesus-e-o-proximo",
    title: "Jesus, o próximo e o cuidado",
    subtitle: "Acompanhe uma parábola e transforme a leitura em uma pergunta concreta sobre misericórdia.",
    theme: "Jesus",
    estimatedMinutes: 15,
    editorialStatus: "educational-pilot",
    objectives: [
      "Relacionar a parábola ao diálogo que a introduz e encerra.",
      "Reconhecer as ações de cuidado narradas na passagem.",
      "Propor uma aplicação de misericórdia que respeite a necessidade e a liberdade da outra pessoa."
    ],
    passages: [lukeStory, lukeQuestion, lukeCare, lukeEnding],
    cards: [
      {
        id: "neighbor-question", title: "Escute a pergunta que abre a história",
        body: ["Lucas 10:25–29 relata uma conversa sobre vida, amor a Deus e amor ao próximo. A pergunta sobre quem é o próximo prepara a história que Jesus conta em seguida.", "Ao ler uma parábola, conserve o diálogo ao redor. Ele ajuda a perceber por que a história foi contada e o que sua conclusão pede ao interlocutor."],
        task: "Encontre a pergunta de Lucas 10:29 antes de começar a história do caminho.",
        sourceRefs: [lukeQuestion]
      },
      {
        id: "neighbor-encounters", title: "Observe cada encontro",
        body: ["A narrativa acompanha um homem ferido e três personagens que passam pelo caminho. O relato identifica um sacerdote, um levita e um samaritano; compare o que cada um faz na história.", "Essas ações pertencem aos personagens desta narrativa. Transformar a história em julgamento de um povo ou de uma religião inteira vai além do que estamos observando."],
        task: "Leia Lucas 10:30–35 e marque a diferença entre perceber alguém e aproximar-se para cuidar.",
        sourceRefs: [lukeStory]
      },
      {
        id: "neighbor-care", title: "A compaixão ganha ações",
        body: ["Nos versículos 33–35, a compaixão é acompanhada de aproximação, atenção às feridas, transporte, hospedagem e recursos para a continuidade do cuidado. Repare que o relato desenvolve a ação além do primeiro encontro.", "Para pensar uma aplicação atual, pergunte o que a pessoa precisa, que ajuda você pode oferecer e quando é necessário procurar apoio adequado. Uma atitude cuidadosa considera a situação real."],
        task: "Localize duas ações de cuidado e explique como uma dá continuidade à outra.",
        sourceRefs: [lukeCare]
      },
      {
        id: "neighbor-conclusion", title: "Volte à pergunta final",
        body: ["Em Lucas 10:36–37, Jesus pergunta quem se tornou próximo do homem ferido. A resposta aponta a misericórdia, e o diálogo termina com um convite à prática.", "Uma aplicação responsável começa pequena e concreta: ouvir alguém, oferecer uma ajuda possível e cumprir o que foi combinado. O desempenho do jogo não mede a compaixão real de uma pessoa; a vida pede atenção continuada."],
        task: "Explique como a pergunta final ajuda a compreender a história inteira.",
        sourceRefs: [lukeEnding]
      }
    ],
    workedExample: {
      sourceRefs: [lukeCare, lukeEnding],
      title: "Encontre a ponte entre compaixão e ação",
      prompt: "Como conferir a afirmação de que a compaixão, nessa história, aparece em ações concretas?",
      steps: ["Leia Lucas 10:33 e identifique a reação do samaritano.", "Acompanhe as ações dos versículos 34 e 35.", "Observe que o cuidado continua na hospedaria.", "Relacione essas ações à resposta final sobre misericórdia."],
      answer: "O relato liga a compaixão à aproximação e a uma sequência de cuidados, incluindo apoio para sua continuidade. Uma aplicação atual pode retomar esse movimento, considerando os recursos, os limites e a vontade da pessoa que precisa de ajuda."
    },
    guidedPractice: {
      sourceRefs: [lukeWho, lukeEnding],
      prompt: "Compare Lucas 10:29 com 10:36–37. O que a pergunta final faz você observar na história?",
      hints: ["Na abertura, procure a pergunta sobre quem é o próximo.", "No final, observe quem agiu em relação ao homem ferido.", "Justifique sua resposta com uma ação da narrativa, além de uma palavra conhecida."],
      modelResponse: "A pergunta final direciona a atenção para quem se aproximou com misericórdia. As ações dos versículos 33–35 ajudam a explicar essa resposta. Na aplicação, posso perguntar como me tornar próximo de alguém em uma situação concreta."
    },
    activities: [
      {
        kind: "choice", id: "neighbor-choice", skill: "Justificar uma leitura", sourceRefs: [lukeCare, lukeEnding],
        prompt: "Qual resumo reúne a evidência da narrativa e sua conclusão?",
        hint: "Relacione as ações dos versículos 33–35 à pergunta dos versículos 36–37.",
        options: [
          { id: "mercy-action", text: "A misericórdia aparece em cuidado concreto e orienta a resposta à pergunta final.", feedback: "O resumo relaciona as ações à conclusão do diálogo. Outra pessoa pode conferir tanto os cuidados narrados quanto a resposta final." },
          { id: "group-ranking", text: "A história permite classificar todas as pessoas apenas pelo grupo a que pertencem.", feedback: "O relato descreve ações de personagens. Estender isso a todas as pessoas de um grupo acrescenta um julgamento que essa leitura não demonstra." },
          { id: "fixed-amount", text: "A conclusão estabelece uma quantia de dinheiro obrigatória para toda ajuda atual.", feedback: "A narrativa menciona recursos para o cuidado, mas a conclusão não fixa uma tabela universal de contribuições. Leia a resposta sobre misericórdia." }
        ],
        correctOptionId: "mercy-action"
      },
      {
        kind: "classify", id: "neighbor-classify", skill: "Distinguir relato e proposta", sourceRefs: [lukeStory, lukeCare],
        prompt: "O que pertence ao relato, à aplicação atual ou a uma informação que a passagem não fornece?",
        hint: "Procure uma referência para cada afirmação antes de decidir.",
        categories: [{ id: "story", label: "Informação do relato" }, { id: "application", label: "Aplicação atual" }, { id: "not-given", label: "Não informado no trecho" }],
        items: [
          { id: "inn", text: "O samaritano leva o homem para uma hospedaria e providencia continuidade de cuidado.", categoryId: "story", feedback: "Essas ações podem ser conferidas em Lucas 10:34–35.", correction: "Leia os versículos 34 e 35. Hospedagem e continuidade do cuidado são informações da narrativa." },
          { id: "ask-help", text: "Hoje posso perguntar a uma pessoa de que ajuda ela precisa e oferecer algo viável.", categoryId: "application", feedback: "Essa é uma proposta atual inspirada no cuidado observado, com atenção à pessoa real.", correction: "A frase descreve uma decisão para hoje. Ela é uma aplicação proposta, não uma nova informação sobre o episódio." },
          { id: "victim-name", text: "A passagem fornece o nome e a idade exata do homem ferido.", categoryId: "not-given", feedback: "Esses detalhes não são informados na unidade lida.", correction: "Confira o início da história e seu desenvolvimento. A unidade não fornece nome e idade exata do homem." },
          { id: "compassion", text: "O relato associa o samaritano à compaixão pelo homem que encontrou.", categoryId: "story", feedback: "A reação é narrada no versículo 33 e desenvolvida nas ações seguintes.", correction: "Localize Lucas 10:33. A compaixão pertence ao relato; o que você fará hoje a partir dela é uma etapa de aplicação." }
        ]
      },
      {
        kind: "order", id: "neighbor-order", skill: "Reconhecer continuidade do cuidado", sourceRefs: [lukeCare],
        prompt: "Reconstitua o cuidado narrado em Lucas 10:33–35.",
        hint: "Siga o que acontece no caminho, depois na hospedaria e na partida.",
        items: [
          { id: "stay", text: "Transporta o homem até uma hospedaria e cuida dele." },
          { id: "notice", text: "Vê o homem e se compadece." },
          { id: "continuity", text: "Deixa recursos e combina a continuidade do cuidado com o hospedeiro." },
          { id: "approach", text: "Aproxima-se e atende às feridas." }
        ],
        correctOrder: ["notice", "approach", "stay", "continuity"],
        correctFeedback: "A sequência mostra que o cuidado se desenvolve e continua além do primeiro gesto. A ordem corresponde à narrativa, não a um protocolo atual de primeiros socorros.",
        incorrectFeedback: "Releia Lucas 10:33–35. Observe primeiro a reação, depois a aproximação, a hospedagem e o que é providenciado na partida."
      }
    ],
    reflection: {
      scripture: "Registre Lucas 10:25–37 e a edição usada.",
      observation: "Que ação da história ajuda você a explicar a resposta final sobre misericórdia?",
      application: "Qual gesto de cuidado pode ser combinado com alguém de forma respeitosa, possível e responsável?",
      prayer: "Se desejar, ore sobre a disposição de perceber e cuidar. Não é necessário registrar ou compartilhar uma história íntima."
    },
    recap: ["A parábola responde a um diálogo que precisa ser lido junto.", "Misericórdia é observada nas ações e na conclusão da história.", "Aplicar o cuidado hoje exige atenção à necessidade real da outra pessoa."],
    reviewPrompt: "Em outro dia, leia Mateus 7:12. Formule uma aplicação respeitosa em uma situação nova e explique a relação com o que aprendeu sobre o próximo, sem dizer que os dois textos são idênticos.",
  },
  {
    id: "orar-com-sentido",
    title: "Orar com atenção e sentido",
    subtitle: "Explore o ensino de Jesus sobre intenção, confiança e necessidades da vida.",
    theme: "Oração",
    estimatedMinutes: 15,
    editorialStatus: "educational-pilot",
    objectives: [
      "Identificar a intenção e a confiança tratadas em Mateus 6:5–8.",
      "Reconhecer os assuntos presentes no modelo de oração de Mateus 6:9–13.",
      "Usar esses assuntos em uma reflexão pessoal, sem medir fé pela quantidade de palavras."
    ],
    passages: [prayerWhole, prayerContext, prayerModel],
    cards: [
      {
        id: "prayer-intention", title: "Preste atenção à intenção",
        body: ["Mateus 6:5–8 trata do modo e da intenção com que se ora. Observe a crítica à busca de reconhecimento e a confiança no Pai que conhece as necessidades.", "O convite a um momento reservado pode ajudar a reunir a atenção. A pergunta de estudo é: o que está orientando a oração que o texto descreve?"],
        task: "Identifique no texto uma busca de aparência e uma orientação de confiança.",
        sourceRefs: [prayerContext]
      },
      {
        id: "prayer-words", title: "Palavras precisam de sentido",
        body: ["O alerta dos versículos 7–8 questiona a ideia de ser ouvido por acumular palavras. Leia essa motivação junto do restante da passagem.", "Cristãos usam orações recebidas em suas comunidades e orações formuladas em suas próprias palavras. Nesta aula, vamos procurar atenção ao significado e ao ensino do texto; formas litúrgicas e práticas confessionais têm seu contexto de estudo."],
        task: "Explique por que contar palavras não seria uma boa avaliação desta aprendizagem.",
        sourceRefs: [prayerContext]
      },
      {
        id: "prayer-model", title: "Acompanhe os assuntos da oração",
        body: ["No modelo de Mateus 6:9–13, observe primeiro a referência ao Pai, ao nome, ao Reino e à vontade de Deus. Em seguida, acompanhe os pedidos relativos ao pão, ao perdão e ao livramento.", "Esses assuntos permitem pensar a relação com Deus e a vida cotidiana em conjunto. O exercício de organizar a passagem ajuda a entendê-la; não define sozinho o formato de toda oração cristã."],
        task: "Localize um pedido relacionado às necessidades da vida e outro ligado à convivência.",
        sourceRefs: [prayerModel]
      },
      {
        id: "prayer-life", title: "Leve a reflexão à vida",
        body: ["O pedido de perdão convida a observar a própria responsabilidade e a relação com outras pessoas. Transformar essa reflexão em ação pede honestidade, respeito e atenção aos limites de cada situação.", "Você pode usar um momento breve para ler, compreender um pedido e orar com atenção. O app não dá nota a orações, não exige exposição pessoal e não registra suas palavras."],
        task: "Escolha um dos assuntos da passagem e reflita sobre o que ele significa na sua prática.",
        sourceRefs: [prayerModel]
      }
    ],
    workedExample: {
      sourceRefs: [prayerModel],
      title: "Compreender um pedido antes de repeti-lo",
      prompt: "Como estudar o pedido relacionado ao pão de cada dia?",
      steps: ["Localize Mateus 6:11 dentro da oração completa.", "Identifique o pedido e sua referência às necessidades da vida.", "Observe que ele aparece junto de outros pedidos, como perdão e livramento.", "Reflita sobre necessidade, gratidão e cuidado com outras pessoas sem transformar o texto em garantia de um resultado específico."],
      answer: "O pedido pode orientar uma reflexão sobre dependência e necessidades cotidianas no conjunto da oração. A aplicação pessoal pode incluir gratidão e responsabilidade com o que se tem, mantendo o texto distinto de uma promessa de atender imediatamente a qualquer desejo."
    },
    guidedPractice: {
      sourceRefs: [prayerModel],
      prompt: "Leia Mateus 6:9–13 e encontre dois assuntos que você consegue explicar com suas palavras.",
      hints: ["Escolha assuntos concretos da passagem, como pão ou perdão.", "Indique o versículo em que você os encontrou.", "Se quiser orar depois, mantenha essa reflexão no seu caderno ou em sua oração pessoal."],
      modelResponse: "Uma resposta de estudo pode localizar necessidades da vida no versículo 11 e perdão no versículo 12. Explicar os assuntos mostra compreensão da passagem; a oração pessoal não precisa ser enviada ou avaliada pelo aplicativo."
    },
    activities: [
      {
        kind: "choice", id: "prayer-choice", skill: "Ler a motivação do ensino", sourceRefs: [prayerContext],
        prompt: "Qual ideia é questionada pelo ensino de Mateus 6:7–8?",
        hint: "Observe por que as pessoas mencionadas no alerta pensam que serão ouvidas.",
        options: [
          { id: "no-needs", text: "A ideia de que necessidades da vida podem ser apresentadas em oração.", feedback: "O próprio modelo inclui pedidos ligados à vida. O alerta se dirige à confiança em acumular palavras como meio de ser ouvido." },
          { id: "quantity", text: "A ideia de que a quantidade de palavras, por si só, garante ser ouvido.", feedback: "Essa motivação aparece no alerta. A passagem relaciona a oração à confiança no Pai que conhece as necessidades, não a uma pontuação por extensão." },
          { id: "all-received-words", text: "A ideia de que qualquer oração aprendida com outra pessoa é automaticamente inadequada.", feedback: "A passagem apresenta um modelo a ser aprendido. Para conferir o alerta, observe a motivação citada nos versículos 7–8, em vez de julgar toda formulação recebida." }
        ],
        correctOptionId: "quantity"
      },
      {
        kind: "classify", id: "prayer-classify", skill: "Reconhecer pedidos e limites", sourceRefs: [prayerContext, prayerModel],
        prompt: "Separe o que aparece no modelo, uma proposta de estudo e uma promessa que o trecho não faz.",
        hint: "Confira os versículos 9–13 antes de escolher a categoria.",
        categories: [{ id: "request", label: "Assunto presente no modelo" }, { id: "study", label: "Proposta de estudo atual" }, { id: "not-promised", label: "Promessa não feita no trecho" }],
        items: [
          { id: "bread", text: "O pedido ligado ao pão de cada dia.", categoryId: "request", feedback: "O assunto pode ser localizado em Mateus 6:11.", correction: "Confira Mateus 6:11. O pedido ligado ao pão está presente no modelo." },
          { id: "immediate", text: "A garantia de receber imediatamente qualquer desejo por usar muitas palavras.", categoryId: "not-promised", feedback: "Essa garantia não é feita no trecho e a motivação de acumular palavras é questionada.", correction: "Releia os versículos 7–8 e os pedidos de 9–13. A passagem não faz essa garantia." },
          { id: "notebook", text: "Anotar no caderno uma pergunta sobre o significado de um dos pedidos.", categoryId: "study", feedback: "Esse é um recurso atual para compreender e refletir, não uma regra de formato apresentada na oração.", correction: "A anotação no caderno é uma proposta pedagógica desta aula. Identifique-a como estudo atual." },
          { id: "forgiveness", text: "O pedido relacionado ao perdão.", categoryId: "request", feedback: "O assunto está presente em Mateus 6:12 e relaciona oração e convivência.", correction: "Localize Mateus 6:12. O perdão é um dos assuntos do modelo lido." }
        ]
      },
      {
        kind: "order", id: "prayer-order", skill: "Compreender a organização da passagem", sourceRefs: [prayerModel],
        prompt: "Organize estes grupos de assuntos na sequência de Mateus 6:9–13.",
        hint: "Siga os versículos; a atividade não determina a ordem de toda oração pessoal.",
        items: [
          { id: "bread", text: "Pedido ligado ao pão de cada dia." },
          { id: "forgiveness-deliverance", text: "Pedidos relacionados a perdão e livramento." },
          { id: "father-name", text: "Referência ao Pai e à santificação do nome." },
          { id: "kingdom-will", text: "Pedidos relacionados ao Reino e à vontade de Deus." }
        ],
        correctOrder: ["father-name", "kingdom-will", "bread", "forgiveness-deliverance"],
        correctFeedback: "Você acompanhou a organização do modelo em Mateus. Compreender sua sequência ajuda a perceber os assuntos, sem avaliar a fé pela reprodução de uma fórmula.",
        incorrectFeedback: "Confira Mateus 6:9, 10, 11 e 12–13. Reorganize os grupos seguindo a ordem da passagem, mantendo juntos os assuntos agrupados nos cartões."
      }
    ],
    reflection: {
      scripture: "Anote Mateus 6:5–13 e a edição que leu.",
      observation: "Que motivação o ensino questiona e que confiança ele apresenta?",
      application: "Qual assunto da oração você deseja compreender e praticar com mais atenção?",
      prayer: "Se desejar, ore com suas palavras ou com uma formulação de sua comunidade, prestando atenção ao que está dizendo. Guarde esse momento para você."
    },
    recap: ["Observe a intenção e a confiança tratadas no texto.", "Compreenda os assuntos do modelo de oração.", "Reflexão pessoal e oração não recebem pontuação nem precisam ser expostas."],
    reviewPrompt: "Em outro dia, leia Lucas 11:1–4. Observe a pergunta que antecede a oração e identifique um assunto que você consegue explicar sem abrir esta aula. Compare as passagens com atenção, preservando suas diferenças.",
  },
  {
    id: "compartilhar-com-respeito",
    title: "Compartilhar a fé com respeito",
    subtitle: "Pratique escuta, clareza e cuidado ao conversar sobre a esperança cristã.",
    theme: "Vida cristã",
    estimatedMinutes: 18,
    editorialStatus: "educational-pilot",
    objectives: [
      "Relacionar explicação da esperança, mansidão, respeito e conduta.",
      "Reconhecer como uma observação do contexto aparece no discurso de Atos 17.",
      "Preparar uma conversa breve e voluntária, com fonte conferível e liberdade para perguntar ou recusar."
    ],
    passages: [respect, athensOpening, athensSpeech, romansLove],
    cards: [
      {
        id: "sharing-listen", title: "Comece escutando",
        body: ["1 Pedro 3:15–16 relaciona a disposição de responder sobre a esperança com mansidão, respeito e boa consciência. Observe a relação entre o conteúdo da resposta e a maneira de oferecê-la.", "Uma aplicação para a conversa atual é perguntar se a pessoa gostaria de falar sobre fé e ouvir a dúvida que ela realmente apresenta. Escutar ajuda a responder à pessoa, em vez de repetir um discurso que não conversa com sua pergunta."],
        task: "Formule uma pergunta simples que permita à outra pessoa escolher se quer conversar.",
        sourceRefs: [respect]
      },
      {
        id: "sharing-tone", title: "O modo de responder também ensina",
        body: ["Mansidão e respeito fazem parte da orientação lida. Uma resposta pode ser clara e convicta sem humilhar quem pergunta. Reconhecer uma dúvida e conferir uma fonte é uma atitude de responsabilidade.", "Acolher uma pessoa inclui respeitar seus limites e preservar histórias pessoais. A quantidade de conversas ou de respostas certas no app não mede fé, conversão ou preparo para um cargo na igreja."],
        task: "Pense em uma forma respeitosa de dizer que precisa conferir uma informação antes de responder.",
        sourceRefs: [respect]
      },
      {
        id: "sharing-context", title: "Observe o contexto e explique o conteúdo",
        body: ["Em Atos 17:22–24, Paulo começa mencionando o que observou em Atenas, incluindo um altar. A partir dessa observação, apresenta Deus como Criador. O restante do discurso desenvolve um conteúdo próprio, com arrependimento e ressurreição nos versículos 30–31.", "Ler essa passagem ajuda a perguntar como uma conversa se relaciona com o contexto. A aula não transforma cada detalhe do discurso em um roteiro obrigatório para toda situação."],
        task: "Identifique uma observação do ambiente e uma afirmação do discurso, indicando onde as encontrou.",
        sourceRefs: [athensOpening, athensSpeech]
      },
      {
        id: "sharing-care", title: "Mantenha cuidado e responsabilidade",
        body: ["Romanos 12:9–18 liga amor e convivência a atitudes como hospitalidade, participação na alegria e no sofrimento, e busca de paz. O cuidado com a pessoa continua importante durante uma conversa sobre fé.", "Uma conversa responsável pode terminar com uma pergunta aberta, uma referência para conferir ou a aceitação de que a pessoa prefere parar. Preparar-se inclui conhecer o que você está dizendo e reconhecer seus limites."],
        task: "Escreva um encerramento que dê liberdade para continuar em outro momento ou encerrar a conversa.",
        sourceRefs: [respect, romansLove]
      }
    ],
    workedExample: {
      sourceRefs: [respect],
      title: "Uma conversa breve, com espaço para a outra pessoa",
      prompt: "Como responder a alguém que pergunta sobre a esperança cristã sem pressionar ou inventar uma resposta?",
      steps: ["Pergunte se a pessoa deseja conversar naquele momento.", "Ouça a pergunta e confira se você a compreendeu.", "Ofereça uma explicação breve, identificando uma passagem que você consegue conferir.", "Deixe espaço para uma nova pergunta e para a pessoa continuar ou encerrar a conversa."],
      answer: "Uma resposta de estudo pode apresentar um aspecto da esperança cristã, indicar sua referência e perguntar o que a outra pessoa gostaria de compreender. Se uma questão ultrapassa o que você sabe, reconheça isso e proponha conferir. A sequência é um exemplo de conversa respeitosa, não uma garantia de resultado nem uma fórmula obrigatória."
    },
    guidedPractice: {
      sourceRefs: [respect],
      prompt: "Uma pessoa diz: ‘Tenho perguntas sobre a fé, mas não quero uma discussão’. Como você poderia acolher esse pedido?",
      hints: ["Reconheça o limite que a pessoa apresentou.", "Pergunte qual dúvida ela gostaria de conversar.", "Ofereça escuta e uma fonte conferível, sem inventar uma fala bíblica."],
      modelResponse: "Uma resposta possível seria acolher o pedido de conversar com calma, perguntar o que a pessoa deseja compreender e oferecer a leitura de uma passagem se ela quiser. Respeitar a decisão de parar também faz parte desse cuidado."
    },
    activities: [
      {
        kind: "choice", id: "sharing-choice", skill: "Aplicar respeito à conversa", sourceRefs: [respect],
        prompt: "Você oferece uma conversa sobre fé, e a pessoa responde que prefere não conversar hoje. Qual atitude combina com a aplicação estudada?",
        hint: "Considere a orientação de responder com mansidão e respeito e a liberdade da outra pessoa.",
        options: [
          { id: "long-message", text: "Enviar imediatamente uma longa mensagem, mesmo sem ela querer continuar.", feedback: "O conteúdo pode ser importante para você, mas a pessoa apresentou um limite. Nesta aplicação, o cuidado inclui respeitar sua decisão e deixar uma possibilidade de conversa futura." },
          { id: "judge", text: "Usar a recusa para julgar o valor pessoal dela.", feedback: "Uma recusa naquele momento não autoriza humilhar nem classificar a pessoa. Retome a orientação de mansidão e respeito." },
          { id: "respect-choice", text: "Respeitar a decisão e deixar aberta, sem pressão, a possibilidade de outro momento.", feedback: "Essa resposta conserva o respeito e a liberdade da pessoa. Ela não impede convicção ou preparação; orienta a forma de se relacionar." }
        ],
        correctOptionId: "respect-choice"
      },
      {
        kind: "classify", id: "sharing-classify", skill: "Revisar atitudes de comunicação", sourceRefs: [respect, romansLove],
        prompt: "Classifique as atitudes à luz do respeito e da responsabilidade estudados.",
        hint: "Observe escuta, fonte, honestidade e cuidado com a outra pessoa.",
        categories: [{ id: "careful", label: "Ajuda uma conversa cuidadosa" }, { id: "revise", label: "Precisa ser revisto" }],
        items: [
          { id: "listen", text: "Ouvir a pergunta antes de escolher a resposta.", categoryId: "careful", feedback: "A escuta ajuda a responder à dúvida real e a respeitar quem perguntou.", correction: "Essa atitude permite compreender a pessoa e sua pergunta. Ela ajuda uma conversa cuidadosa." },
          { id: "invent-quote", text: "Apresentar uma frase de memória como citação bíblica sem conferir se ela existe.", categoryId: "revise", feedback: "Você identificou a necessidade de conferir a fonte antes de atribuir palavras à Bíblia.", correction: "Atribuir uma frase sem conferência pode desinformar. Essa atitude precisa ser revista; localize a passagem antes de citá-la." },
          { id: "acknowledge", text: "Reconhecer uma dúvida e combinar uma conferência antes de responder.", categoryId: "careful", feedback: "Reconhecer limites e buscar uma fonte é uma prática de honestidade e responsabilidade.", correction: "Não saber uma resposta imediatamente não impede o respeito. Admitir a dúvida e conferir ajuda a cuidar da conversa." },
          { id: "private-story", text: "Expor uma história íntima de outra pessoa para tornar o argumento mais forte.", categoryId: "revise", feedback: "O cuidado inclui preservar histórias pessoais. A conversa deve buscar uma fonte adequada sem usar a intimidade alheia como recurso.", correction: "Essa exposição precisa ser revista. Respeito e boa conduta incluem cuidado com a história e a liberdade das pessoas." }
        ]
      },
      {
        kind: "order", id: "sharing-order", skill: "Recordar um procedimento de conversa", sourceRefs: [respect],
        prompt: "Reconstitua a sequência do exemplo resolvido desta aula.",
        hint: "É uma possível organização da conversa: confira o exemplo, preservando espaço para a escolha da outra pessoa.",
        items: [
          { id: "explain", text: "Oferecer uma explicação breve com uma referência conferível." },
          { id: "permission", text: "Perguntar se a pessoa deseja conversar naquele momento." },
          { id: "freedom", text: "Deixar espaço para uma nova pergunta e para continuar ou encerrar." },
          { id: "listen", text: "Ouvir a pergunta e conferir se a compreendeu." }
        ],
        correctOrder: ["permission", "listen", "explain", "freedom"],
        correctFeedback: "Você recordou a sequência do exemplo. Ela organiza a prática de escuta e respeito; as conversas reais exigem atenção e flexibilidade.",
        incorrectFeedback: "Retome o exemplo: escolha de conversar, escuta da pergunta, explicação com fonte e espaço para a outra pessoa. Essa é a sequência proposta na atividade, não uma regra numérica da passagem."
      }
    ],
    reflection: {
      scripture: "Anote 1 Pedro 3:15–16 e uma referência de Atos 17 que ajudou você a pensar a conversa.",
      observation: "Que relação o texto apresenta entre esperança, resposta e modo de agir?",
      application: "Prepare uma abertura e um encerramento respeitosos para uma conversa voluntária. Não registre histórias íntimas de terceiros.",
      prayer: "Se desejar, ore por sabedoria, mansidão e cuidado com as pessoas. Essa reflexão pessoal não é enviada ao app."
    },
    recap: ["Escute a pergunta e respeite a liberdade de conversar.", "Ofereça explicações com fontes conferíveis e reconheça seus limites.", "Conteúdo, modo de responder e cuidado com a pessoa caminham juntos."],
    reviewPrompt: "Em outro dia, leia Colossenses 4:5–6. Sem reler os cartões primeiro, explique uma qualidade da conversa descrita ali e uma aplicação em uma situação diferente.",
  }
];

export function getCourseLesson(id: string): CourseLesson | undefined {
  return additionalLessons.find((lesson) => lesson.id === id);
}
