# NoteHub React Frontend

Orange-and-black React/Vite implementation based on the supplied Stitch HTML.

## Run locally

1. Install Node.js (18+ recommended).
2. Open this folder in VS Code.
3. Run:

```bash
npm install
npm run dev
```

4. Open the local URL printed by Vite.

## Routes

- `/` — Home page
- `/signup` — Sign-up UI
- `/login` — Login UI
- `/dashboard` — Interactive dashboard preview

## Notes

- The Home page is converted to reusable React components and CSS.
- Login and signup forms are UI-only placeholders; authentication is not connected.
- Dashboard CRUD works in React state for demonstration, but notes are not persisted to MongoDB.
- Connect the FastAPI backend before treating authentication or storage as production-ready.
