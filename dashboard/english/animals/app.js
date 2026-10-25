(function () {
  'use strict';
  const words = window.animalWords;
  const state = window.animalProgress.read();
  const $ = selector => document.querySelector(selector);
  let index = Math.max(0, words.findIndex(word => word.id === state.current));
  let mode = 'learn', questionIndex = 0, score = 0, answered = false;
  let exerciseStarted = false;
  const wordGrid = $('[data-word-grid]');
  let drag = null, dragged = false;
  const scrollWords = $('[data-scroll-words]');
  function updateScrollArrow() {
    scrollWords.disabled = wordGrid.scrollLeft + wordGrid.clientWidth >= wordGrid.scrollWidth - 1;
  }
  scrollWords.onclick = () => {
    wordGrid.scrollBy({ left: wordGrid.clientWidth * .8, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  wordGrid.addEventListener('scroll', updateScrollArrow);
  window.addEventListener('resize', updateScrollArrow);

  wordGrid.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    dragged = false;
    drag = { id: event.pointerId, x: event.clientX, scrollLeft: wordGrid.scrollLeft };
  });
  wordGrid.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const distance = event.clientX - drag.x;
    if (!dragged && Math.abs(distance) < 6) return;
    if (!dragged) {
      dragged = true;
      wordGrid.setPointerCapture(drag.id);
      wordGrid.classList.add('is-dragging');
    }
    event.preventDefault();
    wordGrid.scrollLeft = drag.scrollLeft - distance;
  });
  function endDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    const id = drag.id;
    drag = null;
    wordGrid.classList.remove('is-dragging');
    if (wordGrid.hasPointerCapture(id)) wordGrid.releasePointerCapture(id);
  }
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => wordGrid.addEventListener(type, endDrag));
  wordGrid.addEventListener('click', event => {
    if (dragged && event.detail !== 0) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  wordGrid.addEventListener('dragstart', event => event.preventDefault());
  function notice(message) { $('[data-notice]').textContent = message; }
  function stopSpeech() { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); $('[data-speak]').classList.remove('is-speaking'); }
  function save() { state.current = words[index].id; if (!window.animalProgress.save(state)) notice('Không thể lưu trên trình duyệt này. Tiến độ chỉ được giữ trong lần học hiện tại.'); }
  function speak(text) {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) { notice('Trình duyệt chưa hỗ trợ phát âm. Hãy thử Chrome, Edge hoặc Safari.'); return; }
    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; utterance.rate = 0.8;
    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en'));
    if (voice) utterance.voice = voice;
    utterance.onstart = () => { $('[data-speak]').classList.add('is-speaking'); notice('Đang phát âm: ' + text); };
    utterance.onend = () => { $('[data-speak]').classList.remove('is-speaking'); notice('Bấm loa để nghe lại.'); };
    utterance.onerror = event => { $('[data-speak]').classList.remove('is-speaking'); if (!['canceled','interrupted'].includes(event.error)) notice('Chưa phát được âm thanh. Kiểm tra âm lượng, kết nối mạng và thử lại.'); };
    speechSynthesis.speak(utterance);
  }
  function render() {
    const word = words[index], count = state.learned.length;
    $('[data-word]').textContent = word.en;
    $('[data-translation]').textContent = word.vi;
    const exampleParts = word.example.split(word.id);
    const highlightedWord = document.createElement('strong');
    highlightedWord.textContent = word.id;
    $('[data-example]').replaceChildren(document.createTextNode(exampleParts[0]), highlightedWord, document.createTextNode(exampleParts.slice(1).join(word.id)));
    $('[data-animal-image]').src = word.image; $('[data-animal-image]').alt = 'Hình minh họa ' + word.vi.toLowerCase();
    $('[data-speak]').setAttribute('aria-label', 'Nghe phát âm ' + word.en);
    $('.animal-ring').style.setProperty('--percent', count * 10 + '%');
    $('.animal-ring').setAttribute('aria-valuenow', count);
    $('[data-ring-count]').textContent = count + '/10';
    $('[data-summary]').textContent = 'Đã học ' + count + ' từ';
    $('[data-prev]').disabled = index === 0;
    const rewardAmount = document.createElement('strong');
    rewardAmount.textContent = '+20 sao';
    $('[data-reward]').replaceChildren(rewardAmount, document.createTextNode(state.rewarded ? ' đã nhận' : ' khi hoàn thành'));
    $('[data-unlock]').textContent = count === 10 ? 'Đã mở luyện tập và kiểm tra!' : 'Học đủ 10 từ để mở';
    for (const [activity, label] of [['practice', 'Luyện tập'], ['quiz', 'Kiểm tra']]) {
      if (state.results[activity]) $('[data-unlock]').textContent += ' ' + label + ' lần gần nhất: ' + state.results[activity].score + '/10.';
    }
    document.querySelectorAll('[data-mode="practice"], [data-mode="quiz"], [data-start-practice], [data-activity-mode]').forEach(button => {
      button.disabled = count < 10;
      button.querySelector('[data-lock]').toggleAttribute('hidden', count === 10);
      button.title = count < 10 ? 'Học đủ 10 từ để mở' : '';
    });
    const grid = $('[data-word-grid]'); grid.replaceChildren();
    const dots = $('[data-word-dots]'); dots.replaceChildren();
    words.forEach((item, i) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'word-tile';
      button.setAttribute('aria-current', String(i === index));
      button.setAttribute('aria-label', item.en + ', ' + item.vi + (state.learned.includes(item.id) ? ', đã học' : ', chưa học'));
      const image = document.createElement('img'); image.src = item.image; image.alt = ''; image.width = 120; image.height = 80;
      const name = document.createElement('strong'); name.textContent = item.en;
      const meaning = document.createElement('small'); meaning.textContent = item.vi;
      button.append(image, name, meaning);
      if (state.learned.includes(item.id)) { const check = document.createElement('span'); check.className = 'learned-check'; check.textContent = '✓'; button.append(check); }
      const selectWord = () => { stopSpeech(); index = i; setMode('learn'); save(); };
      button.onclick = selectWord;
      grid.append(button);
      const dot = document.createElement('button'); dot.type = 'button'; dot.className = 'word-dot';
      dot.setAttribute('aria-current', String(i === index));
      dot.setAttribute('aria-label', 'Từ ' + (i + 1) + ': ' + item.en);
      dot.onclick = selectWord;
      dots.append(dot);
    });
    updateScrollArrow();
  }
  function setMode(next) {
    if (next !== 'learn' && state.learned.length < 10) return;
    if (next === mode && next !== 'learn' && exerciseStarted && questionIndex < words.length) return;
    stopSpeech(); mode = next;
    $('[data-completion]').hidden = true;
    $('[data-learning]').hidden = mode !== 'learn'; $('[data-exercise]').hidden = mode === 'learn';
    document.querySelectorAll('[data-mode]').forEach(button => { button.classList.toggle('is-active', button.dataset.mode === mode); if (button.dataset.mode === mode) button.setAttribute('aria-current','step'); else button.removeAttribute('aria-current'); });
    if (mode === 'learn') render(); else { exerciseStarted = true; questionIndex = 0; score = 0; renderQuestion(); }
  }
  function renderQuestion() {
    answered = false;
    $('[data-question-next]').hidden = true; $('[data-feedback]').textContent = '';
    $('[data-exercise-speak]').hidden = false;
    const target = words[questionIndex];
    $('[data-question]').textContent = mode === 'practice' ? 'Nghe và chọn hình · ' + (questionIndex + 1) + '/10' : 'Chọn nghĩa của “' + target.en + '” · ' + (questionIndex + 1) + '/10';
    const choices = [target, words[(questionIndex + 1) % 10], words[(questionIndex + 3) % 10], words[(questionIndex + 6) % 10]].sort(() => Math.random() - .5);
    const host = $('[data-answers]'); host.replaceChildren();
    choices.forEach(word => {
      const button = document.createElement('button'); button.type = 'button';
      if (mode === 'practice') { const img = document.createElement('img'); img.src = word.image; img.alt = word.vi; button.append(img); } else button.textContent = word.vi;
      button.onclick = () => {
        if (answered) return; answered = true;
        const correct = word.id === target.id; if (correct) score++;
        button.classList.add(correct ? 'correct' : 'incorrect');
        host.querySelectorAll('button').forEach(item => item.disabled = true);
        $('[data-feedback]').textContent = (correct ? 'Đúng rồi! ' : 'Đáp án đúng: ') + target.en + ' – ' + target.vi;
        $('[data-question-next]').hidden = false; $('[data-question-next]').textContent = questionIndex === 9 ? 'Xem kết quả' : 'Câu tiếp theo →';
      };
      host.append(button);
    });
  }
  $('[data-question-next]').onclick = () => {
    if (mode === 'learn' || !answered || questionIndex >= words.length) return;
    answered = false;
    stopSpeech();
    if (++questionIndex < 10) renderQuestion();
    else {
      state.results[mode] = { score, completedAt: new Date().toISOString() };
      save();
      $('[data-question]').textContent = 'Hoàn thành!'; $('[data-answers]').replaceChildren(); $('[data-feedback]').textContent = 'Bạn trả lời đúng ' + score + '/10 câu. Chọn bước phía trên để học hoặc chơi lại.'; $('[data-question-next]').hidden = true; $('[data-exercise-speak]').hidden = true;
    }
  };
  $('[data-exercise-speak]').onclick = () => { if (questionIndex < 10) speak(words[questionIndex].en); };
  $('[data-speak]').onclick = () => speak(words[index].en);
  $('[data-prev]').onclick = () => { stopSpeech(); if (index > 0) index--; save(); render(); };
  $('[data-next]').onclick = () => {
    stopSpeech();
    const wasComplete = state.learned.length === words.length;
    if (!state.learned.includes(words[index].id)) state.learned.push(words[index].id);
    if (state.learned.length === 10 && !state.rewarded) { state.rewarded = true; notice('Tuyệt vời! Bạn đã học đủ 10 từ và nhận 20 sao cho bài này.'); }
    if (!wasComplete && state.learned.length === words.length) {
      save(); render();
      $('[data-learning]').hidden = true;
      $('[data-exercise]').hidden = true;
      $('[data-completion]').hidden = false;
      $('#completion-title').focus();
      return;
    }
    if (index < 9) index++;
    else if (state.learned.length < 10) { index = words.findIndex(word => !state.learned.includes(word.id)); notice('Cùng học nốt những từ còn lại nhé!'); }
    else { save(); render(); setMode('practice'); return; }
    save(); render();
  };
  document.querySelectorAll('[data-mode]').forEach(button => button.onclick = () => setMode(button.dataset.mode));
  document.querySelectorAll('[data-activity-mode]').forEach(button => button.onclick = () => setMode(button.dataset.activityMode));
  $('[data-start-practice]').onclick = () => setMode('practice');
  $('[data-completion-practice]').onclick = () => {
    setMode('practice');
    $('[data-exercise-speak]').focus();
  };
  $('[data-completion-review]').onclick = () => {
    index = 0; setMode('learn'); save(); $('[data-speak]').focus();
  };
  window.addEventListener('pagehide', stopSpeech);
  window.addEventListener('storage', event => {
    if (event.key !== window.animalProgress.key && event.key !== null) return;
    Object.assign(state, window.animalProgress.read());
    index = Math.max(0, words.findIndex(word => word.id === state.current));
    setMode('learn');
    notice('Tiến độ đã thay đổi ở tab khác. Đã cập nhật; hãy chọn bước để tiếp tục.');
  });
  render();
})();
