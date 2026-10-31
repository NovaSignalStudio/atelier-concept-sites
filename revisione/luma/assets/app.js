const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionOff = reduced.matches;
try { motionOff ||= localStorage.getItem('atelier-motion') === 'off'; } catch {}
let observer;
function setMotion(off) {
 motionOff=off; document.body.classList.toggle('motion-off',off); document.documentElement.style.scrollBehavior=off?'auto':'';
 document.body.classList.toggle('motion-ready',!off && 'IntersectionObserver' in window);
 $$('[data-motion-toggle]').forEach(b=>{b.textContent=off?'Attiva animazioni':'Riduci animazioni';b.setAttribute('aria-pressed',String(off));});
 observer?.disconnect();
 if(!off && 'IntersectionObserver' in window){observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target);}}),{threshold:.08});$$('.reveal').forEach(el=>observer.observe(el));}
 else $$('.reveal').forEach(el=>el.classList.add('in-view'));
 requestTick();
}
$$('[data-motion-toggle]').forEach(b=>b.addEventListener('click',()=>{setMotion(!motionOff);try{localStorage.setItem('atelier-motion',motionOff?'off':'on');}catch{}}));
reduced.addEventListener('change',e=>setMotion(e.matches));

const menu=$('#mobile-menu'), toggle=$('[data-menu-open]'); let previousFocus;
function closeMenu(){if(!menu)return;menu.hidden=true;document.body.classList.remove('locked');toggle?.setAttribute('aria-expanded','false');previousFocus?.focus();}
toggle?.addEventListener('click',()=>{previousFocus=document.activeElement;menu.hidden=false;document.body.classList.add('locked');toggle.setAttribute('aria-expanded','true');$('[data-menu-close]',menu).focus();});
$('[data-menu-close]')?.addEventListener('click',closeMenu);
document.addEventListener('keydown',e=>{if(menu&&!menu.hidden){if(e.key==='Escape')closeMenu();if(e.key==='Tab'){const list=$$('a,button',menu).filter(el=>!el.hidden);const first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}});
window.addEventListener('resize',()=>{if(innerWidth>800&&menu&&!menu.hidden)closeMenu();});

$$('[data-filter-group]').forEach(group=>{
 const container=$(`[data-filter-content="${group.dataset.filterGroup}"]`);
 if(!container)return;
 $$('[data-filter]',group).forEach(button=>button.addEventListener('click',()=>{
  $$('[data-filter]',group).forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  const value=button.dataset.filter;let count=0;
  $$('[data-category]',container).forEach(item=>{const match=value==='all'||item.dataset.category.split(' ').includes(value);item.hidden=!match;if(match)count++;});
  const status=$(`[data-filter-status="${group.dataset.filterGroup}"]`);if(status)status.textContent=`${count} ${count===1?'proposta visualizzata':'proposte visualizzate'}`;
 }));
});

$$('[data-modal-open]').forEach(b=>b.addEventListener('click',()=>{const dialog=$(`#${b.dataset.modalOpen}`);dialog?.showModal();}));
$$('dialog').forEach(d=>{$('[data-modal-close]',d)?.addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});

let ticking=false;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
function requestTick(){if(!ticking){ticking=true;requestAnimationFrame(renderScroll);}}
function renderScroll(){
 ticking=false; const vh=innerHeight, wide=innerWidth>800;
 const progress=scrollY/Math.max(1,document.documentElement.scrollHeight-vh);
 const progressBar=$('.scroll-progress');if(progressBar)progressBar.style.transform=`scaleX(${clamp(progress)})`;
 if(motionOff || !wide){
  $$('.parallax-media').forEach(el=>el.style.transform='');
  $$('.scene-card,.journey-card').forEach(el=>{el.style.transform='';el.style.opacity='';el.style.zIndex='';el.style.pointerEvents='';el.inert=false;});
  $$('.method-step').forEach(el=>el.classList.add('active'));
  return;
 }
 $$('.parallax-media').forEach(el=>{const rect=el.parentElement.getBoundingClientRect();if(rect.bottom>0&&rect.top<vh)el.style.transform=`translate3d(0,${clamp(-rect.top/vh,-1,1)*50}px,0)`;});
 $$('.story-scene').forEach(scene=>{
  const rect=scene.getBoundingClientRect();if(rect.top>vh||rect.bottom<0)return;
  const p=clamp(-rect.top/(rect.height-vh));scene.style.setProperty('--scene-progress',p);
  if(scene.dataset.scene==='selva'){
   const cards=$$('.scene-card',scene), raw=p*(cards.length-1), base=Math.floor(raw), t=clamp((raw-base-.35)/.3), phase=base+t*t*(3-2*t);
   cards.forEach((card,i)=>{const delta=i-phase,opacity=clamp(1-Math.abs(delta));card.style.opacity=opacity;card.style.transform=`translate3d(0,${delta*40}px,0)`;card.style.pointerEvents=i===Math.round(phase)?'auto':'none';card.inert=i!==Math.round(phase);});
   $$('.scene-track-nav i',scene).forEach((el,i)=>el.classList.toggle('active',i===Math.round(phase)));
  }
  if(scene.dataset.scene==='vetra'){$$('.method-step',scene).forEach((el,i)=>el.classList.toggle('active',Math.round(p*2)===i));}
  if(scene.dataset.scene==='luma'){
   const phase=p*2;
   $$('.journey-card',scene).forEach((el,i)=>{const d=i-phase;el.style.zIndex=String(10-i);el.style.opacity=d<0?clamp(1+d*1.5):'1';el.style.transform=d<0?`translate3d(${d*160}px,${d*-35}px,0) rotate(${d*14}deg)`:`translate3d(0,${Math.min(d,2)*16}px,0) rotate(${Math.min(d,2)*(i%2?4:-4)}deg)`;});
  }
 });
}
window.addEventListener('scroll',requestTick,{passive:true});
window.addEventListener('resize',requestTick,{passive:true});
document.fonts?.ready.then(requestTick);
setMotion(motionOff);
window.addEventListener('pageshow',()=>{requestTick();});

const wizard=$('[data-wizard]');
if(wizard){
 const steps=$$('.form-step',wizard),error=$('[data-form-error]',wizard),kind=wizard.dataset.wizard;let step=0,slot='';
 const date=$('input[type=date]',wizard);
 const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
 if(date){date.min=today();date.addEventListener('change',()=>{date.setCustomValidity('');if(date.value<today())date.setCustomValidity('Scegli una data futura.');if(kind==='restaurant'&&new Date(date.value+'T12:00:00').getDay()===1)date.setCustomValidity('Il lunedì è giorno di riposo: scegli un altro giorno.');});}
 $$('[data-slot]',wizard).forEach(b=>b.addEventListener('click',()=>{slot=b.dataset.slot;$$('[data-slot]',wizard).forEach(v=>v.setAttribute('aria-pressed',String(v===b)));error.textContent='';}));
 function showStep(n){step=n;steps.forEach((s,i)=>s.hidden=i!==n);$$('.steps span',wizard).forEach((s,i)=>{s.classList.toggle('active',i===n);if(i===n)s.setAttribute('aria-current','step');else s.removeAttribute('aria-current');});error.textContent='';const title=$('h2',steps[n]);title.setAttribute('tabindex','-1');title.focus({preventScroll:true});if(wizard.getBoundingClientRect().top<0)wizard.scrollIntoView({behavior:motionOff?'auto':'smooth',block:'start'});}
 function validate(){
  let valid=true;$$('input,select,textarea',steps[step]).forEach(el=>{el.setAttribute('aria-invalid','false');if(!el.checkValidity()){valid=false;el.setAttribute('aria-invalid','true');}});
  const invalid=$('[aria-invalid=true]',steps[step]);
  if(!valid){error.textContent=invalid?.validationMessage || 'Controlla i campi obbligatori.';invalid?.focus();return false;}
  if(step===0&&kind!=='legal'&&!slot){error.textContent='Seleziona anche un orario tra quelli dimostrativi.';return false;}
  return true;
 }
 function summary(){
  const data=new FormData(wizard);let pairs=[];
  if(kind==='restaurant')pairs=[['Esperienza',data.get('experience')],['Ospiti',data.get('guests')],['Data',new Date(data.get('date')+'T12:00:00').toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'})],['Orario',slot]];
  if(kind==='dental')pairs=[['Percorso',data.get('interest')],['Preferenza',data.get('visit')],['Data desiderata',new Date(data.get('date')+'T12:00:00').toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'})],['Orario indicativo',slot]];
  if(kind==='legal')pairs=[['Area di interesse',data.get('interest')],['Interlocutore',data.get('profile')],['Primo confronto',data.get('meeting')]];
  pairs.push(['Nome',data.get('name')],['Email',data.get('email')]);
  const list=$('[data-review]',wizard);list.replaceChildren();
  for(const [label,value] of pairs){const div=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;div.append(dt,dd);list.append(div);}
 }
 $$('[data-next]',wizard).forEach(b=>b.addEventListener('click',()=>{if(validate()){if(step===1)summary();showStep(step+1);}}));
 $$('[data-back]',wizard).forEach(b=>b.addEventListener('click',()=>showStep(step-1)));
 wizard.addEventListener('submit',e=>{e.preventDefault();if(step<2){if(validate()){if(step===1)summary();showStep(step+1);}return;}if(!validate())return;$$('.form-step,.steps',wizard).forEach(el=>el.hidden=true);const result=$('[data-success]',wizard);result.hidden=false;const heading=$('h2',result);heading.setAttribute('tabindex','-1');heading.focus();});
 $('[data-reset]',wizard)?.addEventListener('click',()=>{wizard.reset();slot='';$$('[data-slot]',wizard).forEach(b=>b.setAttribute('aria-pressed','false'));$('[data-success]',wizard).hidden=true;$('.steps',wizard).hidden=false;showStep(0);});
 const param=new URLSearchParams(location.search).get('interesse');
 if(param){const select=$('select[name=interest]',wizard);if(select&&[...select.options].some(o=>o.value===param))select.value=param;const experience=$('select[name=experience]',wizard);if(experience&&[...experience.options].some(o=>o.value===param))experience.value=param;}
}

const search=$('[data-faq-search]');
search?.addEventListener('input',()=>{const q=search.value.trim().toLocaleLowerCase('it');let count=0;$$('[data-search-item]').forEach(el=>{el.hidden=!el.textContent.toLocaleLowerCase('it').includes(q);if(!el.hidden)count++;});const status=$('[data-search-status]');if(status)status.textContent=count?`${count} ${count===1?'risposta disponibile':'risposte disponibili'}`:'Nessuna risposta trovata. Prova con una parola diversa.';});

$$('img').forEach(img=>img.addEventListener('error',()=>{const parent=img.closest('.image-frame');if(parent){img.hidden=true;parent.classList.add('image-unavailable');parent.setAttribute('role','img');parent.setAttribute('aria-label',img.alt||'Immagine non disponibile');}}));

