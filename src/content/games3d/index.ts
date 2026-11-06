/**
 * An editorial, playable reading of the good Samaritan (Luke 10:25–37).
 * Positions, camera, gestures and the compact landscape are game adaptations.
 * Exact quoted Scripture must be supplied separately from the licensed corpus.
 */
export type WorldPosition = Readonly<{ x: number; z: number }>;
export type InteractionTarget = "traveler" | "supplies" | "donkey" | "inn" | "keeper";
export type MissionStage = "encontro" | "preparo" | "cuidado" | "transporte" | "acolhida" | "continuidade";
export type MissionReference = Readonly<{ bookId: "LUK"; chapter: 10; start: number; end: number; label: string }>;
export type MissionObjective = Readonly<{
  id: MissionStage;
  number: number;
  title: string;
  instruction: string;
  target: InteractionTarget;
  action: string;
  reference: MissionReference;
  lesson: string;
  completedMessage: string;
}>;

export const worldBounds = { minX: -25, maxX: 25, minZ: -45, maxZ: 45 } as const;
export const worldPoints = {
  spawn: { x: 0, z: 32 },
  traveler: { x: -3, z: 4 },
  supplies: { x: 3, z: 8 },
  donkey: { x: 2, z: 6 },
  inn: { x: 5, z: -25 },
  keeper: { x: 5, z: -28 },
} as const satisfies Record<string, WorldPosition>;
export const innFootprint = { minX: -1, maxX: 11, minZ: -39, maxZ: -29 } as const;
export const interactionRadius = 2.6;
export const escortArrivalRadius = 3.6;
export const minimumEscortDistance = 24;

const passage = (start: number, end = start): MissionReference => ({ bookId: "LUK", chapter: 10, start, end, label: `Lucas 10:${start}${end !== start ? `–${end}` : ""}` });
export const missionReference = passage(25, 37);
export const missionStages: readonly MissionObjective[] = [
  {
    id: "encontro", number: 1, title: "O caminho encontra uma vida",
    instruction: "Siga a estrada até o viajante ferido. Aproxime-se e pare ao lado dele: há uma pessoa que precisa de cuidado.",
    target: "traveler", action: "Parar junto ao viajante", reference: passage(33),
    lesson: "Jesus apresenta um samaritano que vê o homem ferido e tem compaixão. O encontro começa quando alguém deixa de passar ao longe.",
    completedMessage: "Você parou. Em Lucas 10:33, a compaixão aproxima o samaritano daquele que precisa dele. Vamos cuidar deste encontro.",
  },
  {
    id: "preparo", number: 2, title: "O que você traz pode servir",
    instruction: "Busque a bolsa de cuidado junto ao seu animal. Ela reúne os panos, o azeite e o vinho que a cena representa.",
    target: "supplies", action: "Pegar a bolsa de cuidado", reference: passage(34),
    lesson: "O relato menciona curativos, azeite e vinho. A bolsa e seu lugar no cenário são uma adaptação para participar da leitura; não são detalhes acrescentados ao texto bíblico.",
    completedMessage: "A bolsa está com você. O recurso recebido tem um destino: o cuidado com o viajante. Volte até ele para continuar.",
  },
  {
    id: "cuidado", number: 3, title: "A compaixão ganha mãos",
    instruction: "Volte ao viajante e use a bolsa para representar o cuidado das feridas. Aqui, o que aprendemos se transforma em um gesto.",
    target: "traveler", action: "Cuidar das feridas", reference: passage(34),
    lesson: "Lucas 10:34 liga a aproximação ao cuidado concreto. Os gestos desta cena acompanham a parábola; a Palavra pode ser aberta a qualquer momento para conferir.",
    completedMessage: "Você representou o cuidado das feridas. Na parábola, o samaritano também prepara uma forma de levar o homem à hospedaria.",
  },
  {
    id: "transporte", number: 4, title: "Um caminho acompanhado",
    instruction: "Aproxime-se do seu animal e ajude o viajante a seguir sobre ele. Depois, conduza os dois pela estrada até a hospedaria.",
    target: "donkey", action: "Ajudar o viajante a seguir no animal", reference: passage(34),
    lesson: "Jesus conta que o samaritano coloca o homem sobre o animal que o transportava. O animal desta representação é um jumento; Lucas não especifica sua espécie.",
    completedMessage: "O viajante segue sobre o animal. Caminhe com calma até a hospedaria: o cuidado acompanha a pessoa durante o caminho.",
  },
  {
    id: "acolhida", number: 5, title: "Há lugar para continuar o cuidado",
    instruction: "Conduza o animal com o viajante até a entrada da hospedaria. Permaneça perto deles; a jornada agora é acompanhada.",
    target: "inn", action: "Acolher o viajante na hospedaria", reference: passage(34),
    lesson: "O samaritano leva o homem à hospedaria e cuida dele. Chegar é uma parte do gesto; a parábola ainda vai mostrar como o cuidado continua.",
    completedMessage: "O viajante foi acolhido. A narrativa avança agora para o dia seguinte, como Lucas 10:35 indica. Procure o hospedeiro para combinar a continuidade.",
  },
  {
    id: "continuidade", number: 6, title: "O amor também providencia o amanhã",
    instruction: "No dia seguinte, aproxime-se do hospedeiro e entregue os dois dinheiros para a continuidade do cuidado, acompanhando Lucas 10:35.",
    target: "keeper", action: "Providenciar a continuidade do cuidado", reference: passage(35, 37),
    lesson: "O samaritano não encerra o cuidado ao deixar o homem na hospedaria. Ele providencia recursos e se compromete com o que ainda for necessário. Jesus encerra a parábola chamando à misericórdia.",
    completedMessage: "Você acompanhou os gestos desta leitura: aproximar-se, cuidar, levar e providenciar a continuidade. Abra Lucas 10:36–37 e permaneça com a pergunta de Jesus: quem agiu como próximo?",
  },
];

