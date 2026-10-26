export type PassageReference = Readonly<{
  book: "ACT" | "LUK";
  chapter: number;
  startVerse: number;
  endVerse: number;
  label: string;
}>;

export type LessonSkill = "locate" | "observe" | "contextualize" | "verify" | "transfer";
export type LessonQuestion = Readonly<{
  id: string;
  kind: "diagnostic" | "guided" | "retrieval" | "transfer" | "delayed";
  prompt: string;
  skill: LessonSkill;
  evidenceMode: "open-book" | "without-looking";
  options: readonly Readonly<{
    id: string;
    text: string;
    explanation: string;
    sourceRefs: readonly PassageReference[];
  }>[];
  correctOptionId: string;
  hint: string;
  sourceRefs: readonly PassageReference[];
  teachingRef: string;
}>;

export type LessonLens = Readonly<{
  id: "literary" | "spatial" | "historical" | "cultural" | "biblical" | "practical";
  title: string;
  question: string;
  explanation: string;
  task: string;
  limit: string;
  sourceRefs: readonly PassageReference[];
}>;

const acts: PassageReference = { book: "ACT", chapter: 17, startVerse: 10, endVerse: 12, label: "Atos 17:10–12" };
const acts11: PassageReference = { book: "ACT", chapter: 17, startVerse: 11, endVerse: 11, label: "Atos 17:11" };
const acts10: PassageReference = { book: "ACT", chapter: 17, startVerse: 10, endVerse: 10, label: "Atos 17:10" };
const acts12: PassageReference = { book: "ACT", chapter: 17, startVerse: 12, endVerse: 12, label: "Atos 17:12" };
const actsContext: PassageReference = { book: "ACT", chapter: 17, startVerse: 1, endVerse: 12, label: "Atos 17:1–12" };
const luke: PassageReference = { book: "LUK", chapter: 10, startVerse: 25, endVerse: 37, label: "Lucas 10:25–37" };
const lukeOpening: PassageReference = { book: "LUK", chapter: 10, startVerse: 25, endVerse: 29, label: "Lucas 10:25–29" };

function choice(id: string, text: string, explanation: string, ...sourceRefs: PassageReference[]) {
  return { id, text, explanation, sourceRefs };
}

const diagnostic: LessonQuestion = {
  id: "pp-diagnostic", kind: "diagnostic", skill: "verify", evidenceMode: "open-book",
  prompt: "Você encontra uma afirmação acompanhada de um versículo. Qual seria um bom primeiro passo para conferir a afirmação?",
  options: [
    choice("context", "Localizar a passagem e ler o que vem antes e depois.", "Esse é o procedimento que vamos praticar: primeiro localizar, depois observar a unidade e conferir a afirmação. Seu ponto de partida não recebe nota.", acts),
    choice("confidence", "Decidir pela segurança com que a pessoa falou.", "A confiança de quem fala não substitui a leitura. Vamos aprender a procurar evidência sem atacar a pessoa que apresentou a ideia.", acts11),
    choice("familiar", "Escolher a explicação que já parece familiar.", "Familiaridade pode ajudar a lembrar, mas também pode fazer uma conclusão parecer certa antes da conferência. Esta pergunta não recebe nota.", acts11)
  ],
  correctOptionId: "context", hint: "Pense em uma ação que você conseguiria repetir com sua própria Bíblia.",
  sourceRefs: [acts], teachingRef: "workedExample"
};

