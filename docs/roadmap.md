# Roteiro de construção do InJessusName

O foco inicial é exclusivamente o Cristianismo: Bíblia, teologia, história e vivência cristã, desde a narrativa da criação até os dias atuais. O conteúdo identificará sua perspectiva e distinguirá afirmações do texto bíblico, interpretações confessionais e evidências históricas.

A arquitetura de referência está em [arquitetura-etapa-1.md](arquitetura-etapa-1.md). A construção segue cinco etapas; cada entrega deve poder ser executada, revisada e testada antes de avançar para os recursos dependentes.

O [estado auditado do acervo](estado-do-acervo.md) registra as contagens reais e as funções ainda ausentes. O [plano editorial e pedagógico](plano-editorial-pedagogico.md) define a proposta de conteúdos e os critérios para aulas e jogos; seu planejamento não equivale a material já publicado.

## Etapa 1 — Fundação do aplicativo e do banco

**Estado: fundação do frontend e do banco implementada e validada localmente. Auth HTTP restaurado na Etapa 2.**

Instalação, lint, tipos e build passaram. A validação inicial executou 6 testes de navegador e 74 testes SQL, aplicou a migração em um banco local recriado e conferiu consultas REST e repetição do seed. O bloqueio da sonda Auth foi resolvido mantendo a verificação de saúde e os proxies externos; cadastro e login reais foram validados em 24/10/2026. O relatório e os limites estão no README.

Entregas previstas:

- Projeto Next.js com App Router, React, TypeScript e Tailwind, dependências fixadas e lockfile.
- Apresentação pública acolhedora e responsiva, explicando a jornada cristã e o método de estudo sem simular contas ou cursos concluídos.
- Base PWA e identificação do aplicativo, com seus limites offline documentados.
- Migrações Supabase para identidade, pré-entrevista, matriz religiosa, currículo, acervo, direitos, referências, léxico, busca vetorial e persistência de notas cifradas.
- RLS, permissões mínimas, restrições de integridade e testes de isolamento entre usuários.
- Dados iniciais cadastrais cristãos, sem importar traduções ou documentos de direitos não confirmados.

Critérios de conclusão: instalação reproduzível; verificações do frontend executadas; aplicação iniciada e verificada; migrações aplicadas em ambiente de teste; testes SQL executados com resultados registrados. Falhas e verificações não executadas devem permanecer explícitas.

A conclusão desta etapa não significa autenticação completa, aulas disponíveis, E2EE funcional ou publicação pública.

## Etapa 2 — Pré-entrevista e percurso adaptativo

**Estado: implementada e validada localmente para perfis salvos de adultos e percursos públicos por idade. Cadastro por responsável permanece pendente.**

O Auth local funciona com correção apenas da sonda loopback. Cadastro, sessão e novo login foram exercitados; não foi usado `--ignore-health-check`.

Construir a conversa inicial sobre faixa etária, vínculo eclesiástico, batismo autodeclarado e objetivo. Oferecer experiências próprias para 6–9, 10–12, 13–17 e 18+ anos, incluindo o percurso investigativo para pré-adolescentes.

Persistir somente os dados necessários, com controles adequados para crença religiosa e menores. Permitir não informar dados sensíveis e revisar as escolhas. A denominação adapta a perspectiva; não concede acesso a documentos institucionais restritos.

Critérios de conclusão: fluxos acessíveis em celular e computador; persistência e isolamento demonstrados; tratamento de erros; proteção de menores definida; ausência de dados sensíveis em URLs, analytics e logs desnecessários.

Verificados: quatro perguntas, consentimento separado, gravação atômica sob RLS, roteiro adaptado, revisão, revogação e saída; seis novos cenários de navegador passaram e a suíte SQL totaliza 145 testes aprovados. Menores recebem somente percurso público por idade, sem coletar sua crença. Ainda faltam o vínculo verificado de responsável e a verificação inicial de idade; a autodeclaração não representa validação documental. A confirmação de e-mail remota também precisa de validação no provedor de publicação.

## Etapa 3 — Leitor bíblico e ferramentas de contexto

**Estado: primeiro leitor monoversão implementado localmente. Ferramentas avançadas e outras edições permanecem pendentes.**

Disponível: Bíblia Livre TR, fevereiro de 2018, com fonte original, CC BY 3.0 Brasil, 66 livros/1.189 capítulos/31.102 versículos; seleção, destaque, navegação e atribuição. A importação offline compara checksum e conversão integral. Ver [fontes-biblicas.md](fontes-biblicas.md). Não há cobertura deuterocanônica, interlinear ou download de capítulos para uso offline nesta entrega.

Implementar leitor multiversão, gaveta teológica, referências cruzadas, seis lentes, léxico, mapas e conversor de medidas. Preservar sinais massoréticos no hebraico, direção de leitura e controle independente de fonte.

