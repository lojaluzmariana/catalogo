'use strict';

const SUPABASE_URL='https://xgcsdpqaqxstcfwgwaxw.supabase.co';
const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnY3NkcHFhcXhzdGNmd2d3YXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MDE3MTQsImV4cCI6MjEwMjM3NzcxNH0.WFYm2q4ljkQMRiaQzhJ-yf01wj80xsO0ykmH7jhtUoo';
const supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});

const FIXED=Object.freeze({watts:110,energy:1.2,hotendLife:4000,printer:3000,printerLife:10000,installment:480,monthlyHours:520,failure:5});
function parseNumber(raw){const value=String(raw).trim();if(!/^(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(value))return NaN;return Number(value.replace(',','.'));}
function calculate(v){v={...v,...FIXED};const hours=v.hours+v.minutes/60;const material=v.spool/1000*v.grams*1.1;const energy=v.watts/1000*v.energy*hours;const wear=(v.hotend/v.hotendLife+v.printer/v.printerLife)*hours;const operational=(v.internet+v.installment)/v.monthlyHours*hours;const base=material+energy+wear+operational;const failure=base*v.failure/100;const total=base+failure;const price=total*(1+v.markup/100);return{material,energy,wear,operational,failure,total,price,unitCost:total/v.units,unitPrice:price/v.units};}
function excelText(project,v,r){const decimal=n=>n.toFixed(2).replace('.',',');let name=String(project).replace(/[\t\r\n\u0000-\u001f]+/g,' ').trim()||'Sem nome';if(/^[=+@-]/.test(name))name="'"+name;return[name,String(v.grams).replace('.',','),v.hours,v.minutes,decimal(r.total),decimal(r.price)].join('\t');}

if(typeof document!=='undefined'){
const $=id=>document.getElementById(id);
const formatter=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
const money=n=>Number.isFinite(Number(n))?formatter.format(Number(n)):'—';
const ids=['spool','grams','watts','energy','hours','minutes','units','hotend','hotendLife','printer','printerLife','internet','installment','monthlyHours','failure','markup'];
const editableIds=['spool','grams','hours','minutes','units','hotend','internet','markup'];
const positive=new Set(['spool','grams','units','hotendLife','printerLife','monthlyHours']);
const resultIds=['material','energy','wear','operational','failure','total','price','unitCost','unitPrice'];
let currentRecord=null;
let cloudRows=[];
let editingId=null;
let currentSession=null;

let deferredInstallPrompt=null;
const INSTALL_ONCE_KEY='iluminart_calculadora_integrada_install_offer_v2_separate_app';
function isStandaloneMode(){return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;}
function installPlatform(){const ua=navigator.userAgent||'';const ios=/iPad|iPhone|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);const android=/Android/i.test(ua);return ios?'ios':android?'android':'other';}
function markInstallOfferSeen(){try{localStorage.setItem(INSTALL_ONCE_KEY,'1');}catch(_e){}}
function installOfferWasSeen(){try{return localStorage.getItem(INSTALL_ONCE_KEY)==='1';}catch(_e){return false;}}
function hideInstallOffer(){const modal=$('installOnceModal');if(modal)modal.hidden=true;}
function showInstallOfferOnce(){
  if(isStandaloneMode()||installOfferWasSeen())return;
  const platform=installPlatform();
  if(platform==='other')return;
  const modal=$('installOnceModal');const btn=$('installNowBtn');if(!modal||!btn)return;
  modal.dataset.platform=platform;
  if(platform==='ios')btn.textContent='Entendi';
  else btn.textContent=deferredInstallPrompt?'Instalar agora':'Como instalar';
  modal.hidden=false;markInstallOfferSeen();
}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;const btn=document.getElementById('installNowBtn');if(btn&&document.getElementById('installOnceModal')?.dataset.platform==='android')btn.textContent='Instalar agora';});
window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;hideInstallOffer();});


function projectName(){return $('project').value.trim()||'Sem nome';}
function normalizeStoredInputs(obj={}){const out={};for(const id of ids){const n=Number(obj[id]);out[id]=Number.isFinite(n)?n:(Object.hasOwn(FIXED,id)?FIXED[id]:0);}return out;}
function historyRecord(v,r,project=''){return{project:String(project).trim()||'Sem nome',inputs:{...v},results:{...r}};}

function setSyncBadge(mode,text){const badge=$('syncBadge');badge.dataset.mode=mode;badge.textContent=text;}
function setHistoryStatus(text,isError=false){const el=$('historyStatus');el.textContent=text||'';el.classList.toggle('error',!!isError);}
function setSaveMode(){const btn=$('saveHistory');btn.textContent=editingId?'Atualizar cálculo no histórico':'Salvar no histórico';$('cancelEdit').hidden=!editingId;}

function formatProductionTime(hours,minutes){
  const h=Math.max(0,Math.trunc(Number(hours)||0));
  const m=Math.max(0,Math.trunc(Number(minutes)||0));
  return `${h} h ${String(m).padStart(2,'0')} min`;
}
function renderHistory(rows){cloudRows=Array.isArray(rows)?rows:[];rebuildSources();}

async function loadSession(){
  const epoch=++sessionEpoch;
  try{
    const {data,error}=await supabaseClient.auth.getSession();if(epoch!==sessionEpoch)return;if(error)throw error;
    const next=data.session||null;const user=next?.user?.id||null;currentSession=next;
    if(user!==loadedUser){loadedUser=user;materialsRows=[];materialsError='Atualize os preços para carregar os materiais essenciais do painel.';catalogRows=[];cloudRows=[];savedQuotes=[];catalogError='';quotesError='';editingId=null;setSaveMode();restoreDraft();rebuildSources();renderSavedQuotes();}
    if(currentSession){$('cloudLogin').hidden=true;setSyncBadge('online','Conectado');$('syncUser').textContent=currentSession.user.email||'Acesso do painel';await Promise.all([loadHistory(epoch),loadCatalogAndQuotes(epoch)]);}
    else{setSyncBadge('offline','Entre para sincronizar');$('syncUser').textContent='Catálogo, histórico e orçamentos com o acesso do painel.';$('cloudLogin').hidden=false;renderHistory([]);}
  }catch(e){if(epoch!==sessionEpoch)return;currentSession=null;catalogRows=[];cloudRows=[];savedQuotes=[];rebuildSources();renderSavedQuotes();setSyncBadge('error','Sem conexão');$('cloudLogin').hidden=false;$('loginStatus').textContent='Não foi possível conectar. A calculadora continua disponível.';}
}
async function loadHistory(epoch=sessionEpoch){
  if(!currentSession){renderHistory([]);return;}setHistoryStatus('Carregando cálculos salvos…');
  try{const {data,error}=await supabaseClient.from('calculadora_3d_historico').select('id,project,inputs,results,production_hours,production_minutes,production_total_minutes,created_at,updated_at').order('updated_at',{ascending:false});if(epoch!==sessionEpoch)return;if(error)throw error;renderHistory(data||[]);setHistoryStatus('');}
  catch(e){if(epoch!==sessionEpoch)return;renderHistory([]);setHistoryStatus('Não foi possível carregar os cálculos salvos. Tente atualizar os preços.',true);}
}

let historySaving=false;
async function saveCloudRecord(){
  if(!currentRecord||historySaving)return;
  if(!currentSession){$('saveStatus').textContent='Entre com o acesso do painel para salvar o histórico.';$('cloudLogin').hidden=false;return;}
  const epoch=sessionEpoch,id=editingId,record=structuredClone(currentRecord);
  const payload={project:record.project,inputs:record.inputs,results:record.results,production_hours:Math.trunc(record.inputs.hours),production_minutes:Math.trunc(record.inputs.minutes),production_total_minutes:Math.trunc(record.inputs.hours)*60+Math.trunc(record.inputs.minutes),updated_at:new Date().toISOString()};
  historySaving=true;$('saveHistory').disabled=true;$('saveStatus').textContent=id?'Atualizando…':'Salvando…';
  try{const query=id?supabaseClient.from('calculadora_3d_historico').update(payload).eq('id',id):supabaseClient.from('calculadora_3d_historico').insert(payload);const {error}=await query.select('id').single();if(error)throw error;if(epoch!==sessionEpoch)return;editingId=null;setSaveMode();await loadHistory(epoch);$('saveStatus').textContent=id?'Cálculo atualizado.':'Cálculo salvo. Já está disponível na consulta de preços.';}
  catch(e){$('saveStatus').textContent='Não foi possível salvar: '+(e.message||'Confira sua conexão.');}
  finally{historySaving=false;$('saveHistory').disabled=!currentRecord;}
}

function startEdit(row){
  if(!row)return;editingId=row.id;$('project').value=row.project||'';const inputs=normalizeStoredInputs(row.inputs||{});
  for(const id of editableIds){if(!$(id)||!Number.isFinite(inputs[id]))continue;$(id).value=String(inputs[id]).replace('.',',');}
  switchTab('calculo');update();setSaveMode();$('saveStatus').textContent='Editando registro. Faça as alterações e clique em “Atualizar cálculo no histórico”.';window.scrollTo({top:0,behavior:'smooth'});$('project').focus();
}
function cancelEdit(){editingId=null;setSaveMode();$('saveStatus').textContent='Edição cancelada. O histórico não foi alterado.';}
async function deleteRow(row){
  if(!row||!currentSession)return;
  if(!window.confirm(`Excluir “${row.project||'Sem nome'}” do histórico integrado?`))return;
  setHistoryStatus('Excluindo...');const {error}=await supabaseClient.from('calculadora_3d_historico').delete().eq('id',row.id);
  if(error){setHistoryStatus('Não foi possível excluir: '+error.message,true);return;}
  if(editingId===row.id){editingId=null;setSaveMode();}
  await loadHistory();setHistoryStatus('Registro excluído.');
}