const missions: readonly LessonQuestion[] = [
  {
    id: "pp-mission-1", kind: "guided", skill: "locate", evidenceMode: "open-book",
    prompt: "A referência Atos 17:10–12 pede qual leitura?",
    options: [
      choice("range", "O livro de Atos, capítulo 17, versículos 10 a 12.", "Na convenção de referência usada nesta aula, o nome identifica o livro, 17 identifica o capítulo e 10–12 delimita os versículos. O trecho contém três versículos.", acts),
      choice("chapters", "Os capítulos 10, 11 e 12 do livro de Atos.", "Os números depois dos dois-pontos indicam versículos nesta referência. Volte à legenda do exemplo e tente localizar o trecho novamente.", acts),
      choice("book", "O décimo sétimo livro da Bíblia, capítulos 10 a 12.", "O livro já foi nomeado: Atos. A ordem dos livros no sumário não é o significado do número 17 nessa referência.", acts)
    ],
    correctOptionId: "range", hint: "Leia a referência em três partes: nome do livro, capítulo, intervalo de versículos.",
    sourceRefs: [acts], teachingRef: "workedExample.referenceKey"
  },
  {
    id: "pp-mission-2", kind: "guided", skill: "observe", evidenceMode: "open-book",
    prompt: "Qual dupla é mencionada no deslocamento para Bereia em Atos 17:10?",
    options: [
      choice("paul-silas", "Paulo e Silas.", "Os nomes aparecem no versículo 10. Localizar os participantes é uma observação do texto; não exige adivinhar uma informação fora da passagem.", acts10),
      choice("peter-john", "Pedro e João.", "Esses nomes pertencem a outros relatos de Atos, mas não são a dupla identificada neste versículo. Releia o trecho indicado.", acts10),
      choice("not-stated", "O trecho não identifica ninguém.", "O versículo identifica a dupla. A expressão 'não informado' deve ser usada quando a informação realmente não aparece, e não no lugar da conferência.", acts10)
    ],
    correctOptionId: "paul-silas", hint: "Procure os nomes próprios no início da unidade.",
    sourceRefs: [acts10], teachingRef: "workedExample.observation"
  },
  {
    id: "pp-mission-3", kind: "guided", skill: "verify", evidenceMode: "open-book",
    prompt: "Qual resumo de Atos 17:11 pode ser sustentado pelo próprio versículo?",
    options: [
      choice("receive-examine", "O relato associa a recepção da mensagem à conferência nas Escrituras.", "O resumo reúne duas ações descritas no versículo. A resposta deve apontar o trecho que a sustenta, mesmo quando a edição usa palavras diferentes.", acts11),
      choice("never-check", "O relato dispensa a conferência quando o mensageiro é conhecido.", "Essa dispensa não aparece no versículo e contraria a ação de exame ali descrita. Uma conclusão familiar precisa continuar sujeita à leitura.", acts11),
      choice("same-translation", "O relato determina uma tradução moderna para todas as pessoas.", "O versículo não nomeia uma tradução moderna. Essa conclusão acrescentaria uma informação que a passagem não fornece.", acts11)
    ],
    correctOptionId: "receive-examine", hint: "Observe as ações atribuídas às pessoas, em vez de procurar apenas uma palavra isolada.",
    sourceRefs: [acts11], teachingRef: "workedExample.evidence"
  },
  {
    id: "pp-mission-4", kind: "guided", skill: "contextualize", evidenceMode: "open-book",
    prompt: "Uma pessoa afirma que Atos 17:10–12 exige exatamente vinte minutos de leitura diária. Como avaliar essa afirmação?",
    options: [
      choice("not-duration", "O trecho fala de exame das Escrituras, mas não informa esse número de minutos.", "A duração de 15–20 minutos é uma estimativa de organização da aula. Não é uma regra numérica encontrada nesses versículos.", acts),
      choice("duration-rule", "A estimativa da aula prova que esse é o tempo determinado no trecho.", "Uma decisão de desenho do aplicativo não vira uma afirmação bíblica. Separe a informação do texto da organização do estudo atual.", acts),
      choice("nothing-useful", "Sem um número de minutos, a passagem não permite nenhuma observação.", "Ainda podemos observar participantes, ações e resultados. Reconhecer um limite não elimina o que a passagem efetivamente informa.", acts)
    ],
    correctOptionId: "not-duration", hint: "Você consegue apontar o número de minutos em algum dos três versículos?",
    sourceRefs: [acts], teachingRef: "lenses.historical"
  },
  {
    id: "pp-mission-5", kind: "guided", skill: "observe", evidenceMode: "open-book",
    prompt: "Ao comparar os versículos 11 e 12, qual procedimento ajuda a evitar uma leitura apressada?",
    options: [
      choice("read-sequence", "Ler a sequência, resumir as ações e conferir o resultado mencionado.", "O versículo 11 descreve ações e o 12 apresenta um resultado no relato. Ler a sequência ajuda a justificar o resumo sem preencher detalhes ausentes.", acts11, acts12),
      choice("one-word", "Escolher uma palavra do versículo 12 e ignorar o restante.", "Uma palavra isolada não mostra a relação entre as partes da unidade. Retome a sequência antes de formular a conclusão.", acts),
      choice("invent-details", "Completar a história com detalhes imaginados para ela parecer mais clara.", "Podemos formular perguntas e hipóteses, mas elas precisam ser identificadas. Detalhes imaginados não devem ser apresentados como informação do texto.", acts)
    ],
    correctOptionId: "read-sequence", hint: "Pergunte: quem age, o que faz e que resultado é narrado?",
    sourceRefs: [acts], teachingRef: "guidedPractice"
  },
  {
    id: "pp-mission-6", kind: "guided", skill: "verify", evidenceMode: "open-book",
    prompt: "Qual anotação permite a outra pessoa conferir sua descoberta?",
    options: [
      choice("traceable", "Registrar a edição, Atos 17:11 e a ação que você observou ali.", "Edição, referência e observação tornam o raciocínio verificável. A anotação é uma prática de estudo ensinada nesta aula, não uma exigência de formato escrita no versículo.", acts11),
      choice("no-reference", "Anotar apenas que uma explicação pareceu bonita.", "Uma impressão pode ser registrada, mas não identifica a passagem nem a evidência para outra pessoa conferir. Acrescente referência e observação.", acts11),
      choice("person-only", "Anotar somente o nome de quem apresentou a explicação.", "A autoria da explicação é útil, mas não substitui sua base textual. Registre também a passagem e o que nela sustenta a afirmação.", acts11)
    ],
    correctOptionId: "traceable", hint: "Outra pessoa conseguiria encontrar e conferir a mesma informação a partir da sua nota?",
    sourceRefs: [acts11], teachingRef: "workedExample.application"
  }
];

