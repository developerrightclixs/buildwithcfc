# Changes made — 23 October 2026

## 1. Contact page – licensing line

**Client said:** Remove "Fully licensed and insured for work throughout South Carolina." Nothing replaces it. We do not make licensing claims on the site.

**What was done:** Removed the whole "Licensed & Insured" item from the contact details, heading and icon included, since the heading alone is still a licensing claim. No other licensing wording exists on the site.

## 2. Homepage – What We Build

**Client said:** Remove the "Owner's Representation & Construction Management" card. That service is on hold. Three cards is fine.

**What was done:** Card removed. The section now shows Custom Homes, Whole-Home Renovations and Doors, Windows & Millwork in a single row of three (`css/style.css`, new three-up tile layout).

## 3. About page – residential wording

**Client said:** The About page still says "Large or Small, Commercial or Residential" and describes serving commercial clients. Make it match the residential site.

**What was done:**
- Heading "Large or Small, Commercial or Residential" → "Large or Small, Built for Your Home".
- Opening paragraph: "Whether commercial or residential, every project gets our full attention" → "From a single room to a whole new home, every project gets our full attention."
- Principals paragraph: hotels, schools and public buildings are now described as the principals' past California work, and the firm today is described as serving homeowners in Columbia, Lexington and the Midlands.
- Services intro: "Our satisfied clientele come from all areas" → "Whether you are building new or renovating, our work is guaranteed…"

**Not changed (outside this request):** the homepage still mentions commercial work in three places — the Welcome section ("commercial and residential markets"), the What We Do intro ("Large or small, commercial or residential") and the New Construction card ("commercial buildings").

## Files touched

`index.html`, `about.html`, `contact.html`, `css/style.css`

---

# Changes made — 15 September 2026

Summary of what the client asked for and what was done, in plain words.

## 1. Counters (the animated numbers)

**Client said:** The numbers animate but drop back to zero instead of staying at the final number. Also, nobody has given us real figures for those four numbers yet — don't show any numbers until Mark sends the real values.

**What was done:**
- Fixed the counter script (`js/main.js`) so each number animates only once and then stays at its final value. It can no longer restart from zero.
- The stats block stays on the homepage and the About page. The numbers count up the **first** time they scroll into view; after that (scrolling back, reloading, or moving between pages in the same visit) they show the final value straight away with no animation.
- **Still needed from Mark:** the real numbers for **years of experience**, **landmark projects** and **guaranteed work**. The current values are placeholders and can be swapped in a minute.

## 2. The "30 years" wording

**Client said:** Some text reads as if Better Build SC (the company) has been around in California for 30 years. That is wrong — BBSC is a brand-new South Carolina company. The 30 years of experience belongs to the **people** (the principals / the team), not the company. Change the wording everywhere to make that clear.

**What was done (exact wording the client gave):**
- **Top banner, all six pages:** now reads "Thirty years of California building, now in South Carolina. Our team has moved east and is serving Columbia, Lexington and the surrounding Midlands."
- **Homepage – Markets section:** now reads "Our principals spent more than 30 years building across California — hotels, schools, public buildings and custom homes. Better Build SC brings that experience to Columbia, Lexington and the surrounding Midlands."
- **Homepage – About section:** now reads "Our team spent three decades building in California — landmark hotels, schools, city buildings and custom homes. Better Build SC was founded to bring that team and those standards to South Carolina."
- **Badge on the staircase photo (homepage):** "30+ Years Building" → "30+ Years of Team Experience". The same badge on the About page was changed to match.

**Extra spots fixed on the About page** (same problem, client said "match that everywhere else"):
- "Our Story" paragraph — no longer says BBSC was founded in California; it now credits the principals and project managers.
- Page description (the text Google shows) — now says the firm's *principals* bring 30+ years.
- "BBSC has played an integral part in…" → "Our principals have played an integral part in…"

## 3. Infrared inspections page

**Client said:** Need to check whether South Carolina requires a home inspector licence before this page goes live. Leave it as is for now.

**What was done:** Nothing — page untouched, waiting on the client.

## 4. Service area (Columbia and Lexington)

**Client said:** Confirming these with Mark; will let us know if it changes.

**What was done:** Nothing — wording unchanged, waiting on the client.

## Files touched

`index.html`, `about.html`, `contact.html`, `gallery.html`, `projects.html`, `infrared-home-inspections.html`, `js/main.js`

Changes are in the working folder and not yet committed to git.
