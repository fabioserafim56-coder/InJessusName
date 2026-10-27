export type ScriptureReference = {
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  label: string;
};

export type TeachingCard = {
  id: string;
  title: string;
  body: string[];
  task: string;
  sourceRefs: ScriptureReference[];
};

type ActivityBase = {
  id: string;
  prompt: string;
  hint: string;
  skill: string;
  sourceRefs: ScriptureReference[];
};

export type ChoiceActivity = ActivityBase & {
  kind: "choice";
  options: { id: string; text: string; feedback: string }[];
  correctOptionId: string;
};

export type ClassifyActivity = ActivityBase & {
  kind: "classify";
  categories: { id: string; label: string }[];
  items: { id: string; text: string; categoryId: string; feedback: string; correction: string }[];
};

export type OrderActivity = ActivityBase & {
  kind: "order";
  items: { id: string; text: string }[];
  correctOrder: string[];
  correctFeedback: string;
  incorrectFeedback: string;
};

export type CourseActivity = ChoiceActivity | ClassifyActivity | OrderActivity;

export type CourseLesson = {
  id: string;
  title: string;
  subtitle: string;
  theme: string;
  estimatedMinutes: number;
  objectives: string[];
  passages: ScriptureReference[];
  cards: TeachingCard[];
  workedExample: { title: string; prompt: string; steps: string[]; answer: string; sourceRefs: ScriptureReference[] };
  guidedPractice: { prompt: string; hints: string[]; modelResponse: string; sourceRefs: ScriptureReference[] };
  activities: CourseActivity[];
  reflection: { scripture: string; observation: string; application: string; prayer: string };
  recap: string[];
  reviewPrompt: string;
  editorialStatus: "educational-pilot";
  pastoralInvitation?: string;
  closingPrayer?: string;
};

export const courseEditorialNote = "Esta caminhada foi preparada com cuidado e ainda aguarda revisão humana especializada e acompanhamento com estudantes. É uma proposta educacional independente, sem aprovação institucional ou habilitação ministerial.";

export const courseSourceNote = "As passagens indicadas são as fontes primárias dos comentários. O texto bíblico é fornecido pela edição identificada no leitor, com seus próprios créditos e licença; não foi copiado neste conteúdo.";

