import type { BiblicalStory, StoryReference } from "./index";

const ref = (label: string, book: string, chapter: number, verse: number): StoryReference => ({ label, book, chapter, verse });

export const miracleStories: readonly BiblicalStory[] = [
  {
    id: "multiplicacao-dos-paes", title: "Quando o pouco é colocado nas mãos de Jesus", subtitle: "O sinal dos pães e o cuidado de Cristo", era: "Os sinais de Jesus · João 6:1–35", theme: "Provisão", art: "galilee", symbol: "sprout", image: "/visuals/story-multiplicacao-dos-paes.png",
    introduction: "Há uma multidão, uma necessidade e um alimento que parece pequeno demais. João nos convida a olhar para Jesus: o sinal anuncia sua compaixão e nos conduz a perguntar quem ele é. Vamos ouvir essa Palavra com fé e atenção.",
    context: "João situa o episódio perto da Páscoa. O relato lembra a provisão no deserto e continua numa conversa em que Jesus se apresenta como o pão da vida. Os pães não são um detalhe isolado: o Evangelho aproxima alimento, sinal e identidade de Cristo.",
    connection: "Deus sustentou Israel no deserto, e o Evangelho apresenta Jesus acolhendo e alimentando. Depois do sinal, o convite é permanecer com ele. Leia João 6:22–35 para acompanhar a passagem do alimento recebido à fé em Cristo.",
    example: "Ao perceber uma família sem alimento, podemos oferecer o que temos, mobilizar ajuda e orar. Confiar no poder de Deus caminha com a disposição de servir. O sinal nos aproxima de Jesus; não estabelece uma fórmula para multiplicar dinheiro ou obter resultados por quantidade de fé.",
    scenes: [
      { title: "Jesus vê quem precisa de cuidado", text: "Uma grande multidão se aproxima. Jesus pergunta a Filipe sobre o alimento, e a conversa revela a dimensão da necessidade. O olhar do Senhor alcança pessoas concretas, que também sentem fome e cansaço.", observe: "Leia quem faz a pergunta e como Filipe responde. O que André consegue enxergar em meio à dificuldade?", reference: ref("João 6:1–9", "JHN", 6, 1) },
      { title: "Cinco pães e dois peixes", text: "André apresenta um menino com cinco pães de cevada e dois peixes. Aos olhos dos discípulos, aquilo parece insuficiente. O sinal será conduzido por Jesus: a esperança desta história repousa em seu poder e em seu cuidado.", observe: "Compare o alimento apresentado em 6:9 com a ordem de Jesus em 6:10. A passagem não termina na avaliação humana da falta.", reference: ref("João 6:9–10", "JHN", 6, 9) },
      { title: "Dar graças, repartir, saciar", text: "Jesus dá graças e distribui o alimento. As pessoas recebem o quanto desejam. O Evangelho anuncia esse sinal como obra de Cristo, que acolhe a necessidade e revela algo de quem ele é.", observe: "Observe as ações de Jesus e a descrição de quem recebe. Confira também o cuidado em recolher o que sobrou.", reference: ref("João 6:11–13", "JHN", 6, 11) },
      { title: "O sinal nos conduz ao Senhor", text: "A multidão deseja fazer Jesus rei, e ele se retira. Mais adiante, Jesus conduz a conversa para o pão da vida. Receber um sinal também nos chama a conhecer aquele que o realiza.", observe: "Leia o final do episódio junto de João 6:26–35. O que muda quando buscamos conhecer Jesus, além do que desejamos receber?", reference: ref("João 6:14–15; 26–35", "JHN", 6, 14) }
    ],
    question: { prompt: "Por que seguimos lendo João 6 depois da multiplicação?", options: [
      { text: "Porque o sinal nos conduz a conhecer Jesus, o pão da vida.", feedback: "Sim. João 6:35 ajuda a compreender o sinal na sequência do Evangelho. A provisão aponta para Cristo e para a vida de fé com ele." },
      { text: "Porque a passagem oferece uma técnica para conseguir qualquer bem material.", feedback: "Volte a João 6:26–35. Jesus aprofunda a conversa e não oferece uma técnica de enriquecimento. O convite é conhecer o Senhor e confiar nele." }
    ] }, nextReading: ref("João 6:22–35", "JHN", 6, 22)
  },
  {
    id: "jesus-acalma-a-tempestade", title: "A voz de Jesus no meio da tempestade", subtitle: "Confiança no Senhor que está no barco", era: "Os sinais de Jesus · Marcos 4:35–41", theme: "Confiança", art: "galilee", symbol: "water", image: "/visuals/story-jesus-acalma-a-tempestade.png",
    introduction: "Os discípulos conhecem o medo. Estão no barco com Jesus e enfrentam uma tempestade. Marcos anuncia o poder do Senhor e nos convida a aproximar nossas perguntas daquele em quem confiamos, sem esconder o que sentimos.",
    context: "O episódio vem depois das parábolas de Marcos 4 e abre uma sequência de relatos sobre a autoridade de Jesus. A pergunta final dos discípulos é central: eles procuram compreender quem está com eles.",
    connection: "As parábolas anunciam o Reino; os sinais ajudam os discípulos a conhecer o Rei. Ao continuar em Marcos 5, observe como essa autoridade aparece junto do encontro com pessoas que precisam de restauração e cuidado.",
    example: "Uma notícia difícil pode trazer medo mesmo a quem crê. Podemos orar com sinceridade, procurar companhia e dar os passos de cuidado ao nosso alcance. O medo dos discípulos não os impede de chamar Jesus; o estudo nos convida à confiança, sem julgar a dor alheia.",
    scenes: [
      { title: "Vamos para a outra margem", text: "Ao anoitecer, Jesus propõe a travessia. Os discípulos o levam no barco. Caminhar com o Senhor inclui aprender durante o caminho: eles ainda têm muito a descobrir sobre aquele que seguem.", observe: "Quem propõe a travessia? Leia a cena desde o começo, antes de chegar à tempestade.", reference: ref("Marcos 4:35–36", "MRK", 4, 35) },
      { title: "Uma pergunta no meio do medo", text: "O vento se levanta e as ondas atingem o barco. Jesus está dormindo. Os discípulos o acordam e apresentam sua aflição. A oração também pode começar com uma pergunta feita entre lágrimas.", observe: "Escute o pedido dos discípulos sem caricaturar seu medo. O que desejam saber sobre o cuidado de Jesus?", reference: ref("Marcos 4:37–38", "MRK", 4, 37) },
      { title: "O vento e o mar se aquietam", text: "Jesus se levanta, repreende o vento e fala ao mar. Marcos anuncia que o vento cessa e há grande calmaria. O relato apresenta o poder de Cristo: os discípulos testemunham algo que ultrapassa o que podiam realizar.", observe: "Compare a grande tempestade de 4:37 com a grande calmaria de 4:39. A mudança acompanha a palavra de Jesus.", reference: ref("Marcos 4:39", "MRK", 4, 39) },
      { title: "Quem é este?", text: "Jesus fala com os discípulos sobre medo e fé. Eles se admiram de que o vento e o mar lhe obedeçam. A pergunta final abre o coração para conhecer mais profundamente o Senhor, além da solução do perigo.", observe: "A quem se refere a pergunta de 4:41? Anote uma descoberta sobre Jesus e continue a leitura em Marcos 5.", reference: ref("Marcos 4:40–41", "MRK", 4, 40) }
    ],
    question: { prompt: "Qual pergunta conduz o encerramento dessa passagem?", options: [
      { text: "Quem é Jesus, a quem até o vento e o mar obedecem?", feedback: "Essa é a direção de Marcos 4:41. O sinal conduz à identidade e à autoridade de Jesus. A fé pode crescer enquanto o conhecemos e levamos a ele nossas perguntas." },
      { text: "Como concluir que uma pessoa assustada não tem valor para Deus?", feedback: "O texto não autoriza desvalorizar alguém por sentir medo. Jesus está com os discípulos, responde à aflição e os ensina. Observe para quem a pergunta final aponta." }
    ] }, nextReading: ref("Marcos 5:1–20", "MRK", 5, 1)
  },
  {
    id: "lazaro", title: "Jesus, a ressurreição e a vida", subtitle: "Lágrimas, esperança e a voz que chama Lázaro", era: "Os sinais de Jesus · João 11:1–44", theme: "Vida", art: "hope", symbol: "sprout", image: "/visuals/story-lazaro.png",
    introduction: "Jesus encontra uma família que ama, acolhe a dor e anuncia sua identidade. A fé cristã reconhece nele a ressurreição e a vida. Vamos ler com reverência: aqui há lágrimas verdadeiras e uma esperança que vem do Senhor.",
    context: "João 11 apresenta Marta, Maria e Lázaro em Betânia. O Evangelho reúne a conversa sobre a ressurreição, o choro de Jesus e o sinal diante do sepulcro. Depois, acompanha as reações que se intensificam no caminho para a paixão.",
    connection: "Os sinais em João conduzem à identidade de Jesus. A vida de Lázaro restaurada prepara o leitor para a paixão e para o anúncio da ressurreição de Cristo. Leia João 11:45–57 e 12:1–11 para perceber essa ligação.",
    example: "Ao visitar alguém enlutado, podemos oferecer presença, escuta, oração e ajuda concreta. Jesus chora nesta história. Crer na ressurreição não exige silenciar as lágrimas nem prometer que toda perda será revertida antes da esperança final que aguardamos em Deus.",
    scenes: [
      { title: "Uma família amada por Jesus", text: "Marta e Maria enviam a notícia da enfermidade de Lázaro. João afirma o amor de Jesus por essa família. O relato nos ensina a não medir o amor de Deus pela ausência de enfermidade ou de sofrimento.", observe: "Leia a referência ao amor em 11:5 e acompanhe a sequência. Evite concluir que a dor significa abandono.", reference: ref("João 11:1–16", "JHN", 11, 1) },
      { title: "Uma conversa de fé e esperança", text: "Marta vai ao encontro de Jesus e apresenta sua dor e sua confiança. Jesus se apresenta como a ressurreição e a vida. A conversa conduz à fé naquele que está diante dela.", observe: "Observe como Marta responde à pergunta de Jesus. O centro dessa conversa é a identidade do Senhor.", reference: ref("João 11:17–27", "JHN", 11, 17) },
      { title: "Jesus também chora", text: "Maria se aproxima, e o sofrimento da comunidade aparece na cena. Jesus se comove e chora. O Filho de Deus não é indiferente à dor: sua presença acolhe quem sofre.", observe: "Permaneça em João 11:33–36. Que atitudes podemos aprender antes de tentar explicar o luto de outra pessoa?", reference: ref("João 11:28–37", "JHN", 11, 28) },
      { title: "Uma voz que chama para a vida", text: "Diante do sepulcro, Jesus ora e chama Lázaro. João narra sua saída e a ordem para desatá-lo. O sinal anuncia o poder de Cristo sobre a morte e convida à fé; a comunidade participa do cuidado.", observe: "Leia as palavras dirigidas a Lázaro e depois às pessoas ao redor. O que cada uma é chamada a fazer?", reference: ref("João 11:38–44", "JHN", 11, 38) }
    ],
    question: { prompt: "O que a fé em Cristo nos permite reconhecer junto de uma pessoa enlutada?", options: [
      { text: "Podemos acolher as lágrimas e testemunhar a esperança em Jesus.", feedback: "Sim. João 11 reúne o choro de Jesus e seu anúncio como ressurreição e vida. Esperança e presença compassiva caminham juntas, sem apressar a dor de ninguém." },
      { text: "Precisamos exigir que ela pare de chorar para demonstrar fé.", feedback: "Volte a João 11:35: Jesus chora. A esperança cristã não exige esconder a dor. Cuidar inclui escutar e acompanhar, sem transformar o luto em avaliação espiritual." }
    ] }, nextReading: ref("João 11:45–57", "JHN", 11, 45)
  }
];
