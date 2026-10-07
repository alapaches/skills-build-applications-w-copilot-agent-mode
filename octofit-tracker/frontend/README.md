# OctoFit Tracker presentation tier

The React 19 and Vite frontend talks to the Express API on port 8000. In
GitHub Codespaces, Vite forwards the provided `CODESPACE_NAME` to
`import.meta.env.VITE_CODESPACE_NAME` automatically. To set or override it,
define `VITE_CODESPACE_NAME` in `octofit-tracker/frontend/.env.local` so the API
URL resolves to
`https://$CODESPACE_NAME-8000.app.github.dev`:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

Vite reads this variable at startup, so restart the frontend after changing
`.env.local`. When neither `VITE_CODESPACE_NAME` nor `CODESPACE_NAME` is set,
the app uses `http://localhost:8000` as a safe local-development fallback.

Start the frontend with:

```bash
npm run dev --prefix octofit-tracker/frontend
```
