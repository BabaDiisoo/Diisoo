# Diisoo

Diisoo: learn English through French and Wolof. A practice app for daily life, business and exams (IELTS, TOEFL, TOEIC, Cambridge, Duolingo, PTE). Made to be usable by everyone, including people who did not go to school.

Live: https://diisoo.sn

## The 4 main sections

| Section | What it does |
|---|---|
| Anglais | English for daily life, by theme |
| Anglais Wolof | Wolof to English, word by word |
| Business | English for trade, by sector (spare parts, fashion, electronics, furniture, agriculture, logistics and import) plus market English (Colobane, Sandaga, Centenaire, Guangzhou) |
| Examens et visa | The 6 exams, then the test you choose |

## How it works

1. **Choose your level first** (Débutant, Intermédiaire, Avancé).
2. **Choose a theme or sector.**
3. **Learn one card at a time**: listen, repeat, speak.

Advanced levels are locked. To open one, pass a short **placement test** (8 questions, 6 correct answers needed, retry after 24 hours). If an Avancé test fails, a Débutant test decides where you start.

## Voice

- **Wolof voice help**: short spoken instructions in Wolof on each step. They play once per step, then the round 🔊 button repeats them. Human recordings are played first, generated voice is the fallback.
- **WhatsApp-style microphone**: hold to talk, release to send, slide left to cancel. Same gesture everywhere in the app.
- Record your own voice for the help phrases with the hidden tool `https://diisoo.sn/#enregistrer-voix`.

## Technical notes

- Static web app served by GitHub Pages from `main`. Backend: Supabase.
- `index.html` is large. New features are separate classic JS files, loaded in order by `diisoo-secteurs-loader.js` (array `FICHIERS`). Add a new file there instead of editing `index.html`.
- Main feature files:
  - `diisoo-direct.js`: Examens et visa in 2 steps (exam, then test)
  - `diisoo-orga.js`: level, theme, lesson flow for Anglais and Wolof, uniform buttons
  - `diisoo-biz.js`: level, sector, phrases flow for Business
  - `diisoo-passage.js`: placement tests
  - `diisoo-wamic.js`: WhatsApp-style microphone
  - `diisoo-aide-wolof.js`: Wolof voice help
- `sw.js` is a service worker (stale-while-revalidate). After an upload, close and reopen the app twice to get the new version.

## Deploy

Upload files to `main` (https://github.com/babadiisoo/diisoo/upload/main). Never merge the old `test` branch.

## Author

Babacar Dioum, ABC-GLOBAL, Thiès, Sénégal.
