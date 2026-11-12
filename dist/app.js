'use strict';
(() => {
 const bank=window.QUIZ_BANK, KEY='se-study-room-222-v1', $=id=>document.getElementById(id);
 let state={index:0,answers:{},auto:true},timer=null,filter='all',summary=false;
 try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&Number.isInteger(s.index)&&s.index>=0&&s.index<bank.length){state.index=s.index;state.auto=s.auto!==false;for(const [id,a] of Object.entries(s.answers||{})){if(bank.some(q=>q.id===+id)&&a&&[a.first,a.last].every(x=>Number.isInteger(x)&&x>=0&&x<4))state.answers[id]=a;}}}catch{}
 $('auto').checked=state.auto;
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{$('save-note').textContent='Keep this tab open to retain progress';}};
 const cancel=()=>{if(timer!==null){clearTimeout(timer);timer=null;}};
 const counts=()=>({answered:Object.keys(state.answers).length,first:bank.filter(q=>state.answers[q.id]?.first===q.answer).length,learned:bank.filter(q=>state.answers[q.id]?.last===q.answer).length});
 function stats(){const c=counts();$('done').textContent=c.answered;$('first').textContent=c.first;$('mastered').textContent=c.learned;$('percent').textContent=Math.round(c.answered/bank.length*100)+'% answered';$('progress').style.width=c.answered/bank.length*100+'%';}
 function text(tag,content,cls){let el=document.createElement(tag);el.textContent=content;if(cls)el.className=cls;return el;}
 function render(focus=false){
  cancel();summary=false;$('practice').hidden=false;$('summary').hidden=true;const q=bank[state.index],a=state.answers[q.id];
  $('position').textContent=`Question ${state.index+1} of ${bank.length}`;$('qid').textContent='#'+String(q.id).padStart(3,'0');$('topic').textContent=q.topic;$('question').textContent=q.question;
  $('options').replaceChildren();q.options.forEach((option,i)=>{
   const button=document.createElement('button');button.className='option';button.setAttribute('aria-label',`${'ABCD'[i]}. ${option}`);button.append(text('span','ABCD'[i],'letter'),text('span',option,'option-text'));
   if(a){if(i===q.answer){button.classList.add('correct');button.append(text('span','✓','option-indicator'));}else if(i===a.last){button.classList.add('wrong');button.append(text('span','×','option-indicator'));}button.setAttribute('aria-pressed',String(i===a.last));button.disabled=a.last===q.answer;}
   button.addEventListener('click',()=>choose(i));$('options').append(button);
  });
  $('feedback').hidden=!a;if(a)feedback(q,a,false);
  $('previous').disabled=state.index===0;$('next').textContent=state.index===bank.length-1?'View results →':'Next question →';stats();save();if(focus)$('question').focus({preventScroll:true});
 }
 function feedback(q,a,advancing){
  const correct=a.last===q.answer,box=$('feedback');box.hidden=false;box.className='feedback '+(correct?'good':'bad');box.replaceChildren();
  box.append(text('h4',correct?'✓ Correct. Nicely done!':'Let’s learn this one.'));
  box.append(text('p',`Correct answer: ${'ABCD'[q.answer]}. ${q.options[q.answer]}`));box.append(text('p',q.explanation,'explain'));
  if(!correct)box.append(text('p','Choose the correct option to try again, or use Next and Previous to keep exploring.','countdown'));
  if(advancing)box.append(text('p',state.index===bank.length-1?'Your results will appear in 2 seconds…':'Moving to the next question in 2 seconds…','countdown'));
 }
 function choose(i){
  if(summary||i<0||i>3)return;const q=bank[state.index],old=state.answers[q.id];if(old?.last===q.answer)return;
  cancel();state.answers[q.id]={first:old?old.first:i,last:i};render();
  if(i===q.answer&&state.auto){feedback(q,state.answers[q.id],true);const origin=state.index;timer=setTimeout(()=>{timer=null;if(state.index===origin&&!summary)next();},2000);}
 }
 function go(i){if(i<0||i>=bank.length)return;cancel();state.index=i;render(true);}
 function next(){if(state.index===bank.length-1)showSummary();else go(state.index+1);}
 function showSummary(){cancel();summary=true;$('practice').hidden=true;$('summary').hidden=false;stats();const c=counts(),left=bank.length-c.answered;$('summary-text').textContent=left?`You have answered ${c.answered} of ${bank.length} questions. ${left} are still waiting whenever you’re ready.`:'You have answered every question. Revisit the ones you missed to strengthen your understanding.';$('summary-stats').replaceChildren(text('div',`${c.first} / ${c.answered||0} correct on the first try`),text('div',`${c.learned} questions learned · ${left} unanswered`));$('review-missed').disabled=!bank.some(q=>state.answers[q.id]&&state.answers[q.id].first!==q.answer);$('summary').scrollIntoView({block:'start',behavior:'smooth'});}
 function map(){
  $('question-grid').replaceChildren();let visible=0;bank.forEach((q,i)=>{const a=state.answers[q.id];if(filter==='missed'&&(!a||a.first===q.answer))return;if(filter==='unanswered'&&a)return;visible++;
   const b=text('button',q.id);if(a)b.classList.add(a.last===q.answer?'learned':'missed');if(i===state.index)b.classList.add('current');b.setAttribute('aria-label',`Question ${q.id}: ${a?(a.last===q.answer?'learned':'needs review'):'unanswered'}`);b.addEventListener('click',()=>{$('overview-dialog').close();go(i);});$('question-grid').append(b);
  });$('grid-empty').hidden=visible!==0;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.filter===filter);b.setAttribute('aria-pressed',String(b.dataset.filter===filter));});
 }
 $('previous').addEventListener('click',()=>go(state.index-1));$('next').addEventListener('click',next);
 $('auto').addEventListener('change',()=>{state.auto=$('auto').checked;cancel();save();if(!summary&&state.answers[bank[state.index].id])feedback(bank[state.index],state.answers[bank[state.index].id],false);});
 $('overview').addEventListener('click',()=>{cancel();if(!summary&&state.answers[bank[state.index].id])feedback(bank[state.index],state.answers[bank[state.index].id],false);map();$('overview-dialog').showModal();});
 $('close-overview').addEventListener('click',()=>$('overview-dialog').close());
 document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;map();}));
 $('review-missed').addEventListener('click',()=>{const i=bank.findIndex(q=>state.answers[q.id]&&state.answers[q.id].first!==q.answer);if(i>=0)go(i);});
 $('return').addEventListener('click',()=>render(true));
 $('restart').addEventListener('click',()=>{cancel();$('restart-dialog').showModal();});$('cancel-restart').addEventListener('click',()=>$('restart-dialog').close());
 $('confirm-restart').addEventListener('click',()=>{cancel();state={index:0,answers:{},auto:$('auto').checked};$('restart-dialog').close();render(true);});
 document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();go(0);});
 document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||summary||e.altKey||e.ctrlKey||e.metaKey||['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;if(/^[1-4]$/.test(e.key)){e.preventDefault();choose(+e.key-1);}else if(e.key==='ArrowLeft'){e.preventDefault();go(state.index-1);}else if(e.key==='ArrowRight'){e.preventDefault();next();}});
 window.addEventListener('pagehide',save);render();
})();
