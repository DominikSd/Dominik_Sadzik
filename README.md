# Dominik Sadzik — strona osobista

Projekt strony osobistej/ofertowej dla usług projektowania stron internetowych i wizytówek online.

## Stack

- React 18
- Vite
- Tailwind CSS
- Framer Motion

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

Build produkcyjny:

```bash
npm run build
```

Właściwym punktem startowym aplikacji jest `index.html`, który ładuje `src/main.jsx`.

## Publikacja na GitHub Pages

Projekt jest przygotowany do publikacji przez GitHub Actions. Po wypchnięciu zmian na gałąź `main` workflow zbuduje aplikację Vite i opublikuje katalog `dist`.

W ustawieniach repozytorium na GitHubie wybierz:

- `Settings` -> `Pages`
- `Build and deployment`
- `Source: GitHub Actions`

Adres strony dla tego repozytorium:

```text
https://dominiksd.github.io/Dominik_Sadzik/
```
