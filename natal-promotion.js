/* A exibição depende da campanha real do banco, nunca de preço fictício. */
(function(){'use strict';
const id='a263c115-2026-4015-8000-000000000001';
function active(c){return c?.id===id&&c.active&&Number(c.discount_value)===15&&c.discount_type==='percentual'&&Date.now()>=new Date(c.starts_at).getTime()&&Date.now()<=new Date(c.ends_at).getTime();}
function badge(c){return active(c)?'<span class="natal-offer-tag">Natal · 15% OFF até 01/12</span>':'';}
function banner(c,href='#loja/natal'){return active(c)?'<aside class="natal-offer-banner" aria-label="Promoção de Natal"><div><small>NATAL ANTECIPADO</small><strong>Seu Natal com 15% de desconto</strong><p>Em todos os produtos da categoria Natal, avulsos ou em kits. Até 01/12/2026, às 23h59 (Brasília).</p><span>Pix e cartão · desconto automático · não cumulativo com cupons</span></div><a href="'+href+'">Escolher peças de Natal →</a></aside>':'';}
function watch(read,refresh){let signature='';function tick(){const rows=read()||[],now=Date.now(),next=rows.flatMap(c=>[new Date(c.starts_at).getTime(),new Date(c.ends_at).getTime()+1]).filter(t=>t>now&&Number.isFinite(t));const value=rows.filter(c=>c.active&&now>=new Date(c.starts_at).getTime()&&now<=new Date(c.ends_at).getTime()).map(c=>c.id).sort().join('|');if(signature!==value){signature=value;refresh();}return Math.max(50,Math.min(60000,...next.map(t=>t-now)));}function loop(){setTimeout(loop,tick());}loop();document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});}
window.LMNatalPromotion={id,active,badge,banner,watch};
})();
