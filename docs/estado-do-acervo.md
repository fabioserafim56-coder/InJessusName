# Estado real do acervo — 29 de outubro de 2026

Inventário da entrega local. Conteúdo disponível em arquivos versionáveis é contado separadamente do catálogo editorial do Supabase; fontes e exercícios não são anunciados como revisados por pessoas quando essa revisão ainda não aconteceu.

## Disponível no aplicativo

| Entrega | Quantidade e localização |
| --- | --- |
| Edição bíblica portuguesa integral | 1: Bíblia Livre TR, fevereiro de 2018, CC BY 3.0 Brasil; 66 livros, 1.189 capítulos, 31.102 versículos |
| Leitor funcional | `/biblia`: seleção, navegação, destaque, tamanho de texto, referência e atribuição |
| Busca em toda a edição | 31.102 versículos pesquisáveis por palavras, termos combinados e expressões; paginação, acentos e links ao contexto; 52 temas editoriais com 157 leituras, separados dos resultados literais |
| Mapa de panorama bíblico | 24 etapas conectadas em `/percurso/[stageId]`:72 explicações,72 exemplos,72 referências e24 práticas com feedback; `/meu-percurso` funciona sem conta |
| Guias dos livros | `/biblioteca`:66 guias introdutórios específicos da edição, cada um com gênero, temas, explicações, conexão, exemplo, pergunta explicada e 2 leituras conferíveis |
| Histórias ilustradas | 12 histórias em 48 cenas, 12 artes originais contextuais, referências, contexto, exemplos e reflexão; navegação por toque/teclado e fallback sem JavaScript |
| Igrejas e personalidades | 11 trajetórias, 27 pessoas e 29 relações documentadas; 38 fichas com origem, chegada ao Brasil, linha do tempo, perspectiva confessional e fontes recolhíveis |
| Ponte histórica | 12 marcos das primeiras comunidades aos séculos XX–XXI, com 19 fontes identificadas; Bíblia, pesquisa histórica, documentos e memória institucional separados |
| Versículo do dia | Rotação de 55 leituras contextualizadas pelo calendário de Brasília; texto exato desta edição, renovação diária no servidor e na página aberta,sem reprodução automática |
| Aulas autorais utilizáveis | 6 pilotos: primeiros passos, panorama bíblico, criação e cuidado, Jesus e o próximo, oração e compartilhar a fé com respeito |
| Atividades pedagógicas | Detetive do Contexto, perguntas de recuperação e transferência; mais 15 atividades de escolha, classificação e ordenação nas cinco novas aulas |
| Atividades avaliadas na sessão | 25 unidades: dez da primeira aula e 15 das novas; o diagnóstico inicial fica fora do resultado. Classificações incluem 20 itens no bloco novo |
| Museu da história bíblica | 4 peças com fotografias históricas locais de uma edição de 1917: Merneptah, Mesa, Obelisco Negro e Roseta; galeria, linha do tempo, filtros, busca, ampliação e ligações ao leitor |
| Acolhimento por áudio | 1 mensagem autoral de ~25s em português, gerada com Kokoro/pm_alex do Hugging Face; player opcional, transcrição e identificação sintética |
| Modo livro da Bíblia | Capítulo integral com capa e folhas físicas, medição por fonte/tela, teclado, movimento reduzido e leitor simples completo |
| Resumo para o caderno | 1 PDF autoral de página única para download e fonte imprimível |
| Progresso opcional | Primeira aula: conclusão, tentativas, ajuda e datas D+1/D+7 na conta adulta com consentimento ativo. Novas cinco aulas: estado apenas na sessão, sem simular salvamento |

Os marcos das 24 etapas são distintos do progresso opcional da primeira aula: correspondem a uma resposta correta conferida nesta visita e ficam somente em memória, inclusive durante a navegação. Não sincronizam com a conta; recarregar ou fechar o aplicativo limpa esses marcos. Respostas individuais não são guardadas. O mapa permite estudar em qualquer ordem.

O conteúdo novo é um panorama e um conjunto de guias autorais, não um comentário de todos os versículos nem uma formação teológica completa. O texto bíblico é consultado diretamente da fonte local intacta; exemplos e paráfrases editoriais são identificados separadamente. Revisão humana especializada e avaliação de aprendizagem com estudantes continuam pendentes. A história das igrejas é um recorte representativo, com tipos de fonte visíveis; não é cadastro universal de igrejas ou líderes atuais.

A fonte integral, autoria, licença, versão, checksum e transformação estão em [fontes-biblicas.md](fontes-biblicas.md). O leitor usa dados locais no servidor e entrega apenas o capítulo solicitado; não exige chamada a uma API bíblica externa para cada leitura. O arquivo VPL original não contém notas da tradução. Essa edição de 66 livros não atende, sozinha, à cobertura católica de 73 livros. Os autores descrevem a tradução como trabalho em andamento.

