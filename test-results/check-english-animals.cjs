const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function element() {
  return { focus(){this.focused=true}, listeners:{}, scrollLeft:0, addEventListener(type, listener){this.listeners[type]=listener}, setPointerCapture(id){this.captured=id}, hasPointerCapture(id){return this.captured===id}, releasePointerCapture(){this.captured=null}, hidden:false, disabled:false, dataset:{}, children:[], textContent:'', querySelector(){if(!this.lock)this.lock=element();return this.lock}, classList:{add(){},remove(){},toggle(){}}, style:{setProperty(){}}, toggleAttribute(k,v){this[k]=v}, setAttribute(k,v){this[k]=v},removeAttribute(k){delete this[k]},append(...items){this.children.push(...items)},replaceChildren(...items){this.children=items},querySelectorAll(){return this.children} };
}
let stored = null;
function boot(blocked=false) {
  const elements = new Map();
  const listeners = {};
  const modes = ['learn','practice','quiz'].map(mode => {const e=element();e.dataset.mode=mode;return e});
  const document = {querySelector(s){if(!elements.has(s))elements.set(s,element());return elements.get(s)},createElement:element,createTextNode(text){return {textContent:text}},querySelectorAll(s){return s==='[data-activity-mode]'? []:s==='[data-mode]'? modes:[modes[1],modes[2],this.querySelector('[data-start-practice]')]}};
  const context = {document, localStorage:{getItem(){return stored},setItem(k,v){if(blocked)throw Error('blocked');stored=v}},SpeechSynthesisUtterance:function(text){this.text=text},speechSynthesis:{getVoices(){return [{lang:'en-US'}]},cancel(){},speak(u){context.spoken=u}},addEventListener(type, listener){listeners[type]=listener}};
  context.window=context;vm.createContext(context);
  for(const file of ['words.js','progress.js','app.js'])vm.runInContext(fs.readFileSync('dashboard/english/animals/'+file,'utf8'),context);
  return {context,listeners,$:s=>document.querySelector(s),modes};
}
let app=boot();
assert.equal(app.$('[data-ring-count]').textContent,'0/10');
assert.equal(app.$('[data-word-grid]').children.length,10);
const grid = app.$('[data-word-grid]');
const pointer = (clientX, extra={}) => ({pointerType:'mouse',button:0,pointerId:1,clientX,preventDefault(){},...extra});
grid.listeners.pointerdown(pointer(200));
grid.listeners.pointermove(pointer(197));
assert.equal(grid.scrollLeft,0,'small movement remains a click');
grid.listeners.pointermove(pointer(120));
assert.equal(grid.scrollLeft,80,'drag scrolls the cards');
grid.listeners.pointerup(pointer(120));
assert.equal(grid.captured,null,'release pointer after drag');
let suppressed=false;
grid.listeners.click({detail:1,preventDefault(){},stopImmediatePropagation(){suppressed=true}});
assert.equal(suppressed,true,'drag must not select a word');
suppressed=false;
grid.listeners.click({detail:0,preventDefault(){},stopImmediatePropagation(){suppressed=true}});
assert.equal(suppressed,false,'keyboard activation still works');
grid.listeners.pointerdown(pointer(120));
grid.listeners.pointerup(pointer(120));
grid.listeners.click({detail:1,preventDefault(){},stopImmediatePropagation(){suppressed=true}});
assert.equal(suppressed,false,'regular clicks still work after dragging');
grid.listeners.pointerdown(pointer(200,{pointerType:'touch'}));
grid.listeners.pointermove(pointer(100,{pointerType:'touch'}));
assert.equal(grid.scrollLeft,80,'touch uses native scrolling');

