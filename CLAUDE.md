# Range Quiz — Project Guide

## What This Is
A plain HTML/CSS/JS quiz web app for high school students studying for the Texas Range Plant contest. Students are shown a plant name and must select the correct characteristics by clicking buttons. No build step — open `index.html` directly in a browser.

## Files
| File | Purpose |
|------|---------|
| `index.html` | Shell — loads style.css and app.js, renders into `<div id="app">` |
| `style.css` | Mobile-first styles, fits one screen without scrolling on 375px+ phones |
| `app.js` | All plant data (90 plants) + complete quiz engine |
| `CharacteristicsList.pdf` | Source answer key from contest organizers |
| `.claude/launch.json` | Ruby static server on port 3400 for preview tool |

## Plant Data Schema (in app.js)
```js
{
  id:        1,           // 1–90, matches PDF numbering
  name:      'Big Bluestem',
  scientific:'Andropogon gerardii',
  type:      'grass',     // 'grass' | 'legume' | 'forb' | 'woody'
  stature:   'T',         // 'S'|'M'|'T' — GRASSES ONLY; null for all others
  lifecycle: 'P',         // 'A'=Annual | 'P'=Perennial
  season:    'W',         // 'W'=Warm | 'C'=Cool
  origin:    'N',         // 'N'=Native | 'In'=Introduced
  invasive:  false,       // boolean
  desirable: true         // boolean (D=true, U=false)
}
```

**Plant counts:** 38 grasses (1–38), 7 legumes (39–45), 28 forbs (46–73), 17 woodies (74–90)

**Known data issue:** Blackeyed Susan (#49) has `OR=M` in the source PDF (highlighted red) — treated as Native (`N`). Confirm with teacher.

## Quiz Logic Flow
1. `initQuiz()` — Fisher-Yates shuffles all 90 plants into `state.queue`, resets state, calls `render()`
2. `render()` — if index ≥ queue length, shows results screen; otherwise renders question card
3. Student clicks buttons → `handleChoiceClick` → stores string value in `state.answers[category]`
4. `checkSubmitEnabled()` — enables Submit only when all required categories have a selection
5. `submitAnswers()` — compares `state.answers` to plant data (booleans cast to strings via `getCorrectValue`), applies `.correct`/`.incorrect` CSS classes, tallies score
6. `nextPlant()` — increments index, resets answers, calls `render()`
7. Results screen — shows plants fully correct / 90 and characteristic accuracy %

**Scoring:** `state.score = { plants: 0, chars: 0, charsTotal: 0 }`
- `plants` = count of plants where every characteristic was correct
- `chars` = total individual characteristics correct
- `charsTotal` = total characteristics answered (5 per non-grass, 6 per grass)

## Key Implementation Details
- **Stature row** only renders for `plant.type === 'grass'` (handled in `getCategories()`)
- **Boolean comparison:** invasive/desirable stored as `'true'`/`'false'` strings in button `data-value`; `getCorrectValue()` returns `String(plant.invasive)` etc.
- **Event delegation** on `#characteristics` container — one listener handles all button clicks
- **Submit button** transitions to "Next Plant →" / "See Results" after submission; gets `.correct-btn` green style if plant was fully correct
- **CSS custom properties** in `:root` for all colors — easy to retheme
- **`100dvh`** used instead of `100vh` to handle mobile browser chrome correctly

## QUIZ_CONFIG (top of app.js) — Future Extension Point
```js
const QUIZ_CONFIG = {
  mode:   'immediate', // 'immediate' | 'end-review' (future)
  filter: 'all',       // 'all' | 'grass' | 'forb' | 'legume' | 'woody' (future)
  count:  null         // null = all; number = random subset (future)
};
```
Only `mode: 'immediate'` is implemented. The architecture is wired for future modes without structural changes.

## Planned Future Features
- **Filter by plant type** (grass / forb / legume / woody) — use `QUIZ_CONFIG.filter`
- **Custom quiz count** (e.g., quiz on 20 random plants)
- **End-of-quiz review mode** — no per-plant feedback; show all answers at the end
- **User accounts + score history** — requires a backend (not started)
- **Running averages / leaderboard** — depends on backend

## How to Preview
Open `index.html` directly in any browser — no server needed. The `.claude/launch.json` serves via Ruby's WEBrick on port 3400 for the Claude Code preview panel, but the app works as a plain `file://` URL.

## CSS Layout Summary
- Max-width 520px, centered on desktop (border added ≥521px)
- Header: ~78px (dark green, progress bar, score line)
- Card: remaining `dvh` — flex column with `margin-top: auto` on action area
- Compact media query at `max-height: 599px` reduces padding/font sizes for small screens
- Color vars: `--green-dark #2d5a3d`, `--green-mid #4a8c5c`, `--correct #1e7e44`, `--incorrect #b91c1c`, `--blue #2563a8`