A primeira aula contém quatro etapas, seis lentes introdutórias, exemplo resolvido, prática guiada, feedback, recuperação com texto e alternativas inicialmente recolhidos, aplicação em Lucas 10 e três propostas S.O.A.P. para o caderno físico. Os indicadores separam primeira tentativa, ajuda e correção. **Ainda não existe um motor de avaliação tardia:** as datas e tarefas de retorno são sugestões; questões de revisão em arquivo não equivalem a revisões executadas com estudantes.

As cinco aulas adicionais têm 20 cartões curtos, cinco exemplos resolvidos, cinco práticas guiadas e três formatos de atividade por aula. As consultas abrem os intervalos específicos do exemplo e do exercício. Referências e limites estão em [revisao-editorial-bloco-2.md](revisao-editorial-bloco-2.md).

A interface usa fonte Inter hospedada no próprio app, navegação lateral/inferior e créditos completos sob demanda. A adaptação de CircleProgress do 21st.dev tem fonte e licença MIT preservadas em `THIRD_PARTY_NOTICES.md`; a comparação com sistemas de ensino está em [referencias-redesign.md](referencias-redesign.md).

Os seis estudos agora usam acolhimento específico para cada passagem, explicações próximas, reflexão e oração opcional. O caminho visível é ouvir, compreender, conversar e viver. Resultados de atividades ficam recolhidos em “Meu caminho neste estudo”; não há formulário nem envio de oração. As práticas de aprendizagem e o contrato de progresso da primeira aula foram preservados. [voz-pastoral.md](voz-pastoral.md) registra a revisão.

O museu usa quatro fotografias históricas reais sem retoques, com identificação de 1917, dimensões, SHA-256 e domínio público delimitado ao Brasil/EUA. São reproduções pequenas de um exemplar antigo, não fotografias atuais em alta resolução. [fontes-museu.md](fontes-museu.md) documenta a cadeia de aquisição, créditos e o que foi efetivamente consultado. As fichas distinguem observação, contexto, conexão bíblica e limites da pesquisa.

PhotoSwipe 5.4.4 abre as fotografias; Fuse.js 7.5.0 faz busca aproximada local no museu e nos estudos. A busca bíblica é um índice próprio no servidor, com recuperação dos versículos originais. As licenças originais acompanham a distribuição. O modelo Kokoro foi usado de fato para gerar a mensagem fixa; seus pesos não são distribuídos ao navegador. A pesquisa anterior de ferramentas é datada, e a integração posterior está em [ferramentas-visuais-abertas.md](ferramentas-visuais-abertas.md).

## O que ainda não compõe um curso publicado

Consultas ao banco nesta entrega confirmaram zero registros em `text_editions`, `edition_units`, `courses`, `modules`, `lessons`, `quizzes`, `quiz_questions`, `lexicon_entries`, `cross_references` e versões editoriais publicadas. Isso não contradiz o bloco acima: a edição e as seis aulas piloto são arquivos locais identificados, e a persistência usa `pilot_study_progress`. Não foram criados registros artificiais de revisão humana nem contornadas as exigências editoriais para conteúdo publicado no catálogo.

O seed mantém metadados cristãos, sete tradições e quatro trilhas em rascunho. Os roteiros por idade/objetivo continuam propostas de temas. Ainda faltam cursos completos de teologia, evangelismo, história do Cristianismo e formação confessional; novas edições, deuterocanônicos, línguas originais, léxico, mapas históricos, conversor e referências cruzadas. Vídeos licenciados e reprodução de documentos institucionais também permanecem pendentes.

## O que os testes demonstram

Lint, tipos, build, integridade da conversão bíblica e testes técnicos verificam execução, referências, interação, cálculo do resultado, consentimento e isolamento. Eles não certificam exatidão teológica, adequação infantil ou eficácia de aprendizagem.

As aulas estão identificadas como **pilotos educacionais com revisão humana especializada pendente**. Não houve piloto com estudantes. [revisao-metodo-aprendizagem.md](revisao-metodo-aprendizagem.md) documenta a análise das práticas, fontes consultadas e pendentes, limites e protocolo para medir aprendizagem antes de alegar eficácia. A revisão editorial ainda necessária está em [revisao-editorial-primeira-aula.md](revisao-editorial-primeira-aula.md).

## Visualização e publicação

O aplicativo público está em https://in-jessus-name.vercel.app/. As publicações partem da branch `main` do repositório conectado à Vercel; a conclusão de cada publicação precisa ser confirmada no endereço externo separadamente dos testes locais e do envio do código. A renovação anterior foi conferida no endereço público; a nova ampliação requer sua própria conferência após o envio.


## Renovação visual de 28/10/2026

Artes originais e capas editoriais, percurso Embla, Motion em etapas, ícones Phosphor, StPageFlip e celebração opcional foram integrados. São recursos de experiência; não ampliam por si o número de aulas nem demonstram eficácia de aprendizagem. A narração fixa é uma primeira integração real de geração com modelo do Hugging Face, sem tutor generativo ou Bíblia inteira narrada. [Proveniência e ferramentas](ferramentas-visuais-abertas.md).
