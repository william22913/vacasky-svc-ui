<!-- origin: project-setup, kind: fe -->
# vacasky-svc-ui

Public tour and travel web app for vacasky-svc. React 18.2 + Vite 5 +
JavaScript/JSX, Ant Design 4.24, react-router-dom 6, axios 1.7,
self-hosted Anton and Inter fonts, PWA through vite-plugin-pwa.

## Conventions

- API flow: `src/core/api` (client + adapter) -> `src/core/services` ->
  feature hooks -> pages. Pages never call axios directly.
- One API base URL in `src/core/api/client.js`, from `VITE_API_BASE_URL`.
- Design tokens live in `src/styles/tokens.css`; no colour or type value is
  hard-coded outside it.
- `npm run dev`, `npm run build`, `npm run lint`, `npm run test`,
  `npm run test:e2e`.

## Feature docs

- FEAT-001: [spec](docs/FEAT-001/spec.md), [UI map](docs/FEAT-001/UIMap.md),
  [test cases](docs/FEAT-001/testcase.md) and
  [architecture](docs/FEAT-001/architecture.md).
