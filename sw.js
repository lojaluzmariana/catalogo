// Service worker mínimo, só pra habilitar "Adicionar à tela inicial"
// nos navegadores que exigem um (Chrome/Android). DE PROPÓSITO não
// guarda nada em cache: o catálogo mostra estoque e preço em tempo
// real vindos do Supabase, então cachear a página correria o risco de
// mostrar produto esgotado como disponível (ou vice-versa) pra quem
// abrir pelo ícone da tela inicial. Toda requisição vai direto pra
// rede, sempre — o app instalado se comporta exatamente igual ao site
// aberto no navegador, só que sem a barra de endereço.
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
