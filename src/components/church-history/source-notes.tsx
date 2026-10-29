import { sourcesFor } from "@/content/church-history";

export function HistorySourceNotes({ sourceIds }: { sourceIds: readonly string[] }) {
  return <details className="history-sources"><summary>Fontes e contexto desta ficha</summary><p>Textos autorais a partir das fontes abaixo. Uma memória institucional mostra como a própria comunidade conta sua história. Um documento confessional apresenta o ensino na perspectiva dessa tradição. Uma enciclopédia colaborativa exige também a leitura das referências indicadas.</p><ul>{sourcesFor(sourceIds).map(source => <li key={source.id}><span>{source.kind}</span><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a><small>{source.publisher} · consulta em 28/10/2026</small></li>)}</ul></details>;
}
