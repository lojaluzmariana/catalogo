/* O app consulta a operação online. Não guarda dados de clientes ou respostas autenticadas. */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
