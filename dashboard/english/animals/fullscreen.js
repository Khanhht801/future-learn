(function () {
  'use strict';
  const card = document.querySelector('.flashcard');
  const button = card.querySelector('[data-fullscreen]');
  // Keep exercise feedback inside the element shown by the Fullscreen API.
  card.append(document.querySelector('[data-answer-dialog]'));
  let fallback = false, busy = false;
  let previousFocus = null;
  const outside = new Map();

  function sync() {
    const expanded = fallback || document.fullscreenElement === card;
    card.classList.toggle('is-expanded', expanded);
    button.setAttribute('aria-pressed', String(expanded));
    button.setAttribute('aria-label', expanded ? 'Thoát toàn màn hình' : 'Phóng to toàn màn hình');
    button.title = expanded ? 'Thu nhỏ (Esc)' : 'Toàn màn hình';
    if (!expanded && previousFocus) {
      if (previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
      previousFocus = null;
    }
  }
  function setFallback(enabled) {
    fallback = enabled;
    document.documentElement.classList.toggle('lesson-fullscreen-open', enabled);
    if (enabled) {
      for (let node = card; node.parentElement; node = node.parentElement) {
        for (const sibling of node.parentElement.children) {
          if (sibling !== node) { outside.set(sibling, sibling.inert); sibling.inert = true; }
        }
      }
    } else {
      outside.forEach((inert, node) => { node.inert = inert; });
      outside.clear();
    }
    sync();
    if (enabled) button.focus({ preventScroll: true });
  }
  button.onclick = async () => {
    if (busy) return;
    busy = true;
    try {
      if (fallback) { setFallback(false); return; }
      if (document.fullscreenElement === card) { await document.exitFullscreen(); return; }
      previousFocus = document.activeElement;
      if (card.requestFullscreen && document.fullscreenEnabled !== false) {
        try { await card.requestFullscreen(); sync(); button.focus({ preventScroll: true }); return; }
        catch (_) { /* Use a viewport overlay if native fullscreen is denied. */ }
      }
      setFallback(true);
    } finally { busy = false; }
  };
  document.addEventListener('fullscreenchange', sync);
  document.addEventListener('keydown', event => {
    if (!fallback || card.querySelector('dialog[open]')) return;
    if (event.key === 'Escape') { event.preventDefault(); setFallback(false); }
    if (event.key === 'Tab') {
      const controls = Array.from(card.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]')).filter(node => node.getClientRects().length);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
})();
