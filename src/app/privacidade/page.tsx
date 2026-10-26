import type { Metadata } from "next";
import Link from "next/link";
import "@/components/auth/auth.css";

export const metadata: Metadata = {
  title: "Privacidade e escolhas — InJessusName",
  description: "Entenda os dados usados no seu percurso e como revisar suas escolhas."
};

export default function PrivacyPage() {
  return (
    <main className="auth-page privacy-page">
      <header className="auth-page-header"><Link href="/" className="auth-brand">InJessusName<span>CONHECER · COMPREENDER · VIVER</span></Link><Link href="/comecar" className="auth-quiet-link">Conhecer a jornada <span aria-hidden="true">↗</span></Link></header>
      <article className="privacy-article">
        <span className="auth-eyebrow">PRIVACIDADE E ESCOLHAS</span>
        <h1>Seu caminho.<br /><em>Suas escolhas.</em></h1>
        <p className="privacy-lead">Fé e história pessoal merecem cuidado. Esta página explica o que a etapa atual do InJessusName usa para organizar o seu percurso.</p>
        <section><h2>Conhecer antes de criar uma conta</h2><p>Você pode explorar os percursos públicos sem cadastro. As respostas da conversa de visitante ficam apenas na memória da página: o aplicativo não as salva no banco, no endereço da página ou no armazenamento local do navegador.</p><p>Ao fechar, recarregar ou sair da conversa, essas escolhas podem se perder. Isso não impede o acesso ao conteúdo público.</p></section>
        <section><h2>Uma conta para guardar o seu percurso</h2><p>O acesso à conta usa seu e-mail, senha e cookies de sessão. A conta permite identificar de quem é o percurso salvo. A senha deve ser informada apenas no formulário de acesso e não deve ser compartilhada.</p><p>O cadastro desta etapa é destinado a pessoas com 18 anos ou mais. A idade é informada pela própria pessoa; ainda não há verificação documental inicial de idade.</p></section>
        <section><h2>A personalização precisa da sua autorização</h2><p>A pré-entrevista pergunta faixa etária, vínculo com uma tradição cristã, situação de batismo e objetivo de aprendizado. Crença religiosa é um dado pessoal sensível. Essas respostas só devem ser salvas depois da sua autorização específica para personalizar o percurso.</p><p>Você pode escolher o caminho de quem ainda está conhecendo a fé e pode preferir não informar o batismo. As escolhas organizam sugestões de estudo; elas não classificam o valor da sua fé nem conferem qualquer habilitação ministerial.</p></section>
        <section><h2>Atividades e progresso da aula piloto</h2><p>O leitor bíblico e a aula pública podem ser usados sem cadastro. As respostas das atividades ficam apenas na memória da página até você escolher guardar a conclusão. Não são enviadas em endereços de páginas nem gravadas pelo aplicativo em armazenamento local ou de sessão.</p><p>A opção de salvar começa desmarcada. Para guardar a conclusão, você precisa de uma conta adulta com autorização de personalização ativa e deve escolher salvar o progresso desta aula. Guardamos os identificadores das perguntas e alternativas, o número de tentativas, os indicadores de dica e consulta, o resultado e as datas de conclusão e retomada. Esses registros de estudo religioso também merecem proteção como dados sensíveis.</p><p>O servidor confere as respostas; outras contas não podem ler seu progresso. Você pode consultá-lo e apagá-lo na própria aula. Não coletamos o conteúdo das suas orações ou das reflexões S.O.A.P.; use seu caderno físico. As datas sugeridas não enviam notificações.</p></section>
        <section><h2>Revisar ou retirar a autorização</h2><p>Você pode refazer a <Link href="/comecar">conversa inicial</Link> para revisar seu percurso. Na área <Link href="/meu-percurso">Meu percurso</Link>, a ação “Revogar personalização e apagar respostas” remove o perfil de aprendizado salvo e o progresso guardado da aula piloto.</p><p>A revogação mantém sua conta e o registro mínimo de que a autorização foi retirada. Ela não é um comando para excluir a conta inteira. O percurso público continua disponível.</p><p>O canal para outros pedidos sobre acesso, correção, exportação e exclusão da conta será informado antes da abertura pública do serviço.</p></section>
        <section><h2>Crianças e adolescentes</h2><p>O fluxo para menores oferece percursos públicos adequados à faixa etária. Ele interrompe a entrevista antes de perguntar denominação, batismo ou objetivo de um perfil religioso salvo.</p><p>O cadastro e o acompanhamento por responsável ainda precisam ser implementados e validados. Até lá, o aplicativo não oferece esse fluxo como disponível.</p></section>
        <section><h2>O que está em preparação</h2><p>O caderno pessoal, sua criptografia no dispositivo e a recuperação de chaves ainda estão em construção. A existência de uma estrutura no banco não significa que esses recursos já possam ser usados.</p><p>A proteção de dados também depende de procedimentos, retenção, controles de acesso e atendimento às pessoas. Esta etapa não representa, sozinha, uma garantia de conformidade integral com a LGPD.</p></section>
        <div className="privacy-actions"><Link className="auth-submit" href="/comecar">Conhecer meu caminho <span aria-hidden="true">→</span></Link><Link className="auth-quiet-link" href="/meu-percurso">Revisar minha personalização</Link></div>
      </article>
      <footer className="auth-footer"><p>Plataforma educacional independente. Respeito às pessoas e às suas escolhas.</p><Link href="/">Voltar ao início</Link></footer>
    </main>
  );
}
