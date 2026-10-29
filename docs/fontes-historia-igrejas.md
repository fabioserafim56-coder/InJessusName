# Atlas de igrejas e personalidades — recorte inicial

Pesquisa e implementação: 28 de outubro de 2026. Os textos são sínteses autorais; não foram copiadas biografias, fotografias ou documentos integrais para o aplicativo.

O acervo contém 11 trajetórias institucionais, 27 personalidades e 29 relações identificadas. Isso é um recorte para investigação, sem classificação de importância, promessa de exaustividade, endosso pessoal ou vínculo oficial. A rota pública é `/igrejas`; cada uma das 38 entidades possui uma ficha em `/igrejas/[entityId]`. Igrejas e pessoas possuem IDs distintos. Cada relação tem origem, destino, categoria, explicação e referências. A ordem dos marcos brasileiros é cronológica.

## A diferença entre as fontes

O registro estruturado de títulos, editoras, URLs, categoria e data de consulta está em `src/content/church-history/index.ts` (`historySources`). As fichas exibem suas referências em uma seção recolhível. Não há dependência de chamadas externas durante navegação ou build.

- **Memória institucional:** como a própria organização narra seu começo. Uma experiência de fé relatada pela comunidade é identificada como memória religiosa; sua inclusão não equivale a confirmação independente.
- **Documento confessional:** o que a tradição afirma sobre seu próprio ensino, sem transformar uma doutrina particular em consenso de todas as igrejas.
- **Enciclopédia colaborativa:** síntese inicial com referências bibliográficas que devem ser aprofundadas. Não é apresentada como revisão acadêmica especializada ou fonte primária.

As fontes foram efetivamente acessadas por HTTP nesta pesquisa; páginas que redirecionavam para artigos sem relação, apresentavam bloqueio ou estavam ausentes foram descartadas. O site oficial da CCB não ofereceu acesso estável; a ficha identifica a limitação e utiliza síntese enciclopédica, sem autenticar orientações institucionais atuais.

## Verificações de datas e distinções

| Trajetória | Marcos separados | Fontes principais |
| --- | --- | --- |
| Católica | Missa documentada em 1500; missão jesuíta em 1549; diocese em 1551; CNBB em 1952 | Artigos Igreja Católica no Brasil, Manuel da Nóbrega e José de Anchieta, com referências |
| Luterana / IECLB | Comunidades em 1824; Federação Sinodal em 1949; IECLB em 1968 | História da IECLB, portal institucional |
| Metodista | Primeira missão em 1836; retomada em 1867; educação em 1881; autonomia em 1930 | Metodismo no Brasil; Autonomia da Igreja Metodista, ambos oficiais; Martha Watts |
| Congregacional | Chegada dos Kalley em 1855; Igreja Fluminense em 1858; Salmos e Hinos em 1861 | Robert Reid Kalley, Sarah Poulton Kalley e Igreja Evangélica Fluminense, com referências |
| Presbiteriana / IPB | Chegada de Simonton em 1859; primeira igreja local em 1862; jornal em 1864; ordenação de Conceição em 1865 | Sobre a IPB oficial; artigos Simonton e Conceição |
| Batista / CBB | Comunidade de imigrantes em 1871; missão em português em Salvador em 1882; Convenção em 1907 | Nossa História, Convenção Batista Brasileira |
| Adventista | Organização nos EUA em 1863; missão designada em 1893; batismo de Stein em 1895; Gaspar Alto em 1896 | Nossa história oficial; História adventista no Brasil |
| CCB | Núcleos de Santo Antônio da Platina e São Paulo em 1910 | Congregação Cristã no Brasil, artigo com referências |
| Assembleias de Deus | Chegada a Belém em 1910; comunidade em 1911; Frida em 1917; Harpa Cristã em 1922 | Artigos Assembleias de Deus no Brasil, Frida Vingren e Harpa Cristã |
| Quadrangular | Angelus Temple em 1923; organização brasileira em 1951; expansão em tendas | Nossa História oficial; artigo Igreja Quadrangular |
| Universal | Pregação no coreto do Méier anterior ao primeiro espaço; culto inaugural na Abolição em 9/7/1977 | Nossa História oficial |

A data de um possível registro jurídico da CCB foi retirada: a fonte enciclopédica consultada apresentava marcos de 1928 e 1936 sem clareza documental suficiente. Não foi escolhido um deles por conveniência.

