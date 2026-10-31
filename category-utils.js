/* Classificação de catálogo: categoria principal existente + várias subcategorias. */
(function(){'use strict';
function key(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();}
function clean(values){const list=Array.isArray(values)?values:String(values||'').split(/[,;\n]/),seen=new Set(),out=[];for(const raw of list){const value=String(raw||'').trim().replace(/\s+/g,' ');if(!value)continue;if(value.length>60)throw Error('Cada subcategoria pode ter até 60 caracteres.');if(!seen.has(key(value))){seen.add(key(value));out.push(value);}}if(out.length>12)throw Error('Use até 12 subcategorias por produto.');return out;}
function subs(p){try{return clean(p?.subcategories||[]);}catch{return [];}}
function primary(p){return String(p?.category||'').trim()||'Outros';}
function matches(p,category,sub){return (!category||key(primary(p))===key(category))&&(!sub||subs(p).some(x=>key(x)===key(sub)));}
function unique(values){const m=new Map();for(const s of values)if(!m.has(key(s)))m.set(key(s),s);return [...m.values()].sort((a,b)=>a.localeCompare(b,'pt-BR'));}
function categories(products){return unique(products.map(primary));}
function subcategories(products,category){return unique(products.filter(p=>matches(p,category,'')).flatMap(subs));}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function select(id,label,values,current,empty){return '<label for="'+id+'">'+label+'<select id="'+id+'" aria-label="'+esc(label)+'"><option value="">'+empty+'</option>'+values.map(v=>'<option value="'+esc(v)+'" '+(key(v)===key(current)?'selected':'')+'>'+esc(v)+'</option>').join('')+'</select></label>';}
function controls(products,category,sub,prefix,withCategory){const values=subcategories(products,category);return '<div class="taxonomy-filters" aria-label="Categoria e subcategoria">'+(withCategory?select(prefix+'-category','Categoria',categories(products),category,'Todas as categorias'):'')+((values.length||sub)?select(prefix+'-subcategory','Subcategoria',values,sub,'Todas as subcategorias'):'')+'</div>';}
window.LMCategory={key,clean,subs,primary,matches,categories,subcategories,controls};
})();
