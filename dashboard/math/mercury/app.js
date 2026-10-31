(function () {
  'use strict';
  const key = 'futurelearn.math.mercury.v1';
  const titles = ['Tô sao theo số', 'Chọn nhóm có số lượng tương ứng', 'Điền số còn thiếu', 'So sánh các số', 'Sắp xếp các số', 'Thử thách Sao Thủy'];
  const hints = ['Bấm vào ngôi sao để tô màu. Bấm lại để bỏ màu. Đếm đủ số sao bằng số ở trên nhé!', 'Đếm từng ngôi sao trong mỗi nhóm, rồi chọn nhóm có số lượng đúng.', 'Đọc dãy số từ trái sang phải. Số nào nằm ở ô còn thiếu?', 'Đếm hoặc đọc hai số. Chọn dấu lớn hơn, bé hơn hoặc bằng nhau.', 'Bấm lần lượt các số từ bé đến lớn. Bấm số đã chọn để bỏ chọn.', 'Vận dụng những điều vừa học. Cứ bình tĩnh đếm từng ngôi sao nhé!'];
  const $ = id => document.getElementById(id);
  let scores = [0, 0, 0, 0, 0, 0];
  try { const saved = JSON.parse(localStorage.getItem(key)); if (Array.isArray(saved) && saved.length === 6) { scores = saved.map(n => Number.isInteger(n) && n >= 0 && n <= 5 ? n : 0); for (let i = 1; i < 6; i++) if (scores[i - 1] < 5) scores[i] = 0; } } catch (_) { /* Storage is optional. */ }
  let mission = Math.max(0, scores.findIndex(n => n < 5));
  let question = 0, selection = null, ordered = [], checked = false, finished = false;
  function save() { try { localStorage.setItem(key, JSON.stringify(scores)); } catch (_) { $('storage-note').textContent = 'Trình duyệt chưa lưu được tiến độ. Bé vẫn có thể tiếp tục học trong lượt này.'; } }
  function renderNav() {
    $('missions').replaceChildren();
    titles.forEach((title, i) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'mission-button' + (i === mission ? ' is-current' : '');
      button.disabled = i > 0 && scores[i - 1] < 5;
      if (i === mission) button.setAttribute('aria-current', 'step');
      const number = document.createElement('span'); number.className = 'mission-number'; number.textContent = i + 1;
      const label = document.createElement('span'); label.textContent = title;
      const status = document.createElement('span'); status.className = 'mission-status'; status.textContent = button.disabled ? 'Khóa' : scores[i] === 5 ? '✓' : scores[i] + '/5';
      button.append(number, label, status); button.addEventListener('click', () => { mission = i; question = scores[i] === 5 ? 0 : scores[i]; render(); }); $('missions').append(button);
    });
    $('score').textContent = scores[mission] + '/5'; $('mission-progress').value = scores[mission];
    $('progress-note').textContent = scores[mission] === 5 ? 'Đã hoàn thành! Bé có thể chơi lại để ôn tập.' : 'Hoàn thành 5 câu để mở khóa nhiệm vụ tiếp theo nhé!';
    $('journey-count').textContent = 'Đã hoàn thành ' + scores.filter(n => n === 5).length + '/6 nhiệm vụ';
  }
  function type() { return mission === 5 ? [0, 1, 2, 3, 4][question] : mission; }
  function target() { return [7, 3, 0, 10, 5][question]; }
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
    renderNav(); $('mission-label').textContent = 'Nhiệm vụ ' + (mission + 1) + '/6'; $('question-count').textContent = 'Câu ' + (question + 1) + '/5'; $('hint').textContent = hints[type()];
    $('feedback').textContent = ''; $('feedback').className = 'feedback'; $('check').textContent = 'Kiểm tra'; $('activity').replaceChildren(); $('instruction').textContent = '';
    const t = type(), n = target(), area = $('activity');
    const heading = ['Hãy tô màu số ngôi sao tương ứng với số:', 'Nhóm nào có đúng số ngôi sao?', 'Điền số còn thiếu', 'Chọn dấu thích hợp', 'Sắp xếp các số từ bé đến lớn'];
    $('exercise-title').textContent = heading[t];
    if (t === 0 || t === 1) { const targetCard = document.createElement('div'); targetCard.className = 'target-number'; targetCard.textContent = n; area.append(targetCard); }
    if (t === 0) {
      selection = 0; const grid = document.createElement('div'); grid.className = 'star-grid'; grid.setAttribute('role', 'group'); grid.setAttribute('aria-label', 'Chọn các ngôi sao để tô màu');
      for (let i = 0; i < 10; i++) { const b = document.createElement('button'); b.type = 'button'; b.className = 'star-button'; b.setAttribute('aria-label', 'Ngôi sao ' + (i + 1)); b.setAttribute('aria-pressed', 'false'); b.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path stroke-linejoin="round" d="m16 2 4.3 8.7 9.6 1.4-7 6.8 1.7 9.6-8.6-4.6-8.6 4.6 1.7-9.6-7-6.8 9.6-1.4Z"/></svg>'; b.addEventListener('click', () => { if (checked) return; const active = b.getAttribute('aria-pressed') === 'true'; b.setAttribute('aria-pressed', String(!active)); selection += active ? -1 : 1; $('selected-count').textContent = 'Đã tô ' + selection + ' ngôi sao'; $('feedback').textContent = ''; }); grid.append(b); }
      const count = document.createElement('p'); count.id = 'selected-count'; count.className = 'selection-count'; count.textContent = 'Đã tô 0 ngôi sao'; area.append(grid, count);
      $('instruction').textContent = n === 0 ? 'Số 0 nghĩa là không có ngôi sao nào được tô màu.' : 'Chạm vào từng ngôi sao để tô màu nhé!';
    } else {
      const options = document.createElement('div'); options.className = 'answer-options';
      if (t === 1) { [n, (n + 2) % 11, (n + 5) % 11].sort((a,b) => a-b).forEach(v => { const b = choice(v === 0 ? 'Không có ngôi sao' : '★'.repeat(v), v, 'group-choice'); b.setAttribute('aria-label', v + ' ngôi sao'); options.append(b); }); }
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
    if (finished) { if (mission < 5) { mission++; question = scores[mission] === 5 ? 0 : scores[mission]; } else { mission = 0; question = 0; } render(); $('exercise-title').focus(); return; }
    if (checked) { question++; render(); $('exercise-title').focus(); return; }
    if (!correct()) { $('feedback').className = 'feedback'; $('feedback').textContent = selection === null && type() !== 4 ? 'Bé hãy chọn một đáp án nhé!' : 'Chưa đúng rồi. Bé xem gợi ý và thử lại nhé!'; return; }
    checked = true; scores[mission] = Math.max(scores[mission], question + 1); save(); renderNav(); $('feedback').className = 'feedback is-success';
    if (question === 4) { finished = true; $('feedback').textContent = mission === 5 ? 'Tuyệt vời! Bé đã chinh phục cả 6 nhiệm vụ Sao Thủy! 🏆' : 'Giỏi lắm! Bé đã hoàn thành nhiệm vụ này! ★'; $('check').textContent = mission === 5 ? 'Ôn tập từ đầu' : 'Nhiệm vụ tiếp theo'; }
    else { $('feedback').textContent = 'Chính xác! Bé làm tốt lắm! ★'; $('check').textContent = 'Câu tiếp theo'; }
  });
  question = scores[mission] === 5 ? 0 : scores[mission]; render();
})();
