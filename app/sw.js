/* O app consulta a operação online. Não guarda dados de clientes ou respostas autenticadas. */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));

// Push é entregue pelo serviço do navegador, mesmo sem uma janela do app aberta.
self.addEventListener('push',event=>{
 let data={};try{data=event.data?.json()||{};}catch{}
 const id=typeof data.jobId==='string'&&/^[0-9a-f-]{36}$/i.test(data.jobId)?data.jobId:null;
 event.waitUntil(self.registration.showNotification(String(data.title||'Entregas Iluminart').slice(0,100),{
  body:String(data.body||'Há uma atualização nas entregas. Abra o aplicativo para conferir.').slice(0,250),
  icon:'../calculadora/icon-192.png',badge:'../calculadora/icon-192.png',
  tag:id?'iluminart-entrega-'+id:'iluminart-push-teste',renotify:true,
  data:{url:new URL('./'+(id?'?corrida='+id:'')+(['#entregas','#entregas/historico'].includes(data.path)?data.path:'#entregas'),self.registration.scope).href}
 }));
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();let url=new URL('./#entregas',self.registration.scope).href;try{const candidate=new URL(event.notification.data?.url||url);if(candidate.href.startsWith(self.registration.scope)&&['#entregas','#entregas/historico'].includes(candidate.hash))url=candidate.href;}catch{}
 event.waitUntil((async()=>{const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});for(const client of windows){if(client.url.startsWith(self.registration.scope)&&'focus'in client){await client.navigate(url);return client.focus();}}return self.clients.openWindow(url);})());
});
