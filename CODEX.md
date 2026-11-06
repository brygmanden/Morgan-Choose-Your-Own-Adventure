# Codex implementation brief

## Objective
Ship a production-quality interactive book for Barista Hustle’s “Getting Started” lesson, based on Morgan Eckroth’s interview. The entire interview is a single video elsewhere in the lesson; this activity follows it and requires **no video editing**.

## User experience
1. The reader opens on page 1. Ordinary novel-like text, no app-like dashboard.
2. Each option is written as an entire italic sentence: “If you decide to … turn to page 12.”
3. Selecting an option triggers a **rapid riffle of several paper sheets**, updating the page and its number.
4. Page numbers deliberately jump (1 → 12 → 52, etc.), reproducing the old adventure-book convention.
5. `Your journey` displays the route so far and allows returning to earlier pages. `Previous page` and `Start again` also work.
6. Every branch is defensible: nine distinct consequences, none graded right/wrong.
7. Ending pages contain an authentic Morgan quotation, a black-and-white graphic-novel portrait, timestamp, and editorial interpretation.

## Non-negotiable creative direction
- Match the supplied scanned 1980s adventure-book spread, not a faux leather/parchment fantasy book or a social feed.
- Off-white paper, black ink, a *single large, consistently sized serif text treatment*. Avoid big display heads, colourful buttons, badges, UI icons, and unrelated graphics.
- Plenty of blank space; choices separated by a thin rule near the bottom of shorter passages.
- Keep the body comfortable on phones (18–20px), natural prose rather than clipped AI-sounding taglines.
- Use only the supplied Morgan illustration on ending pages, where it becomes a small, deliberate visual interruption.
- Fast and clear motion; never sacrifice accessibility or performance for an animation.

## Current data model
`src/story-data.json` maps page number strings to either `{paras, choices}` or `{paras, quote, time, lesson}`. Choices are `[decisionFragment, destinationPage]`.

## Priorities for Codex
1. Run `npm test` and serve the app to verify every branch and portrait loading.
2. Improve the flip animation if necessary: clear page edges, 5–8 sheets riffling in roughly 0.7–0.9 seconds, destination readable immediately afterwards. Handle rapid repeated taps, backwards navigation, and `prefers-reduced-motion`.
3. Refine small-screen layouts (320, 375, 390, 430px), and test Chrome, Safari, iOS. Avoid horizontal scrolling.
4. Review all quotes and timecodes against the VTT and final video. The current extracts originate in an earlier editorial prototype; do not treat unverified punctuation or timestamps as approved. Preserve verbatim wording when quoting. Mark corrected quotations for review.
5. Add quality-of-life features only when consistent with the physical-book metaphor: a quiet page-edge treatment, a subtle paper texture, a more natural animated reverse flip, and perhaps a visually unobtrusive persistent bookmark.
6. Prepare optional LMS integration hooks for completion and optional anonymous branch analytics, but **do not require tracking** or external services.

## QA / acceptance
- Nine endings are reachable and no dead links.
- Every ending shows Morgan’s illustration, timestamp, quote and teaching note.
- No action requires a mouse; all buttons use keyboard focus styles.
- A reader can always find their route and retrace it.
- All pages are legible on a phone without pinch-zooming.
- The animation finishes promptly and honours reduced-motion.
- No runtime errors or 404s when deployed to GitHub Pages under a repository subpath.
- No remote fonts, libraries or APIs required.

## Content boundaries
Keep the interactive scenarios distinct from Morgan’s verbatim comments. Morgan uses she/they pronouns. The user wants balanced practical advice for both café staff and managers, not marketing hype. Preserve British spelling, natural language, and a restrained editorial voice.
