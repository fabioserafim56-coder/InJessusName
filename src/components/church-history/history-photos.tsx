"use client";

import Image from "next/image";
import { useEffect, useRef, type MouseEvent } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import { ArrowUpRight, Camera, MagnifyingGlassPlus } from "@phosphor-icons/react/ssr";
import { getHistoryPhotoCard, getHistoryPhotoRenditions, getHistoryPhotos, getHistoryPhotoViewer, type HistoryPhoto } from "@/content/church-history/photos";
import "photoswipe/style.css";
import "./history-photos.css";

const kindLabel: Record<HistoryPhoto["kind"], string> = {
  photograph: "Fotografia real",
  document: "Documento de época",
  "historical-portrait": "Retrato histórico"
};
const licenseLabel = (photo: HistoryPhoto) => photo.license === "Public domain"
  ? "Domínio público"
  : photo.license === "Attribution" ? "Uso com crédito à fonte" : photo.license;

export function HistoryPhotoGallery({ entityId, compact = false }: { entityId: string; compact?: boolean }) {
  const photos = getHistoryPhotos(entityId);
  const displayed = compact ? photos.slice(0, 1) : photos;
  const lightbox = useRef<PhotoSwipeLightbox | null>(null);
  const activePhoto = useRef<HistoryPhoto | null>(null);

  useEffect(() => () => {
    lightbox.current?.destroy();
    lightbox.current = null;
    activePhoto.current = null;
  }, [entityId]);

  function openPhoto(event: MouseEvent<HTMLAnchorElement>, photo: HistoryPhoto) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const anchor = event.currentTarget;
    anchor.focus({ preventScroll: true });
    activePhoto.current = photo;
    // Keep the preserved original one native link away, while the interactive
    // viewer uses a display-sized delivery instead of decoding a 72MP scan on a phone.
    const rendition = getHistoryPhotoViewer(photo, window.innerWidth < 760 ? 2048 : 3840);
    if (!lightbox.current) {
      const viewer = new PhotoSwipeLightbox({
        pswpModule: () => import("photoswipe"),
        closeTitle: "Fechar fotografia",
        zoomTitle: "Aproximar ou afastar a fotografia",
        arrowPrevTitle: "Fotografia anterior",
        arrowNextTitle: "Próxima fotografia",
        errorMsg: "Você pode abrir o arquivo original pelo link da fotografia.",
        showHideAnimationType: "none",
        bgOpacity: .97,
        returnFocus: true,
        counter: false
      });
      viewer.on("uiRegister", () => viewer.pswp?.ui?.registerElement({
        name: "history-photo-caption",
        order: 9,
        isButton: false,
        appendTo: "root",
        onInit: element => {
          const selected = activePhoto.current;
          element.textContent = selected
            ? `${selected.title} · ${selected.dateLabel} · ${selected.creator} · ${licenseLabel(selected)}`
            : "";
        }
      }));
      lightbox.current = viewer;
    }
    lightbox.current.loadAndOpen(0, [{
      src: rendition.src,
      width: rendition.width,
      height: rendition.height,
      alt: `${photo.title} · ${photo.dateLabel} · ${photo.creator} · ${licenseLabel(photo)}`,
      element: anchor,
      msrc: anchor.querySelector("img")?.currentSrc
    }]);
  }

  if (!displayed.length) return null;

  return <section className={`history-photo-gallery${compact ? " history-photo-gallery-compact" : ""}`} data-history-photo-gallery={entityId} aria-label="Fotografias e documentos desta história">
    {!compact && <header className="hp-heading"><p><Camera size={19} aria-hidden="true" /> ROSTOS E LUGARES DA CAMINHADA</p><h2>A Palavra atravessa gerações.</h2><p>Conheça espaços e pessoas em registros preservados. A data de cada imagem acompanha a leitura para situar esse momento da história.</p></header>}
    <div className="hp-grid">{displayed.map(photo => {
      const card = getHistoryPhotoCard(photo);
      const variants = getHistoryPhotoRenditions(photo.id);
      return <figure key={photo.id} className="hp-figure" data-history-photo={photo.id}>
      <a className="hp-image" href={photo.src} onClick={event => openPhoto(event, photo)} data-pswp-width={photo.width} data-pswp-height={photo.height} aria-label={`Ampliar imagem: ${photo.title}`}>
        <picture>
          {variants.length > 0 && <source type="image/webp" srcSet={variants.map(file => `${file.src} ${file.width}w`).join(", ")} sizes={compact ? "(max-width: 760px) 100vw, 30vw" : "(max-width: 760px) 100vw, 55vw"} />}
          <Image src={card.src} alt={photo.title} width={card.width} height={card.height} unoptimized />
        </picture>
        <span className="hp-kind">{kindLabel[photo.kind]}</span><span className="hp-zoom"><MagnifyingGlassPlus size={19} aria-hidden="true" /> Olhar de perto</span>
      </a>
      <figcaption><p className="hp-date">{photo.dateLabel}</p><h3>{photo.title}</h3><p className="hp-caption">{photo.caption}</p><div className="hp-credit"><span>{photo.creator}</span><a href={photo.licenseUrl} target="_blank" rel="noreferrer">{licenseLabel(photo)}<ArrowUpRight size={14} aria-hidden="true" /></a></div>
        {!compact && <details className="hp-provenance"><summary>Conhecer a imagem, a autoria e a fonte</summary><dl><div><dt>Lugar</dt><dd>{photo.place}</dd></div><div><dt>Autoria e acervo</dt><dd>{photo.creator}{photo.credit && ` · ${photo.credit}`}</dd></div><div><dt>Direitos e preservação</dt><dd>{photo.rightsEvidence} {photo.changes}</dd></div><div><dt>Arquivo preservado</dt><dd>{photo.width.toLocaleString("pt-BR")} × {photo.height.toLocaleString("pt-BR")} pixels · consulta em {photo.accessedAt.split("-").reverse().join("/")}</dd></div></dl><div className="hp-source-links"><a href={photo.sourceUrl} target="_blank" rel="noreferrer">Consultar a ficha no acervo <ArrowUpRight size={15} aria-hidden="true" /></a><a href={photo.src} target="_blank" rel="noreferrer">Abrir o original preservado <ArrowUpRight size={15} aria-hidden="true" /></a>{variants.length > 0 && <a href="/church-history/proveniencia-rendicoes.json" target="_blank" rel="noreferrer">Conferir as versões para exibição <ArrowUpRight size={15} aria-hidden="true" /></a>}</div></details>}
      </figcaption>
    </figure>;})}</div>
    {!compact && <p className="hp-context-note">Cada registro conserva seu próprio tempo e lugar. Um templo posterior não representa automaticamente o primeiro edifício da comunidade; as reproduções antigas mantêm a resolução disponível no acervo.</p>}
  </section>;
}
