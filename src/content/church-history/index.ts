export type HistorySource = Readonly<{ id: string; title: string; publisher: string; url: string; kind: "Memória institucional" | "Documento confessional" | "Enciclopédia colaborativa"; accessed: string }>;
export type HistoricalEvent = Readonly<{ year: string; title: string; text: string; sourceIds: readonly string[] }>;
export type ChurchHistory = Readonly<{
  id: string; name: string; shortName: string; family: string; year: number; origin: string;
  brazil: string; founders: string; purpose: string; teaching: string; summary: string;
  curiosity: string; context: string; events: readonly HistoricalEvent[]; sourceIds: readonly string[];
}>;
export type HistoricalPerson = Readonly<{
  id: string; name: string; role: string; period: string; origin: string; summary: string; contribution: string; sourceIds: readonly string[];
}>;
export type HistoricalRelationship = Readonly<{ from: string; to: string; label: string; kind: "missao" | "fundacao" | "musica" | "educacao" | "reforma" | "trajetoria"; explanation: string; sourceIds: readonly string[] }>;
const access = "2026-10-28";
const institutional = (id: string, title: string, publisher: string, url: string): HistorySource => ({ id, title, publisher, url, kind: "Memória institucional", accessed: access });
const confessional = (id: string, title: string, publisher: string, url: string): HistorySource => ({ id, title, publisher, url, kind: "Documento confessional", accessed: access });
const encyclopedia = (id: string, title: string, article: string): HistorySource => ({ id, title, publisher: "Wikipédia em português — conferir referências do artigo", url: `https://pt.wikipedia.org/wiki/${encodeURIComponent(article)}`, kind: "Enciclopédia colaborativa", accessed: access });
export const historySources: readonly HistorySource[] = [
  confessional("batista-doutrina", "Declaração Doutrinária da Convenção Batista Brasileira", "Convenção Batista Brasileira", "https://www.convencaobatista.com.br/site/pagina.php?MEN_ID=22"),
  confessional("adventista-doutrina", "Nossas crenças", "Igreja Adventista do Sétimo Dia", "https://institucional.adventistas.org/pt/nossas-crencas/"),
  confessional("metodista-doutrina", "Sermão 43 — O meio bíblico de salvação", "John Wesley · acervo oficial da Igreja Metodista", "https://www.metodista.org.br/content/interfaces/cms/userfiles/files/documentos-oficiais/SERMAO_43_O_MEIO_BIBLICO_DE_SALVACAO.pdf"),
  confessional("catolica-doutrina", "Catecismo da Igreja Católica — transmissão da Revelação, §§74–100", "Santa Sé", "https://www.vatican.va/archive/cathechism_po/index_new/p1s1c2_50-141_po.html"),
  confessional("ieclb-doutrina", "Confissão de Augsburgo — artigos IV, IX e X", "Portal Luterano — IECLB", "https://www.luterano.org.br/confissao-de-augsburgo/"),
  confessional("ipb-doutrina", "Manual Presbiteriano — Constituição, artigo 1º", "Igreja Presbiteriana do Brasil", "https://www.ipb.org.br/content/Downloads/Manual-Presbiteriano-2019.pdf"),
  institutional("ipb-oficial", "Sobre a IPB — história e doutrina", "Igreja Presbiteriana do Brasil", "https://www.ipb.org.br/sobre-a-ipb.php"),
  confessional("quadrangular-doutrina", "Doutrina Quadrangular", "Igreja do Evangelho Quadrangular", "https://quadrangular.com.br/Artigo/6843/Doutrina-Quadrangular"),
  encyclopedia("congregacional", "Igreja Evangélica Fluminense", "Igreja_Evangélica_Fluminense"),
  encyclopedia("robert-kalley", "Robert Reid Kalley", "Robert_Reid_Kalley"),
  encyclopedia("sarah-kalley", "Sarah Poulton Kalley", "Sarah_Poulton_Kalley"),
  encyclopedia("catolica", "Igreja Católica no Brasil", "Igreja_Católica_no_Brasil"),
  encyclopedia("nobrega", "Manuel da Nóbrega", "Manuel_da_Nóbrega"),
  encyclopedia("anchieta", "José de Anchieta", "José_de_Anchieta"),
  encyclopedia("zezinho", "Padre Zezinho", "José_Fernandes_de_Oliveira"),
  institutional("ieclb", "História da IECLB", "Igreja Evangélica de Confissão Luterana no Brasil", "https://www.luterano.org.br/conheca-a-ieclb/historia-da-ieclb/"),
  encyclopedia("lutero", "Martinho Lutero", "Martinho_Lutero"),
  encyclopedia("ipb", "Igreja Presbiteriana do Brasil", "Igreja_Presbiteriana_do_Brasil"),
  encyclopedia("simonton", "Ashbel Green Simonton", "Ashbel_Green_Simonton"),
  encyclopedia("conceicao", "José Manuel da Conceição", "José_Manuel_da_Conceição"),
  institutional("metodista", "Metodismo no Brasil", "Igreja Metodista", "https://www.metodista.org.br/institucional-metodismo-no-brasil/"),
  institutional("metodista-autonomia", "Autonomia da Igreja Metodista do Brasil — 94 anos de história", "Igreja Metodista", "https://www.metodista.org.br/autonomia-da-igreja-metodista-no-brasil-94-anos-de-historia/"),
  institutional("charles", "A vida de Carlos Wesley, o poeta do Metodismo (1707–1788)", "Igreja Metodista", "https://www.metodista.org.br/a-vida-de-carlos-wesley-o-poeta-do-metodismo-1707-1788/"),
  encyclopedia("wesley", "John Wesley", "John_Wesley"),
  encyclopedia("martha", "Martha Watts", "Martha_Watts"),
  institutional("cbb", "Nossa História", "Convenção Batista Brasileira", "https://www.convencaobatista.com.br/site/pagina.php?MEN_ID=24"),
  encyclopedia("anne", "Anne Luther Bagby", "Anne_Luther_Bagby"),
  encyclopedia("ginsburg", "Salomão Ginsburg", "Salomão_Ginsburg"),
  institutional("adventista", "Nossa história", "Igreja Adventista do Sétimo Dia", "https://institucional.adventistas.org/pt/quem-somos/identidade/nossa-historia/"),
  encyclopedia("adventista-brasil", "História adventista no Brasil", "Igreja_Adventista_do_Sétimo_Dia_no_Brasil"),
  encyclopedia("adventista-origem", "Igreja Adventista do Sétimo Dia", "Igreja_Adventista_do_Sétimo_Dia"),
  encyclopedia("ccb", "Congregação Cristã no Brasil", "Congregação_Cristã_no_Brasil"),
  encyclopedia("assembleias", "Assembleias de Deus no Brasil", "Assembleias_de_Deus_no_Brasil"),
  encyclopedia("frida", "Frida Vingren", "Frida_Vingren"),
  encyclopedia("harpa", "Harpa Cristã", "Harpa_Cristã"),
  institutional("quadrangular", "Nossa história", "Igreja do Evangelho Quadrangular", "https://quadrangular.com.br/Artigo/6845/Nossa-historia"),
  encyclopedia("quadrangular-datas", "Igreja Quadrangular", "Igreja_do_Evangelho_Quadrangular"),
  institutional("universal", "Nossa História", "Igreja Universal do Reino de Deus", "https://www.universal.org/a-universal/nossa-historia/")
];
export function sourcesFor(ids: readonly string[]) { return ids.map(id => historySources.find(source => source.id === id)).filter((source): source is HistorySource => Boolean(source)); }

