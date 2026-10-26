(function () {
  'use strict';
  const cacheKey = 'futurelearn.english.ipa.us.v1';
  const pending = new Map();
  const maxAge = 30 * 24 * 60 * 60 * 1000;
  let cache = {};
  try {
    const saved = JSON.parse(localStorage.getItem(cacheKey));
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) cache = saved;
  } catch (_) { /* Storage is optional. */ }

  async function getUS(word) {
    const term = word.toLowerCase().trim();
    const saved = cache[term];
    if (saved && typeof saved.text === 'string' && saved.text.length < 100 && Date.now() - saved.at < maxAge) return saved.text;
    if (pending.has(term)) return pending.get(term);
    if (typeof fetch !== 'function') return '';
    const request = (async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(term), { signal: controller.signal });
        if (!response.ok) return '';
        const entries = await response.json();
        if (!Array.isArray(entries)) return '';
        // The API exposes the region in its audio filename, not a locale field.
        const phonetic = entries.flatMap(entry => Array.isArray(entry.phonetics) ? entry.phonetics : [])
          .find(item => item && typeof item.text === 'string' && item.text.trim() && item.text.length < 100 && /-us\.mp3(?:[?#]|$)/i.test(item.audio || ''));
        if (!phonetic) return '';
        const text = '/' + phonetic.text.trim().replace(/^\/+|\/+$/g, '') + '/';
        cache[term] = { text, at: Date.now() };
        try { localStorage.setItem(cacheKey, JSON.stringify(cache)); } catch (_) { /* Keep the in-memory cache. */ }
        return text;
      } catch (_) {
        return '';
      } finally {
        clearTimeout(timeout);
      }
    })();
    pending.set(term, request);
    try { return await request; } finally { pending.delete(term); }
  }
  window.animalPhonetics = { getUS };
})();