function update(){
  const values={};const problems=[];
  for(const id of ids){const input=$(id);if(Object.hasOwn(FIXED,id))input.value=FIXED[id].toLocaleString('pt-BR',{useGrouping:false,minimumFractionDigits:['energy','printer','installment'].includes(id)?2:0});const n=parseNumber(input.value);values[id]=n;let message='';if(input.value.trim()==='')message='Preencha '+input.dataset.label.toLowerCase()+'.';else if(!Number.isFinite(n)||n<0)message=input.dataset.label+': use um número válido, sem valor negativo.';else if(positive.has(id)&&n<=0)message=input.dataset.label+': informe um valor maior que zero.';else if(['hours','minutes','units'].includes(id)&&!Number.isInteger(n))message=input.dataset.label+': use um número inteiro.';else if(id==='minutes'&&n>59)message='Minutos de impressão: use um valor de 0 a 59.';else if(id==='failure'&&n>100)message='Taxa de falhas: use um valor entre 0 e 100%.';else if(id==='markup'&&n<60)message='O lucro sobre o custo deve ser de pelo menos 60%.';else if(id==='monthlyHours'&&n>744)message='Horas produtivas: o máximo é 744 h por mês para uma impressora.';input.setAttribute('aria-invalid',message&&input.value.trim()!==''?'true':'false');if(message)problems.push(message);}
  if(values.hours===0&&values.minutes===0)problems.push('Informe um tempo de impressão maior que zero.');
  $('projectTitle').textContent=$('project').value.trim()||'Seu projeto';$('monthlyTotal').textContent=money(values.internet+values.installment);$('timeMeta').textContent=Number.isInteger(values.hours)&&Number.isInteger(values.minutes)?`${values.hours} h ${String(values.minutes).padStart(2,'0')} min`:'Tempo a preencher';$('unitsMeta').textContent=Number.isInteger(values.units)&&values.units>0?`${values.units} ${values.units===1?'peça':'peças'}`:'Unidades a preencher';$('profitResult').textContent=Number.isFinite(values.markup)&&values.markup>=60?`Lucro sobre o custo: ${values.markup.toLocaleString('pt-BR')}%`:'Informe um lucro de pelo menos 60%';
  const r=problems.length?null:calculate(values);if(r&&Object.values(r).some(v=>!Number.isFinite(v)))problems.push('Os valores informados são muito grandes. Revise os dados.');
  for(const id of resultIds)$(id+'Result').textContent=!problems.length?money(r[id]):'—';
  $('exportExcel').disabled=!!problems.length;$('copyExcel').disabled=!!problems.length;$('excelText').value=problems.length?'':excelText($('project').value,values,r);$('copyStatus').textContent='';
  currentRecord=problems.length?null:historyRecord(values,r,$('project').value);$('saveHistory').disabled=!currentRecord;$('saveStatus').textContent=editingId?$('saveStatus').textContent:'';
  $('approveCalculation').disabled=!currentRecord;$('addCurrentQuote').disabled=!currentRecord;$('unitProfitResult').textContent=currentRecord?money(r.unitPrice-r.unitCost):'—';
  const status=$('status');status.classList.toggle('complete',!problems.length);status.textContent=problems.length?problems.slice(0,3).join(' ')+(problems.length>3?` Faltam mais ${problems.length-3} ajustes.`:''):'Cálculo atualizado. O preço inclui todos os custos acima e o lucro definido.';
}

const CARD_FEE=0.05,MIN_PROFIT_ON_COST_RATE=0.60;
const CARD_RATE_STORAGE_KEY='luz-mariana-card-rates-ton-v1';
const DEFAULT_CARD_RATE_SETTINGS={customerSurchargeUpTo3:0.05,credit:{1:0.0314,2:0.0538,3:0.0611},debit:0.0136};
function loadCardRateSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(CARD_RATE_STORAGE_KEY) || "null");
    return saved && typeof saved === "object" ? { ...DEFAULT_CARD_RATE_SETTINGS, ...saved, credit:{...DEFAULT_CARD_RATE_SETTINGS.credit,...(saved.credit||{})} } : structuredClone(DEFAULT_CARD_RATE_SETTINGS);
  } catch (_err) { return structuredClone(DEFAULT_CARD_RATE_SETTINGS); }
}
function cardRateFor(paymentMethod, installments = 1, { legacyCreditFallback = false } = {}) {
  const cfg = loadCardRateSettings();
  if (paymentMethod === "debito") return Number(cfg.debit || 0);
  if (paymentMethod !== "credito") return 0;
  const n = Math.max(1, Math.min(12, Math.trunc(Number(installments) || 1)));
  if (legacyCreditFallback && !installments) return CARD_FEE;
  return Number(cfg.credit?.[n] ?? cfg.credit?.[String(n)] ?? CARD_FEE);
}
function customerCardPriceFromPix(pixPrice, installments = 1) {
  const base = Math.max(0, Number(pixPrice || 0));
  const n = Math.max(1, Math.min(12, Math.trunc(Number(installments) || 1)));
  const cfg = loadCardRateSettings();
  if (n <= 3) return round2(base * (1 + Number(cfg.customerSurchargeUpTo3 || 0.05)));
  const rate = cardRateFor("credito", n);
  return rate >= 1 ? base : round2(base / (1 - rate));
}
function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
function niceCeil(raw) {
  const base = Math.floor(raw);
  const candidates = [base + 0.0, base + 0.5, base + 0.9, base + 1.0];
  let best = null;
  for (const c of candidates) if (c >= raw - 1e-9 && (best === null || c < best)) best = c;
  return round2(best);
}
function minimumPromoPriceForCost(cost) {
  const c = Math.max(0, Number(cost || 0));
  if (c <= 0) return 0;
  const targetNet = c * (1 + MIN_PROFIT_ON_COST_RATE);

  // O painel usa 3x como referência do "crédito até 3x". Como a loja
  // cobra o acréscimo configurado do cliente e depois paga a taxa real da
  // maquininha, calculamos o preço à vista mínimo necessário para que o
  // LÍQUIDO do crédito em 3x também preserve pelo menos 60% sobre o custo.
  const cfg = loadCardRateSettings();
  const surchargeFactor = 1 + Number(cfg.customerSurchargeUpTo3 || 0.05);
  const rate3x = cardRateFor("credito", 3);
  const creditNetFactor = surchargeFactor * (1 - rate3x);
  const requiredForCredit = creditNetFactor > 0 ? targetNet / creditNetFactor : targetNet;
  return niceCeil(Math.max(targetNet, requiredForCredit));
}
function profitOnCostRate(cost, profit) {
  const c = Number(cost || 0);
  return c > 0 ? Number(profit || 0) / c : 0;
}
function calculatePricing(cost) {
  const c = Math.max(0, Number(cost || 0));
  const promoPrice = minimumPromoPriceForCost(c);
  const promoProfit = round2(promoPrice - c);
  const promoMargin = promoPrice > 0 ? round2(promoProfit / promoPrice) : 0;

  // Preço padrão exibido no catálogo/painel = crédito em até 3x.
  // A base à vista acima já foi elevada, quando necessário, para que o
  // líquido do crédito de referência não caia abaixo dos 60% sobre custo.
  const creditPrice = customerCardPriceFromPix(promoPrice, 3);
  const creditRate = cardRateFor("credito", 3);
  const creditNet = round2(creditPrice * (1 - creditRate));
  const creditProfit = round2(creditNet - c);
  const creditMarkup = c > 0 ? round2(creditNet / c) : 0;
  const creditMargin = creditNet > 0 ? round2(creditProfit / creditNet) : 0;

  return {
    cost:c, creditPrice, creditNet, creditProfit, creditMarkup, creditMargin,
    promoPrice, promoProfit, promoMargin,
    minimumPromoPrice: minimumPromoPriceForCost(c),
    belowMinimum: false,
  };
}
function calculatePricingFromManualPromo(cost, manualPromo) {
  const c = Math.max(0, Number(cost || 0));
  const promoPrice = round2(manualPromo);
  const promoProfit = round2(promoPrice - c);
  const promoMargin = promoPrice > 0 ? round2(promoProfit / promoPrice) : 0;
  const creditPrice = customerCardPriceFromPix(promoPrice, 3);
  const creditRate = cardRateFor("credito", 3);
  const creditNet = round2(creditPrice * (1 - creditRate));
  const creditProfit = round2(creditNet - c);
  const creditMarkup = c > 0 ? round2(creditNet / c) : 0;
  const creditMargin = creditNet > 0 ? round2(creditProfit / creditNet) : 0;
  const minimumPromoPrice = minimumPromoPriceForCost(c);
  return {
    cost:c, creditPrice, creditNet, creditProfit, creditMarkup, creditMargin,
    promoPrice, promoProfit, promoMargin,
    minimumPromoPrice,
    belowMinimum: c > 0 && (promoPrice + 1e-9 < minimumPromoPrice || profitOnCostRate(c, creditProfit) + 1e-9 < MIN_PROFIT_ON_COST_RATE),
  };
}
function variantHasOwnPricing(variant) {
  if (!variant) return false;
  const hasPositive = (value) => value != null && value !== "" && Number.isFinite(Number(value)) && Number(value) > 0;
  // Linhas antigas de product_variants às vezes ficaram com cost = 0.
  // Isso NÃO significa "preço próprio zerado": devem herdar o produto.
  return hasPositive(variant.promo_manual_price)
    || hasPositive(variant.promo_price)
    || hasPositive(variant.credit_price)
    || hasPositive(variant.cost);
}
function effectivePricing(product, variant) {
  // A variação só substitui o preço do produto quando realmente possui
  // custo/preço próprio. Isso evita o bug de variantes legadas com cost=0
  // virarem R$ 0,00 na Venda Assistida.
  if (variantHasOwnPricing(variant)) {
    const vCost = Number(variant.cost || 0) > 0 ? Number(variant.cost) : Number(product?.cost ?? 0);
    const vPix = variant.promo_manual_price != null && Number(variant.promo_manual_price) > 0
      ? Number(variant.promo_manual_price)
      : variant.promo_price != null && Number(variant.promo_price) > 0
        ? Number(variant.promo_price)
        : null;
    if (vPix != null) return calculatePricingFromManualPromo(vCost, vPix);
    if (Number(variant.credit_price || 0) > 0) {
      // Compatibilidade com registros antigos que têm somente preço de crédito.
      const inferredPix = round2(Number(variant.credit_price) / 1.05);
      return calculatePricingFromManualPromo(vCost, inferredPix);
    }
    return calculatePricing(vCost);
  }

  const cost = Number(product?.cost ?? 0);
  const pix = product?.promo_manual_price != null && Number(product.promo_manual_price) > 0
    ? Number(product.promo_manual_price)
    : product?.promo_price != null && Number(product.promo_price) > 0
      ? Number(product.promo_price)
      : null;
  if (pix != null) return calculatePricingFromManualPromo(cost, pix);

  // Última compatibilidade: produto antigo com apenas credit_price salvo.
  if (Number(product?.credit_price || 0) > 0) {
    return calculatePricingFromManualPromo(cost, round2(Number(product.credit_price) / 1.05));
  }
  return calculatePricing(cost);
}