export const additionalLessons: CourseLesson[] = [
  {
    "id": "panorama-biblico",
    "title": "A Palavra nos encontra de muitos modos",
    "subtitle": "Entre histórias, salmos e cartas, aprenda a escutar com atenção o que a Escritura nos ensina.",
    "theme": "Bíblia",
    "estimatedMinutes": 15,
    "editorialStatus": "educational-pilot",
    "objectives": [
      "Perceber como uma história, um salmo e uma carta nos convidam a escutar.",
      "Ler com cuidado para acolher o sentido da passagem inteira.",
      "Levar uma descoberta da Palavra à oração e à convivência."
    ],
    "passages": [
      {
        "book": "PSA",
        "chapter": 23,
        "startVerse": 1,
        "endVerse": 6,
        "label": "Salmo 23:1–6"
      },
      {
        "book": "GEN",
        "chapter": 1,
        "startVerse": 1,
        "endVerse": 5,
        "label": "Gênesis 1:1–5"
      },
      {
        "book": "LUK",
        "chapter": 10,
        "startVerse": 25,
        "endVerse": 37,
        "label": "Lucas 10:25–37"
      },
      {
        "book": "ROM",
        "chapter": 12,
        "startVerse": 9,
        "endVerse": 18,
        "label": "Romanos 12:9–18"
      }
    ],
    "cards": [
      {
        "id": "panorama-library",
        "title": "Há muitas portas para entrar na Palavra",
        "body": [
          "Talvez você abra a Bíblia e encontre uma história; em outra página, uma oração; mais adiante, uma carta. Essa riqueza merece ser recebida com atenção. Gênesis 1 nos conduz por ações do Criador, o Salmo 23 canta confiança no cuidado de Deus e Romanos 12 aproxima a fé da vida em comunidade.",
          "Antes de procurar uma resposta rápida, vale perguntar: como esta passagem está falando conosco? Reconhecer sua forma ajuda a escutar com mais cuidado e dá espaço para que cada trecho seja compreendido dentro do que está dizendo."
        ],
        "task": "Leia o Salmo 23 devagar. Qual imagem do cuidado de Deus você gostaria de guardar no coração hoje?",
        "sourceRefs": [
          {
            "book": "GEN",
            "chapter": 1,
            "startVerse": 1,
            "endVerse": 5,
            "label": "Gênesis 1:1–5"
          },
          {
            "book": "PSA",
            "chapter": 23,
            "startVerse": 1,
            "endVerse": 6,
            "label": "Salmo 23:1–6"
          },
          {
            "book": "ROM",
            "chapter": 12,
            "startVerse": 9,
            "endVerse": 18,
            "label": "Romanos 12:9–18"
          }
        ]
      },
      {
        "id": "panorama-narrative",
        "title": "Sente-se por um momento para ouvir Jesus",
        "body": [
          "Em Lucas 10, alguém se aproxima de Jesus com perguntas sobre a vida e o amor. Jesus responde contando uma história. Acompanhe a conversa, os encontros no caminho e a pergunta que ele faz ao final. Cada parte ajuda a compreender seu ensinamento.",
          "Podemos aprender a ouvir assim: sem correr para uma frase conhecida e sem preencher a história com o que imaginamos. Quando damos atenção ao caminho inteiro, percebemos melhor o convite que Jesus dirige àquele que o escuta."
        ],
        "task": "Leia a pergunta de Lucas 10:29 e depois a de 10:36. Que mudança você percebe na maneira de olhar para o próximo?",
        "sourceRefs": [
          {
            "book": "LUK",
            "chapter": 10,
            "startVerse": 25,
            "endVerse": 29,
            "label": "Lucas 10:25–29"
          },
          {
            "book": "LUK",
            "chapter": 10,
            "startVerse": 36,
            "endVerse": 37,
            "label": "Lucas 10:36–37"
          }
        ]
      },
      {
        "id": "panorama-poetry",
        "title": "Um salmo também pode acolher o que sentimos",
        "body": [
          "Pastor, caminho, vale e mesa: o Salmo 23 usa imagens próximas da vida para falar de cuidado, confiança e presença. Deixe que o poema seja ouvido por inteiro. Há lugar nele tanto para descanso quanto para a travessia de um lugar difícil.",
          "O vale do versículo 4 faz parte dessa oração de confiança. Se a leitura toca um medo ou uma preocupação, você pode levá-los ao Senhor com sinceridade. Não precisa expor sua história aqui; podemos simplesmente permanecer um pouco nessa passagem e aprender com ela."
        ],
        "task": "Encontre uma imagem de cuidado e uma menção à dificuldade. Como elas aparecem juntas na oração do salmista?",
        "sourceRefs": [
          {
            "book": "PSA",
            "chapter": 23,
            "startVerse": 1,
            "endVerse": 6,
            "label": "Salmo 23:1–6"
          }
        ]
      },
      {
        "id": "panorama-letter",
        "title": "A fé alcança a nossa maneira de estar com as pessoas",
        "body": [
          "Em Romanos 12:9–18, o amor ganha expressões muito próximas: acolher, repartir, alegrar-se com quem se alegra e aproximar-se de quem sofre. Leia as orientações como parte de uma mesma conversa sobre a vida cristã.",
          "Às vezes, o primeiro gesto de cuidado é ouvir sem pressa. Uma anotação simples pode ajudá-lo a guardar o que leu: a passagem, algo que percebeu e uma pessoa ou situação pela qual deseja orar. Guarde nomes e histórias pessoais no seu próprio caderno."
        ],
        "task": "Releia Romanos 12:15. Como essa orientação pode ajudar você a acolher tanto a alegria quanto a dor de alguém?",
        "sourceRefs": [
          {
            "book": "ROM",
            "chapter": 12,
            "startVerse": 9,
            "endVerse": 18,
            "label": "Romanos 12:9–18"
          }
        ]
      }
    ],
    "workedExample": {
      "sourceRefs": [
        {
          "book": "PSA",
          "chapter": 23,
          "startVerse": 1,
          "endVerse": 6,
          "label": "Salmo 23:1–6"
        }
      ],
      "title": "Vamos caminhar juntos pelo Salmo 23",
      "prompt": "Alguém lê o Salmo 23 e entende que confiar em Deus significa nunca atravessar perigo. Vamos ouvir o salmo inteiro antes de responder?",
      "steps": [
        "Abra o Salmo 23 e leia os seis versículos sem pressa.",
        "Perceba o cuidado expresso na imagem do pastor e nos caminhos descritos.",
        "Detenha-se também no vale do versículo 4. Ele faz parte da oração.",
        "Procure palavras que expressem a confiança do salmista, mesmo diante da dificuldade."
      ],
      "answer": "O salmo nos dá palavras para confiar no cuidado de Deus em meio à vida que descreve. O vale não desaparece da oração; a presença e o amparo de Deus são confessados nessa travessia. Ler o conjunto nos ajuda a acolher essa esperança sem prometer a alguém uma vida em que nunca haverá dificuldade."
    },
    "guidedPractice": {
      "sourceRefs": [
        {
          "book": "ROM",
          "chapter": 12,
          "startVerse": 15,
          "endVerse": 15,
          "label": "Romanos 12:15"
        }
      ],
      "prompt": "Agora leia Romanos 12:15. Que lugar o amor abre para a alegria e para a tristeza de outra pessoa?",
      "hints": [
        "Procure as duas situações nomeadas no versículo.",
        "Observe como a orientação nos aproxima de outras pessoas.",
        "Pense em um gesto possível hoje e mantenha-o ligado ao que acabou de ler."
      ],
      "modelResponse": "A orientação nos convida a participar da alegria e do sofrimento de outras pessoas. Uma visita, uma escuta atenta ou a celebração de uma boa notícia podem expressar esse cuidado hoje. A passagem ensina o caminho do amor; a situação concreta pede que escutemos a pessoa com respeito."
    },
    "activities": [
      {
        "kind": "choice",
        "id": "panorama-choice",
        "skill": "Ler o conjunto",
        "sourceRefs": [
          {
            "book": "PSA",
            "chapter": 23,
            "startVerse": 1,
            "endVerse": 6,
            "label": "Salmo 23:1–6"
          }
        ],
        "prompt": "Para acolher com fidelidade a esperança do Salmo 23, qual leitura devemos fazer?",
        "hint": "Volte também ao vale mencionado no versículo 4. Ele está dentro dessa oração de confiança.",
        "options": [
          {
            "id": "isolated",
            "text": "Usar apenas a primeira imagem do salmo e dispensar o restante.",
            "feedback": "A imagem do pastor é preciosa. Vamos ouvi-la junto dos demais versos, para acolher também o que o salmo diz sobre a dificuldade e o amparo de Deus."
          },
          {
            "id": "whole",
            "text": "Ler o poema inteiro, incluindo a dificuldade do versículo 4.",
            "feedback": "Isso mesmo. O salmo reúne confiança e travessia. Quando lemos o conjunto, podemos falar da esperança que ele oferece com mais cuidado por quem está passando por um momento difícil."
          },
          {
            "id": "literal-animal",
            "text": "Concluir que toda referência a pastor descreve apenas criação de animais.",
            "feedback": "A imagem vem da vida de um pastor de rebanho, mas no salmo ela nos ajuda a falar do cuidado de Deus. Repare como caminho, vale e mesa se unem nessa oração."
          }
        ],
        "correctOptionId": "whole"
      },
      {
        "kind": "classify",
        "id": "panorama-classify",
        "skill": "Reconhecer formas de texto",
        "sourceRefs": [
          {
            "book": "LUK",
            "chapter": 10,
            "startVerse": 25,
            "endVerse": 37,
            "label": "Lucas 10:25–37"
          },
          {
            "book": "PSA",
            "chapter": 23,
            "startVerse": 1,
            "endVerse": 6,
            "label": "Salmo 23:1–6"
          },
          {
            "book": "ROM",
            "chapter": 12,
            "startVerse": 9,
            "endVerse": 18,
            "label": "Romanos 12:9–18"
          }
        ],
        "prompt": "Vamos reconhecer as diferentes formas pelas quais essas passagens nos ensinam?",
        "hint": "Uma história acompanha acontecimentos; um poema fala também por imagens; uma carta oferece orientações a seus leitores.",
        "categories": [
          {
            "id": "narrative",
            "label": "Narrativa"
          },
          {
            "id": "poetry",
            "label": "Poesia"
          },
          {
            "id": "letter",
            "label": "Carta com orientações"
          }
        ],
        "items": [
          {
            "id": "luke-scenes",
            "text": "Os encontros e ações contados por Jesus em Lucas 10.",
            "categoryId": "narrative",
            "feedback": "Você acompanhou uma história contada por Jesus. Seus encontros e ações ajudam a escutar o ensinamento.",
            "correction": "Vamos voltar a Lucas 10:30–35. Há pessoas no caminho, encontros e atitudes: aqui estamos acompanhando uma narrativa."
          },
          {
            "id": "psalm-images",
            "text": "As imagens de pastor, caminho e mesa no Salmo 23.",
            "categoryId": "poetry",
            "feedback": "Sim. Essas imagens poéticas dão palavras à confiança no cuidado de Deus.",
            "correction": "Leia novamente o salmo, percebendo como pastor, caminho e mesa comunicam cuidado. São imagens da linguagem poética."
          },
          {
            "id": "romans-instructions",
            "text": "As recomendações de convivência de Romanos 12:9–18.",
            "categoryId": "letter",
            "feedback": "Isso. Nessa parte da carta aos Romanos, recebemos orientações para viver o amor em comunidade.",
            "correction": "Abra Romanos 12. As recomendações estão em uma carta e nos convidam a pensar nossa convivência. Vamos guardá-las nessa categoria."
          },
          {
            "id": "luke-dialogue",
            "text": "A conversa que introduz e encerra a história em Lucas 10.",
            "categoryId": "narrative",
            "feedback": "Sim. A conversa também faz parte da história e nos ajuda a entender por que Jesus contou a parábola.",
            "correction": "As perguntas e respostas são acontecimentos narrados nessa passagem de Lucas. Vamos ouvi-las junto da história."
          }
        ]
      },
      {
        "kind": "order",
        "id": "panorama-order",
        "skill": "Acompanhar uma unidade",
        "sourceRefs": [
          {
            "book": "LUK",
            "chapter": 10,
            "startVerse": 25,
            "endVerse": 37,
            "label": "Lucas 10:25–37"
          }
        ],
        "prompt": "Vamos lembrar como Jesus conduziu a conversa de Lucas 10:25–37?",
        "hint": "Comece pela pergunta que abriu a conversa e chegue ao convite de Jesus para viver a misericórdia.",
        "items": [
          {
            "id": "story",
            "text": "Jesus conta a história do homem ferido e dos encontros no caminho."
          },
          {
            "id": "invitation",
            "text": "A resposta identifica quem agiu com misericórdia, e Jesus convida à prática."
          },
          {
            "id": "opening",
            "text": "Um estudioso da Lei conversa com Jesus e pergunta sobre o próximo."
          },
          {
            "id": "closing-question",
            "text": "Jesus pergunta quem se tornou próximo do homem ferido."
          }
        ],
        "correctOrder": [
          "opening",
          "story",
          "closing-question",
          "invitation"
        ],
        "correctFeedback": "Você acompanhou o caminho da conversa: a pergunta, a história, a pergunta final e o convite à prática. Essa escuta paciente nos ajuda a receber o ensinamento de Jesus por inteiro.",
        "incorrectFeedback": "Podemos voltar juntos à passagem. Leia primeiro 10:25–29, depois 30–35 e, por fim, 36–37. Reorganize os momentos com calma; a própria conversa vai nos orientar."
      }
    ],
    "reflection": {
      "scripture": "Guarde no caderno uma das passagens que lemos e o nome da edição da sua Bíblia.",
      "observation": "Que imagem, palavra ou atitude da passagem chamou sua atenção? Anote onde você a encontrou.",
      "application": "Que gesto de escuta ou cuidado pode nascer dessa leitura na sua convivência esta semana?",
      "prayer": "Se desejar, converse com o Senhor sobre o que leu. Pode ser uma gratidão, uma pergunta ou um pedido de ajuda para viver a Palavra."
    },
    "recap": [
      "A Palavra nos ensina por histórias, poemas e cartas.",
      "Ler uma passagem inteira ajuda a acolher seu sentido com fidelidade.",
      "O que aprendemos pode tornar-se oração e cuidado na vida cotidiana."
    ],
    "reviewPrompt": "Quando puder, volte à Palavra com o Salmo 121:1–4. Leia sem pressa, perceba uma imagem de cuidado e procure explicar, com suas palavras, a esperança expressa ali.",
    "pastoralInvitation": "Vamos abrir a Bíblia com o coração disposto. Há páginas que contam uma história, outras que dão palavras à nossa oração e outras que orientam nossa maneira de amar. Podemos caminhar por elas com calma, aprendendo a reconhecer a voz do texto e acolhendo as perguntas que surgirem.",
    "closingPrayer": "Senhor, dá-me atenção para ouvir tua Palavra e humildade para continuar aprendendo. Que aquilo que eu compreender hoje encontre lugar no meu modo de amar. Em nome de Jesus, amém."
  },
  {
    "id": "criacao-e-cuidado",
    "title": "Receber a vida, aprender a cuidar",
    "subtitle": "Aproxime-se do começo de Gênesis com gratidão e descubra um convite à dignidade e ao cuidado.",
    "theme": "Criação",
    "estimatedMinutes": 18,
    "editorialStatus": "educational-pilot",
    "objectives": [
      "Acompanhar com atenção as primeiras cenas de Gênesis.",
      "Reconhecer o que o relato diz sobre a imagem de Deus, a bênção e o cuidado.",
      "Escolher uma atitude de responsabilidade que brote dessa leitura."
    ],
    "passages": [
      {
        "book": "GEN",
        "chapter": 1,
        "startVerse": 1,
        "endVerse": 5,
        "label": "Gênesis 1:1–5"
      },
      {
        "book": "GEN",
        "chapter": 1,
        "startVerse": 26,
        "endVerse": 31,
        "label": "Gênesis 1:26–31"
      },
      {
        "book": "GEN",
        "chapter": 2,
        "startVerse": 1,
        "endVerse": 3,
        "label": "Gênesis 2:1–3"
      },
      {
        "book": "GEN",
        "chapter": 2,
        "startVerse": 15,
        "endVerse": 17,
        "label": "Gênesis 2:15–17"
      }
    ],
    "cards": [
      {
        "id": "creation-opening",
        "title": "No começo, voltamos o olhar para Deus",
        "body": [
          "Gênesis 1 abre nossa leitura apresentando Deus como Criador. Nos versículos 1–5, acompanhe o que é narrado: a fala de Deus, a luz e as ações que se seguem. Podemos ler com atenção e também com admiração.",
          "Há perguntas profundas sobre a criação que cristãos estudam de maneiras diferentes. Neste encontro, vamos começar pelo que esses versículos nos convidam a perceber: Deus, a vida recebida e a disposição de escutar sua Palavra."
        ],
        "task": "Leia Gênesis 1:1–5. Quais ações de Deus você consegue encontrar? Permaneça um instante nessa leitura.",
        "sourceRefs": [
          {
            "book": "GEN",
            "chapter": 1,
            "startVerse": 1,
            "endVerse": 5,
            "label": "Gênesis 1:1–5"
          }
        ]
      },
      {
        "id": "creation-pattern",
        "title": "Dê atenção ao que a Palavra repete",
        "body": [
          "Acompanhe a fala sobre a luz e o que vem em seguida. O relato vai se desenvolvendo por ações, distinções e avaliações. Essas palavras repetidas nos ajudam a caminhar pelo capítulo sem perder sua direção.",
          "Ao chegar ao versículo 31, observe a avaliação do conjunto. O cuidado de ler não diminui a reverência; ele nos ajuda a acolher com mais atenção o testemunho que o texto oferece sobre a criação."
        ],
        "task": "Conte com suas palavras o que acontece depois da fala sobre a luz, voltando aos versículos quando precisar.",
        "sourceRefs": [
          {
            "book": "GEN",
            "chapter": 1,
            "startVerse": 1,
            "endVerse": 5,
            "label": "Gênesis 1:1–5"
          },
          {
            "book": "GEN",
            "chapter": 1,
            "startVerse": 26,
            "endVerse": 31,
            "label": "Gênesis 1:26–31"
          }
        ]
      },
      {
        "id": "creation-dignity",
        "title": "Olhe para cada pessoa com dignidade",
        "body": [
          "Em Gênesis 1:26–28, a vida humana é apresentada em relação com a imagem de Deus e a bênção divina. Leia essas palavras devagar. Na fé cristã, elas alimentam a reflexão sobre a dignidade com que devemos tratar as pessoas.",
          "Essa reflexão pode começar bem perto: na maneira de escutar, de falar e de acolher alguém que costuma passar despercebido. A dignidade de uma pessoa pede cuidado também quando ela não se parece conosco ou vive uma história que ainda não compreendemos."
        ],
        "task": "Releia Gênesis 1:27. Que atitude concreta pode expressar respeito pela dignidade de alguém hoje?",
        "sourceRefs": [
          {
            "book": "GEN",
            "chapter": 1,
            "startVerse": 26,
            "endVerse": 31,
            "label": "Gênesis 1:26–31"
          }
        ]
      },
      {
        "id": "creation-care",
        "title": "O cuidado pode caber nas nossas mãos",
        "body": [
          "Gênesis 2:15 apresenta uma tarefa de cultivo e guarda no jardim. O encerramento de 2:1–3 fala de conclusão, repouso e bênção. Podemos ouvir, nessas passagens, perguntas sobre a maneira de receber e cuidar da vida.",
          "Um gesto pequeno e constante pode ser um bom começo: zelar por um espaço, usar um recurso com responsabilidade ou dividir uma tarefa. Cada tradição cristã aprofunda de modo próprio o descanso e os dias da criação; aqui, vamos pensar no cuidado que podemos exercer com atenção e gratidão."
        ],
        "task": "Escolha um cuidado possível com uma pessoa, um espaço ou um recurso que esteja ao seu alcance.",
        "sourceRefs": [
          {
            "book": "GEN",
            "chapter": 2,
            "startVerse": 15,
            "endVerse": 17,
            "label": "Gênesis 2:15–17"
          },
          {
            "book": "GEN",
            "chapter": 2,
            "startVerse": 1,
            "endVerse": 3,
            "label": "Gênesis 2:1–3"
          }
        ]
      }
    ],
    "workedExample": {
      "sourceRefs": [
        {
          "book": "GEN",
          "chapter": 2,
          "startVerse": 15,
          "endVerse": 15,
          "label": "Gênesis 2:15"
        }
      ],
      "title": "Da leitura a um gesto de cuidado",
      "prompt": "Vamos ler Gênesis 2:15 e pensar em um cuidado possível hoje, mantendo carinho pela Palavra e atenção à nossa realidade?",
      "steps": [
        "Abra Gênesis 2:15 e procure a pessoa, o lugar e a tarefa mencionados.",
        "Diga com suas palavras o que o relato apresenta sobre cultivar e guardar.",
        "Pense em algo que hoje dependa um pouco do seu cuidado.",
        "Anote a passagem e o gesto que deseja praticar, deixando claro como a leitura o inspirou."
      ],
      "answer": "O relato apresenta uma tarefa no jardim. Cuidar com constância de um espaço que outras pessoas também usam pode ser uma resposta atual a essa reflexão. O versículo nos acompanha; o lugar e a maneira concreta de agir pertencem à nossa situação de hoje."
    },
    "guidedPractice": {
      "sourceRefs": [
        {
          "book": "GEN",
          "chapter": 1,
          "startVerse": 31,
          "endVerse": 31,
          "label": "Gênesis 1:31"
        },
        {
          "book": "GEN",
          "chapter": 2,
          "startVerse": 1,
          "endVerse": 3,
          "label": "Gênesis 2:1–3"
        }
      ],
      "prompt": "Leia Gênesis 1:31 e depois 2:1–3. Que palavras sobre bondade, conclusão e bênção você deseja guardar dessa leitura?",
      "hints": [
        "Observe como o conjunto da criação é avaliado ao fim do capítulo 1.",
        "Leia as ações apresentadas no começo do capítulo 2.",
        "Primeiro conte o que leu; depois pense no que isso desperta na sua caminhada."
      ],
      "modelResponse": "Gênesis 1:31 apresenta a criação como muito boa. Os versículos seguintes falam de conclusão, repouso e bênção. Podemos levar essa leitura à gratidão e à reflexão sobre nosso ritmo de cuidado, respeitando a maneira como cada comunidade cristã estuda e vive essas questões."
    },
    "activities": [
      {
        "kind": "choice",
        "id": "creation-choice",
        "skill": "Conferir uma afirmação",
        "sourceRefs": [
          {
            "book": "GEN",
            "chapter": 2,
            "startVerse": 15,
            "endVerse": 17,
            "label": "Gênesis 2:15–17"
          }
        ],
        "prompt": "Qual anotação recebe com cuidado o que lemos em Gênesis 2:15 e o relaciona à vida de hoje?",
        "hint": "Procure a opção que reconhece a tarefa narrada e apresenta com clareza um gesto possível no presente.",
        "options": [
          {
            "id": "fixed-plan",
            "text": "O versículo estabelece o mesmo plano de tarefas e horário para toda pessoa hoje.",
            "feedback": "A passagem nos convida a olhar uma tarefa no jardim. Vamos conservar esse cuidado: os horários e o plano de cada pessoa hoje precisam ser pensados à luz de sua própria situação."
          },
          {
            "id": "no-application",
            "text": "Como minha situação é diferente, nenhuma reflexão sobre cuidado é possível.",
            "feedback": "Nossa vida tem circunstâncias diferentes, mas podemos escutar a passagem e refletir sobre o cuidado. Vamos construir essa ligação com humildade e com uma atitude concreta."
          },
          {
            "id": "distinguish",
            "text": "O relato apresenta cultivo e guarda; proponho cuidar de um espaço compartilhado como aplicação.",
            "feedback": "Sim. Você guardou o que o relato apresenta e reconheceu um gesto para hoje. Essa atenção nos ajuda a transformar a leitura em responsabilidade, sem pôr no versículo palavras que ele não traz."
          }
        ],
        "correctOptionId": "distinguish"
      },
      {
        "kind": "classify",
        "id": "creation-classify",
        "skill": "Distinguir evidência e aplicação",
        "sourceRefs": [
          {
            "book": "GEN",
            "chapter": 1,
            "startVerse": 1,
            "endVerse": 5,
            "label": "Gênesis 1:1–5"
          },
          {
            "book": "GEN",
            "chapter": 1,
            "startVerse": 26,
            "endVerse": 31,
            "label": "Gênesis 1:26–31"
          },
          {
            "book": "GEN",
            "chapter": 2,
            "startVerse": 1,
            "endVerse": 3,
            "label": "Gênesis 2:1–3"
          },
          {
            "book": "GEN",
            "chapter": 2,
            "startVerse": 15,
            "endVerse": 17,
            "label": "Gênesis 2:15–17"
          }
        ],
        "prompt": "Vamos separar o que acabamos de ler dos passos que desejamos dar a partir da leitura?",
        "hint": "Volte à passagem com calma: o que ela conta, o que você propõe viver e o que ela não informa?",
        "categories": [
          {
            "id": "observation",
            "label": "Observação do texto"
          },
          {
            "id": "application",
            "label": "Aplicação atual"
          },
          {
            "id": "not-given",
            "label": "Informação não fornecida"
          }
        ],
        "items": [
          {
            "id": "good",
            "text": "Gênesis 1:31 apresenta uma avaliação positiva do conjunto da criação.",
            "categoryId": "observation",
            "feedback": "Isso. A avaliação da criação está em Gênesis 1:31 e pode ser recebida com gratidão.",
            "correction": "Vamos voltar a Gênesis 1:31. Essa avaliação faz parte das palavras do relato; por isso, aqui ela é uma observação da passagem."
          },
          {
            "id": "shared-space",
            "text": "Hoje vou organizar uma forma constante de cuidar de um espaço compartilhado.",
            "categoryId": "application",
            "feedback": "Sim. Esse é um gesto que você pode escolher viver hoje, inspirado pelo cuidado que estamos considerando.",
            "correction": "Esse plano nasce da sua reflexão para hoje. Vamos chamá-lo de aplicação, guardando a distinção entre sua decisão e a tarefa narrada no jardim."
          },
          {
            "id": "modern-date",
            "text": "As passagens informam a data do primeiro dia em um calendário moderno.",
            "categoryId": "not-given",
            "feedback": "Você percebeu um limite importante: os versículos lidos não apresentam essa data em um calendário moderno.",
            "correction": "Podemos ter perguntas sobre datas, mas elas exigem outro caminho de estudo. Essas passagens não fornecem a informação mencionada."
          },
          {
            "id": "rest",
            "text": "Gênesis 2:1–3 relaciona o encerramento da obra com repouso e bênção.",
            "categoryId": "observation",
            "feedback": "Sim. Conclusão, repouso e bênção aparecem na leitura de Gênesis 2:1–3.",
            "correction": "Releia os três versículos com calma. Esses elementos pertencem ao relato; a maneira de vivê-los hoje pede uma reflexão a seguir."
          }
        ]
      },
      {
        "kind": "order",
        "id": "creation-order",
        "skill": "Acompanhar a sequência do relato",
        "sourceRefs": [
          {
            "book": "GEN",
            "chapter": 1,
            "startVerse": 1,
            "endVerse": 5,
            "label": "Gênesis 1:1–5"
          }
        ],
        "prompt": "Vamos acompanhar o caminho da leitura em Gênesis 1:3–5?",
        "hint": "Volte aos versículos e observe a fala de Deus, o acontecimento e as ações que vêm em seguida.",
        "items": [
          {
            "id": "names",
            "text": "Deus nomeia Dia e Noite."
          },
          {
            "id": "light",
            "text": "A luz passa a estar presente no relato."
          },
          {
            "id": "speaks",
            "text": "Deus fala sobre a existência da luz."
          },
          {
            "id": "evaluates",
            "text": "Deus avalia a luz e a separa das trevas."
          }
        ],
        "correctOrder": [
          "speaks",
          "light",
          "evaluates",
          "names"
        ],
        "correctFeedback": "Você acompanhou a sequência da passagem. Esse pequeno cuidado nos ajuda a ouvir cada parte do relato sem pressa.",
        "incorrectFeedback": "Podemos reler juntos: comece no versículo 3 e siga até o 5. Procure a fala, a luz e as ações que vêm depois; reorganize os momentos com tranquilidade."
      }
    ],
    "reflection": {
      "scripture": "Guarde uma das passagens de Gênesis e o nome da edição da sua Bíblia.",
      "observation": "Que ação, palavra ou bênção do relato chamou sua atenção?",
      "application": "Qual cuidado simples e possível você deseja assumir, com respeito pela vida que está perto de você?",
      "prayer": "Se desejar, agradeça ao Criador e peça sabedoria para cuidar. Você pode usar suas palavras e deixar essa oração entre você e Deus."
    },
    "recap": [
      "Podemos nos aproximar de Gênesis com atenção e reverência.",
      "A reflexão sobre a imagem de Deus nos chama a considerar a dignidade das pessoas.",
      "Um cuidado pequeno, vivido com fidelidade, pode ser uma resposta à leitura."
    ],
    "reviewPrompt": "Em outro momento tranquilo, abra Gênesis 2:8–9. Perceba o que o relato apresenta e leve à oração uma gratidão ou uma pergunta que nasceu dessa leitura.",
    "pastoralInvitation": "Antes de seguir, faça uma pequena pausa. A vida que vemos e a vida que ainda não compreendemos nos convidam à reverência diante do Criador. Não precisamos resolver todas as perguntas hoje. Vamos começar escutando Gênesis e deixando que a leitura nos ensine a agradecer e a cuidar.",
    "closingPrayer": "Deus Criador, recebe minha gratidão pela vida. Ensina-me a enxergar as pessoas com dignidade e a cuidar com fidelidade do que colocaste ao meu alcance. Em nome de Jesus, amém."
  },
  {
    "id": "jesus-e-o-proximo",
    "title": "Aprendendo com Jesus a nos tornar próximos",
    "subtitle": "Escute uma parábola em que a compaixão se aproxima, cuida e permanece.",
    "theme": "Jesus",
    "estimatedMinutes": 15,
    "editorialStatus": "educational-pilot",
    "objectives": [
      "Escutar a parábola dentro da conversa em que Jesus a contou.",
      "Perceber como a compaixão se expressa nos gestos da história.",
      "Pensar em uma forma respeitosa e possível de cuidar de alguém."
    ],
    "passages": [
      {
        "book": "LUK",
        "chapter": 10,
        "startVerse": 25,
        "endVerse": 37,
        "label": "Lucas 10:25–37"
      },
      {
        "book": "LUK",
        "chapter": 10,
        "startVerse": 25,
        "endVerse": 29,
        "label": "Lucas 10:25–29"
      },
      {
        "book": "LUK",
        "chapter": 10,
        "startVerse": 33,
        "endVerse": 35,
        "label": "Lucas 10:33–35"
      },
      {
        "book": "LUK",
        "chapter": 10,
        "startVerse": 36,
        "endVerse": 37,
        "label": "Lucas 10:36–37"
      }
    ],
    "cards": [
      {
        "id": "neighbor-question",
        "title": "Traga suas perguntas para perto de Jesus",
        "body": [
          "Lucas 10:25–29 apresenta uma conversa sobre vida, amor a Deus e amor ao próximo. Antes de ouvir a parábola, acompanhe essa conversa. A pergunta sobre o próximo ajuda a perceber a direção do ensinamento de Jesus.",
          "Também podemos chegar à leitura com perguntas sinceras. Enquanto ouvimos, vale deixar que a passagem alargue nosso olhar e nos conduza além das respostas que já trazíamos prontas."
        ],
        "task": "Encontre a pergunta de Lucas 10:29. Guarde-a enquanto lê o que Jesus conta a seguir.",
        "sourceRefs": [
          {
            "book": "LUK",
            "chapter": 10,
            "startVerse": 25,
            "endVerse": 29,
            "label": "Lucas 10:25–29"
          }
        ]
      },
      {
        "id": "neighbor-encounters",
        "title": "Repare em quem está à beira do caminho",
        "body": [
          "Jesus conta a história de um homem ferido e de pessoas que passam por aquele caminho. Um sacerdote, um levita e um samaritano aparecem no relato. Acompanhe as atitudes de cada personagem sem perder de vista o homem que precisa de cuidado.",
          "A parábola nos convida a examinar nosso modo de agir. Podemos escutá-la com humildade, sem transformá-la em desprezo por um povo ou uma comunidade inteira. O amor ao próximo pede que vejamos pessoas, com sua dignidade e sua história."
        ],
        "task": "Leia Lucas 10:30–35. Onde você percebe a diferença entre ver alguém e aproximar-se para cuidar?",
        "sourceRefs": [
          {
            "book": "LUK",
            "chapter": 10,
            "startVerse": 25,
            "endVerse": 37,
            "label": "Lucas 10:25–37"
          }
        ]
      },
      {
        "id": "neighbor-care",
        "title": "A compaixão encontra um gesto possível",
        "body": [
          "Nos versículos 33–35, o samaritano se aproxima, atende às feridas, leva o homem a uma hospedaria e providencia a continuidade do cuidado. A misericórdia percorre um caminho de gestos, um depois do outro.",
          "Ao pensar na vida de hoje, podemos perguntar com simplicidade: de que ajuda essa pessoa precisa? O que consigo oferecer com responsabilidade? Quem mais pode ajudar? Amar também inclui reconhecer limites e procurar o apoio adequado para uma necessidade real."
        ],
        "task": "Escolha duas ações do samaritano. Como uma dá continuidade ao cuidado iniciado pela outra?",
        "sourceRefs": [
          {
            "book": "LUK",
            "chapter": 10,
            "startVerse": 33,
            "endVerse": 35,
            "label": "Lucas 10:33–35"
          }
        ]
      },
      {
        "id": "neighbor-conclusion",
        "title": "O convite de Jesus chega à nossa vida",
        "body": [
          "No fim da conversa, Jesus pergunta quem se tornou próximo do homem ferido. A resposta aponta a misericórdia, e o diálogo se abre para a prática. Volte a Lucas 10:36–37 e ouça esse encerramento.",
          "Talvez o primeiro passo de hoje seja ouvir alguém, cumprir uma ajuda combinada ou perceber quem costuma ficar de lado. Você pode levar isso à oração e escolher um gesto possível. A vida da fé continua para além desta tela, nos encontros que teremos."
        ],
        "task": "Com suas palavras, explique como a pergunta final de Jesus ilumina a história inteira.",
        "sourceRefs": [
          {
            "book": "LUK",
            "chapter": 10,
            "startVerse": 36,
            "endVerse": 37,
            "label": "Lucas 10:36–37"
          }
        ]
      }
    ],
    "workedExample": {
      "sourceRefs": [
        {
          "book": "LUK",
          "chapter": 10,
          "startVerse": 33,
          "endVerse": 35,
          "label": "Lucas 10:33–35"
        },
        {
          "book": "LUK",
          "chapter": 10,
          "startVerse": 36,
          "endVerse": 37,
          "label": "Lucas 10:36–37"
        }
      ],
      "title": "Vamos olhar de perto os gestos de misericórdia",
      "prompt": "Como percebemos, nessa história, que a compaixão se tornou cuidado concreto?",
      "steps": [
        "Leia Lucas 10:33 e detenha-se na reação do samaritano.",
        "Acompanhe seus gestos nos versículos 34 e 35.",
        "Perceba como o cuidado continua depois da chegada à hospedaria.",
        "Volte à pergunta final de Jesus e à resposta sobre a misericórdia."
      ],
      "answer": "O samaritano se compadece e se aproxima. Seu cuidado alcança as feridas, o transporte, a hospedagem e o que será necessário depois. Ao pensar uma resposta para hoje, podemos guardar esse movimento de aproximação, ouvindo a pessoa e considerando os recursos e os limites reais da situação."
    },
    "guidedPractice": {
      "sourceRefs": [
        {
          "book": "LUK",
          "chapter": 10,
          "startVerse": 29,
          "endVerse": 29,
          "label": "Lucas 10:29"
        },
        {
          "book": "LUK",
          "chapter": 10,
          "startVerse": 36,
          "endVerse": 37,
          "label": "Lucas 10:36–37"
        }
      ],
      "prompt": "Volte a Lucas 10:29 e depois a 10:36–37. Para onde a pergunta de Jesus conduz o nosso olhar?",
      "hints": [
        "Na abertura, observe a pergunta sobre quem é o próximo.",
        "No fim, repare em quem agiu com misericórdia em relação ao homem ferido.",
        "Escolha um gesto da história para explicar sua resposta."
      ],
      "modelResponse": "A pergunta final nos faz olhar para quem se tornou próximo por meio da misericórdia. Os gestos dos versículos 33–35 ajudam a compreender isso. Podemos então levar uma pergunta à nossa própria caminhada: como me aproximar com amor de alguém em uma situação concreta?"
    },
    "activities": [
      {
        "kind": "choice",
        "id": "neighbor-choice",
        "skill": "Justificar uma leitura",
        "sourceRefs": [
          {
            "book": "LUK",
            "chapter": 10,
            "startVerse": 33,
            "endVerse": 35,
            "label": "Lucas 10:33–35"
          },
          {
            "book": "LUK",
            "chapter": 10,
            "startVerse": 36,
            "endVerse": 37,
            "label": "Lucas 10:36–37"
          }
        ],
        "prompt": "Qual resumo ajuda a guardar o ensinamento da história e a pergunta final de Jesus?",
        "hint": "Pense nos gestos dos versículos 33–35 e volte ao encerramento em 36–37.",
        "options": [
          {
            "id": "mercy-action",
            "text": "A misericórdia aparece em cuidado concreto e orienta a resposta à pergunta final.",
            "feedback": "Sim. Você ligou o cuidado narrado à misericórdia lembrada ao final. Esse é um bom ponto de partida para meditar no convite de Jesus e pensar em um gesto de amor."
          },
          {
            "id": "group-ranking",
            "text": "A história permite classificar todas as pessoas apenas pelo grupo a que pertencem.",
            "feedback": "Vamos voltar às atitudes dos personagens. A parábola nos chama à misericórdia; não precisamos usar a história para desprezar grupos ou pessoas."
          },
          {
            "id": "fixed-amount",
            "text": "A conclusão estabelece uma quantia de dinheiro obrigatória para toda ajuda atual.",
            "feedback": "Os recursos citados ajudam a mostrar a continuidade do cuidado. Vamos ouvir também a conclusão: o convite está ligado à misericórdia, sem fixar uma mesma quantia para toda situação de hoje."
          }
        ],
        "correctOptionId": "mercy-action"
      },
      {
        "kind": "classify",
        "id": "neighbor-classify",
        "skill": "Distinguir relato e proposta",
        "sourceRefs": [
          {
            "book": "LUK",
            "chapter": 10,
            "startVerse": 25,
            "endVerse": 37,
            "label": "Lucas 10:25–37"
          },
          {
            "book": "LUK",
            "chapter": 10,
            "startVerse": 33,
            "endVerse": 35,
            "label": "Lucas 10:33–35"
          }
        ],
        "prompt": "Ao guardar esta história, vamos distinguir o que Jesus contou do que desejamos viver hoje?",
        "hint": "Volte à passagem e pergunte: isso foi narrado, é uma atitude que proponho para hoje ou é um detalhe que o texto não contou?",
        "categories": [
          {
            "id": "story",
            "label": "Informação do relato"
          },
          {
            "id": "application",
            "label": "Aplicação atual"
          },
          {
            "id": "not-given",
            "label": "Não informado no trecho"
          }
        ],
        "items": [
          {
            "id": "inn",
            "text": "O samaritano leva o homem para uma hospedaria e providencia continuidade de cuidado.",
            "categoryId": "story",
            "feedback": "Sim. Em Lucas 10:34–35, o cuidado chega à hospedaria e continua além do primeiro encontro.",
            "correction": "Vamos reler os versículos 34 e 35. Esses gestos estão na história contada por Jesus."
          },
          {
            "id": "ask-help",
            "text": "Hoje posso perguntar a uma pessoa de que ajuda ela precisa e oferecer algo viável.",
            "categoryId": "application",
            "feedback": "Esse é um gesto possível para hoje, inspirado no cuidado que acompanhamos na parábola.",
            "correction": "A frase fala de uma escolha que podemos fazer hoje. Vamos guardá-la como aplicação, ouvindo a necessidade da pessoa real."
          },
          {
            "id": "victim-name",
            "text": "A passagem fornece o nome e a idade exata do homem ferido.",
            "categoryId": "not-given",
            "feedback": "Isso. Podemos acolher o ensinamento da história sem preencher o nome ou a idade que ela não informa.",
            "correction": "Volte ao início da história. Jesus não informa esses detalhes na passagem; podemos aprender com ela sem acrescentá-los."
          },
          {
            "id": "compassion",
            "text": "O relato associa o samaritano à compaixão pelo homem que encontrou.",
            "categoryId": "story",
            "feedback": "Sim. A compaixão é narrada em Lucas 10:33 e ganha expressão nos gestos que vêm depois.",
            "correction": "Procure Lucas 10:33. Essa reação faz parte da narrativa e nos ajuda a acompanhar o cuidado que se segue."
          }
        ]
      },
      {
        "kind": "order",
        "id": "neighbor-order",
        "skill": "Reconhecer continuidade do cuidado",
        "sourceRefs": [
          {
            "book": "LUK",
            "chapter": 10,
            "startVerse": 33,
            "endVerse": 35,
            "label": "Lucas 10:33–35"
          }
        ],
        "prompt": "Vamos acompanhar, um gesto de cada vez, o cuidado de Lucas 10:33–35?",
        "hint": "Siga a história desde o encontro no caminho até a continuidade combinada com o hospedeiro.",
        "items": [
          {
            "id": "stay",
            "text": "Transporta o homem até uma hospedaria e cuida dele."
          },
          {
            "id": "notice",
            "text": "Vê o homem e se compadece."
          },
          {
            "id": "continuity",
            "text": "Deixa recursos e combina a continuidade do cuidado com o hospedeiro."
          },
          {
            "id": "approach",
            "text": "Aproxima-se e atende às feridas."
          }
        ],
        "correctOrder": [
          "notice",
          "approach",
          "stay",
          "continuity"
        ],
        "correctFeedback": "Você acompanhou o cuidado que se aproxima e permanece. Essa é a ordem dos acontecimentos narrados; para ajudar alguém hoje, precisamos considerar sua necessidade e o apoio apropriado.",
        "incorrectFeedback": "Vamos caminhar pela história novamente. Primeiro a reação ao ver o homem; depois a aproximação, a hospedagem e o cuidado providenciado para a partida. Leia sem pressa e reorganize os momentos."
      }
    ],
    "reflection": {
      "scripture": "Guarde Lucas 10:25–37 e o nome da edição que acompanhou sua leitura.",
      "observation": "Que gesto da história ajuda você a compreender a misericórdia lembrada na resposta final?",
      "application": "Há alguém de quem você pode se aproximar com uma escuta ou uma ajuda possível e respeitosa?",
      "prayer": "Se desejar, peça ao Senhor sensibilidade e sabedoria para cuidar. Você pode manter nomes e histórias somente na sua oração."
    },
    "recap": [
      "O diálogo nos ajuda a escutar a parábola de Jesus.",
      "A compaixão ganha expressão em gestos de cuidado.",
      "Podemos responder à leitura com misericórdia atenta à vida de quem está perto."
    ],
    "reviewPrompt": "Quando puder, leia Mateus 7:12. Guarde a passagem e pense em uma situação nova em que o cuidado com o próximo pode orientar suas atitudes.",
    "pastoralInvitation": "Vamos nos sentar, por um momento, para ouvir Jesus. Ele conhece as perguntas que fazemos e nos chama a olhar para as pessoas com misericórdia. Leia esta história com calma. Se ela lhe trouxer à lembrança alguém que precisa de cuidado, guarde essa pessoa em sua oração.",
    "closingPrayer": "Senhor Jesus, ensina-me a perceber quem está perto e a amar com gestos sinceros. Dá-me mansidão para ouvir e sabedoria para oferecer o cuidado que me for possível. Amém."
  },
  {
    "id": "orar-com-sentido",
    "title": "Com Jesus, aprendemos a orar",
    "subtitle": "Aproxime-se do ensino de Jesus com suas palavras, suas necessidades e um coração disposto a ouvir.",
    "theme": "Oração",
    "estimatedMinutes": 15,
    "editorialStatus": "educational-pilot",
    "objectives": [
      "Ouvir o que Jesus ensina sobre intenção e confiança na oração.",
      "Reconhecer os pedidos do modelo de oração de Mateus 6.",
      "Levar um desses pedidos à sua conversa pessoal com Deus."
    ],
    "passages": [
      {
        "book": "MAT",
        "chapter": 6,
        "startVerse": 5,
        "endVerse": 13,
        "label": "Mateus 6:5–13"
      },
      {
        "book": "MAT",
        "chapter": 6,
        "startVerse": 5,
        "endVerse": 8,
        "label": "Mateus 6:5–8"
      },
      {
        "book": "MAT",
        "chapter": 6,
        "startVerse": 9,
        "endVerse": 13,
        "label": "Mateus 6:9–13"
      }
    ],
    "cards": [
      {
        "id": "prayer-intention",
        "title": "Você pode se aproximar com sinceridade",
        "body": [
          "Em Mateus 6:5–8, Jesus volta nossa atenção à intenção com que oramos. Leia o que ele diz sobre a busca de reconhecimento e sobre o Pai que conhece as necessidades. Há um convite à confiança nessa passagem.",
          "Um lugar tranquilo pode ajudar a reunir a atenção. Se quiser, faça uma pausa antes de continuar e pense no que deseja apresentar a Deus. Sua oração pode permanecer somente entre você e o Senhor."
        ],
        "task": "Encontre na passagem uma orientação sobre a aparência e outra que desperte confiança no Pai.",
        "sourceRefs": [
          {
            "book": "MAT",
            "chapter": 6,
            "startVerse": 5,
            "endVerse": 8,
            "label": "Mateus 6:5–8"
          }
        ]
      },
      {
        "id": "prayer-words",
        "title": "Deixe que as palavras tenham lugar no coração",
        "body": [
          "Nos versículos 7–8, Jesus questiona a confiança em acumular palavras como meio de ser ouvido. O Pai que ele apresenta conhece as necessidades. Podemos ler esse ensino como um convite a orar com atenção ao que dizemos.",
          "Uma oração aprendida na comunidade ou uma oração em suas próprias palavras pode acompanhar esse encontro. Dê tempo ao significado: o que você está agradecendo, pedindo ou entregando ao Senhor?"
        ],
        "task": "Com suas palavras, explique por que uma oração longa ou curta não pode ser medida como uma pontuação de fé.",
        "sourceRefs": [
          {
            "book": "MAT",
            "chapter": 6,
            "startVerse": 5,
            "endVerse": 8,
            "label": "Mateus 6:5–8"
          }
        ]
      },
      {
        "id": "prayer-model",
        "title": "Jesus nos dá palavras para a vida inteira",
        "body": [
          "Leia Mateus 6:9–13. O modelo de oração começa voltando-nos ao Pai, ao seu nome, ao Reino e à sua vontade. Depois, acolhe necessidades próximas de nós: o pão, o perdão e o livramento.",
          "Esses pedidos nos ajudam a levar a vida cotidiana à presença de Deus. Você pode lê-los devagar, percebendo o que cada um desperta e o que ainda precisa compreender. Organizar a passagem aqui é uma ajuda para ouvi-la com atenção."
        ],
        "task": "Escolha um pedido ligado às necessidades da vida e outro que toque nossa convivência. Onde você os encontrou?",
        "sourceRefs": [
          {
            "book": "MAT",
            "chapter": 6,
            "startVerse": 9,
            "endVerse": 13,
            "label": "Mateus 6:9–13"
          }
        ]
      },
      {
        "id": "prayer-life",
        "title": "Permaneça um pouco no que a oração despertou",
        "body": [
          "O pedido de perdão nos convida a olhar com sinceridade para nossa relação com Deus e com as pessoas. Essa reflexão pode ser levada à oração com humildade e cuidado, um passo de cada vez.",
          "Você pode escolher um dos pedidos, compreender suas palavras e orar a partir dele. Se uma pergunta continuar, guarde-a e procure uma conversa de confiança na sua comunidade. O app não recebe nem dá nota às palavras da sua oração."
        ],
        "task": "Qual pedido da passagem você deseja compreender e levar à oração com mais atenção hoje?",
        "sourceRefs": [
          {
            "book": "MAT",
            "chapter": 6,
            "startVerse": 9,
            "endVerse": 13,
            "label": "Mateus 6:9–13"
          }
        ]
      }
    ],
    "workedExample": {
      "sourceRefs": [
        {
          "book": "MAT",
          "chapter": 6,
          "startVerse": 9,
          "endVerse": 13,
          "label": "Mateus 6:9–13"
        }
      ],
      "title": "Vamos permanecer no pedido pelo pão de cada dia",
      "prompt": "Ao ler Mateus 6:11, como podemos ouvir esse pedido junto da oração inteira?",
      "steps": [
        "Abra Mateus 6:9–13 e localize o versículo 11.",
        "Perceba o pedido relacionado às necessidades cotidianas.",
        "Leia também os outros pedidos, incluindo perdão e livramento.",
        "Pense no que deseja agradecer e apresentar ao Pai, com confiança e atenção à vida de outras pessoas."
      ],
      "answer": "O pedido pelo pão pode nos ajudar a reconhecer dependência, necessidades e gratidão na conversa com Deus. Ele está dentro de uma oração mais ampla. Podemos apresentá-lo com confiança, sem transformá-lo em uma promessa de que todo desejo será atendido imediatamente da maneira que imaginamos."
    },
    "guidedPractice": {
      "sourceRefs": [
        {
          "book": "MAT",
          "chapter": 6,
          "startVerse": 9,
          "endVerse": 13,
          "label": "Mateus 6:9–13"
        }
      ],
      "prompt": "Leia Mateus 6:9–13 com calma. Quais dois pedidos você gostaria de explicar com suas palavras e guardar para sua oração?",
      "hints": [
        "Você pode começar por algo próximo, como pão ou perdão.",
        "Procure o versículo em que o pedido aparece.",
        "Depois de compreender suas palavras, reserve um momento pessoal para orar, se desejar."
      ],
      "modelResponse": "Podemos encontrar o pedido ligado ao sustento no versículo 11 e o de perdão no versículo 12. Compreender essas palavras nos ajuda a orar com atenção. O que você apresentar a Deus pode continuar sendo um momento pessoal, sem envio ao aplicativo."
    },
    "activities": [
      {
        "kind": "choice",
        "id": "prayer-choice",
        "skill": "Ler a motivação do ensino",
        "sourceRefs": [
          {
            "book": "MAT",
            "chapter": 6,
            "startVerse": 5,
            "endVerse": 8,
            "label": "Mateus 6:5–8"
          }
        ],
        "prompt": "Ao nos ensinar sobre a oração, que confiança Jesus questiona em Mateus 6:7–8?",
        "hint": "Observe em que as pessoas mencionadas no alerta pensam apoiar o fato de serem ouvidas.",
        "options": [
          {
            "id": "no-needs",
            "text": "A ideia de que necessidades da vida podem ser apresentadas em oração.",
            "feedback": "Podemos apresentar as necessidades da vida ao Pai; o próprio modelo de oração faz isso. Vamos voltar ao alerta sobre a confiança em muitas palavras."
          },
          {
            "id": "quantity",
            "text": "A ideia de que a quantidade de palavras, por si só, garante ser ouvido.",
            "feedback": "Isso. Jesus chama a atenção para essa confiança na quantidade de palavras e nos conduz ao Pai que conhece as necessidades. Podemos orar procurando compreender o que dizemos."
          },
          {
            "id": "all-received-words",
            "text": "A ideia de que qualquer oração aprendida com outra pessoa é automaticamente inadequada.",
            "feedback": "Jesus também oferece um modelo para ser aprendido. Ao reler o alerta, procure a intenção que ele questiona, sem julgar automaticamente toda oração recebida na comunidade."
          }
        ],
        "correctOptionId": "quantity"
      },
      {
        "kind": "classify",
        "id": "prayer-classify",
        "skill": "Reconhecer pedidos e limites",
        "sourceRefs": [
          {
            "book": "MAT",
            "chapter": 6,
            "startVerse": 5,
            "endVerse": 8,
            "label": "Mateus 6:5–8"
          },
          {
            "book": "MAT",
            "chapter": 6,
            "startVerse": 9,
            "endVerse": 13,
            "label": "Mateus 6:9–13"
          }
        ],
        "prompt": "Vamos guardar o que Jesus ensinou e reconhecer as propostas que usamos para estudar?",
        "hint": "Leia os pedidos de Mateus 6:9–13 e volte aos versículos 7–8 quando precisar.",
        "categories": [
          {
            "id": "request",
            "label": "Assunto presente no modelo"
          },
          {
            "id": "study",
            "label": "Proposta de estudo atual"
          },
          {
            "id": "not-promised",
            "label": "Promessa não feita no trecho"
          }
        ],
        "items": [
          {
            "id": "bread",
            "text": "O pedido ligado ao pão de cada dia.",
            "categoryId": "request",
            "feedback": "Sim. O pedido pelo pão está em Mateus 6:11 e traz as necessidades cotidianas à oração.",
            "correction": "Vamos abrir Mateus 6:11. Esse pedido faz parte do modelo que estamos lendo com Jesus."
          },
          {
            "id": "immediate",
            "text": "A garantia de receber imediatamente qualquer desejo por usar muitas palavras.",
            "categoryId": "not-promised",
            "feedback": "Você percebeu o cuidado necessário. Essa garantia não é feita na passagem, e Jesus questiona a confiança em acumular palavras.",
            "correction": "Releia os versículos 7–8 e depois os pedidos. Podemos confiar no Pai sem atribuir à passagem essa garantia de um resultado imediato."
          },
          {
            "id": "notebook",
            "text": "Anotar no caderno uma pergunta sobre o significado de um dos pedidos.",
            "categoryId": "study",
            "feedback": "Sim. O caderno é uma ajuda que propomos hoje para guardar perguntas e continuar meditando.",
            "correction": "Essa anotação é uma ajuda de estudo para nós. O modelo de oração não determina esse formato de caderno."
          },
          {
            "id": "forgiveness",
            "text": "O pedido relacionado ao perdão.",
            "categoryId": "request",
            "feedback": "Isso. O perdão aparece em Mateus 6:12 e aproxima nossa oração da vida com outras pessoas.",
            "correction": "Volte ao versículo 12. O perdão é um dos pedidos que encontramos na oração lida."
          }
        ]
      },
      {
        "kind": "order",
        "id": "prayer-order",
        "skill": "Compreender a organização da passagem",
        "sourceRefs": [
          {
            "book": "MAT",
            "chapter": 6,
            "startVerse": 9,
            "endVerse": 13,
            "label": "Mateus 6:9–13"
          }
        ],
        "prompt": "Vamos acompanhar a oração na ordem em que Mateus 6:9–13 a apresenta?",
        "hint": "Leia cada versículo com calma. Estamos acompanhando essa passagem, sem estabelecer uma regra para toda oração pessoal.",
        "items": [
          {
            "id": "bread",
            "text": "Pedido ligado ao pão de cada dia."
          },
          {
            "id": "forgiveness-deliverance",
            "text": "Pedidos relacionados a perdão e livramento."
          },
          {
            "id": "father-name",
            "text": "Referência ao Pai e à santificação do nome."
          },
          {
            "id": "kingdom-will",
            "text": "Pedidos relacionados ao Reino e à vontade de Deus."
          }
        ],
        "correctOrder": [
          "father-name",
          "kingdom-will",
          "bread",
          "forgiveness-deliverance"
        ],
        "correctFeedback": "Você acompanhou os assuntos do modelo de oração. Agora pode voltar a um deles com mais atenção e levá-lo à sua conversa com Deus.",
        "incorrectFeedback": "Vamos ler juntos os versículos 9, 10, 11 e 12–13. Observe o Pai e o nome, o Reino e a vontade, o pão e os pedidos seguintes. Reorganize os grupos sem pressa."
      }
    ],
    "reflection": {
      "scripture": "Guarde Mateus 6:5–13 e o nome da edição que leu.",
      "observation": "O que nessa passagem ajudou você a compreender a intenção e a confiança da oração?",
      "application": "Qual pedido você deseja acolher com mais atenção na maneira de viver e se relacionar?",
      "prayer": "Se desejar, ore com suas palavras ou com uma oração de sua comunidade, prestando atenção ao que está dizendo. Esse encontro não precisa ser compartilhado aqui."
    },
    "recap": [
      "Podemos nos aproximar do Pai com sinceridade e confiança.",
      "Compreender os pedidos nos ajuda a orar com atenção.",
      "A oração pessoal tem seu lugar diante de Deus e não recebe nota no aplicativo."
    ],
    "reviewPrompt": "Em outro momento, leia Lucas 11:1–4. Ouça o pedido dos discípulos e a resposta de Jesus. Que assunto você reconhece e deseja meditar de novo?",
    "pastoralInvitation": "Talvez hoje você tenha muitas palavras; talvez só consiga fazer uma pequena oração. Podemos começar de onde estamos. Em Mateus 6, Jesus nos conduz à confiança no Pai que conhece as nossas necessidades. Vamos ouvir esse ensino com atenção e reservar um espaço de sinceridade diante de Deus.",
    "closingPrayer": "Pai, recebe minhas palavras e também aquilo que ainda não sei dizer. Ensina-me a buscar tua vontade, a agradecer pelo sustento e a caminhar em perdão e cuidado. Em nome de Jesus, amém."
  },
  {
    "id": "compartilhar-com-respeito",
    "title": "Partilhar a esperança com mansidão",
    "subtitle": "Prepare o coração para escutar e conversar sobre a fé com clareza, respeito e amor.",
    "theme": "Vida cristã",
    "estimatedMinutes": 18,
    "editorialStatus": "educational-pilot",
    "objectives": [
      "Perceber como esperança, mansidão e respeito caminham juntos na orientação bíblica.",
      "Observar como Paulo se dirige às pessoas em Atos 17.",
      "Preparar uma conversa simples que acolha perguntas e respeite a liberdade de quem escuta."
    ],
    "passages": [
      {
        "book": "1PE",
        "chapter": 3,
        "startVerse": 15,
        "endVerse": 16,
        "label": "1 Pedro 3:15–16"
      },
      {
        "book": "ACT",
        "chapter": 17,
        "startVerse": 22,
        "endVerse": 24,
        "label": "Atos 17:22–24"
      },
      {
        "book": "ACT",
        "chapter": 17,
        "startVerse": 22,
        "endVerse": 31,
        "label": "Atos 17:22–31"
      },
      {
        "book": "ROM",
        "chapter": 12,
        "startVerse": 9,
        "endVerse": 18,
        "label": "Romanos 12:9–18"
      }
    ],
    "cards": [
      {
        "id": "sharing-listen",
        "title": "Antes da resposta, acolha a pessoa",
        "body": [
          "Em 1 Pedro 3:15–16, a disposição de responder sobre a esperança vem acompanhada de mansidão, respeito e boa consciência. Leia devagar: a maneira de falar também faz parte dessa orientação.",
          "Uma conversa pode começar com uma pergunta simples: você gostaria de falar sobre isso agora? Ouça o que a pessoa realmente deseja compreender. Esse espaço de escuta permite que a resposta encontre sua dúvida com cuidado."
        ],
        "task": "Pense em uma pergunta breve que deixe a outra pessoa à vontade para escolher conversar.",
        "sourceRefs": [
          {
            "book": "1PE",
            "chapter": 3,
            "startVerse": 15,
            "endVerse": 16,
            "label": "1 Pedro 3:15–16"
          }
        ]
      },
      {
        "id": "sharing-tone",
        "title": "Mansidão pode caminhar com convicção",
        "body": [
          "Podemos partilhar a esperança cristã com clareza e tratar com dignidade quem faz perguntas. Se algo ainda não estiver claro para nós, é possível reconhecer a dúvida e voltar à Escritura antes de responder.",
          "Respeitar os limites e guardar a história pessoal de alguém também expressa cuidado. A conversa é um encontro com uma pessoa. Nossa atenção precisa alcançar tanto o que queremos dizer quanto a maneira como ela está sendo recebida."
        ],
        "task": "Como você diria, com simplicidade e honestidade, que deseja conferir uma passagem antes de responder?",
        "sourceRefs": [
          {
            "book": "1PE",
            "chapter": 3,
            "startVerse": 15,
            "endVerse": 16,
            "label": "1 Pedro 3:15–16"
          }
        ]
      },
      {
        "id": "sharing-context",
        "title": "Olhe com atenção para quem está ouvindo",
        "body": [
          "Em Atos 17:22–24, Paulo começa sua fala mencionando algo que observou entre as pessoas a quem se dirige. Leia também o desenvolvimento até o versículo 31. A abertura faz parte de uma mensagem que tem seu próprio caminho.",
          "Esse encontro pode nos lembrar da importância de prestar atenção às perguntas, palavras e experiências de quem está à nossa frente. Podemos ouvir com respeito e apresentar a esperança cristã sem fingir saber tudo sobre a pessoa ou sobre Deus."
        ],
        "task": "Perceba o que Paulo menciona na abertura e acompanhe como sua fala continua nos versículos seguintes.",
        "sourceRefs": [
          {
            "book": "ACT",
            "chapter": 17,
            "startVerse": 22,
            "endVerse": 24,
            "label": "Atos 17:22–24"
          },
          {
            "book": "ACT",
            "chapter": 17,
            "startVerse": 22,
            "endVerse": 31,
            "label": "Atos 17:22–31"
          }
        ]
      },
      {
        "id": "sharing-care",
        "title": "Que a conversa seja acompanhada de amor",
        "body": [
          "A orientação de 1 Pedro une resposta, mansidão e conduta. Romanos 12:9–18 também nos chama ao amor sincero e ao cuidado na convivência. Ler essas passagens pode nos levar a perguntar como nossas atitudes acompanham nossas palavras.",
          "Se a pessoa quiser continuar, podemos caminhar por uma passagem juntos. Se preferir encerrar, podemos respeitar seu tempo e manter uma relação cuidadosa. Partilhar a fé pede presença, preparo e humildade."
        ],
        "task": "Escolha uma atitude de Romanos 12:9–18 que você deseja levar às suas conversas.",
        "sourceRefs": [
          {
            "book": "1PE",
            "chapter": 3,
            "startVerse": 15,
            "endVerse": 16,
            "label": "1 Pedro 3:15–16"
          },
          {
            "book": "ROM",
            "chapter": 12,
            "startVerse": 9,
            "endVerse": 18,
            "label": "Romanos 12:9–18"
          }
        ]
      }
    ],
    "workedExample": {
      "sourceRefs": [
        {
          "book": "1PE",
          "chapter": 3,
          "startVerse": 15,
          "endVerse": 16,
          "label": "1 Pedro 3:15–16"
        }
      ],
      "title": "Uma conversa com espaço para escutar",
      "prompt": "Alguém lhe pergunta sobre a esperança cristã. Como você pode acolher a pergunta com mansidão e responder com fidelidade?",
      "steps": [
        "Pergunte se a pessoa deseja conversar naquele momento.",
        "Ouça a pergunta e confira se a compreendeu.",
        "Ofereça uma explicação breve, ligada a uma passagem que você consiga ler com ela.",
        "Deixe espaço para novas perguntas e para a pessoa escolher continuar ou encerrar."
      ],
      "answer": "Você pode agradecer pela confiança, ouvir a dúvida e apresentar um aspecto da esperança cristã com sua passagem bíblica. Se não souber responder, reconheça isso e proponha conferir com calma. Este é um exemplo de conversa; encontros reais pedem atenção à pessoa e liberdade para perguntar."
    },
    "guidedPractice": {
      "sourceRefs": [
        {
          "book": "1PE",
          "chapter": 3,
          "startVerse": 15,
          "endVerse": 16,
          "label": "1 Pedro 3:15–16"
        }
      ],
      "prompt": "Uma pessoa lhe diz: “Tenho perguntas sobre a fé, mas não quero uma discussão”. Como você pode acolhê-la?",
      "hints": [
        "Receba com respeito o limite que ela apresentou.",
        "Pergunte o que ela gostaria de compreender.",
        "Pense em uma resposta que ofereça escuta e deixe a leitura de uma passagem como convite."
      ],
      "modelResponse": "Uma resposta possível seria: “Podemos conversar com calma. O que você gostaria de compreender? Se quiser, podemos ler uma passagem juntos”. Acolher também inclui respeitar o momento em que a pessoa prefere parar."
    },
    "activities": [
      {
        "kind": "choice",
        "id": "sharing-choice",
        "skill": "Aplicar respeito à conversa",
        "sourceRefs": [
          {
            "book": "1PE",
            "chapter": 3,
            "startVerse": 15,
            "endVerse": 16,
            "label": "1 Pedro 3:15–16"
          }
        ],
        "prompt": "Você oferece uma conversa sobre a fé, mas a pessoa prefere não falar hoje. Que atitude expressa o cuidado que acabamos de considerar?",
        "hint": "Lembre a mansidão e o respeito de 1 Pedro 3:15–16, acolhendo a liberdade da pessoa.",
        "options": [
          {
            "id": "long-message",
            "text": "Enviar imediatamente uma longa mensagem, mesmo sem ela querer continuar.",
            "feedback": "O desejo de partilhar pode ser sincero. Neste momento, porém, a pessoa pediu espaço. Podemos respeitar seu tempo e deixar uma porta aberta para outra conversa."
          },
          {
            "id": "judge",
            "text": "Usar a recusa para julgar o valor pessoal dela.",
            "feedback": "Vamos guardar a dignidade dessa pessoa. A recusa de uma conversa naquele momento não nos autoriza a humilhá-la. A mansidão continua sendo parte do caminho que lemos."
          },
          {
            "id": "respect-choice",
            "text": "Respeitar a decisão e deixar aberta, sem pressão, a possibilidade de outro momento.",
            "feedback": "Sim. O respeito preserva a liberdade e o cuidado com a pessoa. Você pode continuar se preparando e permanecer disponível, sem pressioná-la."
          }
        ],
        "correctOptionId": "respect-choice"
      },
      {
        "kind": "classify",
        "id": "sharing-classify",
        "skill": "Revisar atitudes de comunicação",
        "sourceRefs": [
          {
            "book": "1PE",
            "chapter": 3,
            "startVerse": 15,
            "endVerse": 16,
            "label": "1 Pedro 3:15–16"
          },
          {
            "book": "ROM",
            "chapter": 12,
            "startVerse": 9,
            "endVerse": 18,
            "label": "Romanos 12:9–18"
          }
        ],
        "prompt": "Vamos pensar nas atitudes que ajudam uma conversa a ser sincera e cuidadosa?",
        "hint": "Observe se há escuta, honestidade ao citar a Palavra e respeito pela história da pessoa.",
        "categories": [
          {
            "id": "careful",
            "label": "Ajuda uma conversa cuidadosa"
          },
          {
            "id": "revise",
            "label": "Precisa ser revisto"
          }
        ],
        "items": [
          {
            "id": "listen",
            "text": "Ouvir a pergunta antes de escolher a resposta.",
            "categoryId": "careful",
            "feedback": "Sim. A escuta nos ajuda a receber a pergunta real, antes de escolher as palavras da resposta.",
            "correction": "Ouvir primeiro é um gesto de cuidado. Essa atitude ajuda a compreender a pessoa e a pergunta que ela trouxe."
          },
          {
            "id": "invent-quote",
            "text": "Apresentar uma frase de memória como citação bíblica sem conferir se ela existe.",
            "categoryId": "revise",
            "feedback": "Você percebeu algo que pede cuidado. Antes de atribuir palavras à Bíblia, podemos abrir a passagem e conferi-las.",
            "correction": "Mesmo com boa intenção, uma citação precisa ser conferida. Vamos guardar esse cuidado com a Palavra e com quem está ouvindo."
          },
          {
            "id": "acknowledge",
            "text": "Reconhecer uma dúvida e combinar uma conferência antes de responder.",
            "categoryId": "careful",
            "feedback": "Sim. Reconhecer uma dúvida e voltar à fonte é uma forma de honestidade e humildade.",
            "correction": "Podemos continuar cuidando da conversa mesmo sem uma resposta imediata. Admitir a dúvida e conferir a passagem ajuda a preservar a confiança."
          },
          {
            "id": "private-story",
            "text": "Expor uma história íntima de outra pessoa para tornar o argumento mais forte.",
            "categoryId": "revise",
            "feedback": "Isso precisa ser revisto. Amar também inclui guardar a intimidade das pessoas, sem usá-la para fortalecer uma fala.",
            "correction": "Vamos proteger a história dessa pessoa. Podemos procurar uma fonte adequada e conversar sem expor sua intimidade."
          }
        ]
      },
      {
        "kind": "order",
        "id": "sharing-order",
        "skill": "Recordar um procedimento de conversa",
        "sourceRefs": [
          {
            "book": "1PE",
            "chapter": 3,
            "startVerse": 15,
            "endVerse": 16,
            "label": "1 Pedro 3:15–16"
          }
        ],
        "prompt": "Vamos lembrar o caminho de conversa que acompanhamos no exemplo?",
        "hint": "Comece acolhendo a escolha de conversar e termine deixando espaço para a outra pessoa.",
        "items": [
          {
            "id": "explain",
            "text": "Oferecer uma explicação breve com uma referência conferível."
          },
          {
            "id": "permission",
            "text": "Perguntar se a pessoa deseja conversar naquele momento."
          },
          {
            "id": "freedom",
            "text": "Deixar espaço para uma nova pergunta e para continuar ou encerrar."
          },
          {
            "id": "listen",
            "text": "Ouvir a pergunta e conferir se a compreendeu."
          }
        ],
        "correctOrder": [
          "permission",
          "listen",
          "explain",
          "freedom"
        ],
        "correctFeedback": "Você recordou o caminho proposto: acolher, ouvir, explicar e deixar espaço. Nas conversas reais, essa disposição precisa continuar sensível às pessoas e às perguntas que surgirem.",
        "incorrectFeedback": "Podemos voltar ao exemplo com calma. Primeiro a escolha de conversar; depois a escuta, a explicação com a passagem e o espaço para continuar ou encerrar. Essa organização nos ajuda a praticar o respeito."
      }
    ],
    "reflection": {
      "scripture": "Guarde 1 Pedro 3:15–16 e uma parte de Atos 17 que ajudou você a pensar nessa caminhada.",
      "observation": "O que você percebeu sobre a relação entre esperança, palavras e maneira de agir?",
      "application": "Como você gostaria de acolher uma pergunta e encerrar uma conversa com respeito, sem expor a história de ninguém?",
      "prayer": "Se desejar, ore por sabedoria, mansidão e amor. Você pode lembrar de alguém diante de Deus sem registrar sua história no aplicativo."
    },
    "recap": [
      "A esperança pode ser partilhada com convicção, mansidão e respeito.",
      "Ouvir e reconhecer uma dúvida também expressa cuidado.",
      "Nossas atitudes acompanham as palavras com que falamos da fé."
    ],
    "reviewPrompt": "Quando puder, leia Colossenses 4:5–6. Que qualidade da conversa chama sua atenção? Leve uma dessas palavras à oração e pense em como vivê-la em um encontro novo.",
    "pastoralInvitation": "A esperança cristã pode ser partilhada em encontros simples, com palavras sinceras e uma escuta atenta. Vamos ler 1 Pedro e acompanhar uma parte da fala de Paulo em Atos. A preparação nos ajuda a falar com cuidado, reconhecendo que cada pessoa tem sua história e seu tempo.",
    "closingPrayer": "Senhor Jesus, que minha maneira de ouvir e de falar também expresse amor. Dá-me clareza para partilhar a esperança, humildade para aprender e mansidão para respeitar cada pessoa. Amém."
  }
];

export function getCourseLesson(id: string): CourseLesson | undefined {
  return additionalLessons.find((lesson) => lesson.id === id);
}
