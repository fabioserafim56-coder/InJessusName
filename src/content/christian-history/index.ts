export type ChristianHistorySource = Readonly<{
  id: string;
  title: string;
  publisher: string;
  url: string;
  kind: "Pesquisa histórica" | "Documento histórico" | "Memória institucional" | "Enciclopédia colaborativa" | "Texto bíblico";
  accessed: string;
}>;

export type ChristianHistoryMilestone = Readonly<{
  id: string;
  period: string;
  title: string;
  summary: string;
  context: string;
  connection: string;
  sourceIds: readonly string[];
  links: readonly Readonly<{ href: string; label: string }>[];
}>;

const accessed = "2026-10-29";
export const christianHistorySources: readonly ChristianHistorySource[] = [
  { id: "acts", title: "Atos 2:42–47; 11:19–26; 15", publisher: "Bíblia Livre · TR 2018", url: "/biblia?livro=ACT&capitulo=2&versiculo=42", kind: "Texto bíblico", accessed },
  { id: "origins", title: "Christianity: The history of Christianity", publisher: "Encyclopaedia Britannica", url: "https://www.britannica.com/topic/Christianity/The-history-of-Christianity", kind: "Pesquisa histórica", accessed },
  { id: "coptic", title: "Coptic Orthodox Church of Alexandria", publisher: "Encyclopaedia Britannica", url: "https://www.britannica.com/topic/Coptic-Orthodox-Church-of-Alexandria", kind: "Pesquisa histórica", accessed },
  { id: "syriac", title: "Syriac Orthodox Patriarchate of Antioch and All the East", publisher: "Encyclopaedia Britannica", url: "https://www.britannica.com/topic/Syriac-Orthodox-Patriarchate-of-Antioch-and-All-the-East", kind: "Pesquisa histórica", accessed },
  { id: "milan", title: "Edict of Milan", publisher: "Encyclopaedia Britannica", url: "https://www.britannica.com/topic/Edict-of-Milan", kind: "Pesquisa histórica", accessed },
  { id: "theodosius", title: "Theodosius I: Religious policy", publisher: "Encyclopaedia Britannica", url: "https://www.britannica.com/biography/Theodosius-I", kind: "Pesquisa histórica", accessed },
  { id: "theodosian", title: "Theodosian Code XVI.1.2 — tradução do documento imperial", publisher: "Fordham University · Internet History Sourcebooks", url: "https://sourcebooks.fordham.edu/source/theodcodeXVI.asp", kind: "Documento histórico", accessed },
  { id: "nicaea", title: "First Council of Nicaea", publisher: "Encyclopaedia Britannica", url: "https://www.britannica.com/event/First-Council-of-Nicaea-325", kind: "Pesquisa histórica", accessed },
  { id: "constantinople", title: "First Council of Constantinople", publisher: "Encyclopaedia Britannica", url: "https://www.britannica.com/event/First-Council-of-Constantinople-381", kind: "Pesquisa histórica", accessed },
  { id: "chalcedon", title: "Council of Chalcedon", publisher: "Encyclopaedia Britannica", url: "https://www.britannica.com/event/Council-of-Chalcedon", kind: "Pesquisa histórica", accessed },
  { id: "schism", title: "East-West Schism", publisher: "Encyclopaedia Britannica", url: "https://www.britannica.com/event/East-West-Schism-1054", kind: "Pesquisa histórica", accessed },
  { id: "gutenberg", title: "Johannes Gutenberg", publisher: "Encyclopaedia Britannica", url: "https://www.britannica.com/biography/Johannes-Gutenberg", kind: "Pesquisa histórica", accessed },
  { id: "reformation", title: "Reformation", publisher: "Encyclopaedia Britannica", url: "https://www.britannica.com/event/Reformation", kind: "Pesquisa histórica", accessed },
  { id: "brazil-catholic", title: "Igreja Católica no Brasil", publisher: "Wikipédia em português · consultar referências do artigo", url: "https://pt.wikipedia.org/wiki/Igreja_Cat%C3%B3lica_no_Brasil", kind: "Enciclopédia colaborativa", accessed },
  { id: "france-antarctique", title: "França Antártica", publisher: "Wikipédia em português · consultar referências do artigo", url: "https://pt.wikipedia.org/wiki/Fran%C3%A7a_Ant%C3%A1rtica", kind: "Enciclopédia colaborativa", accessed },
  { id: "ieclb", title: "História da IECLB", publisher: "Igreja Evangélica de Confissão Luterana no Brasil", url: "https://www.luterano.org.br/conheca-a-ieclb/historia-da-ieclb/", kind: "Memória institucional", accessed },
  { id: "cbb", title: "Nossa História", publisher: "Convenção Batista Brasileira", url: "https://www.convencaobatista.com.br/site/pagina.php?MEN_ID=24", kind: "Memória institucional", accessed },
  { id: "pentecostalism", title: "Pentecostalism", publisher: "Encyclopaedia Britannica", url: "https://www.britannica.com/topic/Pentecostalism", kind: "Pesquisa histórica", accessed },
  { id: "wcc", title: "World Council of Churches", publisher: "Encyclopaedia Britannica", url: "https://www.britannica.com/topic/World-Council-of-Churches", kind: "Pesquisa histórica", accessed }
];

