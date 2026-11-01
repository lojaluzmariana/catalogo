/* Composição de kits. Preços e produtos sempre vêm do catálogo atual. */
(() => {
  'use strict';
  const CART='luzmariana_cart_v1', NOTES='iluminart_cart_notes_v1', DRAFT='iluminart_kit_natal_draft_v1';
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const money=value=>(Number(value)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const cents=value=>Math.round(Number(value)*100);
  const mode=p=>['catalog','kit_only'].includes(p?.kit_mode)?p.kit_mode:'off';
  const visible=p=>!!p&&mode(p)!=='kit_only';
  const eligible=p=>!!p&&mode(p)!=='off'&&['iluminart','luz_mariana'].includes(p.brand);
  const group=key=>String(key).split('::')[2]?.match(/^kit_[a-z0-9-]{8,60}$/i)?.[0]||'';
  const label=key=>group(key)?'Kit de Natal #'+group(key).slice(4,12).toUpperCase():'';
  let config=null,dialog=null,opener=null,choices=new Map(),draft=[],notes='',search='',category='';
  function read(key){try{const value=JSON.parse(localStorage.getItem(key)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch{return {};}}
  function saveDraft(){try{localStorage.setItem(DRAFT,JSON.stringify({rows:draft,notes}));}catch{}}
  function loadDraft(){const saved=read(DRAFT);draft=(Array.isArray(saved.rows)?saved.rows:[]).slice(0,100).filter(r=>typeof r.productId==='string'&&r.productId.length<100&&typeof r.variantId==='string'&&r.variantId.length<100&&Number.isInteger(r.quantity)&&r.quantity>0&&r.quantity<=999);notes=typeof saved.notes==='string'?saved.notes.slice(0,500):'';}
  function products(){return (config?.products()||[]).filter(eligible);}
  function variants(p){return config?.variants(p)||[];}
  function selectedOffer(p){
    const all=variants(p),chosen=all.find(v=>v.id===choices.get(p.id));
    if(chosen)return {v:chosen,price:config.pricing(p,chosen)};
    const options=(all.length?all:[null]).map(v=>({v,price:config.pricing(p,v)}));
    const priced=options.filter(o=>Number.isFinite(o.price?.promoPrice)&&o.price.promoPrice>0).sort((a,b)=>a.price.promoPrice-b.price.promoPrice);
    const offer=priced[0]||options[0];if(offer?.v)choices.set(p.id,offer.v.id);return offer;
  }
  function rowData(row){const p=products().find(p=>p.id===row.productId),v=p&&row.variantId?variants(p).find(v=>v.id===row.variantId):null;const valid=!!p&&(!row.variantId||!!v)&&(!variants(p).length||!!v);const price=valid?config.pricing(p,v):null;return {...row,p,v,price,valid:valid&&Number.isFinite(price?.promoPrice)&&price.promoPrice>0};}
  function selection(){return draft.map(rowData);}
  function selectionError(rows){if(rows.some(r=>!r.valid))return 'Uma peça ou modelo mudou. Remova essa seleção e escolha novamente.';if(rows.length<2)return 'Escolha pelo menos duas peças ou modelos para compor seu kit.';if(!rows.some(r=>mode(r.p)==='catalog'))return 'Combine os complementos com pelo menos uma peça do catálogo.';return '';}
  function cartError(items){
    const groups=new Map();
    for(const it of items){
      const id=group(it.key),p=it.product,all=p?variants(p):[];
      if(!p||!Number.isInteger(it.quantity)||it.quantity<1||it.quantity>999||all.length&&!it.variant||String(it.key).split('::')[1]&&!it.variant)return 'Uma peça ou modelo do pedido precisa ser revisado.';
      if(!id){if(!visible(p))return 'Esta peça é exclusiva para kits. Remova-a e use “Monte seu kit de Natal”.';continue;}
      if(!eligible(p))return 'Uma peça do kit mudou. Remova esse kit e monte uma nova composição.';
      if(!groups.has(id))groups.set(id,[]);groups.get(id).push(it);
    }
    for(const rows of groups.values())if(rows.length<2||!rows.some(it=>mode(it.product)==='catalog'))return 'O kit precisa de pelo menos duas peças ou modelos, incluindo uma peça do catálogo. Remova o kit incompleto e monte novamente.';
    return '';
  }
  function grouped(items){const groups=new Map();for(const it of items){const id=group(it.key);if(!id)continue;if(!groups.has(id))groups.set(id,[]);groups.get(id).push(it);}return groups;}
  function cartBanner(items){const groups=grouped(items);return groups.size?'<div class="kit-cart-groups">'+[...groups].map(([id,rows])=>'<div class="kit-cart-group"><div><b>'+esc(label(rows[0].key))+'</b><span>'+rows.reduce((n,r)=>n+r.quantity,0)+' peças nesta composição</span></div><button type="button" data-remove-kit="'+esc(id)+'">Remover kit</button></div>').join('')+'</div>':'';}
  function orderSummary(items){return [...grouped(items)].map(([,rows])=>label(rows[0].key)+' — composição:\n'+rows.map(it=>'• '+it.quantity+' × '+it.product.name+(it.variant?' · '+it.variant.name:'')).join('\n')).join('\n\n');}
  function persist(cart,itemNotes){
    const oldCart=localStorage.getItem(CART),oldNotes=localStorage.getItem(NOTES);
    try{localStorage.setItem(NOTES,JSON.stringify(itemNotes));localStorage.setItem(CART,JSON.stringify(cart));}
    catch(err){try{oldNotes===null?localStorage.removeItem(NOTES):localStorage.setItem(NOTES,oldNotes);oldCart===null?localStorage.removeItem(CART):localStorage.setItem(CART,oldCart);}catch{}throw Error('Não conseguimos salvar o kit neste navegador. Libere o armazenamento e tente novamente.');}
  }
  function invitation(){return '<section class="kit-invite" aria-label="Monte seu kit de Natal"><div><small>NATAL DO SEU JEITO</small><h2>Monte seu kit de Natal</h2><p>Combine suas peças favoritas, escolha os modelos e crie um presente com a sua cara.</p></div><button type="button" class="kit-primary" data-open-christmas-kit>Montar meu kit →</button></section>';}
  function buildDialog(){
    dialog=document.createElement('dialog');dialog.id='christmasKitDialog';dialog.className='kit-modal';dialog.setAttribute('aria-labelledby','kit-title');
    dialog.innerHTML='<header class="kit-head"><div><small>NATAL · FEITO POR VOCÊ</small><h2 id="kit-title">Monte seu kit de Natal</h2><p>Combine pelo menos duas peças ou modelos. Os complementos exclusivos são oferecidos junto com uma peça do catálogo.</p></div><button type="button" class="kit-close" data-kit-close aria-label="Fechar montagem do kit">×</button></header><div class="kit-layout"><section class="kit-picker" aria-label="Peças para o kit"><div class="kit-filters"><label>Buscar peça<input type="search" id="kit-search" placeholder="Árvore, Noel, bandeja…"></label><label>Categoria<select id="kit-category"><option value="">Todas</option></select></label></div><div class="kit-options" id="kit-options"></div></section><aside class="kit-summary"><h3>Seu kit</h3><p class="kit-summary-intro">Escolha as peças ao lado e ajuste as quantidades aqui.</p><ul class="kit-lines" id="kit-lines"></ul><p class="kit-selection-status" id="kit-selection-status" role="status"></p><label for="kit-notes">Cores, montagem ou observações<textarea id="kit-notes" rows="3" maxlength="500" placeholder="Ex.: bandeja bege e peças em branco e dourado."></textarea></label><p class="kit-summary-intro">A combinação e os detalhes são confirmados com a loja antes da produção. Entrega e descontos são conferidos ao finalizar.</p></aside></div><p class="kit-error" id="kit-error" role="alert"></p><footer class="kit-footer"><div class="kit-footer-total"><span>Total das peças do kit</span><strong id="kit-total">R$ 0,00</strong><small id="kit-credit"></small></div><button type="button" class="kit-primary" id="kit-add-cart">Adicionar kit ao carrinho</button></footer>';
    document.body.append(dialog);
    dialog.querySelector('[data-kit-close]').onclick=()=>dialog.close();
    dialog.addEventListener('close',()=>{saveDraft();opener?.isConnected&&opener.focus();});
    dialog.querySelector('#kit-search').oninput=e=>{search=e.target.value;renderOptions();};
    dialog.querySelector('#kit-category').onchange=e=>{category=e.target.value;renderOptions();};
    dialog.querySelector('#kit-notes').oninput=e=>{notes=e.target.value;saveDraft();};
    dialog.addEventListener('change',e=>{const id=e.target.dataset.kitVariant;if(id){choices.set(id,e.target.value);renderOptions();}});
    dialog.addEventListener('click',e=>{
      const add=e.target.closest('[data-kit-add]');if(add){const p=products().find(p=>p.id===add.dataset.kitAdd),o=p&&selectedOffer(p);if(!o||!(o.price?.promoPrice>0))return;const existing=draft.find(r=>r.productId===p.id&&r.variantId===(o.v?.id||''));if(existing){if(existing.quantity>=999)return;existing.quantity++;}else{if(draft.length>=100){error('Use até 100 seleções por kit.');return;}draft.push({productId:p.id,variantId:o.v?.id||'',quantity:1});}saveDraft();renderSummary();add.textContent='Adicionado ✓';return;}
      const step=e.target.closest('[data-kit-step]'),remove=e.target.closest('[data-kit-remove]');
      if(step){const row=draft[Number(step.dataset.row)];if(row){row.quantity=Math.max(1,Math.min(999,row.quantity+Number(step.dataset.kitStep)));saveDraft();renderSummary();}}
      if(remove){draft.splice(Number(remove.dataset.kitRemove),1);saveDraft();renderSummary();}
    });
    dialog.querySelector('#kit-add-cart').onclick=addToCart;
  }
  function error(message){dialog.querySelector('#kit-error').textContent=message;}
  function renderOptions(){
    const target=dialog.querySelector('#kit-options');
    if(!config?.ready()){target.innerHTML='<p class="kit-empty">Não foi possível abrir as peças agora. Feche esta janela, atualize a loja e tente novamente.</p>';return;}
    const all=products(),list=all.filter(p=>(!category||(p.category||'Outros')===category)&&norm(p.name+' '+(p.category||'')+' '+(p.subcategories||[]).join(' ')).includes(norm(search)));
    target.innerHTML=list.map(p=>{const o=selectedOffer(p),vs=variants(p),photo=config.photo(p,o?.v),price=o?.price||{},canBuy=Number.isFinite(price.promoPrice)&&price.promoPrice>0;return '<article class="kit-piece"><div class="kit-piece-photo">'+(photo?'<img '+(window.LMPhoto?.attrs(p)||'')+' src="'+esc(photo)+'" alt="'+esc(p.name+(o?.v?' · '+o.v.name:''))+'" loading="lazy">':'')+'</div><div class="kit-piece-body"><span class="kit-tag">'+(mode(p)==='kit_only'?'Complemento exclusivo para kits':'Peça do catálogo')+'</span><h3>'+esc(p.name)+'</h3>'+(vs.length?'<label>Modelo / tamanho<select data-kit-variant="'+esc(p.id)+'" aria-label="Modelo de '+esc(p.name)+'">'+vs.map(v=>'<option value="'+esc(v.id)+'" '+(o?.v?.id===v.id?'selected':'')+'>'+esc(v.name)+'</option>').join('')+'</select></label>':'')+'<div class="kit-price">'+(canBuy?money(price.promoPrice)+' <small>Pix</small>':'Consulte o valor')+'</div><div class="kit-card-credit">'+(price.creditPrice>0?money(price.creditPrice)+' no cartão · até 3x de '+money(Math.ceil(cents(price.creditPrice)/3)/100):'Fale com a loja para consultar')+'</div><button class="kit-primary" type="button" data-kit-add="'+esc(p.id)+'" '+(canBuy?'':'disabled')+'>Adicionar ao kit</button></div></article>';}).join('')||'<p class="kit-empty">'+(all.length?'Nenhuma peça com essa busca. Tente outro nome ou categoria.':'Estamos preparando as peças para os kits de Natal. Em breve você poderá combinar seus modelos favoritos.')+'</p>';
  }
  function renderSummary(){
    const rows=selection(),problem=selectionError(rows),total=rows.reduce((n,r)=>n+(r.valid?cents(r.price.promoPrice)*r.quantity:0),0),creditValid=rows.every(r=>r.valid&&Number.isFinite(r.price.creditPrice)&&r.price.creditPrice>0),credit=rows.reduce((n,r)=>n+(r.valid?cents(r.price.creditPrice||0)*r.quantity:0),0);
    dialog.querySelector('#kit-lines').innerHTML=rows.map((r,i)=>'<li class="kit-line"><b>'+esc(r.p?.name||'Peça que saiu da seleção')+'</b><small>'+esc(r.v?.name||'Modelo único')+'</small><div class="kit-line-qty"><button type="button" data-kit-step="-1" data-row="'+i+'" aria-label="Diminuir '+esc(r.p?.name||'peça')+'" '+(r.quantity<=1?'disabled':'')+'>−</button><span>'+r.quantity+'</span><button type="button" data-kit-step="1" data-row="'+i+'" aria-label="Aumentar '+esc(r.p?.name||'peça')+'" '+(r.quantity>=999?'disabled':'')+'>+</button><button type="button" class="kit-remove" data-kit-remove="'+i+'">Remover</button></div><strong>'+(r.valid?money(cents(r.price.promoPrice)*r.quantity/100):'Escolha novamente')+'</strong></li>').join('');
    dialog.querySelector('#kit-selection-status').textContent=problem||rows.reduce((n,r)=>n+r.quantity,0)+' peças escolhidas. Seu kit está pronto para o carrinho.';
    dialog.querySelector('#kit-total').textContent=money(total/100)+' no Pix';
    dialog.querySelector('#kit-credit').textContent=rows.length&&creditValid?money(credit/100)+' no cartão · até 3x de '+money(Math.ceil(credit/3)/100):'Selecione as peças para ver o total.';
    dialog.querySelector('#kit-add-cart').disabled=!!problem||!config?.ready();error('');
  }
  function open(button){if(!config)return;if(!dialog)buildDialog();opener=button||document.activeElement;loadDraft();search='';category='';dialog.querySelector('#kit-search').value='';dialog.querySelector('#kit-notes').value=notes;dialog.querySelector('#kit-category').innerHTML='<option value="">Todas</option>'+[...new Set(products().map(p=>p.category||'Outros'))].sort((a,b)=>a.localeCompare(b,'pt-BR')).map(c=>'<option value="'+esc(c)+'">'+esc(c)+'</option>').join('');renderOptions();renderSummary();for(const d of document.querySelectorAll('dialog[open]'))if(d!==dialog)d.close();dialog.showModal();}
  function addToCart(){
    const rows=selection(),problem=selectionError(rows);if(problem){error(problem);return;}
    const button=dialog.querySelector('#kit-add-cart');button.disabled=true;
    try{
      const token=typeof crypto.randomUUID==='function'?crypto.randomUUID():Date.now().toString(36)+'-'+Array.from(crypto.getRandomValues(new Uint32Array(4)),n=>n.toString(36)).join('');
      const id='kit_'+token,cart={...config.cart()},itemNotes=read(NOTES);
      for(const r of rows){const key=r.p.id+'::'+(r.v?.id||'')+'::'+id;cart[key]=r.quantity;if(notes.trim())itemNotes[key]=notes.trim().slice(0,500);}
      const all=Object.entries(cart).map(([key,quantity])=>{const [pId,vId]=key.split('::'),p=config.products().find(p=>p.id===pId);return {key,quantity,product:p,variant:p&&vId?variants(p).find(v=>v.id===vId):null};});
      const invalid=cartError(all);if(invalid)throw Error(invalid);
      persist(cart,itemNotes);draft=[];notes='';saveDraft();dialog.close();config.added(cart,itemNotes);
    }catch(err){error(err.message||'Não conseguimos adicionar o kit. Tente novamente.');button.disabled=false;}
  }
  document.addEventListener('click',e=>{const openButton=e.target.closest('[data-open-christmas-kit]');if(openButton){e.preventDefault();open(openButton);}const remove=e.target.closest('[data-remove-kit]');if(remove&&config){const id=remove.dataset.removeKit,cart={...config.cart()},itemNotes=read(NOTES);for(const key of Object.keys(cart))if(group(key)===id){delete cart[key];delete itemNotes[key];}try{persist(cart,itemNotes);config.changed(cart,itemNotes);}catch(err){remove.textContent=err.message;}}});
  window.LMKits={configure:value=>{config=value;},mode,visible,eligible,group,label,cartError,cartBanner,orderSummary,invitation,open};
})();
