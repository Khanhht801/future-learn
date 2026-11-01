(function () {
  'use strict';
  const journeyLink = document.querySelector('.sidebar-journey--learning');
  if (journeyLink) journeyLink.href = '../#math-path';
  const key = 'futurelearn.math.mercury.v3';
  const questionTotals = [10, 10, 10, 10, 10, 10];
  const titles = ['Tô hình theo số', 'Chọn nhóm có số lượng tương ứng', 'Hoàn thiện dãy số', 'So sánh các số', 'Sắp xếp các số', 'Thử thách Sao Thủy'];
  const hints = ['Bấm vào ngôi sao để tô màu. Bấm lại để bỏ màu. Đếm đủ số sao bằng số ở trên nhé!', 'Đếm từng ngôi sao trong mỗi nhóm, rồi chọn nhóm có số lượng đúng.', 'Quan sát thứ tự các số. Kéo số thích hợp vào ô trống để hoàn thiện dãy số.', 'Đếm hoặc đọc hai số. Chọn dấu lớn hơn, bé hơn hoặc bằng nhau.', 'Bấm lần lượt các số từ bé đến lớn. Bấm số đã chọn để bỏ chọn.', 'Vận dụng những điều vừa học. Cứ bình tĩnh đếm từng ngôi sao nhé!'];
  const coloringShapes = [
    { name: 'ngôi sao', image: './assets/chibi-star.webp' },
    { name: 'hình tròn', image: './assets/chibi-circle.webp' },
    { name: 'bông hoa', image: './assets/chibi-flower.webp' },
    { name: 'hình trái tim', image: './assets/chibi-heart.webp' },
    { name: 'hình vuông', image: './assets/chibi-square.webp' }
  ];
  const groupObjects = [
    { name: 'ngôi sao', image: './assets/chibi-star.webp' },
    { name: 'cụm pha lê', image: './assets/chibi-crystal.webp' },
    { name: 'hành tinh', image: './assets/chibi-planet.webp' }
  ];
  const groupQuestions = [
    { target: 4, counts: [3, 4, 5] },
    { target: 2, counts: [2, 1, 3] },
    { target: 6, counts: [5, 7, 6] },
    { target: 3, counts: [4, 3, 2] },
    { target: 5, counts: [5, 6, 4] },
    { target: 8, counts: [7, 8, 9] },
    { target: 1, counts: [2, 3, 1] },
    { target: 7, counts: [7, 6, 8] },
    { target: 9, counts: [8, 10, 9] },
    { target: 10, counts: [9, 10, 8] }
  ];
  const coloringTargets = [7, 3, 0, 10, 5, 2, 8, 4, 9, 6];
  const sequenceQuestions = [
    { start: 2, blank: 2 }, { start: 0, blank: 1 },
    { start: 4, blank: 3 }, { start: 1, blank: 0 },
    { start: 6, blank: 4 }, { start: 3, blank: 1 },
    { start: 5, blank: 2 }, { start: 0, blank: 4 },
    { start: 2, blank: 0 }, { start: 4, blank: 3 }
  ];
  const comparisonPairs = [[2,5],[7,3],[4,4],[0,1],[10,8],[6,9],[8,2],[0,0],[9,10],[5,1]];
  const sortingSets = [[3,1,2],[5,0,2],[8,6,7],[10,8,9],[4,2,3],[6,1,4],[9,3,0],[7,5,2],[10,6,1],[8,4,0]];
  const $ = id => document.getElementById(id);
  let scores = [0, 0, 0, 0, 0, 0];
  try {
    const current = localStorage.getItem(key);
    const previous = current === null ? localStorage.getItem('futurelearn.math.mercury.v2') : null;
    const legacy = current === null && previous === null;
    const saved = JSON.parse(current !== null ? current : previous !== null ? previous : localStorage.getItem('futurelearn.math.mercury.v1'));
    if (Array.isArray(saved) && saved.length === questionTotals.length) {
      scores = saved.map((n, i) => {
        const limit = current !== null ? questionTotals[i] : legacy || i !== 0 ? 5 : 10;
        if (!Number.isInteger(n) || n < 0 || n > limit) return 0;
        // Preserve completion and unlocked missions from either earlier question-count version.
        return current === null && n === limit ? questionTotals[i] : n;
      });
      for (let i = 1; i < scores.length; i++) if (scores[i - 1] < questionTotals[i - 1]) scores[i] = 0;
    }
  } catch (_) { /* Storage is optional. */ }
  let mission = Math.max(0, scores.findIndex((n, i) => n < questionTotals[i]));
  let question = 0, selection = null, ordered = [], checked = false, finished = false;
  function save() { try { localStorage.setItem(key, JSON.stringify(scores)); } catch (_) { $('storage-note').textContent = 'Trình duyệt chưa lưu được tiến độ. Bé vẫn có thể tiếp tục học trong lượt này.'; } }
  function renderNav() {
    $('missions').replaceChildren();
    titles.forEach((title, i) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'mission-button' + (i === mission ? ' is-current' : '');
      button.disabled = i > 0 && scores[i - 1] < questionTotals[i - 1];
      if (i === mission) button.setAttribute('aria-current', 'step');
      const number = document.createElement('span'); number.className = 'mission-number'; number.textContent = i + 1;
      const label = document.createElement('span'); label.textContent = title;
      const status = document.createElement('span'); status.className = 'mission-status'; status.textContent = button.disabled ? '🔒' : scores[i] === questionTotals[i] ? '✓' : scores[i] + '/' + questionTotals[i];
      const icon = document.createElement('span'); icon.className = 'mission-icon'; icon.setAttribute('aria-hidden', 'true');
      if (i === 0) { const image = document.createElement('img'); image.src = './assets/chibi-star.webp'; image.alt = ''; image.width = 36; image.height = 36; icon.append(image); }
      else icon.textContent = ['','💎','🧩','≶','🔢','🏆'][i];
      button.append(number, icon, label, status); button.addEventListener('click', () => { mission = i; question = scores[i] === questionTotals[i] ? 0 : scores[i]; render(); }); $('missions').append(button);
    });
    $('score').textContent = scores[mission] + '/' + questionTotals[mission]; $('mission-progress').max = questionTotals[mission]; $('mission-progress').value = scores[mission];
    $('progress-note').textContent = scores[mission] === questionTotals[mission] ? 'Đã hoàn thành! Bé có thể chơi lại để ôn tập.' : 'Hoàn thành ' + questionTotals[mission] + ' câu để mở khóa nhiệm vụ tiếp theo nhé!';
    $('journey-count').textContent = 'Đã hoàn thành ' + scores.filter((n, i) => n === questionTotals[i]).length + '/6 nhiệm vụ';
  }
  function type() { return mission === 5 ? question % 5 : mission; }
  function target() { if (type() === 1) return groupQuestions[question].target; return coloringTargets[question]; }
  function choice(label, value, className) {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'choice-button ' + (className || ''); button.textContent = label; button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      if (checked) return;
      if (type() === 4) { const index = ordered.indexOf(value); if (index >= 0) ordered.splice(index, 1); else ordered.push(value); button.setAttribute('aria-pressed', String(ordered.includes(value))); $('sort-answer').textContent = ordered.join('  ') || '…'; }
      else { selection = value; $('activity').querySelectorAll('.choice-button').forEach(b => b.setAttribute('aria-pressed', String(b === button))); }
      $('feedback').textContent = '';
    }); return button;
  }
  let cancelNumberDrag = null;
  function render() {
    if (cancelNumberDrag) cancelNumberDrag();
    checked = false; finished = false; selection = null; ordered = [];
    renderNav(); $('mission-label').textContent = 'Nhiệm vụ ' + (mission + 1) + '/6'; $('question-count').textContent = 'Câu ' + (question + 1) + '/' + questionTotals[mission]; $('hint').textContent = hints[type()];
    document.querySelector('.hint-stars').textContent = '★ ★ ★ ☆ ☆';
    $('feedback').textContent = ''; $('feedback').className = 'feedback'; $('check').textContent = 'Kiểm tra'; $('activity').replaceChildren(); $('instruction').textContent = '';
    const t = type(), n = target(), area = $('activity');
    const heading = ['Hãy tô màu số ngôi sao tương ứng với số:', 'Hãy chọn nhóm có số lượng tương ứng với số:', 'Hoàn thiện dãy số', 'Chọn dấu thích hợp', 'Sắp xếp các số từ bé đến lớn'];
    $('exercise-title').textContent = heading[t];
    document.querySelector('.exercise-panel').classList.toggle('is-group-exercise', t === 1);
    document.querySelector('.hint-panel').classList.toggle('is-group-hint', t === 1);
    document.querySelector('.exercise-panel').classList.toggle('is-sequence-exercise', t === 2);
    document.querySelector('.hint-panel').classList.toggle('is-sequence-hint', t === 2);
    document.querySelector('.exercise-panel').classList.toggle('is-comparison-exercise', t === 3);
    document.querySelector('.hint-panel').classList.toggle('is-comparison-hint', t === 3);
    $('group-hint-robot').hidden = t !== 1 && t !== 2 && t !== 3;
    $('check').hidden = t === 2 || t === 3;
    if (t === 0 || t === 1) { const targetCard = document.createElement('div'); targetCard.className = 'target-number'; targetCard.textContent = n; area.append(targetCard); }
    if (t === 0) {
      const shape = coloringShapes[(mission === 5 ? Math.floor(question / 5) : question) % coloringShapes.length];
      $('exercise-title').textContent = 'Hãy tô màu số ' + shape.name + ' tương ứng với số:';
      $('hint').textContent = 'Bấm vào ' + shape.name + ' để tô màu. Bấm lại để bỏ màu. Đếm đủ số hình bằng số ở trên nhé!';
      selection = 0;
      const grid = document.createElement('div'); grid.className = 'star-grid'; grid.setAttribute('role', 'group'); grid.setAttribute('aria-label', 'Chọn các ' + shape.name + ' để tô màu');
      const hintExample = document.querySelector('.hint-stars');
      hintExample.replaceChildren();
      for (let i = 0; i < 5; i++) {
        const image = document.createElement('img'); image.src = shape.image; image.alt = ''; image.width = 48; image.height = 48;
        image.className = 'hint-shape' + (i < 3 ? ' is-colored' : ''); hintExample.append(image);
      }
      for (let i = 0; i < 10; i++) {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'star-button'; b.setAttribute('aria-label', shape.name + ' ' + (i + 1)); b.setAttribute('aria-pressed', 'false');
        const image = document.createElement('img'); image.src = shape.image; image.alt = ''; image.width = 96; image.height = 96; image.draggable = false; b.append(image);
        b.addEventListener('click', () => {
          if (checked) return;
          const active = b.getAttribute('aria-pressed') === 'true'; b.setAttribute('aria-pressed', String(!active)); selection += active ? -1 : 1;
          $('selected-count').textContent = 'Đã tô ' + selection + ' ' + shape.name; $('feedback').textContent = '';
        }); grid.append(b);
      }
      const count = document.createElement('p'); count.id = 'selected-count'; count.className = 'selection-count'; count.textContent = 'Đã tô 0 ' + shape.name; area.append(grid, count);
      $('instruction').textContent = n === 0 ? 'Số 0 nghĩa là không có ' + shape.name + ' nào được tô màu.' : 'Chạm vào từng ' + shape.name + ' để tô màu nhé!';
    } else {
      const options = document.createElement('div'); options.className = 'answer-options';
      if (t === 1) {
        options.classList.add('group-options'); options.setAttribute('role', 'group'); options.setAttribute('aria-label', 'Chọn một nhóm hình');
        groupQuestions[question].counts.forEach((count, index) => {
          const object = groupObjects[index];
          const button = choice('', count, 'group-choice'); button.dataset.count = count;
          button.setAttribute('aria-label', 'Nhóm ' + (index + 1) + ': ' + count + ' ' + object.name);
          const pictures = document.createElement('span'); pictures.className = 'group-pictures';
          for (let i = 0; i < count; i++) {
            const image = document.createElement('img'); image.src = object.image; image.alt = ''; image.width = 88; image.height = 88; image.draggable = false; pictures.append(image);
          }
          button.append(pictures); options.append(button);
        });
        const example = document.querySelector('.hint-stars'); example.replaceChildren();
        groupObjects.forEach(object => {
          const image = document.createElement('img'); image.src = object.image; image.alt = ''; image.width = 76; image.height = 76; example.append(image);
        });
        const steps = document.createElement('ul'); steps.className = 'group-hint-steps';
        ['Đếm số hình trong từng nhóm.', 'Chọn nhóm có số lượng bằng với số ở trên.', 'Sau đó bấm Kiểm tra.'].forEach(text => { const item = document.createElement('li'); item.textContent = text; steps.append(item); });
        $('hint').replaceChildren(steps);
      }
      if (t === 2) {
        renderSequence(area, options);
      }
      if (t === 3) renderComparison(area, options);
      if (t === 4) { sortingSets[question].forEach(v => options.append(choice(v,v))); const result = document.createElement('p'); result.id = 'sort-answer'; result.className = 'sort-answer'; result.setAttribute('aria-live','polite'); result.textContent = '…'; area.append(result); $('instruction').textContent = 'Bấm các số theo thứ tự. Bấm lại để bỏ chọn.'; }
      area.append(options);
    }
  }
  function attachDragChoice(button, value, drop, buttons, submit, prompt) {
      let pointer = null, ghost = null, moved = false, suppressClick = false, originX = 0, originY = 0;
      const cleanup = () => {
        if (ghost) ghost.remove(); ghost = null; drop.classList.remove('is-over'); button.classList.remove('is-dragging');
        const id = pointer; pointer = null;
        if (id !== null && button.hasPointerCapture(id)) button.releasePointerCapture(id);
        if (cancelNumberDrag === cleanup) cancelNumberDrag = null;
      };
      const inside = event => { const rect = drop.getBoundingClientRect(); return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom; };
      button.addEventListener('pointerdown', event => {
        if (checked || !event.isPrimary || event.button !== 0) return;
        if (cancelNumberDrag) cancelNumberDrag();
        suppressClick = false; moved = false; pointer = event.pointerId; originX = event.clientX; originY = event.clientY;
        button.setPointerCapture(pointer); cancelNumberDrag = cleanup;
      });
      button.addEventListener('pointermove', event => {
        if (event.pointerId !== pointer) return;
        if (!moved && Math.hypot(event.clientX - originX, event.clientY - originY) < 6) return;
        moved = true;
        if (!ghost) { ghost = document.createElement('div'); ghost.className = 'number-drag-ghost'; ghost.textContent = value; ghost.setAttribute('aria-hidden', 'true'); document.body.append(ghost); button.classList.add('is-dragging'); }
        ghost.style.left = event.clientX + 'px'; ghost.style.top = event.clientY + 'px'; drop.classList.toggle('is-over', inside(event));
      });
      button.addEventListener('pointerup', event => {
        if (event.pointerId !== pointer) return;
        const dropped = moved && inside(event); suppressClick = moved; cleanup();
        if (moved) setTimeout(() => { suppressClick = false; }, 0);
        if (dropped) submit(value);
      });
      button.addEventListener('pointercancel', () => { suppressClick = true; cleanup(); });
      button.addEventListener('lostpointercapture', cleanup);
      button.addEventListener('click', () => {
        if (suppressClick) { suppressClick = false; return; }
        if (checked) return;
        selection = value; buttons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
        drop.classList.remove('is-wrong'); $('feedback').textContent = prompt;
      });
  }
  function renderComparison(area, options) {
    const [a, b] = comparisonPairs[question];
    $('exercise-title').textContent = 'Hãy so sánh hai số:';
    $('instruction').textContent = 'Kéo dấu thích hợp vào ô trống nhé!';
    const row = document.createElement('div'); row.className = 'comparison-row';
    row.setAttribute('role', 'group'); row.setAttribute('aria-label', 'So sánh số ' + a + ' và số ' + b);
    const left = document.createElement('span'); left.className = 'comparison-number'; left.textContent = a;
    const slot = document.createElement('button'); slot.type = 'button'; slot.className = 'comparison-slot'; slot.textContent = '?';
    slot.setAttribute('aria-label', 'Ô trống. Chọn một dấu rồi nhấn vào đây để điền.');
    const right = document.createElement('span'); right.className = 'comparison-number'; right.textContent = b;
    row.append(left, slot, right); area.append(row);
    options.classList.add('comparison-options'); options.setAttribute('role', 'group'); options.setAttribute('aria-label', 'Chọn dấu so sánh');
    const labels = { '>': 'Lớn hơn', '<': 'Bé hơn', '=': 'Bằng nhau' };
    const buttons = [];
    const answer = a < b ? '<' : a > b ? '>' : '=';
    function submit(value) {
      if (checked) return;
      selection = value; slot.textContent = value;
      slot.classList.remove('is-over', 'is-wrong');
      if (value !== answer) {
        slot.classList.add('is-wrong');
        slot.setAttribute('aria-label', 'Dấu ' + labels[value].toLowerCase() + ' chưa đúng. Bé thử lại nhé!');
        $('feedback').className = 'feedback'; $('feedback').textContent = 'Chưa đúng rồi. Bé so sánh hai số và thử lại nhé!';
        buttons.forEach(button => button.setAttribute('aria-pressed', 'false')); selection = null;
        return;
      }
      slot.classList.add('is-filled'); slot.disabled = true;
      slot.setAttribute('aria-label', 'Đã điền đúng dấu ' + labels[value].toLowerCase());
      buttons.forEach(button => { button.disabled = true; button.setAttribute('aria-pressed', String(button.textContent === value)); });
      acceptAnswer(); $('check').focus({ preventScroll: true });
    }
    slot.addEventListener('click', () => {
      if (selection === null) { $('feedback').textContent = 'Bé chọn một dấu rồi bấm vào ô trống nhé!'; return; }
      submit(selection);
    });
    ['>', '<', '='].forEach(value => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'choice-button'; button.textContent = value;
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', labels[value] + '. Kéo vào ô trống hoặc nhấn để chọn.');
      attachDragChoice(button, value, slot, buttons, submit, 'Bấm vào ô trống để điền dấu đã chọn.');
      buttons.push(button); options.append(button);
    });
    const alternate = document.createElement('p'); alternate.className = 'comparison-alternative'; alternate.textContent = 'Bé cũng có thể chọn một dấu rồi bấm vào ô trống.'; area.append(alternate);
    const example = document.querySelector('.hint-stars'); example.replaceChildren();
    ['6', '<', '8'].forEach((text, index) => {
      const part = document.createElement('span'); part.textContent = text;
      if (index === 1) part.className = 'comparison-hint-sign';
      example.append(part);
    });
    const steps = document.createElement('ul'); steps.className = 'group-hint-steps';
    ['Quan sát hai số.', 'Chọn > nếu số bên trái lớn hơn, < nếu bé hơn, = nếu bằng nhau.', 'Ví dụ: 6 bé hơn 8 nên chọn dấu <.'].forEach(text => {
      const item = document.createElement('li'); item.textContent = text; steps.append(item);
    });
    $('hint').replaceChildren(steps);
  }
  function renderSequence(area, options) {
    const item = sequenceQuestions[question], answer = item.start + item.blank;
    $('exercise-title').textContent = 'Hãy hoàn thiện dãy số:';
    $('instruction').textContent = 'Kéo số thích hợp vào ô trống nhé!';
    const row = document.createElement('div'); row.className = 'sequence-row'; row.setAttribute('role', 'group'); row.setAttribute('aria-label', 'Dãy số tăng dần, mỗi số hơn số trước 1 đơn vị');
    let drop;
    for (let i = 0; i < 5; i++) {
      const box = document.createElement(i === item.blank ? 'button' : 'span'); box.className = 'sequence-box';
      if (i === item.blank) {
        drop = box; box.type = 'button'; box.classList.add('sequence-drop'); box.textContent = '?';
        box.setAttribute('aria-label', 'Ô trống ở vị trí ' + (i + 1) + '. Chọn một số rồi nhấn vào đây để điền.');
      } else box.textContent = item.start + i;
      row.append(box);
    }
    area.append(row); options.classList.add('sequence-options'); options.setAttribute('role', 'group'); options.setAttribute('aria-label', 'Các số có thể kéo vào ô trống');
    const values = [(answer + 8) % 11, (answer + 3) % 11];
    const answerPosition = [0, 2, 1, 2, 0, 1, 0, 2, 1, 0][question];
    values.splice(answerPosition, 0, answer);
    const buttons = [];
    function submit(value) {
      if (checked) return;
      selection = value;
      if (value !== answer) {
        drop.classList.add('is-wrong'); drop.textContent = '?';
        $('feedback').className = 'feedback'; $('feedback').textContent = 'Chưa đúng rồi. Bé đếm lần lượt các số và thử lại nhé!';
        buttons.forEach(button => button.setAttribute('aria-pressed', 'false')); selection = null;
        return;
      }
      drop.classList.remove('is-wrong', 'is-over'); drop.classList.add('is-filled'); drop.textContent = value;
      drop.setAttribute('aria-label', 'Đã điền đúng số ' + value); drop.disabled = true;
      buttons.forEach(button => { button.disabled = true; button.setAttribute('aria-pressed', String(Number(button.textContent) === value)); });
      acceptAnswer(); $('check').focus({ preventScroll: true });
    }
    drop.addEventListener('click', () => {
      if (selection === null) { $('feedback').textContent = 'Bé chọn một số rồi bấm vào ô trống nhé!'; return; }
      submit(selection);
    });
    values.forEach(value => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'number-tile'; button.textContent = value; button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', 'Số ' + value + '. Kéo vào ô trống hoặc nhấn để chọn.');
      attachDragChoice(button, value, drop, buttons, submit, 'Bấm vào ô trống để điền số đã chọn.');
      buttons.push(button); options.append(button);
    });
    const alternate = document.createElement('p'); alternate.className = 'sequence-alternative'; alternate.textContent = 'Bé cũng có thể chọn một số rồi bấm vào ô trống.'; area.append(alternate);
    const intro = document.createElement('p'); intro.className = 'sequence-hint-intro';
    intro.textContent = 'Bé hãy quan sát các số đứng trước và sau ô trống nhé!';
    const toggle = document.createElement('button'); toggle.type = 'button'; toggle.className = 'sequence-hint-toggle'; toggle.textContent = 'Xem gợi ý ›';
    toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-controls', 'sequence-hint-detail');
    const detail = document.createElement('p'); detail.id = 'sequence-hint-detail'; detail.className = 'sequence-hint-detail'; detail.hidden = true;
    detail.textContent = item.blank === 0
      ? 'Ô trống đứng ngay trước số ' + (item.start + 1) + '. Bé hãy tìm số bé hơn số đó 1 đơn vị.'
      : 'Ô trống đứng ngay sau số ' + (answer - 1) + '. Bé hãy đếm thêm 1 để tìm số tiếp theo.';
    toggle.addEventListener('click', () => {
      detail.hidden = !detail.hidden;
      toggle.setAttribute('aria-expanded', String(!detail.hidden)); toggle.textContent = detail.hidden ? 'Xem gợi ý ›' : 'Ẩn gợi ý ‹';
    });
    const list = document.createElement('ul'); list.className = 'group-hint-steps';
    ['Các số đang tăng dần, mỗi số hơn số trước 1 đơn vị.', 'Kéo số thích hợp vào ô trống để biết kết quả ngay.', 'Bấm Xem gợi ý nếu bé cần thêm trợ giúp.'].forEach(text => { const li = document.createElement('li'); li.textContent = text; list.append(li); });
    $('hint').replaceChildren(intro, toggle, detail, list);
  }
  function correct() {
    switch (type()) {
      case 0: case 1: return selection === target();
      case 2: return selection === sequenceQuestions[question].start + sequenceQuestions[question].blank;
      case 3: { const [a,b] = comparisonPairs[question]; return selection === (a < b ? '<' : a > b ? '>' : '='); }
      case 4: return ordered.join(',') === [...sortingSets[question]].sort((a,b) => a-b).join(',');
    }
  }
  $('check').addEventListener('click', () => {
    if (finished) { if (mission < 5) { mission++; question = scores[mission] === questionTotals[mission] ? 0 : scores[mission]; } else { mission = 0; question = 0; } render(); $('exercise-title').focus(); return; }
    if (checked) { question++; render(); $('exercise-title').focus(); return; }
    if (!correct()) { $('feedback').className = 'feedback'; $('feedback').textContent = selection === null && type() !== 4 ? (type() === 1 ? 'Bé hãy chọn một nhóm hình nhé!' : 'Bé hãy chọn một đáp án nhé!') : 'Chưa đúng rồi. Bé xem gợi ý và thử lại nhé!'; return; }
    acceptAnswer();
  });
  function acceptAnswer() {
    $('check').hidden = false;
    checked = true; scores[mission] = Math.max(scores[mission], question + 1); save(); renderNav(); $('feedback').className = 'feedback is-success';
    if (question === questionTotals[mission] - 1) { finished = true; $('feedback').textContent = mission === 5 ? 'Tuyệt vời! Bé đã chinh phục cả 6 nhiệm vụ Sao Thủy! 🏆' : 'Giỏi lắm! Bé đã hoàn thành nhiệm vụ này! ★'; $('check').textContent = mission === 5 ? 'Ôn tập từ đầu' : 'Nhiệm vụ tiếp theo'; }
    else { $('feedback').textContent = 'Chính xác! Bé làm tốt lắm! ★'; $('check').textContent = 'Câu tiếp theo'; }
  }
  question = scores[mission] === questionTotals[mission] ? 0 : scores[mission]; render();
})();
