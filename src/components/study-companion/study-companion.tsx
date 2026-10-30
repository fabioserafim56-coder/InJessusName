import Link from "next/link";
import { BookOpenText, Check, Compass, Footprints, Lightbulb, Path, Sparkle } from "@phosphor-icons/react/ssr";
import "./study-companion.css";

type Purpose = { number: number; why: string; outcome: string; example: string; stage: string; stageTitle: string; returnQuestion: string };

const purposes: Record<string, Purpose> = {
  "primeiros-passos": { number: 1, why: "Abrimos as Escrituras com fé no Deus que cria, salva e realiza milagres. Antes de percorrer a grande história, aprendemos a encontrar cada passagem e receber seu ensino com zelo. Em Atos 17, os bereanos acolhem a Palavra e a examinam com atenção: fé e cuidado com a leitura caminham juntos.", outcome: "Encontrar uma referência, observar a passagem e levar esse cuidado a uma leitura nova.", example: "Se alguém disser “leia Atos 17:11”, você saberá procurar o livro, o capítulo e o versículo — e ler o que acontece ao redor dele.", stage: "criacao-e-comecos", stageTitle: "Começar o panorama da criação", returnQuestion: "Como você encontraria Atos 17:11 e explicaria o cuidado dos bereanos sem olhar as alternativas?" },
  "panorama-biblico": { number: 2, why: "Agora que sabemos encontrar uma passagem, vamos reconhecer a forma como ela nos fala. Um salmo pode tornar-se oração; uma história nos convida a acompanhar acontecimentos; uma carta orienta uma comunidade. Esse cuidado prepara o caminho para o panorama bíblico.", outcome: "Reconhecer história, salmo e carta e ler cada passagem como uma unidade.", example: "“O Senhor é meu pastor” é uma imagem do Salmo 23. Ao acolher essa poesia, você perceberá o cuidado de Deus sem tratar cada figura como uma descrição literal.", stage: "sabedoria-e-oracao", stageTitle: "Conhecer os livros de sabedoria e oração", returnQuestion: "Que diferença você percebe entre ler um salmo e acompanhar uma carta de Paulo?" },
  "criacao-e-cuidado": { number: 3, why: "Com as primeiras ferramentas de leitura, chegamos ao começo de Gênesis. A criação nos aproxima de Deus como Criador e abre perguntas que acompanham toda a história: quem somos, como recebemos a vida e de quem somos chamados a cuidar.", outcome: "Acompanhar a sequência de Gênesis e relacionar a imagem de Deus à dignidade das pessoas.", example: "Ao encontrar alguém que costuma ser ignorado, lembrar a dignidade humana pode orientar um gesto de respeito e acolhimento.", stage: "criacao-e-comecos", stageTitle: "Aprofundar criação, dignidade e cuidado", returnQuestion: "O que Gênesis diz sobre a dignidade humana, e que atitude pode nascer dessa leitura?" },
  "jesus-e-o-proximo": { number: 4, why: "Depois de refletir sobre a dignidade de quem foi criado por Deus, vamos ouvir Jesus ensinar o amor ao próximo. A parábola do samaritano dá forma concreta ao cuidado: aproximar-se, perceber a necessidade e permanecer responsável por alguém.", outcome: "Ler a parábola no diálogo em que Jesus a contou e reconhecer os gestos da compaixão.", example: "Ao ver alguém precisando de ajuda, você pode primeiro perguntar do que a pessoa necessita e oferecer um cuidado possível, com respeito e segurança.", stage: "jesus-e-seu-reino", stageTitle: "Continuar aprendendo aos pés de Jesus", returnQuestion: "Que atitudes do samaritano mostram que a compaixão foi além de uma boa intenção?" },
  "orar-com-sentido": { number: 5, why: "A Palavra que conhecemos e procuramos viver também nos leva a conversar com Deus. Vamos ouvir o próprio Jesus ensinar a oração: com sinceridade, confiança no Pai e atenção ao sentido de cada pedido.", outcome: "Reconhecer os pedidos de Mateus 6 e orar com atenção, sem transformar a oração em exibição.", example: "Ao pedir o pão de cada dia, você pode apresentar suas necessidades ao Pai e lembrar também de quem precisa de alimento e companhia.", stage: "jesus-e-seu-reino", stageTitle: "Situar a oração no ensino de Jesus", returnQuestion: "Escolha um pedido da oração ensinada por Jesus e explique com suas palavras o que ele expressa." },
  "compartilhar-com-respeito": { number: 6, why: "Quem acolhe a Palavra pode desejar partilhar a esperança que recebeu. Este encontro reúne o que praticamos: conhecer o texto, ouvir a pessoa e falar da fé com convicção, mansidão e respeito — como orienta 1 Pedro 3.", outcome: "Preparar uma conversa sobre a esperança cristã que acolha perguntas e respeite quem escuta.", example: "Você pode perguntar se a pessoa deseja conversar, contar por que uma passagem lhe traz esperança e aceitar com respeito se ela preferir não continuar.", stage: "viagens-e-encontros", stageTitle: "Acompanhar os encontros da missão cristã", returnQuestion: "Como você começaria uma conversa sobre a fé sem pressionar a pessoa a concordar?" }
};

