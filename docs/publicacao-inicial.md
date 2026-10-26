# Primeira publicação para acessar o aplicativo

Destino preparado: Vercel, executando o Next.js com Node.js 24. O arquivo `vercel.json` fixa instalação pelo lockfile, confere a edição bíblica e executa o build. Esta preparação não cria uma hospedagem nem confirma uma URL pública.

## Primeira versão acessível

A página inicial, os percursos públicos, a Bíblia Livre integral e a aula com jogo funcionam sem serviço de contas. A primeira publicação pode disponibilizar esses recursos imediatamente, mantendo a indicação de piloto educacional.

Login, personalização salva e progresso na conta exigem Supabase remoto configurado posteriormente. Sem essa configuração, o formulário de conta informa a indisponibilidade e o estudo permanece público. As respostas da aula ficam na memória da página.

**Não transportar `.env.local`, chaves locais, banco de desenvolvimento ou um build que incorporou endereços de loopback para a hospedagem.** O provedor deve gerar um build novo a partir do código. As variáveis locais são ignoradas pelo Git e não devem ser cadastradas no painel da primeira publicação.

## Publicar com a conta do proprietário

1. Entrar em <https://vercel.com/new> com a conta GitHub que tem acesso ao repositório `fabioserafim56-coder/InJessusName`.
2. Importar esse repositório e selecionar a branch que contém o código preparado. Usar o diretório raiz e o framework Next.js.
3. Selecionar Node.js 24 caso o painel peça a versão. Manter os comandos de instalação e build do projeto.
4. Para a primeira exploração pública, deixar as variáveis Supabase ausentes. Não é necessário contratar banco ou domínio para testar os estudos.
5. Executar a publicação e usar o endereço efetivamente fornecido pela Vercel. Um endereço desejado não deve ser anunciado antes de ser atribuído e testado.

A Vercel pode pedir autorização de acesso ao repositório. Essa autenticação é feita no site do provedor, sem compartilhar senha, token ou código de autenticação pelo chat. O plano e eventuais custos pertencem à conta escolhida; não criar recursos pagos automaticamente.

## Conferir o endereço resultante

- Abrir a página inicial em computador e celular.
- Abrir `/biblia?livro=ACT&capitulo=17&versiculo=11`, trocar de capítulo e conferir o texto e a atribuição.
- Abrir `/aprender/primeiros-passos`, iniciar a aula, responder uma atividade e baixar o resumo PDF.
- Abrir `/entrar` e conferir que contas estão indisponíveis enquanto o backend remoto não estiver configurado.
- Confirmar HTTPS, ausência de chamadas a loopback no navegador e acesso em uma janela sem sessão anterior.

Somente essas verificações no endereço externo confirmam que o proprietário consegue acessar a publicação. Testes em loopback demonstram preparo técnico; não estabelecem acesso externo.

## Ativar contas depois

Provisionar um projeto Supabase remoto autorizado, aplicar as migrações no destino correto e configurar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` no painel seguro da hospedagem. Configurar os URLs de retorno, confirmação de e-mail e proteção contra abuso antes de abrir cadastro público. Gerar um novo build e repetir os testes de autenticação, consentimento, isolamento e revogação no destino. A configuração local sem confirmação de e-mail não é uma configuração de produção.

Publicar a configuração do ambiente de desenvolvimento do Codex é uma operação diferente de publicar este site na Vercel.