Não se chama a aula dos Kalley de primeira escola dominical absoluta do Brasil: a cronologia metodista é anterior. Não se chama a igreja de Salvador de primeira comunidade batista sem distinguir a comunidade de imigrantes de Santa Bárbara. A relação de Lutero com a IECLB e dos Wesley com o metodismo brasileiro é de tradição, e não presença pessoal no Brasil.

## Documentos confessionais consultados

- Católica: [Catecismo da Igreja Católica, §§74–100](https://www.vatican.va/archive/cathechism_po/index_new/p1s1c2_50-141_po.html), relações entre Escritura, Tradição e Magistério.
- Luterana: [Confissão de Augsburgo no Portal Luterano](https://www.luterano.org.br/confissao-de-augsburgo/), artigos IV (justificação), IX (batismo) e X (ceia).
- Presbiteriana: [Sobre a IPB](https://www.ipb.org.br/sobre-a-ipb.php) e [Manual Presbiteriano, artigo 1º da Constituição](https://www.ipb.org.br/content/Downloads/Manual-Presbiteriano-2019.pdf), Escrituras, símbolos confessionais e governo.
- Metodista: [Sermão 43 de John Wesley — O meio bíblico de salvação](https://www.metodista.org.br/content/interfaces/cms/userfiles/files/documentos-oficiais/SERMAO_43_O_MEIO_BIBLICO_DE_SALVACAO.pdf), seção I, graça e santificação.
- Batista: [Declaração Doutrinária da CBB](https://www.convencaobatista.com.br/site/pagina.php?MEN_ID=22), Escrituras, batismo, autonomia e liberdade religiosa.
- Adventista: [Nossas crenças](https://institucional.adventistas.org/pt/nossas-crencas/), com as ênfases identificadas como adventistas.
- Quadrangular: [Doutrina Quadrangular](https://quadrangular.com.br/Artigo/6843/Doutrina-Quadrangular), quatro ênfases sobre o ministério de Jesus.

As fichas distinguem Dez Mandamentos (Êxodo 20 / Deuteronômio 5), sua numeração entre tradições e normas institucionais. Não há lista de cargos ou orientações atuais inferidas de uma história genérica.

## Música, mulheres e conexões documentadas

Sarah Kalley está ligada ao congregacionalismo pelo ensino e por Salmos e Hinos (1861). Frida Vingren está ligada à missão assembleiana, à escrita e aos hinos. Charles Wesley está ligado à poesia metodista; Salomão Ginsburg, ao Cantor Cristão (1891); Paulo Leivas Macalão, à hinologia assembleiana; Padre Zezinho, à música e à catequese católicas. Nenhum trecho de letra, melodia ou gravação de terceiros foi incluído. Os nomes não autorizam uma associação institucional atual por suposição.

As duas relações de trajetória anterior — José Manuel da Conceição e Antônio Teixeira de Albuquerque com o sacerdócio católico anterior à atuação protestante — são descritas explicitamente como mudanças biográficas, sem sugerir autoridade de uma igreja sobre outra. Outras relações entre pessoas e organizações só foram adicionadas quando sustentadas pela fonte selecionada.

## Interação e validação

A rede mostra um foco por vez para manter os ramos legíveis. Cada ramo repete sua categoria nos cartões, tem explicação textual e oferece ficha completa. O usuário pode pesquisar pessoas e igrejas, filtrar tradições e tipos de relação, alternar para cronologia e abrir uma lista equivalente. Em telas estreitas os ramos se tornam uma árvore vertical com cartões; o conteúdo não depende de coordenadas de um canvas.

Nenhuma busca, escolha de tradição ou anotação é persistida em localStorage, cookies, conta ou serviço externo. As fichas completas e o índice são renderizados no servidor e podem ser lidos sem JavaScript. As interações são opcionais.

A verificação estrutural confirmou IDs e fontes únicos, referências resolvidas, extremidades válidas para todas as relações, nenhuma personalidade desconectada e marcos ordenados. A verificação de navegador confirmou seleção de Frida e Sarah, abertura de fichas e fontes, ausência de erros JavaScript e ausência de transbordamento de documento em 1440, 390 e 320px. A rede SVG ocupa o quadro inteiro; a implementação inclui seletor específico para não herdar o tamanho dos ícones da navegação.

Revisão humana historiográfica e teológica mais ampla continua recomendada antes de apresentar o acervo como referência exaustiva. A expansão deve acrescentar comunidades, fontes acadêmicas, pessoas e perspectivas documentadas, preservando essas distinções.
