/* Modo de manutenção do catálogo. Edite manutencao.json para ativar/desativar. */
(function () {
  'use strict';
  const scriptUrl = new URL(document.currentScript.src);
  const homeUrl = new URL('./', scriptUrl);
  const maintenanceUrl = new URL('manutencao.html', scriptUrl);
  const onMaintenancePage = window.location.pathname === maintenanceUrl.pathname;
  if (!onMaintenancePage) document.documentElement.classList.add('lm-maintenance-pending');

  async function requestFresh(url, method = 'GET') {
    const target = new URL(url);
    target.searchParams.set('_lm', String(Date.now()));
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);
    try {
      return await fetch(target, { method, cache: 'no-store', credentials: 'same-origin', signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  window.lmMaintenanceReady = (async function () {
    let active = false;
    try {
      const response = await requestFresh(new URL('manutencao.json', scriptUrl));
      if (response.ok) active = (await response.json()).ativa === true;
      if (active && !onMaintenancePage) {
        // Se a página for excluída, o catálogo volta sem redirecionar para um 404.
        const page = await requestFresh(maintenanceUrl, 'HEAD');
        active = page.ok;
      }
    } catch (_error) {
      // Configuração ausente/inválida ou falha de rede não trava o site.
      active = false;
    }
    if (active && !onMaintenancePage) {
      window.location.replace(maintenanceUrl.href);
      return false;
    }
    if (!active && onMaintenancePage) {
      window.location.replace(homeUrl.href);
      return false;
    }
    document.documentElement.classList.remove('lm-maintenance-pending');
    return !onMaintenancePage;
  })();
})();
