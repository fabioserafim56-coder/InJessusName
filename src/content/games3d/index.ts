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

export const worldBounds = { minX: -42, maxX: 42, minZ: -85, maxZ: 85 } as const;
export const worldPoints = {
  spawn: { x: 0, z: 65 },
  traveler: { x: -3, z: 26 },
  supplies: { x: 4, z: 30 },
  donkey: { x: 2, z: 28 },
  bridge: { x: 0, z: -5 },
  innEntrance: { x: 5, z: -51 },
  inn: { x: 8, z: -61 },
  bed: { x: 8, z: -61 },
  keeper: { x: 2, z: -57 },
} as const satisfies Record<string, WorldPosition>;
export const innFootprint = { minX: -2, maxX: 14, minZ: -69, maxZ: -53 } as const;
export const worldNavigationWaypoints = {
  bridgeApproach: { x: 0, z: 2 },
  // Leave room for the animal following behind to clear the physical bridge.
  bridgeExit: { x: 0, z: -16 },
  innEntrance: worldPoints.innEntrance,
  innInterior: { x: 5, z: -57 },
  // Stand beside the solid bed; its center is not a walking destination.
  innBedside: { x: 5.9, z: -61 },
} as const satisfies Record<string, WorldPosition>;
export const bridgeCheckpointRadius = 4.5;
export const bridgeCrossingBounds = { halfWidth: 3.5, startZ: 2, endZ: -12 } as const;
export const interactionRadius = 2.6;
export const escortArrivalRadius = 3.6;
export const minimumEscortDistance = 64;

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
    instruction: "Volte ao viajante e participe dos três gestos de cuidado: preparar os panos, representar o uso do azeite e do vinho e envolver as feridas. Cada recurso da bolsa tem um destino.",
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
    instruction: "Atravesse a ponte junto do animal com o viajante. Depois, entre na hospedaria e acompanhe-o até o lugar de descanso. O cuidado chega com os dois.",
    target: "inn", action: "Acolher o viajante na hospedaria", reference: passage(34),
    lesson: "O samaritano leva o homem à hospedaria e cuida dele. Chegar é uma parte do gesto; a parábola ainda vai mostrar como o cuidado continua.",
    completedMessage: "O viajante foi acolhido no lugar de descanso da hospedaria. A narrativa avança agora para o dia seguinte, como Lucas 10:35 indica. Procure o hospedeiro para combinar a continuidade.",
  },
  {
    id: "continuidade", number: 6, title: "O amor também providencia o amanhã",
    instruction: "No dia seguinte, aproxime-se do hospedeiro e entregue os dois dinheiros para a continuidade do cuidado, acompanhando Lucas 10:35.",
    target: "keeper", action: "Providenciar a continuidade do cuidado", reference: passage(35, 37),
    lesson: "O samaritano não encerra o cuidado ao deixar o homem na hospedaria. Ele providencia recursos e se compromete com o que ainda for necessário. Jesus encerra a parábola chamando à misericórdia.",
    completedMessage: "Você acompanhou os gestos desta leitura: aproximar-se, cuidar, levar e providenciar a continuidade. Abra Lucas 10:36–37 e permaneça com a pergunta de Jesus: quem agiu como próximo?",
  },
];

export type CareStepId = "panos" | "azeite-vinho" | "faixas";
export type CareResource = "cloth" | "oilWine" | "bandage";
export type CareStep = Readonly<{ id: CareStepId; title: string; instruction: string; action: string; resource: CareResource; kind: "cloth" | "oil-wine" | "bandage"; reference: MissionReference; completedMessage: string }>;
export const careSteps: readonly CareStep[] = [
  { id: "panos", title: "Preparar o cuidado", instruction: "Sustente o gesto para preparar os panos junto ao viajante. Esta preparação é uma representação visual do cuidado da parábola.", action: "Preparar os panos", resource: "cloth", kind: "cloth", reference: passage(34), completedMessage: "Os panos foram preparados. O cuidado pede presença e atenção; vamos acompanhar os recursos que Lucas menciona." },
  { id: "azeite-vinho", title: "Oferecer os recursos da bolsa", instruction: "Sustente o gesto para representar o azeite e o vinho mencionados em Lucas 10:34. A cena acompanha o relato; não é uma técnica de atendimento.", action: "Representar o azeite e o vinho", resource: "oilWine", kind: "oil-wine", reference: passage(34), completedMessage: "Você representou o uso dos recursos mencionados no relato. Agora acompanhe o gesto de envolver as feridas." },
  { id: "faixas", title: "Envolver as feridas com cuidado", instruction: "Sustente o gesto para representar as ataduras. A sequência visual foi organizada para o jogo; a passagem bíblica permanece aberta para conferir o que Jesus conta.", action: "Representar as ataduras", resource: "bandage", kind: "bandage", reference: passage(34), completedMessage: "Os três gestos desta representação foram acompanhados. O cuidado continuará durante o caminho e na hospedaria." },
];

