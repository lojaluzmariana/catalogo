(function(){'use strict';
let config=null,dialog=null,busy=false;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function node(tag,text,className){const n=document.createElement(tag);if(text!=null)n.textContent=text;if(className)n.className=className;return n;}
function button(text,fn){const b=node('button',text);b.type='button';b.onclick=fn;return b;}
function options(){return config.products().filter(p=>p.active!==false);}
function message(text){dialog.querySelector('[data-qs-status]').textContent=text;}
async function rpc(name,args){const r=await config.client.rpc(name,args);if(r.error)throw Error(r.error.message||'Não foi possível atualizar os vínculos.');return r.data;}
async function open(productId){if(busy)return;busy=true;if(!dialog){dialog=node('dialog');dialog.className='quote-sales-dialog';document.body.append(dialog);}dialog.replaceChildren();
 const head=node('div',null,'qs-head');head.append(node('h2','Vendas de orçamentos'),button('Fechar',()=>dialog.close()));dialog.append(head,node('p','Associe itens de pedidos já aprovados aos produtos e tamanhos do catálogo. O vínculo usa a quantidade original e não cria outra venda.'));
 const status=node('p','Conferindo correspondências exatas…');status.dataset.qsStatus='';status.setAttribute('role','status');dialog.append(status);if(!dialog.open)dialog.showModal();
 try{const automatic=await rpc('quote_sales_reconcile'),data=await rpc('quote_sales_pending');message((automatic.linked?automatic.linked+' item(ns) reconhecido(s) automaticamente. ':'')+data.linked_items+' item(ns) de pedidos já vinculados. '+data.items.length+' pendente(s) de revisão.');
 dialog.append(node('p','Orçamentos sem pedido aprovado e pedidos cancelados ficam fora desta revisão. Mini e Padrão devem apontar para seus modelos respectivos.'));
 const filter=node('input');filter.type='search';filter.placeholder='Buscar item vendido (ex.: estrela)';filter.setAttribute('aria-label','Buscar item vendido');dialog.append(filter);
 const list=node('div',null,'qs-list');dialog.append(list);
 for(const item of data.items){const card=node('section',null,'qs-item');card.dataset.search=norm(item.name+' '+item.variant+' '+item.quote_number);card.append(node('h3',item.name),node('p','Orçamento nº '+item.quote_number+' · '+item.quantity+' unidade(s)'+(item.variant?' · '+item.variant:'')));
 const product=node('select'),variant=node('select');product.setAttribute('aria-label','Produto do catálogo para '+item.name);variant.setAttribute('aria-label','Modelo vendido de '+item.name);
 product.add(new Option('Escolha o produto do catálogo',''));const rows=options().filter(p=>(!item.product_id||p.id===item.product_id)&&(!['iluminart','luz_mariana'].includes(item.brand)||config.brand(p.id)===item.brand));
 // Similaridade só ordena sugestões. Nunca confirma vínculos aproximados.
 const words=norm(item.name).split(' ').filter(w=>w.length>3),score=p=>words.filter(w=>norm(p.name).includes(w)).length;
 rows.sort((a,b)=>score(b)-score(a)||a.name.localeCompare(b.name,'pt-BR'));for(const p of rows)product.add(new Option(p.name,p.id));
 if(productId&&rows.some(p=>p.id===productId)&&score(rows.find(p=>p.id===productId))>0)product.value=productId;
 if(item.product_id&&rows.some(p=>p.id===item.product_id))product.value=item.product_id;
 const fill=()=>{variant.replaceChildren();const p=rows.find(p=>p.id===product.value),vs=p?.product_variants||[];variant.hidden=!vs.length;variant.add(new Option(vs.length?'Escolha Mini, Padrão ou outro modelo':'Sem variações',''));for(const v of vs)variant.add(new Option(v.name,v.id));};product.onchange=fill;fill();
 const remember=node('input');remember.type='checkbox';remember.checked=true;const label=node('label');label.append(remember,document.createTextNode(' Memorizar este nome e modelo para próximos orçamentos'));
 const error=node('p');error.setAttribute('role','alert');const save=button('Vincular '+item.quantity+' unidade(s)',async()=>{if(!product.value){error.textContent='Escolha o produto.';return;}if(!variant.hidden&&!variant.value){error.textContent='Escolha o modelo ou tamanho vendido.';return;}save.disabled=true;error.textContent='';try{await rpc('quote_sales_link',{p_item:item.item_id,p_product:product.value,p_variant:variant.value||null,p_remember:remember.checked});await rpc('quote_sales_reconcile');card.replaceChildren(node('p','✓ Vínculo salvo: '+item.quantity+' unidade(s) · '+product.selectedOptions[0].textContent+(variant.value?' · '+variant.selectedOptions[0].textContent:'')));message('Vínculos atualizados. As quantidades serão refletidas nos mais vendidos ao atualizar a loja. Clique em “Revisar novamente” para conferir os demais itens reconhecidos.');}catch(e){error.textContent=e.message;save.disabled=false;}});
 card.append(product,variant,label,error,save);list.append(card);}
 if(!data.items.length)list.append(node('p','Nenhum item aprovado precisa de vínculo neste momento.'));
 filter.oninput=()=>list.querySelectorAll('[data-search]').forEach(el=>el.hidden=!el.dataset.search.includes(norm(filter.value)));
 dialog.append(button('Revisar novamente',()=>open(productId)));
 }catch(e){message('Não foi possível consultar os vínculos: '+e.message+' Se a função ainda não existe, execute Instalar_Vinculos_Vendas_Orcamentos.sql no Supabase.');}finally{busy=false;}
}
function mount(container,settings){config=settings;if(container.querySelector('[data-qs-open]'))return;const b=button('Vincular vendas de orçamentos',()=>open());b.dataset.qsOpen='';b.className='qs-open';container.prepend(b);}
async function afterSaved(productId){try{await rpc('quote_sales_reconcile');const data=await rpc('quote_sales_pending'),product=config.products().find(p=>p.id===productId);if(product&&data.items.some(i=>norm(i.name).split(' ').filter(w=>w.length>3).some(w=>norm(product.name).includes(w))))await open(productId);}catch{ /* O cadastro continua funcionando antes da instalação do SQL. */ }}
window.LMQuoteSales={mount,open,afterSaved};
})();
