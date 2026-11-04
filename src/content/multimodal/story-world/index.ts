export const storyWorldStops = [
  {
    id: "multidao", title: "Jesus vê a multidão", short: "O encontro", verse: 5, label: "João 6:1–5", x: 140,
    text: "Uma multidão se aproxima de Jesus. Antes de pensarmos nos pães, vamos olhar para o Senhor que percebe pessoas e necessidades. Seu cuidado dá o tom deste encontro.",
    observe: "Quem toma a iniciativa ao perceber a multidão? Leia a pergunta de Jesus no versículo 5."
  },
  {
    id: "filipe", title: "Uma pergunta a Filipe", short: "A pergunta", verse: 7, label: "João 6:5–7", x: 455,
    text: "Jesus pergunta onde comprar alimento. Filipe apresenta o tamanho da dificuldade. João nos conta que Jesus sabia o que ia fazer: a necessidade será acolhida por quem tem poder para agir.",
    observe: "Compare o que Filipe consegue calcular com o que João conta sobre Jesus no versículo 6."
  },
  {
    id: "menino", title: "Cinco pães e dois peixes", short: "O pouco oferecido", verse: 9, label: "João 6:8–10", x: 770,
    text: "André apresenta um menino com cinco pães de cevada e dois peixes. Aos olhos dos discípulos, parece pouco diante de tanta gente. Jesus pede que as pessoas se assentem.",
    observe: "Observe a passagem da pergunta sobre a falta à orientação de Jesus. O centro da esperança permanece nele."
  },
  {
    id: "gracas", title: "Jesus dá graças e reparte", short: "O sinal", verse: 11, label: "João 6:11", x: 1085,
    text: "Jesus toma os pães, dá graças e distribui o alimento. As pessoas recebem o quanto desejam. O Evangelho anuncia o sinal realizado por Cristo, que sacia e revela seu cuidado.",
    observe: "Acompanhe as ações de Jesus. Quem conduz o sinal? Como o versículo descreve o alimento recebido?"
  },
  {
    id: "recolher", title: "Que nada se perca", short: "O cuidado continua", verse: 12, label: "João 6:12–15", x: 1400,
    text: "Depois que todos comem, Jesus manda recolher os pedaços. O cuidado continua depois do alimento recebido. O relato segue com a reação da multidão e nos convida a conhecer o Senhor além do sinal.",
    observe: "Leia a ordem de Jesus no versículo 12. Depois, siga até João 6:35 para ouvir seu anúncio como pão da vida."
  }
] as const;

export const storyWorldQuestion = {
  prompt: "Ao terminar esse encontro, para quem o sinal dos pães dirige o nosso olhar?",
  options: [
    { text: "Para Jesus, que acolhe a multidão e se apresenta como o pão da vida.", correct: true, feedback: "Essa é uma descoberta para guardar. O cuidado de Jesus atravessa a cena; João 6:35 aprofunda quem ele é. O sinal nos chama a conhecê-lo e a permanecer com ele." },
    { text: "Para uma técnica que garante qualquer bem material quando repetimos os mesmos gestos.", correct: false, feedback: "Vamos acompanhar o Evangelho um pouco mais. Em João 6:26–35, Jesus conduz a conversa para a fé nele. O relato não oferece uma técnica de enriquecimento; ele apresenta o Senhor que dá vida." }
  ]
} as const;

export const storyWorldReference = (verse: number) => `/biblia?livro=JHN&capitulo=6&versiculo=${verse}#versiculo-${verse}`;