const churchRecords: readonly ChurchHistory[] = [
  {
    id: "catolica", name: "Igreja Católica no Brasil", shortName: "Católica", family: "Católica", year: 1500,
    origin: "Cristianismo antigo, no mundo mediterrâneo; presença no Brasil ligada à expansão portuguesa.",
    brazil: "26 de abril de 1500: primeira missa documentada na expedição de Cabral, na região de Porto Seguro, Bahia. A presença permanente ganhou estrutura no período colonial.",
    founders: "A Igreja Católica se compreende em continuidade com Jesus Cristo e os apóstolos. Não foi fundada no Brasil por um missionário isolado. Frei Henrique de Coimbra celebrou a missa de 1500.",
    purpose: "Na colonização, evangelização, administração portuguesa e educação caminharam juntas. Essa história também envolve imposição cultural, escravização e resistência indígena e africana, que precisam ser examinadas com honestidade.",
    teaching: "Na perspectiva católica, Escritura, Tradição e Magistério se relacionam na transmissão da fé. A vida sacramental e a comunhão com os bispos e o bispo de Roma fazem parte de sua identidade.",
    summary: "Uma presença de cinco séculos, com comunidades, ordens religiosas, escolas, expressões populares de fé e mudanças na relação entre Igreja e Estado.",
    curiosity: "A chegada em 1500, a criação de uma diocese e a fundação da CNBB são marcos diferentes. A CNBB é uma conferência de bispos, criada em 1952; não é a fundadora do catolicismo brasileiro.",
    context: "A missa de 1500 é um marco documental da colonização, não o começo da história dos povos que já viviam neste território. A categoria Católica reúne experiências regionais muito diversas.",
    events: [
      { year: "1500", title: "Primeira missa documentada", text: "A celebração da expedição portuguesa tornou-se um marco da memória católica no Brasil.", sourceIds: ["catolica"] },
      { year: "1549", title: "Missão jesuíta", text: "Manuel da Nóbrega chegou com o primeiro grupo de jesuítas e o governo de Tomé de Sousa.", sourceIds: ["nobrega"] },
      { year: "1551", title: "Diocese de São Salvador", text: "A criação da primeira diocese deu outra estrutura à presença eclesiástica colonial.", sourceIds: ["catolica"] },
      { year: "1952", title: "Conferência dos bispos", text: "A CNBB passou a articular a ação comum do episcopado brasileiro.", sourceIds: ["catolica"] }
    ], sourceIds: ["catolica", "nobrega", "anchieta", "catolica-doutrina"]
  },
  {
    id: "luterana", name: "Presença luterana e IECLB", shortName: "Luterana · IECLB", family: "Protestante histórica", year: 1824,
    origin: "Reforma do século XVI, especialmente nos territórios de língua alemã. A IECLB é uma organização brasileira dessa tradição, não a totalidade das igrejas luteranas.",
    brazil: "1824: comunidades de imigrantes se organizaram no Brasil. A constituição da IECLB, como corpo eclesiástico nacional, ocorreu em 1968, com sede em Porto Alegre.",
    founders: "Martinho Lutero é uma referência da Reforma; comunidades imigrantes, pastores e sínodos construíram a história brasileira coletivamente. Não houve um único fundador da IECLB em 1824.",
    purpose: "Imigrantes procuravam manter culto, ensino e vida comunitária. A ligação entre comunidades e a formação pastoral levaram à cooperação sinodal e a uma igreja de abrangência nacional.",
    teaching: "Na tradição luterana, a justificação pela graça mediante a fé e a centralidade das Escrituras são fundamentais. Batismo e ceia do Senhor ocupam lugar central na vida comunitária.",
    summary: "Da fé trazida por famílias imigrantes à cooperação entre sínodos, passando pela formação teológica e pela atuação pública no país.",
    curiosity: "A IECLB distingue a presença luterana iniciada em 1824 de sua constituição jurídica e eclesiástica em 1968. Confundir essas datas apaga mais de um século de comunidades.",
    context: "IECLB e IELB são organizações distintas. Esta ficha acompanha a memória da IECLB e não atribui sua trajetória a todas as igrejas luteranas brasileiras.",
    events: [
      { year: "1517", title: "Raízes na Reforma", text: "A controvérsia iniciada na Reforma europeia é uma referência da identidade luterana.", sourceIds: ["ieclb", "lutero"] },
      { year: "1824", title: "Comunidades no Brasil", text: "Famílias imigrantes trouxeram sua fé e a disposição de organizar comunidades.", sourceIds: ["ieclb"] },
      { year: "1949", title: "Federação Sinodal", text: "A cooperação entre sínodos fortaleceu a construção de uma igreja nacional.", sourceIds: ["ieclb"] },
      { year: "1968", title: "Constituição da IECLB", text: "A Igreja Evangélica de Confissão Luterana no Brasil foi constituída com sede em Porto Alegre.", sourceIds: ["ieclb"] }
    ], sourceIds: ["ieclb", "lutero", "ieclb-doutrina"]
  },
  {
    id: "presbiteriana", name: "Igreja Presbiteriana do Brasil", shortName: "Presbiteriana · IPB", family: "Protestante histórica", year: 1859,
    origin: "Tradição reformada europeia; a missão que deu origem à IPB veio dos Estados Unidos.",
    brazil: "12 de agosto de 1859: Ashbel Green Simonton chegou ao Rio de Janeiro. A primeira igreja local foi organizada em 12 de janeiro de 1862.",
    founders: "Simonton foi um missionário pioneiro, acompanhado por outros obreiros e por brasileiros como José Manuel da Conceição. A chegada da missão e a organização da igreja são marcos diferentes.",
    purpose: "A missão buscava formar comunidades, ensinar a Bíblia, preparar ministros e divulgar a fé reformada em português.",
    teaching: "Na perspectiva da IPB, as Escrituras são a regra de fé e prática; seus símbolos confessionais incluem a Confissão de Fé e os catecismos de Westminster. A igreja é governada por presbíteros e concílios.",
    summary: "Missão, imprensa e formação pastoral se conectaram no nascimento do presbiterianismo brasileiro.",
    curiosity: "A Imprensa Evangélica surgiu em 1864. Um jornal e um seminário ajudaram a difundir o ensino para além das reuniões de culto.",
    context: "A IPB é uma das organizações presbiterianas do Brasil. Outras denominações reformadas possuem trajetórias e decisões institucionais próprias.",
    events: [
      { year: "1859", title: "Chegada de Simonton", text: "O missionário desembarcou no Rio de Janeiro em 12 de agosto.", sourceIds: ["ipb", "simonton"] },
      { year: "1862", title: "Primeira igreja local", text: "A comunidade presbiteriana do Rio foi formalmente organizada.", sourceIds: ["ipb"] },
      { year: "1864", title: "Imprensa Evangélica", text: "A publicação ampliou a circulação de ideias e de leituras protestantes.", sourceIds: ["ipb", "simonton"] },
      { year: "1865", title: "Ministério brasileiro", text: "José Manuel da Conceição foi ordenado em 17 de dezembro.", sourceIds: ["conceicao"] }
    ], sourceIds: ["ipb-oficial", "ipb-doutrina", "ipb", "simonton", "conceicao"]
  },
  {
    id: "metodista", name: "Igreja Metodista no Brasil", shortName: "Metodista", family: "Protestante histórica", year: 1836,
    origin: "Movimento de renovação cristã do século XVIII na Inglaterra, associado a John e Charles Wesley. As primeiras missões no Brasil vieram dos Estados Unidos.",
    brazil: "1836: início da primeira missão metodista, com Justin Spaulding e, depois, Daniel P. Kidder. O trabalho foi interrompido em 1841; uma nova etapa começou em 1867. A autonomia brasileira foi declarada em 1930.",
    founders: "John Wesley é referência do movimento, não fundador pessoal de uma igreja brasileira. Missionários, educadoras e comunidades locais participaram da formação do metodismo no país.",
    purpose: "Reunir evangelização, discipulado, santidade vivida no cotidiano, educação e cuidado social. A formação de escolas é parte importante dessa presença.",
    teaching: "Na tradição wesleyana, a graça de Deus antecede e acompanha a resposta humana; a fé é chamada a se expressar em amor e santidade. Estudo bíblico e vida comunitária caminham juntos.",
    summary: "Uma história de pregação, escolas, pequenos grupos, hinologia e organização de uma igreja brasileira autônoma.",
    curiosity: "O ensino metodista contou com o trabalho de mulheres como Martha Watts. O Colégio Piracicabano, inaugurado em 1881, tornou a educação uma expressão concreta da missão.",
    context: "A primeira missão, sua retomada e a autonomia eclesiástica são eventos distintos. A família metodista inclui organizações que não se confundem com a Igreja Metodista brasileira.",
    events: [
      { year: "Século XVIII", title: "Raízes wesleyanas", text: "John e Charles Wesley participaram do movimento de renovação cristã na Inglaterra.", sourceIds: ["wesley", "charles"] },
      { year: "1836", title: "Primeira missão", text: "A missão com Justin Spaulding antecedeu a etapa permanente iniciada em 1867.", sourceIds: ["metodista"] },
      { year: "1881", title: "Educação em Piracicaba", text: "Martha Watts inaugurou o Colégio Piracicabano.", sourceIds: ["martha"] },
      { year: "1930", title: "Autonomia", text: "A Igreja Metodista no Brasil organizou sua autonomia em relação à missão norte-americana.", sourceIds: ["metodista-autonomia"] }
    ], sourceIds: ["metodista", "metodista-autonomia", "metodista-doutrina", "wesley", "charles", "martha"]
  },
  {
    id: "batista", name: "Batistas e Convenção Batista Brasileira", shortName: "Batista · CBB", family: "Protestante histórica", year: 1871,
    origin: "Comunidades batistas inglesas do século XVII, incluindo grupos em Amsterdã e Londres. A expansão no Brasil teve forte participação de missionários norte-americanos.",
    brazil: "1871: comunidade de imigrantes em Santa Bárbara, São Paulo. Em 1882, a missão em Salvador organizou uma igreja voltada à evangelização em português. A CBB foi criada em 1907.",
    founders: "Os casais William e Anne Bagby, Zacharias e Katherine Taylor e o brasileiro Antônio Teixeira de Albuquerque participaram da igreja de Salvador. A Convenção é uma cooperação entre igrejas autônomas.",
    purpose: "Anunciar o evangelho, formar comunidades de pessoas que professam a fé e cooperar em missões, educação e publicações.",
    teaching: "Na perspectiva batista, destacam-se a autoridade das Escrituras, o batismo de quem professa a fé, a autonomia da igreja local e a liberdade religiosa. As diferentes convenções batistas não são uma única administração.",
    summary: "Imigração, evangelização em português e cooperação nacional são fios distintos que se encontram nessa trajetória.",
    curiosity: "A própria história da CBB distingue a comunidade de Santa Bárbara da missão de Salvador. Dizer apenas primeira igreja, sem explicar o critério, esconde essa diferença.",
    context: "A memória institucional da CBB contém interpretações próprias sobre raízes batistas. Aqui não se afirma uma cadeia institucional ininterrupta desde os apóstolos ou desde movimentos medievais.",
    events: [
      { year: "1871", title: "Santa Bárbara", text: "Uma comunidade batista de imigrantes foi organizada no interior paulista.", sourceIds: ["cbb"] },
      { year: "1882", title: "Missão em Salvador", text: "A comunidade da Bahia se tornou um marco da evangelização batista em português.", sourceIds: ["cbb"] },
      { year: "1891", title: "Cantor Cristão", text: "Salomão Ginsburg publicou a primeira edição do hinário.", sourceIds: ["ginsburg"] },
      { year: "1907", title: "Cooperação nacional", text: "Em 22 de junho, a Convenção Batista Brasileira foi organizada em Salvador.", sourceIds: ["cbb"] }
    ], sourceIds: ["cbb", "batista-doutrina", "anne", "ginsburg"]
  },
  {
    id: "adventista", name: "Igreja Adventista do Sétimo Dia", shortName: "Adventista", family: "Adventista", year: 1893,
    origin: "Movimento adventista norte-americano do século XIX. A denominação foi organizada em 1863, em Battle Creek, Michigan, Estados Unidos.",
    brazil: "Literatura adventista circulou antes da organização das comunidades. Albert Stauffer chegou como missionário designado em 1893; o batismo de Guilherme Stein Jr. ocorreu em 1895. A comunidade de Gaspar Alto, Santa Catarina, foi organizada em 1896.",
    founders: "A organização teve participação de vários pioneiros, incluindo Joseph Bates, James White e Ellen White. No Brasil, colportores, pastores e famílias locais participaram do início.",
    purpose: "Compartilhar a esperança da volta de Cristo, ensinar as Escrituras e desenvolver ações de educação, saúde e serviço.",
    teaching: "Na perspectiva adventista, a observância do sábado, a expectativa do retorno de Cristo e a relação entre fé, saúde e educação são características importantes. Essas ênfases pertencem a essa tradição e não a todas as igrejas.",
    summary: "Livros e revistas chegaram antes de muitas congregações: leitura, colportagem, escolas e saúde compõem a memória dessa expansão.",
    curiosity: "Chegada de literatura, envio oficial de um missionário, primeiro batismo e organização de uma igreja não ocorreram no mesmo ano. Separar esses marcos ajuda a compreender a história.",
    context: "A narrativa sobre pioneiros é apresentada como memória institucional quando provém da igreja. Uma experiência religiosa relatada por seus participantes não é tratada como comprovação histórica de um evento sobrenatural.",
    events: [
      { year: "1863", title: "Organização nos Estados Unidos", text: "A denominação foi organizada em Battle Creek.", sourceIds: ["adventista", "adventista-origem"] },
      { year: "1893", title: "Albert Stauffer", text: "O colportor foi enviado ao Brasil e trabalhou com literatura em comunidades de língua alemã.", sourceIds: ["adventista"] },
      { year: "1895", title: "Batismo em Piracicaba", text: "A igreja identifica Guilherme Stein Jr. como o primeiro brasileiro batizado como adventista.", sourceIds: ["adventista"] },
      { year: "1896", title: "Gaspar Alto", text: "A comunidade catarinense é um marco da organização adventista brasileira.", sourceIds: ["adventista-brasil"] }
    ], sourceIds: ["adventista", "adventista-doutrina", "adventista-brasil", "adventista-origem"]
  },
  {
    id: "ccb", name: "Congregação Cristã no Brasil", shortName: "Congregação Cristã", family: "Pentecostal", year: 1910,
    origin: "Redes pentecostais entre imigrantes italianos nos Estados Unidos, especialmente em Chicago, no início do século XX.",
    brazil: "1910: Louis Francescon atuou em Santo Antônio da Platina, Paraná, e em São Paulo. Esses núcleos fazem parte do início da Congregação no país.",
    founders: "Louis Francescon foi um missionário pioneiro, ao lado de outros participantes das comunidades. Sua biografia liga a migração italiana, Chicago e a evangelização no Brasil.",
    purpose: "As primeiras comunidades buscavam compartilhar a fé pentecostal e reunir os fiéis para oração, leitura bíblica, canto e serviço comunitário.",
    teaching: "A CCB se identifica como cristã e pentecostal. Sua vida comunitária dá destaque à Bíblia, ao batismo, à oração e ao canto congregacional. Orientações institucionais devem ser consultadas em documentos oficiais, não deduzidas desta síntese histórica.",
    summary: "Da migração italiana e do pentecostalismo de Chicago a comunidades que se espalharam pelo Brasil, com identidade própria de culto e organização.",
    curiosity: "A trajetória de Francescon conecta três contextos: a origem italiana, as comunidades de Chicago e os núcleos brasileiros. Conhecer esses deslocamentos ajuda a compreender como a mensagem atravessou línguas e fronteiras.",
    context: "O site oficial não pôde ser consultado de modo estável nesta pesquisa. A ficha usa síntese enciclopédica com referências e não autentica circulares, regras atuais ou declarações de liderança.",
    events: [
      { year: "Início do século XX", title: "Redes em Chicago", text: "Imigrantes italianos participaram de comunidades e experiências pentecostais nos Estados Unidos.", sourceIds: ["ccb"] },
      { year: "1910", title: "Núcleos no Brasil", text: "Francescon atuou em Santo Antônio da Platina e em São Paulo.", sourceIds: ["ccb"] }
    ], sourceIds: ["ccb"]
  },
  {
    id: "assembleias", name: "Assembleias de Deus no Brasil", shortName: "Assembleias de Deus", family: "Pentecostal", year: 1911,
    origin: "Redes pentecostais internacionais do início do século XX. Daniel Berg e Gunnar Vingren eram suecos e vieram ao Brasil a partir dos Estados Unidos.",
    brazil: "1910: chegada de Berg e Vingren a Belém, Pará. Em 18 de junho de 1911, a comunidade que deu origem às Assembleias de Deus foi organizada; a designação Assembleia de Deus foi adotada depois.",
    founders: "Daniel Berg e Gunnar Vingren são pioneiros reconhecidos da fundação em Belém. Mulheres, obreiros brasileiros e famílias locais participaram da expansão.",
    purpose: "Evangelização, formação de comunidades e ênfase pentecostal na ação do Espírito Santo, com intensa circulação de missionários, imprensa e música.",
    teaching: "Na tradição assembleiana, a autoridade bíblica, a salvação em Cristo e a experiência pentecostal do Espírito Santo são centrais. Documentos confessionais e práticas variam entre convenções e ministérios.",
    summary: "Belém, missões, hinários e imprensa estão ligados ao crescimento de uma família de igrejas com diversas convenções.",
    curiosity: "A Harpa Cristã foi lançada em 1922. Seu repertório conecta tradutores, compositores e comunidades; Frida Vingren e Paulo Leivas Macalão são parte dessa história musical.",
    context: "As Assembleias brasileiras não são simplesmente uma filial fundada pela denominação norte-americana em 1914. CGADB, CONAMAD e outros agrupamentos têm histórias próprias; a rede não sugere uma chefia única.",
    events: [
      { year: "1910", title: "Chegada a Belém", text: "Berg e Vingren chegaram ao Pará vindos dos Estados Unidos.", sourceIds: ["assembleias"] },
      { year: "1911", title: "Comunidade organizada", text: "18 de junho é o marco de fundação reconhecido pelas Assembleias no Brasil.", sourceIds: ["assembleias"] },
      { year: "1917", title: "Frida no Brasil", text: "A missionária sueca chegou e atuou também na escrita, na tradução e na música.", sourceIds: ["frida"] },
      { year: "1922", title: "Harpa Cristã", text: "A primeira edição do hinário marcou o canto congregacional assembleiano.", sourceIds: ["harpa"] }
    ], sourceIds: ["assembleias", "frida", "harpa"]
  },
  {
    id: "quadrangular", name: "Igreja do Evangelho Quadrangular", shortName: "Quadrangular", family: "Pentecostal", year: 1951,
    origin: "Los Angeles, Estados Unidos: Aimee Semple McPherson inaugurou o Angelus Temple em 1º de janeiro de 1923.",
    brazil: "15 de novembro de 1951: organização em São João da Boa Vista, São Paulo. Harold e Mary Williams fazem parte da missão inicial no país.",
    founders: "Aimee Semple McPherson é a fundadora da organização internacional. A chegada ao Brasil está ligada a missionários como Harold Williams, com participação de sua esposa Mary.",
    purpose: "Compartilhar o evangelho por pregação, missões e reuniões abertas. As tendas de evangelização tiveram grande importância na expansão brasileira.",
    teaching: "Na apresentação quadrangular, Jesus Cristo é Salvador, Batizador com o Espírito Santo, Médico dos médicos e Rei que voltará. As quatro ênfases dão sentido ao nome da igreja.",
    summary: "Uma evangelista na origem internacional e uma missão no Brasil marcada por tendas, deslocamentos e formação de novas comunidades.",
    curiosity: "Segundo a memória da igreja, mulheres da comunidade ajudaram a confeccionar tendas. Uma estrutura móvel permitia alcançar bairros e cidades onde ainda não havia templo.",
    context: "A história institucional expressa sua interpretação de fé sobre chamados e curas. Esses relatos são identificados como memória religiosa, e não como verificação independente de milagres.",
    events: [
      { year: "1923", title: "Angelus Temple", text: "A sede internacional foi inaugurada em Los Angeles.", sourceIds: ["quadrangular"] },
      { year: "1951", title: "São João da Boa Vista", text: "A organização brasileira teve início no interior de São Paulo.", sourceIds: ["quadrangular-datas"] },
      { year: "Década de 1950", title: "Evangelização em tendas", text: "A memória institucional registra a circulação de tendas e a formação de novas igrejas.", sourceIds: ["quadrangular"] },
      { year: "Década de 1960", title: "Expansão pelo país", text: "O planejamento missionário passou a incluir as capitais e depois outros municípios.", sourceIds: ["quadrangular"] }
    ], sourceIds: ["quadrangular", "quadrangular-datas", "quadrangular-doutrina"]
  },
  {
    id: "universal", name: "Igreja Universal do Reino de Deus", shortName: "Universal", family: "Neopentecostal", year: 1977,
    origin: "Rio de Janeiro, Brasil, no contexto de expansão dos movimentos pentecostais e de novas formas de evangelização urbana.",
    brazil: "9 de julho de 1977: culto inaugural em um antigo espaço comercial no bairro da Abolição, Rio de Janeiro, segundo a história institucional.",
    founders: "A memória institucional destaca Edir Macedo como fundador e o apoio de sua mãe, Eugênia. Esta ficha não pretende apresentar uma relação completa de todos os participantes da organização inicial.",
    purpose: "A proposta institucional enfatiza evangelização urbana, reuniões de oração e acolhimento de pessoas que buscam ajuda espiritual.",
    teaching: "A Universal se apresenta como igreja cristã com ênfase na fé em Jesus Cristo, na ação do Espírito Santo e em práticas de oração. A classificação neopentecostal é uma categoria de análise, não um nome adotado por todas as comunidades desse campo.",
    summary: "Do coreto do Méier e da primeira reunião na Abolição à expansão de uma organização religiosa de origem brasileira.",
    curiosity: "A história oficial distingue a pregação ao ar livre, no coreto do Méier, do culto inaugural em um espaço na Abolição. São lugares ligados a etapas diferentes.",
    context: "A fonte utilizada é a narrativa da própria instituição. Ela mostra como a igreja conta seu início; não equivale a uma investigação independente ou a uma biografia integral de seus fundadores.",
    events: [
      { year: "Antes de 1977", title: "Coreto do Méier", text: "A memória institucional registra a pregação de Edir Macedo em um coreto do bairro.", sourceIds: ["universal"] },
      { year: "1977", title: "Primeiro espaço de culto", text: "O culto inaugural na Abolição ocorreu em 9 de julho.", sourceIds: ["universal"] }
    ], sourceIds: ["universal"]
  }
  ,{
    id: "congregacional", name: "Congregacionalismo e Igreja Evangélica Fluminense", shortName: "Congregacional", family: "Protestante histórica", year: 1855,
    origin: "Redes protestantes britânicas e comunidades de língua portuguesa. Robert Reid Kalley era escocês; Sarah Poulton Kalley era inglesa.",
    brazil: "10 de maio de 1855: chegada do casal Kalley ao Rio de Janeiro. Em Petrópolis, iniciaram o ensino bíblico; em 11 de julho de 1858 foi organizada a Igreja Evangélica Fluminense, no Rio.",
    founders: "Robert e Sarah Kalley participaram do início da missão, junto de portugueses e brasileiros. A comunidade fluminense se tornou uma referência do congregacionalismo brasileiro.",
    purpose: "Compartilhar o ensino bíblico em português, organizar uma comunidade local e desenvolver leitura, canto e escola dominical.",
    teaching: "A identidade congregacional destaca a vida e a responsabilidade da comunidade local. A Igreja Fluminense adotou a Breve Exposição das Doutrinas Fundamentais do Cristianismo; sua leitura deve ser feita no contexto dessa tradição.",
    summary: "Aula bíblica, comunidade em português e hinário: três caminhos que se encontram no trabalho dos Kalley.",
    curiosity: "A história de Sarah se liga à organização de Salmos e Hinos, publicado em 1861. A música ajudava as pessoas a aprender e a participar do culto em sua própria língua.",
    context: "A Fluminense é um marco da igreja evangélica permanente de missão em português. Isso não apaga as experiências reformadas do período colonial nem as comunidades de imigrantes anteriores. Chegada em 1855, organização em 1858 e publicação em 1861 são marcos diferentes.",
    events: [
      { year: "1855", title: "Chegada dos Kalley", text: "O casal chegou ao Rio em maio e iniciou ensino bíblico em Petrópolis.", sourceIds: ["robert-kalley", "sarah-kalley"] },
      { year: "1858", title: "Comunidade fluminense", text: "A Igreja Evangélica Fluminense foi organizada em 11 de julho.", sourceIds: ["congregacional", "robert-kalley"] },
      { year: "1861", title: "Salmos e Hinos", text: "O hinário em português reúne o trabalho musical de Sarah e de Robert Kalley.", sourceIds: ["sarah-kalley", "robert-kalley"] }
    ], sourceIds: ["congregacional", "robert-kalley", "sarah-kalley"]
  }
];

