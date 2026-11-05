# Aprender com a Palavra, sem depender de saldo de IA

A proposta desta versão é ligar **passagem → contexto → observação visual → prática com explicação → retorno à Bíblia**. O aluno sabe por que começa por uma leitura, participa, recebe orientação específica quando erra e pode conferir a fonte. A pontuação de uma atividade descreve o exercício; não mede fé, santidade ou valor pessoal. Casamento, filhos, batismo e escolhas de igreja não são recompensas obrigatórias por desempenho.

## O que está implementado

- Estudo e Bíblia usam um ambiente próprio em tela ampla; ferramentas ficam disponíveis sem duas barras laterais permanentes.
- Histórias ilustradas usam quatro cenas, observação, contexto, consulta à passagem e reconstrução da sequência. As imagens são interpretações identificadas, nunca prova de um acontecimento ou fotografia antiga.
- Três jogos têm mecânicas distintas, feedback, possibilidade de tentar novamente e fontes bíblicas: sequência do samaritano, conexões entre leituras e investigação de João 6.
- O museu encontra trechos das fichas localmente com Fuse.js. Não inventa uma resposta quando não encontra documentação. Análise visual generativa é uma opção separada.
- Bíblia, texto dos estudos, jogos, imagens e áudio já distribuído funcionam sem chamada paga de IA. Whisper, E5 e Tesseract executam no dispositivo após preparação explícita; os dois primeiros exigem downloads substanciais e não são adequados a todos os aparelhos.
- As APIs comerciais de visão exigem `INJESSUS_ENABLE_PAID_VISION=1`, provedor e chave privada. O padrão é desligado. Uma chave cadastrada sozinha não gera chamadas.

## O que sustenta a diferença do produto

O trabalho próprio está na curadoria conectada, no percurso pedagógico, nas interações e na ligação entre exercícios e fontes. As bibliotecas são abertas e creditadas; não são tecnologia exclusiva. A experiência precisa ser avaliada com alunos antes de se afirmar que ensina melhor que alternativas.

O próximo ciclo de avaliação deve acompanhar: capacidade de explicar a passagem com as próprias palavras, compreensão do contexto, retenção após alguns dias, conclusão sem ajuda e motivos de abandono. Sessões voluntárias com leitores iniciantes, idosos e pessoas que usam recursos de acessibilidade devem orientar as próximas alterações. Não há estudo de eficácia concluído nesta versão.

## Como crescer sem cobrança por token a cada aluno

Conteúdo editorial e mídia podem ser produzidos e revisados uma vez, versionados e distribuídos por cache/CDN. Gravação humana autorizada em PT-BR pode seguir o mesmo caminho: um arquivo reutilizável, sem gerar nova fala por ouvinte. Consulte [voz-humana.md](voz-humana.md); a narração disponível hoje é sintética.

Isso **não significa hospedagem ilimitada gratuita**. Milhões de acessos exigem medir banda, cache de imagens, banco de progresso, autenticação e limites do plano de hospedagem. Antes dessa escala, é necessário testar carga, definir orçamento e limites operacionais, além de revisar a capacidade de cada serviço. Não se deve ativar um endpoint pago aberto ao público sem controle de uso e orçamento do provedor.

## Revisão antes de ampliar o acervo

A edição da Bíblia permanece intacta. A validação automatizada verifica referências, integridade e relações do conteúdo; não substitui revisão teológica, histórica, pastoral e de acessibilidade por pessoas qualificadas. Consulte [revisao-conteudo.md](revisao-conteudo.md) para o alcance real da conferência.
