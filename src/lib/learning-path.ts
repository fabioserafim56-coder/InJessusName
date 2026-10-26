export type AgeBand = "6_9" | "10_12" | "13_17" | "18_plus";
export type TraditionCode = "ccb" | "roman_catholic" | "evangelical_protestant" | null;
export type BaptismStatus = "not_informed" | "not_baptized" | "baptized";
export type LearningGoal = "bible_foundations" | "christian_service" | "theology_history";
export type LearningExperience = "children" | "bridge" | "youth" | "adult";

export type LearningProfileInput = Readonly<{
  ageBand: AgeBand;
  traditionCode: TraditionCode;
  baptismStatus: BaptismStatus;
  goal: LearningGoal;
}>;

export type LearningTopic = Readonly<{
  id: string;
  title: string;
  description: string;
}>;

type LearningDescription = Readonly<{ label: string; description: string }>;

export type LearningPath = Readonly<{
  experience: LearningExperience;
  ageBand: AgeBand;
  title: string;
  greeting: string;
  introduction: string;
  audienceLabel: string;
  formatLabel: string;
  formatDescription: string;
  objective: LearningDescription;
  perspective: LearningDescription;
  nextFocus: LearningDescription;
  topics: readonly LearningTopic[];
  studyInvitation: Readonly<{ title: string; description: string }>;
  privacyNote: string;
}>;

const commonPerspective: LearningDescription = {
  label: "Núcleo cristão comum",
  description: "Uma introdução à Bíblia e ao Cristianismo, com as fontes e as diferentes perspectivas identificadas. Não é preciso escolher uma igreja para começar."
};