// Navegação e orçamento compartilham os mesmos dados do painel.
let appTab='consulta',consultSource='all',quoteSource='catalogo';
let catalogRows=[],savedQuotes=[],sourceItems=[],sessionEpoch=0,loadedUser=null;
let quoteItems=[],quoteId=null,quoteNumber=null,quoteSaving=false,quoteDirty=false;
let quoteMessage='',toastTimer=null,catalogError='',historyLoadError='',quotesError='';
let materialsRows=[],materialsError='Atualize os preços para carregar os materiais essenciais do painel.',quoteFinanceRule=null;
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const validPrice=n=>n!==null&&n!==''&&Number.isFinite(Number(n))&&Number(n)>0;
const dayISO=()=>new Date().toLocaleDateString('en-CA',{timeZone:'America/Fortaleza'});
const dateBR=s=>s&&/^\d{4}-\d{2}-\d{2}$/.test(s)?s.split('-').reverse().join('/'):'a combinar';
function datePlus(iso,days,business=false){if(!/^\d{4}-\d{2}-\d{2}$/.test(iso))return '';const [y,m,d]=iso.split('-').map(Number),v=new Date(y,m-1,d,12);let left=days;while(left>0){v.setDate(v.getDate()+1);if(!business||![0,6].includes(v.getDay()))left--;}return [v.getFullYear(),String(v.getMonth()+1).padStart(2,'0'),String(v.getDate()).padStart(2,'0')].join('-');}
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,3500);}
function switchTab(tab,focus=false){if(!['consulta','calculo','orcamento'].includes(tab))return;appTab=tab;document.querySelectorAll('[data-tab]').forEach(b=>{const active=b.dataset.tab===tab;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});for(const name of ['consulta','calculo','orcamento'])$('panel-'+name).hidden=name!==tab;if(tab==='orcamento'){renderPicker();renderQuoteItems();updateQuoteSummary();}if(focus)$('tab-'+tab).focus();}
function productPriceItem(p,v=null){
  const pricing=effectivePricing(p,v),rawCost=Number(v?.cost)>0?v.cost:p.cost,cost=rawCost==null||rawCost===''?NaN:Number(rawCost),name=p.name+(v?.name?' · '+v.name:'');
  return{key:'catalogo:'+p.id+':'+(v?.id||''),origin:'catalogo',name,unitPix:round2(pricing.promoPrice),unitCredit:round2(pricing.creditPrice),cost:Number.isFinite(cost)&&cost>=0?cost:null,productId:p.id,variantId:v?.id||null,photo:v?.photo_url||p.photo_url||'',detail:p.category||'Produto do catálogo',lead:Number(p.lead_time_days)||2};
}
function historyPriceItem(row){const inputs=normalizeStoredInputs(row.inputs||{}),r=row.results||{};const unit=validPrice(r.unitPrice)?Number(r.unitPrice):validPrice(r.price)&&inputs.units>0?Number(r.price)/inputs.units:null;const cost=r.unitCost!=null&&Number.isFinite(Number(r.unitCost))?Number(r.unitCost):r.total!=null&&inputs.units>0?Number(r.total)/inputs.units:null;return{key:'historico:'+row.id,origin:'historico',historyId:row.id,name:row.project||'Sem nome',unitPix:unit==null?null:round2(unit),unitCredit:unit==null?null:customerCardPriceFromPix(round2(unit),3),cost,detail:formatProductionTime(row.production_hours??inputs.hours,row.production_minutes??inputs.minutes)+' · '+inputs.units+' peça(s) por placa',row};}
function rebuildSources(){sourceItems=[];for(const p of catalogRows){const vs=Array.isArray(p.product_variants)?[...p.product_variants].sort((a,b)=>(a.sort_order??999)-(b.sort_order??999)):[];if(vs.length)sourceItems.push(...vs.map(v=>productPriceItem(p,v)));else sourceItems.push(productPriceItem(p));}sourceItems.push(...cloudRows.map(historyPriceItem));renderConsult();renderPicker();}
function itemCard(item,context='consult'){
 const history=item.origin==='historico';const canAdd=validPrice(item.unitPix);
 const photo=/^https?:\/\//i.test(item.photo||'')?`<img class="product-thumb" src="${esc(item.photo)}" alt="" loading="lazy" referrerpolicy="no-referrer">`:'';
 return `<article class="price-card"><div class="source-label">${history?'Cálculo salvo':'Catálogo'}</div><div class="price-card-top"><div><h3>${esc(item.name)}</h3><small>${esc(item.detail)}</small></div>${photo}</div><div class="main-price"><small>${history?'Sugestão por peça':'Preço por unidade'} · à vista</small><strong>${validPrice(item.unitPix)?esc(money(item.unitPix)):'Sem preço'}</strong></div><div class="price-facts"><div><span>Crédito até 3x</span><strong>${validPrice(item.unitCredit)?esc(money(item.unitCredit)):'—'}</strong></div><div><span>Custo por peça</span><strong>${item.cost!=null?esc(money(item.cost)):'Não cadastrado'}</strong></div></div><div class="card-actions"><button class="primary" type="button" data-add-item="${esc(item.key)}" ${canAdd?'':'disabled'}>${context==='picker'?'+ Adicionar':'+ Orçamento'}</button></div>${history&&context==='consult'?`<div class="history-tools"><button type="button" data-edit-id="${esc(item.historyId)}">Recalcular</button><button type="button" class="danger" data-delete-id="${esc(item.historyId)}">Excluir cálculo</button></div>`:''}${history?`<details class="card-details"><summary>Dados do cálculo</summary><p>${esc(Number(item.row.inputs?.grams)||0)} g na placa · Lucro: ${esc(Number(item.row.inputs?.markup)||0)}%<br>Custo da placa: ${esc(money(item.row.results?.total))}<br>Venda da placa: ${esc(money(item.row.results?.price))}</p></details>`:''}</article>`;
}
function filteredItems(source,query){const q=normalize(query);return sourceItems.filter(i=>(source==='all'||i.origin===source)&&(!q||normalize(i.name+' '+i.detail).includes(q)));}
function renderConsult(){const list=filteredItems(consultSource,$('consultSearch').value);$('historyCount').textContent=String(cloudRows.length);$('resultCount').textContent=list.length+' '+(list.length===1?'item encontrado':'itens encontrados');$('sourceStatus').textContent=catalogError;$('sourceStatus').classList.toggle('error',!!catalogError);$('historyBody').innerHTML=list.map(i=>itemCard(i)).join('')||`<div class="empty-state"><h3>${currentSession?'Nenhuma peça encontrada':'Entre para ver seus preços'}</h3><p>${currentSession?sourceItems.length?'Tente outro nome ou mude a origem da busca.':'Cadastre produtos no painel ou salve seu primeiro cálculo.':'Seu catálogo e seus cálculos salvos aparecem aqui após entrar com o acesso do painel.'}</p><button type="button" data-go-calc>Calcular uma nova peça</button></div>`;}
function renderPicker(){const list=filteredItems(quoteSource,$('quoteSearch').value);$('quotePicker').innerHTML=list.map(i=>itemCard(i,'picker')).join('')||`<div class="empty-state"><h3>${currentSession?'Nenhum item encontrado':'Entre para carregar seus itens'}</h3><p>${quoteSource==='historico'?'Os projetos salvos na calculadora aparecem aqui.':'Os produtos ativos do catálogo aparecem aqui.'}</p></div>`;}
function readQuoteNumber(value){const n=parseNumber(value);return Number.isFinite(n)?n:NaN;}
function draftKey(){return 'lm-calculadora-orcamento-v2:'+(currentSession?.user?.id||'local');}
function quoteFields(){return {name:$('quoteName').value.trim(),phone:$('quotePhone').value.trim(),date:$('quoteDate').value,validity:$('quoteValidity').value,lead:$('quoteLead').value,payment:$('quotePayment').value,brand:$('quoteBrand').value,discountType:$('quoteDiscountType').value,discountValue:$('quoteDiscountValue').value};}
function persistQuote(){try{localStorage.setItem(draftKey(),JSON.stringify({fields:quoteFields(),items:quoteItems,id:quoteId,number:quoteNumber,dirty:quoteDirty,financeRule:quoteFinanceRule}));$('draftStatus').textContent='Rascunho guardado neste aparelho. Salve o orçamento para acessar também pelo painel.';}catch{ $('draftStatus').textContent='Não foi possível guardar o rascunho neste aparelho. Salve o orçamento antes de sair.';}}
function resetQuote(){quoteFinanceRule=null;quoteItems=[];quoteId=null;quoteNumber=null;quoteDirty=false;$('quoteName').value='';$('quotePhone').value='';$('quoteDate').value=dayISO();$('quoteValidity').value=datePlus(dayISO(),2);$('quoteLead').value='2';$('quotePayment').value='pix';$('quoteBrand').value='luzmariana';$('quoteDiscountType').value='percent';$('quoteDiscountValue').value='0';$('quoteStatus').textContent='';renderQuoteItems();updateQuoteSummary(false);}
function restoreDraft(){resetQuote();try{const d=JSON.parse(localStorage.getItem(draftKey())||'null');if(!d||!Array.isArray(d.items)||!d.fields)return;const fields={name:'quoteName',phone:'quotePhone',date:'quoteDate',validity:'quoteValidity',lead:'quoteLead',payment:'quotePayment',brand:'quoteBrand',discountType:'quoteDiscountType',discountValue:'quoteDiscountValue'};for(const [key,id]of Object.entries(fields))if(d.fields[key]!=null)$(id).value=String(d.fields[key]);quoteItems=d.items.filter(i=>i&&typeof i.name==='string'&&Number.isFinite(Number(i.unitPix))&&Number.isFinite(Number(i.unitCredit))).map(i=>({...i,quantity:String(i.quantity??1)}));quoteFinanceRule=validFinanceRule(d.financeRule)?d.financeRule:null;quoteId=d.id||null;quoteNumber=d.number||null;quoteDirty=!!d.dirty;renderQuoteItems();updateQuoteSummary(false);}catch{}}
function addQuoteItem(item,switchToQuote=true){if(quoteSaving){toast('Aguarde o orçamento terminar de salvar.');return;}if(!item||!validPrice(item.unitPix))return;const existing=quoteItems.find(i=>i.key===item.key);if(existing){existing.quantity=String((Number(existing.quantity)||0)+1);}else{quoteItems.push({key:item.key,name:item.name,origin:item.origin,productId:item.productId||null,variantId:item.variantId||null,historyId:item.historyId||null,unitPix:round2(item.unitPix),unitCredit:round2(item.unitCredit),cost:item.cost??null,quantity:'1'});}quoteDirty=true;renderQuoteItems();updateQuoteSummary();toast('Peça adicionada ao orçamento');if(switchToQuote)switchTab('orcamento');}
function renderQuoteItems(){const payment=$('quotePayment').value;$('quoteItemsCount').textContent=quoteItems.length?'· '+quoteItems.length:'';$('quoteCount').textContent=String(quoteItems.length);$('quoteItems').innerHTML=quoteItems.map((i,index)=>`<article class="quote-item"><div class="quote-item-head"><div><h3>${esc(i.name)}</h3><small>${i.origin==='catalogo'?'Catálogo':i.historyId?'Cálculo salvo':'Cálculo atual'}</small></div><button type="button" class="danger" data-remove-quote="${index}" aria-label="Remover ${esc(i.name)}">Remover</button></div><div class="quote-item-fields"><label>Quantidade<input data-quote-quantity="${index}" type="number" min="1" step="1" value="${esc(i.quantity)}" inputmode="numeric"></label><label>Preço por peça <span>(R$)</span><input data-quote-price="${index}" inputmode="decimal" value="${esc(Number(payment==='credito'?i.unitCredit:i.unitPix).toFixed(2).replace('.',','))}" aria-label="Preço por peça de ${esc(i.name)}"></label><label class="quote-unit-cost">Custo por peça <span>(interno, R$)</span><input data-quote-cost="${index}" inputmode="decimal" value="${i.cost!=null&&Number.isFinite(Number(i.cost))?esc(Number(i.cost).toFixed(2).replace('.',',')):''}" placeholder="Informe o custo" aria-label="Custo por peça de ${esc(i.name)}"></label><strong id="quote-line-${index}" class="quote-item-total"></strong></div><p id="quote-warning-${index}" class="quote-item-warning" hidden></p></article>`).join('')||'<p class="hint">Seu orçamento está vazio. Adicione uma peça na lista acima.</p>';updateQuoteLineTotals();}
function quoteTotals(){
  let pixCents=0,creditCents=0;
  for(const i of quoteItems){const q=Number(i.quantity);if(!Number.isSafeInteger(q)||q<1||q>100000||!validPrice(i.unitPix)||!validPrice(i.unitCredit))return null;pixCents+=Math.round(i.unitPix*100)*q;creditCents+=Math.round(i.unitCredit*100)*q;}
  if(!Number.isSafeInteger(pixCents)||!Number.isSafeInteger(creditCents))return null;
  const f=quoteFields(),raw=String(f.discountValue).trim(),value=raw===''?0:readQuoteNumber(raw),credit=f.payment==='credito',selected=credit?creditCents:pixCents;
  if(!['percent','fixed'].includes(f.discountType)||!Number.isFinite(value)||value<0||(f.discountType==='percent'&&value>100))return null;
  const discountFor=cents=>f.discountType==='percent'?Math.round(cents*value/100):Math.round(value*100);
  if(discountFor(selected)>selected)return null;
  const pixDiscount=Math.min(pixCents,discountFor(pixCents)),creditDiscount=Math.min(creditCents,discountFor(creditCents));
  return {subtotalPix:pixCents/100,subtotalCredit:creditCents/100,subtotal:selected/100,discount:(credit?creditDiscount:pixDiscount)/100,pix:(pixCents-pixDiscount)/100,credit:(creditCents-creditDiscount)/100,total:(selected-(credit?creditDiscount:pixDiscount))/100};
}
function validFinanceRule(r){return r&&Number.isFinite(r.ownerPercent)&&r.ownerPercent>=0&&r.ownerPercent<=100&&Number.isFinite(r.cardRate)&&r.cardRate>=0&&r.cardRate<=1&&Number.isFinite(r.essentialsCost)&&r.essentialsCost>=0&&/^\d{4}-\d{2}$/.test(r.month);}
function loadProfitSplitSettings() {
  const defaults = { ownerPercent: 70 };
  // A nova divisão foi escolhida pela loja: atualiza a configuração antiga
  // uma única vez, compartilhando a marca de migração com a calculadora.
  const migrationKey = 'luz-mariana-profit-split-70-30-v2';
  try {
    if (localStorage.getItem(migrationKey) !== '1') {
      localStorage.setItem('luz-mariana-profit-split-settings-v1', JSON.stringify(defaults));
      localStorage.setItem(migrationKey, '1');
      return defaults;
    }
    const saved = JSON.parse(localStorage.getItem('luz-mariana-profit-split-settings-v1') || 'null');
    const value = Number(saved?.ownerPercent ?? defaults.ownerPercent);
    return { ownerPercent: Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : defaults.ownerPercent };
  } catch (_err) {
    return defaults;
  }
}

