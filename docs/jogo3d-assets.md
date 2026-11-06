# Materiais fotográficos da jornada ampliada

Fontes e arquivos conferidos em **6 de novembro de 2026**. Esta entrega acrescenta três materiais coerentes ao mundo de Lucas 10: chão arenoso com cascalho, pedra e madeira. São texturas de materiais contemporâneos usadas na interpretação artística, não fotografias de sítios bíblicos autenticados nem evidência sobre a parábola.

## Assets realmente incluídos

| Material e origem | Autor informado | Cor | Normal OpenGL |
| --- | --- | --- | --- |
| [Sandy Gravel](https://polyhaven.com/a/sandy_gravel) | Charlotte Baglioni | `/games3d/materials/ground-color.webp`, 1024×1024, 297.520 B | `/games3d/materials/ground-normal.webp`, 512×512, 158.154 B |
| [Old Sandstone 02](https://polyhaven.com/a/old_sandstone_02) | Dimitrios Savva | `/games3d/materials/stone-color.webp`, 1024×1024, 242.994 B | `/games3d/materials/stone-normal.webp`, 512×512, 164.950 B |
| [Rough Wood](https://polyhaven.com/a/rough_wood) | Rob Tuytel | `/games3d/materials/wood-color.webp`, 1024×1024, 321.018 B | `/games3d/materials/wood-normal.webp`, 512×512, 136.536 B |

**Total das seis texturas: 1.321.172 bytes**, aproximadamente 1,32 MB decimal. Isso é o volume dos arquivos distribuídos, não uma medição de tráfego real nem da memória de GPU. Mipmaps, decodificação e geometrias têm orçamento próprio.

Os originais JPEG de 1024 px foram obtidos do endpoint `files` da [API oficial do Poly Haven](https://api.polyhaven.com/) e do domínio de download indicado por ele. O tamanho e o MD5 de cada original foram comparados com os valores publicados pela API antes da conversão. O manifesto local também registra SHA-256 de entrada e saída, nomes dos autores e o `files_hash` de cada asset informado pelo provedor. MD5 é tratado como a verificação publicada pelo upstream, sem ser apresentado como equivalente criptográfico a SHA-256.

A licença dos assets foi confirmada na [página oficial](https://polyhaven.com/license): CC0 1.0, inclusive para trabalho comercial. A [licença e os créditos locais](../public/games3d/materials/LICENSE.md) e o [manifesto técnico](../public/games3d/materials/proveniencia.json) estão versionados. O texto legal CC0 foi preservado byte a byte do [endereço oficial do Creative Commons](https://creativecommons.org/publicdomain/zero/1.0/legalcode.txt). A licença do asset não cobre automaticamente texto e marcas do site do provedor.

## Preparação técnica

A codificação usa o `sharp` já instalado no projeto. Os albedos mantêm 1024×1024 e são codificados como WebP, qualidade 90, esforço 6. Os mapas de normais OpenGL usam redimensionamento Lanczos3 para 512×512 e WebP, qualidade 100, esforço 6. Os dois caminhos são **lossy**: qualidade 100 não transforma o WebP em modo sem perdas. A conversão é uma adaptação técnica documentada, sem alegação de restaurar ou criar detalhes. Os metadados embutidos dos JPEG não são copiados para os arquivos de entrega; origem e direitos permanecem no manifesto.

Receita de cada mapa, após baixar e conferir o original do URL registrado:

```js
const pipeline = sharp(original).resize(width, height, {
  fit: "fill",
  kernel: "lanczos3",
});
await pipeline.webp({ quality, effort: 6 }).toFile(destination);
```

`width`, `height` e `quality` vêm da entrada `transformation` no manifesto. Os arquivos originais de trabalho ficam fora da pasta pública; somente as seis cópias finais e seus registros são distribuídos.

## Integração e cuidado visual

- Carregar pelo próprio aplicativo após a escolha de entrar no cenário; nenhuma URL de CDN externa é necessária durante a partida.
- Mapas de cor usam `THREE.SRGBColorSpace`; normais usam `THREE.NoColorSpace` e convenção OpenGL. Tratar uma normal como fotografia sRGB altera o resultado da iluminação.
- Ajustar repetição e intensidade do relevo à geometria. A textura de pedra contém fiadas de blocos; repetir a imagem inteira em cada pequena pedra pode criar um padrão incoerente.
- Compartilhar texturas quando a transformação UV é comum; quando for preciso cloná-las para repetições diferentes, liberar também as cópias no encerramento. Manter alternativa procedural se o carregamento falhar e impedir que uma promessa tardia retenha texturas depois da saída.
- O acervo aqui não inclui personagens GLB, animações de terceiros ou pesos de modelos. A geometria e o movimento dos personagens desta iteração pertencem ao código do jogo; a inclusão de materiais não deve ser descrita como importação de um novo modelo humano.

As verificações deste pacote conferem bytes, hashes, dimensões e licença. Aparência, escala UV, desempenho, descarte de memória e fluidez dependem dos testes do jogo integrado; esta nota não afirma que esses resultados foram medidos apenas por baixar as texturas.