export const christianHistoryMilestones: readonly ChristianHistoryMilestone[] = [
  {
    id: "comunidades-judaicas", period: "Século I", title: "Uma fé que nasce em um mundo judaico",
    summary: "Jesus e os primeiros discípulos pertencem ao mundo judaico. Os relatos de Atos apresentam comunidades que aprendem, oram, repartem o pão e enfrentam novas perguntas ao acolher pessoas de outras origens.",
    context: "Atos é uma fonte bíblica para conhecer como a tradição cristã narra seus começos. Sua leitura merece ser acompanhada de contexto literário e investigação histórica. Jerusalém e Antioquia ajudam a perceber que a expansão envolveu encontros, tensões e decisões coletivas — não uma instituição brasileira já pronta no século I.",
    connection: "Antes de comparar igrejas atuais, conheça as perguntas das primeiras comunidades. Isso evita projetar nomes, cargos e estruturas posteriores diretamente sobre todos os relatos bíblicos.",
    sourceIds: ["acts", "origins"], links: [{ href: "/biblia?livro=ACT&capitulo=2&versiculo=42", label: "Ler Atos 2:42–47" }, { href: "/biblia?livro=ACT&capitulo=15", label: "Acompanhar a conversa de Atos 15" }]
  },
  {
    id: "africa-asia-mediterraneo", period: "Primeiros séculos", title: "Muitos caminhos, línguas e culturas",
    summary: "A história cristã antiga também passa por comunidades africanas e asiáticas. Alexandria, no Egito, e Antioquia, no mundo sírio, são referências fundamentais para o ensino, o culto e a reflexão sobre Cristo.",
    context: "As tradições copta e siríaca conservam línguas, memórias e modos de oração próprios. Seus caminhos não se resumem à história de Roma ou da Europa ocidental. É preciso distinguir a memória apostólica de uma comunidade, as fontes documentais disponíveis e os desenvolvimentos institucionais de séculos posteriores.",
    connection: "Quando encontrarmos diferenças entre igrejas, vale perguntar também por suas línguas e seus contextos. Diversidade cultural não começou na época das denominações brasileiras.",
    sourceIds: ["origins", "coptic", "syriac"], links: [{ href: "/biblia?livro=ACT&capitulo=11&versiculo=19", label: "Ler sobre Antioquia em Atos 11" }]
  },
  {
    id: "imperio-e-liberdade", period: "313 e 380", title: "Da tolerância à política do Império",
    summary: "O acordo de Milão, associado a Constantino e Licínio em 313, favoreceu a tolerância religiosa. Em 380, Teodósio I impôs uma orientação cristã nicena aos súditos. São medidas diferentes, separadas por décadas.",
    context: "Não é correto dizer que Constantino criou o cristianismo ou o tornou religião oficial em 313. A relação entre comunidades e poder imperial mudou ao longo do século IV. O édito de 380 pode ser examinado no Código Teodosiano; ele ajuda a compreender como decisões políticas passaram a regular a pertença religiosa e a tratar os dissidentes.",
    connection: "Esta distinção nos prepara para estudar liberdade religiosa e relações entre igrejas e Estado. Uma decisão de governo não é a mesma coisa que a origem de uma fé ou a convicção de cada pessoa.",
    sourceIds: ["milan", "theodosius", "theodosian"], links: []
  },
  {
    id: "niceia-constantinopla", period: "325 e 381", title: "Palavras para confessar a fé",
    summary: "Os concílios de Niceia e Constantinopla discutiram como expressar a fé em Cristo e no Espírito Santo. Suas formulações tornaram-se referências para muitas tradições cristãs, em meio a controvérsias que não terminaram de uma vez.",
    context: "Niceia tratou, entre outras questões, da relação entre o Pai e o Filho. Constantinopla retomou esse debate e a reflexão sobre o Espírito Santo. Os concílios reuniam bispos em circunstâncias históricas concretas, com participação imperial; não eram encontros de todas as comunidades em condições iguais, nem a fundação do cristianismo.",
    connection: "Ao ler um credo ou comparar uma doutrina, podemos perguntar: a que pergunta essa linguagem respondia? Situar as palavras no tempo ajuda a compreender seu uso nas igrejas de hoje.",
    sourceIds: ["nicaea", "constantinople"], links: [{ href: "/biblia?busca=Esp%C3%ADrito%20Santo#busca-biblica", label: "Estudar as passagens sobre o Espírito Santo" }]
  },
  {
    id: "calcedonia-e-oriente", period: "451 e seus desdobramentos", title: "Tradições orientais que continuam vivas",
    summary: "O concílio de Calcedônia formulou uma confissão sobre a divindade e a humanidade de Cristo. Comunidades que não receberam sua linguagem seguiram caminhos próprios, entre elas as tradições copta e siríaca.",
    context: "Essas diferenças não devem ser resumidas à afirmação de que tais igrejas simplesmente negavam a humanidade de Jesus. A terminologia cristológica e suas traduções exigem cuidado. As igrejas ortodoxas orientais ligadas a esse debate também não são idênticas às igrejas ortodoxas de herança bizantina, cuja relação com Roma aparece no marco seguinte.",
    connection: "Conhecer uma tradição por sua própria linguagem e por pesquisa histórica responsável evita transformar uma diferença antiga em caricatura da fé de outras pessoas.",
    sourceIds: ["chalcedon", "coptic", "syriac"], links: []
  },
  {
    id: "oriente-ocidente", period: "1054 e um processo mais longo", title: "Uma separação que amadureceu no tempo",
    summary: "1054 tornou-se um marco da separação entre Roma e Constantinopla. Diferenças de língua, autoridade, práticas e política já vinham se acumulando; a ruptura se aprofundou com outros acontecimentos, inclusive a tomada de Constantinopla em 1204.",
    context: "O chamado cisma do Oriente não significa que todas as relações cristãs foram cortadas num único dia. A distância entre as tradições católica e ortodoxas envolveu séculos, regiões distintas e tentativas de aproximação. Diálogos posteriores também fazem parte dessa história, sem apagar as diferenças que permanecem.",
    connection: "Ao estudar a Igreja Católica no Brasil, lembre que seu percurso é uma parte da história cristã. Outras tradições antigas também conservam comunidades, ensino e memória apostólica.",
    sourceIds: ["schism"], links: [{ href: "/igrejas/catolica", label: "Conhecer a trajetória católica no Brasil" }]
  },
  {
    id: "escritura-e-imprensa", period: "Meados do século XV", title: "Novos meios para a circulação dos textos",
    summary: "A impressão com tipos móveis desenvolvida por Gutenberg na Europa tornou possível produzir livros de outra maneira. A Bíblia impressa em meados da década de 1450 é um marco dessa transformação.",
    context: "A Bíblia já circulava havia muitos séculos em manuscritos, traduções, leituras comunitárias e liturgias. A imprensa não inventou as Escrituras nem levou imediatamente todos à alfabetização. Ela alterou o trabalho de reprodução e, ao lado de escolas, tradutores e redes de distribuição, ampliou as possibilidades de acesso aos textos.",
    connection: "Hoje, um aplicativo também é um meio de transmissão. Por isso, identificar edição, tradução, direitos e contexto da passagem é parte do cuidado com a leitura — e não um detalhe separado da fé.",
    sourceIds: ["gutenberg"], links: [{ href: "/biblioteca", label: "Conhecer os livros da edição disponível" }]
  },
  {
    id: "brasil-colonial", period: "1500, 1557 e o período colonial", title: "Chegadas ao Brasil, encontros e conflitos",
    summary: "A missa da expedição portuguesa em 1500 é um marco da presença católica documentada. Em 1557, a experiência francesa na Guanabara incluiu protestantes reformados. Essas presenças coloniais não equivalem às organizações nacionais formadas muito depois.",
    context: "O território já era habitado por povos com histórias, línguas e experiências religiosas próprias. Missões, ensino e culto se desenvolveram dentro da colonização, com relações desiguais de poder. A experiência da França Antártica foi breve; ela não deve ser confundida com a implantação duradoura de denominações protestantes nos séculos seguintes.",
    connection: "Para responder quando uma igreja chegou, é importante distinguir passagem de missionários, comunidade local, continuidade do trabalho e organização institucional. Uma única data nem sempre responde a todas essas perguntas.",
    sourceIds: ["brazil-catholic", "france-antarctique"], links: [{ href: "/igrejas/catolica", label: "Ver os marcos da presença católica" }, { href: "/igrejas/presbiteriana", label: "Distinguir a missão presbiteriana do século XIX" }]
  },
  {
    id: "reformas-e-tradicoes", period: "Século XVI · marco de 1517", title: "Reformas, controvérsias e novos caminhos",
    summary: "As controvérsias ligadas a Martinho Lutero em 1517 são um marco da Reforma protestante. Outros movimentos, reformadores e respostas católicas produziram trajetórias diversas; não existe uma única experiência que resuma todas as igrejas protestantes.",
    context: "Os debates envolveram autoridade, salvação, práticas religiosas e leitura das Escrituras, em sociedades com fortes disputas políticas. A Reforma não encerrou a história católica, nem explica sozinha todas as tradições posteriores. Igrejas luteranas, reformadas, batistas e metodistas possuem relações históricas que precisam ser estudadas sem apagar suas diferenças.",
    connection: "Uma conexão de herança teológica não significa que um reformador europeu fundou pessoalmente uma igreja brasileira. O painel abaixo identifica o tipo de relação em cada ramo.",
    sourceIds: ["reformation"], links: [{ href: "/igrejas/luterana", label: "Seguir a tradição luterana até o Brasil" }, { href: "/igrejas/presbiteriana", label: "Conhecer uma trajetória reformada brasileira" }]
  },
  {
    id: "comunidades-brasileiras", period: "Século XIX", title: "Imigração, missão e participação brasileira",
    summary: "No século XIX, comunidades de imigrantes e missões em português criaram novos caminhos protestantes no Brasil. A presença luterana de 1824 e os diferentes marcos batistas de 1871 e 1882 mostram por que é preciso perguntar que tipo de começo está sendo contado.",
    context: "As histórias não foram feitas apenas por missionários estrangeiros. Pessoas brasileiras, mulheres, famílias, educadores e músicos participaram da formação das comunidades. Chegada ao país, fundação de uma igreja local e criação de uma convenção ou sínodo são acontecimentos distintos. As fichas abaixo apresentam esses marcos separadamente, com suas fontes.",
    connection: "Ao seguir um nome no painel, observe a contribuição específica: ensino, missão, música, organização ou mudança de tradição. Assim, o estudo passa de uma lista de fundadores para uma história de relações.",
    sourceIds: ["ieclb", "cbb"], links: [{ href: "/igrejas/luterana", label: "Imigração e comunidades luteranas" }, { href: "/igrejas/batista", label: "Os marcos da história batista" }, { href: "/igrejas/congregacional", label: "Ensino e música no caminho dos Kalley" }]
  },
  {
    id: "pentecostalismos", period: "Início do século XX em diante", title: "Pentecostalismos e circulação de testemunhos",
    summary: "O avivamento da Rua Azusa, em Los Angeles, iniciado em 1906 e associado à liderança de William Seymour, foi um importante centro de expansão pentecostal. Pessoas negras, mulheres e redes de viagem participaram dessa circulação internacional.",
    context: "O movimento não nasceu de uma única instituição que depois controlou todas as igrejas. Experiências, missões e organizações seguiram caminhos próprios em diferentes países. No Brasil, as fichas da Congregação Cristã e das Assembleias de Deus ajudam a examinar os começos locais, sem supor que toda comunidade pentecostal possui a mesma doutrina, governo ou história.",
    connection: "Compare os relatos, identifique seus autores e pergunte como um testemunho de fé se relaciona com documentos, viagens e comunidades. Experiência espiritual e verificação de uma data são perguntas diferentes, que merecem respeito e clareza.",
    sourceIds: ["pentecostalism"], links: [{ href: "/igrejas/ccb", label: "Conhecer os começos da Congregação Cristã" }, { href: "/igrejas/assembleias", label: "Acompanhar a história assembleiana" }]
  },
  {
    id: "dialogo-e-presente", period: "Séculos XX e XXI", title: "Conhecer o outro sem apagar as diferenças",
    summary: "As comunidades cristãs continuam a transformar suas formas de ensino, comunicação e serviço. Iniciativas de diálogo, como o Conselho Mundial de Igrejas, fundado em 1948, reúnem parte dessas tradições e não representam todas elas.",
    context: "O Conselho Mundial de Igrejas não é uma igreja que governa as demais. A Igreja Católica não é uma igreja-membro, embora participe de formas de cooperação e diálogo. Ao lado dessas iniciativas, cada comunidade tem sua própria história. O quadro apresentado aqui é um panorama para orientar a pesquisa, não uma genealogia completa nem uma lista de representantes atuais de todo o cristianismo.",
    connection: "Agora, você pode investigar as conexões brasileiras com uma pergunta mais precisa: quem participou, em que época, em qual lugar, com qual contribuição e segundo qual fonte? Essa atenção ajuda a compreender as raízes e a conversar com respeito hoje.",
    sourceIds: ["wcc"], links: [{ href: "#history-network-explorer", label: "Abrir as conexões brasileiras" }, { href: "/meu-percurso", label: "Voltar ao percurso na Palavra" }]
  }
];

export function getChristianHistorySources(ids: readonly string[]) {
  return ids.map(id => christianHistorySources.find(source => source.id === id)).filter((source): source is ChristianHistorySource => Boolean(source));
}