function currentFinanceRule(){
  const month=($('quoteDate').value||dayISO()).slice(0,7);
  const ownerPercent=month==='2026-09'?0:loadProfitSplitSettings().ownerPercent;
  // Os custos/taxas salvos continuam preservados; a renda segue a divisão atual.
  if(validFinanceRule(quoteFinanceRule)&&quoteFinanceRule.month===month)return {...quoteFinanceRule,ownerPercent};
  if(materialsError)return null;
  const essentials=materialsRows.filter(m=>m.active&&['essencial','essenciais'].includes(String(m.type||'').trim().toLowerCase())&&Number(m.qty_per_order)>0);
  if(essentials.some(m=>m.unit_cost==null||!Number.isFinite(Number(m.unit_cost))||Number(m.unit_cost)<0))return null;
  const essentialsCost=round2(essentials.reduce((sum,m)=>sum+Number(m.unit_cost)*Number(m.qty_per_order),0));
  const rate=cardRateFor('credito',3);if(!Number.isFinite(rate)||rate<0||rate>1)return null;
  return {ownerPercent,cardRate:rate,essentialsCost,month};
}
function quoteFinance(t=quoteTotals()){
  const rule=currentFinanceRule();
  if(!t||!quoteItems.length||!rule||quoteItems.some(i=>i.cost==null||i.cost===''||!Number.isFinite(Number(i.cost))||Number(i.cost)<0))return null;
  const cost=round2(quoteItems.reduce((sum,i)=>sum+Number(i.cost)*Number(i.quantity),0)+rule.essentialsCost),fee=round2(t.total*($('quotePayment').value==='credito'?rule.cardRate:0)),net=round2(t.total-fee),profit=round2(net-cost),positive=Math.max(0,profit);
  const ownerShare=round2(positive*rule.ownerPercent/100),reinvestment=round2(positive-ownerShare);
  return {cost,fee,profit,storeKeep:round2(cost+reinvestment),ownerShare,reinvestment,rule};
}
function updateQuoteFinance(t){
  const finance=quoteFinance(t),rule=currentFinanceRule();
  for(const [id,key] of [['quoteKeep','storeKeep'],['quoteSalary','ownerShare']])$(id).textContent=finance?money(finance[key]):'—';
  $('quoteOwnerPercent').textContent=rule?'('+rule.ownerPercent.toLocaleString('pt-BR')+'%)':'';
  const text=!quoteItems.length?'Adicione os itens para estimar a reserva.':!t?'Confira os itens e o desconto.':!finance?materialsError||'Informe o custo de todas as peças para calcular a reserva com segurança.':finance.profit<0?'O valor após desconto não cobre os custos e taxas. Não há lucro para retirada.':rule.month==='2026-09'?'Setembro/2026: toda a sobra fica incluída no valor de guardar, conforme a regra histórica do painel.':`Sua retirada corresponde a ${rule.ownerPercent}% do lucro após os custos e taxas. O restante já está incluído em Guardar na loja.${finance.fee>0?' A taxa do cartão de '+money(finance.fee)+' já foi descontada.':''}`;
  $('quoteFinanceStatus').textContent=text;$('quoteFinanceStatus').classList.toggle('error',!!quoteItems.length&&(!finance||finance.profit<0));
}
function updateQuoteLineTotals(){const credit=$('quotePayment').value==='credito';quoteItems.forEach((i,index)=>{const q=Number(i.quantity),price=credit?i.unitCredit:i.unitPix,ok=Number.isSafeInteger(q)&&q>0&&q<=100000&&validPrice(price);const total=$('quote-line-'+index);if(total)total.textContent=ok?money(Math.round(price*100)*q/100):'Confira os valores';const warn=$('quote-warning-'+index);if(warn){const low=ok&&i.cost!=null&&Number(price)<Number(i.cost);warn.hidden=!low;warn.textContent=low?'Atenção: este preço está abaixo do custo cadastrado.':'';}});}
function buildQuoteText(){const f=quoteFields(),t=quoteTotals();const credit=f.payment==='credito',brand=f.brand==='iluminart'?'ILUMINART':'LUZ MARIANA';const title=quoteNumber?`ORÇAMENTO Nº ${String(quoteNumber).padStart(3,'0')}`:'ORÇAMENTO · PRÉVIA';return `*${brand} — ${title}*\n\nCliente: ${f.name||'A informar'}${f.phone?'\nTelefone: '+f.phone:''}\nData: ${dateBR(f.date)}\nValidade: ${dateBR(f.validity)}\n\n${quoteItems.map(i=>{const unit=credit?i.unitCredit:i.unitPix,q=Number(i.quantity);return `• ${i.name}\n  ${i.quantity} un. × ${money(unit)} = ${Number.isSafeInteger(q)&&q>0&&validPrice(unit)?money(Math.round(unit*100)*q/100):'Confira os valores'}`;}).join('\n\n')||'Adicione os itens ao orçamento.'}\n\n${t&&t.discount>0?`Subtotal: ${money(t.subtotal)}\nDesconto${f.discountType==='percent'?' ('+readQuoteNumber(f.discountValue)+'%)':''}: −${money(t.discount)}\n`:''}*Total: ${t?money(t.total):'Confira os valores'}*\nPagamento: ${credit?'Cartão de crédito em até 3x':'Pix / dinheiro'}\nPrazo: ${f.lead||'0'} dia(s) útil(eis) após confirmação do pedido.\nEntrega / frete: a combinar.\n\n${f.brand==='iluminart'?'Iluminart — Onde a criatividade ganha forma.':'Luz Mariana — Artigos Religiosos e Devoção'}`;}
function updateQuoteSummary(persist=true){const t=quoteTotals();$('quoteDiscountLabel').textContent=$('quoteDiscountType').value==='fixed'?'Desconto (R$)':'Desconto (%)';$('quoteSubtotal').textContent=t?money(t.subtotal):'—';$('quoteDiscountAmount').textContent=t?'− '+money(t.discount):'—';$('quoteDiscountError').textContent=t?'':'Confira quantidades, preços e desconto. Use de 0 a 100% ou um valor em reais que não ultrapasse o subtotal.';updateQuoteFinance(t);$('quoteTotal').textContent=t?money(t.total):'Confira os itens';$('quotePaymentLabel').textContent=$('quotePayment').value==='credito'?'Cartão de crédito em até 3x':'Pix / dinheiro';$('quoteNumber').textContent=quoteNumber?`Orçamento Nº ${String(quoteNumber).padStart(3,'0')}${quoteDirty?' · alterações não salvas':' · salvo'}`:'Rascunho · ainda não salvo';quoteMessage=buildQuoteText();$('quotePreview').textContent=quoteMessage;updateQuoteLineTotals();const disabled=!t||!quoteItems.length||quoteSaving;for(const id of ['copyQuote','printQuote','saveQuote','approveQuote'])$(id).disabled=disabled;$('saveQuote').textContent=quoteSaving?'Salvando…':quoteId?'Salvar alterações':'Salvar orçamento';if(persist)persistQuote();}
function validateQuote(){const f=quoteFields(),t=quoteTotals();if(!currentSession)throw Error('Entre com o acesso do painel para salvar o orçamento.');if(!f.name)throw Error('Informe o nome do cliente.');if(!quoteItems.length||!t)throw Error('Adicione itens e confira quantidades, preços e desconto.');if(!f.date||!f.validity||f.validity<f.date)throw Error('Confira a data e a validade do orçamento.');if(!Number.isInteger(Number(f.lead))||Number(f.lead)<0||Number(f.lead)>365)throw Error('O prazo deve ter de 0 a 365 dias úteis.');return {f,t};}
function quotePayload(f,t){const finance=quoteFinance(t),rule=currentFinanceRule();return{cliente_nome:f.name,telefone:f.phone||null,data_orcamento:f.date,validade_orcamento:f.validity,prazo_dias:Number(f.lead),previsao_entrega:null,pagamento:f.payment,itens:quoteItems.map(i=>{const q=Number(i.quantity),p=round2(i.unitPix),c=round2(i.unitCredit);return{pedido:i.name,quantidade:q,unitario:p,unitarioPix:p,unitarioCredito:c,totalPix:round2(p*q),totalCredito:round2(c*q),total:round2((f.payment==='credito'?c:p)*q),source:i.origin==='catalogo'?'catalogo':'manual',productId:i.productId||null,variantId:i.variantId||null,calculatorHistoryId:i.historyId||null,calculatorSource:i.origin,calculatorBrand:f.brand,calculatorUnitCost:i.cost==null?null:Number(i.cost),calculatorQuoteSettings:{version:1,discountType:f.discountType,discountValue:String(f.discountValue),financeRule:rule,finance:finance?{cost:finance.cost,fee:finance.fee,profit:finance.profit,salary:finance.ownerShare,reinvestment:finance.reinvestment,storeKeep:finance.storeKeep}:null}};}),subtotal:t.subtotalPix,total_pix:t.pix,total_credito:t.credit,total_final:t.total,acrescimo:round2(t.credit-t.pix),texto_gerado:buildQuoteText()};}
async function saveQuote(){if(quoteSaving)return;if(savedQuotes.find(q=>q.id===quoteId)?.calculadora_pedido_id){$('quoteStatus').textContent='Este orçamento já virou pedido. Faça os ajustes no painel ou comece outro orçamento.';return;}let d;try{d=validateQuote();}catch(e){$('quoteStatus').textContent=e.message;$('quoteStatus').className='error';return;}const epoch=sessionEpoch;quoteSaving=true;updateQuoteSummary(false);const controls=[...$('panel-orcamento').querySelectorAll('input,select,button')];const previous=controls.map(c=>c.disabled);controls.forEach(c=>c.disabled=true);$('quoteStatus').textContent='Salvando orçamento…';$('quoteStatus').className='';try{const payload=quotePayload(d.f,d.t);const query=quoteId?supabaseClient.from('orcamentos').update(payload).eq('id',quoteId):supabaseClient.from('orcamentos').insert({...payload,criado_por:currentSession.user.id});const {data,error}=await query.select('*').single();if(error)throw error;if(epoch!==sessionEpoch)return;quoteId=data.id;quoteNumber=data.numero;quoteDirty=false;updateQuoteSummary();let textWarning='';const {error:textError}=await supabaseClient.from('orcamentos').update({texto_gerado:buildQuoteText()}).eq('id',quoteId);if(textError)textWarning=' O texto com o número oficial será atualizado ao salvar novamente.';const index=savedQuotes.findIndex(q=>q.id===data.id);const saved={...data,texto_gerado:buildQuoteText()};if(index>=0)savedQuotes[index]=saved;else savedQuotes.unshift(saved);renderSavedQuotes();$('quoteStatus').textContent=`Orçamento Nº ${String(quoteNumber).padStart(3,'0')} salvo. Também está disponível no painel.${textWarning}`;$('quoteStatus').className='success';}catch(e){$('quoteStatus').textContent='Não foi possível salvar: '+(e.message||'Confira sua conexão.');$('quoteStatus').className='error';}finally{quoteSaving=false;controls.forEach((c,i)=>c.disabled=previous[i]);updateQuoteSummary(false);}}
function renderSavedQuotes(){$('savedQuoteCount').textContent='· '+savedQuotes.length;$('savedQuotes').innerHTML=savedQuotes.map(q=>`<div class="saved-quote"><div><strong>Nº ${esc(String(q.numero||0).padStart(3,'0'))} · ${esc(q.cliente_nome||'Cliente')}</strong><small>${esc(dateBR(q.data_orcamento))} · ${esc(money(q.total_final))}${q.calculadora_pedido_id?' · aprovado para produção':''}</small></div><button type="button" data-open-quote="${esc(q.id)}">Abrir</button></div>`).join('')||`<p class="hint">${esc(quotesError||'Nenhum orçamento salvo para mostrar.')}</p>`;}
function hasQuoteProgress(){return quoteItems.length>0||!!$('quoteName').value.trim();}
function openSavedQuote(row){if(!row)return;if(quoteDirty&&hasQuoteProgress()&&!confirm('Abrir este orçamento e substituir o rascunho atual?'))return;resetQuote();quoteId=row.id;quoteNumber=row.numero;const settings=row.itens?.[0]?.calculatorQuoteSettings;$('quoteDiscountType').value=settings?.discountType==='fixed'?'fixed':'percent';$('quoteDiscountValue').value=settings?.discountValue??'0';quoteFinanceRule=validFinanceRule(settings?.financeRule)?settings.financeRule:null;$('quoteName').value=row.cliente_nome||'';$('quotePhone').value=row.telefone||'';$('quoteDate').value=row.data_orcamento||dayISO();$('quoteValidity').value=row.validade_orcamento||datePlus(dayISO(),2);$('quoteLead').value=row.prazo_dias??2;$('quotePayment').value=row.pagamento==='credito'?'credito':'pix';$('quoteBrand').value=row.itens?.[0]?.calculatorBrand||'luzmariana';quoteItems=(Array.isArray(row.itens)?row.itens:[]).map((i,index)=>({key:'saved:'+row.id+':'+index,name:i.pedido||'Item',origin:i.calculatorSource||(i.source==='catalogo'?'catalogo':'manual'),productId:i.productId||null,variantId:i.variantId||null,historyId:i.calculatorHistoryId||null,unitPix:Number(i.unitarioPix??i.unitario??0),unitCredit:Number(i.unitarioCredito??customerCardPriceFromPix(Number(i.unitarioPix??i.unitario??0),3)),quantity:String(i.quantidade??1),cost:i.calculatorUnitCost!=null?Number(i.calculatorUnitCost):sourceItems.find(s=>i.productId?s.productId===i.productId&&String(s.variantId||'')===String(i.variantId||''):i.calculatorHistoryId&&String(s.historyId)===String(i.calculatorHistoryId))?.cost??null}));quoteDirty=false;renderQuoteItems();updateQuoteSummary();switchTab('orcamento');}
async function loadCatalogAndQuotes(epoch){if(!currentSession)return;const queries=await Promise.allSettled([supabaseClient.from('products').select('*, product_variants(id,name,photo_url,sort_order,cost,promo_manual_price,credit_price,promo_price)').eq('active',true).order('name'),supabaseClient.from('orcamentos').select('*').order('numero',{ascending:false}).limit(100),supabaseClient.from('materials').select('id,type,active,unit_cost,qty_per_order')]);if(epoch!==sessionEpoch)return;const materials=queries[2].status==='fulfilled'?queries[2].value:{error:queries[2].reason};materialsRows=materials.error?[]:materials.data||[];materialsError=materials.error?'Não foi possível carregar os materiais essenciais do painel. Atualize os preços para estimar o salário.':'';const products=queries[0].status==='fulfilled'?queries[0].value:{error:queries[0].reason};const quotes=queries[1].status==='fulfilled'?queries[1].value:{error:queries[1].reason};catalogRows=products.error?[]:products.data||[];catalogError=products.error?'Não foi possível carregar o catálogo. Use “Atualizar preços” para tentar novamente.':'';savedQuotes=quotes.error?[]:quotes.data||[];quotesError=quotes.error?'Não foi possível carregar os orçamentos salvos. Tente atualizar os preços.':'';rebuildSources();renderSavedQuotes();updateQuoteSummary(false);}
async function copyQuote(){if($('copyQuote').disabled)return;try{await navigator.clipboard.writeText(quoteMessage);toast('Texto do orçamento copiado');}catch{const area=document.createElement('textarea');area.value=quoteMessage;document.body.appendChild(area);area.select();let copied=false;try{copied=document.execCommand('copy');}catch{}area.remove();if(copied)toast('Texto do orçamento copiado');else{$('quoteStatus').textContent='Selecione e copie o texto da prévia acima.';}}}
function selectedDocumentType(){return $('documentType')?.value==='sale'?'sale':'quote';}
function renderQuoteDocument(kind=selectedDocumentType()){
  const sale=kind==='sale';
  const f=quoteFields(),t=quoteTotals();
  if(!t||!quoteItems.length)return '';
  const credit=f.payment==='credito',illuminart=f.brand==='iluminart';
  const logos={luzmariana:{src:'logo-luz-mariana.png',alt:'Luz Mariana - Artigos Religiosos e Devoção'},iluminart:{src:'logo-iluminart.png',alt:'Iluminart - Onde a criatividade ganha forma'}};
  const first=logos[illuminart?'iluminart':'luzmariana'],second=logos[illuminart?'luzmariana':'iluminart'];
  const logo=(brand,role)=>`<img class="pdf-logo ${role}" src="${brand.src}" alt="${brand.alt}" width="260" height="100">`;
  const reference=quoteNumber?`Nº ${String(quoteNumber).padStart(3,'0')}`:'Prévia · não salvo';
  return `<article class="pdf-proposal">
    <header class="pdf-brand-header"><div class="pdf-logo-pair">${logo(first,'pdf-logo-primary')}<span class="pdf-logo-divider" aria-hidden="true"></span>${logo(second,'pdf-logo-partner')}</div><span class="pdf-brand-note">${illuminart?'Presentes, decoração e personalizados':'Artigos religiosos e devoção'}</span></header>
    <section class="pdf-title-row"><div><span class="pdf-eyebrow">${sale?'Não é documento fiscal':'Uma proposta preparada para você'}</span><h1>${sale?'Nota de venda':'Orçamento'}</h1></div><div class="pdf-reference"><strong>${sale&&quoteNumber?'Ref. orçamento ':''}${esc(reference)}</strong><span>${quoteDirty&&quoteNumber?'Versão atualizada · alterações não salvas':sale?'Documento não fiscal':quoteNumber?'Proposta comercial':'Proposta em elaboração'}</span></div></section>
    <section class="pdf-client"><div class="pdf-client-name"><span class="pdf-label">${sale?'Cliente':'Preparado para'}</span><h2>${esc(f.name||'Cliente a informar')}</h2>${f.phone?`<p>Contato: ${esc(f.phone)}</p>`:''}</div><dl class="pdf-dates"><div><dt>Emissão</dt><dd>${esc(dateBR(f.date))}</dd></div>${sale?'':`<div><dt>Válido até</dt><dd>${esc(dateBR(f.validity))}</dd></div>`}</dl></section>
    <h2 class="pdf-section-heading">${sale?'Produtos':'Sua seleção'} <span>${quoteItems.length} ${quoteItems.length===1?'item':'itens'}</span></h2>
    <table class="pdf-items"><colgroup><col class="pdf-col-description"><col class="pdf-col-quantity"><col class="pdf-col-price"><col class="pdf-col-price"></colgroup><thead><tr><th scope="col">Descrição</th><th scope="col" class="pdf-numeric">Qtd.</th><th scope="col" class="pdf-numeric">Valor unitário</th><th scope="col" class="pdf-numeric">Subtotal</th></tr></thead><tbody>${quoteItems.map(i=>{const unit=credit?Number(i.unitCredit):Number(i.unitPix),q=Number(i.quantity);return `<tr><td>${esc(i.name)}</td><td class="pdf-numeric">${esc(q)}</td><td class="pdf-numeric">${esc(money(unit))}</td><td class="pdf-numeric pdf-line-total">${esc(money(Math.round(unit*100)*q/100))}</td></tr>`;}).join('')}</tbody></table>
    <section class="pdf-settlement"><div class="pdf-conditions"><h2>${sale?'Informações da venda':'Condições da proposta'}</h2><dl><div><dt>${sale?'Forma de pagamento':'Pagamento'}</dt><dd>${credit?'Cartão de crédito em até 3x':'Pix / dinheiro'}</dd></div><div><dt>Prazo de produção</dt><dd>${esc(f.lead||'0')} ${Number(f.lead)===1?'dia útil':'dias úteis'} após confirmação do pedido.</dd></div><div><dt>Entrega e frete</dt><dd>A combinar.</dd></div></dl></div><div class="pdf-totals"><div><span>Subtotal dos produtos</span><strong>${esc(money(t.subtotal))}</strong></div>${t.discount>0?`<div class="pdf-discount"><span>Desconto${f.discountType==='percent'?' ('+esc(readQuoteNumber(f.discountValue).toLocaleString('pt-BR'))+'%)':''}</span><strong>− ${esc(money(t.discount))}</strong></div>`:''}<div class="pdf-grand-total"><span>${sale?'Total da venda':'Total do orçamento'}</span><strong>${esc(money(t.total))}</strong></div><p>${credit?'Valor total para pagamento no cartão.':'Valor para pagamento à vista.'}</p></div></section>
    <section class="pdf-closing"><p>${sale?'Obrigada pela preferência!':'Obrigada por considerar nosso trabalho.'}</p><span>${sale?'Não é documento fiscal. Não comprova quitação.':'Será um prazer preparar cada detalhe para você.'}</span></section>
    <footer class="pdf-document-footer"><strong>${illuminart?'Iluminart':'Luz Mariana'}</strong><span>${illuminart?'Onde a criatividade ganha forma.':'Artigos Religiosos e Devoção.'}</span><div><span>@lojaluzmariana</span><i aria-hidden="true">·</i><span>@iluminartrn</span></div></footer>
  </article>`;
}
function printQuote(){if(!$('printQuote').disabled)openPrintOptions();}

