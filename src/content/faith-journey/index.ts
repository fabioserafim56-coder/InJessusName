export const faithLands = [
  { title: "O Deus que cria e chama", short: "Os começos", theme: "creation", cx: 250, cy: 280, subtitle: "Criação, promessa, libertação e aliança.", scripture: "Gênesis 1 · Êxodo 3", href: "/biblia?livro=GEN&capitulo=1", companion: "O caminho começa no cuidado de Deus, não no quanto você já sabe." },
  { title: "Uma vida diante de Deus", short: "Aliança e cuidado", theme: "covenant", cx: 750, cy: 280, subtitle: "Terra, acolhimento e a responsabilidade de governar.", scripture: "Rute 1 · 1 Samuel 16", href: "/biblia?livro=RUT&capitulo=1", companion: "A fidelidade ganha forma no cuidado cotidiano com quem está perto." },
  { title: "Uma esperança que não se apaga", short: "Oração e profetas", theme: "wisdom", cx: 1250, cy: 280, subtitle: "Oração, sabedoria, justiça e recomeço.", scripture: "Salmo 119 · Miqueias 6", href: "/biblia?livro=PSA&capitulo=119&versiculo=105", companion: "Mesmo em tempos difíceis, a Palavra ensina a orar, esperar e fazer o bem." },
  { title: "Caminhar com Jesus", short: "Os Evangelhos", theme: "jesus", cx: 1250, cy: 710, subtitle: "O Reino, a cruz, a ressurreição e a missão.", scripture: "Lucas 10 · João 20", href: "/biblia?livro=LUK&capitulo=10&versiculo=25", companion: "Jesus nos chama para perto: ouvimos sua Palavra e aprendemos seu amor." },
  { title: "Ninguém precisa aprender sozinho", short: "Vida em comunhão", theme: "community", cx: 750, cy: 710, subtitle: "Espírito Santo, graça, dons e vida em comunidade.", scripture: "Atos 2 · 1 Coríntios 12", href: "/biblia?livro=ACT&capitulo=2&versiculo=42", companion: "Na comunidade, dons diferentes se encontram para servir com amor." },
  { title: "Levar a esperança à vida", short: "Fé que cuida", theme: "hope", cx: 250, cy: 710, subtitle: "Perseverança, ensino, cuidado e nova criação.", scripture: "Tiago 1 · Apocalipse 21", href: "/biblia?livro=REV&capitulo=21&versiculo=4", companion: "O estudo continua quando a Palavra alcança nossas atitudes e nosso cuidado." },
] as const;

export const faithLandStops = ["Criação", "Promessa", "Libertação", "Aliança", "Responsabilidade", "Acolhimento", "Davi", "Os reis", "Oração", "Esperança", "Misericórdia", "Reconstrução", "Jesus", "O Reino", "A cruz", "Ressurreição", "Pentecostes", "Missão", "Graça", "Comunhão", "Perseverança", "Ensino", "Cuidado", "Nova criação"];

export function faithStopPosition(index: number) {
  const land = faithLands[Math.floor(index / 4)] || faithLands[0];
  const offsets = [{ x: -165, y: 10 }, { x: -55, y: -26 }, { x: 55, y: 22 }, { x: 165, y: -12 }];
  const offset = offsets[index % 4];
  return { x: land.cx + offset.x, y: land.cy + offset.y };
}

export const faithJourneySources = [
  { title: "Diferentes vocações, o mesmo Senhor", reference: "1 Coríntios 7:7–8,32–35", href: "/biblia?livro=1CO&capitulo=7&versiculo=7", text: "Paulo reconhece dons e caminhos distintos. Casamento e filhos não são etapas obrigatórias para demonstrar fé ou amor a Deus." },
  { title: "Muitos membros, um só corpo", reference: "1 Coríntios 12:12–27", href: "/biblia?livro=1CO&capitulo=12&versiculo=12", text: "A comunhão cristã inclui pessoas e dons diferentes. O cenário permite representar família e comunidade sem criar uma hierarquia entre elas." },
  { title: "O fruto do Espírito na vida", reference: "Gálatas 5:22–25", href: "/biblia?livro=GAL&capitulo=5&versiculo=22", text: "Amor, paz, mansidão e os demais frutos não podem ser medidos por uma animação. Os detalhes do personagem lembram práticas de estudo, não quantificam a ação de Deus." },
  { title: "Conhecer o batismo com a Bíblia aberta", reference: "Mateus 28:18–20 · Romanos 6:1–4", href: "/biblia?busca=batismo#busca-biblica", text: "O batismo tem lugar na jornada de estudo. Uma escolha no aplicativo não realiza um batismo e não substitui a vida da pessoa em sua comunidade cristã." },
] as const;