assert.equal(app.$('[data-word-dots]').children.length,10);
assert.equal(app.$('[data-example]').children[1].textContent,'dog');
assert.equal(app.modes[1].querySelector('[data-lock]').hidden,false);
app.$('[data-word-grid]').children[9].onclick();
assert.equal(JSON.parse(stored).learned.length,0);
app.$('[data-next]').onclick();
assert.equal(JSON.parse(stored).learned.length,1);
assert.equal(app.$('[data-word]').textContent,'Dog');
app.$('[data-next]').onclick();app.$('[data-prev]').onclick();app.$('[data-next]').onclick();
assert.equal(JSON.parse(stored).learned.length,2);
app=boot();assert.equal(app.$('[data-ring-count]').textContent,'2/10');
for(let i=0;i<8;i++)app.$('[data-next]').onclick();
assert.equal(JSON.parse(stored).learned.length,10);assert.equal(JSON.parse(stored).rewarded,true);
assert.equal(app.$('[data-start-practice]').disabled,false);
assert.equal(app.modes[1].querySelector('[data-lock]').hidden,true);
assert.equal(app.$('[data-completion]').hidden,false);
assert.equal(app.$('#completion-title').focused,true);
app.$('[data-completion-practice]').onclick();
assert.equal(app.$('[data-completion]').hidden,true);
assert.equal(app.$('[data-learning]').hidden,true);
app.$('[data-question-next]').onclick();
assert.match(app.$('[data-question]').textContent,/1\/10/);
app.$('[data-answers]').children[0].onclick();
const feedback = app.$('[data-feedback]').textContent;
app.modes[1].onclick();
assert.equal(app.$('[data-feedback]').textContent,feedback,'active tab must preserve the answer');
app.$('[data-question-next]').onclick();
app.$('[data-question-next]').onclick();
assert.match(app.$('[data-question]').textContent,/2\/10/,'cannot skip an unanswered question');
for(let i=1;i<10;i++) {app.$('[data-answers]').children[0].onclick();app.$('[data-question-next]').onclick();}
assert.equal(app.$('[data-question]').textContent,'Hoàn thành!');
assert.ok(Number.isInteger(JSON.parse(stored).results.practice.score));
const finished = stored;
app.$('[data-question-next]').onclick();
assert.equal(stored,finished,'completed result cannot be submitted twice');
app=boot();
assert.match(app.$('[data-unlock]').textContent,/Luyện tập lần gần nhất: \d+\/10/);
app.modes[0].onclick();app.$('[data-speak]').onclick();assert.equal(app.context.spoken.lang,'en-US');
assert.equal(JSON.parse(stored).learned.length,10);
stored=JSON.stringify({learned:[],current:'cat',rewarded:true,results:{quiz:{score:10,completedAt:new Date().toISOString()}}});
app.listeners.storage({key:app.context.animalProgress.key});
assert.equal(app.$('[data-ring-count]').textContent,'0/10');
assert.equal(app.$('[data-word]').textContent,'Cat');
assert.equal(app.modes[1].disabled,true);
assert.equal(Object.keys(app.context.animalProgress.read().results).length,0);
stored=JSON.stringify({learned:['dog','dog','unknown'],current:'unknown',rewarded:true});
app=boot();assert.equal(app.$('[data-ring-count]').textContent,'1/10');
assert.equal(app.context.animalProgress.read().rewarded,false);
stored='{broken';app=boot();assert.equal(app.$('[data-ring-count]').textContent,'0/10');
app=boot(true);app.$('[data-next]').onclick();assert.match(app.$('[data-notice]').textContent,/Không thể lưu/);
for(const word of app.context.animalWords){assert.ok(fs.existsSync('dashboard/english/animals/'+word.image));assert.ok(!word.vi.includes('?'))}
console.log('PASS: 10 assets, navigation without credit, unique learned words, resume, completion/reward, practice, speech, corrupt/blocked storage.');


// Completing out of order must show the same milestone.
stored=JSON.stringify({learned:['cat','bird','fish','rabbit','lion','elephant','monkey','tiger','duck'],current:'dog'});
app=boot();app.$('[data-next]').onclick();
assert.equal(app.$('[data-completion]').hidden,false);
assert.equal(JSON.parse(stored).learned.length,10);
app.$('[data-completion-review]').onclick();
assert.equal(app.$('[data-word]').textContent,'Dog');
assert.equal(app.$('[data-completion]').hidden,true);
app.$('[data-next]').onclick();
assert.equal(app.$('[data-completion]').hidden,true,'review must not repeat celebration');
app=boot();assert.notEqual(app.$('[data-learning]').hidden,true,'reload returns to words');
console.log('PASS: completion milestone, focus, practice/review transitions and out-of-order completion.');