$('exportExcel').addEventListener('click',()=>{if($('exportExcel').disabled)return;$('exportPanel').hidden=false;$('exportExcel').setAttribute('aria-expanded','true');$('excelText').focus();$('excelText').select();});
$('copyExcel').addEventListener('click',async()=>{if($('copyExcel').disabled)return;const text=$('excelText').value;function selectText(){$('excelText').focus();$('excelText').select();$('excelText').setSelectionRange(0,text.length);}let copied=false;try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);copied=true;}}catch(error){}if(!copied){selectText();try{copied=document.execCommand('copy');}catch(error){}}if($('excelText').value!==text){$('copyStatus').textContent='Os dados mudaram durante a cópia. Copie novamente para usar os valores atuais.';return;}$('copyStatus').textContent=copied?'Copiado! Cole em uma célula vazia do Excel.':'Texto selecionado. Pressione Ctrl+C (ou ⌘C) e cole no Excel.';});
$('saveHistory').addEventListener('click',saveCloudRecord);
$('cancelEdit').addEventListener('click',cancelEdit);
for(const list of ['historyBody','quotePicker'])$(list).addEventListener('click',e=>{
 const add=e.target.closest('[data-add-item]');if(add){addQuoteItem(sourceItems.find(i=>i.key===add.dataset.addItem),list!=='quotePicker');return;}
 const edit=e.target.closest('[data-edit-id]');if(edit){startEdit(cloudRows.find(r=>String(r.id)===String(edit.dataset.editId)));return;}
 const del=e.target.closest('[data-delete-id]');if(del){deleteRow(cloudRows.find(r=>String(r.id)===String(del.dataset.deleteId)));return;}
 if(e.target.closest('[data-go-calc]'))switchTab('calculo');
});
$('loginCloud').addEventListener('submit',async e=>{e.preventDefault();const btn=e.target.querySelector('button');btn.disabled=true;$('loginStatus').textContent='Entrando…';try{const {error}=await supabaseClient.auth.signInWithPassword({email:$('loginEmail').value.trim(),password:$('loginPassword').value});if(error)throw error;$('loginPassword').value='';$('loginStatus').textContent='';await loadSession();}catch(error){$('loginStatus').textContent='Não foi possível entrar: '+(error.message||'Confira a conexão.');}finally{btn.disabled=false;}});
supabaseClient.auth.onAuthStateChange((_event,session)=>{currentSession=session||null;setTimeout(()=>loadSession(),0);});