const agePaths: Record<Exclude<AgeBand, "18_plus">, Omit<LearningPath, "ageBand" | "perspective" | "privacyNote">> = {
  "6_9": {
    experience: "children",
    title: "Uma descoberta de cada vez.",
    greeting: "Histórias, perguntas e cuidado para começar.",
    introduction: "Este roteiro propõe conhecer as narrativas bíblicas com linguagem simples, espaço para perguntas e a companhia de um adulto responsável.",
    audienceLabel: "Infantil · 6 a 9 anos",
    formatLabel: "Histórias e pequenas descobertas",
    formatDescription: "O planejamento combina histórias ilustradas, conversas e atividades curtas. O ritmo respeita a atenção e a curiosidade da criança.",
    objective: {
      label: "Conhecer com acolhimento",
      description: "Começar pela narrativa bíblica, pelo cuidado com as pessoas e por perguntas que possam ser conversadas em família."
    },
    nextFocus: {
      label: "Aprender em companhia",
      description: "Um adulto responsável pode acompanhar a leitura e escutar as perguntas. Nesta exploração pública não pedimos igreja ou situação de batismo."
    },
    topics: [
      { id: "children-creation", title: "Um começo cheio de perguntas", description: "Conhecer a narrativa da criação em Gênesis, observar suas imagens e conversar sobre o cuidado com o mundo e com as pessoas." },
      { id: "children-jesus", title: "Conhecendo Jesus", description: "Aproximar-se das histórias dos Evangelhos e de seus ensinamentos sobre amor, acolhimento e convivência." },
      { id: "children-bible", title: "Minha primeira descoberta na Bíblia", description: "Reconhecer livros, capítulos e versículos com a ajuda de um adulto, sem pressa e com atividades adequadas à idade." },
      { id: "children-living", title: "O que aprendemos juntos", description: "Conversar, desenhar e lembrar atitudes de cuidado que podem fazer parte da vida em casa e na comunidade." }
    ],
    studyInvitation: {
      title: "Uma Bíblia aberta e alguém por perto.",
      description: "Escolham um momento tranquilo. O adulto pode ajudar na leitura e acolher as perguntas sem transformar a descoberta em uma cobrança."
    }
  },
  "10_12": {
    experience: "bridge",
    title: "Investigar. Encontrar. Compreender.",
    greeting: "Sua curiosidade tem lugar neste caminho.",
    introduction: "O percurso Ponte propõe investigar o mundo bíblico como quem segue pistas: observar o texto, localizar lugares, comparar informações e fazer boas perguntas.",
    audienceLabel: "Ponte · 10 a 12 anos",
    formatLabel: "Investigação bíblica",
    formatDescription: "Mapas, objetos do mundo antigo e desafios de encontrar passagens na Bíblia física orientarão atividades próprias para esta faixa etária.",
    objective: {
      label: "Descobrir com contexto",
      description: "Aprender a distinguir o que está no texto, o que uma fonte histórica informa e o que ainda precisa ser investigado."
    },
    nextFocus: {
      label: "Perguntar também é aprender",
      description: "O roteiro valoriza a investigação e a conversa com um adulto responsável. Não coletamos igreja ou situação de batismo nesta exploração."
    },
    topics: [
      { id: "bridge-text", title: "As pistas estão no texto", description: "Observar personagens, palavras repetidas e o que acontece antes e depois de uma passagem, conferindo na Bíblia física." },
      { id: "bridge-maps", title: "Lugares, caminhos e distâncias", description: "Explorar como mapas e paisagens ajudam a compreender os relatos bíblicos, sempre identificando a origem das informações." },
      { id: "bridge-history", title: "Objetos que ajudam a perguntar", description: "Investigar moedas, medidas e objetos antigos com fontes apropriadas. Uma imagem ou um objeto não será apresentado como prova sem contexto." },
      { id: "bridge-gospels", title: "Investigando os Evangelhos", description: "Conhecer os relatos sobre Jesus e comparar seus contextos, registrando descobertas e perguntas para conversar." }
    ],
    studyInvitation: {
      title: "Sua Bíblia, um caderno e boas perguntas.",
      description: "Anote a passagem que chamou sua atenção, o que você observou e o que deseja investigar. Não é preciso ter todas as respostas para começar."
    }
  },
  "13_17": {
    experience: "youth",
    title: "Perguntas de hoje. Raízes na Palavra.",
    greeting: "Um espaço para aprender, refletir e conversar.",
    introduction: "Este roteiro propõe aproximar o estudo bíblico das perguntas da juventude, com contexto, escuta e respeito ao tempo de cada pessoa.",
    audienceLabel: "Jovens · 13 a 17 anos",
    formatLabel: "Contexto, reflexão e diálogo",
    formatDescription: "O planejamento combina panoramas visuais, leitura atenta e reflexões sobre convivência, escolhas e vida em comunidade.",
    objective: {
      label: "Compreender e relacionar",
      description: "Conhecer os textos bíblicos em seus contextos e desenvolver perguntas para uma reflexão cristã responsável sobre a vida cotidiana."
    },
    nextFocus: {
      label: "Seu tempo e sua privacidade",
      description: "A exploração é pública e não pede informações sobre sua igreja ou batismo. Um perfil religioso salvo para menores exige proteção específica e participação adequada de um responsável."
    },
    topics: [
      { id: "youth-overview", title: "A grande narrativa bíblica", description: "Percorrer os grandes temas da Bíblia, da narrativa da criação aos Evangelhos e às primeiras comunidades cristãs." },
      { id: "youth-context", title: "Antes de tirar uma conclusão", description: "Observar gênero literário, contexto e destinatários. Aprender a conferir uma passagem antes de aplicá-la a uma situação atual." },
      { id: "youth-questions", title: "Fé e perguntas da juventude", description: "Propor reflexões sobre amizade, responsabilidade, justiça e convivência, com cuidado e sem expor experiências pessoais publicamente." },
      { id: "youth-history", title: "O Cristianismo através do tempo", description: "Conhecer, com fontes identificadas, como comunidades cristãs se desenvolveram e por que existem diferentes tradições." }
    ],
    studyInvitation: {
      title: "Espaço para observar antes de responder.",
      description: "Leia com sua Bíblia ao lado. Registre uma descoberta, uma pergunta e uma possível aplicação, sem obrigação de compartilhar anotações pessoais."
    }
  }
};