export type ExplorationLandmarkId = "mirante" | "encontro" | "hospedaria";
export type ExplorationLandmark = Readonly<{ id: ExplorationLandmarkId; title: string; subtitle: string; point: WorldPosition; radius: number; summary: string; explanation: string; reference: MissionReference }>;
export const explorationLandmarks: readonly ExplorationLandmark[] = [
  { id: "mirante", title: "O caminho que Jesus conta", subtitle: "Um lugar para observar a estrada", point: { x: -10, z: 49 }, radius: 3.6, summary: "Lucas 10:30 apresenta um homem que desce de Jerusalém a Jericó.", explanation: "Antes de acompanhar o samaritano, Jesus situa a história de um homem nessa estrada. A paisagem condensada e este mirante são escolhas artísticas do jogo. Abra a passagem para perceber como Jesus começa a responder à pergunta sobre o próximo.", reference: passage(29, 30) },
  { id: "encontro", title: "Ver, aproximar-se e cuidar", subtitle: "Os gestos das personagens", point: { x: 10, z: 18 }, radius: 3.6, summary: "A parábola contrasta quem passa ao longe com o samaritano que se aproxima.", explanation: "Leia Lucas 10:31–33: Jesus apresenta as personagens por seus gestos no relato. Em seguida, descreve o cuidado concreto do samaritano. A pergunta final nos leva a reconhecer e praticar misericórdia.", reference: passage(31, 34) },
  { id: "hospedaria", title: "O cuidado também permanece", subtitle: "Perto da casa de acolhimento", point: { x: -8, z: -46 }, radius: 3.6, summary: "Chegar à hospedaria não encerra o cuidado: a parábola continua no dia seguinte.", explanation: "O pátio e seu ponto de observação são recursos do cenário. Lucas 10:34–35 conta que o samaritano leva o homem à hospedaria, cuida dele e providencia recursos para a continuidade. Repare como o cuidado alcança o amanhã.", reference: passage(34, 35) },
];
export function getNearbyLandmark(state: MissionState): ExplorationLandmark | null {
  return explorationLandmarks.find(landmark => distanceBetween(state.position, landmark.point) <= landmark.radius) ?? null;
}
export function getWorldArea(position: WorldPosition): string {
  if (position.x >= innFootprint.minX && position.x <= innFootprint.maxX && position.z >= innFootprint.minZ && position.z <= innFootprint.maxZ) return "Casa de acolhimento";
  if (position.z > 40) return "Caminho de Jerusalém";
  if (position.z > 10) return "Estrada do encontro";
  if (position.z > -20) return "Vale da travessia";
  return "Caminho da hospedaria";
}

export const missionIntroduction = {
  title: "Pelo caminho da misericórdia",
  subtitle: "Uma jornada jogável inspirada no bom samaritano",
  setting: "Na estrada de Jerusalém a Jericó",
  invitation: "Entre na paisagem, caminhe com atenção e descubra como a compaixão se aproxima de quem precisa. A Palavra acompanha cada gesto.",
  literaryContext: "Jesus conta esta parábola ao responder à pergunta sobre quem é o próximo, em Lucas 10:25–37. O cenário é uma interpretação artística; não é a localização arqueológica de um acontecimento nem uma reconstrução histórica autenticada.",
  adaptation: "A estrada condensada, a ponte, a bolsa, a sequência dos gestos, os pontos de observação, o interior da hospedaria, os movimentos e a aparência das pessoas e do jumento são recursos do jogo. O texto bíblico distingue o que Jesus conta; os comentários ajudam a acompanhar a leitura.",
  progression: "Os marcos registram somente ações concluídas nesta visita. Não medem fé, santidade ou valor pessoal e desaparecem ao reiniciar ou recarregar.",
} as const;