export const churches: readonly ChurchHistory[] = [...churchRecords].sort((a, b) => a.year - b.year);

export const people: readonly HistoricalPerson[] = [
  { id: "manuel-nobrega", name: "Manuel da Nóbrega", role: "Missionário jesuíta", period: "1517–1570 · Brasil: 1549", origin: "Portugal → Bahia", summary: "Liderou o primeiro grupo de jesuítas enviado à colônia portuguesa em 1549, junto da administração de Tomé de Sousa.", contribution: "Sua atuação liga evangelização, aldeamentos e educação no período colonial. Estudar essa missão exige considerar também o projeto colonial e os efeitos sobre os povos indígenas.", sourceIds: ["nobrega", "catolica"] },
  { id: "jose-anchieta", name: "José de Anchieta", role: "Missionário, educador e escritor", period: "1534–1597 · Brasil: 1553", origin: "Ilhas Canárias → colônia portuguesa", summary: "Chegou ao Brasil em 1553 como jesuíta. Participou da missão de Piratininga e escreveu textos ligados ao ensino e à catequese.", contribution: "Sua gramática da língua usada na costa e sua produção teatral mostram a relação entre língua, educação e evangelização. Esse trabalho ocorreu dentro de uma realidade colonial desigual.", sourceIds: ["anchieta"] },
  { id: "padre-zezinho", name: "Padre Zezinho", role: "Sacerdote, compositor e cantor", period: "Música católica · segunda metade do século XX", origin: "Machado, Minas Gerais, Brasil", summary: "José Fernandes de Oliveira tornou-se conhecido como Padre Zezinho. Sua atuação sacerdotal e musical aproximou catequese, comunicação e canção popular.", contribution: "É um exemplo de como o ensino cristão também circula por melodias, gravações e encontros. Sua presença nesta rede indica atuação na música católica; não fundação de uma igreja.", sourceIds: ["zezinho"] },
  { id: "martinho-lutero", name: "Martinho Lutero", role: "Teólogo da Reforma", period: "1483–1546 · Reforma: século XVI", origin: "Territórios alemães", summary: "Foi um dos protagonistas da Reforma do século XVI. A publicação de suas teses em 1517 tornou-se um marco da controvérsia religiosa europeia.", contribution: "A tradução bíblica, a pregação e os escritos teológicos influenciaram comunidades luteranas. Lutero não esteve no Brasil e não fundou a IECLB: sua conexão é de tradição teológica.", sourceIds: ["lutero", "ieclb"] },
  { id: "ashbel-simonton", name: "Ashbel Green Simonton", role: "Missionário presbiteriano", period: "1833–1867 · Brasil: 1859", origin: "Estados Unidos → Rio de Janeiro", summary: "Chegou ao Rio em 12 de agosto de 1859 e participou da organização da igreja presbiteriana local em 1862.", contribution: "Ajudou a desenvolver imprensa, formação teológica e organização de comunidades. A Imprensa Evangélica, de 1864, relaciona sua missão à circulação de leitura em português.", sourceIds: ["simonton", "ipb"] },
  { id: "jose-conceicao", name: "José Manuel da Conceição", role: "Pastor e evangelista brasileiro", period: "1822–1873 · ordenação: 1865", origin: "São Paulo, Brasil", summary: "Antes sacerdote católico, ingressou na comunidade presbiteriana e foi ordenado em 17 de dezembro de 1865.", contribution: "Suas viagens pelo interior mostram que a expansão protestante não foi apenas obra de estrangeiros. Pessoas brasileiras também pregaram, traduziram experiências e formaram comunidades.", sourceIds: ["conceicao", "ipb"] },
  { id: "john-wesley", name: "John Wesley", role: "Pregador e organizador do metodismo", period: "1703–1791", origin: "Inglaterra", summary: "Sacerdote anglicano e um dos principais organizadores do movimento metodista no século XVIII, cultivou pregação, estudo e vida comunitária.", contribution: "Seus escritos e sua organização de grupos influenciaram o discipulado metodista. Não foi um missionário no Brasil; a ligação nesta rede é histórica e teológica.", sourceIds: ["wesley", "metodista"] },
  { id: "charles-wesley", name: "Charles Wesley", role: "Poeta e compositor de hinos", period: "1707–1788", origin: "Inglaterra", summary: "Irmão de John Wesley, participou do movimento metodista e escreveu milhares de hinos.", contribution: "Suas composições deram linguagem cantada ao ensino e à oração. A relação com a tradição metodista é musical e histórica, e não de chegada pessoal ao Brasil.", sourceIds: ["charles"] },
  { id: "martha-watts", name: "Martha Watts", role: "Missionária e educadora", period: "Colégio Piracicabano: 1881", origin: "Estados Unidos → Piracicaba, São Paulo", summary: "Participou da implantação da educação metodista no Brasil e inaugurou o Colégio Piracicabano em 13 de setembro de 1881.", contribution: "Sua trajetória torna visível a atuação de mulheres na formação de escolas e na vida da missão. Educação e evangelização se conectam aqui por uma obra documentada.", sourceIds: ["martha"] },
  { id: "william-bagby", name: "William Buck Bagby", role: "Missionário batista", period: "Brasil: a partir de 1881", origin: "Estados Unidos → Brasil", summary: "Veio ao Brasil com Anne Bagby e participou da formação da comunidade batista de Salvador em 1882.", contribution: "Sua trajetória conecta a comunidade de imigrantes em São Paulo à missão em língua portuguesa na Bahia. A igreja de Salvador contou também com os Taylor e com Antônio Teixeira de Albuquerque.", sourceIds: ["cbb"] },
  { id: "anne-bagby", name: "Anne Luther Bagby", role: "Missionária e educadora batista", period: "Missão brasileira: fim do século XIX", origin: "Estados Unidos → Brasil", summary: "Atuou no trabalho missionário batista junto de William Bagby e participou da formação de comunidades e de iniciativas de educação.", contribution: "Seu nome evita reduzir a missão à biografia dos homens que a integraram. A comunidade de Salvador é narrada pela CBB como trabalho de casais missionários e de um colaborador brasileiro.", sourceIds: ["cbb", "anne"] },
  { id: "antonio-albuquerque", name: "Antônio Teixeira de Albuquerque", role: "Pregador brasileiro", period: "Comunidade de Salvador: 1882", origin: "Brasil", summary: "Ex-sacerdote católico, aproximou-se dos batistas em Santa Bárbara e participou da organização da igreja em Salvador.", contribution: "Sua atuação liga a missão em português a um participante brasileiro. A história institucional registra ainda seu trabalho em Maceió, onde contribuiu para outra comunidade.", sourceIds: ["cbb"] },
  { id: "salomao-ginsburg", name: "Salomão Ginsburg", role: "Missionário, escritor e hinologista", period: "1867–1927 · Brasil: 1890", origin: "Região da atual Polônia → Brasil", summary: "Chegou ao Brasil em 1890 e atuou na evangelização batista. Em 1891 publicou a primeira edição do Cantor Cristão.", contribution: "Sua atuação conecta missões, publicações e música. Também participou das articulações que levaram à organização da Convenção Batista Brasileira em 1907.", sourceIds: ["ginsburg", "cbb"] },
  { id: "ellen-white", name: "Ellen White", role: "Escritora e pioneira adventista", period: "1827–1915", origin: "Estados Unidos", summary: "Participou do movimento que deu origem à Igreja Adventista do Sétimo Dia. Seus escritos têm relevância na identidade dessa tradição.", contribution: "A igreja apresenta seu trabalho como ministério profético e associa seus escritos a temas de fé, saúde e educação. Essa é uma compreensão confessional adventista, identificada como tal.", sourceIds: ["adventista", "adventista-origem"] },
  { id: "albert-stauffer", name: "Albert Stauffer", role: "Colportor e missionário", period: "Missão no Brasil: 1893", origin: "Missão adventista internacional → Brasil", summary: "A história adventista o identifica como o primeiro missionário designado pela Associação Geral a chegar ao Brasil, em maio de 1893.", contribution: "Trabalhou com a distribuição e venda de literatura, sobretudo entre comunidades de língua alemã. Seu exemplo mostra como livros podiam circular antes da organização de igrejas locais.", sourceIds: ["adventista"] },
  { id: "guilherme-stein", name: "Guilherme Stein Jr.", role: "Pioneiro adventista brasileiro", period: "Batismo: abril de 1895", origin: "Brasil · Piracicaba, São Paulo", summary: "É identificado pela memória adventista como o primeiro brasileiro batizado na denominação, em abril de 1895, no rio Piracicaba.", contribution: "Sua presença recorda que a história de uma igreja inclui a resposta das pessoas locais, e não apenas a chegada de missionários. O marco de seu batismo não é a data de chegada da literatura ao país.", sourceIds: ["adventista"] },
  { id: "louis-francescon", name: "Louis Francescon", role: "Missionário pentecostal", period: "1866–1964 · Brasil: 1910", origin: "Itália → Estados Unidos → Brasil", summary: "Imigrante italiano nos Estados Unidos, participou das redes pentecostais de Chicago e, em 1910, atuou em Santo Antônio da Platina e São Paulo.", contribution: "Sua trajetória ajuda a compreender a conexão entre migração, tradução cultural e nascimento de comunidades da Congregação Cristã no Brasil.", sourceIds: ["ccb"] },
  { id: "daniel-berg", name: "Daniel Berg", role: "Missionário pentecostal", period: "Chegada ao Pará: 1910", origin: "Suécia → Estados Unidos → Belém", summary: "Chegou a Belém com Gunnar Vingren em 1910. Ambos participaram do início da comunidade assembleiana em 1911.", contribution: "Seu percurso mostra que o país de nascimento e o lugar de onde veio uma missão podem ser diferentes: era sueco, mas veio ao Brasil a partir dos Estados Unidos.", sourceIds: ["assembleias"] },
  { id: "gunnar-vingren", name: "Gunnar Vingren", role: "Missionário e pastor", period: "Belém: 1910–1911", origin: "Suécia → Estados Unidos → Brasil", summary: "Com Daniel Berg, participou da formação da comunidade em Belém que é reconhecida como o início das Assembleias de Deus brasileiras.", contribution: "Sua história se conecta a igrejas locais, redes missionárias e à atuação de Frida Vingren. A expansão posterior contou com numerosas lideranças brasileiras.", sourceIds: ["assembleias", "frida"] },
  { id: "frida-vingren", name: "Frida Vingren", role: "Missionária, escritora e compositora", period: "1891–1940 · Brasil: 1917", origin: "Suécia → Brasil", summary: "Chegou ao Brasil em 1917. Atuou na missão assembleiana e desenvolveu trabalho de escrita, tradução e música.", contribution: "Suas composições integram a memória da Harpa Cristã. Sua trajetória também permite estudar os debates históricos sobre os espaços de atuação das mulheres nas igrejas.", sourceIds: ["frida", "harpa"] },
  { id: "paulo-macalao", name: "Paulo Leivas Macalão", role: "Pastor e hinologista", period: "Harpa Cristã · século XX", origin: "Brasil", summary: "Seu nome está ligado à história pastoral assembleiana e ao trabalho com o repertório da Harpa Cristã.", contribution: "A conexão musical aponta para composição, tradução e organização do canto congregacional. Ela não significa autoria de todos os hinos ou fundação de todas as Assembleias de Deus.", sourceIds: ["harpa"] },
  { id: "aimee-mcpherson", name: "Aimee Semple McPherson", role: "Evangelista e fundadora", period: "Angelus Temple: 1923", origin: "Canadá → Estados Unidos", summary: "Fundou a organização quadrangular internacional. A inauguração do Angelus Temple, em Los Angeles, em 1º de janeiro de 1923, é um marco dessa história.", contribution: "Sua atuação mostra a importância de mulheres na formação de movimentos pentecostais. Sua relação com a igreja brasileira é de origem institucional, não de chegada pessoal em 1951.", sourceIds: ["quadrangular", "quadrangular-datas"] },
  { id: "harold-williams", name: "Harold Williams", role: "Missionário quadrangular", period: "Início brasileiro: 1951", origin: "Estados Unidos → Brasil", summary: "A história quadrangular identifica Harold e Mary Williams na missão que deu início à organização brasileira em São João da Boa Vista.", contribution: "Harold está associado ao uso de tendas de evangelização. O relato institucional descreve como estruturas móveis facilitaram convites e reuniões em diferentes cidades.", sourceIds: ["quadrangular", "quadrangular-datas"] },
  { id: "mary-williams", name: "Mary Williams", role: "Missionária quadrangular", period: "Missão brasileira · década de 1950", origin: "Missão norte-americana → Brasil", summary: "Participou da missão com Harold Williams. A narrativa da igreja registra a atuação do casal na aproximação com as pessoas e na formação de comunidades.", contribution: "Sua presença na rede dá visibilidade ao trabalho missionário em parceria. Não se atribui a ela um cargo atual, uma biografia completa ou a fundação internacional da igreja.", sourceIds: ["quadrangular"] },
  { id: "edir-macedo", name: "Edir Macedo", role: "Fundador e pregador", period: "Início da Universal: 1977", origin: "Brasil · Rio de Janeiro", summary: "É apresentado pela Universal como fundador. A memória institucional registra pregações no coreto do Méier e o culto inaugural na Abolição em 9 de julho de 1977.", contribution: "Sua trajetória permite estudar uma organização de origem brasileira e a evangelização urbana. A ficha acompanha o início documentado na fonte institucional e não funciona como endosso ou avaliação pessoal.", sourceIds: ["universal"] }
  ,{ id: "robert-kalley", name: "Robert Reid Kalley", role: "Médico e missionário", period: "Brasil: 1855 · Igreja Fluminense: 1858", origin: "Escócia → Brasil", summary: "Chegou ao Rio de Janeiro com Sarah em 10 de maio de 1855. Participou da organização da Igreja Evangélica Fluminense em 11 de julho de 1858.", contribution: "Sua trajetória conecta comunidades de língua portuguesa, ensino bíblico, publicações e formação de uma igreja local. O estabelecimento da comunidade não deve ser confundido com a primeira presença de qualquer protestante no país.", sourceIds: ["robert-kalley", "congregacional"] },
  { id: "sarah-kalley", name: "Sarah Poulton Kalley", role: "Missionária, educadora e musicista", period: "1825–1907 · Brasil: 1855", origin: "Inglaterra → Brasil", summary: "Atuou com Robert Kalley no ensino bíblico em Petrópolis e na missão que deu origem à Igreja Evangélica Fluminense.", contribution: "Participou da organização de Salmos e Hinos, publicado em 1861. Sua atuação reúne ensino, escrita e canto em português; essa conexão musical é histórica, não uma associação suposta por preferência artística.", sourceIds: ["sarah-kalley", "robert-kalley", "congregacional"] }
];

