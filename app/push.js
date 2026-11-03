/* Inscrição voluntária por aparelho. Segredos de envio permanecem no servidor. */
(function(){'use strict';
const $=id=>document.getElementById(id),db=window.mobileClient;
const endpoint='https://xgcsdpqaqxstcfwgwaxw.supabase.co/functions/v1/delivery-push';
const support=()=>window.isSecureContext&&'serviceWorker'in navigator&&'PushManager'in window&&'Notification'in window;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function registration(){await navigator.serviceWorker.register('sw.js?v=20261103-push',{scope:'./',updateViaCache:'none'});return navigator.serviceWorker.ready;}
async function rpc(n,args={}){const r=await db.rpc(n,args);if(r.error)throw r.error;return r.data;}
async function server(action){const {data,error}=await db.auth.getSession();if(error||!data.session)throw Error('Entre no aplicativo novamente.');const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+data.session.access_token},body:JSON.stringify({action})});const body=await r.json().catch(()=>({}));if(!r.ok)throw Error(body.error||'Confira a instalação da função delivery-push no Supabase.');return body;}
function keyBytes(key){const base=key.replace(/-/g,'+').replace(/_/g,'/'),raw=atob(base+'='.repeat((4-base.length%4)%4));return Uint8Array.from(raw,c=>c.charCodeAt(0));}
function message(error){return /does not exist|schema cache|PGRST202/i.test(error?.message||'')?'A loja precisa instalar Instalar_Notificacoes_Entregas.sql no Supabase.':error?.message||'Não foi possível ativar. Confira a conexão e tente novamente.';}
async function open({role}){
 const staff=role==='staff',d=$('modal');if(d.open)d.close();d.innerHTML=`<div class="modal-head"><h2>Avisos de entrega</h2><button type="button" data-close aria-label="Fechar">×</button></div>${staff?'<p>Prepare o envio da loja uma única vez. Cada entregador depois ativa os avisos no próprio celular.</p><button id="push-setup" class="primary">Preparar notificações da loja</button><p class="hint">É preciso instalar o SQL e publicar a função delivery-push no Supabase antes.</p>':'<p>Receba uma notificação quando uma entrega ficar disponível para retirada, mesmo com o aplicativo fechado. O primeiro motoboy que aceitar assume a corrida.</p><p class="hint">No iPhone, adicione o app à Tela de Início e abra pelo ícone. No Android, permita as notificações do app/navegador nas configurações do celular.</p><div class="actions"><button id="push-enable" class="primary">Ativar avisos neste celular</button><button id="push-test">Enviar aviso de teste</button><button id="push-disable">Desativar neste celular</button></div>'}<p id="push-status" role="status" aria-live="polite">${!staff&&!support()?'Este navegador não oferece notificações em segundo plano. No iPhone, abra o app pela Tela de Início.':''}</p><p class="hint">Os avisos dependem de internet e das permissões do celular. A lista do app mostra a disponibilidade atual da corrida.</p>`;d.showModal();
 const set=text=>{if($('push-status'))$('push-status').textContent=text;};
 const run=async(button,work)=>{button.disabled=true;try{await work();}catch(e){set(message(e));}finally{if(button.isConnected)button.disabled=false;}};
 if(staff){$('push-setup').onclick=e=>run(e.currentTarget,async()=>{set('Preparando envio…');await server('setup');set('Envio da loja preparado. Agora peça aos entregadores que ativem os avisos nos celulares.');});return;}
 for(const id of ['push-enable','push-test','push-disable'])$(id).disabled=!support();
 $('push-enable').onclick=e=>run(e.currentTarget,async()=>{
  // Permissão precisa ser solicitada diretamente pelo toque, especialmente no iPhone.
  const permission=await Notification.requestPermission();if(permission!=='granted')throw Error('Notificações não autorizadas. Libere nas configurações do celular/navegador e tente novamente.');
  set('Ativando avisos…');const key=await rpc('delivery_push_public_key');if(!key)throw Error('A loja ainda precisa preparar as notificações.');const reg=await registration();let sub=await reg.pushManager.getSubscription();
  if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:keyBytes(key)});
  try{await rpc('delivery_push_subscribe',{p_subscription:sub.toJSON()});}catch(e){await sub.unsubscribe().catch(()=>{});throw e;}
  set('Avisos ativados neste celular. Você já pode fechar o aplicativo. Use Enviar aviso de teste para conferir.');
 });
 $('push-test').onclick=e=>run(e.currentTarget,async()=>{set('Enviando teste…');await server('test');set('Aviso de teste enviado. Confira as notificações do celular.');});
 $('push-disable').onclick=e=>run(e.currentTarget,async()=>{await signOut(db);set('Avisos desativados neste celular.');});
 if(support()){try{const reg=await registration(),sub=await reg.pushManager.getSubscription();if(sub&&$('push-status'))set('Este navegador possui uma inscrição. Toque em Ativar avisos para confirmar o vínculo com sua conta, ou envie um teste.');}catch(e){set(message(e));}}
}
async function signOut(client){if(!support())return;const reg=await navigator.serviceWorker.getRegistration('./');const sub=await reg?.pushManager.getSubscription();if(!sub)return;try{await client.rpc('delivery_push_unsubscribe',{p_endpoint:sub.endpoint});}finally{await sub.unsubscribe();}}
window.LMPush={open,signOut};
})();
