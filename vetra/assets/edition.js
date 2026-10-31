/* Native scroll, event-driven updates. No perpetual rendering loop. */
(() => {
 'use strict';
 const all=(s,p=document)=>[...p.querySelectorAll(s)],one=(s,p=document)=>p.querySelector(s);
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 const still=()=>media.matches||document.body.classList.contains('motion-off');
 const wide=()=>innerWidth>800&&innerHeight>720;
 document.body.classList.add('v2-loaded');
 const tasting=[
  {title:'Ritornare all’essenziale.',caption:'QUATTRO PASSAGGI · ANIMA VEGETALE',courses:['Orto, erbe e fermentazioni','Il riso, il bosco, la nocciola','Radici al fuoco vivo','Mela, miele e rosmarino'],price:'65'},
  {title:'Perdersi. Ritrovarsi.',caption:'SEI PASSAGGI · IL RACCONTO DEL BOSCO',courses:['Benvenuto dalla cucina','Funghi, castagne e sottobosco','Pasta alle erbe e burro nocciola','Il fuoco, la terra, la stagione','Una pausa di freschezza','Cioccolato, resina e frutti rossi'],price:'85'},
  {title:'Lascia spazio alla sorpresa.',caption:'OTTO PASSAGGI · FIDATI DELLA STAGIONE',courses:['Un inizio inatteso','Tre incontri con la stagione','Due passaggi dalla cucina calda','Un piccolo intermezzo','Il finale, da ricordare'],price:'110'}
 ];
 function tabs(selector,onSelect){
  const list=all(selector);list.forEach((b,i)=>{b.addEventListener('click',()=>{list.forEach((x,j)=>{x.setAttribute('aria-selected',String(i===j));x.tabIndex=i===j?0:-1});onSelect(i,b)});b.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowRight')n=(i+1)%list.length;else if(e.key==='ArrowLeft')n=(i+list.length-1)%list.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=list.length-1;else return;e.preventDefault();list[n].click();list[n].focus()})});
 }
 tabs('[data-tasting]',(i,b)=>{const d=tasting[i];one('[data-tasting-caption]').textContent=d.caption;one('[data-tasting-title]').textContent=d.title;const ul=one('[data-tasting-courses]');ul.replaceChildren(...d.courses.map(c=>{const li=document.createElement('li');li.textContent=c;return li}));const price=one('[data-tasting-price]');price.replaceChildren(document.createTextNode('€ '+d.price+' '));const small=document.createElement('small');small.textContent='per persona';price.append(small);one('#menu-panel').setAttribute('aria-labelledby',b.id)});
 const practice=[
  ['Impresa e governance','Dare struttura alla crescita.','Decisioni societarie, assetti di governance e passaggi che cambiano il futuro di un’impresa.','impresa.html'],
  ['Contratti e operazioni','Scrivere possibilità, prima che limiti.','Accordi commerciali e operazioni da costruire con attenzione ai rapporti, agli obiettivi e al contesto.','accordi.html'],
  ['Lavoro e organizzazione','Mettere le persone nel quadro.','Relazioni di lavoro e scelte organizzative, considerate nella loro dimensione professionale e umana.','competenze.html#lavoro'],
  ['Patrimonio e successione','Proteggere una continuità.','Pianificazione patrimoniale e passaggi generazionali: dare ordine alle intenzioni, con una visione nel tempo.','competenze.html#patrimonio'],
  ['Contenzioso e negoziazione','Trovare lo spazio di una soluzione.','Leggere un conflitto, valutare le alternative e scegliere una direzione consapevole.','competenze.html#contenzioso'],
  ['Digitale e proprietà intellettuale','Riconoscere il valore delle idee.','Tecnologia, dati e beni immateriali: comprendere i nuovi scenari e la loro relazione con l’attività.','competenze.html#digitale']
 ];
 all('[data-practice]').forEach((b,i)=>b.addEventListener('click',()=>{all('[data-practice]').forEach((x,j)=>{x.classList.toggle('active',i===j);x.setAttribute('aria-pressed',String(i===j))});const d=practice[i];one('[data-practice-name]').textContent=d[0];one('[data-practice-title]').textContent=d[1];one('[data-practice-copy]').textContent=d[2];one('[data-practice-link]').href=d[3];one('[data-practice-number]').textContent=String(i+1).padStart(2,'0');all('.v-diagram i').forEach((el,n)=>el.style.transform=`translateX(${-50-n*(25+i*5)}%) skewY(${-12+i*4}deg)`)}));
 const care=[
  ['Prevenzione e igiene','Le piccole attenzioni. Il valore nel tempo.','Conoscere la propria salute orale e costruire abitudini consapevoli. Un punto di partenza da definire insieme.','prevenzione','PRENDERSI CURA, OGNI GIORNO.'],
  ['Estetica del sorriso','Armonia. Nel tuo modo di essere.','Un confronto su desideri, esigenze e possibilità. Per valutare scelte informate, rispettando la tua naturalezza.','estetica','NATURALEZZA, PRIMA DI TUTTO.'],
  ['Ortodonzia','Un percorso. Il tuo ritmo.','Valutazione, dialogo e pianificazione: capire insieme se un percorso ortodontico risponde alle tue esigenze.','ortodonzia','OGNI PASSO HA IL SUO TEMPO.']
 ];
 tabs('[data-care]',(i,b)=>{const d=care[i];one('[data-care-kicker]').textContent=d[0];one('[data-care-title]').textContent=d[1];one('[data-care-copy]').textContent=d[2];one('[data-care-link]').href='trattamenti.html#'+d[3];one('[data-care-label]').textContent=d[4];one('#care-panel').setAttribute('aria-labelledby',b.id);one('.l-tooth svg').style.transform=`rotate(${-7+i*8}deg)`});
 const cinema=one('[data-cinema]'),method=one('[data-method]'),opening=one('.s-opening,.v-opening,.l-opening');let stage=-1,methodStage=-1,scheduled=false;
 const cinemaWords=['La materia.','Il gesto.','Il piatto.'];
 const cinemaCopy=['Ascoltare la stagione. Lasciare che sia lei a decidere da dove cominciare.','Trasformare senza nascondere. Ogni gesto custodisce il carattere di un ingrediente.','Ritrovare tutto, in un assaggio. Il territorio diventa un incontro, a tavola.'];
 function showStage(i){if(!cinema||stage===i)return;stage=i;all('.cinema-image',cinema).forEach((el,n)=>el.classList.toggle('active',n===i));all('[data-cinema-step]',cinema).forEach((el,n)=>el.setAttribute('aria-pressed',String(n===i)));one('[data-cinema-word]',cinema).textContent=cinemaWords[i];one('[data-cinema-copy]',cinema).textContent=cinemaCopy[i];one('.cinema-counter',cinema).textContent=`0${i+1} / 03`;}
 all('[data-cinema-step]').forEach((b,i)=>b.addEventListener('click',()=>{if(wide()&&!still()){const top=cinema.getBoundingClientRect().top+scrollY,travel=cinema.offsetHeight-innerHeight;window.scrollTo({top:top+travel*(i/2),behavior:'smooth'})}else showStage(i)}));
 const progress=el=>{const r=el.getBoundingClientRect();return Math.min(1,Math.max(0,-r.top/Math.max(1,r.height-innerHeight)))};
 function update(){scheduled=false;if(still()||!wide()){opening?.style.setProperty('--opening-progress',0);return;}if(opening){const r=opening.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)opening.style.setProperty('--opening-progress',Math.min(1,Math.max(0,-r.top/r.height)));}if(cinema){const p=progress(cinema);showStage(Math.min(2,Math.floor(p*2.999)));cinema.style.setProperty('--cinema-phase',p)}if(method){const i=Math.min(2,Math.floor(progress(method)*2.999));if(methodStage!==i){methodStage=i;all('.v-method-steps article',method).forEach((el,n)=>el.classList.toggle('active',i===n));one('[data-method-number]',method).textContent=`0${i+1}`}}}
 function tick(){if(!scheduled&&!document.hidden){scheduled=true;requestAnimationFrame(update)}}
 if(cinema||method||opening){addEventListener('scroll',tick,{passive:true});addEventListener('resize',tick,{passive:true});addEventListener('pageshow',tick);media.addEventListener('change',tick);all('[data-motion-toggle]').forEach(b=>b.addEventListener('click',()=>{if(cinema)showStage(0);tick()}));showStage(0);tick()}
})();
