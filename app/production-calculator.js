/* Calculadora interna: medidas informadas pela equipe, sem envio ao servidor. */
(() => {
  const calc = window.ProductionCalculator = {};
  const drafts = new Map();
  const blank = () => ({name:'', nozzle:'0.4', grams:'', hours:'0', minutes:'0'});
  const number = v => String(v).trim() === '' ? NaN : Number(String(v).trim().replace(',', '.'));
  const grams = v => v.toLocaleString('pt-BR', {maximumFractionDigits:2}) + ' g';
  const time = v => {const n=Math.round(v*60);return [Math.floor(n/86400)+' d',Math.floor(n/3600)%24+' h',Math.floor(n/60)%60+' min',n%60+' s'].filter(x=>!x.startsWith('0 ')).join(' ')||'0 min';};
  calc.compute = (qty, rows) => {
    const q = number(qty);
    if(!Number.isSafeInteger(q)||q<1||q>100000) return null;
    const parts=rows.map(r=>{
      const g=number(r.grams), h=number(r.hours||0), m=number(r.minutes||0);
      if(!Number.isFinite(g)||g<0||!Number.isSafeInteger(h)||h<0||!Number.isSafeInteger(m)||m<0||m>59) return null;
      const t=h*60+m;
      return Number.isFinite(g*q)&&Number.isSafeInteger(t*q*60)?{g,t,totalG:g*q,totalT:t*q}:null;
    });
    if(!parts.length||parts.some(p=>!p)) return null;
    const g=parts.reduce((s,p)=>s+p.g,0),t=parts.reduce((s,p)=>s+p.t,0);
    return Number.isFinite(g*q)&&Number.isSafeInteger(t*q*60)?{q,g,t,parts,totalG:g*q,totalT:t*q}:null;
  };
  calc.render = () => {
    if(role?.role!=='staff'||!session) return;
    const id=session.user.id;
    if(!drafts.has(id)) drafts.set(id,{qty:'1',rows:[blank()]});
    const d=drafts.get(id);
    $('view').innerHTML=heading('Produção','Calculadora de produção','Informe o tempo e a gramatura por unidade de cada etapa. Uso interno da equipe.')+
    `<section class="card"><label>Quantidade de unidades<input id="pc-qty" type="number" min="1" max="100000" step="1" value="${E(d.qty)}"></label><div id="pc-rows"></div><button type="button" id="pc-add">+ Adicionar etapa</button></section><section class="card" id="pc-results" aria-live="polite"></section><p class="hint">Tempo de impressão em sequência. Para estimar o prazo ao cliente, considere fila, preparação, montagem e acabamento. Se as peças forem impressas juntas na placa, confira o tempo do lote no fatiador.</p><button data-go="producao">Voltar à produção</button> <button data-go="orcamentos">Abrir calculadora de preços e orçamentos</button>`;
    const output=()=>{const r=calc.compute(d.qty,d.rows);
      $('pc-results').innerHTML='<h2>Resumo de material e tempo</h2>'+(!r?'<p>Preencha uma quantidade inteira positiva e informe a gramatura de cada etapa. Use de 0 a 59 no campo minutos.</p>':
      `<p><strong>Por unidade:</strong> ${grams(r.g)} · ${time(r.t)}</p><p><strong>Total (${r.q} un.):</strong> ${grams(r.totalG)} · ${time(r.totalT)}</p>`+
      r.parts.map((p,i)=>`<div class="row"><span>${E(d.rows[i].name||'Etapa '+(i+1))} · bico ${E(d.rows[i].nozzle.replace('.',','))} mm</span><span>${grams(p.totalG)} · ${time(p.totalT)}</span></div>`).join(''));
    };
    const rows=()=>{$('pc-rows').innerHTML=d.rows.map((r,i)=>`<fieldset class="pc-stage" data-pc-row="${i}"><legend>Etapa ${i+1}</legend><label>Nome da etapa<input data-field="name" maxlength="100" placeholder="Ex.: Corpo" value="${E(r.name)}"></label><label>Bico<select data-field="nozzle">${['0.2','0.4','0.6','0.8'].map(n=>`<option value="${n}" ${r.nozzle===n?'selected':''}>${n.replace('.',',')} mm</option>`).join('')}</select></label><label>Filamento por unidade (g)<input data-field="grams" inputmode="decimal" value="${E(r.grams)}" placeholder="Ex.: 11,11"></label><div class="pc-time"><label>Horas por unidade<input type="number" min="0" step="1" data-field="hours" value="${E(r.hours)}"></label><label>Minutos por unidade<input type="number" min="0" max="59" step="1" data-field="minutes" value="${E(r.minutes)}"></label></div>${d.rows.length>1?`<button type="button" data-remove="${i}">Remover etapa</button>`:''}</fieldset>`).join('');output();};
    $('pc-rows').oninput=e=>{const k=e.target.dataset.field;if(!k)return;d.rows[Number(e.target.closest('[data-pc-row]').dataset.pcRow)][k]=e.target.value;output();};
    $('pc-rows').onclick=e=>{if(e.target.dataset.remove!==undefined){d.rows.splice(Number(e.target.dataset.remove),1);rows();}};
    $('pc-qty').oninput=e=>{d.qty=e.target.value;output();};
    $('pc-add').onclick=()=>{d.rows.push(blank());rows();$('pc-rows').lastElementChild.querySelector('input').focus();};
    rows();
  };
})();
