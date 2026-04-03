# Easter Hunt 2026

## Frontend-only architecture for a GitHub Pages scavenger hunt

### Goals and constraints
- Hosted free on **GitHub Pages** with a custom domain.
- URL pattern per clue: `https://yourdomain.com/<uuid>`.
- Each clue page should:
  - show a question,
  - accept an answer,
  - reveal hints,
  - validate correctness,
  - unlock the next clue URL.
- Final page requires a **Snake score of 100**.

---

## Recommended stack

- **Vite + React + Tailwind CSS**
- **React Router** for clue routes
- **TypeScript** (recommended) for safer clue and validation logic

This app should stay **frontend-only**.

---

## App design

### Route model
Use a dynamic route:
- `/:clueId`

For GitHub Pages compatibility, choose one:
1. **Hash routing (`/#/<uuid>`)** for easiest direct-link reliability on static hosting.
2. Browser routing with static-host fallback handling.

For least friction on Pages, hash routing is usually best.

### Clue data model
Store clue definitions in `src/data/clues.ts`:

- `id` (UUID)
- `question`
- `acceptedAnswers`
- `hints` (progressive hints)
- `nextClueId`
- `type` (`question` | `snake`)
- optional metadata (`title`, `difficulty`, etc.)

### Validation and services
Keep logic out of JSX and routes:
- `src/services/clueService.ts` → load/find clue by ID
- `src/services/answerValidation.ts` → normalize + validate answers
- `src/services/progressStorage.ts` → localStorage persistence

Normalize input before comparison:
- trim,
- lowercase,
- collapse spaces,
- optionally strip punctuation.

### Hint and scoring behavior
- Progressive hints (Hint 1 → Hint 2 → Hint 3).
- Track attempts and hint usage.
- Optional final summary score (e.g., fewer hints = higher score).

### Progress tracking
Persist in `localStorage`:
- solved clue IDs,
- attempts per clue,
- hint usage,
- snake high score.

Note: in frontend-only apps, users can inspect/modify client state. For a scavenger hunt, this is usually acceptable.

---

## Snake final challenge

Create a dedicated page component (`SnakeChallengePage`):
- Require score `>= 100`.
- On success, reveal final completion text/code.
- Persist top score in `localStorage`.

---

## Suggested structure

```text
src/
  components/
    AnswerForm.tsx
    HintPanel.tsx
    ProgressBadge.tsx
  pages/
    CluePage.tsx
    SnakeChallengePage.tsx
    NotFoundPage.tsx
  hooks/
    useClueProgress.ts
    useHintState.ts
  services/
    clueService.ts
    answerValidation.ts
    progressStorage.ts
  utils/
    normalizeInput.ts
  data/
    clues.ts
  App.tsx
```

This keeps concerns separated and aligns with reusable React service patterns.

---

## Deployment (GitHub Pages + custom domain)

1. Build with Vite (`npm run build`).
2. Deploy `dist/` to GitHub Pages (GitHub Actions recommended).
3. Configure custom domain in Pages settings.
4. Add/update `CNAME`.
5. Configure DNS at registrar.
6. Verify direct links for clue routes work correctly.

---

## Implementation phases

1. **MVP**
   - UUID route loading,
   - answer input + validation,
   - hint reveals,
   - next clue navigation,
   - snake final gate.
2. **Polish**
   - responsive UI refinement,
   - improved transitions/feedback,
   - summary screen.

---

## Final recommendation

Use **Vite + React + Tailwind** as a **frontend-only** app on GitHub Pages, with UUID-driven routes, service-based validation logic, localStorage progress tracking, and a dedicated Snake challenge page requiring a score of 100.
