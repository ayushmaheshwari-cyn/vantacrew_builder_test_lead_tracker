# Mini Lead Tracker

A single-page sales prospect tracker — built with React 18 + TailwindCSS + Vite. No backend. Data persists in `localStorage`.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 18 (Vite) | Fast HMR, minimal config, JSX out of the box |
| Styling | TailwindCSS v3 | Utility classes keep styles co-located with markup |
| Persistence | `localStorage` | Zero-dependency, no auth, data survives refresh |
| Icons | Inline SVG | No extra dependency, crisp at any size |

## Running locally

```bash
git clone <your-repo-url>
cd lead-tracker
npm install
npm run dev
# → opens at http://localhost:5173
```

## Features

- Add, edit, delete prospects (delete requires confirmation)
- Filter list by stage (Lead → Contacted → Qualified → Proposal → Won → Lost)
- Stage counter cards at the top — clickable for quick filtering
- Search by name, company, or email
- `localStorage` persistence — no backend required

## Architectural decisions

### 1. Single `modal` state object instead of multiple booleans

```js
const [modal, setModal] = useState(null)
// null | { type: 'add' } | { type: 'edit', lead } | { type: 'delete', lead }
```

One value holds both *which* modal is open and *which* record it concerns.
Eliminates impossible states (two modals open at once) and means `setModal(null)` closes everything.

### 2. `persist()` helper — write co-located with mutation

```js
function persist(next) {
  setLeads(next)
  localStorage.setItem('vanta_leads', JSON.stringify(next))
}
```

Every mutation calls `persist()` synchronously. A `useEffect` watcher would add a render-cycle lag and can silently miss writes on unmount. Keeping writes explicit makes data flow easy to trace.

### 3. Computed `visible` array — no derived state

Filtered and searched list is computed with `useMemo` from the three source-of-truth values. No secondary state array to keep in sync. Prevents the classic "list out of sync after delete" bug.

## What I'd improve with 3 more hours

1. **Kanban board view** — a column-per-stage layout would make pipeline status far more scannable
2. **CSV import / export** — one-click export for spreadsheet users; import for bulk onboarding
3. **Inline stage toggle** — click the badge directly to advance the stage without opening the modal

---

Built for the VantaCrew Builder Onboarding test.
