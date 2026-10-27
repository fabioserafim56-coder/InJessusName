"use client";

import Image from "next/image";
import { useEffect, useRef, type MouseEvent } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import { MuseumIcon } from "./museum-icons";
import type { MuseumExhibit } from "@/content/museum";
import "photoswipe/style.css";

export function ExhibitImage({ exhibit }: { exhibit: MuseumExhibit }) {
  const lightbox = useRef<PhotoSwipeLightbox | null>(null);
  useEffect(() => () => {
    lightbox.current?.destroy();
    lightbox.current = null;
  }, [exhibit.id]);

  function openImage(event: MouseEvent<HTMLAnchorElement>) {
    // Keep native open-in-new-tab and no-JavaScript access to the photograph.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const anchor = event.currentTarget;
    anchor.focus({ preventScroll: true });
    if (!lightbox.current) {
      const viewer = new PhotoSwipeLightbox({
        pswpModule: () => import("photoswipe"),
        closeTitle: "Fechar imagem",
        zoomTitle: "Aproximar ou afastar a imagem",
        arrowPrevTitle: "Imagem anterior",
        arrowNextTitle: "Próxima imagem",
        errorMsg: "Não conseguimos abrir a fotografia. Você pode voltar à peça e tentar novamente.",
        // The controls and Escape become available immediately, including on touch.
        showHideAnimationType: "none",
        bgOpacity: .96,
        returnFocus: true,
        counter: false
      });
      viewer.on("uiRegister", () => viewer.pswp?.ui?.registerElement({ name: "museum-caption", order: 9, isButton: false, appendTo: "root", onInit: (element) => { element.textContent = `${exhibit.title} · ${exhibit.approxDate}`; } }));
      lightbox.current = viewer;
    }
    // Create the lightbox on the first click; only its full viewer is lazy-loaded.
    // This avoids a link navigating away while a separate initialization imports.
    lightbox.current.loadAndOpen(0, [{
      src: exhibit.image.src,
      width: exhibit.image.width,
      height: exhibit.image.height,
      alt: exhibit.image.alt,
      element: anchor,
      msrc: anchor.querySelector("img")?.currentSrc
    }]);
  }

  const caption = exhibit.image.src.endsWith("-1917.jpg") ? "Fotografia histórica · edição de 1917" : exhibit.image.credit;
  const license = exhibit.image.license.startsWith("Domínio público") ? "Domínio público" : exhibit.image.license;

  return <figure className="museum-object-figure"><div className="museum-image-gallery"><a className="museum-object-photo-link" href={exhibit.image.src} onClick={openImage} data-pswp-width={exhibit.image.width} data-pswp-height={exhibit.image.height} aria-label={`Ampliar imagem: ${exhibit.title}`}><Image src={exhibit.image.src} alt={exhibit.image.alt} width={exhibit.image.width} height={exhibit.image.height} sizes="(max-width: 760px) 100vw, 75vw" preload /><span className="museum-zoom-hint"><MuseumIcon name="zoom" />Olhar de perto</span></a></div><figcaption><span>{caption}</span><span>{license}</span></figcaption></figure>;
}
