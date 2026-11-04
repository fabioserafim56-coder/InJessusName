# Configurar perguntas visuais do museu

O museu funciona com quatro peças, fotografias, observações e fontes sem uma API de IA. Para responder a perguntas livres sobre essas peças, o servidor pode usar OpenAI, Gemini ou o serviço privado opcional. A configuração não ativa PaddleOCR: ele continua dependendo do serviço Python próprio.

## Escolher um provedor

Estas variáveis pertencem ao aplicativo Next.js. Configure somente o provedor escolhido; os campos de chave em `.env.example` ficam vazios de propósito.

| Provedor | Variáveis privadas obrigatórias | Modelo padrão e substituição opcional |
| --- | --- | --- |
| OpenAI | `INJESSUS_VISION_PROVIDER=openai` e `OPENAI_API_KEY` | `gpt-6-luna`; substituição em `INJESSUS_OPENAI_VISION_MODEL` |
| Gemini | `INJESSUS_VISION_PROVIDER=gemini` e `GEMINI_API_KEY` | `gemini-3.8-flash`; substituição em `INJESSUS_GEMINI_VISION_MODEL` |
| Serviço privado | `INJESSUS_VISION_PROVIDER=qwen` e `INJESSUS_MULTIMODAL_SERVICE_URL`; `INJESSUS_MULTIMODAL_SERVICE_TOKEN` obrigatório fora do loopback | Configuração própria do [serviço multimodal](../services/multimodal/README.md); a resposta identifica o modelo efetivamente utilizado |

Uma chave isolada não escolhe um provedor. Com `INJESSUS_VISION_PROVIDER` vazio, apenas o serviço privado anterior pode ser utilizado, se estiver configurado corretamente. Um provedor selecionado sem configuração válida fica indisponível; o app não troca para outro provedor automaticamente.

OpenAI e Gemini são APIs comerciais com acesso, limites e cobrança próprios. Não são anunciadas como modelos abertos nem como execução de Qwen. O modelo escolhido precisa aceitar imagem e texto nos contratos suportados pelo adaptador. Os padrões foram conferidos nas páginas oficiais de [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna) e [Gemini 3.8 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash). Confirme a disponibilidade do modelo na conta antes de ativar o recurso.

## Chaves e ambiente local

Se uma chave foi compartilhada em chat ou outro lugar público, revogue-a no provedor e gere outra. Use apenas a nova chave no painel seguro da hospedagem ou em `.env.local`, fora do Git. Não copie a chave para documentação, código, testes, mensagens ou capturas de tela. Nenhuma dessas variáveis pode receber o prefixo `NEXT_PUBLIC_`.

Para desenvolvimento, copie os nomes necessários de `.env.example` para `.env.local`, preencha-os no ambiente privado e reinicie `npm run dev`. Não é necessário configurar Supabase para usar a visita pública ou esses adaptadores.

## Ativar na Vercel

1. Abra o projeto que publica `in-jessus-name.vercel.app` e entre em **Settings → Environment Variables**.
2. Adicione `INJESSUS_VISION_PROVIDER` com `openai` ou `gemini` e a variável da nova chave correspondente. Se necessário, adicione a substituição de modelo da tabela. Selecione o ambiente **Production**; adicione **Preview** somente se também quiser habilitar chamadas nessa versão.
3. Salve as variáveis. Em **Deployments**, publique a versão que contém os adaptadores ou use **Redeploy** na versão adequada para carregar a nova configuração.
4. Quando a publicação terminar, abra `/explorar?modo=museu`, escolha uma peça e confira a indicação do provedor antes de enviar uma pergunta curta. O envio real pode gerar cobrança. Confira uma resposta, o modelo informado e as fontes da ficha.

`GET /api/multimodal/vision` informa apenas a disponibilidade da configuração. Ele não revela a chave, não faz inferência paga e não comprova saldo, acesso ao modelo ou sucesso de uma pergunta. A ativação pública só está conferida depois de uma chamada real na implantação correspondente.

## O que é enviado

A pessoa escolhe explicitamente a análise externa. O servidor envia a pergunta, a fotografia pública de uma das quatro peças e seu contexto editorial ao provedor selecionado. Não recebe fotografias pessoais, URLs arbitrárias ou gravações do navegador nesse fluxo. O app não grava pergunta ou resposta em conta ou banco; o provedor tem suas próprias condições de tratamento e retenção de dados.

A resposta automática pode errar. A interface mantém as fontes da ficha e diferencia observação visual, documentação e incerteza; não certifica inscrições, autenticidade ou uma interpretação histórica. O guia editorial continua disponível quando a configuração está ausente ou uma chamada falha.