const retrievalQuestions: readonly LessonQuestion[] = [
  {
    id: "pp-retrieve-1", kind: "retrieval", skill: "locate", evidenceMode: "without-looking",
    prompt: "Sem consultar o exemplo, o que vem depois do nome do livro em Atos 17:10–12?",
    options: [
      choice("chapter", "O capítulo e, depois dos dois-pontos, os versículos.", "A sequência aprendida é livro → capítulo → versículos. Confira depois de responder; se precisou consultar, registre que foi uma retomada com ajuda.", acts),
      choice("year", "O ano histórico do episódio e sua duração.", "A referência localiza o texto; ela não informa o ano histórico nem o tempo de leitura. Volte à legenda se essa distinção ainda estiver difícil.", acts),
      choice("score", "A dificuldade e a pontuação da passagem.", "Dificuldade e pontuação não fazem parte dessa convenção de referência. Elas também não medem o valor espiritual de quem estuda.", acts)
    ],
    correctOptionId: "chapter", hint: "Tente recordar as três partes da legenda antes de abrir o exemplo.",
    sourceRefs: [acts], teachingRef: "workedExample.referenceKey"
  },
  {
    id: "pp-retrieve-2", kind: "retrieval", skill: "verify", evidenceMode: "without-looking",
    prompt: "Qual par de ações estudamos no relato de Atos 17:11?",
    options: [
      choice("receive-check", "Receber a mensagem e conferir nas Escrituras.", "Esse foi o resumo observado no trecho. Ele pode ser expresso com suas próprias palavras, sem exigir uma formulação idêntica entre traduções.", acts11),
      choice("hear-skip", "Ouvir e dispensar qualquer conferência.", "O exame foi uma das ações observadas. Se você esqueceu, releia a passagem e depois pratique com outra pergunta; uma resposta corrigida não comprova retenção tardia.", acts11),
      choice("time-rank", "Cronometrar e classificar a fé dos participantes.", "Essas ações não foram apresentadas no texto estudado. A aula também não usa desempenho para classificar a fé de ninguém.", acts11)
    ],
    correctOptionId: "receive-check", hint: "Lembre do que as pessoas fazem com a mensagem e de como a conferem.",
    sourceRefs: [acts11], teachingRef: "workedExample.evidence"
  },
  {
    id: "pp-retrieve-3", kind: "retrieval", skill: "contextualize", evidenceMode: "without-looking",
    prompt: "Se uma informação não aparece na passagem, qual cuidado aprendemos?",
    options: [
      choice("mark-limit", "Identificar o limite e separar observação de hipótese ou aplicação.", "Podemos perguntar e investigar mais, conservando a distinção entre o que foi observado e o que ainda precisa de fonte ou justificativa.", acts),
      choice("fill-gap", "Completar a lacuna com uma hipótese e apresentá-la como fato.", "Uma hipótese pode orientar investigação, mas precisa ser identificada e verificada. Preencher a lacuna sem avisar faz perder a rastreabilidade.", acts),
      choice("abandon", "Desistir de toda a leitura, porque nenhuma conclusão é possível.", "O limite de uma informação não elimina as observações que o texto permite. Aprender também envolve reconhecer o que ainda não sabemos.", acts)
    ],
    correctOptionId: "mark-limit", hint: "Compare 'o texto descreve' com 'eu imagino' ou 'vou aplicar assim'.",
    sourceRefs: [acts], teachingRef: "lenses"
  }
];

