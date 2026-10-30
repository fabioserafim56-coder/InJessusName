import environmental from "../../../public/visuals/historias-proveniencia.json";
import narrative from "../../../public/visuals/historias-narrativas-proveniencia.json";
import miracles from "../../../public/visuals/milagres-proveniencia.json";

export function getStoryArtwork(src: string) {
  const original = [...narrative.files, ...miracles.files].find(item => item.path === src);
  if (original) return { src, width: original.width, height: original.height, provenance: miracles.files.some(item => item.path === src) ? "/visuals/milagres-proveniencia.json" : "/visuals/historias-narrativas-proveniencia.json" };
  const landscape = environmental.images.find(item => item.file === src);
  return landscape ? { src, width: landscape.dimensions[0], height: landscape.dimensions[1], provenance: "/visuals/historias-proveniencia.json" } : null;
}