export function getStudyPurpose(lessonId: string) { return purposes[lessonId] ?? purposes["primeiros-passos"]; }

export function StudyPurpose({ lessonId }: { lessonId: string }) {
  const purpose = getStudyPurpose(lessonId);
  return <section className="sc-purpose" aria-labelledby={`sc-purpose-${lessonId}`} data-study-purpose>
    <div className="sc-purpose-heading"><span className="sc-purpose-seal" aria-hidden="true"><Compass size={26} /></span><div><p>ENCONTRO {String(purpose.number).padStart(2, "0")} · UM PASSO TEM SEU PORQUÊ</p><h3 id={`sc-purpose-${lessonId}`}>Por que começamos por esta leitura?</h3></div></div>
    <p className="sc-purpose-why">{purpose.why}</p>
    <div className="sc-purpose-outcome"><Check size={22} aria-hidden="true" /><div><strong>Ao terminar, você terá praticado</strong><p>{purpose.outcome}</p></div></div>
    <aside className="sc-example"><Lightbulb size={23} aria-hidden="true" /><div><strong>Imagine este momento na vida</strong><p>{purpose.example}</p></div></aside>
    <div className="sc-purpose-route" aria-label="Como este encontro conduz a aprendizagem"><span><BookOpenText size={18} aria-hidden="true" /> Eu leio</span><span aria-hidden="true">→</span><span><Path size={18} aria-hidden="true" /> Eu pratico</span><span aria-hidden="true">→</span><span><Footprints size={18} aria-hidden="true" /> Eu levo à vida</span></div>
  </section>;
}

const moments = [
  { title: "Receber a Palavra", prompt: "O que esta passagem nos revela?", help: "Primeiro escutamos o texto. Não há pressa para responder." },
  { title: "Compreender em companhia", prompt: "Como chegamos a essa compreensão?", help: "Um exemplo e uma prática acompanhada mostram o caminho antes de você tentar." },
  { title: "Recordar e conferir", prompt: "O que consigo explicar com minhas palavras?", help: "Tentar lembrar e depois conferir a explicação ajuda a perceber o que merece uma nova leitura." },
  { title: "Levar a Palavra à vida", prompt: "Qual cuidado posso praticar hoje?", help: "O próximo passo nasce do ensino e encontra lugar na oração e na convivência." }
];

export function StudyCompass({ phase, completed, total }: { phase: number; completed: number; total: number }) {
  const moment = moments[phase] ?? moments[0];
  return <aside className="sc-compass" aria-label="Orientação deste momento do estudo"><span className="sc-compass-marker" aria-hidden="true"><Compass size={23} /></span><div><p>{moment.title}</p><strong>{moment.prompt}</strong><span>{moment.help}</span></div>{total > 0 && <p className="sc-compass-practice"><strong>{completed}<span>/{total}</span></strong><span>práticas conferidas</span></p>}</aside>;
}

export type StudyEvidenceItem = { id: string; skill: string; status: "independent" | "supported" | "review"; reference?: string };

export function StudyEvidence({ items }: { items: StudyEvidenceItem[] }) {
  return <section className="sc-evidence" aria-labelledby="sc-evidence-title" data-study-evidence><header><p>UM FRUTO CONCRETO DESTE TEMPO DE ESTUDO</p><h3 id="sc-evidence-title">Veja o que você exercitou.</h3><p>Cada registro vem das respostas que você conferiu neste encontro. Uma ajuda recebida também faz parte do caminho.</p></header><ul>{items.map(item => <li key={item.id} data-evidence-status={item.status}><span className="sc-evidence-mark" aria-hidden="true">{item.status === "review" ? <BookOpenText size={21} /> : <Check size={21} />}</span><div><strong>{item.skill}</strong>{item.reference && <span>{item.reference}</span>}<small>{item.status === "independent" ? "Conferida na primeira tentativa, sem dica ou releitura." : item.status === "supported" ? "Conferida com apoio, releitura ou uma nova tentativa." : "Uma boa descoberta para retomar na Palavra."}</small></div></li>)}</ul><p className="sc-evidence-note">Este cartão registra a prática desta visita. A compreensão amadurece quando você retorna ao texto e procura viver o que aprendeu.</p></section>;
}

export function StudyContinuation({ lessonId }: { lessonId: string }) {
  const purpose = getStudyPurpose(lessonId);
  return <section className="sc-continuation" aria-labelledby={`sc-continuation-${lessonId}`}><p className="sc-eyebrow"><Sparkle size={18} aria-hidden="true" /> A CAMINHADA CONTINUA</p><h3 id={`sc-continuation-${lessonId}`}>Leve uma pergunta para o reencontro.</h3><blockquote>{purpose.returnQuestion}</blockquote><p>Quando voltar, tente responder antes de reler. Depois, abra a passagem e confira com carinho o que permaneceu e o que precisa de mais tempo.</p><Link href={`/percurso/${purpose.stage}`}>{purpose.stageTitle}<span aria-hidden="true">↗</span></Link></section>;
}

export function StudyDiscovery({ skill }: { skill: string }) {
  return <p className="sc-discovery"><span aria-hidden="true"><Check size={17} /></span><span><strong>Uma descoberta conferida</strong>{skill}</span></p>;
}
