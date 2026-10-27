export type PassageReference = Readonly<{
  book: "ACT" | "LUK";
  chapter: number;
  startVerse: number;
  endVerse: number;
  label: string;
}>;

export type LessonSkill = "locate" | "observe" | "contextualize" | "verify" | "transfer";
export type LessonQuestion = Readonly<{
  id: string;
  kind: "diagnostic" | "guided" | "retrieval" | "transfer" | "delayed";
  prompt: string;
  skill: LessonSkill;
  evidenceMode: "open-book" | "without-looking";
  options: readonly Readonly<{
    id: string;
    text: string;
    explanation: string;
    sourceRefs: readonly PassageReference[];
  }>[];
  correctOptionId: string;
  hint: string;
  sourceRefs: readonly PassageReference[];
  teachingRef: string;
}>;

export type LessonLens = Readonly<{
  id: "literary" | "spatial" | "historical" | "cultural" | "biblical" | "practical";
  title: string;
  question: string;
  explanation: string;
  task: string;
  limit: string;
  sourceRefs: readonly PassageReference[];
}>;

export const firstLesson = {
  "id": "primeiros-passos",
  "version": 1,
  "title": "Vamos abrir a Palavra juntos",
  "subtitle": "Um primeiro encontro com a Bíblia, com tempo para ouvir, aprender e levar a leitura à vida.",
  "editorialStatus": "educational-pilot",
  "editorialLabel": "Piloto educacional · revisão humana especializada pendente",
  "audience": "Linguagem introdutória para jovens e adultos; menores podem explorar com acompanhamento, sem enviar respostas pessoais.",
  "estimatedMinutes": {
    "minimum": 15,
    "maximum": 20
  },
  "pacingNote": "Caminhe no seu ritmo. Você pode parar, reler e voltar quando precisar; esse tempo de escuta merece cuidado.",
  "perspective": "Uma caminhada introdutória de leitura e reflexão cristã, preparada como proposta educacional independente.",
  "objectives": [
    {
      "id": "locate",
      "statement": "Aprender a encontrar uma passagem na Bíblia.",
      "successCriterion": "Encontrar outra referência e reconhecer seu livro, capítulo e versículos, com apoio quando precisar."
    },
    {
      "id": "observe",
      "statement": "Ouvir com atenção o que a passagem nos conta.",
      "successCriterion": "Mostrar na passagem algo que leu e reconhecer uma pergunta que ainda precisa estudar."
    },
    {
      "id": "verify",
      "statement": "Guardar um ensinamento com sua passagem bíblica.",
      "successCriterion": "Explicar onde encontrou a ideia e indicar a edição e a referência da leitura."
    },
    {
      "id": "transfer",
      "statement": "Continuar esse cuidado ao abrir outra passagem.",
      "successCriterion": "Ler a conversa que acompanha uma história nova e explicar como ela ajuda a compreender o ensinamento."
    }
  ],
  "passages": {
    "main": {
      "book": "ACT",
      "chapter": 17,
      "startVerse": 10,
      "endVerse": 12,
      "label": "Atos 17:10–12"
    },
    "context": {
      "book": "ACT",
      "chapter": 17,
      "startVerse": 1,
      "endVerse": 12,
      "label": "Atos 17:1–12"
    },
    "transfer": {
      "book": "LUK",
      "chapter": 10,
      "startVerse": 25,
      "endVerse": 37,
      "label": "Lucas 10:25–37"
    }
  },
  "preparation": {
    "title": "Prepare um lugar para escutar",
    "message": "Se puder, deixe sua Bíblia aberta ao lado e um caderno por perto. Podemos ler aqui também. O importante é dar atenção à Palavra, com liberdade para perguntar, reler e fazer uma pausa.",
    "checklist": [
      "Escolha um momento em que possa ler com um pouco de tranquilidade.",
      "Deixe a Bíblia e um caderno por perto, se os tiver agora.",
      "Perceba qual edição da Bíblia está acompanhando sua leitura.",
      "Traga suas perguntas com sinceridade. Pedir ajuda faz parte desta caminhada."
    ],
    "diagnostic": {
      "id": "pp-diagnostic",
      "kind": "diagnostic",
      "skill": "verify",
      "evidenceMode": "open-book",
      "prompt": "Alguém compartilha uma explicação bíblica que lhe traz esperança. Como você pode acolhê-la e conhecer melhor a passagem?",
      "options": [
        {
          "id": "context",
          "text": "Localizar a passagem e ler o que vem antes e depois.",
          "explanation": "Podemos começar assim: abrir a passagem e ouvir também o que vem antes e depois. Essa primeira pergunta apenas acolhe seu ponto de partida; vamos aprender o caminho juntos.",
          "sourceRefs": [
            {
              "book": "ACT",
              "chapter": 17,
              "startVerse": 10,
              "endVerse": 12,
              "label": "Atos 17:10–12"
            }
          ]
        },
        {
          "id": "confidence",
          "text": "Decidir pela segurança com que a pessoa falou.",
          "explanation": "É possível receber com carinho quem nos ensina e também abrir a Bíblia para acompanhar a leitura. Vamos cuidar desses dois gestos, com respeito e amor pela Palavra.",
          "sourceRefs": [
            {
              "book": "ACT",
              "chapter": 17,
              "startVerse": 11,
              "endVerse": 11,
              "label": "Atos 17:11"
            }
          ]
        },
        {
          "id": "familiar",
          "text": "Escolher a explicação que já parece familiar.",
          "explanation": "Uma explicação conhecida pode nos tocar. Podemos então voltar à passagem e escutá-la com atenção, dando espaço ao que ela realmente nos apresenta. Esta pergunta não recebe nota.",
          "sourceRefs": [
            {
              "book": "ACT",
              "chapter": 17,
              "startVerse": 11,
              "endVerse": 11,
              "label": "Atos 17:11"
            }
          ]
        }
      ],
      "correctOptionId": "context",
      "hint": "Pense em um gesto que aproxime você da própria leitura da Palavra.",
      "sourceRefs": [
        {
          "book": "ACT",
          "chapter": 17,
          "startVerse": 10,
          "endVerse": 12,
          "label": "Atos 17:10–12"
        }
      ],
      "teachingRef": "workedExample"
    }
  },
  "context": {
    "title": "Vamos conhecer um pouco desse encontro em Bereia",
    "paragraphs": [
      "Abra Atos 17:10–12. Paulo e Silas chegam a Bereia, e o relato nos apresenta pessoas que acolhem a mensagem com boa vontade e examinam as Escrituras. Podemos nos aproximar dessa leitura com a mesma disposição de ouvir e conhecer.",
      "Ao ler, dê atenção às pessoas, aos gestos e ao que acontece em seguida. O capítulo ao redor também pode nos ajudar. Se uma pergunta permanecer, podemos guardá-la e continuar estudando com calma.",
      "O nome do livro e os números de capítulo e versículos são pequenas ajudas para encontrar o caminho na Bíblia. Aos poucos, você ganhará familiaridade com eles e poderá voltar às passagens que deseja meditar."
    ],
    "diagram": {
      "title": "Um caminho simples para acompanhar a leitura",
      "items": [
        "Abra Atos 17",
        "Leia os versículos 10–12",
        "Perceba as pessoas e seus gestos",
        "Conte com suas palavras o que leu"
      ],
      "caption": "Um apoio para este momento de estudo. Leia com calma e volte à passagem sempre que desejar.",
      "sourceRefs": [
        {
          "book": "ACT",
          "chapter": 17,
          "startVerse": 10,
          "endVerse": 12,
          "label": "Atos 17:10–12"
        }
      ]
    }
  },
  "workedExample": {
    "title": "Vamos ler essa passagem, um passo de cada vez",
    "reference": {
      "book": "ACT",
      "chapter": 17,
      "startVerse": 10,
      "endVerse": 12,
      "label": "Atos 17:10–12"
    },
    "referenceKey": [
      {
        "label": "Atos",
        "meaning": "Nome do livro"
      },
      {
        "label": "17",
        "meaning": "Capítulo"
      },
      {
        "label": "10–12",
        "meaning": "Versículos 10, 11 e 12"
      }
    ],
    "question": "Que disposição diante da mensagem você percebe no versículo 11?",
    "thinkAloud": [
      "Comece encontrando Atos no sumário da Bíblia. Depois, procure o capítulo 17 e os versículos 10 a 12.",
      "Leia os três versículos com calma, acompanhando a história por inteiro.",
      "No versículo 11, perceba como as pessoas recebem a mensagem e voltam às Escrituras.",
      "Guarde a passagem e o que conseguiu perceber. Se uma dúvida surgiu, você pode anotá-la para continuar essa conversa com alguém de confiança."
    ],
    "observation": "O relato une a boa vontade em receber a mensagem ao cuidado de examinar as Escrituras.",
    "evidence": "Você pode encontrar essas ações em Atos 17:11. Leia na sua Bíblia e perceba as palavras usadas pela edição que tem em mãos.",
    "interpretationBoundary": "Nesse pequeno trecho, não encontramos um número de minutos de estudo ou a escolha de uma tradução moderna. Podemos acolher o ensinamento com fidelidade, guardando também as perguntas que pedem outro momento de estudo.",
    "application": "Uma resposta possível para hoje é voltar à Bíblia antes de compartilhar um ensinamento e guardar sua referência. Esse cuidado nos ajuda a conversar sobre a fé com amor pela Palavra e respeito por quem está ouvindo.",
    "sourceRefs": [
      {
        "book": "ACT",
        "chapter": 17,
        "startVerse": 10,
        "endVerse": 12,
        "label": "Atos 17:10–12"
      }
    ]
  },
  "guidedPractice": {
    "title": "Agora, vamos perceber algo juntos",
    "reference": {
      "book": "ACT",
      "chapter": 17,
      "startVerse": 12,
      "endVerse": 12,
      "label": "Atos 17:12"
    },
    "prompt": "Leia Atos 17:12. Quem aparece nessa parte do relato e o que acontece? Procure as palavras na sua Bíblia, sem pressa.",
    "hints": [
      "Observe as pessoas e os grupos mencionados.",
      "Perceba o que o relato conta sobre elas, sem completar os detalhes que ele não traz.",
      "Volte ao versículo 11 para acompanhar o caminho da história."
    ],
    "modelResponse": "O relato conta que muitas pessoas creram e menciona mulheres gregas de destaque e muitos homens. Volte ao versículo para ouvir a redação da edição que está lendo; esta explicação acompanha a passagem e não toma seu lugar.",
    "selfCheck": "Você consegue mostrar na passagem o que percebeu? Se precisou de uma pista, tudo bem: guarde esse ponto e volte a ele com tranquilidade.",
    "sourceRefs": [
      {
        "book": "ACT",
        "chapter": 17,
        "startVerse": 11,
        "endVerse": 11,
        "label": "Atos 17:11"
      },
      {
        "book": "ACT",
        "chapter": 17,
        "startVerse": 12,
        "endVerse": 12,
        "label": "Atos 17:12"
      }
    ]
  },
  "lenses": [
    {
      "id": "literary",
      "title": "Literária",
      "question": "Como esta história se deixa ouvir?",
      "explanation": "Acompanhe quem participa, o que acontece e como uma parte se liga à outra. Ler com atenção pode nos ajudar a acolher a passagem inteira.",
      "task": "Encontre uma atitude do versículo 11 e mostre onde ela aparece.",
      "limit": "Aqui lemos a edição indicada no leitor. O estudo das palavras gregas pede suas próprias fontes e outro momento de aprofundamento.",
      "sourceRefs": [
        {
          "book": "ACT",
          "chapter": 17,
          "startVerse": 10,
          "endVerse": 12,
          "label": "Atos 17:10–12"
        }
      ]
    },
    {
      "id": "spatial",
      "title": "Espacial",
      "question": "Por onde essa história passa?",
      "explanation": "O começo do capítulo menciona Tessalônica, e o versículo 10 acompanha a chegada a Bereia. Perceber esses lugares nos ajuda a situar o encontro que estamos lendo.",
      "task": "Procure Bereia no versículo 10 e releia o início do capítulo para reconhecer o caminho anterior.",
      "limit": "Para falar de rotas, distâncias ou tempo de viagem, precisaremos de mapas e fontes específicos. Este apoio não substitui esse estudo.",
      "sourceRefs": [
        {
          "book": "ACT",
          "chapter": 17,
          "startVerse": 1,
          "endVerse": 12,
          "label": "Atos 17:1–12"
        },
        {
          "book": "ACT",
          "chapter": 17,
          "startVerse": 10,
          "endVerse": 10,
          "label": "Atos 17:10"
        }
      ]
    },
    {
      "id": "historical",
      "title": "Histórica",
      "question": "O que podemos conhecer a partir desta passagem?",
      "explanation": "Começamos pelo relato que temos diante de nós. Podemos perceber o que ele conta e guardar as perguntas que exigem mais estudo, com humildade e respeito pela Palavra.",
      "task": "Conte algo que você encontrou nos versículos e reconheça uma pergunta que eles não respondem.",
      "limit": "Não fixamos aqui o ano do episódio ou uma duração de estudo. Esses detalhes não são fornecidos pelos três versículos que estamos lendo.",
      "sourceRefs": [
        {
          "book": "ACT",
          "chapter": 17,
          "startVerse": 10,
          "endVerse": 12,
          "label": "Atos 17:10–12"
        }
      ]
    },
    {
      "id": "cultural",
      "title": "Cultural",
      "question": "Como evitar trazer nossa rotina inteira para a história?",
      "explanation": "A conferência nas Escrituras é mencionada na passagem. A Bíblia física, o caderno e este aplicativo são ajudas para nossa leitura de hoje; não precisamos imaginar que eram os recursos de cada pessoa naquele encontro.",
      "task": "Separe um gesto narrado no texto de um recurso que estamos usando agora para estudar.",
      "limit": "O trecho não descreve como era o exemplar de cada leitor nem todos os detalhes da reunião. Podemos deixar essas perguntas abertas até estudá-las melhor.",
      "sourceRefs": [
        {
          "book": "ACT",
          "chapter": 17,
          "startVerse": 10,
          "endVerse": 10,
          "label": "Atos 17:10"
        },
        {
          "book": "ACT",
          "chapter": 17,
          "startVerse": 11,
          "endVerse": 11,
          "label": "Atos 17:11"
        }
      ]
    },
    {
      "id": "biblical",
      "title": "Bíblica",
      "question": "Como o restante do capítulo pode nos acompanhar?",
      "explanation": "Atos 17:1–12 oferece a leitura que antecede e inclui nosso trecho. Voltar a essas palavras pode ajudar a perceber como a história caminha.",
      "task": "Explique como os versículos 10, 11 e 12 contribuem para o que você compreendeu.",
      "limit": "Ao aproximar outra passagem, precisamos lê-la com o mesmo cuidado. Uma palavra parecida, sozinha, não resolve todas as perguntas de interpretação.",
      "sourceRefs": [
        {
          "book": "ACT",
          "chapter": 17,
          "startVerse": 1,
          "endVerse": 12,
          "label": "Atos 17:1–12"
        },
        {
          "book": "ACT",
          "chapter": 17,
          "startVerse": 10,
          "endVerse": 12,
          "label": "Atos 17:10–12"
        }
      ]
    },
    {
      "id": "practical",
      "title": "Prática",
      "question": "Que passo essa leitura pode inspirar hoje?",
      "explanation": "Podemos voltar à Escritura antes de compartilhar um ensinamento, escutar com carinho e guardar nossas perguntas. Esses pequenos cuidados podem servir ao amor pela Palavra e pelas pessoas.",
      "task": "Anote a passagem e algo que percebeu, de um modo que permita abrir a Bíblia com outra pessoa.",
      "limit": "Você não precisa divulgar sua oração ou história íntima. O resultado da atividade não mede fé, santidade, salvação ou aptidão ministerial.",
      "sourceRefs": [
        {
          "book": "ACT",
          "chapter": 17,
          "startVerse": 11,
          "endVerse": 11,
          "label": "Atos 17:11"
        }
      ]
    }
  ],
  "soap": {
    "title": "Guarde a Palavra e dê espaço à oração",
    "introduction": "Se tiver um caderno, você pode guardar o que leu e o que essa leitura despertou. São convites para um momento seu; orações e anotações pessoais não são enviadas ao aplicativo.",
    "prompts": [
      {
        "id": "soap-observe",
        "dimensions": [
          "Escritura",
          "Observação"
        ],
        "prompt": "Que passagem você leu e o que percebeu nela? Anote a referência e uma palavra, atitude ou pergunta que deseja guardar."
      },
      {
        "id": "soap-apply",
        "dimensions": [
          "Aplicação"
        ],
        "prompt": "Que pequeno cuidado essa leitura pode inspirar na sua maneira de aprender ou de conversar sobre a fé? Escolha um passo possível para hoje."
      },
      {
        "id": "soap-pray",
        "dimensions": [
          "Oração"
        ],
        "prompt": "Se desejar, leve ao Senhor uma gratidão, uma dúvida ou um pedido que nasceu deste encontro com a Palavra. Você pode guardar esse momento só para você."
      }
    ]
  },
  "game": {
    "id": "detetive-do-contexto-primeiros-passos",
    "title": "Passos na Palavra",
    "description": "Vamos caminhar pela passagem em seis pequenos passos. Você pode abrir a Bíblia, pedir uma pista e tentar novamente sempre que precisar.",
    "evidenceNote": "As atividades são uma ajuda para esta leitura. Se algo pediu apoio, você pode retomar com calma e conversar sobre a passagem com alguém de confiança.",
    "missions": [
      {
        "id": "pp-mission-1",
        "kind": "guided",
        "skill": "locate",
        "evidenceMode": "open-book",
        "prompt": "Vamos encontrar Atos 17:10–12. Que parte da Bíblia essa referência nos convida a ler?",
        "options": [
          {
            "id": "range",
            "text": "O livro de Atos, capítulo 17, versículos 10 a 12.",
            "explanation": "Isso. Atos é o livro, 17 é o capítulo e 10–12 são os três versículos. Com essa pequena ajuda, você pode voltar à passagem sempre que desejar.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 10,
                "endVerse": 12,
                "label": "Atos 17:10–12"
              }
            ]
          },
          {
            "id": "chapters",
            "text": "Os capítulos 10, 11 e 12 do livro de Atos.",
            "explanation": "Vamos olhar os dois-pontos com calma. O número 17 indica o capítulo; depois dele, 10–12 nos leva aos versículos. Podemos tentar de novo juntos.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 10,
                "endVerse": 12,
                "label": "Atos 17:10–12"
              }
            ]
          },
          {
            "id": "book",
            "text": "O décimo sétimo livro da Bíblia, capítulos 10 a 12.",
            "explanation": "O nome do livro já está na referência: Atos. O número 17 nos ajuda a encontrar o capítulo dentro dele. Volte à legenda se quiser uma companhia para esse passo.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 10,
                "endVerse": 12,
                "label": "Atos 17:10–12"
              }
            ]
          }
        ],
        "correctOptionId": "range",
        "hint": "Leia em três pequenas partes: o livro, o capítulo e os versículos.",
        "sourceRefs": [
          {
            "book": "ACT",
            "chapter": 17,
            "startVerse": 10,
            "endVerse": 12,
            "label": "Atos 17:10–12"
          }
        ],
        "teachingRef": "workedExample.referenceKey"
      },
      {
        "id": "pp-mission-2",
        "kind": "guided",
        "skill": "observe",
        "evidenceMode": "open-book",
        "prompt": "Ao acompanhar a chegada a Bereia em Atos 17:10, que dupla você encontra no relato?",
        "options": [
          {
            "id": "paul-silas",
            "text": "Paulo e Silas.",
            "explanation": "Sim, Paulo e Silas aparecem nesse versículo. Conhecer as pessoas da história nos ajuda a caminhar pela leitura com atenção.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 10,
                "endVerse": 10,
                "label": "Atos 17:10"
              }
            ]
          },
          {
            "id": "peter-john",
            "text": "Pedro e João.",
            "explanation": "Pedro e João aparecem em outras passagens de Atos. Vamos voltar ao versículo 10 e conhecer a dupla mencionada nesse encontro em Bereia.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 10,
                "endVerse": 10,
                "label": "Atos 17:10"
              }
            ]
          },
          {
            "id": "not-stated",
            "text": "O trecho não identifica ninguém.",
            "explanation": "Podemos olhar novamente. O versículo 10 menciona os nomes da dupla; procure-os com calma no início da passagem.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 10,
                "endVerse": 10,
                "label": "Atos 17:10"
              }
            ]
          }
        ],
        "correctOptionId": "paul-silas",
        "hint": "Procure os nomes próprios no começo da passagem.",
        "sourceRefs": [
          {
            "book": "ACT",
            "chapter": 17,
            "startVerse": 10,
            "endVerse": 10,
            "label": "Atos 17:10"
          }
        ],
        "teachingRef": "workedExample.observation"
      },
      {
        "id": "pp-mission-3",
        "kind": "guided",
        "skill": "verify",
        "evidenceMode": "open-book",
        "prompt": "Volte comigo a Atos 17:11. Que atitude das pessoas de Bereia encontramos nessa passagem?",
        "options": [
          {
            "id": "receive-examine",
            "text": "O relato associa a recepção da mensagem à conferência nas Escrituras.",
            "explanation": "Isso. A boa vontade em receber a mensagem caminha com o cuidado de examinar as Escrituras. Podemos levar essa disposição à nossa própria leitura.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 11,
                "endVerse": 11,
                "label": "Atos 17:11"
              }
            ]
          },
          {
            "id": "never-check",
            "text": "O relato dispensa a conferência quando o mensageiro é conhecido.",
            "explanation": "Vamos ouvir de novo o versículo. O cuidado de examinar faz parte do que ele conta. Podemos acolher quem ensina e continuar voltando à Palavra com atenção.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 11,
                "endVerse": 11,
                "label": "Atos 17:11"
              }
            ]
          },
          {
            "id": "same-translation",
            "text": "O relato determina uma tradução moderna para todas as pessoas.",
            "explanation": "Essa passagem não escolhe uma tradução moderna. Aqui, podemos guardar as ações que o relato apresenta e conhecer melhor a edição que temos em mãos.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 11,
                "endVerse": 11,
                "label": "Atos 17:11"
              }
            ]
          }
        ],
        "correctOptionId": "receive-examine",
        "hint": "Observe como as pessoas recebem a mensagem e o que fazem com as Escrituras.",
        "sourceRefs": [
          {
            "book": "ACT",
            "chapter": 17,
            "startVerse": 11,
            "endVerse": 11,
            "label": "Atos 17:11"
          }
        ],
        "teachingRef": "workedExample.evidence"
      },
      {
        "id": "pp-mission-4",
        "kind": "guided",
        "skill": "contextualize",
        "evidenceMode": "open-book",
        "prompt": "Alguém lê Atos 17:10–12 e conclui que o estudo deve durar exatamente vinte minutos. O que encontramos na passagem?",
        "options": [
          {
            "id": "not-duration",
            "text": "O trecho fala de exame das Escrituras, mas não informa esse número de minutos.",
            "explanation": "Sim. O relato fala do exame das Escrituras sem fixar esse número de minutos. Nossa sugestão de tempo ajuda a organizar a aula; você pode ler, pausar e retomar com liberdade.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 10,
                "endVerse": 12,
                "label": "Atos 17:10–12"
              }
            ]
          },
          {
            "id": "duration-rule",
            "text": "A estimativa da aula prova que esse é o tempo determinado no trecho.",
            "explanation": "Vamos separar a sugestão do app das palavras da passagem. Os vinte minutos não aparecem ali. Você pode cuidar do seu ritmo e dar à leitura a atenção de que precisa.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 10,
                "endVerse": 12,
                "label": "Atos 17:10–12"
              }
            ]
          },
          {
            "id": "nothing-useful",
            "text": "Sem um número de minutos, a passagem não permite nenhuma observação.",
            "explanation": "Ainda há muito que ouvir nesse encontro: pessoas, atitudes e o que acontece em seguida. Reconhecer o que o trecho não informa nos ajuda a receber com cuidado o que ele traz.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 10,
                "endVerse": 12,
                "label": "Atos 17:10–12"
              }
            ]
          }
        ],
        "correctOptionId": "not-duration",
        "hint": "Volte aos três versículos: eles apresentam um número de minutos ou uma disposição de examinar?",
        "sourceRefs": [
          {
            "book": "ACT",
            "chapter": 17,
            "startVerse": 10,
            "endVerse": 12,
            "label": "Atos 17:10–12"
          }
        ],
        "teachingRef": "lenses.historical"
      },
      {
        "id": "pp-mission-5",
        "kind": "guided",
        "skill": "observe",
        "evidenceMode": "open-book",
        "prompt": "Como podemos ouvir os versículos 11 e 12 sem correr por cima de uma parte da história?",
        "options": [
          {
            "id": "read-sequence",
            "text": "Ler a sequência, resumir as ações e conferir o resultado mencionado.",
            "explanation": "Isso. Ler a sequência nos ajuda a acompanhar as atitudes do versículo 11 e o que é narrado no 12. Podemos contar o que lemos sem preencher as partes que a passagem não informa.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 11,
                "endVerse": 11,
                "label": "Atos 17:11"
              },
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 12,
                "endVerse": 12,
                "label": "Atos 17:12"
              }
            ]
          },
          {
            "id": "one-word",
            "text": "Escolher uma palavra do versículo 12 e ignorar o restante.",
            "explanation": "Uma palavra pode chamar nossa atenção, mas vale ouvi-la junto da passagem. Vamos voltar à sequência e acolher o que as partes dizem umas com as outras.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 10,
                "endVerse": 12,
                "label": "Atos 17:10–12"
              }
            ]
          },
          {
            "id": "invent-details",
            "text": "Completar a história com detalhes imaginados para ela parecer mais clara.",
            "explanation": "As perguntas podem nos levar a estudar mais. Ao contar essa passagem, porém, vamos guardar com fidelidade o que ela apresenta e reconhecer os detalhes que ainda não conhecemos.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 10,
                "endVerse": 12,
                "label": "Atos 17:10–12"
              }
            ]
          }
        ],
        "correctOptionId": "read-sequence",
        "hint": "Acompanhe as pessoas, o que elas fazem e o que o relato conta em seguida.",
        "sourceRefs": [
          {
            "book": "ACT",
            "chapter": 17,
            "startVerse": 10,
            "endVerse": 12,
            "label": "Atos 17:10–12"
          }
        ],
        "teachingRef": "guidedPractice"
      },
      {
        "id": "pp-mission-6",
        "kind": "guided",
        "skill": "verify",
        "evidenceMode": "open-book",
        "prompt": "Você deseja conversar com alguém sobre o que aprendeu. Que anotação ajuda essa pessoa a abrir a Bíblia com você?",
        "options": [
          {
            "id": "traceable",
            "text": "Registrar a edição, Atos 17:11 e a ação que você observou ali.",
            "explanation": "Sim. A edição, a referência e o que você percebeu permitem que outra pessoa acompanhe a leitura. Essa é uma ajuda de estudo que pode servir a uma conversa cuidadosa sobre a fé.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 11,
                "endVerse": 11,
                "label": "Atos 17:11"
              }
            ]
          },
          {
            "id": "no-reference",
            "text": "Anotar apenas que uma explicação pareceu bonita.",
            "explanation": "Uma impressão bonita pode ser guardada no coração e no caderno. Vamos acrescentar a passagem, para que outra pessoa também possa ler e conversar sobre o que você percebeu.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 11,
                "endVerse": 11,
                "label": "Atos 17:11"
              }
            ]
          },
          {
            "id": "person-only",
            "text": "Anotar somente o nome de quem apresentou a explicação.",
            "explanation": "Lembrar quem nos ensinou pode ser precioso. Podemos acrescentar também a passagem e o que lemos nela, para abrir a Bíblia juntos quando retomarmos a conversa.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 11,
                "endVerse": 11,
                "label": "Atos 17:11"
              }
            ]
          }
        ],
        "correctOptionId": "traceable",
        "hint": "Pense no que permitiria à outra pessoa encontrar a mesma passagem e acompanhar sua descoberta.",
        "sourceRefs": [
          {
            "book": "ACT",
            "chapter": 17,
            "startVerse": 11,
            "endVerse": 11,
            "label": "Atos 17:11"
          }
        ],
        "teachingRef": "workedExample.application"
      }
    ]
  },
  "retrievalQuestions": [
    {
      "id": "pp-retrieve-1",
      "kind": "retrieval",
      "skill": "locate",
      "evidenceMode": "without-looking",
      "prompt": "Antes de abrir a legenda novamente, o que você lembra dos números em Atos 17:10–12?",
      "options": [
        {
          "id": "chapter",
          "text": "O capítulo e, depois dos dois-pontos, os versículos.",
          "explanation": "Isso. Depois do livro vem o capítulo e, após os dois-pontos, os versículos. Essa pequena familiaridade pode ajudar você a voltar às leituras que deseja guardar.",
          "sourceRefs": [
            {
              "book": "ACT",
              "chapter": 17,
              "startVerse": 10,
              "endVerse": 12,
              "label": "Atos 17:10–12"
            }
          ]
        },
        {
          "id": "year",
          "text": "O ano histórico do episódio e sua duração.",
          "explanation": "Vamos retomar com calma. A referência nos leva ao lugar da leitura na Bíblia; ela não informa o ano ou a duração do episódio. A legenda continua disponível para ajudar.",
          "sourceRefs": [
            {
              "book": "ACT",
              "chapter": 17,
              "startVerse": 10,
              "endVerse": 12,
              "label": "Atos 17:10–12"
            }
          ]
        },
        {
          "id": "score",
          "text": "A dificuldade e a pontuação da passagem.",
          "explanation": "Podemos voltar à legenda. Dificuldade e pontuação não fazem parte dessa referência; ela nos ajuda a encontrar livro, capítulo e versículos.",
          "sourceRefs": [
            {
              "book": "ACT",
              "chapter": 17,
              "startVerse": 10,
              "endVerse": 12,
              "label": "Atos 17:10–12"
            }
          ]
        }
      ],
      "correctOptionId": "chapter",
      "hint": "Procure recordar o caminho: livro, capítulo e versículos. Depois você pode conferir.",
      "sourceRefs": [
        {
          "book": "ACT",
          "chapter": 17,
          "startVerse": 10,
          "endVerse": 12,
          "label": "Atos 17:10–12"
        }
      ],
      "teachingRef": "workedExample.referenceKey"
    },
    {
      "id": "pp-retrieve-2",
      "kind": "retrieval",
      "skill": "verify",
      "evidenceMode": "without-looking",
      "prompt": "Que duas atitudes de Atos 17:11 você consegue lembrar desta caminhada?",
      "options": [
        {
          "id": "receive-check",
          "text": "Receber a mensagem e conferir nas Escrituras.",
          "explanation": "Sim. Receber a mensagem e examinar as Escrituras são as atitudes que acompanhamos. Você pode explicá-las com suas próprias palavras e voltar ao versículo quando desejar.",
          "sourceRefs": [
            {
              "book": "ACT",
              "chapter": 17,
              "startVerse": 11,
              "endVerse": 11,
              "label": "Atos 17:11"
            }
          ]
        },
        {
          "id": "hear-skip",
          "text": "Ouvir e dispensar qualquer conferência.",
          "explanation": "O exame das Escrituras fez parte da leitura. Se essa parte ainda não ficou clara, podemos abrir a passagem de novo e caminhar por ela sem pressa.",
          "sourceRefs": [
            {
              "book": "ACT",
              "chapter": 17,
              "startVerse": 11,
              "endVerse": 11,
              "label": "Atos 17:11"
            }
          ]
        },
        {
          "id": "time-rank",
          "text": "Cronometrar e classificar a fé dos participantes.",
          "explanation": "Essas ações não aparecem no trecho estudado. O relato nos apresenta acolhimento e exame das Escrituras, e a nossa atividade não classifica a fé de ninguém.",
          "sourceRefs": [
            {
              "book": "ACT",
              "chapter": 17,
              "startVerse": 11,
              "endVerse": 11,
              "label": "Atos 17:11"
            }
          ]
        }
      ],
      "correctOptionId": "receive-check",
      "hint": "Pense no acolhimento da mensagem e no cuidado com as Escrituras.",
      "sourceRefs": [
        {
          "book": "ACT",
          "chapter": 17,
          "startVerse": 11,
          "endVerse": 11,
          "label": "Atos 17:11"
        }
      ],
      "teachingRef": "workedExample.evidence"
    },
    {
      "id": "pp-retrieve-3",
      "kind": "retrieval",
      "skill": "contextualize",
      "evidenceMode": "without-looking",
      "prompt": "Quando uma pergunta vai além do que encontramos na passagem, que cuidado podemos guardar?",
      "options": [
        {
          "id": "mark-limit",
          "text": "Reconhecer o que a passagem conta e distinguir disso nossas ideias, perguntas e aplicações.",
          "explanation": "Isso. Podemos guardar a pergunta com humildade e buscar mais conhecimento, distinguindo o que lemos daquilo que ainda estamos considerando. A caminhada de estudo pode continuar.",
          "sourceRefs": [
            {
              "book": "ACT",
              "chapter": 17,
              "startVerse": 10,
              "endVerse": 12,
              "label": "Atos 17:10–12"
            }
          ]
        },
        {
          "id": "fill-gap",
          "text": "Acrescentar uma ideia nossa e apresentá-la como algo que a passagem já afirma.",
          "explanation": "Uma ideia pode despertar uma pergunta importante. Vamos identificá-la como algo a estudar, sem apresentá-la como se já fosse uma informação da passagem.",
          "sourceRefs": [
            {
              "book": "ACT",
              "chapter": 17,
              "startVerse": 10,
              "endVerse": 12,
              "label": "Atos 17:10–12"
            }
          ]
        },
        {
          "id": "abandon",
          "text": "Desistir de toda a leitura, porque nenhuma conclusão é possível.",
          "explanation": "Ainda podemos acolher o que o trecho apresenta. Reconhecer uma pergunta em aberto pode ser um convite a continuar aprendendo, sem desistir da leitura.",
          "sourceRefs": [
            {
              "book": "ACT",
              "chapter": 17,
              "startVerse": 10,
              "endVerse": 12,
              "label": "Atos 17:10–12"
            }
          ]
        }
      ],
      "correctOptionId": "mark-limit",
      "hint": "Pense na diferença entre algo que você leu e uma pergunta ou aplicação que nasceu dessa leitura.",
      "sourceRefs": [
        {
          "book": "ACT",
          "chapter": 17,
          "startVerse": 10,
          "endVerse": 12,
          "label": "Atos 17:10–12"
        }
      ],
      "teachingRef": "lenses"
    }
  ],
  "transferQuestion": {
    "id": "pp-transfer",
    "kind": "transfer",
    "skill": "transfer",
    "evidenceMode": "open-book",
    "prompt": "Vamos agora acompanhar Jesus em Lucas 10:25–37. Antes de ouvir a parábola, que parte da conversa nos ajuda a compreendê-la?",
    "options": [
      {
        "id": "opening-dialogue",
        "text": "Ler as perguntas e respostas de Lucas 10:25–29 e relacioná-las à narrativa seguinte.",
        "explanation": "Sim. As perguntas e respostas de Lucas 10:25–29 preparam a história que Jesus conta. Ouvir a conversa inteira ajuda a perceber o caminho do ensinamento e o convite que chega ao final.",
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
            "startVerse": 25,
            "endVerse": 37,
            "label": "Lucas 10:25–37"
          }
        ]
      },
      {
        "id": "ignore-opening",
        "text": "Começar por uma frase isolada e dispensar o diálogo anterior.",
        "explanation": "Podemos dar um pouco mais de tempo à conversa que vem antes. As perguntas e respostas nos ajudam a ouvir por que Jesus contou essa história.",
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
            "startVerse": 25,
            "endVerse": 37,
            "label": "Lucas 10:25–37"
          }
        ]
      },
      {
        "id": "same-details",
        "text": "Supor que todos os participantes e lugares são os mesmos de Atos 17.",
        "explanation": "Estamos diante de uma passagem diferente. Podemos levar conosco o cuidado de ler, enquanto conhecemos as pessoas e a situação que Lucas nos apresenta aqui.",
        "sourceRefs": [
          {
            "book": "LUK",
            "chapter": 10,
            "startVerse": 25,
            "endVerse": 37,
            "label": "Lucas 10:25–37"
          },
          {
            "book": "ACT",
            "chapter": 17,
            "startVerse": 10,
            "endVerse": 12,
            "label": "Atos 17:10–12"
          }
        ]
      }
    ],
    "correctOptionId": "opening-dialogue",
    "hint": "Leve para esse novo texto o cuidado de ouvir também a conversa ao redor.",
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
        "startVerse": 25,
        "endVerse": 37,
        "label": "Lucas 10:25–37"
      }
    ],
    "teachingRef": "workedExample"
  },
  "review": {
    "schedule": [
      {
        "afterDays": 1,
        "title": "Volte à passagem com calma",
        "task": "Quando puder amanhã, tente recordar o caminho para encontrar uma referência e o cuidado de ouvir o trecho inteiro. Depois abra a Bíblia e veja o que deseja guardar melhor."
      },
      {
        "afterDays": 7,
        "title": "Continue a caminhada em outro texto",
        "task": "Daqui a alguns dias, escolha outra passagem e acompanhe seu começo, seu caminho e sua conclusão. Procure explicar o que leu e leve uma pergunta à oração."
      }
    ],
    "scheduleNote": "Esses dias são sugestões para ajudar a lembrar de voltar. Você pode adaptar o ritmo à sua vida; o retorno é um convite para continuar ouvindo e aprendendo.",
    "selfAssessment": [
      {
        "skill": "Encontrar a passagem",
        "withHelp": "Consigo encontrar o texto com a ajuda da legenda.",
        "independently": "Consigo encontrar outra referência e explicar suas partes."
      },
      {
        "skill": "Cuidar da leitura",
        "withHelp": "Uma pista me ajuda a perceber uma atitude do relato.",
        "independently": "Consigo mostrar onde li uma ideia e reconhecer o que ainda preciso estudar."
      },
      {
        "skill": "Continuar em outro texto",
        "withHelp": "Uma pergunta me ajuda a ouvir a conversa que acompanha outra história.",
        "independently": "Consigo explicar por que a conversa ao redor ajuda a compreender a nova passagem."
      }
    ],
    "assessmentNote": "Use essas perguntas para perceber onde deseja continuar. Uma conversa paciente com alguém que conhece a Palavra também pode ajudar; este apoio não mede sua vida com Deus.",
    "delayedQuestions": [
      {
        "id": "pp-delayed-1",
        "kind": "delayed",
        "skill": "contextualize",
        "evidenceMode": "without-looking",
        "prompt": "Ao voltar em outro dia, o que você deseja fazer quando uma explicação acrescenta algo que não encontrou na passagem?",
        "options": [
          {
            "id": "mark-limit",
            "text": "Reconhecer o que a passagem conta e distinguir disso nossas ideias, perguntas e aplicações.",
            "explanation": "Isso. Podemos guardar a pergunta com humildade e buscar mais conhecimento, distinguindo o que lemos daquilo que ainda estamos considerando. A caminhada de estudo pode continuar.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 10,
                "endVerse": 12,
                "label": "Atos 17:10–12"
              }
            ]
          },
          {
            "id": "fill-gap",
            "text": "Acrescentar uma ideia nossa e apresentá-la como algo que a passagem já afirma.",
            "explanation": "Uma ideia pode despertar uma pergunta importante. Vamos identificá-la como algo a estudar, sem apresentá-la como se já fosse uma informação da passagem.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 10,
                "endVerse": 12,
                "label": "Atos 17:10–12"
              }
            ]
          },
          {
            "id": "abandon",
            "text": "Desistir de toda a leitura, porque nenhuma conclusão é possível.",
            "explanation": "Ainda podemos acolher o que o trecho apresenta. Reconhecer uma pergunta em aberto pode ser um convite a continuar aprendendo, sem desistir da leitura.",
            "sourceRefs": [
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 10,
                "endVerse": 12,
                "label": "Atos 17:10–12"
              }
            ]
          }
        ],
        "correctOptionId": "mark-limit",
        "hint": "Pense na diferença entre algo que você leu e uma pergunta ou aplicação que nasceu dessa leitura.",
        "sourceRefs": [
          {
            "book": "ACT",
            "chapter": 17,
            "startVerse": 10,
            "endVerse": 12,
            "label": "Atos 17:10–12"
          }
        ],
        "teachingRef": "lenses"
      },
      {
        "id": "pp-delayed-2",
        "kind": "delayed",
        "skill": "transfer",
        "evidenceMode": "open-book",
        "prompt": "Ao abrir Lucas 10:25–37 novamente, que parte da conversa você leria para ouvir por que Jesus conta essa parábola?",
        "options": [
          {
            "id": "opening-dialogue",
            "text": "Ler as perguntas e respostas de Lucas 10:25–29 e relacioná-las à narrativa seguinte.",
            "explanation": "Sim. As perguntas e respostas de Lucas 10:25–29 preparam a história que Jesus conta. Ouvir a conversa inteira ajuda a perceber o caminho do ensinamento e o convite que chega ao final.",
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
                "startVerse": 25,
                "endVerse": 37,
                "label": "Lucas 10:25–37"
              }
            ]
          },
          {
            "id": "ignore-opening",
            "text": "Começar por uma frase isolada e dispensar o diálogo anterior.",
            "explanation": "Podemos dar um pouco mais de tempo à conversa que vem antes. As perguntas e respostas nos ajudam a ouvir por que Jesus contou essa história.",
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
                "startVerse": 25,
                "endVerse": 37,
                "label": "Lucas 10:25–37"
              }
            ]
          },
          {
            "id": "same-details",
            "text": "Supor que todos os participantes e lugares são os mesmos de Atos 17.",
            "explanation": "Estamos diante de uma passagem diferente. Podemos levar conosco o cuidado de ler, enquanto conhecemos as pessoas e a situação que Lucas nos apresenta aqui.",
            "sourceRefs": [
              {
                "book": "LUK",
                "chapter": 10,
                "startVerse": 25,
                "endVerse": 37,
                "label": "Lucas 10:25–37"
              },
              {
                "book": "ACT",
                "chapter": 17,
                "startVerse": 10,
                "endVerse": 12,
                "label": "Atos 17:10–12"
              }
            ]
          }
        ],
        "correctOptionId": "opening-dialogue",
        "hint": "Leve para esse novo texto o cuidado de ouvir também a conversa ao redor.",
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
            "startVerse": 25,
            "endVerse": 37,
            "label": "Lucas 10:25–37"
          }
        ],
        "teachingRef": "workedExample"
      }
    ]
  },
  "sourceNote": "Comentários e atividades autorais do projeto, baseados nos localizadores indicados. O texto bíblico deve vir da edição identificada no leitor, com seus próprios direitos e atribuição. Nenhuma tradução bíblica foi reproduzida neste arquivo.",
  "evaluationNote": "Piloto educacional. Conteúdo, adequação etária e instrumentos ainda precisam de revisão humana especializada e avaliação com estudantes antes de alegar eficácia do método.",
  "pastoralInvitation": "Você não precisa chegar sabendo tudo. Traga o que conhece, as perguntas que carrega e a disposição de ouvir. Em Bereia encontramos pessoas que acolheram a mensagem com boa vontade e voltaram às Escrituras. Esse cuidado pode nascer do amor por Deus e do desejo de conhecer melhor sua Palavra.",
  "closingPrayer": "Senhor, dá-me disposição para ouvir tua Palavra e humildade para continuar aprendendo. Guarda meu coração atento ao que leio e ensina-me a viver com amor aquilo que compreender. Em nome de Jesus, amém."
} as const;

export type FirstLesson = typeof firstLesson;
