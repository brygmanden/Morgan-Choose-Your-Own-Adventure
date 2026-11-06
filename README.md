# The Café Manager — A Choose Your Own Adventure

**Barista Hustle · Café Management · Social Media and Marketing · Lesson: Getting Started**

An interactive mobile-friendly adaptation of a classic 1980s choice-based paperback. Learners read a realistic café management scenario, select a full-sentence “If you decide to … turn to page X” choice, see a rapid page-riffle animation, and reach one of nine plausible outcomes. Each outcome displays Morgan Eckroth’s illustration, a short quote from her interview, its approximate video timestamp, and an editorial teaching note.

## Run locally

Requires Node.js **22 or later** (for native JSON module imports). No npm packages or install step required.

```bash
npm run dev
```

Open **http://localhost:4173**. The page must be served over HTTP; opening `index.html` directly as `file://` will generally block JavaScript module imports.

## Tests

```bash
npm test
```

## Deploy to GitHub Pages

Push this project to a repository. In GitHub **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/(root)`. This site uses relative links and requires no build step. Once Pages is deployed, share its `https://<account>.github.io/<repo>/` URL.

## Structure

- `index.html`: accessible page shell and navigation.
- `src/main.js`: book UI, navigation, bookmark dialog, fast page-turning transition.
- `src/story.js`: route validation and navigation helpers.
- `src/story-data.json`: editable passages, branching page numbers, ending quotes and interpretations.
- `src/styles.css`: black-and-white paperback layout, readable serif type, mobile styles, reduced-motion support.
- `public/assets/morgan-graphic-novel-avatar.png`: portrait displayed at each ending.
- `reference/Episode 5 Getting Started.vtt`: original interview subtitles, for editorial verification.
- `reference/1980s-paperback-layout-reference.png`: user-supplied visual inspiration.
- `CODEX.md`: detailed product brief and future development checklist.
- `tests/story.test.mjs`: route integrity and asset checks.

## Editorial cautions

The **fictional situations and business outcomes are invented teaching examples**, not Morgan’s statements. Morgan uses **she/they** pronouns. Interview extracts should be checked against the original video before publication, including wording, punctuation, and subtitle timings. The displayed timestamps are editorial cues, not links to edited video clips. Keep the interview as **one uninterrupted video** in the course.

## Accessibility

Semantic buttons, keyboard navigation, focus styles, visible full-page numbers, a journey modal, and `prefers-reduced-motion` support are included. Before production, test screen reader announcements, long quotes on narrow phones, and contrast.