export type MissionFeedback = Readonly<{ kind: "guidance" | "progress" | "complete"; text: string }>;
export type MissionState = Readonly<{
  position: WorldPosition;
  stage: MissionStage | "concluido";
  completed: readonly MissionStage[];
  inventory: Readonly<{ careKit: boolean; coins: number; cloth: boolean; oilWine: boolean; bandage: boolean }>;
  careCompleted: readonly CareStepId[];
  bridgeEntered: boolean;
  escortCheckpoints: readonly "ponte"[];
  discoveries: readonly ExplorationLandmarkId[];
  travelerCared: boolean;
  travelerAboard: boolean;
  travelerDelivered: boolean;
  companionPosition: WorldPosition | null;
  escortDistance: number;
  feedback: MissionFeedback | null;
}>;
export type MissionEvent =
  | { type: "position"; position: WorldPosition }
  | { type: "companion-position"; position: WorldPosition }
  | { type: "care"; step: CareStepId }
  | { type: "inspect"; landmark: ExplorationLandmarkId }
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
    inventory: { careKit: false, coins: 2, cloth: false, oilWine: false, bandage: false }, careCompleted: [], bridgeEntered: false, escortCheckpoints: [], discoveries: [], travelerCared: false,
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
export function getCurrentCareStep(state: MissionState): CareStep | null {
  return state.stage === "cuidado" ? careSteps.at(state.careCompleted.length) ?? null : null;
}
export function getAvailableInteraction(state: MissionState): MissionInteraction | null {
  const objective = getCurrentObjective(state);
  if (!objective) return null;
  const crossing = state.stage === "acolhida" && !state.escortCheckpoints.includes("ponte");
  const point: WorldPosition = crossing ? worldNavigationWaypoints.bridgeExit : worldPoints[objective.target];
  const distance = distanceBetween(state.position, point);
  let reason = "";
  if (distance > interactionRadius) reason = crossing ? "Acompanhe o viajante pela estrada e atravesse a ponte com ele." : objective.target === "inn" ? "Entre na hospedaria pelo caminho marcado e acompanhe o viajante até seu lugar de descanso." : "Aproxime-se do ponto indicado para realizar este gesto.";
  else if (state.stage === "cuidado" && !state.inventory.careKit) reason = "A bolsa de cuidado precisa estar com você. Busque-a junto ao animal.";
  else if (state.stage === "cuidado" && !state.inventory[getCurrentCareStep(state)?.resource ?? "cloth"]) reason = "O próximo gesto precisa de seu recurso na bolsa. Recomece a jornada para preparar o cuidado novamente.";
  else if (state.stage === "transporte" && !state.travelerCared) reason = "Volte ao viajante para concluir os três gestos de cuidado antes de seguir.";
  else if (state.stage === "acolhida" && (!state.travelerAboard || !state.companionPosition)) reason = "O viajante precisa seguir com você no animal.";
  else if (crossing) reason = "Atravesse a ponte acompanhado: você e o viajante precisam chegar juntos ao outro lado.";
  else if (state.stage === "acolhida" && (state.escortDistance < minimumEscortDistance || distanceBetween(state.companionPosition!, point) > escortArrivalRadius)) reason = "Traga o animal e o viajante até o lugar de descanso dentro da hospedaria.";
  else if (state.stage === "continuidade" && (!state.travelerDelivered || state.inventory.coins < 2)) reason = "Primeiro acolha o viajante na hospedaria para combinar a continuidade do cuidado.";
  return { id: objective.target, label: crossing ? "Atravessar com o viajante" : objective.action, point, distance, available: !reason, reason };
}

function boundedPosition(position: WorldPosition): WorldPosition | null {
  if (!Number.isFinite(position.x) || !Number.isFinite(position.z)) return null;
  return { x: Math.max(worldBounds.minX, Math.min(worldBounds.maxX, position.x)), z: Math.max(worldBounds.minZ, Math.min(worldBounds.maxZ, position.z)) };
}
function escortCheck(state: MissionState): MissionState {
  if (state.stage !== "acolhida" || !state.travelerAboard || !state.companionPosition) return state;
  const togetherAt = (point: WorldPosition) => distanceBetween(state.position, point) <= bridgeCheckpointRadius && distanceBetween(state.companionPosition!, point) <= bridgeCheckpointRadius;
  const inCorridor = (point: WorldPosition) => Math.abs(point.x - worldPoints.bridge.x) <= bridgeCrossingBounds.halfWidth;
  const bothInCorridor = inCorridor(state.position) && inCorridor(state.companionPosition);
  const entered = state.bridgeEntered || bothInCorridor && togetherAt(worldNavigationWaypoints.bridgeApproach);
  const bothBeyondEnd = state.position.z <= bridgeCrossingBounds.endZ && state.companionPosition.z <= bridgeCrossingBounds.endZ;
  if (entered && bothInCorridor && bothBeyondEnd && !state.escortCheckpoints.includes("ponte")) return {
    ...state, bridgeEntered: true, escortCheckpoints: ["ponte"],
    feedback: { kind: "progress", text: "Vocês atravessaram juntos. A ponte é parte desta representação do caminho; em Lucas 10:34, o cuidado acompanha o viajante até a hospedaria. Sigamos para acolhê-lo." },
  };
  return entered !== state.bridgeEntered ? { ...state, bridgeEntered: entered } : state;
}
function finishObjective(state: MissionState, objective: MissionObjective): MissionState {
  const nextStage: MissionState["stage"] = missionStages.at(missionStages.indexOf(objective) + 1)?.id ?? "concluido";
  return { ...state, stage: nextStage, completed: [...state.completed, objective.id], feedback: { kind: nextStage === "concluido" ? "complete" : "progress", text: objective.completedMessage } };
}