$('installDismissBtn').addEventListener('click',hideInstallOffer);
$('installNowBtn').addEventListener('click',async()=>{
  const platform=installPlatform();
  if(platform==='ios'){hideInstallOffer();return;}
  if(deferredInstallPrompt){
    const promptEvent=deferredInstallPrompt;deferredInstallPrompt=null;
    await promptEvent.prompt();
    try{await promptEvent.userChoice;}catch(_e){}
    hideInstallOffer();return;
  }
  $('installNowBtn').textContent='Menu ⋮ → Instalar app';
});
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{}));}
setTimeout(showInstallOfferOnce,700);

$('calculator').addEventListener('input',update);$('calculator').addEventListener('submit',e=>e.preventDefault());

document.querySelectorAll('[data-tab]').forEach(btn=>{
 btn.addEventListener('click',()=>switchTab(btn.dataset.tab));
 btn.addEventListener('keydown',e=>{const tabs=['consulta','calculo','orcamento'];let index=tabs.indexOf(appTab);if(e.key==='ArrowRight')index=(index+1)%3;else if(e.key==='ArrowLeft')index=(index+2)%3;else if(e.key==='Home')index=0;else if(e.key==='End')index=2;else return;e.preventDefault();switchTab(tabs[index],true);});
});
$('consultSearch').addEventListener('input',renderConsult);
$('quoteSearch').addEventListener('input',renderPicker);
for(const attr of ['consultSource','quoteSource'])document.querySelectorAll('[data-'+attr.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())+']').forEach(btn=>btn.addEventListener('click',()=>{if(attr==='consultSource')consultSource=btn.dataset[attr];else quoteSource=btn.dataset[attr];document.querySelectorAll('[data-'+attr.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())+']').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));if(attr==='consultSource')renderConsult();else renderPicker();}));
$('refreshData').addEventListener('click',async()=>{const btn=$('refreshData');btn.disabled=true;try{await loadSession();}finally{btn.disabled=false;}});
document.querySelectorAll('[data-markup]').forEach(b=>b.addEventListener('click',()=>{$('markup').value=b.dataset.markup;update();}));
$('newCalculation').addEventListener('click',()=>{if((editingId||currentRecord)&&!confirm('Começar um novo cálculo? Os cálculos já salvos serão mantidos.'))return;editingId=null;$('project').value='';$('grams').value='';$('hours').value='0';$('minutes').value='0';$('units').value='1';setSaveMode();update();$('project').focus();});
$('addCurrentQuote').addEventListener('click',()=>{if(!currentRecord)return;const item=historyPriceItem({id:editingId||'current',project:currentRecord.project,inputs:currentRecord.inputs,results:currentRecord.results});item.key='current:'+Date.now();if(!editingId)item.historyId=null;addQuoteItem(item);});
$('quoteItems').addEventListener('input',e=>{const target=e.target;if(target.matches('[data-quote-quantity]')){const i=quoteItems[Number(target.dataset.quoteQuantity)];if(i)i.quantity=target.value;}else if(target.matches('[data-quote-cost]')){const i=quoteItems[Number(target.dataset.quoteCost)];if(i)i.cost=target.value.trim()===''?null:readQuoteNumber(target.value);}else if(target.matches('[data-quote-price]')){const i=quoteItems[Number(target.dataset.quotePrice)];if(i){const n=readQuoteNumber(target.value);if($('quotePayment').value==='credito')i.unitCredit=n;else{i.unitPix=n;i.unitCredit=Number.isFinite(n)?customerCardPriceFromPix(n,3):NaN;}}}else return;quoteDirty=true;updateQuoteSummary();});
$('quoteItems').addEventListener('click',e=>{const btn=e.target.closest('[data-remove-quote]');if(!btn)return;quoteItems.splice(Number(btn.dataset.removeQuote),1);quoteDirty=true;renderQuoteItems();updateQuoteSummary();});
for(const id of ['quoteName','quotePhone','quoteDate','quoteValidity','quoteLead','quotePayment','quoteBrand','quoteDiscountType','quoteDiscountValue'])$(id).addEventListener(['quotePayment','quoteBrand','quoteDiscountType'].includes(id)?'change':'input',()=>{quoteDirty=true;if(id==='quoteDate'&&$('quoteDate').value){$('quoteValidity').value=datePlus($('quoteDate').value,2);quoteFinanceRule=null;}if(id==='quotePayment')renderQuoteItems();updateQuoteSummary();});
$('newQuote').addEventListener('click',()=>{if(hasQuoteProgress()&&quoteDirty&&!confirm('Começar um novo orçamento e descartar o rascunho atual?'))return;resetQuote();persistQuote();});
$('saveQuote').addEventListener('click',saveQuote);$('copyQuote').addEventListener('click',copyQuote);$('printQuote').addEventListener('click',printQuote);
$('savedQuotes').addEventListener('click',e=>{const btn=e.target.closest('[data-open-quote]');if(btn)openSavedQuote(savedQuotes.find(q=>String(q.id)===btn.dataset.openQuote));});
window.addEventListener('storage',e=>{if(['luz-mariana-profit-split-settings-v1',CARD_RATE_STORAGE_KEY].includes(e.key))updateQuoteSummary(false);});
restoreDraft();renderSavedQuotes();rebuildSources();

