# Biblioteca dos livros bíblicos

Implementação de 29 de outubro de 2026. `/biblioteca` oferece 66 guias introdutórios autorais, um para cada livro da edição protestante Bíblia Livre TR2018. Cada rota `/biblioteca/[bookId]` usa o identificador do corpus, de `GEN` a `REV`.

Cada guia tem dois parágrafos específicos sobre o conteúdo e sua leitura, gênero literário, três temas, conexão com a narrativa maior, exemplo cotidiano, pergunta de recuperação com explicação e duas passagens conferíveis. O conjunto contém 132 intervalos de leitura e mais de 7.700 palavras somente nos parágrafos introdutórios. Perguntas, exemplos e notas são conteúdo adicional, não repetição de um modelo genérico.

As citações são recuperadas de `getBibleChapter`, sem alterar a redação ou enviar o corpus inteiro ao navegador. Os guias são comentários editoriais, apresentados separadamente da tradução. A edição e seus autores são atribuídos junto às citações. O índice inclui metadados mínimos para filtro local por nome, tema e testamento, mantendo todos os links no HTML; sem JavaScript, é possível abrir qualquer guia, seus trechos e explicações nativas.

As conexões abrem a etapa pertinente do mapa de 24 encontros. A navegação entre livros corresponde à ordem canônica desta edição e não pretende datar a composição dos textos. Não são atribuídos autores ou datas de composição sem estudo especializado suficiente. Os livros adicionais de cânones católico e ortodoxos não integram a tradução atualmente disponível, e essa limitação é explicitada.

Fontes primárias: os próprios livros bíblicos e as passagens identificadas em cada guia, na Bíblia Livre TR 2018 (Diego Santos, Mario Sérgio e Marco Teles, CC BY 3.0 Brasil). As sínteses e exemplos são autorais, não transcrições de comentários protegidos. Não se apresenta a coleção como formação teológica completa ou comentário exaustivo de todos os capítulos. Revisão humana especializada de teologia, história e linguagem permanece necessária antes de afirmar validação acadêmica ou catequese institucional.

Validações automatizadas em `tests/unit/book-guides.test.mjs` conferem cobertura exata dos 66 livros, 132 intervalos reais e fidelidade do texto recuperado. A interface mantém links para o capítulo inteiro para que o aluno possa ler contexto e conferir cada síntese.
