'use strict';

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
