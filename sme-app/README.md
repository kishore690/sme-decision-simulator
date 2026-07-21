# SME Decision Simulator

A premium, fintech-styled frontend demo for simulating SME business decisions — hiring, pricing, loans, expansion — before committing real money. Frontend only, dummy data throughout.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Tech stack

- React 18 + Vite
- Tailwind CSS (dark mode via class strategy, toggle built into the navbar)
- Recharts for charts
- lucide-react for icons

## Structure

- `src/App.jsx` — the entire application (navbar, all pages, simulation logic, chat, charts)
- `src/main.jsx` — React entry point
- `src/index.css` — Tailwind directives

No backend, authentication, or API calls are implemented — everything is dummy/demo data as specified in the brief.
