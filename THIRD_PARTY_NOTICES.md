# Third-party notices

## 21st.dev CircleProgress

The component `src/components/ui/study-progress-ring.tsx` adapts CircleProgress from the official 21st.dev source repository, commit `b96d84dcf748d5e56f2f72f2bab9a4f7f33574cf`.

Source: https://github.com/serafimcloud/21st/blob/b96d84dcf748d5e56f2f72f2bab9a4f7f33574cf/apps/web/components/ui/circle-progress.tsx

Changes include bounded progress values, a size-derived radius, top origin, accessible progress semantics, and project-specific styling. It displays the current lesson session, not a grade, streak or evidence of long-term learning. During the initial CircleProgress integration, the hosted 21st.dev catalog was not available from this environment; the official repository and its license were consulted directly. The catalog was subsequently accessed for the separate MagicUI research of 29 October 2026 described below.

MIT License

Copyright (c) 2024 21st.dev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


## Inter

Inter is self-hosted through `next/font/local` from the pinned `@fontsource-variable/inter` dependency. Copyright 2016 The Inter Project Authors (https://github.com/rsms/inter). SIL Open Font License 1.1; full notice is distributed at `public/fonts/INTER-LICENSE.txt`.

## Bíblia Livre

The Bible corpus has its own authorship and CC BY 3.0 Brasil terms. See `docs/fontes-biblicas.md` and `src/content/bible/source/LICENCA.md`. The license of a UI component does not cover the biblical text or other educational content.


## PhotoSwipe 5.4.4

Source: https://github.com/dimsemenov/PhotoSwipe/tree/v5.4.4

PhotoSwipe powers the museum and church-history photograph lightboxes, whole-image story viewers and keyboard-accessible zoom. Photographs have independent rights and credits recorded in docs/fontes-museu.md and docs/fontes-fotograficas-igrejas.md; story artworks are artistic illustrations with separate provenance.

Full license also distributed at public/licenses/photoswipe-MIT.txt.

```text
The MIT License (MIT)

Copyright (c) 2014-2022 Dmitry Semenov, https://dimsemenov.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```


## Fuse.js 7.5.0

Source: https://github.com/krisk/Fuse/tree/v7.5.0

Fuse.js powers local approximate search in the museum and remains available in the earlier lesson-catalog component. The current /aprender experience uses six guided encounters rather than that catalog. These local search terms stay in page memory; the separate Bible search uses its own server index.

Full license also distributed at public/licenses/fuse-Apache-2.0.txt.

```text
Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "{}"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright 2017 Kirollos Risk

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```


## Historical museum photographs

The four unmodified photographs are reproduced from George A. Barton, Archæology and the Bible, second edition, June 1917 (work copyright 1916), figures 15, 300, 295 and 14. The photographer is not identified in the original captions; figure 14 credits the historical reproduction to Thomas Nelson & Sons. This does not imply a new permission or endorsement from a present-day museum.

The files were obtained from the GITenberg mirror at commit b35df991a834e244de8df456348e0f16eae32641. Public-domain status, scope, original links, dimensions, checksums and historical limitations are recorded in docs/fontes-museu.md. These photographs are independent of the software licenses above. Complete credits remain available in each exhibit’s “Imagem e fontes” panel.


## Motion 14.7.1

Package: motion. Source: https://github.com/motiondivision/motion.

Original license is also distributed in public/licenses/motion-MIT.txt.

```text
The MIT License (MIT)

Copyright (c) 2024 [Motion](https://motion.dev) B.V.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```


## StPageFlip 2.0.7

Package: page-flip. Source: https://github.com/Nodlik/StPageFlip.git.

Original license is also distributed in public/licenses/page-flip-MIT.txt.

```text
MIT License

Copyright (c) 2020 Nodlik

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```


## Phosphor Icons 2.1.10

Package: @phosphor-icons/react. Source: phosphor-icons/react.

Original license is also distributed in public/licenses/phosphor-MIT.txt.

```text
MIT License

Copyright (c) 2020 Phosphor Icons

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```


## Canvas Confetti 1.9.4

Package: canvas-confetti. Source: git+https://github.com/catdad/canvas-confetti.git.

Original license is also distributed in public/licenses/canvas-confetti-ISC.txt.

```text
ISC License

Copyright (c) 2020, Kiril Vatev

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```


## Embla Carousel 8.6.0

Source: https://github.com/davidjerleke/embla-carousel/tree/v8.6.0. Embla and its React adapter provide the keyboard/touch learning journey; autoplay is disabled. Full original license also distributed in public/licenses/embla-MIT.txt.

```text
MIT License

Copyright (c) David Jerleke.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```


### StPageFlip local maintenance change

The explicit postinstall script scripts/patch-page-flip.mjs updates the pinned 2.0.7 browser/module distributions: it records and cancels the renderer animation-frame handle when destroy() runs. This prevents a closed Bible from continuing its rendering loop. The script verifies the version and exact original patterns, is idempotent, and fails on an unexpected upstream distribution. The original npm package integrity check remains active. Original MIT copyright and license remain distributed above.

## Kokoro-generated authorial welcome and prayer

Two static Portuguese recordings were generated with Kokoro-82M v1.0 and its pm_alex voice, retrieved from pinned Hugging Face revisions: the earlier welcome (~25 seconds) and the prayer before studying (19.636 seconds). No model weights or inference runtime are shipped to the browser. Both optional players identify the synthetic voice, provide the authorial transcript and do not autoplay; no visitor prayers, voices or study queries are sent to a model.

Exact sources, voice comparison, checksums and generation settings for the welcome are in public/audio/bem-vindo-proveniencia.json. The prayer has its own transcript, settings, output checksums and reproducible script in public/audio/antes-do-estudo-proveniencia.json and public/audio/geracao-oracao-referencia.py. Model revision: hexgrad/Kokoro-82M at f3ff3571791e39611d31c381e3a41a3af07b4987. ONNX conversion: onnx-community/Kokoro-82M-v1.0-ONNX at 1939ad2a8e416c0acfeecc08a694d14ef25f2231, Apache-2.0. Full model and generation-runtime licenses are distributed in public/audio/.

Model licensing does not automatically license the authorial scripts or recorded outputs. The words are original InJessusName compositions, not recordings or impersonations of a pastor, and the prayer is not a quotation from a Bible translation. Human review of voice naturalness and pastoral suitability remains pending.

## Original interface illustrations

The Galilee-inspired landscape and contemporary study-desk image were generated for this project. They are labeled artistic illustrations and are separate from the authentic historical photographs in the museum. Dimensions and file checksums are in public/visuals/proveniencia.json.
## Ampliação editorial de 29/10/2026

Os novos guias, etapas, exemplos, perguntas e paráfrases das histórias são composições editoriais do InJessusName. As citações bíblicas continuam sendo recuperadas da Bíblia Livre TR2018, com seus créditos e CC BY 3.0 Brasil. Um guia não representa revisão ou nova edição da tradução.

As treze novas artes originais (quatro ambientais e nove narrativas) foram geradas para o projeto e copiadas sem edição dos arquivos originais. A proveniência, dimensões e SHA-256 estão em `public/visuals/historias-proveniencia.json` e `public/visuals/historias-narrativas-proveniencia.json`. São ilustrações interpretativas; não são fotografias de objetos históricos, retratos autenticados ou reconstruções arqueológicas. A otimização responsiva de entrega utiliza o Next.js; os PNG originais são preservados.

As fichas de igrejas e pessoas contêm sínteses autorais com ligações para fontes institucionais, documentos confessionais e fontes enciclopédicas, identificadas em `src/content/church-history/index.ts` e `docs/fontes-historia-igrejas.md`. Não foram incorporadas letras de hinos, gravações musicais ou cópias integrais de biografias de terceiros. As fotografias acrescentadas posteriormente nesta mesma data têm créditos e direitos próprios, documentados abaixo. Referenciar uma comunidade ou pessoa não declara vínculo institucional.


## MagicUI BorderBeam adaptation — 29 October 2026

`src/components/learning-sanctuary/focus-border.tsx` adapts BorderBeam from MagicUI, discovered through the 21st.dev component gallery. Source revision: `efe76fc5755eca1142dd4f74c1d6f0ace2887e3c`.

- Source: https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/apps/www/registry/magicui/border-beam.tsx
- License: https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/LICENSE.md
- Original full license: `public/licenses/magicui-MIT.txt` and `src/components/learning-sanctuary/MAGICUI-LICENSE.txt`.

Changes replace Tailwind and class utilities with project CSS, use the already installed Motion package, adapt colors, and run one five-second highlight after an explicit encounter selection. Reduced-motion preference suppresses the decoration. No additional package was installed. The scene, journey illustrations and avatar are original project SVG compositions, not MagicUI assets.

```text
MIT License

Copyright (c) Magic UI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Church-history photographs, portraits and document — 29 October 2026

Eighteen unmodified original files in `public/church-history/` illustrate eight church/tradition entries and nine people. Each file has independent creator, credit, capture-date qualification, source URL, license URL, rights evidence, dimensions, byte count and SHA-256 in `src/content/church-history/photos.json` and the distributed `public/church-history/proveniencia.json`. A file linked to multiple entries is counted once. Full acquisition notes and the list of selected records are in `docs/fontes-fotograficas-igrejas.md`.

The selection includes public-domain historical records, Creative Commons Attribution and Attribution-ShareAlike photographs, and one photograph reproduced with the Palácio do Planalto attribution permission. It is not governed by a single software or image license. Original credits and applicable license links remain visible beside each image and in the provenance data. CC BY/CC BY-SA sources include Valter Campanato/Agência Brasil, Wilfredor, Felipe Restrepo Acosta, Eugenio Hansen OFS, Manoel Messias de So… (the name as credited by the Panoramio archive), Vitor Mazuco, Bruce Boehner, the Los Angeles Times Photographic Collection/UCLA and Cecioka. Ricardo Stuckert/Palácio do Planalto is credited under the recorded institutional attribution permission. Historical reproductions retain the rights grounds and archive credits supplied by their sources rather than attributing authorship to the uploader.

Original files have not been cropped, restored, colorized or enlarged with AI. Next.js generates responsive delivery versions; the interactive viewer limits display width to 2048 px on mobile and 3840 px on desktop, with a separate link to the intact original. The largest original is 7385×9812 px; smaller archival portraits retain their native limits. The photographs do not imply endorsement by a person, church, archive or institution. A photograph of a later building is not represented as the community's original church.

## Additional original miracle illustrations — 29 October 2026

Three illustrations were generated for the multiplication of the loaves (John 6), Jesus calming the storm (Mark 4) and Lazarus (John 11). They are interpretive artwork, not authenticated portraits, documentary photographs or archaeological evidence. The original PNGs were copied without pixel edits. Their dimensions, references and SHA-256 are recorded in `public/visuals/milagres-proveniencia.json`; the story viewer can display the whole original image.

The visual scene and image-delivery settings do not substantiate a measured percentage improvement or universal 4K resolution. PixiJS, Swin2SR and multilingual E5 were researched but were not installed, run or distributed as integrations in this release. Research references are in `docs/ferramentas-pesquisadas-2026-10-29.md`.
