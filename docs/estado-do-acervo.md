# Estado real do acervo — 27 de outubro de 2026

Inventário da entrega local. Conteúdo disponível em arquivos versionáveis é contado separadamente do catálogo editorial do Supabase; fontes e exercícios não são anunciados como revisados por pessoas quando essa revisão ainda não aconteceu.

## Disponível no aplicativo

| Entrega | Quantidade e localização |
| --- | --- |
| Edição bíblica portuguesa integral | 1: Bíblia Livre TR, fevereiro de 2018, CC BY 3.0 Brasil; 66 livros, 1.189 capítulos, 31.102 versículos |
| Leitor funcional | `/biblia`: seleção, navegação, destaque, tamanho de texto, referência e atribuição |
| Aulas autorais utilizáveis | 6 pilotos: primeiros passos, panorama bíblico, criação e cuidado, Jesus e o próximo, oração e compartilhar a fé com respeito |
| Atividades pedagógicas | Detetive do Contexto, perguntas de recuperação e transferência; mais 15 atividades de escolha, classificação e ordenação nas cinco novas aulas |
| Atividades avaliadas na sessão | 25 unidades: dez da primeira aula e 15 das novas; o diagnóstico inicial fica fora do resultado. Classificações incluem 20 itens no bloco novo |
| Resumo para o caderno | 1 PDF autoral de página única para download e fonte imprimível |
| Progresso opcional | Primeira aula: conclusão, tentativas, ajuda e datas D+1/D+7 na conta adulta com consentimento ativo. Novas cinco aulas: estado apenas na sessão, sem simular salvamento |

A fonte integral, autoria, licença, versão, checksum e transformação estão em [fontes-biblicas.md](fontes-biblicas.md). O leitor usa dados locais no servidor e entrega apenas o capítulo solicitado; não exige chamada a uma API bíblica externa para cada leitura. O arquivo VPL original não contém notas da tradução. Essa edição de 66 livros não atende, sozinha, à cobertura católica de 73 livros. Os autores descrevem a tradução como trabalho em andamento.

A primeira aula contém quatro etapas, seis lentes introdutórias, exemplo resolvido, prática guiada, feedback, recuperação com texto e alternativas inicialmente recolhidos, aplicação em Lucas 10 e três propostas S.O.A.P. para o caderno físico. Os indicadores separam primeira tentativa, ajuda e correção. **Ainda não existe um motor de avaliação tardia:** as datas e tarefas de retorno são sugestões; questões de revisão em arquivo não equivalem a revisões executadas com estudantes.

As cinco aulas adicionais têm 20 cartões curtos, cinco exemplos resolvidos, cinco práticas guiadas e três formatos de atividade por aula. As consultas abrem os intervalos específicos do exemplo e do exercício. Referências e limites estão em [revisao-editorial-bloco-2.md](revisao-editorial-bloco-2.md).

A interface usa fonte Inter hospedada no próprio app, navegação lateral/inferior e créditos completos sob demanda. A adaptação de CircleProgress do 21st.dev tem fonte e licença MIT preservadas em `THIRD_PARTY_NOTICES.md`; a comparação com sistemas de ensino está em [referencias-redesign.md](referencias-redesign.md).

## O que ainda não compõe um curso publicado

Consultas ao banco nesta entrega confirmaram zero registros em `text_editions`, `edition_units`, `courses`, `modules`, `lessons`, `quizzes`, `quiz_questions`, `lexicon_entries`, `cross_references` e versões editoriais publicadas. Isso não contradiz o bloco acima: a edição e as seis aulas piloto são arquivos locais identificados, e a persistência usa `pilot_study_progress`. Não foram criados registros artificiais de revisão humana nem contornadas as exigências editoriais para conteúdo publicado no catálogo.

O seed mantém metadados cristãos, sete tradições e quatro trilhas em rascunho. Os roteiros por idade/objetivo continuam propostas de temas. Ainda faltam cursos completos de teologia, evangelismo, história do Cristianismo e formação confessional; novas edições, deuterocanônicos, línguas originais, léxico, mapas históricos, conversor e referências cruzadas. Vídeos licenciados e reprodução de documentos institucionais também permanecem pendentes.

## O que os testes demonstram

Lint, tipos, build, integridade da conversão bíblica e testes técnicos verificam execução, referências, interação, cálculo do resultado, consentimento e isolamento. Eles não certificam exatidão teológica, adequação infantil ou eficácia de aprendizagem.

As aulas estão identificadas como **pilotos educacionais com revisão humana especializada pendente**. Não houve piloto com estudantes. [revisao-metodo-aprendizagem.md](revisao-metodo-aprendizagem.md) documenta a análise das práticas, fontes consultadas e pendentes, limites e protocolo para medir aprendizagem antes de alegar eficácia. A revisão editorial ainda necessária está em [revisao-editorial-primeira-aula.md](revisao-editorial-primeira-aula.md).

## Visualização e publicação

O código inicial foi enviado ao GitHub e o usuário confirmou acesso à hospedagem em https://in-jessus-name.vercel.app/. As publicações partem da branch `main` do repositório conectado à Vercel; a conclusão da publicação externa precisa ser confirmada separadamente do envio do código. A consulta HTTP externa dessa hospedagem foi bloqueada pelo proxy do ambiente; testes locais e arquivos PNG não substituem a verificação da nova publicação no endereço externo.