Integrar edições autorizadas e registrar sua cobertura, versificação e permissões de uso. Não presumir correspondência 1:1 entre versículos de edições diferentes. Preparar downloads offline apenas onde os direitos permitirem.

Critérios de conclusão: edição e fonte identificáveis; referências corretas; RTL e acessibilidade verificados; cache e offline testados; atribuições presentes; conteúdo sem licença confirmada excluído da importação.

## Etapa 4 — Aulas e formação cristã

**Estado: seis aulas introdutórias implementadas como pilotos educacionais; cursos completos, revisão especializada e avaliação com estudantes pendentes.**

Disponível em `/aprender/primeiros-passos`: preparação, contexto autoral, seis lentes introdutórias, exemplo e prática guiada, seis missões do Detetive do Contexto, três perguntas de recuperação e uma de aplicação em outra passagem; S.O.A.P. físico e resumo imprimível. O resultado diferencia primeira tentativa, dica/consulta e correção; não declara retenção tardia. Progresso opcional protegido por RLS e consentimento adulto, com datas sugeridas D+1/D+7. A bibliografia, as adaptações e o protocolo de avaliação estão em [revisao-metodo-aprendizagem.md](revisao-metodo-aprendizagem.md).

Implementar o Método Bereano Híbrido com preparação, contexto visual, exegese e reflexão S.O.A.P., incluindo resumo e quiz. Organizar o núcleo bíblico comum e percursos CCB, católico e evangélicos/protestantes com perspectivas explícitas.

Preservar a versão estudada de cada aula e suas fontes. Na trilha CCB, usar “Guia de Zelo Doutrinário, Bom Testemunho e Conhecimento dos Santos Serviços”; não prometer ordenação ou habilitação ministerial. Artigos, circulares e orientações precisam de fonte autenticada e autorização antes da publicação.

Critérios de conclusão: quatro passos e seis lentes presentes nas aulas completas; fontes rastreáveis; adequação etária; revisão histórica e confessional; avaliações consistentes com a versão estudada; multimídia autorizada.

## Etapa 5 — Caderno, oração, interação e tutor

**Estado: planejada.**

Construir o caderno pessoal com criptografia no dispositivo, recuperação de chaves definida e sincronização testada. Implementar memorial privado de oração, pausa de um minuto, notificações opcionais e perguntas com moderação.

Integrar Firebase somente nas responsabilidades previstas. O tutor recuperará conteúdo publicado e autorizado, indicará suas fontes e perspectiva e reconhecerá quando não houver base suficiente para responder. Notas pessoais ficam fora de seu acesso por padrão.

Critérios de conclusão: ausência de texto e chaves privadas em claro no servidor para o caderno; isolamento e recuperação testados; notificações discretas e consentidas; integração de identidade e regras Firebase verificadas; respostas do tutor sustentadas por fontes efetivamente recuperadas.

## Publicação e operação

O desenvolvimento pode ocorrer neste ambiente. Publicar exige um destino de hospedagem, configuração segura, banco autorizado, validações no destino e acompanhamento operacional. Vercel e Supabase são o caminho inicial proposto; GitHub preserva o código e seu histórico.

Antes do lançamento público, concluir o escopo escolhido para a primeira versão, revisar direitos e conteúdo, definir proteção de dados e de menores, validar segurança e acessibilidade e estabelecer processos de correção, suporte, backup e controle de custos. A publicação não está implícita na criação do projeto.

## Iteração de experiência e conteúdo — 27/10/2026

O início agora é um painel de estudo com navegação lateral ou inferior, catálogo pesquisável e acesso ao leitor. A fonte Inter é distribuída pelo próprio aplicativo; a leitura bíblica começa em 21px. Créditos identificam a edição em linha compacta e oferecem atribuição completa sob demanda. O indicador de aula adapta CircleProgress do repositório oficial MIT do 21st.dev, com avisos preservados.

Foram acrescentadas cinco aulas ao primeiro piloto: panorama bíblico, criação e cuidado, Jesus e o próximo, oração e compartilhar a fé com respeito. São 20 cartões de ensino, cinco exemplos, cinco práticas guiadas e 15 atividades variadas. Toda consulta aponta o intervalo específico pedido pelo conteúdo. Os estados de ajuda e correção são preservados ao voltar de etapa.

As novas aulas mantêm respostas somente na sessão; o progresso opcional da primeira aula e seus controles de consentimento permanecem. A eficácia com estudantes ainda precisa ser medida. Evidências, fontes e pendências estão em [referencias-redesign.md](referencias-redesign.md) e [revisao-editorial-bloco-2.md](revisao-editorial-bloco-2.md).
