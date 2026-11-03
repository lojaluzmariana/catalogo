/* Produção: mensagem assistida para WhatsApp comum. Nenhuma API ou envio automático. */
(function(){'use strict';const recipient='5584991988267';
const clean=(v,n=4000)=>String(v??'').replace(/\r/g,'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').slice(0,n).trim();
function resolvedItems({order={},quote={},products=[]}={}){
 const qs=Array.isArray(quote.itens)?quote.itens:[],items=Array.isArray(order.items)&&order.items.length?order.items:qs;
 return items.map((item,index)=>{
  const q=qs[index]&&String(qs[index].productId||qs[index].product_id||'')===String(item.product_id||item.productId||'')?qs[index]:qs.find(q=>String(q.productId||q.product_id||'')===String(item.product_id||item.productId||'')&&String(q.variantId||q.variant_id||'')===String(item.variantId||item.variant_id||''))||{};
  const p=products.find(p=>String(p.id)===String(item.product_id||item.productId||q.productId||q.product_id));
  const vid=item.variantId||item.variant_id||q.variantId||q.variant_id;
  const v=vid?(p?.product_variants||p?.variants||[]).find(v=>String(v.id)===String(vid)):null;
  const photo=v?.photo_url||v?.photo||item.photo_url||q.photo_url||p?.photo_url||'';
  return {item,q,name:clean(item.product_name||item.pedido||q.pedido||'Item',400),variant:clean(item.variant_name||item.variantName||q.variant_name||q.variantName||v?.name||'',300),photo:/^https:\/\//i.test(photo)?photo:''};
 });
}
function photos(data){return resolvedItems(data).filter(x=>x.photo).map((x,index)=>({url:x.photo,name:x.name,variant:x.variant,index}));}
function message({order={},quote={},products=[]}={}){const quoteItems=Array.isArray(quote.itens)?quote.itens:[],items=Array.isArray(order.items)&&order.items.length?order.items:quoteItems;
const lines=['PRODUÇÃO — ILUMINART / LUZ MARIANA'];if(order.order_number!=null)lines.push('Pedido nº '+clean(order.order_number,50));else if(order.id)lines.push('Referência do pedido: '+clean(order.id,80));if(quote.numero!=null)lines.push('Orçamento nº '+clean(quote.numero,50));const date=clean(order.custom_deadline_date||quote.previsao_entrega,20);if(date)lines.push('Entrega combinada: '+date);else if(quote.prazo_dias!=null)lines.push('Prazo de produção: '+clean(quote.prazo_dias,10)+' dia(s) útil(eis) após confirmação.');
const customer=order.customer_name||quote.cliente_nome;if(customer)lines.push('Cliente: '+clean(customer,300));
lines.push('','ITENS PARA PRODUÇÃO');resolvedItems({order,quote,products}).forEach(({item,q,name,variant,photo},index)=>{lines.push((index+1)+'. '+clean(item.quantity??item.quantidade??1,20)+' × '+name);if(variant)lines.push('Modelo / tamanho: '+variant);const note=item.observacoes||item.observations||q.observacoes||q.observations;if(note)lines.push('Detalhes: '+clean(note));if(photo)lines.push('Foto de referência: '+photo);});
const observations=quoteItems[0]?.calculatorQuoteSettings?.observations||quote.observacoes;if(observations)lines.push('','OBSERVAÇÕES DO ORÇAMENTO',clean(observations,10000));lines.push('','Confira cores, modelos e observações antes de iniciar.');return lines.join('\n');}
function url(text){const u=new URL('https://wa.me/'+recipient);u.searchParams.set('text',text);return u.href;}
function open(data){const text=message(data),href=url(text);let target=null;try{target=window.open(href,'_blank');if(target)target.opener=null;}catch{}if(target&&(text.length>6000||photos(data).length))show(data);return {opened:!!target,text,href};}
function show(data){document.getElementById('production-whatsapp-dialog')?.dispatchEvent(new Event('production-close'));const d=document.createElement('dialog');d.id='production-whatsapp-dialog';d.setAttribute('aria-label','Detalhes para a produção');d.innerHTML='<style>#production-whatsapp-dialog{width:min(650px,calc(100vw - 24px));max-height:calc(100dvh - 24px);padding:24px;border:1px solid #d8ccb3;border-radius:16px;background:#fffdf8;color:#102d4b;overflow:auto}#production-whatsapp-dialog::backdrop{background:#102d4baa}#production-whatsapp-dialog h2{font:25px Georgia;margin:0 0 12px}#production-whatsapp-dialog p{font:13px/1.7 Arial;margin:12px 0}#production-whatsapp-dialog textarea{box-sizing:border-box;width:100%;height:300px;max-height:42vh;border:1px solid #c6cdd3;border-radius:9px;padding:14px;font:14px/1.6 Arial;color:#102d4b;background:white}#production-whatsapp-dialog .actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:15px}#production-whatsapp-dialog button,#production-whatsapp-dialog a{padding:12px 16px;border-radius:8px;border:1px solid #bac5cf;min-height:44px;font:700 13px Arial;text-decoration:none;cursor:pointer;color:#102d4b;background:#eee7d8;box-sizing:border-box}#production-whatsapp-dialog a{background:#102d4b;color:white;display:inline-flex;align-items:center}#production-whatsapp-dialog .close{float:right;background:transparent;border:0;font-size:20px}</style><button type="button" class="close" aria-label="Fechar detalhes da produção">×</button><h2>Detalhes para a produção</h2><p>Destino: +55 84 99198-8267. Confira a mensagem e continue no WhatsApp para enviar.</p><textarea readonly aria-label="Mensagem de produção"></textarea><p class="send-note"></p><div class="actions"><button type="button" class="copy">Copiar todos os detalhes</button><a target="_blank" rel="noopener">Abrir no WhatsApp</a></div><p class="status" role="status"></p>';
const text=message(data),field=d.querySelector('textarea'),link=d.querySelector('a');field.value=text;link.href=url(text);d.querySelector('.send-note').textContent=text.length>6000?'Se o WhatsApp não preencher todos os detalhes, use Copiar todos os detalhes e cole na conversa.':'A mensagem será preenchida. Confirme o envio no próprio WhatsApp.';
const objectURLs=[];const dispose=()=>{objectURLs.forEach(u=>URL.revokeObjectURL(u));d.close();d.remove();};d.querySelector('.close').onclick=dispose;d.addEventListener('cancel',e=>{e.preventDefault();dispose();});d.addEventListener('production-close',dispose);d.querySelector('.copy').onclick=async()=>{try{await navigator.clipboard.writeText(text);d.querySelector('.status').textContent='Detalhes copiados.';}catch{field.focus();field.select();d.querySelector('.status').textContent='Texto selecionado para copiar.';}};document.body.append(d);d.showModal();
const refs=photos(data);if(refs.length){
 const section=document.createElement('section');section.className='production-photos';
 const h=document.createElement('h3');h.textContent='Fotos para enviar como anexo';section.append(h);
 const hint=document.createElement('p');hint.textContent='O link da mensagem não anexa a imagem. No celular, toque em Compartilhar foto e escolha o WhatsApp e o destinatário. No computador, baixe a foto e anexe à conversa.';section.append(hint);
 d.insertBefore(section,field);
 refs.forEach(ref=>{
  const row=document.createElement('div');row.style.cssText='border:1px solid #d8ccb3;border-radius:10px;padding:12px;margin:10px 0';
  const img=document.createElement('img');img.src=ref.url;img.alt=ref.name+(ref.variant?' · '+ref.variant:'');img.style.cssText='width:100%;height:160px;object-fit:contain;background:#f7f4ed';row.append(img);
  const title=document.createElement('p');title.textContent=(ref.index+1)+'. '+img.alt;row.append(title);
  const actions=document.createElement('div');actions.className='actions';
  const share=document.createElement('button');share.type='button';share.textContent='Preparando foto…';share.disabled=true;
  const download=document.createElement('a');download.href=ref.url;download.target='_blank';download.rel='noopener';download.textContent='Abrir foto';
  const status=document.createElement('p');status.setAttribute('role','status');actions.append(share,download);row.append(actions,status);section.append(row);
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
  fetch(ref.url,{signal:controller.signal}).then(res=>{if(!res.ok)throw Error();return res.blob();}).then(blob=>{
   if(!/^image\//.test(blob.type)||!blob.size)throw Error();if(!d.isConnected)return;
   const ext=blob.type==='image/png'?'png':blob.type==='image/webp'?'webp':'jpg';
   const filename='producao-'+(ref.index+1)+'-'+ref.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').slice(0,70)+'.'+ext;
   const file=new File([blob],filename,{type:blob.type}),blobURL=URL.createObjectURL(blob);objectURLs.push(blobURL);download.href=blobURL;download.download=filename;download.textContent='Baixar foto';
   const supported=typeof navigator.share==='function'&&typeof navigator.canShare==='function'&&navigator.canShare({files:[file]});
   share.textContent=supported?'Compartilhar foto':'Compartilhamento indisponível';share.disabled=!supported;
   if(!supported)status.textContent='Baixe a foto e anexe no WhatsApp. O compartilhamento depende de HTTPS e do navegador.';
   share.onclick=()=>{share.disabled=true;status.textContent='';navigator.share({files:[file],title:img.alt,text:img.alt}).then(()=>{status.textContent='Compartilhamento concluído. Confira o envio na conversa escolhida.';}).catch(e=>{status.textContent=e.name==='AbortError'?'Compartilhamento cancelado.':'Não foi possível compartilhar. Baixe a foto e anexe no WhatsApp.';}).finally(()=>{share.disabled=false;});};
  }).catch(()=>{if(!d.isConnected)return;share.textContent='Compartilhamento indisponível';status.textContent='Não foi possível preparar o arquivo. Use Abrir foto para salvar e anexar manualmente.';}).finally(()=>clearTimeout(timeout));
 });
}}

window.LMProductionWhatsApp={recipient,message,photos,url,open,show};})();
