// Iframe height sync: tells the parent page how tall this page is, so the
// iframe can be sized to fit. Open the app with ?embed=1 when embedding it.
(function () {
  let lastHeight = 0;
  const THRESHOLD = 2; // Ignore size variations smaller than 2px

  function sendHeight() {
    // Measure body offsetHeight or root scrollHeight
    const body = document.body;

    if (!body) return;

    // Use max of content boundaries, avoiding 100% viewport locking
    let currentHeight = Math.max(body.scrollHeight, body.offsetHeight);

    // Add extra threshold to make sure there is now scrollbar
    currentHeight = currentHeight;

    // Only update if the height difference exceeds our threshold
    if (Math.abs(currentHeight - lastHeight) >= THRESHOLD) {
      lastHeight = currentHeight;
      window.parent.postMessage(
        {
          type: "RESIZE_IFRAME",
          height: currentHeight,
        },
        "*",
      );
    }
  }

  // Set is-embed class on body if embed parameter is present in the URL,
  // or automatically when the page is loaded inside an iframe (e.g. WordPress
  // embed code without ?embed=1). Without it, the page keeps its full-window
  // minimum height, which inside an iframe is the iframe's own height, so the
  // reported height could never shrink.
  function isInIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true; // cross-origin parent: we are framed
    }
  }

  function checkEmbed() {
    if (new URLSearchParams(window.location.search).get("embed") === "1" || isInIframe()) {
      document.body.classList.add("is-embed");
    }
  }

  // 1. ResizeObserver handles all content/layout size changes.
  //    DO NOT listen to window 'resize' as iframe resizing triggers it circularly.
  const resizeObserver = new ResizeObserver(() => {
    // Debounce with requestAnimationFrame to prevent multiple calls per frame
    window.requestAnimationFrame(sendHeight);
  });

  // Start observing body once DOM is ready
  if (document.body) {
    checkEmbed();
    resizeObserver.observe(document.body);
  } else {
    window.addEventListener("DOMContentLoaded", () => {
      checkEmbed();
      resizeObserver.observe(document.body);
    });
  }

  // 2. Ensure initial height measurement after images/fonts finish loading
  window.addEventListener("load", sendHeight);
})();