/** Engine owns player/companion physics. Accepted positions only update the editorial mission. */
export function missionReducer(state: MissionState, event: MissionEvent): MissionState {
  if (event.type === "restart") return createMissionState();
  if (event.type === "clear-feedback") return state.feedback ? { ...state, feedback: null } : state;
  if (event.type === "position") {
    const position = boundedPosition(event.position);
    if (!position || distanceBetween(state.position, position) === 0) return state;
    const travelled = distanceBetween(state.position, position);
    return escortCheck({ ...state, position, escortDistance: state.escortDistance + (state.travelerAboard ? travelled : 0) });
  }
  if (event.type === "companion-position") {
    const position = boundedPosition(event.position);
    if (!state.travelerAboard || !position) return state;
    if (state.companionPosition && distanceBetween(state.companionPosition, position) === 0) return state;
    return escortCheck({ ...state, companionPosition: position });
  }
  if (event.type === "inspect") {
    const landmark = explorationLandmarks.find(item => item.id === event.landmark);
    if (!landmark || state.discoveries.includes(landmark.id) || distanceBetween(state.position, landmark.point) > landmark.radius) return state;
    return { ...state, discoveries: [...state.discoveries, landmark.id], feedback: { kind: "progress", text: `${landmark.title}. ${landmark.summary}` } };
  }
  if (event.type === "care") {
    if (state.stage !== "cuidado") return state;
    const step = getCurrentCareStep(state);
    const interaction = getAvailableInteraction(state);
    if (!step || event.step !== step.id) return { ...state, feedback: { kind: "guidance", text: step ? `Vamos acompanhar um gesto de cada vez: ${step.title.toLowerCase()}.` : "O cuidado desta etapa já foi concluído." } };
    if (!interaction?.available) return { ...state, feedback: { kind: "guidance", text: interaction?.reason ?? "Volte ao viajante para acompanhar este gesto." } };
    const next = { ...state, careCompleted: [...state.careCompleted, step.id], inventory: { ...state.inventory, [step.resource]: false }, feedback: { kind: "progress" as const, text: step.completedMessage } };
    if (next.careCompleted.length < careSteps.length) return next;
    return { ...finishObjective(next, getCurrentObjective(state)!), inventory: { ...next.inventory, careKit: false }, travelerCared: true };
  }
  if (event.type !== "interact") return state;
  const objective = getCurrentObjective(state), interaction = getAvailableInteraction(state);
  if (!objective || !interaction) return state;
  if (event.target && event.target !== interaction.id) return { ...state, feedback: { kind: "guidance", text: "Vamos acompanhar um gesto de cada vez. " + objective.instruction } };
  if (!interaction.available) return { ...state, feedback: { kind: "guidance", text: interaction.reason } };
  // Opening the care station never substitutes for completing its three gestures.
  if (state.stage === "cuidado") return { ...state, feedback: { kind: "guidance", text: "Aproxime suas mãos do cuidado: represente cada um dos três gestos com os recursos da bolsa." } };
  const next = finishObjective(state, objective);
  if (state.stage === "preparo") return { ...next, inventory: { ...state.inventory, careKit: true, cloth: true, oilWine: true, bandage: true } };
  if (state.stage === "transporte") return { ...next, travelerAboard: true, companionPosition: { ...worldPoints.donkey }, escortDistance: 0, bridgeEntered: false, escortCheckpoints: [] };
  if (state.stage === "acolhida") return { ...next, travelerAboard: false, travelerDelivered: true, companionPosition: null };
  if (state.stage === "continuidade") return { ...next, inventory: { ...state.inventory, coins: state.inventory.coins - 2 } };
  return next;
}

export function missionBibleLink(reference: MissionReference = missionReference): string {
  return `/biblia?livro=${reference.bookId}&capitulo=${reference.chapter}&versiculo=${reference.start}#versiculo-${reference.start}`;
}
