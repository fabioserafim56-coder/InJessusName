import "server-only";
import { getBibleChapter } from "@/lib/bible";

export const DAILY_VERSE_TIME_ZONE = "America/Sao_Paulo";
const readings = [
  ["GEN", 1, 27, "Criados com dignidade", "Leia Gênesis 1:26–31. A dignidade humana vem antes de qualquer desempenho. Como ela orienta nosso cuidado com as pessoas?"],
  ["EXO", 3, 7, "Deus vê a aflição", "Leia Êxodo 3:1–12. O chamado de Moisés nasce em uma história de sofrimento e libertação; olhe também para quem precisa ser ouvido hoje."],
  ["LEV", 19, 18, "O próximo tem lugar", "Leia Levítico 19:9–18. Amar o próximo aparece ao lado de justiça, colheita partilhada e respeito nas relações."],
  ["NUM", 6, 24, "Uma bênção para o caminho", "Leia Números 6:22–27. Esta é uma bênção sacerdotal dirigida a Israel; receba o convite à oração sem transformá-lo em promessa de vida sem dificuldades."],
  ["DEU", 6, 5, "Um amor que alcança a vida", "Leia Deuteronômio 6:4–9. A aliança é ensinada no cotidiano: conversar, lembrar e praticar também fazem parte de aprender."],
  ["JOS", 1, 9, "Coragem em companhia", "Leia Josué 1:1–9. A palavra é dirigida a Josué em uma missão particular; coragem aqui caminha com responsabilidade e atenção à instrução."],
  ["RUT", 1, 16, "Fidelidade que acompanha", "Leia Rute 1:6–18. Escute as palavras de uma mulher migrante que escolhe permanecer com Noemi em meio à perda."],
  ["1SA", 16, 7, "Além das aparências", "Leia 1 Samuel 16:1–13. A escolha de Davi convida a rever critérios humanos de grandeza; não dispensa discernimento sobre as ações."],
  ["PSA", 23, 1, "Cuidado no caminho", "Leia todo o Salmo 23. O pastor acompanha também o vale escuro; o poema não esconde os dias difíceis."],
  ["PSA", 46, 1, "Refúgio em tempos difíceis", "Leia o Salmo 46. A confiança é cantada em meio à instabilidade, sem exigir que uma pessoa esconda sua dor."],
  ["PSA", 119, 105, "Luz para o próximo passo", "Leia Salmo 119:105–112. A imagem da lâmpada nos convida a caminhar com atenção à Palavra, um passo de cada vez."],
  ["PSA", 139, 23, "Uma oração sincera", "Leia Salmo 139:23–24. Você pode orar com suas próprias palavras e acolher o convite a examinar seus caminhos."],
  ["PRO", 15, 1, "A força da mansidão", "Leia Provérbios 15:1–4. Observe como nossas palavras podem aumentar uma ferida ou abrir espaço para uma conversa respeitosa."],
  ["PRO", 18, 13, "Escutar antes de responder", "Leia Provérbios 18:13–15. Pense em uma conversa em que você pode ouvir com mais atenção antes de concluir."],
  ["ECC", 3, 1, "Há tempo para cada coisa", "Leia Eclesiastes 3:1–15. A poesia reconhece diferentes tempos da experiência humana; não precisa ser usada para apressar o luto de alguém."],
  ["ISA", 1, 17, "Aprender a fazer o bem", "Leia Isaías 1:10–20. O profeta aproxima culto e justiça: a oração nos chama também ao cuidado com quem é vulnerável."],
  ["ISA", 40, 31, "Esperança durante a espera", "Leia Isaías 40:27–31, dirigido a um povo cansado. Esperar em Deus pode caminhar com descanso, ajuda e companhia."],
  ["LAM", 3, 23, "Misericórdia em meio ao lamento", "Leia Lamentações 3:19–26. A esperança aparece dentro de um lamento; a fé dá lugar tanto às lágrimas quanto à confiança."],
  ["MIC", 6, 8, "Justiça, misericórdia e humildade", "Leia Miqueias 6:6–8. A pergunta sobre o culto encontra uma resposta que envolve o modo como tratamos Deus e as pessoas."],
  ["MAT", 5, 9, "Trabalhar pela paz", "Leia Mateus 5:1–12. Nas bem-aventuranças, Jesus apresenta o caráter do Reino e chama seus discípulos a promover a paz."],
  ["MAT", 6, 21, "O que ocupa nosso coração", "Leia Mateus 6:19–24. Jesus nos convida a examinar a direção de nossos desejos e o uso dos nossos recursos."],
  ["MAT", 11, 28, "Um convite ao descanso", "Leia Mateus 11:25–30. O convite de Jesus acolhe quem está cansado; receber cuidado não é sinal de uma fé menor."],
  ["MAT", 22, 39, "Amar quem está perto", "Leia Mateus 22:34–40 e Levítico 19:18. Jesus reúne o amor a Deus e o amor ao próximo como orientação para a vida."],
  ["MRK", 10, 45, "Grandeza que serve", "Leia Marcos 10:35–45. Jesus responde à disputa por posição mostrando o serviço como caminho de seus discípulos."],
  ["LUK", 6, 36, "Misericórdia que se aprende", "Leia Lucas 6:27–36. O chamado à misericórdia nos convida a agir com dignidade, sem confundir perdão com exposição à violência."],
  ["LUK", 10, 37, "Aproximar-se para cuidar", "Leia Lucas 10:25–37. Antes deste convite está a história do samaritano; reconheça seus gestos concretos de compaixão."],
  ["LUK", 15, 20, "Um acolhimento que se aproxima", "Leia Lucas 15:11–32. Observe os dois filhos e o pai; a parábola nos convida a refletir sobre arrependimento, graça e acolhimento."],
  ["JHN", 8, 12, "Seguir a luz", "Leia João 8:12–20. A afirmação de Jesus faz parte de uma conversa maior; conhecer o contexto ajuda a compreender sua identidade."],
  ["JHN", 13, 35, "Um amor reconhecível", "Leia João 13:31–35, depois do gesto de lavar os pés. O amor dos discípulos deve alcançar a vida concreta."],
  ["JHN", 14, 27, "Paz em uma despedida", "Leia João 14:25–31. Jesus consola seus discípulos antes de sua paixão; sua paz é anunciada em meio à incerteza."],
  ["JHN", 15, 5, "Permanecer e dar fruto", "Leia João 15:1–17. A imagem da videira fala de comunhão com Cristo e de uma vida que aprende a amar."],
  ["ACT", 2, 42, "Aprender em comunidade", "Leia Atos 2:42–47. Ensino, comunhão, oração e partilha aparecem juntos no retrato das primeiras comunidades."],
  ["ACT", 17, 11, "Conferir com cuidado", "Leia Atos 17:10–12. Os bereanos recebem a mensagem e examinam as Escrituras: acolhimento e estudo podem caminhar juntos."],
  ["ROM", 12, 12, "Esperança, paciência e oração", "Leia Romanos 12:9–21. Este conselho está em uma sequência de gestos de amor, hospitalidade e cuidado mútuo."],
  ["ROM", 12, 15, "Estar junto na alegria e na dor", "Leia Romanos 12:9–21. Às vezes, cuidar começa por estar presente e escutar, sem tentar resolver depressa o sofrimento alheio."],
  ["ROM", 15, 7, "Receber uns aos outros", "Leia Romanos 15:1–13. Paulo fala a uma comunidade diversa e liga o acolhimento ao exemplo de Cristo."],
  ["1CO", 13, 4, "Amor vivido com paciência", "Leia 1 Coríntios 12:31–13:13. O amor é apresentado no contexto da vida da comunidade e do uso de seus dons."],
  ["2CO", 1, 4, "Consolo que pode ser partilhado", "Leia 2 Coríntios 1:3–7. Quem recebe consolo pode acompanhar outros com sensibilidade, sem comparar dores."],
  ["GAL", 5, 22, "Fruto que amadurece na vida", "Leia Gálatas 5:13–26. O fruto do Espírito é descrito no contraste entre uma vida de amor e relações que se ferem."],
  ["GAL", 6, 2, "Ajudar a carregar", "Leia Gálatas 6:1–5. Cuidar inclui mansidão, responsabilidade e disposição para partilhar os pesos da caminhada."],
  ["EPH", 4, 32, "Bondade nas relações", "Leia Efésios 4:25–32. Veja como verdade, trabalho, palavras e perdão são ligados à construção de uma comunidade."],
  ["PHP", 2, 4, "Olhar também para o outro", "Leia Filipenses 2:1–11. A atenção ao próximo é relacionada à humildade e ao exemplo de Cristo."],
  ["PHP", 4, 6, "Levar as preocupações à oração", "Leia Filipenses 4:4–9. A oração acolhe nossas inquietações; você também pode buscar apoio e cuidado quando precisar."],
  ["COL", 3, 14, "O amor une os gestos", "Leia Colossenses 3:12–17. Amor, paciência, perdão e gratidão são ensinados como práticas da convivência cristã."],
  ["1TH", 5, 11, "Palavras que edificam", "Leia 1 Tessalonicenses 5:9–18. Pense em alguém que possa receber hoje uma palavra sincera de encorajamento."],
  ["1TH", 5, 21, "Examinar com discernimento", "Leia 1 Tessalonicenses 5:19–22. O convite a examinar aparece em orientações para a comunidade e não exige aceitar toda afirmação religiosa sem cuidado."],
  ["2TI", 3, 16, "Aprender com as Escrituras", "Leia 2 Timóteo 3:14–17. Observe a relação entre conhecer as Escrituras, crescer na fé e preparar-se para o bem."],
  ["HEB", 10, 24, "Estimular o amor e o bem", "Leia Hebreus 10:19–25. A comunidade é chamada a encorajar, cultivar esperança e praticar o cuidado."],
  ["HEB", 13, 2, "Hospitalidade que acolhe", "Leia Hebreus 13:1–6. A hospitalidade aparece ao lado da solidariedade com pessoas presas e maltratadas."],
  ["JAS", 1, 19, "Prontos para ouvir", "Leia Tiago 1:19–27. Escutar e praticar são aproximados; ouvir bem é um primeiro gesto de cuidado."],
  ["JAS", 1, 22, "A Palavra encontra a vida", "Leia Tiago 1:19–27. A imagem do espelho convida a transformar o que ouvimos em atitudes concretas."],
  ["1PE", 3, 15, "Esperança com mansidão", "Leia 1 Pedro 3:13–17. Ao compartilhar sua fé, preserve o respeito, a consciência e a liberdade da outra pessoa."],
  ["1PE", 4, 10, "Dons a serviço do cuidado", "Leia 1 Pedro 4:7–11. Os dons aparecem como responsabilidade de serviço, e não como medida do valor de alguém."],
  ["1JN", 4, 19, "Um amor que vem antes", "Leia 1 João 4:7–21. O amor a Deus é relacionado ao amor concreto pelas pessoas que encontramos."],
  ["REV", 21, 4, "Esperança de restauração", "Leia Apocalipse 21:1–8. Esta visão de esperança encerra uma história de sofrimento e perseverança; o texto usa linguagem apocalíptica e símbolos."],
] as const;

export type DailyVerse = { date: string; timeZone: string; title: string; text: string; reference: string; context: string; href: string; edition: string; licenseUrl: string; attribution: string };

export function getDailyVerse(now = new Date()): DailyVerse {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: DAILY_VERSE_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const value = (name: string) => parts.find((part) => part.type === name)!.value;
  const date = `${value("year")}-${value("month")}-${value("day")}`;
  const index = Math.floor(Date.parse(`${date}T00:00:00Z`) / 86_400_000) % readings.length;
  const [book, chapter, verse, title, context] = readings[index];
  const passage = getBibleChapter(book, chapter);
  const text = passage?.verses.find((item) => item.number === verse)?.text;
  if (!passage || !text) throw new Error("Daily reading reference does not exist in the edition.");
  return { date, timeZone: DAILY_VERSE_TIME_ZONE, title, text, reference: `${passage.book.name} ${chapter}:${verse}`, context, href: `/biblia?livro=${book}&capitulo=${chapter}&versiculo=${verse}#versiculo-${verse}`, edition: "Bíblia Livre · TR 2018", licenseUrl: passage.edition.licenseUrl, attribution: "Diego Santos, Mario Sérgio e Marco Teles · CC BY 3.0 BR" };
}