export const missionIntroduction = {
  title: "Pelo caminho da misericórdia",
  subtitle: "Uma jornada jogável inspirada no bom samaritano",
  setting: "Na estrada de Jerusalém a Jericó",
  invitation: "Entre na paisagem, caminhe com atenção e descubra como a compaixão se aproxima de quem precisa. A Palavra acompanha cada gesto.",
  literaryContext: "Jesus conta esta parábola ao responder à pergunta sobre quem é o próximo, em Lucas 10:25–37. O cenário é uma interpretação artística; não é a localização arqueológica de um acontecimento nem uma reconstrução histórica autenticada.",
  adaptation: "A estrada compacta, a bolsa, os movimentos, os diálogos editoriais, a aparência das pessoas e o jumento são recursos do jogo. O texto bíblico distingue o que Jesus conta; os comentários ajudam a acompanhar a leitura.",
  progression: "Os marcos registram somente ações concluídas nesta visita. Não medem fé, santidade ou valor pessoal e desaparecem ao reiniciar ou recarregar.",
} as const;

export type MissionFeedback = Readonly<{ kind: "guidance" | "progress" | "complete"; text: string }>;
export type MissionState = Readonly<{
  position: WorldPosition;
  stage: MissionStage | "concluido";
  completed: readonly MissionStage[];
  inventory: Readonly<{ careKit: boolean; coins: number }>;
  travelerCared: boolean;
  travelerAboard: boolean;
  travelerDelivered: boolean;
  companionPosition: WorldPosition | null;
  escortDistance: number;
  feedback: MissionFeedback | null;
}>;
export type MissionEvent =
  | { type: "position"; position: WorldPosition }
  | { type: "interact"; target?: InteractionTarget }
  | { type: "restart" }
  | { type: "clear-feedback" };
export type MissionInteraction = Readonly<{
  id: InteractionTarget;
  label: string;
  point: WorldPosition;
  distance: number;
  available: boolean;
  reason: string;
}>;

export function createMissionState(): MissionState {
  return {
    position: { ...worldPoints.spawn }, stage: "encontro", completed: [],
    inventory: { careKit: false, coins: 2 }, travelerCared: false,
    travelerAboard: false, travelerDelivered: false, companionPosition: null,
    escortDistance: 0, feedback: null,
  };
}

