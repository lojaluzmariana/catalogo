/* Fotos, modelo e preços mudam em conjunto. Nenhuma gravação ou envio externo. */
(function(){'use strict';
const selector='[data-card-variant],[data-lm-card-variant]',groups=new Map(),reduced=matchMedia('(prefers-reduced-motion: reduce)'),delay=4500;
const idOf=s=>s.dataset.cardVariant||s.dataset.lmCardVariant;
const cardOf=s=>s.closest('.product,[data-product-card]');
function entries(s){return [...s.options].filter(o=>o.value&&o.dataset.modelPhoto==='1').sort((a,b)=>(Number(b.dataset.modelSales)||0)-(Number(a.dataset.modelSales)||0));}
function selects(id){return [...document.querySelectorAll(selector)].filter(s=>idOf(s)===id);}
function update(g){for(const s of selects(g.id)){const card=cardOf(s),items=entries(s),index=items.findIndex(o=>o.value===s.value),count=card.querySelector('[data-model-counter]'),toggle=card.querySelector('.model-carousel-toggle');if(count){const text=(index<0?'—':index+1)+' / '+items.length;if(count.textContent!==text)count.textContent=text;}if(toggle){const text=g.paused?'▶':'Ⅱ';if(toggle.textContent!==text)toggle.textContent=text;toggle.setAttribute('aria-label',(g.paused?'Retomar':'Pausar')+' carrossel de modelos');toggle.setAttribute('aria-pressed',String(g.paused));}}}
function step(g,direction,manual){const s=selects(g.id)[0];if(!s)return;const list=entries(s);if(list.length<2)return;const index=list.findIndex(o=>o.value===s.value);s.value=list[(index+direction+list.length)%list.length].value;const event=new Event('change',{bubbles:true});event.lmCarouselAutomatic=!manual;s.dispatchEvent(event);g.last=Date.now();update(g);}
function scan(){const active=new Set();for(const s of document.querySelectorAll(selector)){const id=idOf(s);active.add(id);const card=cardOf(s),list=entries(s);let g=groups.get(id);if(!g){g={id,paused:reduced.matches,last:Date.now()};groups.set(id,g);}let controls=card.querySelector('.model-carousel-controls,.lm-photo-controls');if(list.length<2){if(controls)controls.hidden=true;continue;}
 if(!controls){const image=card.querySelector('.product-image');if(!image)continue;let wrap=image.parentElement;if(!wrap.classList.contains('model-visual')){wrap=document.createElement('div');wrap.className='model-visual';image.before(wrap);wrap.append(image);}controls=document.createElement('div');controls.className='model-carousel-controls';controls.innerHTML='<button type="button" data-model-prev aria-label="Modelo anterior">‹</button><span data-model-counter></span><button type="button" data-model-next aria-label="Próximo modelo">›</button>';wrap.append(controls);}
 controls.hidden=false;
 // Existing catalogue arrows now follow the same best-selling model order.
 const previous=controls.querySelector('[data-carousel-prev]'),next=controls.querySelector('[data-carousel-next]');
 if(previous&&!previous.dataset.modelBound){previous.dataset.modelBound='1';previous.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();g.paused=true;step(g,-1,true);},true);}
 if(next&&!next.dataset.modelBound){next.dataset.modelBound='1';next.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();g.paused=true;step(g,1,true);},true);}
 const span=controls.querySelector('span');if(span)span.dataset.modelCounter='';
 if(!controls.querySelector('.model-carousel-toggle')){const button=document.createElement('button');button.type='button';button.className='model-carousel-toggle';controls.append(button);}
 if(!card.dataset.modelCarouselBound){card.dataset.modelCarouselBound='1';card.addEventListener('pointerdown',e=>{if(e.target.closest('.model-carousel-toggle'))return;g.paused=true;update(g);});card.addEventListener('change',e=>{if(e.target.matches(selector)&&!e.lmCarouselAutomatic){g.paused=true;g.last=Date.now();}update(g);});}
 update(g);
 }
 for(const id of groups.keys())if(!active.has(id))groups.delete(id);
}
document.addEventListener('click',e=>{const button=e.target.closest('.model-carousel-toggle,[data-model-prev],[data-model-next]');if(!button)return;const s=button.closest('.product,[data-product-card]')?.querySelector(selector),g=s&&groups.get(idOf(s));if(!g)return;e.preventDefault();e.stopPropagation();if(button.classList.contains('model-carousel-toggle')){g.paused=!g.paused;g.last=Date.now();update(g);}else{g.paused=true;step(g,button.hasAttribute('data-model-prev')?-1:1,true);}});
let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan();});}).observe(document.body,{childList:true,subtree:true});
setInterval(()=>{if(document.hidden)return;for(const g of groups.values()){if(g.paused||Date.now()-g.last<delay)continue;const cards=selects(g.id).map(cardOf);if(cards.some(c=>c.matches(':hover')||c.contains(document.activeElement)))continue;if(!cards.some(c=>{const r=c.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;}))continue;step(g,1,false);}},500);
document.addEventListener('visibilitychange',()=>{for(const g of groups.values())g.last=Date.now();});
reduced.addEventListener('change',e=>{if(e.matches)for(const g of groups.values()){g.paused=true;update(g);}});
scan();
})();
