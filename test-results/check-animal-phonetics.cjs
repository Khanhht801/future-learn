const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('dashboard/english/animals/phonetics.js', 'utf8');
function boot(fetch, stored = null, blocked = false) {
  const context = { fetch, AbortController, setTimeout, clearTimeout,
    localStorage: { getItem() { return stored; }, setItem(key, value) { if (blocked) throw Error('blocked'); stored = value; } } };
  context.window = context;
  vm.runInNewContext(source, context);
  return { get: context.animalPhonetics.getUS, stored: () => stored };
}
const response = phonetics => ({ ok: true, json: async () => [{ phonetics }] });
(async () => {
  let calls = 0, release;
  const app = boot(async url => {
    calls++;
    assert.equal(url, 'https://api.dictionaryapi.dev/api/v2/entries/en/bird');
    await new Promise(resolve => { release = resolve; });
    return response([{ text: '/bɜːd/', audio: 'bird-uk.mp3' }, { text: '/bɝd/', audio: 'bird-us.mp3' }]);
  });
  const first = app.get('Bird'), second = app.get('bird');
  assert.equal(calls, 1, 'deduplicate concurrent requests');
  release();
  assert.equal(await first, '/bɝd/');
  assert.equal(await second, '/bɝd/');
  assert.equal(await app.get('bird'), '/bɝd/');
  assert.equal(calls, 1, 'memory cache');
  const cached = boot(() => { throw Error('must use storage'); }, app.stored());
  assert.equal(await cached.get('bird'), '/bɝd/', 'persistent cache');
  assert.equal(await boot(async () => response([{text: '/bɜːd/', audio: 'bird-uk.mp3'}])).get('bird'), '', 'never substitute UK IPA');
  assert.equal(await boot(async () => ({ ok: false })).get('bird'), '', 'HTTP errors');
  assert.equal(await boot(async () => { throw Error('offline'); }).get('bird'), '', 'network errors');
  assert.equal(await boot(async () => ({ok: true, json: async () => ({message: 'invalid'})})).get('bird'), '', 'invalid data');
  assert.equal(await boot(async () => response([{text: 'bɝd', audio: 'bird-us.mp3'}]), '{bad', true).get('bird'), '/bɝd/', 'corrupt or blocked storage');
  const reviewed = {
    bird: ['/bɝd/', '/bɝd/'],
    rabbit: ['/ˈɹæbɪt/', '/ˈræbɪt/'],
    lion: ['/ˈlaɪən/', '/ˈlaɪən/'],
    elephant: ['/ˈɛləfənt/', '/ˈɛləfənt/'],
    monkey: ['/ˈmʌŋki/', '/ˈmʌŋki/'],
    tiger: ['/ˈtaɪɡɚ/', '/ˈtaɪɡɚ/'],
    duck: ['/dʌk/', '/dʌk/']
  };
  for (const [word, [raw, expected]] of Object.entries(reviewed)) {
    const result = boot(async () => response([{ text: raw, audio: `${word}-us.mp3` }]));
    assert.equal(await result.get(word), expected, word + ': reviewed US transcription');
  }
  const oldCache = JSON.stringify({ rabbit: { text: '/ˈɹæbɪt/', at: Date.now() } });
  assert.equal(await boot(() => { throw Error('cache should avoid request'); }, oldCache).get('rabbit'), '/ˈræbɪt/', 'normalize existing cache');
  console.log('PASS: reviewed US IPA fixtures and learner notation for new and cached results');
  console.log('PASS: US IPA selection, concurrent requests, cache, API failures and blocked storage');
})().catch(error => { console.error(error); process.exitCode = 1; });