setSaveMode();update();loadSession();

// Impressão no mesmo escopo dos dados da calculadora.


// Exportação local: nenhuma informação interna de custo ou retirada é enviada.
// Papel de 58 mm, com conteúdo de 48 mm e margens laterais de 5 mm.
async function buildThermalPages(kind=selectedDocumentType()){
  const sale=kind==='sale';
  const f=quoteFields(),t=quoteTotals();
  if(!t||!quoteItems.length)throw Error('Adicione itens e confira os valores do orçamento.');
  const items=quoteItems.map(item=>({...item})),number=quoteNumber,dirty=quoteDirty;
  const width=384,scale=2,ops=[];let y=12;
  const measure=document.createElement('canvas').getContext('2d');
  function text(value,{size=20,bold=false,center=false}={}){
    measure.font=`${bold?'bold ':''}${size}px Arial`;
    const lines=[];
    for(const paragraph of String(value).split('\n')){
      let line='';
      for(const word of paragraph.split(/\s+/)){
        if(line&&measure.measureText(line+' '+word).width>width-4){lines.push(line);line='';}
        for(const char of (line?' ':'')+word){
          if(line&&measure.measureText(line+char).width>width-4){lines.push(line);line='';}
          line+=char;
        }
      }
      lines.push(line);
    }
    for(const line of lines){ops.push({kind:'text',text:line,y,height:size+7,size,bold,center});y+=size+7;}
  }
  function gap(n=12){y+=n;}
  function rule(){gap(6);ops.push({kind:'rule',y,height:2});gap(14);}
  function pair(label,value,bold=false,size=20){
    measure.font=`${bold?'bold ':''}${size}px Arial`;
    if(measure.measureText(label+'  '+value).width>width-4){text(label,{size,bold});text(value,{size,bold});return;}
    ops.push({kind:'pair',label,value,y,height:size+7,size,bold});y+=size+7;
  }
  const brand=f.brand==='iluminart'?'iluminart':'luz-mariana';
  for(const name of [brand,brand==='iluminart'?'luz-mariana':'iluminart']){
    const img=new Image();img.src='logo-'+name+'.png';await img.decode();
    const w=name===brand?270:170,h=Math.min(name===brand?100:65,w*img.naturalHeight/img.naturalWidth);
    const actualW=h*img.naturalWidth/img.naturalHeight;
    ops.push({kind:'image',img,x:(width-actualW)/2,y,width:actualW,height:h});y+=h+12;
  }
  rule();text(sale?'NOTA DE VENDA':'ORÇAMENTO',{size:27,bold:true,center:true});
  if(sale)text('NÃO É DOCUMENTO FISCAL',{size:18,bold:true,center:true});
  text(number?(sale?'Ref. orçamento Nº ':'Nº ')+String(number).padStart(3,'0'):'PRÉVIA - NÃO SALVO',{size:18,center:true});
  if(number&&dirty)text('Alterações ainda não salvas',{size:17,center:true});
  rule();text('CLIENTE',{size:17,bold:true});text(f.name||'Cliente a informar',{bold:true});
  if(f.phone)text('Contato: '+f.phone,{size:18});
  gap();text('Emissão: '+dateBR(f.date),{size:18});if(!sale)text('Validade: '+dateBR(f.validity),{size:18});
  rule();
  for(const [index,item] of items.entries()){
    const qty=Number(item.quantity),unit=f.payment==='credito'?Number(item.unitCredit):Number(item.unitPix);
    text((index+1)+'. '+item.name,{bold:true});
    pair(qty.toLocaleString('pt-BR')+' × '+money(unit),money(Math.round(unit*100)*qty/100));
    gap(12);
  }
  rule();pair('Subtotal',money(t.subtotal));
  if(t.discount>0)pair('Desconto'+(f.discountType==='percent'?' ('+readQuoteNumber(f.discountValue).toLocaleString('pt-BR')+'%)':''),'- '+money(t.discount));
  gap(6);pair('TOTAL',money(t.total),true,26);rule();
  text(sale?'INFORMAÇÕES DA VENDA':'CONDIÇÕES',{size:18,bold:true});
  text(f.payment==='credito'?'Cartão de crédito em até 3x':'Pix / dinheiro',{size:19});
  text('Produção: '+(f.lead||'0')+' '+(Number(f.lead)===1?'dia útil':'dias úteis')+' após confirmação do pedido.',{size:18});
  text('Entrega e frete: a combinar.',{size:18});rule();
  text('Obrigada pela preferência!',{bold:true,center:true});
  if(sale){gap(8);text('Não é documento fiscal. Não comprova quitação.',{size:18,center:true});}
  gap(8);text('@lojaluzmariana',{size:18,center:true});text('@iluminartrn',{size:18,center:true});gap(16);
  // Divisão por linha, evitando limites de altura do canvas em celulares.
  const batches=[];let start=0,batch=[];
  for(const op of ops){
    if(op.y+op.height-start>4000&&batch.length){batches.push({ops:batch,start,height:batch.at(-1).y+batch.at(-1).height-start+16});start=op.y-12;batch=[];}
    batch.push(op);
  }
  if(batch.length)batches.push({ops:batch,start,height:y-start});
  return batches.map(b=>{
    const canvas=document.createElement('canvas');canvas.width=width*scale;canvas.height=Math.ceil(b.height*scale);
    const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.scale(scale,scale);
    for(const op of b.ops){
      const top=op.y-b.start;ctx.fillStyle='#000';ctx.strokeStyle='#000';
      if(op.kind==='image'){ctx.drawImage(op.img,op.x,top,op.width,op.height);continue;}
      if(op.kind==='rule'){ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,top);ctx.lineTo(width,top);ctx.stroke();continue;}
      ctx.font=`${op.bold?'bold ':''}${op.size}px Arial`;ctx.textBaseline='top';
      if(op.kind==='pair'){ctx.textAlign='left';ctx.fillText(op.label,0,top);ctx.textAlign='right';ctx.fillText(op.value,width-2,top);}
      else{ctx.textAlign=op.center?'center':'left';ctx.fillText(op.text,op.center?width/2:0,top);}
    }
    // Preto e branco real, inclusive nas marcas oficiais, sem fundos coloridos.
    const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);
    for(let i=0;i<pixels.data.length;i+=4){const v=.299*pixels.data[i]+.587*pixels.data[i+1]+.114*pixels.data[i+2]<195?0:255;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=v;}
    ctx.putImageData(pixels,0,0);return canvas;
  });
}