function relation(from: string, to: string, label: string, kind: HistoricalRelationship["kind"], explanation: string, sourceIds: readonly string[]): HistoricalRelationship { return { from, to, label, kind, explanation, sourceIds }; }
export const relationships: readonly HistoricalRelationship[] = [
  relation("catolica", "jose-conceicao", "trajetória anterior", "trajetoria", "Conceição foi sacerdote católico antes de ingressar no presbiterianismo. Esta ligação identifica uma etapa anterior de sua biografia, não um vínculo atual ou uma fundação.", ["conceicao"]),
  relation("catolica", "antonio-albuquerque", "trajetória anterior", "trajetoria", "Albuquerque havia sido sacerdote católico antes de participar da missão batista. O ramo descreve uma mudança de trajetória, não uma relação de autoridade entre igrejas.", ["cbb"]),
  relation("congregacional", "robert-kalley", "missão · 1855", "missao", "Robert participou da missão em Petrópolis e da organização da Igreja Fluminense em 1858.", ["robert-kalley", "congregacional"]),
  relation("congregacional", "sarah-kalley", "Salmos e Hinos · 1861", "musica", "Sarah participou do ensino e da organização do hinário Salmos e Hinos, publicado em 1861.", ["sarah-kalley", "robert-kalley"]),
  relation("catolica", "manuel-nobrega", "missão · 1549", "missao", "Nóbrega liderou o primeiro grupo de jesuítas enviado à colônia portuguesa.", ["nobrega"]),
  relation("catolica", "jose-anchieta", "missão · 1553", "missao", "Anchieta chegou como jesuíta em 1553 e participou da catequese e do ensino colonial.", ["anchieta"]),
  relation("catolica", "padre-zezinho", "música e catequese", "musica", "A atuação sacerdotal e musical de Padre Zezinho integra a história da comunicação católica.", ["zezinho"]),
  relation("luterana", "martinho-lutero", "raízes da Reforma", "reforma", "A IECLB identifica a Reforma do século XVI como referência histórica. Lutero não fundou a igreja brasileira.", ["ieclb", "lutero"]),
  relation("presbiteriana", "ashbel-simonton", "missão · 1859", "missao", "Simonton chegou ao Rio em 1859 e participou da organização da primeira igreja local em 1862.", ["ipb", "simonton"]),
  relation("presbiteriana", "jose-conceicao", "ministério · 1865", "missao", "Conceição foi ordenado em 1865 e participou da evangelização no interior.", ["conceicao"]),
  relation("metodista", "john-wesley", "tradição wesleyana", "reforma", "Wesley foi uma referência do movimento inglês que influenciou a missão metodista posterior.", ["wesley", "metodista"]),
  relation("metodista", "charles-wesley", "poesia e hinologia", "musica", "Os hinos de Charles Wesley são parte formadora da espiritualidade metodista.", ["charles"]),
  relation("metodista", "martha-watts", "educação · 1881", "educacao", "Martha Watts inaugurou o Colégio Piracicabano em 1881.", ["martha"]),
  relation("batista", "william-bagby", "missão · 1882", "missao", "William participou da igreja de Salvador com Anne, os Taylor e Albuquerque.", ["cbb"]),
  relation("batista", "anne-bagby", "missão e educação", "educacao", "Anne participou da missão batista e de iniciativas educacionais.", ["anne", "cbb"]),
  relation("batista", "antonio-albuquerque", "evangelização local", "missao", "O brasileiro participou das comunidades de Salvador e Maceió.", ["cbb"]),
  relation("batista", "salomao-ginsburg", "Cantor Cristão · 1891", "musica", "Ginsburg publicou a primeira edição do Cantor Cristão e participou da articulação da CBB.", ["ginsburg", "cbb"]),
  relation("adventista", "ellen-white", "pioneirismo e escrita", "fundacao", "White participou da formação da tradição adventista e tem relevância confessional identificada nessa igreja.", ["adventista"]),
  relation("adventista", "albert-stauffer", "colportagem · 1893", "missao", "A história institucional registra o envio de Stauffer ao Brasil em 1893.", ["adventista"]),
  relation("adventista", "guilherme-stein", "comunidade · 1895", "missao", "Stein é identificado como o primeiro brasileiro batizado como adventista.", ["adventista"]),
  relation("ccb", "louis-francescon", "missão · 1910", "missao", "Francescon participou dos núcleos de Santo Antônio da Platina e São Paulo em 1910.", ["ccb"]),
  relation("assembleias", "daniel-berg", "fundação · 1911", "fundacao", "Berg e Vingren são reconhecidos como pioneiros da comunidade assembleiana em Belém.", ["assembleias"]),
  relation("assembleias", "gunnar-vingren", "fundação · 1911", "fundacao", "Vingren e Berg participaram da organização da comunidade de Belém em 1911.", ["assembleias"]),
  relation("assembleias", "frida-vingren", "missão e música", "musica", "Frida atuou na missão, na escrita e na composição de hinos.", ["frida"]),
  relation("assembleias", "paulo-macalao", "hinologia", "musica", "Macalão tem participação documentada na história do repertório da Harpa Cristã.", ["harpa"]),
  relation("quadrangular", "aimee-mcpherson", "origem · 1923", "fundacao", "Aimee fundou a organização internacional e inaugurou o Angelus Temple em Los Angeles.", ["quadrangular"]),
  relation("quadrangular", "harold-williams", "missão · 1951", "missao", "Harold está ligado ao início da igreja no Brasil e às tendas de evangelização.", ["quadrangular", "quadrangular-datas"]),
  relation("quadrangular", "mary-williams", "missão em parceria", "missao", "Mary participou da missão brasileira com Harold Williams.", ["quadrangular"]),
  relation("universal", "edir-macedo", "fundação · 1977", "fundacao", "A memória institucional destaca Macedo nas pregações iniciais e no culto inaugural.", ["universal"])
];
export function getChurch(id: string) { return churches.find(church => church.id === id); }
export function getPerson(id: string) { return people.find(person => person.id === id); }
export function getConnections(id: string) { return relationships.filter(edge => edge.from === id || edge.to === id); }
