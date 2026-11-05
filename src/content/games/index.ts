/** Editorial activities. Quoted Scripture is supplied separately from the exact local edition. */
export type GameId = "caminho" | "conexoes" | "sinais";
export type ReadingId = "samaritano" | "salmo" | "paes";
export type GameReading = { id: ReadingId; label: string; bookId: string; chapter: number; start: number; end: number; verses: { number: number; text: string }[] };
export type GameReadings = Record<ReadingId, GameReading>;

export const gameReferences = [
  { id: "samaritano", label: "Lucas 10:25–37", bookId: "LUK", chapter: 10, start: 25, end: 37 },
  { id: "salmo", label: "Salmos 23:1–4", bookId: "PSA", chapter: 23, start: 1, end: 4 },
  { id: "paes", label: "João 6:1–15", bookId: "JHN", chapter: 6, start: 1, end: 15 },
] as const;

export const games: { id: GameId; number: string; title: string; subtitle: string; action: string; art: string; reading: ReadingId; skill: string }[] = [
  { id: "caminho", number: "01", title: "O caminho da compaixão", subtitle: "Reconstrua os gestos do samaritano.", action: "Reconstruir o caminho", art: "/visuals/story-bom-samaritano.png", reading: "samaritano", skill: "Reconstruir a sequência de um relato" },
  { id: "conexoes", number: "02", title: "Fios da Palavra", subtitle: "Una cada passagem ao seu contexto.", action: "Encontrar as conexões", art: "/visuals/stories-galilee.png", reading: "salmo", skill: "Reconhecer a forma e o contexto de uma passagem" },
  { id: "sinais", number: "03", title: "Nas mãos de Jesus", subtitle: "Explore as pistas do sinal dos pães.", action: "Investigar o relato", art: "/visuals/story-multiplicacao-dos-paes.png", reading: "paes", skill: "Conferir detalhes e reconhecer quem age no relato" },
];

export const compassionSteps = [
  { id: "viu", title: "Olhou com compaixão", description: "O samaritano viu o homem ferido e teve compaixão dele.", verse: 33, symbol: "heart" },
  { id: "tratou", title: "Cuidou das feridas", description: "Aproximou-se e colocou curativos nas feridas.", verse: 34, symbol: "hands" },
  { id: "levou", title: "Levou à hospedaria", description: "Colocou o homem em seu animal, levou-o à hospedaria e cuidou dele.", verse: 34, symbol: "house" },
  { id: "confiou", title: "Providenciou a continuidade", description: "No dia seguinte, entregou dinheiro ao hospedeiro e pediu que cuidasse dele.", verse: 35, symbol: "sun" },
] as const;
export const compassionTray = ["levou", "viu", "confiou", "tratou"] as const;

export const contextCategories = [
  { id: "salmo", title: "Oração em poesia", subtitle: "Um salmo de confiança no Senhor", symbol: "water" },
  { id: "sinal", title: "Um sinal de Jesus", subtitle: "Um acontecimento narrado no Evangelho", symbol: "bread" },
  { id: "parabola", title: "Uma parábola", subtitle: "Uma história contada por Jesus para ensinar", symbol: "heart" },
] as const;
export const passageConnections = [
  { id: "proximo", reading: "samaritano" as ReadingId, verses: [29, 30, 36, 37], title: "Quem é o meu próximo?", preview: "Jesus responde contando sobre um homem ferido e quem lhe mostrou misericórdia.", category: "parabola", art: "/visuals/story-bom-samaritano.png", feedback: "Em Lucas 10, Jesus responde à pergunta sobre o próximo com uma parábola. A pergunta final convida a reconhecer quem praticou misericórdia. Leia os versículos 29–37." },
  { id: "pastor", reading: "salmo" as ReadingId, verses: [1, 2, 3, 4], title: "O Senhor é meu pastor", preview: "Pastos, águas e o vale: imagens poéticas que expressam confiança na presença de Deus.", category: "salmo", art: "/visuals/stories-hope.png", feedback: "O Salmo 23 fala poeticamente da confiança no Senhor. O vale aparece no próprio salmo: a presença de Deus acompanha o salmista também na aflição. Leia os versículos 1–4." },
  { id: "multidao", reading: "paes" as ReadingId, verses: [11, 12, 13, 14], title: "Pães para a multidão", preview: "Jesus dá graças, reparte o alimento e a multidão é saciada. Os presentes reconhecem o sinal.", category: "sinal", art: "/visuals/story-multiplicacao-dos-paes.png", feedback: "João 6 narra um sinal realizado por Jesus; o versículo 14 o chama de sinal. O Evangelho apresenta o alimento repartido e a multidão saciada como um acontecimento, e não como uma parábola. Leia os versículos 11–14." },
] as const;

