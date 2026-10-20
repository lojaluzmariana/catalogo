/* Luz Mariana: atualização imediata, sem guardar páginas antigas em cache. */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
// Sem interceptação de fetch: preços, catálogo e pedido sempre vêm da rede.
