(function () {
  'use strict';
  const key = 'futurelearn.english.animals.v1';
  const ids = ['dog','cat','bird','fish','rabbit','lion','elephant','monkey','tiger','duck'];
  function normalize(value) {
    const source = value && typeof value === 'object' ? value : {};
    const learned = [...new Set(Array.isArray(source.learned) ? source.learned.filter(id => ids.includes(id)) : [])];
    return { learned, current: ids.includes(source.current) ? source.current : ids[0], rewarded: learned.length === 10 && source.rewarded === true };
  }
  window.animalProgress = {
    read() { try { return normalize(JSON.parse(localStorage.getItem(key))); } catch (_) { return normalize(null); } },
    save(state) { try { localStorage.setItem(key, JSON.stringify(normalize(state))); return true; } catch (_) { return false; } }
  };
})();