const objectives: Record<LearningGoal, LearningDescription & { title: string; topics: readonly LearningTopic[] }> = {
  bible_foundations: {
    label: "Aprender a Bíblia do começo",
    title: "Um começo com contexto e clareza.",
    description: "Construir uma visão da Bíblia e aprender a ler uma passagem com atenção ao seu contexto, uma descoberta de cada vez.",
    topics: [
      { id: "bible-narrative", title: "A grande narrativa bíblica", description: "Organizar os principais temas: criação, aliança, história de Israel, vida de Jesus e primeiras comunidades cristãs, distinguindo narrativa e investigação histórica." },
      { id: "bible-reading", title: "Como ler uma passagem", description: "Reconhecer livros, capítulos e versículos; observar o contexto, o gênero literário e as perguntas que o próprio texto apresenta." },
      { id: "bible-gospels", title: "Jesus e os Evangelhos", description: "Conhecer os relatos dos Evangelhos, seus destinatários e os temas centrais da vida e do ensino de Jesus." }
    ]
  },
  christian_service: {
    label: "Aprender para servir",
    title: "Conhecer para servir com cuidado.",
    description: "Aprofundar conhecimento bíblico, bom testemunho e cuidado com as pessoas. Um percurso educacional não concede cargo ou reconhecimento ministerial.",
    topics: [
      { id: "service-scripture", title: "Serviço à luz das Escrituras", description: "Estudar o contexto de passagens sobre serviço, responsabilidade e cuidado com a comunidade, com a Bíblia aberta para conferir." },
      { id: "service-witness", title: "Bom testemunho e convivência", description: "Refletir sobre integridade, humildade, responsabilidades familiares e respeito às pessoas, sem transformar o estudo em avaliação de aptidão para cargos." },
      { id: "service-care", title: "Escutar e cuidar com responsabilidade", description: "Conhecer princípios de acolhimento, discrição e respeito à dignidade, reconhecendo os limites do papel de quem presta auxílio." }
    ]
  },
  theology_history: {
    label: "Teologia e história do Cristianismo",
    title: "Conhecer as raízes. Entender os caminhos.",
    description: "Relacionar narrativa bíblica, reflexão teológica e história do Cristianismo até os dias atuais, identificando fontes e perspectivas.",
    topics: [
      { id: "history-narrative", title: "Da narrativa bíblica às primeiras comunidades", description: "Organizar a visão do conjunto e distinguir afirmações dos textos, interpretações confessionais e evidências históricas." },
      { id: "history-theology", title: "As perguntas da teologia", description: "Conhecer as abordagens exegética, bíblica, sistemática, histórica e prática, com exemplos e fundamentos identificáveis." },
      { id: "history-church", title: "A história da Igreja e suas fontes", description: "Investigar os desenvolvimentos do Cristianismo através do tempo e aprender a situar documentos em sua época, autoria e contexto." }
    ]
  }
};

const perspectives: Record<Exclude<TraditionCode, null>, LearningDescription> = {
  ccb: {
    label: "Perspectiva CCB",
    description: "Um caminho de conhecimento bíblico e zelo, distinguindo estudo pedagógico de documentos institucionais. Orientações específicas só integrarão o ensino após autenticação e revisão das fontes."
  },
  roman_catholic: {
    label: "Perspectiva católica",
    description: "O planejamento considera Escritura, Tradição e Magistério na perspectiva católica, respeitando seu cânone e identificando as fontes de cada ensinamento."
  },
  evangelical_protestant: {
    label: "Perspectivas evangélicas e protestantes",
    description: "O planejamento apresenta raízes da Reforma e diferentes perspectivas históricas, reformadas, batistas e pentecostais, sem atribuir uma única interpretação a todas elas."
  }
};

const baptismFocus: Record<BaptismStatus, LearningDescription> = {
  not_informed: {
    label: "Aprender no seu tempo",
    description: "Você pode estudar os fundamentos e explorar este roteiro sem informar sua situação de batismo. Essa escolha não limita seu acesso ao núcleo de estudo."
  },
  not_baptized: {
    label: "Fundamentos e acolhimento",
    description: "As sugestões começam por quem é Jesus, os fundamentos da fé e o sentido do batismo em cada tradição, com acolhimento e espaço para suas perguntas."
  },
  baptized: {
    label: "Fé vivida em comunidade",
    description: "As sugestões incluem discipulado, comunhão e responsabilidades na convivência cristã, sempre identificando a perspectiva da tradição estudada."
  }
};

