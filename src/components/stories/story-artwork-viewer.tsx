"use client";

import Image from "next/image";
import { useEffect, useRef, type MouseEvent } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import { ArrowsOutSimple } from "@phosphor-icons/react/ssr";
import "photoswipe/style.css";

export function StoryArtworkViewer({ src, width, height, title }: { src: string; width: number; height: number; title: string }) {
  const viewer = useRef<PhotoSwipeLightbox | null>(null);
  useEffect(() => () => { viewer.current?.destroy(); viewer.current = null; }, [src]);
  function open(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const anchor = event.currentTarget;
    anchor.focus({ preventScroll: true });
    if (!viewer.current) viewer.current = new PhotoSwipeLightbox({ pswpModule: () => import("photoswipe"), closeTitle: "Fechar ilustração", zoomTitle: "Aproximar ou afastar", showHideAnimationType: "none", returnFocus: true, bgOpacity: .98, counter: false });
    viewer.current.loadAndOpen(0, [{ src, width, height, alt: `Ilustração artística: ${title}`, element: anchor, msrc: anchor.querySelector("img")?.currentSrc }]);
  }
  return <figure className="story-original-art"><a href={src} onClick={open} data-pswp-width={width} data-pswp-height={height} aria-label={`Ver ilustração completa: ${title}`}><Image src={src} alt={`Ilustração artística para ${title}.`} width={width} height={height} quality={100} sizes="(max-width:760px) 92vw, 1050px" /><span><ArrowsOutSimple size={20} aria-hidden="true" /> Contemplar a ilustração completa</span></a><figcaption>Arte original em sua proporção completa. Abra para ampliar a imagem na resolução disponível. Representação artística, sem pretensão de retrato ou reconstrução histórica.</figcaption></figure>;
}
