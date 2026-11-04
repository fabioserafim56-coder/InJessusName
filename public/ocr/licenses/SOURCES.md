# OCR third-party notice sources

These notices accompany the Tesseract.js 7.0.0 worker and Tesseract.js-core 7.0.0 WebAssembly variants distributed in `/ocr/`. The originals below were copied without changing their license text. This index records their sources; it does not assign one license to the whole OCR stack.

## Worker modules

The distributed `worker.min.js` is byte-identical to the installed `tesseract.js@7.0.0/dist/worker.min.js`. Its installed source map identifies the modules below. Version checks use the [upstream v7.0.0 lockfile](https://github.com/naptha/tesseract.js/blob/v7.0.0/package-lock.json), rather than assuming that every dependency currently installed separately was used to build the prebundled worker.

For bmp-js, is-url, regenerator-runtime and zlibjs, the source-map module text equals the corresponding installed module text, and each distributed notice equals that installed package's original license file. For buffer, idb-keyval and wasm-feature-detect, the source-map module text was compared with the exact npm tarball below; the tarball's original license/notice also equals the distributed text. For base64-js and ieee754, the source-map module text equals `index.js` at the listed upstream tag, whose original license was retrieved.

| Module and pinned version | Original license or notice source | Distributed file |
| --- | --- | --- |
| base64-js 1.5.1 | [v1.5.1/LICENSE](https://raw.githubusercontent.com/beatgammit/base64-js/v1.5.1/LICENSE) | `BASE64-JS-MIT.txt` |
| bmp-js 0.1.0 | [npm tarball](https://registry.npmjs.org/bmp-js/-/bmp-js-0.1.0.tgz), `package/LICENSE`; installed `node_modules/bmp-js/LICENSE` | `BMP-JS-MIT.txt` |
| buffer 6.0.3 | [npm tarball](https://registry.npmjs.org/buffer/-/buffer-6.0.3.tgz), `package/LICENSE`; copied initially from the identical `node_modules/next/dist/compiled/buffer/LICENSE` | `BUFFER-MIT.txt` |
| idb-keyval 6.2.1 | [npm tarball](https://registry.npmjs.org/idb-keyval/-/idb-keyval-6.2.1.tgz), `package/LICENCE`; also identical to [v6.3.0/LICENCE](https://raw.githubusercontent.com/jakearchibald/idb-keyval/v6.3.0/LICENCE), the initial acquisition source | `IDB-KEYVAL-NOTICE.txt` |
| ieee754 1.2.1 | [v1.2.1/LICENSE](https://raw.githubusercontent.com/feross/ieee754/v1.2.1/LICENSE) | `IEEE754-BSD-3-Clause.txt` |
| is-url 1.2.4 | [npm tarball](https://registry.npmjs.org/is-url/-/is-url-1.2.4.tgz), `package/LICENSE-MIT`; installed `node_modules/is-url/LICENSE-MIT` | `IS-URL-MIT.txt` |
| regenerator-runtime 0.13.11 | [npm tarball](https://registry.npmjs.org/regenerator-runtime/-/regenerator-runtime-0.13.11.tgz), `package/LICENSE`; installed `node_modules/regenerator-runtime/LICENSE` | `REGENERATOR-RUNTIME-MIT.txt` |
| wasm-feature-detect 1.8.0 | [npm tarball](https://registry.npmjs.org/wasm-feature-detect/-/wasm-feature-detect-1.8.0.tgz), `package/LICENSE`; copied initially from the identical installed 1.9.0 license | `WASM-FEATURE-DETECT-APACHE-2.0.txt` |
| zlibjs 0.3.1 | [npm tarball](https://registry.npmjs.org/zlibjs/-/zlibjs-0.3.1.tgz), `package/LICENSE`; installed `node_modules/zlibjs/LICENSE` | `ZLIBJS-MIT.txt` |
| Jon Leighton's ArrayBuffer/base64 utility, source revision `b0afda76a822c35facc9689384a5e3933325a4df` | [Original gist source](https://gist.githubusercontent.com/jonleighton/958841/raw/b0afda76a822c35facc9689384a5e3933325a4df/base64ArrayBuffer.js); complete MIT comment extracted verbatim. Tesseract's `src/worker-script/utils/arrayBufferToBase64.js` preserves this origin and copyright | `JON-LEIGHTON-MIT.txt` |
| Apache License 2.0, full terms accompanying the idb-keyval notice | Copied from the existing `TESSERACT-JS-APACHE-2.0.txt`, byte-identical to `node_modules/tesseract.js/LICENSE.md`; [upstream v7.0.0 license](https://github.com/naptha/tesseract.js/blob/v7.0.0/LICENSE.md) | `APACHE-2.0.txt` |

The upstream worker's extracted notices remain separately preserved at `../worker.min.js.LICENSE.txt`. The complete Tesseract.js, core and Portuguese trained-data notices already distributed here remain unchanged.

## Native core dependencies

The three installed core variants match the Git blob identifiers in the [Tesseract.js-core v7.0.0 tree](https://github.com/naptha/tesseract.js-core/tree/v7.0.0):

| File | Matching Git blob SHA-1 |
| --- | --- |
| `tesseract-core-lstm.wasm.js` | `57d52b25a1438b086ba0ae8c49e9105957f306b3` |
| `tesseract-core-simd-lstm.wasm.js` | `c831ffec0db84e022ec5be2cdf1d4e4ae797d593` |
| `tesseract-core-relaxedsimd-lstm.wasm.js` | `dbc88c372a923875187d611d527774f169d47561` |

Matching used Git's object calculation, SHA-1 of `blob <byte length>\0` followed by the original file bytes. The `/ocr/` variants are unchanged copies of those installed files, as recorded in `../proveniencia.json`.

The tag's [submodule declarations](https://github.com/naptha/tesseract.js-core/blob/v7.0.0/.gitmodules), pinned tree entries and [build scripts](https://github.com/naptha/tesseract.js-core/tree/v7.0.0/build-scripts) identify the native dependencies below. The Leptonica build links the image libraries. These notices document the upstream build's pinned dependency set; they do not claim that every codec or native function is exercised by the app, and are not a symbol-level audit of the WebAssembly binary.

| Native dependency and pinned commit | Original source | Distributed file |
| --- | --- | --- |
| Leptonica `4af068b56a9674da915debea4ed7e1b9885b17e8` | [leptonica-license.txt](https://raw.githubusercontent.com/DanBloomberg/leptonica/4af068b56a9674da915debea4ed7e1b9885b17e8/leptonica-license.txt) | `LEPTONICA-NOTICE.txt` |
| giflib `fa37672085ce4b3d62c51627ab3c8cf2dda8009a` | [COPYING](https://raw.githubusercontent.com/mirrorer/giflib/fa37672085ce4b3d62c51627ab3c8cf2dda8009a/COPYING) | `GIFLIB-COPYING.txt` |
| Independent JPEG Group libjpeg `6c0fcb8ddee365e7abc4d332662b06900612e923` | [README, including LEGAL ISSUES](https://raw.githubusercontent.com/LuaDist/libjpeg/6c0fcb8ddee365e7abc4d332662b06900612e923/README) | `LIBJPEG-README.txt` |
| libpng `a37d4836519517bdce6cb9d956092321eca3e73b` | [LICENSE](https://raw.githubusercontent.com/glennrp/libpng/a37d4836519517bdce6cb9d956092321eca3e73b/LICENSE) | `LIBPNG-LICENSE.txt` |
| libtiff `b51bb157123264e26d34c09cc673d213aea61fc7` | [COPYRIGHT at the same commit in the libsdl-org mirror](https://raw.githubusercontent.com/libsdl-org/libtiff/b51bb157123264e26d34c09cc673d213aea61fc7/COPYRIGHT); the upstream GitLab raw endpoint returned HTTP 403 during acquisition | `LIBTIFF-COPYRIGHT.txt` |
| libwebp `20ef03ee351d4ff03fc5ff3ec4804a879d1b9d5c` | [COPYING](https://raw.githubusercontent.com/webmproject/libwebp/20ef03ee351d4ff03fc5ff3ec4804a879d1b9d5c/COPYING) | `LIBWEBP-COPYING.txt` |
| libwebp, same commit | [PATENTS](https://raw.githubusercontent.com/webmproject/libwebp/20ef03ee351d4ff03fc5ff3ec4804a879d1b9d5c/PATENTS) | `LIBWEBP-PATENTS.txt` |
| zlib `21767c654d31d2dccdde4330529775c6c5fd5389` | [README, including Copyright notice](https://raw.githubusercontent.com/madler/zlib/21767c654d31d2dccdde4330529775c6c5fd5389/README) | `ZLIB-README.txt` |
| OpenLibm `ae2d91698508701c83cab83714d42a1146dccf85` | [LICENSE.md](https://raw.githubusercontent.com/JuliaMath/openlibm/ae2d91698508701c83cab83714d42a1146dccf85/LICENSE.md) | `OPENLIBM-LICENSE.txt` |
| Tesseract native fork `2a9c1c49c360462733c386d2a44fcd22c4e21411` | [LICENSE](https://raw.githubusercontent.com/Balearica/tesseract/2a9c1c49c360462733c386d2a44fcd22c4e21411/LICENSE) | `TESSERACT-NATIVE-APACHE-2.0.txt` |

This software is based in part on the work of the Independent JPEG Group.