export function distanceBetween(a: WorldPosition, b: WorldPosition): number {
  return Math.hypot(a.x - b.x, a.z - b.z);
}
export function getCurrentObjective(state: MissionState): MissionObjective | null {
  return missionStages.find(objective => objective.id === state.stage) ?? null;
}
export function getAvailableInteraction(state: MissionState): MissionInteraction | null {
  const objective = getCurrentObjective(state);
  if (!objective) return null;
  const point = worldPoints[objective.target];
  const distance = distanceBetween(state.position, point);
  let reason = "";
  if (distance > interactionRadius) reason = objective.target === "inn" ? "Continue pela estrada até a entrada da hospedaria, acompanhando o viajante." : "Aproxime-se do ponto indicado para realizar este gesto.";
  else if (state.stage === "cuidado" && !state.inventory.careKit) reason = "A bolsa de cuidado precisa estar com você. Busque-a junto ao animal.";
  else if (state.stage === "transporte" && !state.travelerCared) reason = "Volte ao viajante para cuidar das feridas antes de seguir.";
  else if (state.stage === "acolhida" && (!state.travelerAboard || !state.companionPosition)) reason = "O viajante precisa seguir com você no animal.";
  else if (state.stage === "acolhida" && (state.escortDistance < minimumEscortDistance || distanceBetween(state.companionPosition!, point) > escortArrivalRadius)) reason = "Traga o animal e o viajante até a entrada; o cuidado chega com os dois.";
  else if (state.stage === "continuidade" && (!state.travelerDelivered || state.inventory.coins < 2)) reason = "Primeiro acolha o viajante na hospedaria para combinar a continuidade do cuidado.";
  return { id: objective.target, label: objective.action, point, distance, available: !reason, reason };
}

/** Engine owns movement/collisions. This state accepts only finite positions in its world. */
export function missionReducer(state: MissionState, event: MissionEvent): MissionState {
  if (event.type === "restart") return createMissionState();
  if (event.type === "clear-feedback") return state.feedback ? { ...state, feedback: null } : state;
  if (event.type === "position") {
    if (!Number.isFinite(event.position.x) || !Number.isFinite(event.position.z)) return state;
    const position = {
      x: Math.max(worldBounds.minX, Math.min(worldBounds.maxX, event.position.x)),
      z: Math.max(worldBounds.minZ, Math.min(worldBounds.maxZ, event.position.z)),
    };
    const travelled = distanceBetween(state.position, position);
    if (travelled === 0) return state;
    if (!state.travelerAboard || !state.companionPosition) return { ...state, position };
    const distance = distanceBetween(state.companionPosition, position);
    const follow = distance > 1.8 ? (distance - 1.8) / distance : 0;
    const companionPosition = {
      x: state.companionPosition.x + (position.x - state.companionPosition.x) * follow,
      z: state.companionPosition.z + (position.z - state.companionPosition.z) * follow,
    };
    return { ...state, position, companionPosition, escortDistance: state.escortDistance + travelled };
  }
  if (event.type !== "interact") return state;
  const objective = getCurrentObjective(state);
  const interaction = getAvailableInteraction(state);
  if (!objective || !interaction) return state;
  if (event.target && event.target !== interaction.id) return {
    ...state, feedback: { kind: "guidance", text: "Vamos acompanhar um gesto de cada vez. " + objective.instruction },
  };
  if (!interaction.available) return { ...state, feedback: { kind: "guidance", text: interaction.reason } };
  const index = missionStages.indexOf(objective);
  const nextStage: MissionState["stage"] = missionStages.at(index + 1)?.id ?? "concluido";
  const next: MissionState = {
    ...state, stage: nextStage, completed: [...state.completed, objective.id],
    feedback: { kind: nextStage === "concluido" ? "complete" : "progress", text: objective.completedMessage },
  };
  if (state.stage === "preparo") return { ...next, inventory: { ...state.inventory, careKit: true } };
  if (state.stage === "cuidado") return { ...next, inventory: { ...state.inventory, careKit: false }, travelerCared: true };
  if (state.stage === "transporte") return { ...next, travelerAboard: true, companionPosition: { ...worldPoints.donkey }, escortDistance: 0 };
  if (state.stage === "acolhida") return { ...next, travelerAboard: false, travelerDelivered: true, companionPosition: null };
  if (state.stage === "continuidade") return { ...next, inventory: { ...state.inventory, coins: state.inventory.coins - 2 } };
  return next;
}

export function missionBibleLink(reference: MissionReference = missionReference): string {
  return `/biblia?livro=${reference.bookId}&capitulo=${reference.chapter}&versiculo=${reference.start}#versiculo-${reference.start}`;
}
