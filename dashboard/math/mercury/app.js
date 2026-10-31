(function () {
  'use strict';
  const journeyLink = document.querySelector('.sidebar-journey--learning');
  if (journeyLink) journeyLink.href = '../#math-path';
  const key = 'futurelearn.math.mercury.v2';
  const questionTotals = [10, 5, 5, 5, 5, 5];
  const titles = ['Tô hình theo số', 'Chọn nhóm có số lượng tương ứng', 'Điền số còn thiếu', 'So sánh các số', 'Sắp xếp các số', 'Thử thách Sao Thủy'];
  const hints = ['Bấm vào ngôi sao để tô màu. Bấm lại để bỏ màu. Đếm đủ số sao bằng số ở trên nhé!', 'Đếm từng ngôi sao trong mỗi nhóm, rồi chọn nhóm có số lượng đúng.', 'Đọc dãy số từ trái sang phải. Số nào nằm ở ô còn thiếu?', 'Đếm hoặc đọc hai số. Chọn dấu lớn hơn, bé hơn hoặc bằng nhau.', 'Bấm lần lượt các số từ bé đến lớn. Bấm số đã chọn để bỏ chọn.', 'Vận dụng những điều vừa học. Cứ bình tĩnh đếm từng ngôi sao nhé!'];
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
    { target: 5, counts: [5, 6, 4] }
  ];
  const $ = id => document.getElementById(id);
  let scores = [0, 0, 0, 0, 0, 0];
  try {
    const current = localStorage.getItem(key);
    const saved = JSON.parse(current === null ? localStorage.getItem('futurelearn.math.mercury.v1') : current);
    if (Array.isArray(saved) && saved.length === questionTotals.length) {
      scores = saved.map((n, i) => {
        const limit = current === null ? 5 : questionTotals[i];
        if (!Number.isInteger(n) || n < 0 || n > limit) return 0;
        // Keep previously completed missions unlocked when upgrading from five questions.
        return current === null && i === 0 && n === 5 ? questionTotals[0] : n;
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
      else icon.textContent = ['','💎','🧊','≶','🔢','🏆'][i];
      button.append(number, icon, label, status); button.addEventListener('click', () => { mission = i; question = scores[i] === questionTotals[i] ? 0 : scores[i]; render(); }); $('missions').append(button);
    });
    $('score').textContent = scores[mission] + '/' + questionTotals[mission]; $('mission-progress').max = questionTotals[mission]; $('mission-progress').value = scores[mission];
    $('progress-note').textContent = scores[mission] === questionTotals[mission] ? 'Đã hoàn thành! Bé có thể chơi lại để ôn tập.' : 'Hoàn thành ' + questionTotals[mission] + ' câu để mở khóa nhiệm vụ tiếp theo nhé!';
    $('journey-count').textContent = 'Đã hoàn thành ' + scores.filter((n, i) => n === questionTotals[i]).length + '/6 nhiệm vụ';
  }
  function type() { return mission === 5 ? [0, 1, 2, 3, 4][question] : mission; }
  function target() { if (type() === 1) return groupQuestions[question].target; return (mission === 0 ? [7, 3, 0, 10, 5, 2, 8, 4, 9, 6] : [7, 3, 0, 10, 5])[question]; }
  function choice(label, value, className) {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'choice-button ' + (className || ''); button.textContent = label; button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      if (checked) return;
      if (type() === 4) { const index = ordered.indexOf(value); if (index >= 0) ordered.splice(index, 1); else ordered.push(value); button.setAttribute('aria-pressed', String(ordered.includes(value))); $('sort-answer').textContent = ordered.join('  ') || '…'; }
      else { selection = value; $('activity').querySelectorAll('.choice-button').forEach(b => b.setAttribute('aria-pressed', String(b === button))); }
      $('feedback').textContent = '';
    }); return button;
  }
  function render() {
    checked = false; finished = false; selection = null; ordered = [];
    renderNav(); $('mission-label').textContent = 'Nhiệm vụ ' + (mission + 1) + '/6'; $('question-count').textContent = 'Câu ' + (question + 1) + '/' + questionTotals[mission]; $('hint').textContent = hints[type()];
    document.querySelector('.hint-stars').textContent = '★ ★ ★ ☆ ☆';
    $('feedback').textContent = ''; $('feedback').className = 'feedback'; $('check').textContent = 'Kiểm tra'; $('activity').replaceChildren(); $('instruction').textContent = '';
    const t = type(), n = target(), area = $('activity');
    const heading = ['Hãy tô màu số ngôi sao tương ứng với số:', 'Hãy chọn nhóm có số lượng tương ứng với số:', 'Điền số còn thiếu', 'Chọn dấu thích hợp', 'Sắp xếp các số từ bé đến lớn'];
    $('exercise-title').textContent = heading[t];
    document.querySelector('.exercise-panel').classList.toggle('is-group-exercise', t === 1);
    document.querySelector('.hint-panel').classList.toggle('is-group-hint', t === 1);
    $('group-hint-robot').hidden = t !== 1;
    if (t === 0 || t === 1) { const targetCard = document.createElement('div'); targetCard.className = 'target-number'; targetCard.textContent = n; area.append(targetCard); }
    if (t === 0) {
      const shape = coloringShapes[question % coloringShapes.length];
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
      if (t === 2) { const start = [0, 3, 6, 8, 1][question]; const seq = document.createElement('p'); seq.className = 'number-sequence'; seq.textContent = start + '   ·   ?   ·   ' + (start + 2); area.append(seq); [start, start + 1, start + 2].forEach(v => options.append(choice(v, v))); }
      if (t === 3) { const pairs = [[2,5],[7,3],[4,4],[0,1],[10,8]], [a,b] = pairs[question]; const seq = document.createElement('p'); seq.className = 'number-sequence'; seq.textContent = a + '   ?   ' + b; area.append(seq); ['<','=','>'].forEach(v => { const button = choice(v,v); button.setAttribute('aria-label', {'<':'Bé hơn','=':'Bằng nhau','>':'Lớn hơn'}[v]); options.append(button); }); }
      if (t === 4) { const sets = [[3,1,2],[5,0,2],[8,6,7],[10,8,9],[4,2,3]]; sets[question].forEach(v => options.append(choice(v,v))); const result = document.createElement('p'); result.id = 'sort-answer'; result.className = 'sort-answer'; result.setAttribute('aria-live','polite'); result.textContent = '…'; area.append(result); $('instruction').textContent = 'Bấm các số theo thứ tự. Bấm lại để bỏ chọn.'; }
      area.append(options);
    }
  }
  function correct() {
    switch (type()) {
      case 0: case 1: return selection === target();
      case 2: return selection === [0,3,6,8,1][question] + 1;
      case 3: return selection === ['<','>','=','<','>'][question];
      case 4: return ordered.join(',') === [[1,2,3],[0,2,5],[6,7,8],[8,9,10],[2,3,4]][question].join(',');
    }
  }
  $('check').addEventListener('click', () => {
    if (finished) { if (mission < 5) { mission++; question = scores[mission] === questionTotals[mission] ? 0 : scores[mission]; } else { mission = 0; question = 0; } render(); $('exercise-title').focus(); return; }
    if (checked) { question++; render(); $('exercise-title').focus(); return; }
    if (!correct()) { $('feedback').className = 'feedback'; $('feedback').textContent = selection === null && type() !== 4 ? (type() === 1 ? 'Bé hãy chọn một nhóm hình nhé!' : 'Bé hãy chọn một đáp án nhé!') : 'Chưa đúng rồi. Bé xem gợi ý và thử lại nhé!'; return; }
    checked = true; scores[mission] = Math.max(scores[mission], question + 1); save(); renderNav(); $('feedback').className = 'feedback is-success';
    if (question === questionTotals[mission] - 1) { finished = true; $('feedback').textContent = mission === 5 ? 'Tuyệt vời! Bé đã chinh phục cả 6 nhiệm vụ Sao Thủy! 🏆' : 'Giỏi lắm! Bé đã hoàn thành nhiệm vụ này! ★'; $('check').textContent = mission === 5 ? 'Ôn tập từ đầu' : 'Nhiệm vụ tiếp theo'; }
    else { $('feedback').textContent = 'Chính xác! Bé làm tốt lắm! ★'; $('check').textContent = 'Câu tiếp theo'; }
  });
  question = scores[mission] === questionTotals[mission] ? 0 : scores[mission]; render();
})();
