# InJessusName

Uma plataforma educacional cristã que reúne estudo da Bíblia, formação teológica e aplicação cotidiana. A jornada parte da narrativa da criação e acompanha o desenvolvimento bíblico e a história do Cristianismo até os dias atuais, distinguindo texto bíblico, interpretação confessional e investigação histórica.

O projeto começa pelo Cristianismo, com um núcleo comum e percursos identificados para Congregação Cristã no Brasil, Catolicismo e tradições evangélicas/protestantes. É uma iniciativa independente, sem vínculo institucional oficial com essas comunidades. A conclusão de um percurso não concede cargo ou reconhecimento ministerial.

## Estado do projeto

As Etapas 1 e 2 têm uma implementação local funcional: apresentação responsiva, PWA, banco, cadastro/login de adultos e pré-entrevista com personalização salva. A interface agora usa navegação de app, fonte Inter hospedada localmente, leitor com créditos sob demanda e seis aulas introdutórias completas. A primeira mantém progresso opcional; cinco novas combinam escolha, classificação e ordenação com estado somente na sessão. Todas são pilotos com revisão humana especializada e avaliação com estudantes pendentes. Cursos completos e recursos avançados seguem no [roteiro de construção](docs/roadmap.md). Visitantes e menores têm percursos públicos; o cadastro por responsável ainda não está disponível.

A [proposta de arquitetura](docs/arquitetura-etapa-1.md) registra o modelo de dados, as fronteiras entre serviços, as regras de privacidade e as fontes pesquisadas. Ela é a referência do desenho inicial; não comprova que todos os recursos descritos já estejam implementados.

## Desenvolver neste ambiente ou em sua máquina

Este repositório pode ser desenvolvido no ambiente de nuvem do Codex e também em uma máquina local. A hospedagem pública é separada do ambiente de desenvolvimento; o usuário já confirmou acesso à versão inicial em https://in-jessus-name.vercel.app/.

Requisitos para o frontend:

- Node.js 24 e npm compatível.
- Git para versionamento.

Na raiz do repositório:

```bash
npm ci
npm run dev
```

Abra o endereço informado pelo terminal. A apresentação pública deve funcionar sem cadastro, banco remoto ou credenciais de provedores.

Os comandos de verificação do frontend são:

```bash
npm run lint
npm run typecheck
npm run build
```

O resultado de cada comando precisa ser conferido na execução atual. A presença de um comando nesta documentação não significa que ele já passou.

Os testes de navegador usam o build de produção:

```bash
npm run build
npm run test:e2e
```

