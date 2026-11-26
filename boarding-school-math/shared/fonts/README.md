# Worksheet print headers

`gfield-print-sans-400.woff2` and `gfield-print-sans-700.woff2` are fixed-weight
instances of the repository's existing OFL font at
`fields-classic/question-bank/assets/fonts/pretendard-var.woff2`
(source Git blob `273d609eb8c742e8b8ff16bcb2e888b16d361a38`).

They retain the source font copyright/license and are renamed **GFIELD Print Sans**
in the font name records, respecting the Reserved Font Names. See `OFL.txt`.
The original variable font and other projects are unchanged.

The static instances avoid missing header glyphs observed when Chromium PDFs
containing the variable face were reopened in PDF viewers. The worksheet's body
continues to use the existing Noto Serif KR faces; the application's screen UI
continues to use its existing font declarations.

Rebuild from this Git checkout with Python `fonttools` and `brotli` installed:

```sh
python scripts/build-paper-print-fonts.py
```

This is a build-only utility. The published site loads the two local WOFF2 files
and requires no font API, CDN, Python or font-building dependency.
