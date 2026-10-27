# Referências e decisões do redesign

Consulta: 26 de outubro de 2026. Objetivo: transformar a área de estudo em uma experiência de aplicativo, melhorar leitura e criar atividades que façam a pessoa observar, explicar e praticar. Esta revisão de produtos e fontes não é uma avaliação de aprendizagem com estudantes.

## 21st.dev: componente concreto, origem e licença

O catálogo web `https://21st.dev` retornou HTTP 403 pela política de rede deste ambiente. A tentativa com permissão adicional permaneceu pendente e foi abortada. Não foi usada uma API autenticada, uma chave fictícia nem um serviço que contornasse esse bloqueio.

A fonte acessível foi o **repositório oficial do próprio 21st.dev**, [serafimcloud/21st](https://github.com/serafimcloud/21st). Seu README identifica o projeto como a comunidade de componentes React do 21st.dev. Foi consultado no commit fixo `b96d84dcf748d5e56f2f72f2bab9a4f7f33574cf`.

Componente selecionado: [`apps/web/components/ui/circle-progress.tsx`](https://github.com/serafimcloud/21st/blob/b96d84dcf748d5e56f2f72f2bab9a4f7f33574cf/apps/web/components/ui/circle-progress.tsx). O original usa duas circunferências SVG e deslocamento proporcional do traço para representar progresso. É adequado a uma aula ou sessão com quantidade conhecida de etapas. A adaptação deve limitar o valor ao intervalo válido, oferecer um nome e valor acessíveis ou texto equivalente, respeitar redução de movimento e exibir somente progresso efetivamente realizado.

Licença verificada: [MIT — Copyright (c) 2024 21st.dev](https://github.com/serafimcloud/21st/blob/b96d84dcf748d5e56f2f72f2bab9a4f7f33574cf/LICENSE). Ela permite usar e modificar o código, preservando o aviso de copyright e o texto da permissão nas cópias ou porções substanciais. A integração do aplicativo deve registrar esse aviso em `THIRD_PARTY_NOTICES.md` e apontar a fonte na adaptação. A licença deste repositório não deve ser presumida para qualquer componente enviado por terceiros ao catálogo.

Também foram lidos `components/ui/progress.tsx`, `card.tsx` e o início de `sidebar.tsx` do mesmo repositório. Eles serviram à análise de composição. O sidebar original exige uma cadeia de componentes e persiste preferências em cookie; importar esse conjunto inteiro não é necessário para uma navegação própria simples. O componente circular pode ser adaptado sem adicionar Radix, SDK, acesso remoto ou dependências de animação.

## Aplicativos e sistemas de ensino consultados

Os documentos abaixo foram recuperados de repositórios oficiais. As cópias obtidas da branch foram comparadas com o mesmo arquivo no SHA indicado; coincidiram byte a byte. Não foram copiados mascotes, identidade visual, conteúdo didático, exercícios ou dados de estudantes desses produtos.

| Referência consultada | Evidência disponível | Princípio útil para o InJessusName | Limite da adaptação |
| --- | --- | --- | --- |
| [Khan Academy — Perseus](https://github.com/Khan/perseus/blob/bd2787193093078624ac983fa37b38b225f92315/README.md) | O README descreve o sistema oficial de exercícios que apresenta um problema, permite interação e avalia o trabalho do estudante | Cada atividade tem uma tarefa observável, uma resposta e feedback ligados ao objetivo; leitura e vídeo não são o único modo de participação | O código do renderizador não foi integrado. Exercícios de matemática não validam automaticamente avaliações de interpretação bíblica |
| [Anki — Studying](https://github.com/ankitects/anki-manual/blob/91f7485236db2a89d2a8abaed618976caf971de2/src/studying.md) | O manual distingue itens novos, em aprendizagem e para revisão; mostra a pergunta primeiro, depois permite revelar e comparar a resposta | Dar uma oportunidade real de recordar antes de mostrar resposta ou alternativas; tornar retorno e retomada compreensíveis | Autoavaliação não substitui uma justificativa conferida. Não foram copiados os intervalos, algoritmo, porcentagens esperadas ou regras de tempo do Anki |
| [Duolingo — Half-Life Regression](https://github.com/duolingo/halflife-regression/blob/0041df0dcd436bf1b4aa7a17a020d9c670db70d8/README.md) | A fonte oficial descreve pesquisa e código de um modelo de repetição espaçada para aquisição de idiomas, baseado no histórico de prática | Considerar histórico e ajuda ao organizar retomadas; separar lembrar de reconhecer uma resposta recém-exibida | Não foi incorporado o modelo HLR, seu dataset ou um multiplicador de eficácia. Um resultado de vocabulário não demonstra aprendizagem teológica. A página de blog tentada retornou 403 e não serviu como fonte |
| [Learning Equality — Kolibri](https://github.com/learningequality/kolibri/blob/f72936bd41e59f1300fde4f5810509e601ecd30d/README.md) | O projeto oficial se descreve como plataforma de ensino e aprendizagem com prioridade a uso sem Internet | Manter conteúdo e atividades essenciais leves; distinguir recursos disponíveis de funções que exigem conexão | Consultar essa referência não significa que capítulos, aulas ou progresso do InJessusName já funcionem integralmente offline |

Brilliant, YouVersion e Readwise podem orientar uma comparação futura, mas não são declarados fontes consultadas nesta entrega. A seleção atual usa fontes verificáveis de sistemas com funções diferentes: exercícios interativos, revisão de memória, personalização da prática e acesso com conectividade limitada.

## Decisões para o produto

1. **Leitura como prioridade:** corpo em fonte sem serifa, contraste suficiente, peso regular legível, entrelinha confortável e largura limitada. O ponto inicial proposto é 17–18 px no texto de estudo e entrelinha próxima de 1,6; isso é uma decisão de design a testar em telas e com leitores, não um tamanho universal cientificamente ideal. As opções de aumentar texto do leitor continuam úteis.
2. **Navegação de aplicativo:** áreas estáveis para estudar, Bíblia e percurso, com navegação lateral no computador e inferior no celular; estado atual identificado e alvos de toque amplos. Uma tela inicial deve encaminhar à próxima ação de estudo, em vez de depender de uma capa de marketing extensa.
3. **Uma ação por vez:** apresentar uma pergunta ou operação curta, permitir tentar e depois explicar. Alternar localização, ordenação, relação entre ideias, observação e aplicação conforme a habilidade; variar a forma apenas quando ela ajuda o objetivo.
4. **Apoio progressivo:** exemplo breve antes da tarefa quando necessário; dica por solicitação; feedback específico ao erro; chance de corrigir. Acerto após dica ou eliminação de alternativas precisa continuar separado de primeira tentativa.
5. **Recuperação e aplicação:** recolher texto e respostas antes da tentativa de lembrar; permitir consulta identificada; usar uma passagem nova para aplicar o procedimento. O app deve tratar os resultados de múltipla escolha como reconhecimento, sem anunciar compreensão profunda ou retenção tardia somente por eles.
6. **Créditos presentes e proporcionais:** uma linha visível identifica edição e licença; um controle “Fontes e direitos” abre autores, versão, origem e texto de atribuição completo. A fonte permanece ao alcance da atividade sem repetir um bloco longo antes de cada pergunta. Esta é uma decisão de apresentação; direitos de cada obra continuam independentes.
7. **Conteúdo utilizável:** cada aula nova precisa de objetivo, passagem, explicação, prática e comentário de resposta. Cartões com nomes de temas não são contados como aulas completas. Autoria por software não substitui revisão bíblica, histórica, linguística e pedagógica por pessoas qualificadas.
8. **Motivação sem julgamento:** progresso informa caminho percorrido; não classifica fé, santidade, salvação ou aptidão ministerial. Não são necessários vidas, punição por faltar, competição pública ou pressão para estudar mais rápido.

## Como conferir se melhorou

Os testes técnicos verificam navegação, teclado, texto ampliado, ausência de rolagem horizontal, tratamento de erros e funcionamento das atividades. A comparação com a versão anterior deve incluir capturas reais e observação em celular.

A eficácia de ensino exige o protocolo de [revisao-metodo-aprendizagem.md](revisao-metodo-aprendizagem.md): tarefas inéditas, justificativas, ajuda separada do acerto inicial e retorno em outro dia. Uma interface mais bonita, mais aulas ou o uso de um componente do 21st.dev não comprovam, por si, aprendizagem superior.