const transferQuestion: LessonQuestion = {
  id: "pp-transfer", kind: "transfer", skill: "transfer", evidenceMode: "open-book",
  prompt: "Agora leia Lucas 10:25–37, um texto diferente. Antes de explicar a parábola, qual conferência ajuda a situá-la no diálogo?",
  options: [
    choice("opening-dialogue", "Ler as perguntas e respostas de Lucas 10:25–29 e relacioná-las à narrativa seguinte.", "Os versículos iniciais apresentam o diálogo que antecede a parábola. Aplicar a outro texto o procedimento de ler o entorno é uma tarefa de transferência, que ainda precisa ser acompanhada de sua justificativa.", lukeOpening, luke),
    choice("ignore-opening", "Começar por uma frase isolada e dispensar o diálogo anterior.", "Isso repete o risco que a aula ensinou a evitar. Leia os participantes, as perguntas e as respostas antes de propor uma explicação.", lukeOpening, luke),
    choice("same-details", "Supor que todos os participantes e lugares são os mesmos de Atos 17.", "O procedimento de leitura pode ser reutilizado, mas os detalhes de uma passagem não são transferidos automaticamente para outra. Confira os dados do novo texto.", luke, acts)
  ],
  correctOptionId: "opening-dialogue", hint: "Aplique o procedimento; não tente repetir os nomes ou a resposta de Atos.",
  sourceRefs: [lukeOpening, luke], teachingRef: "workedExample"
};