export const breadClues = [
  { id: "oferta", title: "O que havia ali?", shortTitle: "O começo", verse: 9, position: { left: "26%", top: "68%" }, question: "André fala de um menino. O que ele tinha?", options: [
    { id: "cinco-dois", label: "5 pães de cevada e 2 peixinhos", correct: true, feedback: "Isso mesmo. O versículo 9 nomeia os cinco pães de cevada e os dois peixinhos. O relato começa com essa pequena quantidade diante de tanta gente." },
    { id: "dois-cinco", label: "2 pães e 5 peixes", correct: false, feedback: "Vamos conferir juntos: João 6:9 menciona cinco pães de cevada e dois peixinhos. Volte ao versículo e observe cada detalhe." },
    { id: "doze", label: "12 pães e uma cesta de peixes", correct: false, feedback: "Os doze cestos aparecem depois, com as sobras. No começo, João 6:9 apresenta cinco pães e dois peixinhos." },
  ] },
  { id: "jesus", title: "Quem dá graças?", shortTitle: "As mãos de Jesus", verse: 11, position: { left: "53%", top: "39%" }, question: "Quem toma os pães e dá graças antes de reparti-los?", options: [
    { id: "menino", label: "O menino", correct: false, feedback: "O menino é mencionado no versículo 9. No versículo 11, quem toma os pães e dá graças é Jesus. Releia esse momento com calma." },
    { id: "jesus", label: "Jesus", correct: true, feedback: "Sim. João 6:11 coloca Jesus no centro: ele toma os pães e dá graças. Na edição do app, ele os reparte aos discípulos, e os discípulos aos que estavam sentados." },
    { id: "filipe", label: "Filipe", correct: false, feedback: "Filipe conversa com Jesus sobre o alimento nos versículos anteriores. Quem toma os pães e dá graças em João 6:11 é Jesus." },
  ] },
  { id: "cestos", title: "O que foi recolhido?", shortTitle: "Nada se perca", verse: 13, position: { left: "78%", top: "73%" }, question: "Depois que as pessoas se fartaram, quantos cestos foram cheios com os pedaços?", options: [
    { id: "sete", label: "7 cestos", correct: false, feedback: "Há outro relato de multiplicação que menciona sete cestos, em Marcos 8:8. Aqui estamos em João 6:13: foram doze cestos. Identificar a passagem evita misturar os relatos." },
    { id: "cinco", label: "5 cestos", correct: false, feedback: "Cinco é a quantidade de pães no início. João 6:13 conta doze cestos com os pedaços que sobraram. Confira o texto abaixo." },
    { id: "doze", label: "12 cestos", correct: true, feedback: "Doze cestos. Jesus havia pedido que recolhessem os pedaços para que nada se perdesse. O texto liga a abundância ao cuidado com o que sobrou." },
  ] },
] as const;

export const breadConclusion = {
  question: "Junte as pistas: qual conclusão se apoia no que acabamos de ler?",
  options: [
    { id: "organizacao", label: "A multidão produziu o alimento apenas por se organizar.", correct: false, feedback: "Organizar as pessoas aparece no relato, mas não explica tudo o que João narra. Jesus toma os pães, dá graças e os reparte; todos se fartam e ainda há sobras. João chama esse acontecimento de sinal (6:14)." },
    { id: "sinal", label: "Jesus deu graças e repartiu o alimento; a multidão se saciou e as sobras foram recolhidas.", correct: true, feedback: "Você reuniu os detalhes do relato. O sinal aponta para Jesus e seu poder; a ordem de recolher as sobras também nos chama a cuidar do que recebemos." },
    { id: "promessa", label: "Quem crê jamais enfrentará falta de alimento ou dificuldade material.", correct: false, feedback: "Esse milagre revela o poder e o cuidado de Jesus. Esses versículos não prometem uma vida sem dificuldades a todo aquele que crê. Vamos permanecer no que a passagem realmente afirma, sem culpar quem está em necessidade." },
  ],
} as const;

export function gameBibleLink(reading: Pick<GameReading, "bookId" | "chapter" | "start">, verse = reading.start) {
  return `/biblia?livro=${reading.bookId}&capitulo=${reading.chapter}&versiculo=${verse}#versiculo-${verse}`;
}
