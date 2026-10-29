/** Editorial reading guides. References are resolved against the unmodified BLIVRE corpus. */
export type BibleTopicPassage = Readonly<{ bookId: string; chapter: number; verse: number; endVerse?: number; note: string }>;
export type BibleTopic = Readonly<{ id: string; title: string; aliases: readonly string[]; introduction: string; passages: readonly BibleTopicPassage[] }>;

export const bibleTopics: readonly BibleTopic[] = [
  { id: "batismo", title: "Batismo", aliases: ["batismo", "batizar", "batizado", "batizada", "batismos", "batizai", "batizando"], introduction: "Vamos acompanhar o batismo de Jesus, a missão confiada aos discípulos e a reflexão de Paulo. As tradições cristãs diferem quanto à idade, ao modo e ao sentido sacramental do batismo; leia cada passagem em seu contexto.", passages: [
    { bookId: "MAT", chapter: 3, verse: 13, endVerse: 17, note: "Jesus vai ao encontro de João: observe quem participa da cena e o que acontece após o batismo." },
    { bookId: "MAT", chapter: 28, verse: 18, endVerse: 20, note: "O batismo aparece junto de fazer discípulos e ensinar, no encerramento de Mateus." },
    { bookId: "ACT", chapter: 2, verse: 37, endVerse: 41, note: "Leia a resposta de Pedro às pessoas que ouviram sua pregação em Jerusalém." },
    { bookId: "ROM", chapter: 6, verse: 1, endVerse: 4, note: "Paulo relaciona o batismo à morte e à vida com Cristo; acompanhe o argumento do capítulo." }
  ] },
  { id: "oracao", title: "Oração", aliases: ["oração", "orar", "orações", "pai nosso", "orar a deus"], introduction: "A oração tem lugar na alegria, na dúvida e no sofrimento. Comece pelo ensino de Jesus e observe a simplicidade de suas palavras.", passages: [
    { bookId: "MAT", chapter: 6, verse: 5, endVerse: 13, note: "Jesus ensina a orar sem transformar o encontro com Deus em exibição." },
    { bookId: "LUK", chapter: 11, verse: 1, endVerse: 4, note: "Os discípulos pedem para aprender a orar; compare esse relato com Mateus 6." },
    { bookId: "PHP", chapter: 4, verse: 6, endVerse: 7, note: "Paulo convida a apresentar as inquietações a Deus com gratidão." }
  ] },
  { id: "salvacao", title: "Salvação e graça", aliases: ["salvação", "salvar", "salvo", "salva", "graça", "vida eterna"], introduction: "Leia o amor de Deus em João e a relação entre graça, fé e boas obras em Efésios. Essas passagens merecem ser ouvidas em conjunto.", passages: [
    { bookId: "JHN", chapter: 3, verse: 14, endVerse: 17, note: "A conversa com Nicodemos situa a conhecida declaração sobre o amor de Deus." },
    { bookId: "EPH", chapter: 2, verse: 8, endVerse: 10, note: "Observe a sequência: graça, fé e uma vida chamada às boas obras." },
    { bookId: "TIT", chapter: 3, verse: 4, endVerse: 7, note: "A misericórdia de Deus ocupa o centro da reflexão desta carta." }
  ] },
  { id: "perdao", title: "Perdão e reconciliação", aliases: ["perdão", "perdoar", "perdoado", "reconciliação", "reconciliar"], introduction: "O perdão atravessa a oração, a convivência e o cuidado com quem foi ferido. Reconciliar-se não exige aceitar violência nem abandonar a busca de proteção e justiça.", passages: [
    { bookId: "MAT", chapter: 18, verse: 21, endVerse: 35, note: "A pergunta de Pedro abre uma parábola sobre a misericórdia recebida e compartilhada." },
    { bookId: "EPH", chapter: 4, verse: 31, endVerse: 32, note: "O chamado ao perdão aparece entre orientações concretas para a vida em comunidade." },
    { bookId: "LUK", chapter: 15, verse: 11, endVerse: 24, note: "A parábola apresenta um pai que acolhe o filho que retorna; leia também o diálogo com o filho mais velho." }
  ] },
  { id: "fe", title: "Fé e confiança", aliases: ["fé", "confiar", "confiança", "crer", "incredulidade", "duvida", "dúvidas"], introduction: "Na Bíblia, a confiança caminha com perguntas e aprendizado. Veja pessoas que procuram Jesus levando tanto esperança quanto fragilidade.", passages: [
    { bookId: "HEB", chapter: 11, verse: 1, endVerse: 6, note: "O capítulo apresenta exemplos de fé; não os separe de suas histórias e dificuldades." },
    { bookId: "MRK", chapter: 9, verse: 20, endVerse: 24, note: "Um pai apresenta a Jesus um pedido de ajuda e admite sua dificuldade em crer." },
    { bookId: "JHN", chapter: 20, verse: 24, endVerse: 29, note: "Tomé e os outros discípulos são recebidos pelo Cristo ressuscitado." }
  ] },
  { id: "espirito-santo", title: "Espírito Santo", aliases: ["espírito santo", "pentecostes", "consolador", "dons espirituais"], introduction: "Acompanhe a promessa de Jesus, o relato de Pentecostes e a orientação de Paulo sobre os dons a serviço da comunidade.", passages: [
    { bookId: "JHN", chapter: 14, verse: 16, endVerse: 17, note: "A promessa é feita por Jesus em sua conversa de despedida com os discípulos." },
    { bookId: "ACT", chapter: 2, verse: 1, endVerse: 13, note: "Observe as pessoas, as línguas e a reação da multidão no relato de Pentecostes." },
    { bookId: "1CO", chapter: 12, verse: 4, endVerse: 11, note: "A diversidade dos dons é relacionada ao bem comum, não a uma disputa de valor entre pessoas." }
  ] },
  { id: "amor", title: "Amor a Deus e ao próximo", aliases: ["amor", "amar", "caridade", "próximo", "compaixão"], introduction: "O amor bíblico ganha forma no cuidado. Leia o mandamento de Jesus, a parábola do samaritano e o ensino de Paulo à comunidade.", passages: [
    { bookId: "MAT", chapter: 22, verse: 34, endVerse: 40, note: "Jesus relaciona o amor a Deus ao amor ao próximo ao responder sobre a Lei." },
    { bookId: "LUK", chapter: 10, verse: 25, endVerse: 37, note: "Pergunte quem se aproxima da pessoa ferida e que cuidado oferece." },
    { bookId: "1CO", chapter: 13, verse: 1, endVerse: 7, note: "A passagem está entre dois capítulos sobre dons e vida comunitária." }
  ] },
  { id: "esperanca", title: "Esperança", aliases: ["esperança", "esperar em deus", "desânimo", "desanimado"], introduction: "A esperança cristã não apaga as lágrimas. Estas passagens aproximam perseverança, consolo e a promessa de renovação.", passages: [
    { bookId: "ROM", chapter: 5, verse: 1, endVerse: 5, note: "Paulo relaciona esperança ao amor de Deus e à perseverança em meio às tribulações." },
    { bookId: "PSA", chapter: 42, verse: 5, endVerse: 11, note: "O salmista conversa com a própria alma enquanto lamenta e espera." },
    { bookId: "REV", chapter: 21, verse: 1, endVerse: 5, note: "A visão de renovação inclui a promessa de que Deus enxugará as lágrimas." }
  ] },
  { id: "ansiedade", title: "Ansiedade e preocupações", aliases: ["ansiedade", "ansioso", "ansiosa", "preocupação", "preocupações", "angústia"], introduction: "Você pode ler estas palavras de cuidado sem culpa por sentir ansiedade. O apoio de pessoas de confiança e o cuidado profissional podem caminhar com a fé.", passages: [
    { bookId: "MAT", chapter: 6, verse: 25, endVerse: 34, note: "Observe as imagens dos pássaros e das flores no ensino de Jesus sobre as preocupações." },
    { bookId: "PHP", chapter: 4, verse: 4, endVerse: 9, note: "Leia a oração e a paz junto do convite àquilo que deve ocupar o pensamento." },
    { bookId: "1PE", chapter: 5, verse: 6, endVerse: 7, note: "O convite a entregar a ansiedade a Deus aparece em uma carta a comunidades em dificuldade." }
  ] },
  { id: "luto", title: "Luto e consolo", aliases: ["luto", "morte", "morrer", "tristeza", "consolo", "saudade"], introduction: "Jesus também chorou. Estas leituras acolhem a dor e oferecem esperança, sem exigir que alguém esconda o sofrimento ou tenha pressa de melhorar.", passages: [
    { bookId: "JHN", chapter: 11, verse: 32, endVerse: 36, note: "Jesus encontra Maria e as pessoas que choravam pela morte de Lázaro." },
    { bookId: "PSA", chapter: 23, verse: 1, endVerse: 6, note: "O salmo fala da presença do pastor inclusive no vale de sombra." },
    { bookId: "1TH", chapter: 4, verse: 13, endVerse: 18, note: "Paulo escreve para consolar uma comunidade que perguntava sobre seus mortos." }
  ] },
  { id: "justica", title: "Justiça e cuidado com os vulneráveis", aliases: ["justiça", "injustiça", "pobreza", "pobres", "oprimidos", "viúva", "órfão"], introduction: "A justiça aparece no culto, no trabalho e na forma de tratar os vulneráveis. Observe os gestos concretos pedidos pelos profetas e por Jesus.", passages: [
    { bookId: "MIC", chapter: 6, verse: 6, endVerse: 8, note: "O profeta relaciona justiça, misericórdia e humildade diante de Deus." },
    { bookId: "ISA", chapter: 1, verse: 16, endVerse: 17, note: "A chamada à mudança inclui defender quem sofre opressão." },
    { bookId: "MAT", chapter: 25, verse: 31, endVerse: 40, note: "Na cena do julgamento, o cuidado aparece em alimentar, acolher e visitar." }
  ] },
  { id: "criacao", title: "Criação e cuidado com o mundo", aliases: ["criação", "criou", "criar", "natureza", "meio ambiente", "gênesis"], introduction: "Comece pela narrativa de Gênesis e observe o lugar do ser humano entre as criaturas. A leitura cristã desses textos possui diferentes interpretações.", passages: [
    { bookId: "GEN", chapter: 1, verse: 1, endVerse: 5, note: "Leia o início da narrativa e acompanhe o desenvolvimento de todo o capítulo." },
    { bookId: "GEN", chapter: 1, verse: 26, endVerse: 31, note: "A dignidade humana e a responsabilidade sobre a criação aparecem juntas." },
    { bookId: "GEN", chapter: 2, verse: 15, note: "Cultivar e guardar o jardim ajuda a refletir sobre o cuidado com a terra." }
  ] },
  { id: "jesus", title: "Jesus Cristo", aliases: ["jesus", "cristo", "messias", "filho de deus"], introduction: "Os quatro Evangelhos apresentam a vida, o ensino, a morte e a ressurreição de Jesus. Comece por estas cenas e continue a leitura ao redor delas.", passages: [
    { bookId: "JHN", chapter: 1, verse: 1, endVerse: 14, note: "O início de João apresenta Jesus por meio da linguagem da Palavra e da encarnação." },
    { bookId: "MRK", chapter: 1, verse: 14, endVerse: 20, note: "A proclamação do Reino e o chamado dos discípulos abrem o ministério público em Marcos." },
    { bookId: "LUK", chapter: 4, verse: 16, endVerse: 21, note: "Jesus lê Isaías na sinagoga de Nazaré e fala de sua missão." }
  ] },
  { id: "ressurreicao", title: "Ressurreição", aliases: ["ressurreição", "ressuscitou", "ressuscitar", "páscoa"], introduction: "Leia os testemunhos dos Evangelhos e a reflexão de Paulo. Observe quem encontra o túmulo, quais perguntas surgem e como a notícia é recebida.", passages: [
    { bookId: "LUK", chapter: 24, verse: 1, endVerse: 12, note: "As mulheres levam a notícia aos apóstolos; acompanhe as diferentes reações." },
    { bookId: "JHN", chapter: 20, verse: 11, endVerse: 18, note: "Maria Madalena encontra Jesus e recebe a tarefa de anunciar aos discípulos." },
    { bookId: "1CO", chapter: 15, verse: 12, endVerse: 22, note: "Paulo explica por que a ressurreição ocupa lugar central na esperança cristã." }
  ] },
  { id: "cruz", title: "Cruz e entrega de Jesus", aliases: ["cruz", "crucificação", "calvário", "paixão de cristo", "sacrifício"], introduction: "Leia a paixão com reverência e atenção aos personagens. Os relatos não justificam hostilidade contra o povo judeu nem contra qualquer comunidade atual.", passages: [
    { bookId: "MRK", chapter: 15, verse: 21, endVerse: 39, note: "Marcos reúne sofrimento, abandono e o testemunho do centurião." },
    { bookId: "LUK", chapter: 23, verse: 32, endVerse: 43, note: "Observe as palavras de Jesus e o diálogo com os homens crucificados ao seu lado." },
    { bookId: "PHP", chapter: 2, verse: 5, endVerse: 11, note: "A reflexão sobre Cristo é oferecida como chamado à humildade da comunidade." }
  ] },
  { id: "arrependimento", title: "Arrependimento e recomeço", aliases: ["arrependimento", "arrepender", "conversão", "converter", "recomeço"], introduction: "Arrepender-se envolve voltar-se para Deus e aprender a viver de outra forma. Observe o espaço de acolhimento e os sinais concretos de mudança.", passages: [
    { bookId: "MRK", chapter: 1, verse: 14, endVerse: 15, note: "Jesus anuncia o Reino de Deus e convida à conversão e à fé." },
    { bookId: "LUK", chapter: 19, verse: 1, endVerse: 10, note: "O encontro de Zaqueu com Jesus se desdobra em partilha e reparação." },
    { bookId: "ACT", chapter: 3, verse: 19, endVerse: 20, note: "O chamado de Pedro faz parte de uma pregação; leia também o que a antecede." }
  ] },
  { id: "pecado", title: "Pecado, misericórdia e responsabilidade", aliases: ["pecado", "pecar", "pecador", "culpa", "tentação"], introduction: "A Bíblia leva a responsabilidade humana a sério e também anuncia misericórdia. Leia estas passagens sem transformar o estudo em condenação de quem busca ajuda.", passages: [
    { bookId: "ROM", chapter: 3, verse: 21, endVerse: 26, note: "A condição humana e a graça são tratadas no argumento de Paulo sobre a justiça de Deus." },
    { bookId: "1JN", chapter: 1, verse: 5, endVerse: 9, note: "A carta relaciona a vida na luz à verdade, à comunhão e à confissão." },
    { bookId: "1CO", chapter: 10, verse: 12, endVerse: 13, note: "O texto pede vigilância e lembra os limites e as possibilidades de enfrentar a tentação." }
  ] },
  { id: "familia", title: "Família e convivência", aliases: ["família", "pais", "filhos", "crianças", "paternidade", "maternidade"], introduction: "A casa pode ser um lugar de cuidado e aprendizado. Nenhuma leitura sobre família deve servir para encobrir abuso ou negar a dignidade de seus membros.", passages: [
    { bookId: "DEU", chapter: 6, verse: 4, endVerse: 9, note: "A memória da fé é apresentada como parte da vida cotidiana e da conversa entre gerações." },
    { bookId: "MRK", chapter: 10, verse: 13, endVerse: 16, note: "Observe como Jesus recebe as crianças e responde à atitude dos discípulos." },
    { bookId: "EPH", chapter: 6, verse: 1, endVerse: 4, note: "Leia tanto a orientação aos filhos quanto a responsabilidade de quem os educa." }
  ] },
  { id: "casamento", title: "Casamento", aliases: ["casamento", "casar", "marido", "esposa", "matrimônio"], introduction: "Leia os textos sobre casamento em seus contextos e reconheça as diferentes leituras cristãs. A dignidade, o respeito e a proteção das pessoas precisam orientar a conversa.", passages: [
    { bookId: "GEN", chapter: 2, verse: 18, endVerse: 24, note: "A narrativa apresenta a companhia humana e a relação entre homem e mulher." },
    { bookId: "MAT", chapter: 19, verse: 3, endVerse: 9, note: "Jesus responde a uma controvérsia específica sobre divórcio; leia a pergunta antes da resposta." },
    { bookId: "EPH", chapter: 5, verse: 21, endVerse: 33, note: "Leia a passagem inteira, começando pelo versículo 21, e observe o chamado ao amor." }
  ] },
  { id: "sabedoria", title: "Sabedoria e discernimento", aliases: ["sabedoria", "discernimento", "decisão", "decisões", "prudência"], introduction: "Aprender a discernir inclui escutar, pedir ajuda e considerar o fruto de nossas atitudes. Provérbios oferece sabedoria para situações, não promessas automáticas para todos os casos.", passages: [
    { bookId: "PRO", chapter: 2, verse: 1, endVerse: 9, note: "A busca da sabedoria é descrita como uma procura paciente e valiosa." },
    { bookId: "JAS", chapter: 1, verse: 5, note: "Tiago convida quem precisa de sabedoria a pedi-la a Deus." },
    { bookId: "JAS", chapter: 3, verse: 13, endVerse: 18, note: "Observe os sinais pelos quais a sabedoria é reconhecida na vida comum." }
  ] },
  { id: "paz", title: "Paz e reconciliação entre pessoas", aliases: ["paz", "pacificação", "pacificador", "conflito", "violência"], introduction: "A paz bíblica inclui relações justas e cuidado com o próximo. Buscar a paz não significa permanecer em uma situação de perigo.", passages: [
    { bookId: "MAT", chapter: 5, verse: 9, note: "A bem-aventurança honra quem trabalha pela paz." },
    { bookId: "ROM", chapter: 12, verse: 17, endVerse: 21, note: "Observe o chamado a vencer o mal com o bem e a expressão que reconhece nossos limites." },
    { bookId: "JHN", chapter: 14, verse: 27, note: "A promessa da paz aparece na conversa de despedida de Jesus." }
  ] },
  { id: "servico", title: "Serviço e humildade", aliases: ["serviço", "servir", "humildade", "humilde", "ministério"], introduction: "Jesus relaciona a liderança ao serviço. Acompanhe suas ações e pergunte como elas transformam nossa forma de cuidar e exercer responsabilidade.", passages: [
    { bookId: "JHN", chapter: 13, verse: 1, endVerse: 17, note: "O lava-pés oferece uma imagem concreta de serviço entre os discípulos." },
    { bookId: "MRK", chapter: 10, verse: 42, endVerse: 45, note: "Jesus responde a uma discussão sobre lugares de destaque." },
    { bookId: "1PE", chapter: 4, verse: 10, endVerse: 11, note: "Os dons são apresentados como meios de servir uns aos outros." }
  ] },
  { id: "igreja", title: "Igreja e comunhão", aliases: ["igreja", "comunhão", "comunidade", "corpo de cristo"], introduction: "Os primeiros cristãos aprendiam, repartiam e enfrentavam desafios juntos. Estas passagens ajudam a pensar o cuidado mútuo sem idealizar a vida comunitária.", passages: [
    { bookId: "ACT", chapter: 2, verse: 42, endVerse: 47, note: "Observe ensino, oração, refeições e partilha na descrição da comunidade de Jerusalém." },
    { bookId: "1CO", chapter: 12, verse: 12, endVerse: 27, note: "A imagem do corpo mostra diversidade, interdependência e cuidado." },
    { bookId: "HEB", chapter: 10, verse: 23, endVerse: 25, note: "A reunião da comunidade é associada ao encorajamento e ao amor." }
  ] },
  { id: "evangelismo", title: "Evangelismo e testemunho", aliases: ["evangelismo", "evangelizar", "missões", "missionário", "pregar", "testemunho"], introduction: "Compartilhar a fé envolve palavras, atitudes e respeito. Observe como a missão é acompanhada de ensino e como Pedro pede mansidão ao responder sobre a esperança.", passages: [
    { bookId: "MAT", chapter: 28, verse: 18, endVerse: 20, note: "O envio inclui fazer discípulos, batizar e ensinar." },
    { bookId: "ACT", chapter: 1, verse: 8, note: "A missão é descrita em um movimento que parte de Jerusalém e se amplia." },
    { bookId: "1PE", chapter: 3, verse: 15, endVerse: 16, note: "O modo de responder deve incluir mansidão, respeito e boa consciência." }
  ] },
  { id: "generosidade", title: "Generosidade, ofertas e partilha", aliases: ["generosidade", "oferta", "ofertas", "dízimo", "dízimos", "dinheiro", "partilha"], introduction: "A contribuição cristã pode ser estudada à luz da justiça, da liberdade e do cuidado com os necessitados. Tradições diferem sobre dízimos; nenhum texto autoriza pressão financeira sobre quem está vulnerável.", passages: [
    { bookId: "2CO", chapter: 9, verse: 6, endVerse: 8, note: "Paulo trata de uma coleta e fala da disposição de quem contribui." },
    { bookId: "MRK", chapter: 12, verse: 41, endVerse: 44, note: "Leia o gesto da viúva junto da denúncia feita por Jesus nos versículos anteriores." },
    { bookId: "ACT", chapter: 4, verse: 32, endVerse: 35, note: "A partilha é relacionada à necessidade das pessoas da comunidade." }
  ] },
  { id: "jejum", title: "Jejum", aliases: ["jejum", "jejuar", "jejuando"], introduction: "Os textos associam o jejum à oração e à justiça, e questionam a aparência religiosa sem cuidado com o próximo. Pessoas com necessidades de saúde devem conversar com profissionais antes de restringir alimentos.", passages: [
    { bookId: "MAT", chapter: 6, verse: 16, endVerse: 18, note: "Jesus orienta sobre a intenção e a discrição de quem jejua." },
    { bookId: "ISA", chapter: 58, verse: 3, endVerse: 8, note: "O profeta confronta o jejum que convive com a opressão e a falta de partilha." },
    { bookId: "ACT", chapter: 13, verse: 1, endVerse: 3, note: "O relato situa oração e jejum na vida da comunidade de Antioquia." }
  ] },
  { id: "ceia", title: "Ceia do Senhor", aliases: ["ceia", "eucaristia", "comunhão eucarística", "santa ceia", "pão e vinho"], introduction: "Os cristãos recordam a entrega de Jesus na Ceia. As tradições divergem sobre sua compreensão sacramental e celebração; comece pelos relatos e pela correção de Paulo à comunidade.", passages: [
    { bookId: "LUK", chapter: 22, verse: 14, endVerse: 20, note: "Jesus partilha o pão e o cálice com os apóstolos no contexto da Páscoa." },
    { bookId: "1CO", chapter: 11, verse: 17, endVerse: 26, note: "A lembrança da Ceia é precedida de uma repreensão às divisões e à humilhação dos pobres." },
    { bookId: "ACT", chapter: 2, verse: 42, endVerse: 46, note: "O partir do pão aparece junto do ensino e da vida compartilhada." }
  ] },
  { id: "louvor", title: "Louvor e música", aliases: ["louvor", "louvar", "música", "cantar", "cânticos", "hinos", "adoração"], introduction: "A música acompanha gratidão, memória e oração. Observe o que os textos dizem sobre cantar junto e sobre o conteúdo que alimenta a comunidade.", passages: [
    { bookId: "PSA", chapter: 100, verse: 1, endVerse: 5, note: "O salmo convida à alegria e à gratidão ao entrar na presença de Deus." },
    { bookId: "COL", chapter: 3, verse: 16, endVerse: 17, note: "O canto é relacionado ao ensino mútuo, à sabedoria e à gratidão." },
    { bookId: "ACT", chapter: 16, verse: 25, endVerse: 34, note: "Paulo e Silas cantam em uma prisão; acompanhe o que acontece com o carcereiro." }
  ] },
  { id: "mandamentos", title: "Mandamentos e o ensino de Jesus", aliases: ["mandamentos", "dez mandamentos", "lei", "decálogo", "obedecer", "obediência"], introduction: "Leia os Dez Mandamentos em seu contexto de aliança e compare a síntese oferecida por Jesus. A numeração do Decálogo varia entre tradições cristãs.", passages: [
    { bookId: "EXO", chapter: 20, verse: 1, endVerse: 17, note: "Observe que a lembrança da libertação antecede os mandamentos." },
    { bookId: "DEU", chapter: 5, verse: 6, endVerse: 21, note: "Compare a apresentação do Decálogo em Deuteronômio com a de Êxodo." },
    { bookId: "MAT", chapter: 22, verse: 34, endVerse: 40, note: "Jesus reúne a Lei e os Profetas no amor a Deus e ao próximo." }
  ] },
  { id: "alianca", title: "Aliança e promessas", aliases: ["aliança", "promessa", "promessas", "abraão", "abrao"], introduction: "A aliança conecta histórias ao longo da Bíblia. Observe quem é chamado, o que é prometido e como essas passagens são retomadas depois.", passages: [
    { bookId: "GEN", chapter: 12, verse: 1, endVerse: 3, note: "O chamado de Abrão liga sua jornada à bênção que alcança outras famílias." },
    { bookId: "EXO", chapter: 19, verse: 3, endVerse: 6, note: "A aliança no Sinai é situada após a libertação do Egito." },
    { bookId: "JER", chapter: 31, verse: 31, endVerse: 34, note: "A promessa de nova aliança fala de conhecimento de Deus e perdão." }
  ] },
  { id: "libertacao", title: "Êxodo e libertação", aliases: ["êxodo", "libertação", "moisés", "egito", "mar vermelho"], introduction: "O êxodo é memória de libertação que atravessa a Bíblia. Leia a aflição do povo e o chamado de Moisés antes de acompanhar a saída do Egito.", passages: [
    { bookId: "EXO", chapter: 3, verse: 1, endVerse: 12, note: "Deus ouve o sofrimento do povo e chama Moisés pelo nome." },
    { bookId: "EXO", chapter: 14, verse: 21, endVerse: 31, note: "A travessia é narrada como parte da saída do domínio do faraó." },
    { bookId: "DEU", chapter: 5, verse: 12, endVerse: 15, note: "A memória da escravidão é relacionada ao descanso de todos na casa." }
  ] },
  { id: "profetas", title: "Profetas e fidelidade", aliases: ["profeta", "profetas", "profecia", "profecias", "isaías", "jeremias"], introduction: "Os profetas falaram a comunidades e situações históricas concretas. Antes de aplicar uma palavra ao presente, observe seus destinatários, suas imagens e seu contexto.", passages: [
    { bookId: "ISA", chapter: 1, verse: 10, endVerse: 20, note: "A crítica ao culto é acompanhada de um chamado à justiça e à mudança." },
    { bookId: "JER", chapter: 1, verse: 4, endVerse: 10, note: "A narrativa da vocação apresenta a missão e as inseguranças de Jeremias." },
    { bookId: "AMO", chapter: 5, verse: 21, endVerse: 24, note: "O profeta confronta festas religiosas desligadas da justiça." }
  ] },
  { id: "exilio", title: "Exílio e retorno", aliases: ["exílio", "cativeiro", "babilônia", "retorno", "esdras", "neemias"], introduction: "O exílio e o retorno ajudam a compreender a memória, a esperança e a reconstrução do povo. Nem toda passagem desse período é uma promessa individual de sucesso.", passages: [
    { bookId: "PSA", chapter: 137, verse: 1, endVerse: 4, note: "O salmo guarda a dor de quem vive distante de sua terra." },
    { bookId: "JER", chapter: 29, verse: 4, endVerse: 14, note: "Leia a carta inteira aos exilados, incluindo o tempo de espera indicado no texto." },
    { bookId: "EZR", chapter: 1, verse: 1, endVerse: 5, note: "O relato apresenta o decreto de Ciro e o início do retorno." }
  ] },
  { id: "reino", title: "Reino de Deus", aliases: ["reino de deus", "reino dos céus", "bem aventuranças", "bem-aventuranças"], introduction: "O Reino ocupa o centro do anúncio de Jesus. Compare seu anúncio, as bem-aventuranças e as imagens usadas nas parábolas.", passages: [
    { bookId: "MRK", chapter: 1, verse: 14, endVerse: 15, note: "O início do ministério apresenta a chegada do Reino e o convite à fé." },
    { bookId: "MAT", chapter: 5, verse: 1, endVerse: 12, note: "As bem-aventuranças abrem o Sermão do Monte." },
    { bookId: "MAT", chapter: 13, verse: 31, endVerse: 33, note: "A semente e o fermento convidam a refletir sobre crescimento e transformação." }
  ] },
  { id: "parabolas", title: "Parábolas de Jesus", aliases: ["parábola", "parábolas", "semeador", "filho pródigo", "bom samaritano"], introduction: "As parábolas criam imagens que nos fazem pensar. Leia a pergunta ou situação que provoca cada história antes de buscar sua aplicação.", passages: [
    { bookId: "MRK", chapter: 4, verse: 1, endVerse: 20, note: "O semeador é narrado e depois explicado no próprio capítulo." },
    { bookId: "LUK", chapter: 10, verse: 25, endVerse: 37, note: "A história do samaritano responde à pergunta de um intérprete da Lei." },
    { bookId: "LUK", chapter: 15, verse: 1, endVerse: 7, note: "A ovelha perdida é contada no contexto de uma crítica à acolhida de pecadores." }
  ] },
  { id: "milagres", title: "Milagres e sinais", aliases: ["milagre", "milagres", "cura", "curar", "sinais", "multiplicação dos pães"], introduction: "Leia os sinais junto dos encontros humanos e dos ensinamentos que os acompanham. Esses relatos não autorizam culpar quem permanece doente nem prometer cura em troca de dinheiro.", passages: [
    { bookId: "MRK", chapter: 2, verse: 1, endVerse: 12, note: "Observe a amizade, o perdão e as perguntas levantadas na cura do paralítico." },
    { bookId: "JHN", chapter: 6, verse: 1, endVerse: 15, note: "A partilha dos pães é seguida de uma conversa extensa sobre o pão da vida." },
    { bookId: "JHN", chapter: 20, verse: 30, endVerse: 31, note: "O evangelista explica a finalidade dos sinais escolhidos para seu relato." }
  ] },
  { id: "maria", title: "Maria, mãe de Jesus", aliases: ["maria", "mãe de jesus", "magnificat", "anunciação"], introduction: "Acompanhe Maria nos relatos de Lucas e João. Diferentes tradições cristãs compreendem sua veneração de maneiras distintas; as passagens abaixo permitem começar pelo texto bíblico.", passages: [
    { bookId: "LUK", chapter: 1, verse: 26, endVerse: 38, note: "Observe a saudação, a pergunta de Maria e sua resposta ao anúncio." },
    { bookId: "LUK", chapter: 1, verse: 46, endVerse: 55, note: "O cântico reúne gratidão e imagens da misericórdia e da justiça de Deus." },
    { bookId: "JHN", chapter: 2, verse: 1, endVerse: 11, note: "Maria participa da cena das bodas de Caná, no início dos sinais de Jesus em João." }
  ] },
  { id: "discipulado", title: "Discipulado e aprendizado", aliases: ["discípulo", "discípulos", "discipulado", "seguir jesus", "aprender"], introduction: "Ser discípulo envolve escutar, caminhar e aprender a servir. Os Evangelhos também mostram as incompreensões dos discípulos e a paciência de Jesus.", passages: [
    { bookId: "MRK", chapter: 1, verse: 16, endVerse: 20, note: "O chamado alcança trabalhadores em suas atividades junto ao mar." },
    { bookId: "LUK", chapter: 10, verse: 38, endVerse: 42, note: "Marta e Maria recebem Jesus; observe a escuta e as preocupações da cena." },
    { bookId: "JHN", chapter: 13, verse: 34, endVerse: 35, note: "O amor mútuo é apresentado como sinal reconhecível dos discípulos." }
  ] },
  { id: "palavra", title: "Bíblia, Palavra e leitura", aliases: ["bíblia", "escritura", "escrituras", "palavra de deus", "ler a bíblia", "estudar a bíblia", "interpretação"], introduction: "Ler com atenção inclui perguntar quem fala, a quem e em qual situação. Compare o cuidado dos bereanos com a orientação dada a Timóteo.", passages: [
    { bookId: "ACT", chapter: 17, verse: 10, endVerse: 12, note: "A comunidade de Bereia recebe a mensagem e confere as Escrituras." },
    { bookId: "2TI", chapter: 3, verse: 14, endVerse: 17, note: "A passagem relaciona o aprendizado das Escrituras à preparação para boas obras." },
    { bookId: "PSA", chapter: 119, verse: 105, note: "A imagem da lâmpada convida a pensar na Palavra que orienta o caminho." }
  ] },
  { id: "trabalho", title: "Trabalho e integridade", aliases: ["trabalho", "trabalhar", "emprego", "honestidade", "integridade"], introduction: "O trabalho pode ser lugar de responsabilidade e serviço. Leia também as advertências bíblicas contra exploração e salários retidos.", passages: [
    { bookId: "COL", chapter: 3, verse: 23, endVerse: 24, note: "Leia a orientação no contexto social da carta, sem usá-la para justificar exploração." },
    { bookId: "JAS", chapter: 5, verse: 1, endVerse: 6, note: "Tiago denuncia a riqueza construída com injustiça contra trabalhadores." },
    { bookId: "PRO", chapter: 11, verse: 1, note: "A imagem da balança fala de honestidade nas relações comerciais." }
  ] },
  { id: "descanso", title: "Descanso e sábado", aliases: ["descanso", "descansar", "sábado", "sabado", "cansaço", "cansado"], introduction: "O descanso aparece como cuidado e memória de libertação. Cristãos diferem sobre a observância do sábado e do domingo; leia as passagens antes de comparar essas interpretações.", passages: [
    { bookId: "EXO", chapter: 20, verse: 8, endVerse: 11, note: "O mandamento do descanso inclui toda a casa e os animais." },
    { bookId: "MRK", chapter: 2, verse: 23, endVerse: 28, note: "Jesus responde a uma controvérsia sobre o sábado e o bem das pessoas." },
    { bookId: "MAT", chapter: 11, verse: 28, endVerse: 30, note: "O convite de Jesus acolhe os cansados e sobrecarregados." }
  ] },
  { id: "fruto-espirito", title: "Fruto do Espírito e vida cotidiana", aliases: ["fruto do espírito", "frutos do espírito", "paciência", "mansidão", "domínio próprio", "bondade"], introduction: "O fruto do Espírito é apresentado no contexto da liberdade e do amor. Pergunte como essas atitudes podem amadurecer em relações concretas.", passages: [
    { bookId: "GAL", chapter: 5, verse: 13, endVerse: 26, note: "Leia a lista dentro do chamado a servir uns aos outros pelo amor." },
    { bookId: "COL", chapter: 3, verse: 12, endVerse: 15, note: "O texto usa a imagem de vestir-se de compaixão, bondade e paciência." },
    { bookId: "JAS", chapter: 1, verse: 19, endVerse: 20, note: "Escutar antes de falar é uma orientação prática para o convívio." }
  ] },
  { id: "sofrimento", title: "Sofrimento e presença de Deus", aliases: ["sofrimento", "sofrer", "dor", "provação", "tribulação", "doença"], introduction: "Os textos bíblicos permitem lamentar e pedir ajuda. O sofrimento de alguém não é uma medida de sua fé nem prova automática de culpa.", passages: [
    { bookId: "PSA", chapter: 13, verse: 1, endVerse: 6, note: "O salmo reúne pergunta, súplica e confiança sem esconder a angústia." },
    { bookId: "JOB", chapter: 2, verse: 11, endVerse: 13, note: "Os amigos de Jó começam oferecendo presença e silêncio diante da dor." },
    { bookId: "ROM", chapter: 8, verse: 31, endVerse: 39, note: "Paulo fala do amor de Deus em um trecho que reconhece tribulações reais." }
  ] },
  { id: "anjos", title: "Anjos e mensageiros", aliases: ["anjo", "anjos", "mensageiro", "gabriel", "miguel"], introduction: "Leia o papel dos mensageiros nas cenas bíblicas e evite construir detalhes que o texto não oferece. O foco destas passagens está na mensagem e no cuidado de Deus.", passages: [
    { bookId: "LUK", chapter: 1, verse: 26, endVerse: 38, note: "Gabriel leva a Maria o anúncio sobre o nascimento de Jesus." },
    { bookId: "HEB", chapter: 1, verse: 13, endVerse: 14, note: "A carta aborda os anjos dentro de uma reflexão sobre a superioridade do Filho." },
    { bookId: "ACT", chapter: 12, verse: 6, endVerse: 11, note: "O relato apresenta a libertação de Pedro da prisão." }
  ] },
  { id: "fim-tempos", title: "Esperança futura e Apocalipse", aliases: ["apocalipse", "fim dos tempos", "volta de jesus", "segunda vinda", "juízo", "novo céu", "nova terra"], introduction: "Textos apocalípticos usam símbolos e dialogam com comunidades em sofrimento. As interpretações cristãs diferem; nenhuma data para a volta de Jesus é fornecida por este guia.", passages: [
    { bookId: "MAT", chapter: 24, verse: 36, endVerse: 44, note: "Observe a advertência sobre não conhecer o dia e a hora." },
    { bookId: "1TH", chapter: 4, verse: 13, endVerse: 18, note: "O anúncio da vinda do Senhor é oferecido como consolo à comunidade." },
    { bookId: "REV", chapter: 21, verse: 1, endVerse: 5, note: "A visão aponta para renovação, presença de Deus e fim das lágrimas." }
  ] },
  { id: "gratidao", title: "Gratidão", aliases: ["gratidão", "agradecer", "agradecimento", "grato", "grata"], introduction: "A gratidão pode ser cultivada sem negar a dor. Observe pessoas que reconhecem o bem recebido e comunidades convidadas a lembrar dele.", passages: [
    { bookId: "LUK", chapter: 17, verse: 11, endVerse: 19, note: "Um dos homens curados volta para agradecer a Jesus." },
    { bookId: "1TH", chapter: 5, verse: 16, endVerse: 18, note: "A gratidão aparece ao lado da oração e da alegria em orientações à comunidade." },
    { bookId: "PSA", chapter: 103, verse: 1, endVerse: 5, note: "O salmista convida a lembrar dos benefícios recebidos de Deus." }
  ] },
  { id: "amizade", title: "Amizade e apoio mútuo", aliases: ["amizade", "amigo", "amigos", "solidão", "companhia"], introduction: "A companhia pode fortalecer a caminhada. Leia histórias e conselhos que mostram presença, lealdade e cuidado mútuo.", passages: [
    { bookId: "PRO", chapter: 17, verse: 17, note: "O provérbio destaca a constância do amigo em tempos difíceis." },
    { bookId: "ECC", chapter: 4, verse: 9, endVerse: 12, note: "A imagem de caminhar junto inclui a possibilidade de ajudar quem cai." },
    { bookId: "JHN", chapter: 15, verse: 12, endVerse: 17, note: "Jesus relaciona amizade ao amor e ao que compartilhou com seus discípulos." }
  ] },
  { id: "verdade", title: "Verdade e palavras que cuidam", aliases: ["verdade", "mentira", "fofoca", "língua", "falar", "calúnia"], introduction: "O modo de falar pode ferir ou cuidar. Leia as orientações sobre verdade junto do chamado à responsabilidade pelas palavras.", passages: [
    { bookId: "EPH", chapter: 4, verse: 25, endVerse: 29, note: "Paulo une verdade, trabalho e palavras que ajudam quem escuta." },
    { bookId: "JAS", chapter: 3, verse: 1, endVerse: 12, note: "As imagens do leme e do fogo mostram a força da fala." },
    { bookId: "PRO", chapter: 12, verse: 18, endVerse: 19, note: "A passagem contrasta palavras que ferem com as que trazem cuidado." }
  ] },
  { id: "mulheres", title: "Mulheres nas narrativas bíblicas", aliases: ["mulher", "mulheres", "rute", "ester", "débora", "maria madalena"], introduction: "Conheça mulheres em diferentes tempos e situações da narrativa. Observe suas palavras e ações, sem reduzir suas histórias a uma única característica.", passages: [
    { bookId: "RUT", chapter: 1, verse: 14, endVerse: 18, note: "Rute faz uma escolha de lealdade a Noemi em meio ao luto e à migração." },
    { bookId: "EST", chapter: 4, verse: 10, endVerse: 17, note: "Ester e Mardoqueu conversam sobre risco e responsabilidade diante da ameaça ao seu povo." },
    { bookId: "JHN", chapter: 20, verse: 11, endVerse: 18, note: "Maria Madalena é enviada a levar aos discípulos a notícia de seu encontro com Jesus." }
  ] },
  { id: "hospitalidade", title: "Hospitalidade e acolhimento", aliases: ["hospitalidade", "acolhimento", "acolher", "estrangeiro", "imigrante", "refugiado"], introduction: "Acolher inclui reconhecer a dignidade de quem chega. A memória de ter sido estrangeiro e a prática do amor ajudam a compreender essas leituras.", passages: [
    { bookId: "LEV", chapter: 19, verse: 33, endVerse: 34, note: "O mandamento relaciona o amor ao estrangeiro à memória da vida no Egito." },
    { bookId: "HEB", chapter: 13, verse: 1, endVerse: 3, note: "A hospitalidade aparece ao lado do amor fraterno e da lembrança de pessoas presas." },
    { bookId: "MAT", chapter: 25, verse: 35, endVerse: 40, note: "Acolher quem está de passagem integra a descrição do cuidado ao próximo." }
  ] },
  { id: "lideranca", title: "Liderança e responsabilidade", aliases: ["liderança", "líder", "pastor", "pastores", "presbítero", "bispo", "diácono"], introduction: "As cartas oferecem orientações a comunidades concretas. Leia as responsabilidades de quem cuida do rebanho sem confundir autoridade com domínio sobre as pessoas.", passages: [
    { bookId: "1PE", chapter: 5, verse: 1, endVerse: 4, note: "A liderança é orientada pelo exemplo e pelo cuidado, sem dominação." },
    { bookId: "1TI", chapter: 3, verse: 1, endVerse: 13, note: "Observe as qualidades de caráter e as responsabilidades descritas para funções comunitárias." },
    { bookId: "MRK", chapter: 10, verse: 42, endVerse: 45, note: "Jesus coloca o serviço no centro da conversa sobre autoridade." }
  ] },
  { id: "criancas", title: "Crianças e acolhimento", aliases: ["criança", "crianças", "pequeninos", "infância", "educação"], introduction: "Jesus recebe as crianças e leva a sério sua dignidade. Estas leituras convidam adultos e comunidades a oferecer proteção, escuta e cuidado.", passages: [
    { bookId: "MRK", chapter: 10, verse: 13, endVerse: 16, note: "Observe quem tenta impedir a aproximação das crianças e a resposta de Jesus." },
    { bookId: "MAT", chapter: 18, verse: 1, endVerse: 6, note: "A pergunta sobre grandeza é respondida com o exemplo de uma criança e um chamado à responsabilidade." },
    { bookId: "EPH", chapter: 6, verse: 1, endVerse: 4, note: "A orientação aos pais inclui não provocar os filhos à ira." }
  ] }
];

export const suggestedBibleTopics = ["batismo", "oração", "perdão", "Jesus", "ansiedade", "Espírito Santo", "amor", "esperança"] as const;
