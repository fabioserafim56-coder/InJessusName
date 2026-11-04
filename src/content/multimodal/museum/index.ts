import { museumExhibits } from "@/content/museum";

export type MuseumObservation = Readonly<{
  id: string;
  label: string;
  x: number;
  y: number;
  invitation: string;
  explanation: string;
  question: string;
  answer: string;
  sourceIndexes: readonly number[];
}>;

/** Editorial observations tied to the photographed area, not automated translations. */
export const museumObservations: Readonly<Record<string, readonly MuseumObservation[]>> = {
  "estela-merneptah": [
    { id: "topo", label: "O topo e suas figuras", x: 50, y: 16, invitation: "Comece pelo topo arredondado. Observe como as figuras se organizam antes das linhas de escrita.", explanation: "A composição reúne imagem e inscrição em um monumento real. A ficha situa a peça no reinado de Merneptah e explica que seu relato celebra campanhas pela perspectiva do poder egípcio.", question: "Essa cena conta a história de todos os envolvidos?", answer: "O monumento apresenta a voz do governante que o encomendou. Para compreender o período, aproximamos esse testemunho de outras fontes e da leitura bíblica, sem supor que ele conte toda a experiência das pessoas mencionadas.", sourceIndexes: [0, 1] },
    { id: "escrita", label: "As linhas da inscrição", x: 52, y: 57, invitation: "Percorra as linhas com o olhar. A fotografia permite perceber a extensão da inscrição.", explanation: "A menção a Israel nessa inscrição é uma conexão importante para o estudo de Canaã no final do século XIII a.C. A reprodução de 1917 tem resolução limitada: este ponto indica a área de escrita, sem pretender localizar ou traduzir um sinal individual pela imagem.", question: "A estela identifica o faraó do Êxodo?", answer: "A peça não identifica o faraó do Êxodo nem estabelece a data do acontecimento bíblico. Sua contribuição aqui é um testemunho externo do nome Israel e do contexto antigo. Podemos ler Êxodo com fé e cuidado sem atribuir ao objeto uma informação que ele não oferece.", sourceIndexes: [0, 1] },
    { id: "registro", label: "A fotografia preservada", x: 16, y: 88, invitation: "Repare no contraste e na textura. Você está vendo uma reprodução histórica preservada.", explanation: "Esta fotografia foi publicada na edição de 1917 de Archæology and the Bible, figura 15. A aparência do arquivo conserva os limites dessa reprodução; o aplicativo não redesenhou os hieróglifos.", question: "Por que manter o original, mesmo com seus limites?", answer: "O original permite conferir o que foi efetivamente preservado. Uma ampliação não cria uma nova testemunha histórica. A fonte e os créditos ficam disponíveis para continuar a investigação com transparência.", sourceIndexes: [0, 2] }
  ],
  "estela-mesha": [
    { id: "forma", label: "Uma pedra, muitas histórias", x: 49, y: 14, invitation: "Olhe o contorno arredondado e acompanhe a forma da peça.", explanation: "A estela é associada a Mesa, rei de Moabe, e foi encontrada em Dibom. Sua inscrição apresenta a perspectiva do rei sobre conflitos, construções e sua relação com Quemós.", question: "Quem é Mesa na leitura bíblica?", answer: "Mesa aparece em 2 Reis 3. A passagem introduz sua relação com Israel; a inscrição oferece uma voz diferente para comparação. Leia os dois documentos observando quem narra e com que propósito.", sourceIndexes: [0, 1] },
    { id: "fragmentos", label: "Superfícies e recomposição", x: 62, y: 43, invitation: "Observe as diferenças de textura e as linhas que atravessam a superfície.", explanation: "A peça foi quebrada depois da descoberta. Fragmentos e um registro anterior da inscrição ajudaram na recomposição. A ficha informa que a fotografia de 1917 mostra uma apresentação restaurada; este ponto não classifica sozinho cada fragmento.", question: "Tudo o que vemos é pedra original?", answer: "A apresentação restaurada inclui recomposição. É por isso que a documentação do objeto importa tanto quanto a fotografia: ela ajuda a distinguir o material preservado do trabalho posterior de apresentação.", sourceIndexes: [0, 1] },
    { id: "texto", label: "Uma voz para comparar", x: 49, y: 63, invitation: "Acompanhe a escrita sem apressar uma tradução. Vamos primeiro situar a fonte.", explanation: "O texto moabita menciona Israel e a casa de Onri. Algumas leituras de trechos danificados continuam discutidas. A visita se apoia na ficha e nas fontes, sem produzir uma transcrição automática da pedra.", question: "As duas narrativas precisam coincidir em cada detalhe?", answer: "Inscrição e narrativa bíblica têm propósitos e ênfases próprios. A comparação pode enriquecer o estudo sem igualar automaticamente episódios e cronologias apenas porque os documentos mencionam o mesmo rei.", sourceIndexes: [0, 1] }
  ],
  "obelisco-negro": [
    { id: "topo", label: "O topo em degraus", x: 50, y: 19, invitation: "Comece pelos degraus do topo e pelas faixas de escrita.", explanation: "O monumento pertence ao reinado de Salmaneser III, da Assíria. Inscrições e relevos trabalham juntos para apresentar a autoridade do governante.", question: "A fotografia mostra o obelisco inteiro?", answer: "Este registro publicado em 1917 mostra a parte superior. Ele não oferece todas as faces nem todos os registros da peça. A ficha do British Museum ajuda a ampliar a investigação.", sourceIndexes: [0, 3] },
    { id: "relevo", label: "As figuras em relevo", x: 52, y: 56, invitation: "Observe os gestos, as roupas e a disposição das figuras nesta faixa.", explanation: "O obelisco apresenta povos entregando tributos ao rei assírio. Uma legenda menciona o tributo de Jeú, de Israel. Identificar um indivíduo numa cena requer examinar sua posição e a inscrição correspondente, além desta fotografia.", question: "Podemos reconhecer com certeza o rosto de Jeú?", answer: "O relevo não é um retrato verificável. A identificação de uma figura como Jeú ou seu representante exige cuidado. A importância histórica da menção não depende de transformar a imagem num retrato pessoal certificado.", sourceIndexes: [0, 1, 3] },
    { id: "poder", label: "Poder e vida cotidiana", x: 52, y: 82, invitation: "Repare nas relações entre as figuras. Pense nas pessoas que viviam sob a força dos reinos.", explanation: "O monumento celebra o rei assírio e relações desiguais de poder. A conexão bíblica proposta é 2 Reis 9:1–6, o início do relato da realeza de Jeú; a inscrição não narra aquela unção.", question: "O que essa comparação pode nos ensinar?", answer: "Podemos conhecer melhor o contexto de reis e impérios e, com a Bíblia aberta, perguntar como o caminho de Jesus nos chama ao serviço e ao cuidado. O artefato situa o estudo; não mede a fidelidade de uma pessoa a Deus.", sourceIndexes: [0, 1, 3] }
  ],
  "pedra-roseta": [
    { id: "primeira-faixa", label: "A faixa superior", x: 57, y: 28, invitation: "Comece pela área superior preservada. Compare a aparência da escrita com as faixas abaixo.", explanation: "A Pedra de Roseta preserva parte de um decreto do tempo de Ptolomeu V. A ficha identifica hieróglifos egípcios, escrita demótica e grego: três sistemas de escrita, com o egípcio apresentado de duas maneiras.", question: "São três idiomas diferentes?", answer: "A descrição mais precisa é três sistemas de escrita. Há duas formas de registrar o egípcio e uma seção em grego. Essa distinção ajuda a compreender como a comparação se tornou tão importante para a pesquisa.", sourceIndexes: [0, 3] },
    { id: "comparar", label: "Comparar para compreender", x: 45, y: 56, invitation: "Desça o olhar para a faixa central e depois para a inferior. Observe diferenças e continuidades.", explanation: "A comparação entre essas inscrições teve papel importante no desenvolvimento da leitura dos hieróglifos. Foi um caminho de pesquisa reunindo o trabalho de diferentes estudiosos.", question: "Por que há espaço para essa peça em um museu bíblico?", answer: "Ela ajuda a compreender como pesquisadores leem documentos do mundo egípcio, relevante para o contexto de várias passagens. A conexão com Atos 7 é temática; o discurso bíblico não menciona esta pedra.", sourceIndexes: [0, 3] },
    { id: "fragmento", label: "Os limites do fragmento", x: 69, y: 83, invitation: "Observe as bordas irregulares. O que chegou até nós é uma parte de um documento maior.", explanation: "A peça pertence ao Egito helenístico, muitos séculos depois do período em que se situa a narrativa do Êxodo. Seu valor nesta visita é ensinar sobre leitura de fontes, escrita e contexto.", question: "A Pedra de Roseta prova o Êxodo?", answer: "A pedra não é uma inscrição sobre o Êxodo nem um objeto mencionado pela Bíblia. Podemos admirar sua contribuição para a pesquisa e aproximar-nos das Escrituras sem atribuir a ela um testemunho que não oferece.", sourceIndexes: [0, 3] }
  ]
};

export function getMuseumObservations(exhibitId: string) {
  return museumObservations[exhibitId] ?? [];
}

export function museumContext(exhibitId: string) {
  const exhibit = museumExhibits.find(item => item.id === exhibitId);
  if (!exhibit) return null;
  return {
    id: exhibit.id, title: exhibit.title, period: exhibit.period, place: exhibit.place,
    collection: exhibit.collection, introduction: exhibit.introduction, story: exhibit.story,
    whatItShows: exhibit.whatItShows, limits: exhibit.limits,
    bibleConnections: exhibit.bibleConnections, sources: exhibit.sources,
    image: { src: exhibit.image.src, alt: exhibit.image.alt, credit: exhibit.image.credit, sourceUrl: exhibit.image.sourceUrl }
  };
}