function traditionTopic(input: LearningProfileInput): LearningTopic {
  if (input.traditionCode === "ccb") {
    return {
      id: "perspective-ccb",
      title: input.goal === "christian_service"
        ? "Guia de Zelo Doutrinário, Bom Testemunho e Conhecimento dos Santos Serviços"
        : "Conhecendo a perspectiva da CCB",
      description: "Um eixo de estudo bíblico, história e vivência comunitária. Documentos e orientações serão apresentados com origem, data e revisão; o aplicativo é independente e não habilita para funções ministeriais."
    };
  }
  if (input.traditionCode === "roman_catholic") {
    return {
      id: "perspective-catholic",
      title: "Escritura e vida cristã na tradição católica",
      description: "Um eixo para conhecer as relações entre Escritura, Tradição, Magistério e vida comunitária. Leituras e recursos dependerão de fontes autorizadas e adequadas ao cânone católico."
    };
  }
  if (input.traditionCode === "evangelical_protestant") {
    return {
      id: "perspective-protestant",
      title: "Raízes e caminhos das tradições protestantes",
      description: "Um eixo sobre Reforma, discipulado e vida comunitária, com as diferenças históricas e confessionais identificadas e fontes próprias para cada perspectiva."
    };
  }
  return {
    id: "perspective-common",
    title: "Conhecer a fé cristã com acolhimento",
    description: "Um eixo de fundamentos, história e convivência para quem está explorando a fé. Você pode aprender sem definir um vínculo eclesiástico e conhecer as perspectivas em seu próprio tempo."
  };
}

/**
 * Builds a proposed study itinerary; it never asserts that lessons are published.
 * For minors, only the age band is used, even if other fields arrive by mistake.
 * Persisting or validating a profile belongs to the authenticated server flow.
 */
export function buildLearningPath(input: LearningProfileInput): LearningPath {
  if (input.ageBand !== "18_plus") {
    return {
      ...agePaths[input.ageBand],
      ageBand: input.ageBand,
      objective: { ...agePaths[input.ageBand].objective },
      perspective: { ...commonPerspective },
      nextFocus: { ...agePaths[input.ageBand].nextFocus },
      topics: agePaths[input.ageBand].topics.map((topic) => ({ ...topic })),
      studyInvitation: { ...agePaths[input.ageBand].studyInvitation },
      privacyNote: "Este percurso público usa somente a faixa etária escolhida. Não cria um perfil religioso nem salva informações sobre igreja, batismo ou objetivos pessoais."
    };
  }

  const objective = objectives[input.goal];
  return {
    experience: "adult",
    ageBand: "18_plus",
    title: objective.title,
    greeting: "Seu caminho pode começar com uma boa pergunta.",
    introduction: "Este roteiro reúne estudo da Bíblia, teologia e vivência cristã. As sugestões acompanham suas escolhas e podem ser revistas conforme suas perguntas e seu momento de vida.",
    audienceLabel: "Adultos · 18 anos ou mais",
    formatLabel: "Estudo com contexto e profundidade",
    formatDescription: "O planejamento propõe aulas de 15 a 20 minutos, Bíblia física ao lado, seis lentes de contexto e reflexão pelo método S.O.A.P.",
    objective: { label: objective.label, description: objective.description },
    perspective: { ...(input.traditionCode ? perspectives[input.traditionCode] : commonPerspective) },
    nextFocus: { ...baptismFocus[input.baptismStatus] },
    topics: [...objective.topics.map((topic) => ({ ...topic })), traditionTopic(input)],
    studyInvitation: {
      title: "Sua Bíblia aberta. Espaço para refletir.",
      description: "Tenha sua Bíblia física e um caderno por perto. Confira as passagens, registre observações, pense em uma aplicação e reserve um momento para a oração."
    },
    privacyNote: "As escolhas de personalização pertencem a você. Um percurso salvo deve ficar associado somente à sua conta, e a autorização para essa personalização pode ser revogada."
  };
}