// PDF com imagens incorporadas: preserva acentos, logos e medidas em qualquer leitor.
function thermalPdf(pages){
  const encoder=new TextEncoder(),chunks=[],offsets=[0];let length=0;
  function add(value){const bytes=typeof value==='string'?encoder.encode(value):value;chunks.push(bytes);length+=bytes.length;}
  function object(id,body){offsets[id]=length;add(id+' 0 obj\n'+body+'\nendobj\n');}
  add('%PDF-1.4\n');
  object(1,'<< /Type /Catalog /Pages 2 0 R >>');
  object(2,'<< /Type /Pages /Count '+pages.length+' /Kids ['+pages.map((_,i)=>(3+i*3)+' 0 R').join(' ')+'] >>');
  pages.forEach((canvas,i)=>{
    const id=3+i*3,w=58*72/25.4,contentWidth=48*72/25.4,h=canvas.height/canvas.width*contentWidth+8*72/25.4;
    const jpeg=Uint8Array.from(atob(canvas.toDataURL('image/jpeg',1).split(',')[1]),c=>c.charCodeAt(0));
    const stream='q '+contentWidth.toFixed(4)+' 0 0 '+(h-8*72/25.4).toFixed(4)+' '+(5*72/25.4).toFixed(4)+' '+(4*72/25.4).toFixed(4)+' cm /Im0 Do Q\n';
    object(id,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+w.toFixed(4)+' '+h.toFixed(4)+'] /Resources << /XObject << /Im0 '+(id+2)+' 0 R >> >> /Contents '+(id+1)+' 0 R >>');
    object(id+1,'<< /Length '+encoder.encode(stream).length+' >>\nstream\n'+stream+'endstream');
    offsets[id+2]=length;add((id+2)+' 0 obj\n<< /Type /XObject /Subtype /Image /Width '+canvas.width+' /Height '+canvas.height+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+jpeg.length+' >>\nstream\n');add(jpeg);add('\nendstream\nendobj\n');
  });
  const xref=length;add('xref\n0 '+offsets.length+'\n0000000000 65535 f \n');
  for(const offset of offsets.slice(1))add(String(offset).padStart(10,'0')+' 00000 n \n');
  add('trailer\n<< /Size '+offsets.length+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF');
  return new Blob(chunks,{type:'application/pdf'});
}

let printPreparation=0,preparedThermalPdf=null,preparedFileName='';
function openPrintOptions(){
  const dialog=$('printOptions');
  if(!dialog.open)dialog.showModal();
  preparePrintOptions();
}
async function preparePrintOptions(){
  const epoch=++printPreparation,kind=selectedDocumentType(),thermal=$('printPaper').value==='58';
  const number=quoteNumber;
  preparedThermalPdf=null;
  $('confirmPrint').disabled=true;$('downloadThermal').disabled=true;
  $('downloadThermal').hidden=!thermal;
  $('printOptionsStatus').textContent='Preparando documento…';
  try{
    let html='',canvases=[];
    if(thermal)canvases=await buildThermalPages(kind);
    else{
      html=renderQuoteDocument(kind);
      if(!html)throw Error('Adicione itens e confira os valores antes de imprimir.');
      const holder=document.createElement('div');holder.innerHTML=html;
      await Promise.all([...holder.querySelectorAll('img')].map(img=>img.decode()));
    }
    if(document.fonts?.ready)await document.fonts.ready;
    if(epoch!==printPreparation||!$('printOptions').open)return;
    const area=$('printQuoteArea');area.classList.toggle('thermal-print',thermal);
    document.getElementById('thermalPageStyle')?.remove();
    if(thermal){
      area.replaceChildren(...canvases.map(canvas=>{
        const img=document.createElement('img');img.src=canvas.toDataURL('image/png');
        img.alt=kind==='sale'?'Nota de venda não fiscal':'Orçamento';img.className='thermal-page';
        return img;
      }));
      await Promise.all([...area.querySelectorAll('img')].map(img=>img.decode()));
      if(epoch!==printPreparation||!$('printOptions').open)return;
      const height=Math.max(...canvases.map(c=>c.height/c.width*48+8));
      const style=document.createElement('style');style.id='thermalPageStyle';
      style.textContent='@media print{@page{size:58mm '+height.toFixed(3)+'mm;margin:4mm 5mm;@bottom-right{content:none}}html,body{margin:0!important;padding:0!important}.print-only.thermal-print{width:48mm!important}.thermal-page{display:block;width:48mm;height:auto;margin:0;padding:0;break-after:page;break-inside:avoid}.thermal-page:last-child{break-after:auto}}';
      document.head.appendChild(style);
      preparedThermalPdf=thermalPdf(canvases);
      preparedFileName=(kind==='sale'?'Nota-venda-nao-fiscal-':'Orcamento-')+(number?String(number).padStart(3,'0'):'previa')+'-58mm.pdf';
    }else area.innerHTML=html;
    const description=kind==='sale'?'Nota de venda não fiscal':'Orçamento';
    $('printOptionsStatus').textContent=description+' pronto em '+(thermal?'58 mm. Você também pode baixar o PDF para abrir no aplicativo da impressora.':'A4.');
    $('confirmPrint').disabled=false;$('downloadThermal').disabled=!thermal;
  }catch(error){
    if(epoch!==printPreparation||!$('printOptions').open)return;
    $('printOptionsStatus').textContent='Não foi possível preparar: '+(error.message||'Tente novamente.');
  }
}
$('documentType').addEventListener('change',preparePrintOptions);
$('printPaper').addEventListener('change',preparePrintOptions);
$('printOptions').addEventListener('close',()=>{++printPreparation;});
$('confirmPrint').addEventListener('click',()=>{
  if($('confirmPrint').disabled)return;
  // Chamada síncrona no clique para preservar a ação do usuário no celular.
  try{window.print();}catch{
    $('printOptionsStatus').textContent='A impressão não abriu neste navegador. Em 58 mm, use “Baixar PDF de 58 mm” para abrir no aplicativo da impressora.';
  }
});
$('downloadThermal').addEventListener('click',()=>{
  if(!preparedThermalPdf||$('downloadThermal').disabled)return;
  const url=URL.createObjectURL(preparedThermalPdf),link=document.createElement('a');
  link.href=url;link.download=preparedFileName;document.body.appendChild(link);
  link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
});

// Este trecho é incorporado ao escopo da calculadora no arquivo app.js.
let approvalMode='product',approvalRecord=null,approvalBusy=false;
function approvalError(error){
  const message=error?.message||'Confira a conexão e tente novamente.';
  return /function.*not find|schema cache|does not exist|PGRST202/i.test(message)?'Instale primeiro o arquivo Instalar_Fluxo_Integrado.sql no Supabase. Depois, atualize a página.':message;
}
function openApproval(mode){
  if(approvalBusy)return;
  if(!currentSession){$('quoteStatus').textContent='Entre com o acesso do painel para aprovar.';$('saveStatus').textContent='Entre com o acesso do painel para aprovar.';return;}
  approvalMode=mode;
  if(mode==='product'){
    if(!currentRecord)return;
    approvalRecord=structuredClone(currentRecord);
    $('approvalName').value=approvalRecord.project==='Sem nome'?'':approvalRecord.project;
    $('approvalPhoto').value='';$('approvalPublish').checked=false;
    $('approvalSummary').textContent='Custo por peça: '+money(approvalRecord.results.unitCost)+' · À vista: '+money(approvalRecord.results.unitPrice)+'. O produto ficará disponível no painel.';
  }else{
    if(!quoteTotals()||!quoteItems.length)return;
    $('approvalSummary').textContent=$('quoteName').value.trim()+' · '+quoteItems.length+' item(ns) · Total aprovado: '+money(quoteTotals().total)+'. O pedido entra no fluxo do painel, com pagamento pendente.';
    $('approvalDeadline').value='';$('approvalDeadline').min=dayISO();
  }
  $('approvalProductFields').hidden=mode!=='product';$('approvalOrderFields').hidden=mode!=='order';
  $('approvalTitle').textContent=mode==='product'?'Aprovar cálculo e cadastrar produto':'Aprovar orçamento para produção';
  $('approvalConfirm').textContent=mode==='product'?'Aprovar e cadastrar produto':'Aprovar e criar pedido';
  $('approvalStatus').textContent='';$('approvalResult').hidden=true;$('approvalConfirm').disabled=false;
  $('approvalDialog').showModal();
}
async function approvalPhotoBlob(file){
  if(!file)return null;
  if(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size>10*1024*1024)throw Error('Use uma foto JPG, PNG ou WebP de até 10 MB.');
  const image=new Image(),url=URL.createObjectURL(file);
  try{image.src=url;await image.decode();const scale=Math.min(1,1400/Math.max(image.naturalWidth,image.naturalHeight));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);return await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Não foi possível preparar a foto.')),'image/jpeg',.88));}finally{URL.revokeObjectURL(url);}
}
async function confirmApproval(){
  if(approvalBusy)return;
  if(!currentSession){$('approvalStatus').textContent='Entre novamente para aprovar.';return;}
  const epoch=sessionEpoch;let uploadedPath=null,committed=false,rpcStarted=false;
  approvalBusy=true;$('approvalConfirm').disabled=true;$('approvalCancel').disabled=true;
  $('approvalStatus').textContent='Salvando aprovação…';
  try{
    let result;
    if(approvalMode==='product'){
      const name=$('approvalName').value.trim();if(!name||name.length>200)throw Error('Informe o nome do produto, com até 200 caracteres.');
      const record={...approvalRecord,cardFeeRate:cardRateFor('credito',3),unitCredit:customerCardPriceFromPix(round2(approvalRecord.results.unitPrice),3)};
      const blob=await approvalPhotoBlob($('approvalPhoto').files[0]);let photo=null;
      if(blob){uploadedPath='calculadora-'+crypto.randomUUID()+'.jpg';const upload=await supabaseClient.storage.from('product-photos').upload(uploadedPath,blob,{contentType:'image/jpeg',upsert:false});if(upload.error)throw upload.error;photo=supabaseClient.storage.from('product-photos').getPublicUrl(uploadedPath).data.publicUrl;}
      if(epoch!==sessionEpoch)throw Error('Seu acesso mudou. Entre novamente antes de aprovar.');
      rpcStarted=true;result=await supabaseClient.rpc('calculadora_aprovar_produto',{p_calculo:record,p_nome:name,p_foto:photo,p_publicar:$('approvalPublish').checked});
      if(result.error)throw result.error;committed=true;
      if(result.data.existing&&uploadedPath){await supabaseClient.storage.from('product-photos').remove([uploadedPath]);uploadedPath=null;}
      $('approvalResult').href='../admin/?produto='+encodeURIComponent(result.data.product_id);$('approvalResult').textContent='Abrir produto no painel';
      $('approvalStatus').textContent=result.data.existing?'Este cálculo já foi aprovado. O produto existente foi mantido.':'Produto cadastrado no painel com os preços do cálculo.';
    }else{
      const deadline=$('approvalDeadline').value;
      if(deadline&&deadline<dayISO())throw Error('Escolha uma entrega a partir de hoje.');
      if(!quoteId||quoteDirty){await saveQuote();if(!quoteId||quoteDirty)throw Error($('quoteStatus').textContent||'Salve o orçamento antes de aprovar.');}
      if(epoch!==sessionEpoch)throw Error('Seu acesso mudou. Entre novamente antes de aprovar.');
      rpcStarted=true;result=await supabaseClient.rpc('calculadora_aprovar_orcamento',{p_orcamento:quoteId,p_entrega:deadline||null});
      if(result.error)throw result.error;committed=true;
      const row=savedQuotes.find(q=>q.id===quoteId);if(row)row.calculadora_pedido_id=result.data.order_id;
      $('approvalResult').href='../admin/?pedido='+encodeURIComponent(result.data.order_id);$('approvalResult').textContent='Abrir pedido no painel';
      $('approvalStatus').textContent=result.data.existing?'Este orçamento já tem pedido. Nenhum pedido foi duplicado.':'Pedido aprovado. A fabricação própria já está na fila de produção. Registre o pagamento e acompanhe a entrega pelo painel.';
      renderSavedQuotes();
    }
    $('approvalResult').hidden=false;
    // A aprovação é persistente. Atualização do catálogo é apenas uma leitura posterior.
    loadCatalogAndQuotes(epoch).catch(()=>{});
  }catch(error){
    // Uma falha de rede após iniciar a RPC pode esconder uma aprovação concluída.
    // Nesse caso, preserva a foto; repetir a aprovação consulta o vínculo existente.
    if(uploadedPath&&!committed&&!rpcStarted)await supabaseClient.storage.from('product-photos').remove([uploadedPath]).catch(()=>{});
    $('approvalStatus').textContent='Não foi possível confirmar: '+approvalError(error);
  }finally{
    approvalBusy=false;$('approvalConfirm').disabled=committed;$('approvalCancel').disabled=false;updateQuoteSummary(false);
  }
}
$('approveCalculation').addEventListener('click',()=>openApproval('product'));
$('approveQuote').addEventListener('click',()=>openApproval('order'));
$('approvalConfirm').addEventListener('click',confirmApproval);
$('approvalDialog').addEventListener('cancel',event=>{if(approvalBusy)event.preventDefault();});
$('approvalCancel').addEventListener('click',()=>{if(!approvalBusy)$('approvalDialog').close();});

}

