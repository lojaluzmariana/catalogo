/* Regras compartilhadas do app; o banco confirma permissões e valores. */
(function(root){'use strict';
const pickup='Rua Alice Medeiros, São José, Macaíba - RN, 59280-670';
function number(v){const s=String(v??'').trim();return /^(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(s)?Number(s.replace(',','.')):NaN;}
function fee(km){if(typeof LMDelivery!=='undefined')return LMDelivery.fee(km);const raw=String(km??'').trim();const n=number(raw);if(!/^(?:\d+(?:[.,]\d{1,2})?|[.,]\d{1,2})$/.test(raw)||!Number.isFinite(n)||n<0||n>1000)return NaN;const rounded=Math.round(n*100)/100;return Math.round((5+Math.max(0,rounded-5))*100)/100;}
function key(item){return (item.product_id||item.name||'item')+'::'+(item.model||'');}
function stage(order,item){const m=order.production?.[key(item)]||{},f=order.fulfillment?.[key(item)]||{};if(order.status==='concluido'||item.stock||f.alreadyProduced||Number(m.done)>=Number(item.quantity))return 'ready';return m.stage||'todo';}
function map(origin,destination){const u=new URL('https://www.google.com/maps/dir/');u.search=new URLSearchParams({api:'1',origin,destination,travelmode:'driving'});return u.href;}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function photo(u){try{const url=new URL(u);return url.protocol==='https:'?url.href:'';}catch{return '';}}
root.MobileCore={pickup,number,fee,key,stage,map,esc,photo};
})(globalThis);