O runner usa Chromium do sistema quando disponível em `/usr/bin/chromium`; em outras máquinas, instale o navegador com `npx playwright install chromium` ou informe `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. A suíte cobre navegação, teclado, celular, manifesto, ícones, reconexão automática, iframe de desenvolvimento e remoção seletiva de cache antigo.

Os testes iniciam produção na porta 3100 e desenvolvimento na 3101, com saída isolada em `.next-preview-tests`; o servidor de trabalho pode continuar na porta 3000. O desenvolvimento normal usa `.next-workspace`, separado de `.next` de produção, para builds e testes não substituírem seus arquivos durante a navegação. Para executar somente as duas regressões de desenvolvimento, use `npm run test:e2e -- --project development`.

## Recuperação de conexão e visualização em desenvolvimento

A tela de contingência representa uma falha de acesso ao aplicativo, que também pode ocorrer com internet disponível. Ela consulta o endpoint de saúde, permite tentar novamente e retorna automaticamente à página inicial quando o serviço responde.

Em desenvolvimento, a aplicação remove somente seu próprio service worker e caches `injessusname-public-*`, preservando outros caches e registros. Isso evita que uma instalação anterior de produção continue interceptando a navegação durante o desenvolvimento. Notas e IndexedDB não são apagados por essa limpeza.

O desenvolvimento permite exibição em iframe e aceita a origem local `127.0.0.1` para recursos do Next.js. Em produção, `X-Frame-Options: DENY` continua ativo. Outras origens de desenvolvimento exigem configuração explícita de `allowedDevOrigins` após conhecer o hostname; não há curinga geral configurado.

## Banco Supabase local

Para executar a infraestrutura local, é necessário Docker disponível e em funcionamento. Use os scripts do projeto na raiz:

```bash
npm run db:start
npm run db:env
npm run db:migrate
npm run db:test
```

`db:start` inicia PostgreSQL, Auth, API REST e gateway. O problema de proxy da primeira etapa foi resolvido: `local-auth-health.mjs` conserva a imagem original e seus proxies externos, substituindo somente a sonda Docker do loopback por `wget -Y off`. O BusyBox ignorava `NO_PROXY` nessa sonda; nenhuma verificação de saúde foi desativada. O ajuste usa a API local do Docker e é aplicado somente ao container Auth deste projeto.

O helper usa `SUPABASE_HOME` em `.cache/supabase` e as imagens compactas oficiais, fixadas por digest pelo CLI. Isso evita escrita no diretório pessoal protegido e o limite de armazenamento observado na imagem PostgreSQL completa. Os overrides oficiais podem ser ajustados por variáveis de ambiente, sem modificar `HOME`.

`db:env` gera `.env.local` somente depois de conferir o Auth local, com URL e chave pública; um arquivo existente é preservado. O navegador usa as rotas Next da própria aplicação: não tenta acessar o loopback do computador do visitante. A chave administrativa não entra no aplicativo.

`db:migrate` aplica migrações novas ao banco local sem apagar dados. Use esse comando na retomada normal. `db:reset` é reservado a um banco local descartável.

`db:reset` recria o banco local a partir das migrações e dos dados iniciais; esse comando apaga alterações feitas diretamente nesse banco. `db:test` executa os testes SQL disponíveis. Não use o fluxo de reset em um banco de produção.

Ao encerrar os serviços iniciados para o projeto:

```bash
npm run db:stop
```

As migrações ficam em `supabase/migrations/`, os testes em `supabase/tests/database/` e os dados iniciais em `supabase/seed.sql`. Dados cadastrais iniciais não representam um acervo de aulas, Bíblia completa ou doutrina oficial revisada.

## Configuração e credenciais

Consulte `.env.example` para conhecer as variáveis suportadas. A conexão usa:

- `NEXT_PUBLIC_SUPABASE_URL`: endereço do projeto.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: chave publicável, sujeita às políticas de acesso do banco.

A apresentação pública não exige esses valores. Não invente credenciais para preencher o arquivo. Valores locais devem ficar em `.env.local`, fora do Git; em hospedagem, devem ser configurados no painel seguro do provedor.

Chaves administrativas ou secretas do Supabase nunca podem receber o prefixo `NEXT_PUBLIC_`, entrar no frontend ou ser enviadas pelo chat. Uma chave publicável não substitui RLS e permissões corretamente testadas.

## Pré-entrevista, conta e escolhas

- `/comecar`: quatro perguntas para adultos; respostas apenas em memória até consentimento e salvamento. Menores param após a faixa etária e seguem a um percurso público, sem perguntas de denominação ou batismo.
- `/entrar`: cadastro de adulto autodeclarado e login por e-mail/senha. Sessões ficam em cookies HttpOnly; o servidor verifica a identidade antes de consultar ou gravar dados. HTTPS usa cookies Secure; HTTP de loopback é a exceção local de teste.
- `/meu-percurso`: roteiro a partir das próprias escolhas salvas; revisão da entrevista, saída e revogação real da personalização. A revogação remove respostas e mantém a conta e o histórico de consentimento.
- `/jornada/infantil`, `/jornada/ponte`, `/jornada/jovens`, `/jornada/adultos`: exploração pública sem perfil religioso salvo. Os temas são propostas; as aulas ainda estão em preparação.
- `/privacidade`: finalidade dos dados, escolhas disponíveis e limites desta etapa.
- `/biblia`: leitura de 66 livros da Bíblia Livre TR (fevereiro de 2018), licença CC BY 3.0 Brasil. Esta edição não inclui deuterocanônicos nem notas editoriais.
- `/aprender` e `/aprender/primeiros-passos`: catálogo de seis aulas; a primeira inclui quatro etapas, jogo de seis missões, recuperação e transferência, reflexão física e resumo imprimível. As respostas ficam em memória; salvar conclusão é opcional e exige conta adulta com consentimento ativo. A revogação apaga também esse progresso.

As gravações usam RPCs transacionais `SECURITY INVOKER`, sob RLS e com identidade da sessão; o cliente não escolhe `user_id`. A autorização religiosa é separada da criação da conta e pode ser retirada. Menor conhecido não pode se promover a adulto pelo salvamento. A idade inicial continua autodeclarada; não foi implementada verificação documental nem aprovação por responsável.

O callback PKCE de confirmação de e-mail está preparado, mas entrega de e-mail e confirmação em provedor remoto não foram testadas. O ambiente local usa a configuração de desenvolvimento sem confirmação por e-mail. Antes da publicação, configurar os URLs de retorno no provedor e validar o envio/retorno real.

## Colocar o aplicativo no ar

O caminho proposto é manter o código no GitHub, hospedar o Next.js na Vercel e utilizar um projeto Supabase para banco e autenticação quando esses fluxos estiverem implementados. São serviços com funções distintas:

| Serviço | Função |
| --- | --- |
| Ambiente de desenvolvimento | Construir, executar e testar o projeto. |
| GitHub | Guardar o histórico e colaborar no código. Um repositório, sozinho, não publica a aplicação Next.js. |
| Vercel | Executar e entregar a aplicação web ao público. |
| Supabase | Fornecer banco e autenticação para os recursos conectados. |

A publicação exigirá configurar os projetos e variáveis, revisar as migrações no destino correto, validar os fluxos e associar um domínio caso desejado. Não há hospedagem pública, domínio ou projeto Supabase remoto provisionado apenas por criar os arquivos deste repositório. Custos e limites dos provedores devem ser acompanhados.

## Conteúdo, privacidade e limites atuais

- Cada tradução bíblica, léxico, áudio e imagem precisa de origem e direitos próprios. Licença de software não libera automaticamente o conteúdo distribuído por ele.
- A cobertura católica de 73 livros precisa de uma fonte autorizada adequada; o catálogo oficial documentado do fetch(bible), isoladamente, não atende esse requisito.
- Documentos da CCB e orientações específicas precisam de autenticação, permissão de uso, contexto histórico e revisão antes da publicação.
- Tabelas para notas cifradas não implementam, sozinhas, criptografia ponta a ponta. O cliente, a recuperação de chaves e a sincronização ainda precisam ser construídos e validados.
- A base PWA não significa que capítulos, áudios, autenticação ou caderno funcionem integralmente offline. Esses fluxos serão implementados nas etapas apropriadas, conforme as licenças.
- Firebase, Neo4j, Redis, tutor de IA e notificações pertencem às integrações previstas no roteiro. Sua descrição arquitetural não significa integração ativa.
- Crença religiosa e dados de menores exigem proteção específica. RLS e criptografia são controles técnicos e não garantem, isoladamente, conformidade integral com a LGPD.

O projeto não utiliza a API pública `abibliadigital.com.br`.

O [inventário do acervo](docs/estado-do-acervo.md) distingue a edição e a aula em arquivos locais do catálogo editorial ainda sem aulas publicadas no Supabase. Não foram preenchidos estados de revisão humana fictícios. A [revisão pedagógica](docs/revisao-metodo-aprendizagem.md) explica as fontes e como testar compreensão, retenção e aplicação com pessoas; software funcionando não comprova eficácia do método.

O resumo PDF autoral de uma página está incluído em `public/resumos/primeiros-passos-v1.pdf`. Para regenerar com o servidor de desenvolvimento local em execução, use `node scripts/build-lesson-handout.mjs` e confira a contagem com `pdfinfo`; a fonte imprimível fica em `/aprender/primeiros-passos/resumo`. O script usa o Chromium já usado pelos testes e não acessa sessão autenticada.

O acervo bíblico inicial está incluído no repositório, com licença e fonte originais. Não é necessário baixá-lo a cada instalação. Confira sua integridade e a conversão com `node scripts/import-bible.mjs --check`; preserve a atribuição. [Fontes bíblicas](docs/fontes-biblicas.md) registra a versão e a cobertura.

## Validação executada em 21/10/2026

- `npm ci --no-fund --no-audit`: instalação reproduzida com o lockfile.
- `npm run lint`, `npm run typecheck` e `npm run build`: passaram.
- `npm run test:e2e`: 6 testes passaram, em desktop e celular; capturas foram inspecionadas.
- `npm run db:start`: núcleo PostgreSQL/REST/gateway iniciado; Auth HTTP excluído pela limitação descrita.
- `npm run db:reset`: migração e seed aplicados em banco local recriado.
- `npm run db:test`: 74 testes pgTAP passaram; fixtures sintéticas e alterações revertidas pela suíte.
- Seed executado novamente: permaneceu com 1 religião, 7 tradições e 4 trilhas em rascunho, sem duplicações.
- Requisições REST reais confirmaram o filtro do catálogo público e a ausência de perfis privados.
- Auditoria das dependências de produção: nenhuma vulnerabilidade reportada na consulta realizada.

Naquela etapa, login e criação de conta ainda não tinham sido validados. Permanecem fora da validação atual: conexão a um Supabase remoto, cliente E2EE, instalação em dispositivo físico e publicação. Nenhum conteúdo protegido foi importado e nenhum código foi enviado ao remoto por esta implementação.

Na correção posterior do aviso de offline, os 6 testes de produção passaram com a recuperação automática; os 2 novos testes de desenvolvimento passaram após corrigir a origem permitida do Next.js. A regressão instala um worker real antigo, confirma sua remoção e a preservação de caches/registros independentes. A abertura do painel de prévia no navegador do usuário depende também do endereço e do encaminhamento oferecido pela plataforma; não foi confirmada por um teste local.

## Validação da Etapa 2 em 24/10/2026

- Auth local saudável, cadastro e novo login reais por SDK; startup completo repetido com sucesso.
- `db:migrate`: migração de pré-entrevista aplicada sem reset.
- `db:test`: 145 testes passaram em dois arquivos, incluindo 71 novas verificações de consentimento, isolamento, rollback e revogação.
- Lint, tipos e build passaram.
- Os 8 cenários de fundação/desenvolvimento passaram; os 6 cenários novos de entrevista/contas passaram depois de corrigir o seletor do teste para o radio acessível, em desktop e celular.
- Fluxo real de cadastro, salvar, recarregar, revisar, revogar, sair e entrar novamente verificado; duas contas isoladas nas APIs, sem mocks de persistência.
- Cookies HttpOnly e ausência de tokens no JSON de autenticação conferidos. Nenhuma conta sintética `e2e-*` permaneceu após a suíte.
- Entrevista desktop/celular e percurso Ponte renderizados com HTTP200, sem rolagem horizontal; capturas inspecionadas.

Os testes de contas só criam fixtures em Supabase e aplicativo de loopback, removem-nas ao fim e não guardam traces com senhas/cookies. Não considerar um cenário pulado como aprovado ao executar contra outra configuração.

## Validação do primeiro bloco de estudo em 25/10/2026

- `node scripts/import-bible.mjs --check`: fonte oficial, checksum e conversão integral conferidos; 66 livros, 1.189 capítulos, 31.102 versículos.
- Lint, TypeScript e build de produção passaram.
- `npm run db:migrate`: nova migração de progresso aplicada sem reset; 187 verificações SQL passaram.
- `npm run test:e2e`: 20 cenários passaram, sem casos pulados, incluindo computador/celular, seleção de capítulo, aula inteira, dicas, correção, recuperação com passagem recolhida, transferência, consentimento e isolamento entre contas.
- Capturas da aula e do leitor inspecionadas; PDF autoral confirmado com uma página A4.
- Desenvolvimento isolado em `.next-workspace`; após corrigir conflito de saída com o build, a geração do PDF e a navegação pararam de recarregar continuamente.

Não houve avaliação com estudantes nem revisão humana especializada do conteúdo. Parte da bibliografia original ficou bloqueada pelo proxy; fontes efetivamente consultadas e referências pendentes estão identificadas na revisão pedagógica. As datas de retomada não constituem um motor de avaliação tardia. A prévia externa e a publicação pública continuam sem confirmação.

## Redesign e expansão introdutória em 27/10/2026

- Layout de app: painel inicial, navegação lateral e barra inferior no celular; biblioteca e estudos ficam ao alcance sem uma capa de marketing.
- Fonte Inter hospedada no próprio app, com licença OFL distribuída; leitura bíblica inicia em 21px e mantém ajuste de tamanho.
- Créditos completos disponíveis em diálogo ou painel expansível; edição e licença permanecem identificadas em linha compacta.
- Seis aulas utilizáveis: cinco novas com 20 cartões, cinco exemplos, cinco práticas guiadas e 15 atividades de escolha, classificação e ordenação; soma de 25 atividades avaliadas na sessão, além do diagnóstico sem nota.
- Conteúdo novo usa 83 referências verificadas; exemplos e práticas guiadas têm localizadores próprios para abrir o texto correto.
- CircleProgress adaptado da fonte oficial MIT do 21st.dev, com avisos preservados em [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Fontes dos padrões de ensino e interface em [referencias-redesign.md](docs/referencias-redesign.md).

As cinco aulas novas não simulam persistência na conta: suas respostas ficam apenas na memória da página. O modelo v1 e o salvamento da primeira aula foram preservados. A melhoria da interface e testes técnicos não substituem avaliação de aprendizagem com estudantes.

Validação desta iteração: lint, tipos, build e integridade da Bíblia passaram; 26 cenários de navegador passaram em computador, celular e desenvolvimento. A versão sem variáveis Supabase passou no build e em nove grupos de verificações reais, incluindo fonte local, seis aulas, busca, atividade com correção, leitor, créditos e indisponibilidade explícita de contas. Não houve alteração de esquema do banco. O teste de cadastro agora aguarda o pathname real, evitando confundir o parâmetro `next` com uma navegação concluída; as verificações de cookies e isolamento foram preservadas.
