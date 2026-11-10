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

## Embed in an iframe

The app detects when it is loaded inside an iframe (in `src/main.js`; adding `?embed=1` also works) and then drops its full-window minimum height, so the reported height is the content height. `src/embed-resize.js` posts its content height to the parent page whenever it changes:

```js
{ type: "RESIZE_IFRAME", height: 1146 }
```

`src/main.js` also sends the page's exact height (the book page plus the desktop padding) with the same message after every render: after every page turn, when the window changes size and once fonts are ready. If the page is ever taller than what the iframe shows, it sends the full height again once a second until the iframe fits.

To diagnose a sizing problem on the embedding page, add `debug=1` to the iframe address (for example `?embed=1&debug=1`). A panel at the top of the app then shows the page height, the iframe's visible height and the last height sent.

The parent page listens for that message and sets the iframe's height:

```html
<iframe id="cafe-manager" src="https://<account>.github.io/<repo>/?embed=1" style="width:100%;border:0" scrolling="no"></iframe>
<script>
  window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "RESIZE_IFRAME") {
      document.getElementById("cafe-manager").style.height = event.data.height + "px";
    }
  });
</script>
```

## Structure

- `index.html`: accessible page shell and navigation.
- `src/embed-resize.js`: posts the page height to an embedding parent page (see *Embed in an iframe*).
- `src/main.js`: book UI, navigation (Previous page, Start again), fast page-turning transition.
- `src/story.js`: route validation and navigation helpers.
- `src/story-data.json`: editable passages, branching page numbers, ending quotes and interpretations.
- `src/styles.css`: old gamebook paperback look (the photographed page as paper, worn, faded print), mobile styles, reduced-motion support.
- `index.html` also holds the SVG print-effect filters (ragged paper, worn ink, dry brush) and the coffee-cup icon.
- `public/assets/old-paper.webp`: photograph of a real old book page (transparent background), drawn as a nine-slice border image so its corners keep their shape at any page size.
- `public/fonts/`: self-hosted Bitter typeface (SIL Open Font License), so no remote fonts are needed.
- `public/assets/morgan-graphic-novel-avatar.png`: portrait displayed at each ending.
- `reference/Episode 5 Getting Started.vtt`: original interview subtitles, for editorial verification.
- `reference/1980s-paperback-layout-reference.png`: user-supplied visual inspiration.
- `CODEX.md`: detailed product brief and future development checklist.
- `tests/story.test.mjs`: route integrity and asset checks.

## Editorial cautions

The **fictional situations and business outcomes are invented teaching examples**, not Morgan’s statements. Morgan uses **she/they** pronouns. Interview extracts should be checked against the original video before publication, including wording, punctuation, and subtitle timings. The displayed timestamps are editorial cues, not links to edited video clips. Keep the interview as **one uninterrupted video** in the course.

## Accessibility

Semantic buttons, keyboard navigation, focus styles, visible full-page numbers, and `prefers-reduced-motion` support are included. Before production, test screen reader announcements, long quotes on narrow phones, and contrast.