export const firstLesson = {
  id: "primeiros-passos",
  version: 1,
  title: "Encontrar o texto e fazer boas perguntas",
  subtitle: "Uma primeira prática de leitura bíblica com contexto e conferência.",
  editorialStatus: "educational-pilot" as const,
  editorialLabel: "Piloto educacional · revisão humana especializada pendente",
  audience: "Linguagem introdutória para jovens e adultos; menores podem explorar com acompanhamento, sem enviar respostas pessoais.",
  estimatedMinutes: { minimum: 15, maximum: 20 },
  pacingNote: "Este é um tempo sugerido. Você pode pausar, reler ou levar mais tempo; o relógio não determina se aprendeu.",
  perspective: "Núcleo de letramento bíblico. Não representa ensino oficial de uma denominação.",
  objectives: [
    { id: "locate", statement: "Localizar livro, capítulo e intervalo de versículos.", successCriterion: "Encontrar outra referência e explicar suas três partes sem seguir o exemplo passo a passo." },
    { id: "observe", statement: "Distinguir uma observação do texto de um detalhe não informado.", successCriterion: "Apontar uma ação do trecho e um limite do que ele permite afirmar." },
    { id: "verify", statement: "Conferir uma afirmação e registrar sua referência.", successCriterion: "Explicar onde encontrou apoio para um resumo, identificando a edição lida." },
    { id: "transfer", statement: "Reutilizar o procedimento em uma passagem diferente.", successCriterion: "Examinar o diálogo que antecede uma nova narrativa e justificar por que ele importa." }
  ],
  passages: { main: acts, context: actsContext, transfer: luke },
  preparation: {
    title: "Prepare sua mesa e suas perguntas",
    message: "Recomendamos estudar com sua Bíblia física aberta ao lado e um caderno de papel para conferir e anotar. Se não os tiver agora, acompanhe pelo leitor do app e retome depois.",
    checklist: ["Escolha um momento em que possa ler com atenção.", "Tenha a Bíblia e um caderno por perto, se possível.", "Observe o nome da edição usada no leitor.", "Lembre: dúvidas e erros orientam o próximo passo; não recebem julgamento espiritual."],
    diagnostic
  },
  context: {
    title: "Observe o relato antes de tirar uma conclusão",
    paragraphs: [
      "A aula trabalha uma pequena unidade de Atos. Os versículos 10–12 mencionam um deslocamento para Bereia, a recepção da mensagem, uma conferência nas Escrituras e um resultado no relato.",
      "O capítulo ao redor oferece mais contexto. Nesta primeira prática, vamos observar o que esses versículos permitem afirmar e deixar visível o que ainda exigiria investigação.",
      "Nome do livro, capítulo e números de versículo são instrumentos para localizar a passagem. Eles ajudam a encontrá-la; não substituem a leitura de uma unidade com sentido."
    ],
    diagram: {
      title: "Uma sequência para conferir no relato",
      items: ["Localizar Atos 17", "Ler os versículos 10–12", "Observar participantes e ações", "Conferir o que o resumo afirma"],
      caption: "Esquema autoral do procedimento de estudo. Não é um mapa geográfico nem uma cronologia histórica.",
      sourceRefs: [acts]
    }
  },
  workedExample: {
    title: "Um exemplo resolvido, passo a passo",
    reference: acts,
    referenceKey: [{ label: "Atos", meaning: "Nome do livro" }, { label: "17", meaning: "Capítulo" }, { label: "10–12", meaning: "Versículos 10, 11 e 12" }],
    question: "Qual atitude diante da mensagem é descrita no versículo 11?",
    thinkAloud: [
      "Primeiro encontro Atos no sumário; em seguida, o capítulo 17 e os versículos indicados.",
      "Leio os três versículos para não depender de uma frase recortada.",
      "Observo as ações do versículo 11 e confiro se meu resumo reúne apenas o que consegui localizar.",
      "Registro a edição, a referência e uma pergunta que ainda precisa de investigação."
    ],
    observation: "O relato associa a recepção da mensagem à conferência nas Escrituras.",
    evidence: "A base dessa observação é Atos 17:11. Confira as ações descritas na edição que está lendo; a formulação pode variar entre traduções.",
    interpretationBoundary: "O trecho não determina vinte minutos de estudo nem apresenta um sumário de todas as edições bíblicas atuais. Essas informações não devem ser acrescentadas ao resumo como se estivessem escritas ali.",
    application: "Uma aplicação de estudo é conferir o texto antes de repetir uma afirmação, registrando sua referência. Essa aplicação atual precisa ser distinguida da descrição dos acontecimentos.",
    sourceRefs: [acts]
  },
  guidedPractice: {
    title: "Agora faça uma observação com ajuda",
    reference: acts12,
    prompt: "Leia Atos 17:12. Quem é mencionado e qual resultado aparece no relato? Procure sua resposta no próprio versículo.",
    hints: ["Procure os grupos ou pessoas nomeados.", "Observe o que acontece, sem acrescentar uma duração ou uma quantidade que não esteja informada.", "Relacione a frase ao que acabou de ler no versículo 11."],
    modelResponse: "O versículo relata que muitas pessoas creram e menciona mulheres gregas de destaque e muitos homens. A redação concreta deve ser conferida na edição escolhida; não use esta paráfrase para substituir a leitura.",
    selfCheck: "Sua resposta aponta uma informação do versículo e distingue o que não foi informado? Se ainda precisou de uma dica, isso indica o próximo ponto para praticar.",
    sourceRefs: [acts11, acts12]
  },
  lenses: [
    { id: "literary", title: "Literária", question: "Como esta unidade se organiza?", explanation: "Leia participantes, ações e resultado. Observe como os versículos se ligam, em vez de escolher apenas uma palavra conhecida.", task: "Encontre uma ação do versículo 11 e diga onde ela aparece.", limit: "Esta aula usa a edição identificada no leitor. Não apresenta uma análise lexical grega nem conclui o sentido por etimologias isoladas.", sourceRefs: [acts] },
    { id: "spatial", title: "Espacial", question: "Que lugares o relato menciona?", explanation: "O entorno menciona Tessalônica e o versículo 10 apresenta o deslocamento para Bereia. Esses nomes podem ser localizados no texto antes de consultar um mapa.", task: "Confira onde aparece Bereia e releia o começo do capítulo para situar a referência anterior.", limit: "O esquema desta aula não fixa coordenadas, distância, rota detalhada ou duração da viagem. Esses dados exigiriam fontes específicas.", sourceRefs: [actsContext, acts10] },
    { id: "historical", title: "Histórica", question: "O que é descrito e o que ainda precisa de fonte?", explanation: "O relato é a fonte primária que estamos lendo. Nesta prática, separar sua descrição de uma reconstrução histórica é mais importante do que memorizar uma data não demonstrada.", task: "Identifique uma afirmação sustentada pelo trecho e outra informação que ele não fornece.", limit: "Não fixamos neste piloto o ano do episódio, uma duração diária de leitura ou um cenário reconstruído como certeza.", sourceRefs: [acts] },
    { id: "cultural", title: "Cultural", question: "Estou projetando minha rotina atual sobre o relato?", explanation: "O trecho fala em conferência nas Escrituras. A sua Bíblia física e o caderno ajudam no estudo atual, mas não são uma descrição de como cada participante do relato estudava.", task: "Separe o que o texto menciona de um recurso moderno usado nesta aula.", limit: "Estes versículos não descrevem o exemplar individual de cada leitor nem todos os procedimentos de leitura. Não preencher essa lacuna por imaginação.", sourceRefs: [acts10, acts11] },
    { id: "biblical", title: "Bíblica", question: "Como a leitura do entorno ajuda a conferir?", explanation: "Atos 17:1–12 oferece o contexto anterior desta unidade. Releia o entorno e procure relações que o próprio capítulo apresenta.", task: "Explique como os versículos 10, 11 e 12 contribuem para o seu resumo.", limit: "Uma palavra parecida em outro livro não basta para demonstrar que duas passagens ensinam exatamente o mesmo ponto.", sourceRefs: [actsContext, acts] },
    { id: "practical", title: "Prática", question: "Que procedimento posso repetir com responsabilidade?", explanation: "Você pode praticar a conferência de uma afirmação, a escuta e o registro de dúvidas. Uma resposta deve indicar sua base, mantendo respeito pelas pessoas.", task: "Anote a referência e uma observação que outra pessoa consiga conferir.", limit: "O desempenho desta atividade não mede fé, santidade, salvação ou aptidão para cargo. Não é necessário divulgar oração ou relato íntimo.", sourceRefs: [acts11] }
  ] satisfies readonly LessonLens[],
  soap: {
    title: "Leve a descoberta ao seu caderno",
    introduction: "Use seu caderno físico. As perguntas abaixo são convites de reflexão, sem envio de oração ou anotação pessoal ao servidor nesta aula.",
    prompts: [
      { id: "soap-observe", dimensions: ["Escritura", "Observação"], prompt: "Qual edição e passagem você leu? Registre uma observação e a referência que permite conferi-la." },
      { id: "soap-apply", dimensions: ["Aplicação"], prompt: "Como você pode conferir uma afirmação com mais cuidado hoje? Indique uma ação concreta e diferencie sua aplicação da descrição do relato." },
      { id: "soap-pray", dimensions: ["Oração"], prompt: "Que pergunta ou aprendizado você deseja levar à oração? Anote somente se quiser; essa reflexão não precisa ser compartilhada." }
    ]
  },
  game: {
    id: "detetive-do-contexto-primeiros-passos",
    title: "Detetive do Contexto",
    description: "Seis missões para localizar, observar e justificar. Você pode consultar a passagem, receber dicas e tentar outra vez, sem punição por erro.",
    evidenceNote: "O jogo é prática guiada. Uma resposta corrigida após feedback demonstra uma nova tentativa, não retenção comprovada.",
    missions
  },
  retrievalQuestions,
  transferQuestion,
  review: {
    schedule: [
      { afterDays: 1, title: "Retome sem olhar primeiro", task: "Tente explicar como localizar uma referência e como conferir uma afirmação. Depois abra a passagem, compare e corrija suas notas." },
      { afterDays: 7, title: "Use o procedimento em outro texto", task: "Escolha uma nova passagem com começo e fim identificáveis. Localize, leia o entorno e justifique uma observação com referência." }
    ],
    scheduleNote: "Um e sete dias são uma regra inicial de produto para testar, não intervalos ideais universais ou um resultado já comprovado neste aplicativo.",
    selfAssessment: [
      { skill: "Localizar", withHelp: "Encontro a passagem seguindo a legenda.", independently: "Encontro outra referência e explico suas partes sem repetir o exemplo." },
      { skill: "Conferir", withHelp: "Identifico uma observação usando uma dica.", independently: "Aponto a evidência e reconheço um limite da passagem sem precisar da dica." },
      { skill: "Transferir", withHelp: "Leio o entorno de outro texto com orientação.", independently: "Explico por que o contexto da nova passagem importa e justifico minha resposta." }
    ],
    assessmentNote: "Esta rubrica orienta sua autoavaliação. Ela não substitui análise por professor nem comprova eficácia do método.",
    delayedQuestions: [
      { ...retrievalQuestions[2], id: "pp-delayed-1", kind: "delayed" as const, prompt: "Ao retomar em outro dia, explique primeiro: o que você faz quando uma explicação acrescenta um detalhe que não encontrou na passagem?" },
      { ...transferQuestion, id: "pp-delayed-2", kind: "delayed" as const, prompt: "Em uma nova leitura de Lucas 10:25–37, qual parte do diálogo você conferiria para explicar por que a parábola é contada?" }
    ]
  },
  sourceNote: "Comentários e atividades autorais do projeto, baseados nos localizadores indicados. O texto bíblico deve vir da edição identificada no leitor, com seus próprios direitos e atribuição. Nenhuma tradução bíblica foi reproduzida neste arquivo.",
  evaluationNote: "Piloto educacional. Conteúdo, adequação etária e instrumentos ainda precisam de revisão humana especializada e avaliação com estudantes antes de alegar eficácia do método."
};

export type FirstLesson = typeof firstLesson;
