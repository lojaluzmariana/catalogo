<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Luz Mariana — Catálogo</title>
<meta name="description" content="Catálogo de artigos religiosos — Luz Mariana" />
<link rel="canonical" href="https://lojaluzmariana.github.io/catalogo/" />
<link rel="icon" type="image/png" href="favicon.png" />
<link rel="apple-touch-icon" href="apple-touch-icon.png" />

<!-- Google Analytics (GA4) — só no catálogo público, não no painel admin
     (ferramenta interna, não faz sentido rastrear o uso de vocês dois lá). -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-G0TGJJXGTF"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-G0TGJJXGTF');
</script>

<!-- PWA: permite "Adicionar à tela inicial" (o app abre parecido com um
     aplicativo nativo, sem barra de endereço). Ver manifest.json e
     sw.js — o service worker é só pra habilitar a instalação, não guarda
     nada em cache (estoque/preço sempre vêm direto do Supabase). -->
<link rel="manifest" href="manifest.json" />
<meta name="theme-color" content="#001868" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="Luz Mariana" />

<!-- Pré-visualização do link no WhatsApp, Instagram, etc. -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Luz Mariana" />
<meta property="og:title" content="Luz Mariana - Loja Virtual" />
<meta property="og:description" content="Catálogo de artigos religiosos — Luz Mariana" />
<meta property="og:url" content="https://lojaluzmariana.github.io/catalogo/" />
<meta property="og:image" content="https://lojaluzmariana.github.io/catalogo/og-image.jpg" />
<meta property="og:image:secure_url" content="https://lojaluzmariana.github.io/catalogo/og-image.jpg" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="1200" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Luz Mariana - Loja Virtual" />
<meta name="twitter:description" content="Catálogo de artigos religiosos — Luz Mariana" />
<meta name="twitter:image" content="https://lojaluzmariana.github.io/catalogo/og-image.jpg" />

<!-- CSS do Tailwind PRÉ-COMPILADO (tailwind-built.css), no lugar do
     script da CDN (cdn.tailwindcss.com). A CDN recompila tudo no
     navegador de cada visitante a cada carregamento — mais lento e
     dependente de um domínio externo. O arquivo estático já vem pronto
     com só as classes realmente usadas no catálogo e no painel. Se
     algum dia mudar/adicionar uma classe do Tailwind no HTML e ela não
     aparecer estilizada, é só regenerar esse arquivo (README-TAILWIND.md
     explica o passo a passo, sem precisar mexer no resto do site). -->
<link rel="stylesheet" href="tailwind-built.css" />
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<style>
  html, body { max-width: 100%; overflow-x: hidden; }
  body { font-family: Arial, Helvetica, sans-serif; }
  #app { width: 100%; max-width: 100%; overflow-x: hidden; }
  @keyframes featured-carousel-scroll {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  .featured-carousel-track {
    animation: none !important;
    width: max-content;
  }
  .featured-carousel-wrap {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
  }

  /* Compra guiada: foco em celular, botões grandes e leitura simples. */
  .shopping-guide-card {
    border: 1px solid #d8d9e4;
    background: #fff;
    border-radius: 16px;
    padding: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,.05);
  }
  .shopping-guide-steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 10px;
  }
  .shopping-guide-step {
    background: #f8f6ef;
    border-radius: 12px;
    padding: 10px 8px;
    text-align: center;
    font-size: 12px;
    line-height: 1.3;
    color: #27305b;
  }
  .shopping-guide-number {
    display: flex;
    width: 28px;
    height: 28px;
    margin: 0 auto 5px;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: #d5aa3e;
    color: #07164d;
    font-weight: 700;
    font-size: 14px;
  }
  .help-guide-btn {
    position: fixed;
    right: 14px;
    bottom: 86px;
    z-index: 26;
    display: flex;
    align-items: center;
    gap: 7px;
    min-height: 48px;
    padding: 0 14px;
    border: 0;
    border-radius: 999px;
    background: #001868;
    color: #fff;
    box-shadow: 0 5px 18px rgba(0,0,0,.28);
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }
  .help-guide-overlay {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: none;
    align-items: flex-end;
    justify-content: center;
    background: rgba(0, 12, 55, .55);
    padding: 12px;
  }
  .help-guide-overlay.is-open { display: flex; }
  .help-guide-dialog {
    width: 100%;
    max-width: 520px;
    max-height: 88vh;
    overflow-y: auto;
    border-radius: 20px 20px 14px 14px;
    background: #fff;
    padding: 16px;
    box-shadow: 0 20px 50px rgba(0,0,0,.25);
  }
  .help-step-row {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #ececf2;
  }
  .help-step-row:last-child { border-bottom: 0; }
  .help-step-icon {
    flex: 0 0 34px;
    width: 34px;
    height: 34px;
    border-radius: 999px;
    background: #f7edcf;
    color: #07164d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
  }
  .variant-choice-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .variant-choice-card {
    position: relative;
    display: flex;
    min-height: 64px;
    align-items: center;
    gap: 9px;
    border: 2px solid #e0e2ec;
    background: #fff;
    border-radius: 12px;
    padding: 9px;
    text-align: left;
    color: #1d2857;
    cursor: pointer;
  }
  .variant-choice-card.is-selected {
    border-color: #d5aa3e;
    background: #fffaf0;
    box-shadow: 0 0 0 2px rgba(213,170,62,.16);
  }
  .variant-choice-card.is-sold-out { opacity: .62; }
  .variant-choice-photo {
    width: 46px;
    height: 46px;
    flex: 0 0 46px;
    border-radius: 9px;
    object-fit: cover;
    background: #f8f6ef;
  }
  .product-detail-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
    width: 100%;
    max-width: 100%;
  }
  .product-detail-grid > * {
    min-width: 0;
    max-width: 100%;
  }
  .product-media-column {
    min-width: 0;
    width: 100%;
    max-width: 100%;
  }
  .product-main-image-box {
    position: relative;
    width: min(100%, 520px);
    max-width: 520px;
    aspect-ratio: 1 / 1;
    height: auto;
    max-height: none;
    min-height: 0;
    margin: 0 auto;
    overflow: hidden;
    background: #f8f6ef;
  }
  .product-main-image-box > img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain !important;
    object-position: center;
    display: block;
  }
  .product-image-btn img,
  [data-carousel-img],
  .gallery-thumb-btn img,
  .variant-thumb-photo,
  .variant-choice-photo,
  #cart-drawer-panel img {
    object-fit: contain !important;
    object-position: center;
  }
  .product-image-btn,
  [data-carousel],
  .gallery-thumb-btn,
  .variant-thumb-btn {
    background: #f8f6ef;
  }
  .variant-thumb-section,
  .variant-thumb-row {
    min-width: 0;
    max-width: 100%;
  }
  .variant-thumb-row {
    width: 100%;
    overscroll-behavior-x: contain;
  }
  @media (min-width: 900px) {
    .product-detail-grid {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
  }
  .product-image-title-overlay {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 12px;
    z-index: 9;
    border-radius: 14px;
    padding: 10px 12px;
    color: #fff;
    background: linear-gradient(180deg, rgba(0,0,0,.12) 0%, rgba(0,0,0,.62) 100%);
    box-shadow: 0 8px 24px rgba(0,0,0,.14);
  }
  .product-image-title-overlay .title {
    display: block;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.2;
  }
  .product-image-title-overlay .subtitle {
    display: block;
    margin-top: 3px;
    font-size: 12px;
    opacity: .95;
    line-height: 1.3;
  }
  .variant-thumb-section {
    margin-top: 12px;
    border: 1px solid #e6e7ef;
    background: #fff;
    border-radius: 14px;
    padding: 12px;
  }
  .variant-thumb-row {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 2px;
  }
  .variant-thumb-btn {
    flex: 0 0 88px;
    border: 2px solid #e0e2ec;
    background: #fff;
    border-radius: 14px;
    padding: 7px;
    text-align: center;
    color: #1d2857;
  }
  .variant-thumb-btn.is-selected {
    border-color: #d5aa3e;
    background: #fffaf0;
    box-shadow: 0 0 0 2px rgba(213,170,62,.16);
  }
  .variant-thumb-btn.is-sold-out {
    opacity: .6;
  }
  .variant-thumb-photo {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 10px;
    object-fit: cover;
    background: #f8f6ef;
    display: block;
  }
  .variant-thumb-name {
    display: block;
    margin-top: 6px;
    font-size: 11px;
    font-weight: 700;
    line-height: 1.25;
    word-break: break-word;
  }
  .variant-thumb-status {
    display: block;
    margin-top: 3px;
    font-size: 10px;
    line-height: 1.2;
  }
  .best-seller-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: #f7edcf;
    color: #8b6711;
    border: 1px solid #e6cf8a;
    padding: 4px 10px;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
  }
  .best-seller-badge.image-badge {
    position: absolute;
    left: 12px;
    top: 12px;
    z-index: 11;
    box-shadow: 0 4px 12px rgba(0,0,0,.10);
  }
  .selected-model-summary {
    border: 1px solid #e6e7ef;
    background: #fff;
    border-radius: 14px;
    padding: 14px;
  }
  .variant-thumb-price {
    display: block;
    margin-top: 4px;
    font-size: 11px;
    font-weight: 700;
    color: #001868;
    line-height: 1.2;
  }
  .quick-model-add { margin-top: 12px; width: 100%; }
  .catalog-search-suggestions {
    position: absolute; left: 0; right: 0; top: calc(100% + 6px); z-index: 35;
    overflow: hidden; border: 1px solid #e0e2ec; border-radius: 14px; background: #fff;
    box-shadow: 0 10px 30px rgba(0,0,0,.12);
  }
  .catalog-search-suggestion {
    display: flex; width: 100%; align-items: center; gap: 10px; padding: 10px 12px;
    border: 0; border-bottom: 1px solid #f0f0f4; background: #fff; text-align: left; color: #1d2857;
  }
  .catalog-search-suggestion:last-child { border-bottom: 0; }
  .catalog-search-suggestion:active { background: #f8f6ef; }
  .catalog-search-suggestion img {
    width: 42px; height: 42px; flex: 0 0 42px; border-radius: 8px; object-fit: contain; background: #f8f6ef;
  }
  .catalog-add-toast {
    position: fixed; left: 50%; bottom: 92px; z-index: 80; width: calc(100% - 28px); max-width: 360px;
    transform: translateX(-50%); border-radius: 14px; background: #001868; color: #fff; padding: 12px 14px;
    box-shadow: 0 10px 30px rgba(0,0,0,.28); font-size: 14px; line-height: 1.35;
  }
  .checkout-review-item {
    display: grid; grid-template-columns: 54px minmax(0,1fr) auto; gap: 10px; align-items: center;
    padding: 10px 0; border-bottom: 1px solid #f0f0f4;
  }
  .checkout-review-item:last-child { border-bottom: 0; }
  .checkout-review-photo {
    width: 54px; height: 54px; border-radius: 10px; object-fit: contain; background: #f8f6ef;
  }
  .shipping-method-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .shipping-method-btn {
    min-height:54px; border:1px solid #ccd2e2; border-radius:12px; background:#fff;
    color:#33436f; padding:8px 10px; font-size:13px; font-weight:700;
  }
  .shipping-method-btn.is-selected {
    border-color:#d5aa3e; background:#fff8e6; color:#001868;
    box-shadow:0 0 0 2px rgba(213,170,62,.13);
  }
  .shipping-quote-box {
    border:1px solid #dfe3ec; border-radius:12px; background:#f8fafc;
    padding:12px; font-size:13px; line-height:1.5;
  }
  .shipping-quote-box.is-ready { border-color:#a7d8b4; background:#f0fbf3; }
  .shipping-quote-box.is-pac { border-color:#cbd5e1; background:#f8fafc; }
  .shipping-quote-box.is-error { border-color:#fecaca; background:#fff7f7; color:#991b1b; }
  .shipping-address-summary {
    margin-top:8px; border-radius:10px; background:#fff; padding:9px 10px;
    color:#52618a; font-size:12px;
  }
  .shipping-free-badge {
    display:inline-flex; align-items:center; gap:5px; border-radius:999px;
    background:#ecfdf3; color:#166534; border:1px solid #bbf7d0;
    padding:5px 9px; font-size:11px; font-weight:700;
  }
  .shipping-stale-note {
    margin-top:8px; border-radius:10px; background:#fff7ed; color:#9a3412;
    border:1px solid #fed7aa; padding:8px 10px; font-size:11px; font-weight:600;
  }
  .checkout-edit-btn {
    min-height:38px; border:1px solid #d8dce8; border-radius:9px; background:#fff;
    color:#33436f; padding:0 10px; font-size:11px; font-weight:700;
  }
  .checkout-section-heading {
    display:flex; align-items:center; justify-content:space-between; gap:10px;
  }
  .saved-address-box {
    margin-top:10px; border:1px solid #dfe3ec; border-radius:11px;
    background:#fff; padding:10px; font-size:12px; color:#52618a;
  }
  .field-inline-status { margin-top:4px; min-height:16px; font-size:11px; }
  .field-inline-status.is-error { color:#b42318; }
  .field-inline-status.is-ok { color:#166534; }

  .product-description-box summary { cursor: pointer; font-weight: 700; color: #001868; padding: 8px 0; }
  @media (min-width: 640px) { .product-description-box summary { display: none; } }
  .large-touch-action { min-height: 48px; font-size: 15px !important; }

  /* Acessibilidade: leitura, foco, toque e contraste. */
  html[data-font-size="large"] { font-size: 112.5%; }
  body { color: #10265f; }
  ::placeholder { color: #667085 !important; opacity: 1; }
  button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible,
  textarea:focus-visible, summary:focus-visible, [tabindex]:focus-visible {
    outline: 3px solid #d5aa3e !important;
    outline-offset: 2px !important;
  }
  button, summary, .category-bar-btn, .qty-btn, .giftwrap-qty-btn {
    touch-action: manipulation;
  }
  input:not([type="checkbox"]):not([type="radio"]), select, textarea { min-height: 48px; }
  .category-bar-btn, [data-open-track], [data-font-toggle], .qty-btn,
  .giftwrap-qty-btn, [data-checkout-remove] { min-height: 44px; }
  .accessibility-btn {
    min-width: 44px;
    min-height: 44px;
    border: 1px solid rgba(255,255,255,.28);
    border-radius: 999px;
    color: #fff;
    font-weight: 700;
    font-size: 13px;
  }
  .secure-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border: 1px solid #9fd7ae;
    background: #eefaf1;
    color: #166534;
    border-radius: 999px;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 700;
  }
  .secure-note { color: #475467; line-height: 1.45; }
  .checkout-sticky-summary {
    position: sticky;
    top: 0;
    z-index: 14;
    margin-bottom: 14px;
    border: 1px solid #d9dce8;
    border-radius: 12px;
    background: rgba(255,255,255,.97);
    padding: 9px 12px;
    box-shadow: 0 4px 14px rgba(0,0,0,.07);
    backdrop-filter: blur(6px);
  }
  .model-scroll-hint {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 8px;
    color: #52618a;
    font-size: 11px;
  }
  .photo-zoom-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px;
    background: rgba(0,0,0,.82);
  }
  .photo-zoom-dialog {
    position: relative;
    width: 100%;
    max-width: 760px;
    max-height: 92vh;
    border-radius: 16px;
    background: #fff;
    padding: 12px;
  }
  .photo-zoom-dialog img {
    display: block;
    width: 100%;
    max-height: 82vh;
    object-fit: contain;
    border-radius: 10px;
    background: #f8f6ef;
  }
  .photo-zoom-close {
    position: absolute;
    right: 18px;
    top: 18px;
    z-index: 2;
    min-width: 44px;
    min-height: 44px;
    border-radius: 999px;
    background: #fff;
    color: #001868;
    box-shadow: 0 3px 12px rgba(0,0,0,.24);
    font-size: 22px;
    font-weight: 700;
  }
  .zoom-photo-btn {
    position: absolute;
    right: 54px;
    top: 8px;
    z-index: 12;
    min-height: 40px;
    border-radius: 999px;
    background: rgba(255,255,255,.94);
    padding: 0 12px;
    color: #001868;
    font-size: 11px;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(0,0,0,.14);
  }
  .context-help-btn {
    width: 100%;
    min-height: 44px;
    margin-top: 8px;
    border: 1px solid #cdd3e4;
    border-radius: 10px;
    background: #fff;
    color: #33436f;
    font-size: 12px;
    font-weight: 700;
  }

  .welcome-order-overlay {
    position: fixed;
    inset: 0;
    z-index: 95;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 18px;
    background: rgba(0, 12, 55, .48);
  }
  .welcome-order-overlay.is-open { display: flex; }
  .welcome-order-card {
    position: relative;
    width: 100%;
    max-width: 430px;
    border: 1px solid #e1e3ec;
    border-radius: 20px;
    background: #fff;
    padding: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,.28);
  }
  .welcome-order-close-x {
    position: absolute;
    right: 12px;
    top: 12px;
    display: flex;
    width: 42px;
    height: 42px;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: #f6f7fa;
    color: #001868;
    font-size: 22px;
    font-weight: 700;
  }
  .welcome-order-kicker {
    display: inline-flex;
    border-radius: 999px;
    background: #f7edcf;
    color: #8b6711;
    padding: 5px 9px;
    font-size: 11px;
    font-weight: 700;
  }
  .welcome-order-actions {
    display: grid;
    gap: 9px;
    margin-top: 16px;
  }
  .welcome-order-primary {
    min-height: 48px;
    border-radius: 12px;
    background: #25D366;
    color: #fff;
    padding: 0 14px;
    font-weight: 700;
    box-shadow: 0 5px 14px rgba(37,211,102,.22);
  }
  .welcome-order-secondary {
    min-height: 46px;
    border: 1px solid #d8dbe7;
    border-radius: 12px;
    background: #fff;
    color: #33436f;
    padding: 0 14px;
    font-weight: 700;
  }
  .welcome-order-progress {
    height: 3px;
    margin-top: 14px;
    overflow: hidden;
    border-radius: 999px;
    background: #eef0f5;
  }
  .welcome-order-progress > span {
    display: block;
    width: 100%;
    height: 100%;
    transform-origin: left center;
    background: #d5aa3e;
  }

  .catalog-filter-bar { display:grid; gap:10px; margin-bottom:18px; padding:12px; border:1px solid #e3e5ed; border-radius:14px; background:#fff; }
  .catalog-filter-bar label { display:block; margin-bottom:4px; font-size:11px; font-weight:700; color:#52618a; }
  .catalog-filter-bar select { width:100%; min-height:44px; border:1px solid #ccd2e2; border-radius:10px; background:#fff; padding:0 10px; color:#1d2857; font-size:13px; }
  @media (min-width:640px) { .catalog-filter-bar { grid-template-columns:repeat(3,minmax(0,1fr)); } }
  .availability-chip,.new-product-badge,.low-stock-badge { display:inline-flex; align-items:center; border-radius:999px; padding:4px 8px; font-size:10px; font-weight:700; line-height:1; }
  .availability-ready { background:#ecfdf3; color:#166534; border:1px solid #bbf7d0; }
  .availability-order { background:#fff8e6; color:#8b6711; border:1px solid #efd99b; }
  .availability-sold { background:#fff1f2; color:#b42318; border:1px solid #fecdd3; }
  .new-product-badge { background:#eef2ff; color:#3730a3; border:1px solid #c7d2fe; }
  .low-stock-badge { background:#fff7ed; color:#9a3412; border:1px solid #fed7aa; }
  .recently-viewed-row { display:flex; gap:10px; overflow-x:auto; padding-bottom:4px; -webkit-overflow-scrolling:touch; }
  .recently-viewed-card { flex:0 0 150px; border:1px solid #e4e6ee; border-radius:12px; background:#fff; overflow:hidden; text-align:left; }
  .recently-viewed-card img { width:100%; aspect-ratio:1/1; object-fit:contain; background:#f8f6ef; }
  .catalog-skeleton { min-height:100vh; background:#faf8f1; }
  .skeleton-bar,.skeleton-card {
    background:linear-gradient(90deg,#f1efe8 25%,#faf9f5 37%,#f1efe8 63%);
    background-size:400% 100%; animation:skeleton-shimmer 1.25s ease-in-out infinite;
  }
  @keyframes skeleton-shimmer { 0%{background-position:100% 0} 100%{background-position:0 0} }
  @media (prefers-reduced-motion:reduce) { .skeleton-bar,.skeleton-card{animation:none} }
  .about-store-card { border:1px solid #e3dfd2; border-radius:16px; background:#fffdf8; padding:18px; box-shadow:0 5px 18px rgba(0,24,104,.05); }
  .about-store-card p { line-height:1.65; }
  .back-to-top-btn {
    position:fixed; right:16px; bottom:86px; z-index:19; width:46px; height:46px; border-radius:999px;
    background:#001868; color:#fff; border:1px solid rgba(255,255,255,.2); box-shadow:0 6px 18px rgba(0,0,0,.18);
    display:none; align-items:center; justify-content:center; font-size:20px; font-weight:800;
  }
  .back-to-top-btn.is-visible { display:flex; }
  .install-catalog-btn { min-height:44px; border:1px solid #d5aa3e; border-radius:999px; padding:8px 14px; background:#fff8e6; color:#001868; font-weight:700; font-size:12px; }
  .empty-search-help { margin-top:10px; font-size:12px; color:#52618a; }

  .cart-restored-note { margin-bottom:14px; border:1px solid #b7dfc2; border-radius:12px; background:#f0fbf3; padding:10px 12px; color:#166534; font-size:12px; }
  .share-product-btn { min-height:44px; border:1px solid #ccd2e2; border-radius:10px; background:#fff; color:#33436f; padding:0 12px; font-size:12px; font-weight:700; }

  .share-menu-overlay {
    position:fixed; inset:0; z-index:105; display:flex; align-items:center; justify-content:center;
    padding:18px; background:rgba(0,12,55,.48);
  }
  .share-menu-card {
    position:relative; width:100%; max-width:360px; border:1px solid #e1e3ec;
    border-radius:18px; background:#fff; padding:18px; box-shadow:0 20px 60px rgba(0,0,0,.28);
  }
  .share-menu-close {
    position:absolute; top:10px; right:10px; width:42px; height:42px;
    border-radius:999px; background:#f5f6fa; color:#001868; font-size:22px; font-weight:700;
  }
  .share-menu-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:16px; }
  .share-menu-option {
    min-height:52px; border:1px solid #d9dce8; border-radius:12px; background:#fff;
    color:#1d2857; padding:8px 10px; font-size:13px; font-weight:700; text-align:center;
  }
  .share-menu-option:hover { background:#f8f6ef; }
  .share-menu-note { margin-top:10px; font-size:11px; line-height:1.4; color:#667085; }
  .footer-faq details { border-top:1px solid #e5e7ee; padding:10px 0; text-align:left; }
  .footer-faq summary { cursor:pointer; font-weight:700; color:#1d2857; }
  .footer-faq p { margin-top:6px; line-height:1.5; color:#52618a; }
  .custom-order-footer-btn { display:inline-flex; min-height:44px; align-items:center; justify-content:center; border-radius:10px; background:#001868; color:#fff; padding:0 14px; font-weight:700; }
  html[data-contrast="high"] body { background:#fff !important; color:#000 !important; }
  html[data-contrast="high"] .text-navy-300,
  html[data-contrast="high"] .text-navy-400,
  html[data-contrast="high"] .text-navy-500,
  html[data-contrast="high"] .text-navy-600 { color:#111827 !important; }
  html[data-contrast="high"] input,
  html[data-contrast="high"] select,
  html[data-contrast="high"] textarea,
  html[data-contrast="high"] button { border-color:#111827; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { scroll-behavior:auto !important; animation-duration:.001ms !important; animation-iteration-count:1 !important; transition-duration:.001ms !important; }
  }
  .checkout-step-badge {
    display: inline-flex;
    width: 26px;
    height: 26px;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: #001868;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    margin-right: 7px;
  }
  @media (min-width: 640px) {
    .help-guide-overlay { align-items: center; }
    .help-guide-dialog { border-radius: 18px; }
  }
  @media (max-width: 639px) {
    .featured-carousel-wrap { overflow-x: auto !important; -webkit-overflow-scrolling: touch; }
    .featured-carousel-track { animation: none !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .featured-carousel-track { animation: none !important; }
  }
  @media (max-width: 420px) {
    .shopping-guide-steps { grid-template-columns: 1fr; }
    .shopping-guide-step { display: flex; align-items: center; gap: 9px; text-align: left; }
    .shopping-guide-number { margin: 0; flex: 0 0 28px; }
    .variant-choice-grid { grid-template-columns: 1fr; }
  }
</style>
</head>
<body class="bg-cream-50 text-navy-900 min-h-screen pb-24">
<div id="app"></div>

<div id="welcome-order-overlay" class="welcome-order-overlay" role="dialog" aria-modal="true" aria-labelledby="welcome-order-title" aria-describedby="welcome-order-text">
  <div class="welcome-order-card" tabindex="-1">
    <button id="welcome-order-close-x" type="button" class="welcome-order-close-x" aria-label="Fechar janela">×</button>
    <span class="welcome-order-kicker">Pedidos personalizados</span>
    <h2 id="welcome-order-title" class="mt-3 pr-10 text-xl font-semibold text-navy-900">Não encontrou o que procura?</h2>
    <p id="welcome-order-text" class="mt-2 text-sm leading-relaxed text-navy-600">
      A Luz Mariana também faz encomendas e pedidos personalizados. Se procura outro modelo, santo, cor, tamanho ou uma peça especial, fale conosco para solicitar um orçamento.
    </p>
    <div class="welcome-order-actions">
      <button id="welcome-order-whatsapp" type="button" class="welcome-order-primary">Solicitar orçamento pelo WhatsApp</button>
      <button id="welcome-order-close-btn" type="button" class="welcome-order-secondary">Fechar janela</button>
    </div>
    <div class="welcome-order-progress" aria-hidden="true"><span id="welcome-order-progress-bar"></span></div>
  </div>
</div>

<button id="help-guide-btn" class="help-guide-btn" type="button" aria-haspopup="dialog" aria-controls="help-guide-overlay">
  Como comprar?
</button>
<div id="help-guide-overlay" class="help-guide-overlay" role="dialog" aria-modal="true" aria-labelledby="help-guide-title">
  <div class="help-guide-dialog" tabindex="-1">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 id="help-guide-title" class="text-xl font-semibold text-navy-900">Como comprar na Luz Mariana</h2>
        <p class="mt-1 text-sm text-navy-500">É simples. Você monta o pedido aqui e, no final, nós abrimos o WhatsApp com tudo pronto.</p>
      </div>
      <button id="help-guide-close" type="button" aria-label="Fechar ajuda" class="rounded-lg px-3 py-2 text-xl text-navy-500">✕</button>
    </div>
    <div class="mt-3">
      <div class="help-step-row"><span class="help-step-icon">1</span><div><p class="font-semibold text-navy-900">Encontre o produto</p><p class="mt-0.5 text-sm text-navy-500">Use a busca ou as categorias. Toque na foto do produto para ver os detalhes.</p></div></div>
      <div class="help-step-row"><span class="help-step-icon">2</span><div><p class="font-semibold text-navy-900">Escolha o modelo</p><p class="mt-0.5 text-sm text-navy-500">Quando houver cores ou modelos, eles aparecem em botões grandes com foto e nome.</p></div></div>
      <div class="help-step-row"><span class="help-step-icon">3</span><div><p class="font-semibold text-navy-900">Adicione ao pedido</p><p class="mt-0.5 text-sm text-navy-500">Toque em “Adicionar ao pedido”. A barra na parte de baixo mostra quantos itens você escolheu.</p></div></div>
      <div class="help-step-row"><span class="help-step-icon">4</span><div><p class="font-semibold text-navy-900">Revise e continue</p><p class="mt-0.5 text-sm text-navy-500">Abra “Ver meu pedido”, confira os itens e toque em “Continuar”.</p></div></div>
      <div class="help-step-row"><span class="help-step-icon">5</span><div><p class="font-semibold text-navy-900">Envie pelo WhatsApp</p><p class="mt-0.5 text-sm text-navy-500">Preencha seu nome e WhatsApp. No final, o WhatsApp abre com a mensagem do pedido pronta — basta apertar “Enviar”.</p></div></div>
    </div>
    <button id="help-guide-done" type="button" class="large-touch-action mt-3 w-full rounded-lg bg-gold-500 px-4 py-3 font-semibold text-navy-900">Entendi, quero comprar</button>
    <button id="help-guide-whatsapp" type="button" class="large-touch-action mt-2 w-full rounded-lg border border-navy-200 bg-white px-4 py-3 font-semibold text-navy-700">Ainda preciso de ajuda pelo WhatsApp</button>
  </div>
</div>

<script>
/* =====================================================================
   CONFIGURAÇÃO — mesmos dados do Supabase usados no index.html, mais o
   número de WhatsApp da loja (só números, com código do país e DDD,
   ex.: 55 11 91234-5678 vira "5511912345678").
   ===================================================================== */
const SUPABASE_URL = "https://xgcsdpqaqxstcfwgwaxw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnY3NkcHFhcXhzdGNmd2d3YXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MDE3MTQsImV4cCI6MjEwMjM3NzcxNH0.WFYm2q4ljkQMRiaQzhJ-yf01wj80xsO0ykmH7jhtUoo";
const STORE_WHATSAPP_NUMBER = "5584991263907";
const STORE_CNPJ = "68.615.746/0001-43";
const STORE_ORIGIN_CEP = "59280670";
const STORE_ORIGIN_ADDRESS = "Rua Alice Medeiros, São José, Macaíba-RN";
const LOCAL_DELIVERY_RADIUS_KM = 15;
const REDUCED_DELIVERY_RADIUS_KM = 5;
const REDUCED_DELIVERY_RATE_PER_KM = 1.50;
const STANDARD_DELIVERY_RATE_PER_KM = 1.80;

// Mostrado nos produtos que não estão marcados como "Em estoque" no
// painel admin (a maioria — são feitos sob encomenda). Cada produto pode
// ter seu próprio prazo (dias ÚTEIS, sem contar sábado/domingo),
// configurado no Painel Admin — quando não tem nada configurado (produto
// antigo, de antes dessa opção existir), usa o padrão de 2 dias úteis.
const DEFAULT_LEAD_TIME_DAYS = 2;
function madeToOrderText(product) {
  const days = product && product.lead_time_days != null ? Number(product.lead_time_days) : DEFAULT_LEAD_TIME_DAYS;
  return `Produção em até ${days} dia${days === 1 ? "" : "s"} útil${days === 1 ? "" : "eis"}, contados a partir da confirmação do pedido.`;
}
// Sinal exigido pra confirmar o pedido e iniciar a produção.
const DEPOSIT_RATE = 0.5;

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function formatBRL(v) {
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------------------------------------------------------------------
   Telefone/WhatsApp — sempre com o +55 na frente.

   Números locais (DDD + número) têm 10 ou 11 dígitos; com o "55" do
   Brasil na frente ficam com 12 ou 13. É por isso (tamanho, não só
   "já começa com 55") que a gente decide se falta adicionar o código
   do país — assim não erra em DDDs que também começam com 55, tipo
   Santa Maria/RS (ex: um número local "55 99988-7766" vira
   "55 55 99988-7766", com o país e o DDD, e não fica faltando o país).
   --------------------------------------------------------------------- */
function normalizeBrPhoneDigits(raw) {
  const digits = String(raw ?? "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10 || digits.length === 11) return "55" + digits;
  return digits;
}
function formatWhatsappBR(raw) {
  const digits = normalizeBrPhoneDigits(raw);
  if (!digits) return "";
  const cc = digits.slice(0, 2);
  const rest = digits.slice(2);
  const area = rest.slice(0, 2);
  const num = rest.slice(2);
  if (num.length === 9) return `+${cc} (${area}) ${num.slice(0, 5)}-${num.slice(5)}`;
  if (num.length === 8) return `+${cc} (${area}) ${num.slice(0, 4)}-${num.slice(4)}`;
  return `+${cc} ${rest}`; // formato inesperado: ainda garante o +55 na frente
}

const app = document.getElementById("app");

const FONT_SIZE_PREF_KEY = "luzmariana_font_size_v1";
const PAYMENT_PREF_KEY = "luzmariana_payment_v1";
const CONTRAST_PREF_KEY = "luzmariana_contrast_v1";
const RECENT_PRODUCTS_KEY = "luzmariana_recent_products_v1";
const CART_RESTORED_SESSION_KEY = "luzmariana_cart_restored_seen_v1";
const SAVED_ADDRESS_KEY = "luzmariana_saved_delivery_address_v1";

function loadFontSizePreference() {
  try { return localStorage.getItem(FONT_SIZE_PREF_KEY) === "large" ? "large" : "normal"; }
  catch (_err) { return "normal"; }
}
function applyFontSizePreference(value) {
  const size = value === "large" ? "large" : "normal";
  document.documentElement.dataset.fontSize = size;
  try { localStorage.setItem(FONT_SIZE_PREF_KEY, size); } catch (_err) {}
}
function toggleFontSizePreference() {
  const next = document.documentElement.dataset.fontSize === "large" ? "normal" : "large";
  applyFontSizePreference(next);
  render();
}
function loadPaymentPreference() {
  try {
    const value = localStorage.getItem(PAYMENT_PREF_KEY);
    return value === "credito" ? "credito" : "pix";
  } catch (_err) { return "pix"; }
}
function savePaymentPreference(value) {
  try { localStorage.setItem(PAYMENT_PREF_KEY, value === "credito" ? "credito" : "pix"); } catch (_err) {}
}
function loadContrastPreference() {
  try { return localStorage.getItem(CONTRAST_PREF_KEY) === "high" ? "high" : "normal"; } catch (_err) { return "normal"; }
}
function applyContrastPreference(value) {
  const mode = value === "high" ? "high" : "normal";
  document.documentElement.dataset.contrast = mode;
  try { localStorage.setItem(CONTRAST_PREF_KEY, mode); } catch (_err) {}
}
function toggleContrastPreference() {
  applyContrastPreference(document.documentElement.dataset.contrast === "high" ? "normal" : "high");
  render();
}
function trackEvent(name, params = {}) {
  try { if (typeof gtag === "function") gtag("event", name, params); } catch (_err) {}
}
function loadRecentlyViewedIds() {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_PRODUCTS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch (_err) { return []; }
}
function addRecentlyViewed(productId) {
  if (!productId) return;
  const ids = loadRecentlyViewedIds().filter((id) => String(id) !== String(productId));
  ids.unshift(productId);
  try { localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(ids.slice(0, 8))); } catch (_err) {}
}
function slugifyUrl(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findProductByUrlValue(value) {
  if (!value) return null;
  return state.products.find((p) =>
    String(p.id) === String(value) ||
    slugifyUrl(p.name) === String(value)
  ) || null;
}

function findVariantByUrlValue(productId, value) {
  if (!value) return null;
  return variantsFor(productId).find((v) =>
    String(v.id) === String(value) ||
    slugifyUrl(v.name) === String(value)
  ) || null;
}

function productShareUrl(productId, variantId = null) {
  const product = state.products.find((p) => String(p.id) === String(productId));
  const variant = variantId ? variantsFor(productId).find((v) => String(v.id) === String(variantId)) : null;

  const url = new URL(CATALOG_BASE_URL);
  url.searchParams.set("produto", product ? slugifyUrl(product.name) : String(productId));
  if (variantId) url.searchParams.set("modelo", variant ? slugifyUrl(variant.name) : String(variantId));
  return url.toString();
}

function productSocialShareUrl(productId, variantId = null) {
  const product = state.products.find((p) => String(p.id) === String(productId));
  const variant = variantId ? variantsFor(productId).find((v) => String(v.id) === String(variantId)) : null;
  const productPart = encodeURIComponent(product ? slugifyUrl(product.name) : String(productId));

  if (variantId) {
    const variantPart = encodeURIComponent(variant ? slugifyUrl(variant.name) : String(variantId));
    return `${CATALOG_BASE_URL}share/${productPart}/${variantPart}/`;
  }
  return `${CATALOG_BASE_URL}share/${productPart}/`;
}
function syncProductUrl(productId, push = true) {
  const url = new URL(window.location.href);
  if (productId) url.searchParams.set("produto", productId);
  else url.searchParams.delete("produto");
  history[push ? "pushState" : "replaceState"]({ productId: productId || null }, "", url);
}

function updateDynamicShareMeta(product = null, variant = null) {
  const baseTitle = "Luz Mariana - Loja Virtual";
  const baseDescription = "Catálogo de artigos religiosos — Luz Mariana";
  const fallbackImage = `${CATALOG_BASE_URL}og-image.jpg`;

  const selected = product ? (variant || bestSellingVariant(product.id)) : null;
  const title = product ? `${product.name}${selected?.name ? ` — ${selected.name}` : ""} | Luz Mariana` : baseTitle;
  const description = product
    ? `${product.name}${selected?.name ? ` — ${selected.name}` : ""} disponível na Luz Mariana.`
    : baseDescription;

  // Importante: não usamos URL de imagem do Supabase nos metadados sociais.
  // Mantemos uma imagem estática hospedada junto do catálogo.
  const image = fallbackImage;
  const url = product ? productShareUrl(product.id, selected?.id || null) : CATALOG_BASE_URL;

  document.title = title;

  const setMeta = (selector, attrName, attrValue) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attrName, attrValue);
  };

  setMeta('meta[name="description"]', "content", description);
  setMeta('meta[property="og:title"]', "content", title);
  setMeta('meta[property="og:description"]', "content", description);
  setMeta('meta[property="og:url"]', "content", url);
  setMeta('meta[property="og:image"]', "content", image);
  setMeta('meta[property="og:image:secure_url"]', "content", image);
  setMeta('meta[name="twitter:title"]', "content", title);
  setMeta('meta[name="twitter:description"]', "content", description);
  setMeta('meta[name="twitter:image"]', "content", image);
}
function stockQuantity(entity) {
  const value = entity?.stock_quantity ?? entity?.stock_qty ?? entity?.quantity_in_stock ?? entity?.available_quantity;
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
function isNewProduct(product) {
  if (!product?.created_at) return false;
  const created = new Date(product.created_at);
  if (Number.isNaN(created.getTime())) return false;
  return (Date.now() - created.getTime()) <= 30 * 24 * 60 * 60 * 1000;
}
function productAvailabilityFlags(product) {
  const variants = variantsFor(product.id);
  if (variants.length) return {
    ready: variants.some((v) => !v.esgotado && !!v.in_stock),
    order: variants.some((v) => !v.esgotado && !v.in_stock),
    sold: variants.every((v) => !!v.esgotado),
  };
  return { ready: !product.esgotado && !!product.in_stock, order: !product.esgotado && !product.in_stock, sold: !!product.esgotado };
}
function productMinPixPrice(product) { return Number(pricingSummary(product).promoPrice || 0); }
applyFontSizePreference(loadFontSizePreference());
applyContrastPreference("normal");

function formatPhoneInputMask(raw) {
  let digits = String(raw || "").replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length > 11) digits = digits.slice(2);
  digits = digits.slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  if (rest.length <= 8) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

function addBusinessDays(date, days) {
  const d = new Date(date);
  let remaining = Math.max(0, Number(days) || 0);
  while (remaining > 0) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return d;
}

function estimatedReadyDate(product) {
  const days = product && product.lead_time_days != null ? Number(product.lead_time_days) : DEFAULT_LEAD_TIME_DAYS;
  const date = addBusinessDays(new Date(), days);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

/* =====================================================================
   CARRINHO PERSISTENTE (localStorage)
   ===================================================================== */
// Sem isso, o carrinho vivia só na memória (state) e sumia se a pessoa
// atualizasse a página, saísse e voltasse, ou o navegador do celular
// recarregasse a aba em segundo plano (comum no iOS) — carrinho abandonado
// por acidente, não por desistência de verdade. Guardado só o objeto
// {chave: quantidade}; os dados do produto em si (nome, foto, preço)
// sempre vêm frescos do banco a cada carregamento, nunca do localStorage.
const CART_STORAGE_KEY = "luzmariana_cart_v1";

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    // Só aceita entradas com quantidade numérica positiva — protege contra
    // um localStorage corrompido/editado à mão quebrar o carrinho inteiro.
    const cleaned = {};
    Object.entries(parsed).forEach(([key, qty]) => {
      const n = Number(qty);
      if (typeof key === "string" && Number.isFinite(n) && n > 0) cleaned[key] = n;
    });
    return cleaned;
  } catch (err) {
    console.error("Não foi possível ler o carrinho salvo:", err);
    return {};
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
  } catch (err) {
    // Modo privado, storage cheio/bloqueado, etc. — o carrinho continua
    // funcionando normalmente na sessão atual, só não persiste entre visitas.
    console.error("Não foi possível salvar o carrinho:", err);
  }
}

/* Remove do carrinho qualquer item cujo produto (ou modelo) não existe
   mais no catálogo atual — evita que o contador do carrinho fique
   "errado" (contando algo que nunca vai aparecer na gaveta porque o
   produto foi excluído/despublicado desde a última visita). */
function pruneStaleCartItems() {
  let changed = false;
  Object.keys(state.cart).forEach((key) => {
    const { productId, variantId } = parseCartKey(key);
    const product = state.products.find((p) => p.id === productId);
    const variantOk = !variantId || variantsFor(productId).some((v) => v.id === variantId);
    if (!product || !variantOk) { delete state.cart[key]; changed = true; }
  });
  if (changed) saveCartToStorage();
}

/* =====================================================================
   FAVORITOS/LISTA DE DESEJOS (localStorage) — mesma lógica do carrinho:
   guarda só os IDs marcados (nada de dados de produto), pra sempre valer
   o que está no banco na hora de mostrar. É por navegador/aparelho, não
   por conta — não existe login de cliente neste catálogo.
   ===================================================================== */
const FAVORITES_STORAGE_KEY = "luzmariana_favorites_v1";

function loadFavoritesFromStorage() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const cleaned = {};
    Object.keys(parsed).forEach((key) => { if (parsed[key] === true) cleaned[key] = true; });
    return cleaned;
  } catch (err) {
    console.error("Não foi possível ler os favoritos salvos:", err);
    return {};
  }
}

function saveFavoritesToStorage() {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state.favorites));
  } catch (err) {
    console.error("Não foi possível salvar os favoritos:", err);
  }
}

function pruneStaleFavorites() {
  let changed = false;
  Object.keys(state.favorites).forEach((productId) => {
    if (!state.products.some((p) => p.id === productId)) { delete state.favorites[productId]; changed = true; }
  });
  if (changed) saveFavoritesToStorage();
}

function toggleFavorite(productId) {
  if (state.favorites[productId]) delete state.favorites[productId];
  else state.favorites[productId] = true;
  saveFavoritesToStorage();
  render();
}

const state = {
  loading: true,
  loadError: null,
  products: [],
  variantsByProduct: {}, // { [product_id]: [{id, name, photo_url, sort_order}, ...] }
  photosByProduct: {}, // { [product_id]: [{id, url, sort_order}, ...] } — fotos extras da galeria, além da foto de capa
  cart: loadCartFromStorage(), // { [cartKey]: quantity } — cartKey é o product_id, ou "product_id::variant_id" quando tem modelo escolhido
  favorites: loadFavoritesFromStorage(), // { [product_id]: true } — lista de desejos, salva só no aparelho
  favoritesOnly: false, // filtro "❤ Favoritos" ativado na barra de categorias
  selectedVariant: {}, // { [product_id]: variant_id } — modelo escolhido na página individual do produto
  cardPhotoIndex: {}, // { [product_id]: index } — foto do modelo exibida agora no carrossel automático do card
  detailProductId: null, // produto aberto na página individual
  detailGalleryIndex: 0, // qual foto da galeria está em destaque na página do produto (0 = foto de capa)
  payment: loadPaymentPreference(), // pix | credito
  categoryFilter: "all",
  searchQuery: "", // texto digitado na busca do catálogo (filtra por nome/descrição/categoria/material)
  availabilityFilter: "all",
  priceFilter: "all",
  sortMode: "featured",
  cartRestoredNotice: false,
  cartOpen: false,
  screen: "catalog", // catalog | product | checkout | success | policy | storepolicy | track
  policyTab: "privacidade", // privacidade | termos — qual aba mostrar na tela de política/termos
  lastOrderNumber: null, // Nº do pedido que acabou de ser feito nesta sessão (pra oferecer "Acompanhar meu pedido" na tela de sucesso)
  lastOrderWhatsapp: "", // WhatsApp usado nesse último pedido — pré-preenche o rastreio
  trackWhatsapp: "", // WhatsApp digitado na tela de Rastrear pedido
  trackLoading: false,
  trackError: null, // mensagem de erro/"não encontrado" da última busca
  trackResults: null, // lista de pedidos encontrados pra esse WhatsApp na última busca (ou null antes de buscar)
  reviewForm: { rating: 0, name: "", comment: "", submitting: false, submitted: false, error: null }, // formulário de "deixar avaliação" na página do produto
  submitting: false,
  submitError: null,
  giftWrapOptions: [], // opções de embalagem de presente disponíveis (catalog_gift_wrap_options)
  giftWrapWanted: false,
  giftWrapQuantities: {}, // { [material_id]: quantidade } — dá pra escolher mais de uma embalagem (ou mais de uma unidade da mesma)
  couponCode: "", // último código de cupom digitado (só pra manter o campo preenchido entre re-renders)
  appliedCoupon: null, // { id, code, discount_type, discount_value, max_discount_amount, validatedWhatsappDigits } — null se nenhum cupom aplicado
  checkoutDraft: {
    name: "", whatsapp: "", instagram: "", notes: "",
    shippingCep: "", shippingStreet: "", shippingNumber: "",
    shippingNeighborhood: "", shippingCity: "", shippingState: "",
    shippingComplement: ""
  },
  shippingMethod: "pickup",
  shippingAddressMode: "cep", // cep | manual
  shippingQuote: null,
  shippingQuoteStale: false,
  saveShippingAddress: false,
  checkoutStage: "review",
  checkoutSubmitted: false,
  catalogScrollY: 0,
  variantScrollLeft: {},
};

/* ---------------------------------------------------------------------
   Acessibilidade do carrinho (gaveta lateral): fecha com Esc, mantém o
   foco preso dentro dela enquanto aberta (Tab não escapa pra trás do
   catálogo) e devolve o foco pra quem abriu quando ela fecha — do jeito
   que um "dialog" modal deve se comportar pra quem navega só pelo
   teclado ou usa leitor de tela. cartWasOpenLastRender existe só pra
   saber quando é uma transição fechado→aberto (e mover o foco pra
   dentro da gaveta só nesse momento — não a cada re-render, senão
   digitar/clicar em qualquer coisa lá dentro puxaria o foco de volta
   toda hora).
   --------------------------------------------------------------------- */
let cartWasOpenLastRender = false;

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && state.cartOpen) {
    state.cartOpen = false;
    render();
  }
});

function manageCartFocus() {
  const panel = document.getElementById("cart-drawer-panel");
  if (state.cartOpen && !cartWasOpenLastRender) {
    if (panel) panel.focus();
  } else if (!state.cartOpen && cartWasOpenLastRender) {
    // Devolve o foco pro botão "Ver carrinho" (mesmo id nas duas telas
    // que usam a gaveta) — busca por id de novo em vez de guardar a
    // referência antiga, porque o render() troca o elemento inteiro
    // (a referência velha fica "morta", presa fora do DOM).
    document.getElementById("open-cart-btn")?.focus();
  }
  cartWasOpenLastRender = state.cartOpen;

  if (panel && !panel.dataset.focusTrapWired) {
    panel.dataset.focusTrapWired = "1";
    panel.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const focusable = [...panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
        .filter((el) => !el.disabled && el.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }
}

async function loadCatalog() {
  state.loadError = null;
  const [{ data: products, error: prodError }, { data: variants, error: varError }, { data: giftWrapOptions, error: giftWrapError }, { data: reviews, error: reviewsError }, { data: photos, error: photosError }] = await Promise.all([
    supabaseClient.from("catalog_products").select("*").order("category", { ascending: true, nullsFirst: false }).order("name"),
    supabaseClient.from("catalog_product_variants").select("*").order("sort_order", { ascending: true }).order("name"),
    supabaseClient.from("catalog_gift_wrap_options").select("*").order("name"),
    supabaseClient.from("catalog_product_reviews").select("*").order("created_at", { ascending: false }),
    supabaseClient.from("catalog_product_photos").select("*").order("sort_order", { ascending: true }),
  ]);
  if (prodError) { state.loadError = prodError.message; state.loading = false; render(); return; }
  state.products = products;
  state.variantsByProduct = {};
  (variants || []).forEach((v) => {
    if (!state.variantsByProduct[v.product_id]) state.variantsByProduct[v.product_id] = [];
    state.variantsByProduct[v.product_id].push(v);
  });
  state.photosByProduct = {};
  (photos || []).forEach((p) => {
    if (!state.photosByProduct[p.product_id]) state.photosByProduct[p.product_id] = [];
    state.photosByProduct[p.product_id].push(p);
  });
  if (varError) console.error("Erro ao carregar modelos/variações:", varError.message);
  if (giftWrapError) console.error("Erro ao carregar opções de embalagem:", giftWrapError.message);
  if (reviewsError) console.error("Erro ao carregar avaliações:", reviewsError.message);
  if (photosError) console.error("Erro ao carregar galeria de fotos:", photosError.message);
  state.giftWrapOptions = giftWrapOptions || [];
  state.reviews = reviews || [];
  pruneStaleCartItems();
  pruneStaleFavorites();

  const currentUrl = new URL(window.location.href);
  const directProductValue = currentUrl.searchParams.get("produto");
  const directVariantValue = currentUrl.searchParams.get("modelo");
  const directProduct = findProductByUrlValue(directProductValue);
  if (directProduct) {
    state.screen = "product";
    state.detailProductId = directProduct.id;
    const directVariant = findVariantByUrlValue(directProduct.id, directVariantValue);
    if (directVariant) {
      state.selectedVariant[directProduct.id] = directVariant.id;
    }
  }
  try {
    const seen = sessionStorage.getItem(CART_RESTORED_SESSION_KEY) === "1";
    state.cartRestoredNotice = cartCount() > 0 && !seen;
  } catch (_err) { state.cartRestoredNotice = false; }

  state.loading = false;
  render();
  updateProductJsonLd();
}

// URL canônica do catálogo (usada nas tags Open Graph também, lá no
// <head>) — repetida aqui porque o JSON-LD é montado via JS, depois que
// os produtos chegam do Supabase.
const CATALOG_BASE_URL = "https://lojaluzmariana.github.io/catalogo/";

/* Dados estruturados (JSON-LD, schema.org) pro Google conseguir mostrar
   preço e disponibilidade direto no resultado de busca ("rich
   snippet"). Como o catálogo é uma página só (sem endereço próprio por
   produto), todo Offer aponta pra mesma URL — não dá pra linkar direto
   pro produto específico, mas o Google ainda consegue ler preço/estoque
   associados à página. Refeito do zero a cada loadCatalog() (por isso
   remove o <script> antigo antes de montar o novo, ao trocar de sessão
   ou recarregar os dados). */
function updateProductJsonLd() {
  const existingScript = document.getElementById("product-jsonld");
  if (existingScript) existingScript.remove();
  if (!state.products || state.products.length === 0) return;

  const items = state.products.map((p, idx) => {
    const photos = productGalleryPhotos(p, null).filter(Boolean);
    const price = Number(p.promo_price ?? p.credit_price ?? 0);
    const product = {
      "@type": "Product",
      name: p.name,
      ...(p.description ? { description: p.description } : {}),
      ...(photos.length > 0 ? { image: photos } : {}),
      ...(p.category ? { category: p.category } : {}),
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        price: price.toFixed(2),
        availability: isSoldOut(p) ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        url: CATALOG_BASE_URL,
      },
    };
    return { "@type": "ListItem", position: idx + 1, item: product };
  });

  const jsonLd = { "@context": "https://schema.org", "@type": "ItemList", itemListElement: items };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "product-jsonld";
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
}

/* Avaliações aprovadas de um produto, mais recentes primeiro (já vêm
   ordenadas assim de loadCatalog). Média arredondada pra 1 casa. */
function reviewsFor(productId) {
  return state.reviews.filter((r) => r.product_id === productId);
}
function averageRating(reviews) {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;
}
// ★ preenchidas até a nota (arredondada), ☆ vazias no resto.
function starDisplayCatalog(rating) {
  const n = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return "★".repeat(n) + "☆".repeat(5 - n);
}

/* Modelos/variações de um produto (vazio se não tiver). Os esgotados vão
   pro final da lista — assim o modelo escolhido por padrão (o primeiro),
   tanto no dropdown quanto no carrossel de fotos do card, é sempre um que
   ainda dá pra comprar, sempre que sobrar algum disponível. Sem isso, se
   o primeiro modelo cadastrado fosse justamente o que acabou, o card
   parecia com o produto inteiro esgotado mesmo tendo outros disponíveis. */
function variantsFor(productId) {
  const list = state.variantsByProduct[productId] || [];
  const statusRank = (v) => v.esgotado ? 2 : (v.in_stock ? 0 : 1);
  return [...list].sort((a, b) => {
    const statusDiff = statusRank(a) - statusRank(b);
    if (statusDiff !== 0) return statusDiff;
    const orderDiff = Number(a.sort_order ?? 9999) - Number(b.sort_order ?? 9999);
    if (orderDiff !== 0) return orderDiff;
    return String(a.name || "").localeCompare(String(b.name || ""), "pt-BR");
  });
}

/* Lista de fotos pra mostrar na página do produto: a foto "de capa" (do
   modelo escolhido, se tiver, senão a do produto) primeiro, seguida das
   fotos extras da galeria (essas são sempre do produto, não variam por
   modelo). Sem duplicar se a foto de capa aparecer de novo na galeria. */
function productGalleryPhotos(product, variant) {
  const coverUrl = variant?.photo_url || product.photo_url;
  const extra = (state.photosByProduct[product.id] || []).map((p) => p.url).filter((url) => url && url !== coverUrl);
  const all = coverUrl ? [coverUrl, ...extra] : extra;
  return all;
}

/* Modelo atualmente escolhido no card desse produto (o primeiro, por padrão). */
function currentVariant(product) {
  const variants = variantsFor(product.id);
  if (variants.length === 0) return null;
  const selectedId = state.selectedVariant[product.id];
  return variants.find((v) => v.id === selectedId) || null;
}

function variantUnitsSold(variant) {
  return Number(
    variant?.units_sold
    ?? variant?.unitsSold
    ?? variant?.sales_count
    ?? variant?.sold_count
    ?? variant?.total_sold
    ?? 0
  ) || 0;
}

function bestSellingVariant(productId) {
  const variants = variantsFor(productId);
  if (variants.length === 0) return null;
  const withScore = [...variants].sort((a, b) => {
    const soldDiff = variantUnitsSold(b) - variantUnitsSold(a);
    if (soldDiff !== 0) return soldDiff;
    const photoDiff = Number(!!b.photo_url) - Number(!!a.photo_url);
    if (photoDiff !== 0) return photoDiff;
    return String(a.name || '').localeCompare(String(b.name || ''), 'pt-BR');
  });
  return withScore[0] || null;
}

function previewVariantForDetail(product) {
  const selected = currentVariant(product);
  if (selected) return selected;
  const variants = variantsFor(product.id);
  if (!product.photo_url && variants.length > 1) return bestSellingVariant(product.id);
  return null;
}

function isBestSellingVariant(productId, variantId) {
  const best = bestSellingVariant(productId);
  return !!best && best.id === variantId;
}

/* Produto totalmente esgotado (não dá pra comprar de jeito nenhum agora):
   com modelos, só quando TODOS os modelos estão esgotados — se sobrar
   pelo menos um modelo disponível, o produto continua comprável e não
   conta como esgotado aqui. Sem modelos, usa o campo do produto direto. */
function isSoldOut(p) {
  const variants = variantsFor(p.id);
  if (variants.length > 0) return variants.every((v) => v.esgotado);
  return !!p.esgotado;
}

/* Chave usada no carrinho: junta produto + modelo (quando tiver) num só item. */
function cartKey(productId, variantId) {
  return variantId ? `${productId}::${variantId}` : productId;
}
function parseCartKey(key) {
  const [productId, variantId] = key.split("::");
  return { productId, variantId: variantId || null };
}

/* =====================================================================
   CARROSSEL AUTOMÁTICO DE FOTOS DOS MODELOS (nos cards)
   ===================================================================== */

/* Lista de fotos pra girar no card — só existe quando o produto tem mais
   de um modelo com foto (senão não tem o que "passar automaticamente"). */
function carouselFrames(product) {
  const variants = variantsFor(product.id);
  if (variants.length <= 1) return [];
  const orderedVariants = !product.photo_url && variants.length > 1
    ? [...variants].sort((a, b) => {
        const soldDiff = variantUnitsSold(b) - variantUnitsSold(a);
        if (soldDiff !== 0) return soldDiff;
        const photoDiff = Number(!!b.photo_url) - Number(!!a.photo_url);
        if (photoDiff !== 0) return photoDiff;
        return String(a.name || '').localeCompare(String(b.name || ''), 'pt-BR');
      })
    : variants;
  const frames = orderedVariants.map((v) => v.photo_url || product.photo_url).filter(Boolean);
  return frames.length > 1 ? frames : [];
}

function stepCarousel(productId, direction) {
  const product = state.products.find((p) => p.id === productId);
  if (!product) return;
  const frames = carouselFrames(product);
  if (frames.length === 0) return;
  const current = state.cardPhotoIndex[productId] ?? 0;
  const next = (((current + direction) % frames.length) + frames.length) % frames.length;
  state.cardPhotoIndex[productId] = next;
  // Troca a foto direto no elemento (sem re-renderizar a página toda) —
  // pode ter mais de um card do mesmo produto na tela (grid + destaques).
  document.querySelectorAll(`[data-carousel-img="${productId}"]`).forEach((img) => { img.src = frames[next]; });
}

let carouselTimers = {}; // { [product_id]: intervalId }

function startCarouselTimer(productId) {
  stopCarouselTimer(productId);
  carouselTimers[productId] = setInterval(() => stepCarousel(productId, 1), 3000);
}
function stopCarouselTimer(productId) {
  if (carouselTimers[productId]) {
    clearInterval(carouselTimers[productId]);
    delete carouselTimers[productId];
  }
}

/* Liga os carrosséis automáticos depois de cada render — reaproveita um
   timer só por produto mesmo se ele aparecer em mais de um card na tela
   (grid + carrossel de destaques), e pausa enquanto o dedo/mouse está
   em cima (pra não trocar a foto bem na hora que a pessoa for decidir). */
function setupCarousels() {
  // Para deixar a vitrine mais tranquila e previsível no celular, as fotos
  // não trocam sozinhas. O cliente usa as setas quando quiser ver os modelos.
  Object.keys(carouselTimers).forEach(stopCarouselTimer);
}

/* Normaliza texto pra comparação de busca: minúsculo + sem acento, pra
   "terço" bater com "terco" e vice-versa (comum digitar sem acento no
   celular). */
function normalizeSearch(str) {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/* Produto bate com a busca se o texto aparecer no nome, descrição,
   categoria ou material — assim "prata" acha tanto o produto chamado
   "Terço de Prata" quanto um com material_tag "Prata 925". */
const SEARCH_SYNONYM_GROUPS = [
  ["nossa senhora", "maezinha", "maria", "virgem maria", "madona"],
  ["aparecida", "nossa senhora aparecida", "maezinha aparecida"],
  ["imagem", "santo", "santinho", "estatua", "estatueta"],
  ["terco", "rosario", "dezena", "porta terco"],
  ["marca pagina", "marcador", "clip", "clips"],
  ["abajur", "luminaria", "luz", "led"],
  ["presente", "lembranca", "lembrancinha", "mimo"],
  ["sagrada familia", "familia", "jesus maria jose"],
  ["sao miguel", "miguel arcanjo", "arcanjo"],
  ["cruz", "crucifixo", "cristo na cruz", "jesus na cruz"],
  ["personalizado", "personalizada", "encomenda", "sob encomenda"]
];

function expandSearchTerms(query) {
  const q = normalizeSearch(query);
  if (!q) return [];
  const terms = new Set([q, ...q.split(/\s+/).filter((x) => x.length >= 2)]);
  SEARCH_SYNONYM_GROUPS.forEach((group) => {
    const normalizedGroup = group.map(normalizeSearch);
    if (normalizedGroup.some((term) => q.includes(term) || term.includes(q))) {
      normalizedGroup.forEach((term) => terms.add(term));
    }
  });
  return [...terms];
}

function productSearchHaystack(product) {
  const variants = variantsFor(product.id);
  return normalizeSearch([
    product.name, product.description, product.category, product.material_tag,
    ...variants.map((v) => v.name)
  ].filter(Boolean).join(" "));
}

function productMatchesSearch(product, query) {
  const q = normalizeSearch(query);
  if (!q) return true;
  const haystack = productSearchHaystack(product);
  if (haystack.includes(q)) return true;
  const terms = expandSearchTerms(q);
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length > 1 && words.every((word) => haystack.includes(word) || terms.some((t) => t.includes(word) && haystack.includes(t)))) return true;
  return terms.some((term) => term.length >= 3 && haystack.includes(term));
}

function renderSearchBar() {
  const q = normalizeSearch(state.searchQuery);
  const suggestions = q ? state.products.filter((p) => productMatchesSearch(p, state.searchQuery)).slice(0, 5) : [];
  return `
    <div class="mb-5">
      <div class="relative">
        <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 10-10.6 0 7.5 7.5 0 0010.6 0z" /></svg>
        <input id="catalog-search-input" type="text" inputmode="search" autocomplete="off"
          value="${escapeHtml(state.searchQuery)}"
          placeholder="Busque por santo, produto, ocasião... Ex.: Aparecida, presente, terço"
          aria-label="Buscar produto no catálogo"
          class="w-full rounded-full border border-navy-200 bg-white py-3 pl-9 pr-9 text-base text-navy-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200" />
        ${state.searchQuery ? `
          <button type="button" id="catalog-search-clear" aria-label="Limpar busca" class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-navy-300 hover:text-navy-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        ` : ""}
        ${suggestions.length > 0 ? `
          <div class="catalog-search-suggestions">
            ${suggestions.map((p) => {
              const v = bestSellingVariant(p.id);
              const photo = p.photo_url || v?.photo_url || "";
              return `<button type="button" class="catalog-search-suggestion" data-search-suggestion="${p.id}">
                ${photo ? `<img src="${photo}" alt="" />` : `<span class="flex h-[42px] w-[42px] items-center justify-center rounded-lg bg-cream-50">✦</span>`}
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-sm font-semibold">${escapeHtml(p.name)}</span>
                  <span class="block text-xs text-navy-400">${escapeHtml(p.category || "Produto")}</span>
                </span>
              </button>`;
            }).join("")}
          </div>
        ` : ""}
      </div>
    </div>
  `;
}

function groupByCategory(products) {
  const map = new Map();
  products.forEach((p) => {
    const key = p.category && p.category.trim() ? p.category.trim() : "Outros";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(p);
  });
  const keys = [...map.keys()].sort((a, b) => {
    if (a === "Outros") return b === "Outros" ? 0 : 1;
    if (b === "Outros") return -1;
    return a.localeCompare(b, "pt-BR");
  });
  return keys.map((key) => ({ category: key, products: map.get(key) }));
}

// Preço efetivo de um produto — usa o preço PRÓPRIO do modelo quando ele
// tiver sido calculado no Painel Admin (variant.credit_price/promo_price
// preenchidos, a partir do custo daquele modelo — o CUSTO em si nunca é
// exposto aqui no Catálogo, só o preço de venda já pronto), senão herda
// do produto (comportamento de sempre).
function effectivePricing(product, variant) {
  if (variant && variant.credit_price != null && variant.promo_price != null) {
    return { creditPrice: Number(variant.credit_price), promoPrice: Number(variant.promo_price) };
  }
  return { creditPrice: Number(product.credit_price), promoPrice: Number(product.promo_price) };
}

// Resumo de preços para produtos com modelos. No card mostramos “a partir de”
// quando os modelos têm valores diferentes, evitando que a pessoa pense que
// todos custam exatamente o valor do primeiro modelo da lista.
function pricingSummary(product) {
  const variants = variantsFor(product.id);
  if (variants.length === 0) {
    const p = effectivePricing(product, null);
    return { ...p, variable: false };
  }
  const available = variants.filter((v) => !v.esgotado);
  const source = available.length > 0 ? available : variants;
  const prices = source.map((v) => effectivePricing(product, v));
  const creditValues = prices.map((x) => x.creditPrice);
  const promoValues = prices.map((x) => x.promoPrice);
  return {
    creditPrice: Math.min(...creditValues),
    promoPrice: Math.min(...promoValues),
    variable: new Set(creditValues).size > 1 || new Set(promoValues).size > 1,
  };
}

function priceFor(product, variant) {
  const pricing = effectivePricing(product, variant);
  return state.payment === "credito" ? pricing.creditPrice : pricing.promoPrice;
}

function cartItems() {
  return Object.entries(state.cart)
    .map(([key, qty]) => {
      const { productId, variantId } = parseCartKey(key);
      const product = state.products.find((p) => p.id === productId);
      const variant = variantId ? variantsFor(productId).find((v) => v.id === variantId) ?? null : null;
      return { key, product, variant, quantity: qty };
    })
    .filter((it) => it.product && it.quantity > 0);
}

function cartCount() {
  return Object.values(state.cart).reduce((sum, q) => sum + q, 0);
}

function cartTotal() {
  return cartItems().reduce((sum, it) => sum + priceFor(it.product, it.variant) * it.quantity, 0);
}

/* Embalagens de presente escolhidas no checkout agora — pode ter mais de
   uma (tipos diferentes, ou mais de uma unidade da mesma). Cada item vem
   com a quantidade escolhida e o subtotal já calculado. */
function selectedGiftWraps() {
  if (!state.giftWrapWanted) return [];
  return state.giftWrapOptions
    .map((g) => ({ ...g, quantity: state.giftWrapQuantities[g.id] || 0 }))
    .filter((g) => g.quantity > 0)
    .map((g) => ({ ...g, lineTotal: Number(g.price) * g.quantity }));
}

function giftWrapTotalPrice() {
  return selectedGiftWraps().reduce((sum, g) => sum + g.lineTotal, 0);
}

function normalizeCep(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 8);
}
function formatCep(value) {
  const d = normalizeCep(value);
  return d.length > 5 ? `${d.slice(0,5)}-${d.slice(5)}` : d;
}
function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (n) => n * Math.PI / 180;
  const R = 6371;
  const dLat = toRad(Number(lat2) - Number(lat1));
  const dLon = toRad(Number(lon2) - Number(lon1));
  const a = Math.sin(dLat/2)**2 +
    Math.cos(toRad(Number(lat1))) * Math.cos(toRad(Number(lat2))) *
    Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
function shippingFeeAmount() {
  return state.shippingMethod === "delivery" && state.shippingQuote?.type === "motoboy"
    ? Number(state.shippingQuote.fee || 0) : 0;
}
function shippingSummaryText() {
  if (state.shippingMethod === "pickup") return "Retirada a combinar";
  if (!state.shippingQuote) return "Entrega ainda não calculada";
  if (state.shippingQuote.type === "motoboy") {
    return `Motoboy · ${state.shippingQuote.distanceKm.toFixed(1).replace(".", ",")} km`;
  }
  if (state.shippingQuote.type === "pac") return "Correios PAC";
  return "Entrega a confirmar";
}
function coordinateFromBrasilApi(data) {
  const c = data?.location?.coordinates;
  if (!c) return null;
  const lat = Number(c.latitude), lon = Number(c.longitude);
  return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null;
}
async function fetchCepData(cep) {
  const clean = normalizeCep(cep);
  if (clean.length !== 8) throw new Error("CEP inválido.");
  const r = await fetch(`https://brasilapi.com.br/api/cep/v2/${clean}`);
  if (!r.ok) throw new Error("CEP não encontrado.");
  return r.json();
}
async function geocodeWithNominatim({ street = "", number = "", neighborhood = "", city = "", stateUf = "", cep = "" } = {}) {
  try {
    const params = new URLSearchParams({
      format: "jsonv2",
      limit: "1",
      country: "Brazil",
      addressdetails: "1",
    });
    if (street) params.set("street", `${number ? number + " " : ""}${street}`.trim());
    if (city) params.set("city", city);
    if (stateUf) params.set("state", stateUf);
    if (cep) params.set("postalcode", normalizeCep(cep));

    const r = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
      headers: { "Accept": "application/json" }
    });
    if (!r.ok) return null;
    const data = await r.json();
    if (!Array.isArray(data) || !data[0]) return null;
    const lat = Number(data[0].lat), lon = Number(data[0].lon);
    return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null;
  } catch (_err) { return null; }
}

async function geocodeWithPhoton(addressText) {
  try {
    const r = await fetch(`https://photon.komoot.io/api/?limit=1&q=${encodeURIComponent(addressText)}`);
    if (!r.ok) return null;
    const data = await r.json();
    const coords = data?.features?.[0]?.geometry?.coordinates;
    if (!Array.isArray(coords) || coords.length < 2) return null;
    const lon = Number(coords[0]), lat = Number(coords[1]);
    return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null;
  } catch (_err) { return null; }
}

async function geocodeAddressRobust({ street = "", number = "", neighborhood = "", city = "", stateUf = "", cep = "" } = {}) {
  let coords = await geocodeWithNominatim({ street, number, neighborhood, city, stateUf, cep });
  if (coords) return coords;

  const full = [street, number, neighborhood, city, stateUf, cep ? `CEP ${formatCep(cep)}` : "", "Brasil"]
    .filter(Boolean).join(", ");
  coords = await geocodeWithPhoton(full);
  if (coords) return coords;

  const withoutNumber = [street, neighborhood, city, stateUf, "Brasil"].filter(Boolean).join(", ");
  coords = await geocodeWithPhoton(withoutNumber);
  if (coords) return coords;

  return geocodeWithNominatim({ street, city, stateUf });
}

async function coordinateForCepData(data, number = "", explicitAddress = "") {
  const structured = {
    street: data?.street || "",
    number,
    neighborhood: data?.neighborhood || "",
    city: data?.city || "",
    stateUf: data?.state || "",
    cep: data?.cep || "",
  };

  if (explicitAddress) {
    const photon = await geocodeWithPhoton(explicitAddress);
    if (photon) return photon;
  }

  const geocoded = await geocodeAddressRobust(structured);
  if (geocoded) return geocoded;

  return coordinateFromBrasilApi(data);
}

async function drivingDistanceKm(origin, destination) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=false`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    const meters = Number(data?.routes?.[0]?.distance);
    return Number.isFinite(meters) && meters > 0 ? meters / 1000 : null;
  } catch (_err) {
    return null;
  }
}
function loadSavedShippingAddress() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVED_ADDRESS_KEY) || "null");
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (_err) { return null; }
}

function saveShippingAddressLocally(fields) {
  try {
    localStorage.setItem(SAVED_ADDRESS_KEY, JSON.stringify({
      cep: fields.cep || "",
      street: fields.street || "",
      number: fields.number || "",
      neighborhood: fields.neighborhood || "",
      city: fields.city || "",
      stateUf: fields.stateUf || "",
      complement: fields.complement || "",
    }));
  } catch (_err) {}
}

function clearSavedShippingAddress() {
  try { localStorage.removeItem(SAVED_ADDRESS_KEY); } catch (_err) {}
}

function checkoutHasProgress() {
  const d = state.checkoutDraft || {};
  return state.screen === "checkout" && (
    !!d.name || !!d.whatsapp || !!d.notes ||
    !!d.shippingCep || !!d.shippingStreet || !!d.shippingNumber ||
    state.shippingMethod === "delivery" || state.giftWrapWanted
  );
}

function confirmCheckoutExit() {
  if (!checkoutHasProgress()) return true;
  return window.confirm("Você já preencheu parte do pedido. Deseja sair do checkout? Seus itens continuarão salvos no carrinho.");
}

function setCheckoutStage(stage) {
  if (state.checkoutStage === stage) return;
  state.checkoutStage = stage;
  trackEvent("checkout_stage", { stage });
}

function markShippingQuoteStale(message = "Endereço alterado. Recalculando a entrega…") {
  if (state.shippingMethod !== "delivery") return;
  state.shippingQuoteStale = true;
  state.shippingQuote = null;
  updateCheckoutTotals();
  const quoteBox = document.getElementById("ck-shipping-quote");
  if (quoteBox) {
    quoteBox.className = "shipping-quote-box";
    quoteBox.innerHTML = `<div class="shipping-stale-note">${escapeHtml(message)}</div>`;
  }
}

function setShippingInputsReadonly(readonly) {
  ["ck-shipping-street","ck-shipping-neighborhood","ck-shipping-city","ck-shipping-state"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.readOnly = readonly;
    el.classList.toggle("bg-navy-50", readonly);
  });
}

async function reverseGeocodeCoordinates(lat, lon) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&addressdetails=1`, {
      headers: { "Accept": "application/json" }
    });
    if (!r.ok) return null;
    const data = await r.json();
    const a = data?.address || {};
    return {
      cep: normalizeCep(a.postcode || ""),
      street: a.road || a.pedestrian || a.residential || a.street || "",
      number: a.house_number || "",
      neighborhood: a.suburb || a.neighbourhood || a.quarter || a.city_district || "",
      city: a.city || a.town || a.village || a.municipality || "",
      stateUf: String(a["ISO3166-2-lvl4"] || "").split("-").pop() || "",
      complement: "",
    };
  } catch (_err) { return null; }
}

async function useCurrentLocationForShipping() {
  const status = document.getElementById("ck-shipping-location-status");
  if (!navigator.geolocation) {
    if (status) {
      status.textContent = "Seu navegador não oferece localização automática.";
      status.className = "field-inline-status is-error";
    }
    return;
  }
  if (status) {
    status.textContent = "Obtendo sua localização…";
    status.className = "field-inline-status";
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const fields = await reverseGeocodeCoordinates(pos.coords.latitude, pos.coords.longitude);
    if (!fields || !fields.street || !fields.city) {
      if (status) {
        status.textContent = "Não conseguimos preencher o endereço pela localização. Você pode digitá-lo manualmente.";
        status.className = "field-inline-status is-error";
      }
      state.shippingAddressMode = "manual";
      setShippingInputsReadonly(false);
      return;
    }

    state.shippingAddressMode = "manual";
    const current = getShippingAddressFields();
    const merged = { ...current, ...fields, number: current.number || fields.number || "" };
    persistShippingAddressFields(merged);
    fillShippingAddressInputs(merged);
    setShippingInputsReadonly(false);
    markShippingQuoteStale("Localização preenchida. Confira o endereço e informe o número, se necessário.");
    if (status) {
      status.textContent = "Localização preenchida. Confira os dados antes de calcular.";
      status.className = "field-inline-status is-ok";
    }
  }, () => {
    if (status) {
      status.textContent = "Não foi possível acessar sua localização. Verifique a permissão do navegador.";
      status.className = "field-inline-status is-error";
    }
  }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
}

async function validateAddressConsistency(fields) {
  if (!fields.cep || fields.cep.length !== 8) return true;
  try {
    const data = await fetchCepData(fields.cep);
    const cepCity = String(data.city || "").trim().toLowerCase();
    const cepState = String(data.state || "").trim().toUpperCase();
    const typedCity = String(fields.city || "").trim().toLowerCase();
    const typedState = String(fields.stateUf || "").trim().toUpperCase();

    const cityDiffers = cepCity && typedCity && cepCity !== typedCity;
    const stateDiffers = cepState && typedState && cepState !== typedState;
    if (!cityDiffers && !stateDiffers) return true;

    return window.confirm(
      `O CEP informado corresponde a ${data.city || "outra cidade"}/${data.state || ""}, mas o endereço está como ${fields.city}/${fields.stateUf}. Deseja continuar com o endereço digitado?`
    );
  } catch (_err) {
    return true;
  }
}

function getShippingAddressFields() {
  return {
    cep: normalizeCep(document.getElementById("ck-shipping-cep")?.value || state.checkoutDraft.shippingCep),
    street: (document.getElementById("ck-shipping-street")?.value || state.checkoutDraft.shippingStreet || "").trim(),
    number: (document.getElementById("ck-shipping-number")?.value || state.checkoutDraft.shippingNumber || "").trim(),
    neighborhood: (document.getElementById("ck-shipping-neighborhood")?.value || state.checkoutDraft.shippingNeighborhood || "").trim(),
    city: (document.getElementById("ck-shipping-city")?.value || state.checkoutDraft.shippingCity || "").trim(),
    stateUf: (document.getElementById("ck-shipping-state")?.value || state.checkoutDraft.shippingState || "").trim().toUpperCase(),
    complement: (document.getElementById("ck-shipping-complement")?.value || state.checkoutDraft.shippingComplement || "").trim(),
  };
}

function persistShippingAddressFields(fields) {
  state.checkoutDraft.shippingCep = fields.cep ? formatCep(fields.cep) : "";
  state.checkoutDraft.shippingStreet = fields.street || "";
  state.checkoutDraft.shippingNumber = fields.number || "";
  state.checkoutDraft.shippingNeighborhood = fields.neighborhood || "";
  state.checkoutDraft.shippingCity = fields.city || "";
  state.checkoutDraft.shippingState = fields.stateUf || "";
  state.checkoutDraft.shippingComplement = fields.complement || "";
}

function fillShippingAddressInputs(fields) {
  const map = {
    "ck-shipping-cep": fields.cep ? formatCep(fields.cep) : "",
    "ck-shipping-street": fields.street || "",
    "ck-shipping-number": fields.number || "",
    "ck-shipping-neighborhood": fields.neighborhood || "",
    "ck-shipping-city": fields.city || "",
    "ck-shipping-state": fields.stateUf || "",
    "ck-shipping-complement": fields.complement || "",
  };
  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.value = value;
  });
}

async function autofillShippingFromCep() {
  const cepInput = document.getElementById("ck-shipping-cep");
  const status = document.getElementById("ck-shipping-cep-status");
  if (!cepInput) return false;

  const cep = normalizeCep(cepInput.value);
  state.checkoutDraft.shippingCep = formatCep(cep);

  if (cep.length !== 8) {
    if (status) status.textContent = "";
    return false;
  }

  if (status) status.textContent = "Buscando endereço…";

  try {
    const data = await fetchCepData(cep);
    const current = getShippingAddressFields();
    const fields = {
      ...current,
      cep,
      street: data.street || current.street,
      neighborhood: data.neighborhood || current.neighborhood,
      city: data.city || current.city,
      stateUf: data.state || current.stateUf,
    };
    persistShippingAddressFields(fields);
    fillShippingAddressInputs(fields);
    state.shippingQuote = null;
    state.shippingQuoteStale = true;

    const incomplete = !fields.street || !fields.neighborhood || !fields.city || !fields.stateUf;
    if (incomplete) {
      state.shippingAddressMode = "manual";
      setShippingInputsReadonly(false);
      if (status) {
        status.textContent = "O CEP não trouxe todos os dados. Complete os campos que faltam.";
        status.className = "field-inline-status is-error";
      }
    } else {
      setShippingInputsReadonly(true);
      if (status) {
        status.textContent = "Endereço preenchido. Informe apenas o número.";
        status.className = "field-inline-status is-ok";
      }
    }
    return true;
  } catch (_err) {
    if (status) status.textContent = "CEP não localizado. Você pode preencher o endereço manualmente.";
    return false;
  }
}

async function calculateShippingQuote() {
  const quoteBox = document.getElementById("ck-shipping-quote");
  if (!quoteBox) return;

  let fields = getShippingAddressFields();
  persistShippingAddressFields(fields);

  if (state.shippingAddressMode === "cep" && fields.cep.length === 8) {
    await autofillShippingFromCep();
    fields = getShippingAddressFields();
    persistShippingAddressFields(fields);
  }

  if (!fields.street || !fields.number || !fields.neighborhood || !fields.city || !fields.stateUf) {
    state.shippingQuote = null;
    quoteBox.className = "shipping-quote-box is-error";
    quoteBox.textContent = "Preencha endereço, número, bairro, cidade e UF para calcular a entrega.";
    updateCheckoutTotals();
    return;
  }

  const consistent = await validateAddressConsistency(fields);
  if (!consistent) {
    quoteBox.className = "shipping-quote-box is-error";
    quoteBox.textContent = "Confira o endereço antes de calcular a entrega.";
    return;
  }

  quoteBox.className = "shipping-quote-box";
  quoteBox.textContent = "Calculando a melhor forma de entrega…";

  try {
    const originData = await fetchCepData(STORE_ORIGIN_CEP);
    const originCoords = await coordinateForCepData(
      originData, "", `${STORE_ORIGIN_ADDRESS}, CEP ${formatCep(STORE_ORIGIN_CEP)}, Brasil`
    );

    let destinationData = {
      street: fields.street,
      neighborhood: fields.neighborhood,
      city: fields.city,
      state: fields.stateUf,
      cep: fields.cep,
    };

    if (fields.cep.length === 8) {
      try {
        const cepData = await fetchCepData(fields.cep);
        destinationData = {
          ...cepData,
          street: fields.street || cepData.street,
          neighborhood: fields.neighborhood || cepData.neighborhood,
          city: fields.city || cepData.city,
          state: fields.stateUf || cepData.state,
        };
      } catch (_err) {}
    }

    const destinationAddressText = [
      fields.street, fields.number, fields.neighborhood,
      fields.city, fields.stateUf, fields.cep ? `CEP ${formatCep(fields.cep)}` : "", "Brasil"
    ].filter(Boolean).join(", ");

    let destinationCoords = await geocodeAddressRobust({
      street: fields.street,
      number: fields.number,
      neighborhood: fields.neighborhood,
      city: fields.city,
      stateUf: fields.stateUf,
      cep: fields.cep,
    });

    if (!destinationCoords) {
      destinationCoords = await coordinateForCepData(
        destinationData, fields.number, destinationAddressText
      );
    }

    const address = [
      fields.street, fields.number, fields.neighborhood,
      fields.city, fields.stateUf, fields.cep ? `CEP ${formatCep(fields.cep)}` : ""
    ].filter(Boolean).join(", ");

    if (!originCoords || !destinationCoords) {
      state.shippingQuote = { type:"manual", fee:0, cep:formatCep(fields.cep), address };
      state.shippingQuoteStale = false;
      quoteBox.className = "shipping-quote-box is-error";
      quoteBox.innerHTML = `<b>Não conseguimos calcular a distância automaticamente.</b><br>
        Você pode continuar normalmente; a Luz Mariana confirma a forma e o valor da entrega pelo WhatsApp antes da confirmação final do pedido.
        ${address ? `<div class="shipping-address-summary">${escapeHtml(address)}</div>` : ""}
        <button type="button" id="ck-continue-manual-shipping" class="mt-3 large-touch-action w-full rounded-lg border border-navy-200 bg-white px-3 py-2 font-semibold text-navy-700">Continuar e confirmar entrega pelo WhatsApp</button>`;
      updateCheckoutTotals();
      return;
    }

    const roadDistance = await drivingDistanceKm(originCoords, destinationCoords);
    const straightDistance = haversineDistanceKm(originCoords.lat, originCoords.lon, destinationCoords.lat, destinationCoords.lon);
    let distanceKm = roadDistance ?? straightDistance;

    if (!Number.isFinite(distanceKm) || distanceKm < 0.05) {
      const retryOrigin = await geocodeWithPhoton(`${STORE_ORIGIN_ADDRESS}, Macaíba, RN, Brasil`);
      const retryDestination = await geocodeWithPhoton(
        [fields.street, fields.number, fields.neighborhood, fields.city, fields.stateUf, "Brasil"]
          .filter(Boolean).join(", ")
      );

      if (retryOrigin && retryDestination) {
        const retryRoad = await drivingDistanceKm(retryOrigin, retryDestination);
        const retryStraight = haversineDistanceKm(
          retryOrigin.lat, retryOrigin.lon,
          retryDestination.lat, retryDestination.lon
        );
        const retryDistance = retryRoad ?? retryStraight;
        if (Number.isFinite(retryDistance) && retryDistance >= 0.05) {
          distanceKm = retryDistance;
        }
      }
    }

    if (!Number.isFinite(distanceKm) || distanceKm < 0.05) {
      state.shippingQuote = {
        type: "manual",
        fee: 0,
        cep: formatCep(fields.cep),
        address
      };
      state.shippingQuoteStale = false;
      quoteBox.className = "shipping-quote-box is-error";
      quoteBox.innerHTML = `<b>Não conseguimos calcular a distância com segurança.</b><br>
        Você pode continuar normalmente; a Luz Mariana confirma a entrega pelo WhatsApp antes da confirmação final do pedido.
        <div class="shipping-address-summary">${escapeHtml(address)}</div>
        <button type="button" id="ck-continue-manual-shipping" class="mt-3 large-touch-action w-full rounded-lg border border-navy-200 bg-white px-3 py-2 font-semibold text-navy-700">Continuar e confirmar entrega pelo WhatsApp</button>`;
      updateCheckoutTotals();
      return;
    }

    if (distanceKm <= LOCAL_DELIVERY_RADIUS_KM) {
      const rate = distanceKm <= REDUCED_DELIVERY_RADIUS_KM
        ? REDUCED_DELIVERY_RATE_PER_KM : STANDARD_DELIVERY_RATE_PER_KM;
      const calculatedFee = Math.round(distanceKm * rate * 100) / 100;
      const fee = calculatedFee <= 5 ? 0 : calculatedFee;
      const isFreeDelivery = fee === 0;

      state.shippingQuote = {
        type:"motoboy",
        fee,
        calculatedFee,
        free: isFreeDelivery,
        rate,
        distanceKm,
        cep:formatCep(fields.cep),
        address
      };

      state.shippingQuoteStale = false;
      quoteBox.className = "shipping-quote-box is-ready";
      quoteBox.innerHTML = `<b>Entrega por motoboy disponível</b><br>
        Distância estimada do trajeto: <b>${distanceKm.toFixed(1).replace(".", ",")} km</b><br>
        ${isFreeDelivery ? `<span class="shipping-free-badge mt-2">Entrega grátis</span>` : `<b>Valor da entrega: ${formatBRL(fee)}</b>`}
        <div class="shipping-address-summary">${escapeHtml(address)}</div>
        <p class="mt-2 text-xs text-navy-600"><b>Prazo da entrega:</b> horário combinado após a finalização do pedido.</p>
        <p class="mt-1 text-[11px] text-navy-500">Estimativa baseada na localização do endereço. A loja confirma os dados antes do envio.</p>`;
    } else {
      state.shippingQuote = { type:"pac", fee:0, distanceKm, cep:formatCep(fields.cep), address };
      state.shippingQuoteStale = false;
      quoteBox.className = "shipping-quote-box is-pac";
      quoteBox.innerHTML = `<b>Envio pelos Correios — PAC</b><br>
        O endereço fica fora do raio de ${LOCAL_DELIVERY_RADIUS_KM} km para motoboy.
        <b>Frete e prazo do PAC serão informados antes da confirmação final do pedido.</b>
        <div class="shipping-address-summary">${escapeHtml(address)}</div>
        <p class="mt-2 text-xs text-navy-600"><b>Prazo da entrega:</b> contado a partir da finalização do pedido, conforme a cotação dos Correios.</p>`;
    }
    updateCheckoutTotals();
  } catch (err) {
    const address = [
      fields.street, fields.number, fields.neighborhood,
      fields.city, fields.stateUf, fields.cep ? `CEP ${formatCep(fields.cep)}` : ""
    ].filter(Boolean).join(", ");
    state.shippingQuote = { type:"manual", fee:0, cep:formatCep(fields.cep), address };
    state.shippingQuoteStale = false;
    quoteBox.className = "shipping-quote-box is-error";
    quoteBox.innerHTML = `<b>O serviço de mapa não respondeu agora.</b><br>
      Você pode continuar normalmente; a entrega será confirmada pelo WhatsApp antes da confirmação final do pedido.
      ${address ? `<div class="shipping-address-summary">${escapeHtml(address)}</div>` : ""}
      <button type="button" id="ck-continue-manual-shipping" class="mt-3 large-touch-action w-full rounded-lg border border-navy-200 bg-white px-3 py-2 font-semibold text-navy-700">Continuar e confirmar entrega pelo WhatsApp</button>`;
    updateCheckoutTotals();
  }
}

/* Soma antes de aplicar o cupom (itens do carrinho + embalagens de presente). */
function subtotalBeforeDiscount() {
  return cartTotal() + giftWrapTotalPrice();
}

/* Quanto o cupom aplicado (se algum) desconta, já respeitando o teto
   em R$ (max_discount_amount) e nunca deixando o desconto passar do
   próprio subtotal. */
function discountAmount() {
  const coupon = state.appliedCoupon;
  if (!coupon) return 0;
  const subtotal = subtotalBeforeDiscount();
  let raw = 0;
  if (coupon.discount_type === "percentual") raw = subtotal * (Number(coupon.discount_value) / 100);
  else if (coupon.discount_type === "valor_fixo") raw = Number(coupon.discount_value);
  if (coupon.max_discount_amount != null) raw = Math.min(raw, Number(coupon.max_discount_amount));
  raw = Math.min(raw, subtotal);
  return Math.max(0, raw);
}

/* Total = itens + embalagens − desconto + motoboy.
   O PAC fica fora do total até a cotação oficial. */
function orderTotal() {
  return Math.max(0, subtotalBeforeDiscount() - discountAmount() + shippingFeeAmount());
}

function setQty(productId, qty) {
  if (qty <= 0) delete state.cart[productId];
  else state.cart[productId] = qty;
  saveCartToStorage();
  render();
}

/* =====================================================================
   RENDER
   ===================================================================== */
const WELCOME_ORDER_SESSION_KEY = "luzmariana_welcome_order_seen_v1";
let welcomeOrderTimer = null;
let welcomeOrderInactivityTimer = null;
const WELCOME_ORDER_INACTIVITY_MS = 30000;
const WELCOME_ORDER_VISIBLE_MS = 13000;

function closeWelcomeOrder(markSeen = true) {
  const overlay = document.getElementById("welcome-order-overlay");
  if (!overlay) return;
  overlay.classList.remove("is-open");
  if (welcomeOrderTimer) {
    clearTimeout(welcomeOrderTimer);
    welcomeOrderTimer = null;
  }
  if (markSeen) {
    try { sessionStorage.setItem(WELCOME_ORDER_SESSION_KEY, "1"); } catch (_err) {}
  }
}

function userHasChosenSomething() {
  return cartCount() > 0
    || !!state.detailProductId
    || !!state.searchQuery
    || state.categoryFilter !== "all"
    || state.favoritesOnly;
}

function scheduleWelcomeOrderAfterInactivity() {
  if (welcomeOrderInactivityTimer) {
    clearTimeout(welcomeOrderInactivityTimer);
    welcomeOrderInactivityTimer = null;
  }
  if (state.screen !== "catalog") return;

  let alreadySeen = false;
  try { alreadySeen = sessionStorage.getItem(WELCOME_ORDER_SESSION_KEY) === "1"; } catch (_err) {}
  if (alreadySeen || userHasChosenSomething()) return;

  welcomeOrderInactivityTimer = setTimeout(() => {
    if (state.screen === "catalog" && !userHasChosenSomething()) {
      showWelcomeOrder();
    }
  }, WELCOME_ORDER_INACTIVITY_MS);
}

function showWelcomeOrder() {
  const overlay = document.getElementById("welcome-order-overlay");
  const card = overlay?.querySelector(".welcome-order-card");
  const progress = document.getElementById("welcome-order-progress-bar");
  if (!overlay || !card) return;

  overlay.classList.add("is-open");
  card.focus();

  if (progress) {
    progress.style.transition = "none";
    progress.style.transform = "scaleX(1)";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progress.style.transition = `transform ${WELCOME_ORDER_VISIBLE_MS}ms linear`;
        progress.style.transform = "scaleX(0)";
      });
    });
  }

  welcomeOrderTimer = setTimeout(() => closeWelcomeOrder(true), WELCOME_ORDER_VISIBLE_MS);
}

function renderBackToTopButton() {
  return `<button type="button" id="back-to-top-btn" class="back-to-top-btn" aria-label="Voltar ao topo" title="Voltar ao topo">↑</button>`;
}

function renderLoadingSkeleton() {
  return `
    <div class="catalog-skeleton">
      <div class="h-16 bg-navy-900"></div>
      <div class="skeleton-bar h-36 w-full"></div>
      <main class="mx-auto max-w-5xl px-4 py-6">
        <div class="skeleton-bar mb-5 h-12 rounded-full"></div>
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
          ${Array.from({length:8}, () => `<div class="overflow-hidden rounded-xl border border-navy-100 bg-white"><div class="skeleton-card aspect-square"></div><div class="space-y-2 p-4"><div class="skeleton-bar h-4 rounded"></div><div class="skeleton-bar h-3 w-2/3 rounded"></div><div class="skeleton-bar h-10 rounded-lg"></div></div></div>`).join("")}
        </div>
      </main>
    </div>`;
}

function renderLoadError() {
  return `
    ${renderHeader()}
    <main class="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <div class="mb-3 text-4xl" aria-hidden="true">↻</div>
      <h1 class="text-xl font-semibold text-navy-900">Não conseguimos abrir o catálogo agora</h1>
      <p class="mt-2 text-sm text-navy-600">Pode ser apenas uma instabilidade de conexão. Você pode tentar novamente ou falar conosco pelo WhatsApp.</p>
      <div class="mt-5 flex w-full flex-col gap-2 sm:flex-row">
        <button type="button" id="retry-catalog-btn" class="large-touch-action flex-1 rounded-lg bg-navy-900 px-4 py-3 font-semibold text-white">Tentar novamente</button>
        <button type="button" data-header-whatsapp class="large-touch-action flex-1 rounded-lg border border-navy-200 bg-white px-4 py-3 font-semibold text-navy-700">Falar no WhatsApp</button>
      </div>
    </main>
    ${renderFooter()}
  `;
}

function render() {
  const helpBtn = document.getElementById("help-guide-btn");
  const helpOverlay = document.getElementById("help-guide-overlay");
  if (helpBtn) helpBtn.style.display = state.screen === "catalog" ? "flex" : "none";
  if (state.screen !== "catalog" && helpOverlay) {
    helpOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  if (state.loading) {
    app.innerHTML = renderLoadingSkeleton();
    return;
  }
  if (state.loadError) {
    app.innerHTML = renderLoadError();
    wireGlobalUtilityEvents();
    return;
  }
  if (state.screen === "success") return renderSuccess();
  if (state.screen === "checkout") return renderCheckout();
  if (state.screen === "product") return renderProductDetail();
  if (state.screen === "policy") return renderPolicy();
  if (state.screen === "storepolicy") return renderStorePolicy();
  if (state.screen === "track") return renderTrack();
  return renderCatalog();
}

function renderHeader() {
  return `
    <header class="bg-navy-900">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-3 py-3">
        <button type="button" data-go-home aria-label="Ir para a página inicial" class="flex min-w-0 items-center gap-2 border-0 bg-transparent p-0 transition hover:opacity-90">
          <img src="logo-symbol.png" alt="" class="h-9 w-9" />
          <span class="truncate text-lg font-semibold tracking-wide text-cream-50">Luz Mariana</span>
        </button>
        <button type="button" data-open-track class="accessibility-btn px-3" aria-label="Rastrear pedido">Rastrear pedido</button>
        <button type="button" data-header-whatsapp class="accessibility-btn px-3" aria-label="Falar com a loja pelo WhatsApp">Falar com a loja</button>
        <button type="button" data-header-custom-order class="accessibility-btn px-3" aria-label="Solicitar encomenda personalizada">Encomenda personalizada</button>
        <button type="button" data-font-toggle class="accessibility-btn" aria-label="Aumentar ou reduzir o tamanho do texto" title="Tamanho do texto">${document.documentElement.dataset.fontSize === "large" ? "A−" : "A+"}</button>
      </div>
    </header>
  `;
}

function renderHero() {
  // Em telas de celular usamos uma imagem PRÓPRIA, já recortada à mão
  // pra manter a logo, o texto e o selo de pagamento sempre inteiros e
  // legíveis (não é um corte automático via CSS). A partir do tablet
  // (640px) volta a usar a arte completa, cada vez mais larga conforme
  // a tela cresce.
  return `
    <div class="w-full overflow-hidden bg-navy-900">
      <picture>
        <source media="(max-width: 639px)" srcset="hero-banner-mobile.jpg" />
        <img src="hero-banner.jpg" loading="eager" fetchpriority="high" decoding="async"
          alt="Bem-vindo(a) à Luz Mariana — Fé que inspira. Presentes que têm significado. Artigos religiosos e peças de devoção para sua casa, seu cantinho de oração ou para presentear alguém especial. Condições especiais para pagamentos via Pix ou à vista."
          class="block h-auto w-full object-contain object-center" />
      </picture>
    </div>
  `;
}

function renderCategoryBar(categories) {
  if (categories.length === 0) return "";
  const items = [{ value: "all", label: "Página inicial" }, ...categories.map((c) => ({ value: c, label: c }))];
  const favoriteCount = Object.keys(state.favorites).length;
  return `
    <div class="border-b border-navy-800 bg-navy-900">
      <div class="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 py-2 text-sm">
        ${items.map((it) => `
          <button data-category="${escapeHtml(it.value)}" aria-label="${it.value === "all" ? "Ir para a página inicial" : `Abrir categoria ${escapeHtml(it.label)}`}" class="category-bar-btn whitespace-nowrap rounded-full px-4 py-2 font-medium transition ${state.categoryFilter === it.value ? "bg-gold-500 text-navy-900" : "text-cream-100 hover:bg-navy-800"}">${escapeHtml(it.label)}</button>
        `).join("")}
        ${favoriteCount > 0 ? `
          <button id="favorites-filter-btn" class="whitespace-nowrap rounded-full px-4 py-2 font-medium transition ${state.favoritesOnly ? "bg-gold-500 text-navy-900" : "text-cream-100 hover:bg-navy-800"}">Favoritos (${favoriteCount})</button>
        ` : ""}
      </div>
    </div>
  `;
}

// "Mais vendidos" = ranking automático por unidades vendidas
// (catalog_products.units_sold, já soma tudo exceto pedido cancelado —
// ver migration_mais_vendidos.sql) + qualquer produto marcado manualmente
// como destaque no Painel (products.featured), mesmo com zero vendas —
// é o "empurrão manual" que o dono pediu pra continuar existindo.
// Produtos manuais sempre entram; o restante das vagas (até
// BEST_SELLERS_AUTO_LIMIT) é preenchido pelos mais vendidos automáticos.
const BEST_SELLERS_AUTO_LIMIT = 8;
function computeBestSellers(products) {
  const manual = products.filter((p) => p.featured);
  const manualIds = new Set(manual.map((p) => p.id));
  const bySales = products
    .filter((p) => !manualIds.has(p.id) && (p.units_sold || 0) > 0)
    .sort((a, b) => (b.units_sold || 0) - (a.units_sold || 0))
    .slice(0, BEST_SELLERS_AUTO_LIMIT);
  return [...manual, ...bySales];
}

function renderFeaturedCarousel(products) {
  if (products.length === 0) return "";
  // Esgotados vão pro final da vitrine — dá mais destaque pra quem
  // realmente dá pra comprar agora (ordem estável: preserva a ordem
  // original dentro de cada grupo, só empurra os esgotados pro fim).
  const sorted = [...products].sort((a, b) => (isSoldOut(a) ? 1 : 0) - (isSoldOut(b) ? 1 : 0));
  // Duplica a lista pra dar loop contínuo sem "pulo" no final.
  const track = sorted;
  const duration = Math.max(12, products.length * 6);
  return `
    <div class="mb-8">
      <h2 class="mb-3 text-lg font-semibold text-navy-900">Mais vendidos</h2>
      <div class="featured-carousel-wrap overflow-hidden">
        <div class="featured-carousel-track flex gap-4" style="animation-duration: ${duration}s;">
          ${track.map((p) => `<div class="w-40 flex-shrink-0 sm:w-48">${renderProductCard(p, { hideDescription: true })}</div>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderFooter() {
  return `
    <footer class="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-navy-600">
      <div class="mb-3 flex flex-col items-center gap-2">
        <span class="secure-badge" aria-label="Ambiente protegido">🔒 Ambiente protegido</span>
        <p class="secure-note max-w-md">Não pedimos senha nem dados de cartão neste site. O pedido é finalizado com você pelo WhatsApp.</p>
      </div>
      <div class="mb-5 w-full max-w-lg">
        <div class="footer-faq rounded-xl border border-navy-100 bg-white px-4">
          <details><summary>Qual o prazo?</summary><p>Produtos sob encomenda têm prazo de produção contado a partir da confirmação do pedido. Quando não houver prazo específico informado no produto, o padrão é de até 2 dias úteis. O prazo de entrega começa após a finalização do pedido.</p></details>
          <details><summary>Como funciona a entrega ou retirada?</summary><p>Depois que você envia o pedido pelo WhatsApp, combinamos a melhor opção de retirada ou entrega conforme sua localização.</p></details>
          <details><summary>Como funciona o pagamento?</summary><p>O catálogo mostra os valores e o sinal necessário para confirmação. O pagamento é combinado diretamente com a Luz Mariana pelo WhatsApp.</p></details>
          <details><summary>Vocês fazem encomendas personalizadas?</summary><p>Sim. Se não encontrou santo, modelo, cor, tamanho ou peça específica, envie uma mensagem e fazemos um orçamento personalizado.</p></details>
          <details><summary>Como funciona uma encomenda personalizada?</summary><p>Você conta o que procura, enviamos possibilidades e orçamento pelo WhatsApp e, após a confirmação, informamos o prazo de produção.</p></details>
        </div>
      </div>
      <p>Luz Mariana - Artigos Religiosos · CNPJ ${STORE_CNPJ}</p>
      <p class="mt-1">© 2026 Luz Mariana. Todos os direitos reservados.</p>
      <p class="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        <button data-open-store-policy class="underline hover:text-navy-500">Políticas da loja</button>
        <span>·</span>
        <button data-open-policy="privacidade" class="underline hover:text-navy-500">Privacidade</button>
        <span>·</span>
        <button data-open-policy="termos" class="underline hover:text-navy-500">Termos de Uso</button>
      </p>
      <button type="button" id="install-catalog-btn" class="install-catalog-btn mt-4 hidden">Adicionar catálogo à tela inicial</button>
    </footer>
  `;
}

/* Política de Privacidade + Termos de Uso — uma única tela com duas
   abas (mesmo padrão de "tela informativa simples" das outras telas
   auxiliares do catálogo). Loja pequena, sem conta de cliente nem
   coleta de dados além do necessário pra fechar o pedido pelo
   WhatsApp — o texto reflete exatamente isso, nada genérico/copiado. */
function renderStorePolicy() {
  updateDynamicShareMeta(null, null);
  app.innerHTML = `
    ${renderHeader()}
    <main class="mx-auto w-full max-w-2xl px-4 py-8">
      <button type="button" data-go-home class="mb-5 text-sm font-semibold text-navy-600 hover:underline">&larr; Voltar ao catálogo</button>
      <div class="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
        <h1 class="text-2xl font-semibold text-navy-900">Políticas da loja</h1>
        <p class="mt-2 text-sm leading-relaxed text-navy-600">Um resumo simples para você saber como funcionam confirmação, produção, entrega e encomendas.</p>
        <div class="mt-6 space-y-5 text-sm leading-relaxed text-navy-700">
          <section><h2 class="font-semibold text-navy-900">Confirmação do pedido</h2><p class="mt-1">O pedido é enviado pelo catálogo e concluído pelo WhatsApp. A confirmação ocorre depois que a Luz Mariana recebe a mensagem e confirma disponibilidade e, quando houver sinal, o respectivo pagamento.</p></section>
          <section><h2 class="font-semibold text-navy-900">Produção</h2><p class="mt-1">Produtos sob encomenda têm prazo contado a partir da confirmação do pedido. Quando o produto não tiver prazo específico informado, o padrão é de até 2 dias úteis.</p></section>
          <section><h2 class="font-semibold text-navy-900">Entrega</h2><p class="mt-1">O prazo de entrega começa a partir da finalização do pedido. Até 15 km, quando disponível, a entrega pode ser feita por entregador/motoboy. Acima desse raio, o envio é feito por Correios PAC. Frete e prazo do PAC são informados antes da confirmação final.</p></section>
          <section><h2 class="font-semibold text-navy-900">Retirada</h2><p class="mt-1">Também é possível escolher retirada a combinar. O horário e os detalhes são confirmados diretamente pelo WhatsApp.</p></section>
          <section><h2 class="font-semibold text-navy-900">Encomendas personalizadas</h2><p class="mt-1">Se você procura outro santo, modelo, cor, tamanho ou uma peça especial, pode solicitar orçamento pelo WhatsApp. Prazo e valor são informados antes da confirmação.</p></section>
          <section><h2 class="font-semibold text-navy-900">Pagamento</h2><p class="mt-1">O catálogo informa os valores disponíveis para cada produto. Dados de cartão não são digitados neste site; quando necessário, o pagamento é combinado de forma segura pelo WhatsApp.</p></section>
        </div>
        <button type="button" data-header-whatsapp class="mt-6 w-full rounded-lg bg-navy-900 px-4 py-3 font-semibold text-white">Ficou com alguma dúvida? Fale conosco</button>
      </div>
    </main>
    ${renderFooter()}
    ${renderBackToTopButton()}
  `;
  wireCatalogEvents();
}

function renderPolicy() {
  const tab = state.policyTab === "termos" ? "termos" : "privacidade";
  const tabBtn = (key, label) => `
    <button data-policy-tab="${key}" class="rounded-full px-4 py-1.5 text-sm font-medium transition ${tab === key ? "bg-navy-900 text-white" : "bg-navy-50 text-navy-600 hover:bg-navy-100"}">${label}</button>
  `;
  const privacidade = `
    <div class="space-y-4 text-sm leading-relaxed text-navy-700">
      <p>Esta política explica quais dados a Luz Mariana coleta quando você usa este catálogo e faz um pedido, e o que fazemos com eles. Última atualização: 25/08/2026.</p>
      <h3 class="text-base font-semibold text-navy-900">Quais dados coletamos</h3>
      <p>Para fechar um pedido pedimos seu nome e número de WhatsApp — apenas o necessário para confirmar o pedido e combinar entrega/pagamento com você pelo WhatsApp. Não pedimos CPF, endereço completo, dados de cartão ou qualquer informação financeira: o pagamento é combinado diretamente com você pelo WhatsApp, fora deste site.</p>
      <p>O catálogo também guarda os itens do seu carrinho no seu próprio navegador (não em nossos servidores), só para o carrinho não se perder se você fechar a página sem finalizar — isso fica salvo apenas no seu aparelho e some se você limpar os dados do navegador.</p>
      <h3 class="text-base font-semibold text-navy-900">Para que usamos esses dados</h3>
      <p>Usamos seu nome e WhatsApp exclusivamente para confirmar o pedido, tirar dúvidas e combinar entrega e pagamento com você. Não vendemos, alugamos nem compartilhamos seus dados com terceiros, e não os usamos para envio de propaganda sem sua autorização.</p>
      <h3 class="text-base font-semibold text-navy-900">Onde seus dados ficam guardados</h3>
      <p>As informações do pedido ficam guardadas em nosso banco de dados (Supabase), usado apenas pela equipe da Luz Mariana para atender pedidos. Mantemos esses dados pelo tempo necessário para o histórico de vendas e atendimento.</p>
      <h3 class="text-base font-semibold text-navy-900">Seus direitos (LGPD)</h3>
      <p>Você pode pedir a qualquer momento para saber quais dados temos sobre você, corrigi-los ou pedir que sejam apagados, entrando em contato pelo WhatsApp <a href="https://wa.me/${STORE_WHATSAPP_NUMBER}" target="_blank" rel="noopener" class="underline">${formatWhatsappBR(STORE_WHATSAPP_NUMBER)}</a>. Atendemos esse pedido assim que possível, respeitando eventuais obrigações legais de manter registros de venda.</p>
    </div>
  `;
  const termos = `
    <div class="space-y-4 text-sm leading-relaxed text-navy-700">
      <p>Ao usar este catálogo e fazer um pedido pela Luz Mariana, você concorda com estes termos. Última atualização: 25/08/2026.</p>
      <h3 class="text-base font-semibold text-navy-900">Como funciona o pedido</h3>
      <p>Este catálogo é uma vitrine para você montar seu pedido e enviá-lo pelo WhatsApp — a compra só é confirmada de fato na conversa com a Luz Mariana pelo WhatsApp, onde combinamos pagamento, prazo e entrega. Os preços e a disponibilidade mostrados aqui podem mudar sem aviso prévio até a confirmação do pedido.</p>
      <h3 class="text-base font-semibold text-navy-900">Pagamento</h3>
      <p>O pagamento é combinado diretamente pelo WhatsApp (Pix ou outro meio informado na conversa) e não é processado neste site.</p>
      <h3 class="text-base font-semibold text-navy-900">Prazos e produtos sob encomenda</h3>
      <p>Produtos marcados como "pronta entrega" saem do estoque disponível; os demais são feitos sob encomenda. O prazo de produção começa a contar a partir da confirmação do pedido e, quando não houver prazo específico informado no produto, o padrão é de até 2 dias úteis. O prazo da entrega começa após a finalização do pedido.</p>
      <h3 class="text-base font-semibold text-navy-900">Trocas e devoluções</h3>
      <p>Havendo algum problema com o produto recebido (defeito, erro no pedido), entre em contato pelo WhatsApp para combinarmos a solução — troca, reparo ou reembolso, conforme o caso.</p>
      <h3 class="text-base font-semibold text-navy-900">Dúvidas</h3>
      <p>Qualquer dúvida sobre estes termos ou sobre um pedido, fale com a gente pelo WhatsApp <a href="https://wa.me/${STORE_WHATSAPP_NUMBER}" target="_blank" rel="noopener" class="underline">${formatWhatsappBR(STORE_WHATSAPP_NUMBER)}</a>.</p>
    </div>
  `;
  app.innerHTML = `
    <main class="mx-auto max-w-3xl px-4 py-8" id="main-content">
      <button data-go-home class="mb-6 inline-flex items-center gap-1 text-sm font-medium text-navy-500 hover:text-navy-700">← Voltar ao catálogo</button>
      <h1 class="mb-4 text-xl font-semibold text-navy-900">Política de Privacidade e Termos de Uso</h1>
      <div class="mb-6 flex gap-2">
        ${tabBtn("privacidade", "Política de Privacidade")}
        ${tabBtn("termos", "Termos de Uso")}
      </div>
      ${tab === "termos" ? termos : privacidade}
    </main>
    ${renderFooter()}
  `;
}

function renderShoppingGuide() {
  return `
    <section class="shopping-guide-card mb-5" aria-label="Como comprar">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="font-semibold text-navy-900">Comprar aqui é simples</p>
          <p class="mt-0.5 text-sm text-navy-500">Monte seu pedido e finalize pelo WhatsApp.</p>
        </div>
        <button type="button" data-open-help-guide class="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm font-semibold text-navy-700">Ver ajuda</button>
      </div>
      <div class="shopping-guide-steps">
        <div class="shopping-guide-step"><span class="shopping-guide-number">1</span><span><b>Escolha</b><br>um produto</span></div>
        <div class="shopping-guide-step"><span class="shopping-guide-number">2</span><span><b>Adicione</b><br>ao pedido</span></div>
        <div class="shopping-guide-step"><span class="shopping-guide-number">3</span><span><b>Finalize</b><br>no WhatsApp</span></div>
      </div>
    </section>
  `;
}

function renderCatalogFilters() {
  return `<div class="catalog-filter-bar" aria-label="Filtros do catálogo">
    <div><label for="availability-filter">Disponibilidade</label><select id="availability-filter">
      <option value="all" ${state.availabilityFilter === "all" ? "selected" : ""}>Todos</option>
      <option value="ready" ${state.availabilityFilter === "ready" ? "selected" : ""}>Pronta entrega</option>
      <option value="order" ${state.availabilityFilter === "order" ? "selected" : ""}>Sob encomenda</option>
    </select></div>
    <div><label for="price-filter">Faixa de preço no Pix</label><select id="price-filter">
      <option value="all" ${state.priceFilter === "all" ? "selected" : ""}>Todos os preços</option>
      <option value="under25" ${state.priceFilter === "under25" ? "selected" : ""}>Até R$ 25</option>
      <option value="25to50" ${state.priceFilter === "25to50" ? "selected" : ""}>R$ 25 a R$ 50</option>
      <option value="50to100" ${state.priceFilter === "50to100" ? "selected" : ""}>R$ 50 a R$ 100</option>
      <option value="over100" ${state.priceFilter === "over100" ? "selected" : ""}>Acima de R$ 100</option>
    </select></div>
    <div><label for="sort-filter">Ordenar por</label><select id="sort-filter">
      <option value="featured" ${state.sortMode === "featured" ? "selected" : ""}>Recomendados</option>
      <option value="best" ${state.sortMode === "best" ? "selected" : ""}>Mais vendidos</option>
      <option value="newest" ${state.sortMode === "newest" ? "selected" : ""}>Novidades</option>
      <option value="priceAsc" ${state.sortMode === "priceAsc" ? "selected" : ""}>Menor preço</option>
      <option value="priceDesc" ${state.sortMode === "priceDesc" ? "selected" : ""}>Maior preço</option>
    </select></div>
  </div>`;
}
function productPassesPriceFilter(product) {
  const price = productMinPixPrice(product);
  if (state.priceFilter === "under25") return price <= 25;
  if (state.priceFilter === "25to50") return price >= 25 && price <= 50;
  if (state.priceFilter === "50to100") return price >= 50 && price <= 100;
  if (state.priceFilter === "over100") return price > 100;
  return true;
}
function sortCatalogProducts(products) {
  const list = [...products];
  if (state.sortMode === "best") return list.sort((a,b) => Number(b.units_sold || 0) - Number(a.units_sold || 0));
  if (state.sortMode === "priceAsc") return list.sort((a,b) => productMinPixPrice(a) - productMinPixPrice(b));
  if (state.sortMode === "priceDesc") return list.sort((a,b) => productMinPixPrice(b) - productMinPixPrice(a));
  if (state.sortMode === "newest") return list.sort((a,b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  return list;
}
function renderNewArrivals() {
  const products = [...state.products]
    .filter((p) => isNewProduct(p) && !isSoldOut(p))
    .sort((a,b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 8);
  if (!products.length) return "";
  return `
    <section class="mb-8" aria-label="Novidades">
      <div class="mb-3 flex items-center justify-between gap-3">
        <h2 class="text-lg font-semibold text-navy-900">Novidades</h2>
        <button type="button" id="view-all-new" class="text-xs font-semibold text-navy-600 underline">Ver todas</button>
      </div>
      <div class="recently-viewed-row">
        ${products.map((p) => `<div class="w-40 flex-shrink-0 sm:w-48">${renderProductCard(p, { hideDescription:true })}</div>`).join("")}
      </div>
    </section>`;
}

function renderAboutStore() {
  return `
    <section class="about-store-card mb-8" aria-label="Sobre a Luz Mariana">
      <p class="text-xs font-semibold uppercase tracking-wider text-gold-700">Sobre a Luz Mariana</p>
      <h2 class="mt-1 text-lg font-semibold text-navy-900">Fé, carinho e significado em cada detalhe</h2>
      <p class="mt-2 text-sm text-navy-600">
        A Luz Mariana nasceu para transformar devoção em presença no dia a dia: artigos religiosos,
        peças para cantinhos de oração e presentes preparados com cuidado para momentos especiais.
        Cada pedido é tratado com atenção, desde a escolha do modelo até a confirmação da entrega.
      </p>
      <div class="mt-3 flex flex-wrap gap-2">
        <button type="button" data-open-store-policy class="rounded-lg border border-navy-200 bg-white px-3 py-2 text-xs font-semibold text-navy-700">Políticas, prazos e entregas</button>
        <button type="button" data-header-custom-order class="rounded-lg bg-navy-900 px-3 py-2 text-xs font-semibold text-white">Pedir algo personalizado</button>
      </div>
    </section>
  `;
}

function renderRecentlyViewed() {
  const products = loadRecentlyViewedIds().map((id) => state.products.find((p) => String(p.id) === String(id))).filter(Boolean).slice(0,6);
  if (!products.length) return "";
  return `<section class="mb-6" aria-label="Produtos vistos recentemente">
    <div class="mb-3 flex items-center justify-between gap-3"><h2 class="text-lg font-semibold text-navy-900">Você viu recentemente</h2><button type="button" id="clear-recently-viewed" class="text-xs font-semibold text-navy-500 underline">Limpar</button></div>
    <div class="recently-viewed-row">
      ${products.map((p) => {
        const v = variantsFor(p.id)[0] || null;
        const photo = p.photo_url || v?.photo_url || "";
        return `<button type="button" data-view-product="${p.id}" class="recently-viewed-card">${photo ? `<img src="${photo}" alt="" loading="lazy" decoding="async" />` : `<div class="aspect-square bg-cream-100"></div>`}<span class="block p-2 text-xs font-semibold text-navy-900">${escapeHtml(p.name)}</span></button>`;
      }).join("")}
    </div>
  </section>`;
}

function renderCatalog() {
  updateDynamicShareMeta(null, null);
  const grouped = groupByCategory(state.products);
  const categories = grouped.map((g) => g.category);
  const featured = computeBestSellers(state.products);
  const searchActive = state.searchQuery.trim().length > 0;
  const categoryFiltered = state.categoryFilter === "all"
    ? state.products
    : state.products.filter((p) => (p.category && p.category.trim() ? p.category.trim() : "Outros") === state.categoryFilter);
  const searchFiltered = searchActive
    ? categoryFiltered.filter((p) => productMatchesSearch(p, state.searchQuery))
    : categoryFiltered;
  const favoritesFiltered = state.favoritesOnly ? searchFiltered.filter((p) => state.favorites[p.id]) : searchFiltered;
  const availabilityFiltered = favoritesFiltered.filter((p) => {
    const flags = productAvailabilityFlags(p);
    if (state.availabilityFilter === "ready") return flags.ready;
    if (state.availabilityFilter === "order") return flags.order;
    return true;
  });
  const visibleProducts = sortCatalogProducts(availabilityFiltered.filter(productPassesPriceFilter));

  app.innerHTML = `
    ${renderHeader()}
    ${!searchActive && state.categoryFilter === "all" && !state.favoritesOnly ? renderHero() : ""}
    <div style="position:sticky; top:0; z-index:15;">
      ${renderCategoryBar(categories)}
    </div>
    <div class="mx-auto max-w-5xl px-4 py-4">
      ${state.cartRestoredNotice ? `<div class="cart-restored-note"><div class="flex items-center justify-between gap-3"><span><b>Seu pedido continua aqui.</b> O carrinho ficou salvo neste aparelho.</span><button type="button" id="dismiss-cart-restored" class="underline">Fechar</button></div></div>` : ""}
      ${!searchActive && state.categoryFilter === "all" && !state.favoritesOnly ? renderShoppingGuide() : ""}
      ${renderSearchBar()}
      ${renderCatalogFilters()}
    </div>
    <main class="mx-auto max-w-5xl px-4 py-6">
      ${!searchActive && state.categoryFilter === "all" ? renderFeaturedCarousel(featured) : ""}
      ${!searchActive && state.categoryFilter === "all" && !state.favoritesOnly ? renderNewArrivals() : ""}
      ${!searchActive && state.categoryFilter === "all" && !state.favoritesOnly ? renderRecentlyViewed() : ""}
      ${!searchActive && state.categoryFilter === "all" && !state.favoritesOnly ? renderAboutStore() : ""}

      <div class="mb-5">
        <h1 class="text-xl font-semibold text-navy-900">${searchActive ? `Resultados para "${escapeHtml(state.searchQuery.trim())}"` : state.favoritesOnly ? "❤ Seus favoritos" : state.categoryFilter === "all" ? "Encontre algo especial para sua fé" : escapeHtml(state.categoryFilter)}</h1>
      </div>

      ${state.products.length === 0 ? `
        <p class="rounded-xl border border-navy-100 bg-white px-4 py-10 text-center text-navy-400 shadow">Nenhum produto disponível no catálogo no momento.</p>
      ` : visibleProducts.length === 0 ? `
        <div class="rounded-xl border border-navy-100 bg-white px-4 py-10 text-center text-navy-500 shadow">${searchActive ? `Nenhum produto encontrado para "${escapeHtml(state.searchQuery.trim())}".<div class="empty-search-help">Tente outro nome, santo, ocasião ou categoria. Se não encontrar, também fazemos encomendas personalizadas.</div><button type="button" data-header-custom-order class="mt-3 rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white">Solicitar orçamento</button>` : state.favoritesOnly ? `Nenhum favorito${state.categoryFilter !== "all" ? ` em "${escapeHtml(state.categoryFilter)}"` : ""} ainda — toque no ❤ de um produto pra guardar aqui.` : "Nenhum produto nessa categoria."}</div>
      ` : `
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          ${visibleProducts.map((p) => renderProductCard(p)).join("")}
        </div>
      `}

      ${!searchActive && state.categoryFilter !== "all" ? renderFeaturedCarousel(featured) : ""}
    </main>
    ${renderFooter()}
    ${renderBackToTopButton()}
    ${renderCartBar()}
    ${state.cartOpen ? renderCartDrawer() : ""}
  `;
  wireCatalogEvents();
}

function renderProductCard(p, opts = {}) {
  const variants = variantsFor(p.id);
  const frames = carouselFrames(p);
  const cardPreviewVariant = !p.photo_url && variants.length > 1 ? bestSellingVariant(p.id) : null;
  const showCardBestSellerTag = !!cardPreviewVariant && isBestSellingVariant(p.id, cardPreviewVariant.id);
  const isFav = !!state.favorites[p.id];
  const availability = productAvailabilityFlags(p);
  const cardStatus = availability.ready ? "ready" : availability.order ? "order" : "sold";
  const cardStatusLabel = cardStatus === "ready" ? "Pronta entrega" : cardStatus === "order" ? "Sob encomenda" : "Esgotado";
  const previewForStock = cardPreviewVariant || variants.find((v) => !v.esgotado && v.in_stock) || null;
  const stockQtyValue = stockQuantity(previewForStock || p);
  const showLowStock = cardStatus === "ready" && stockQtyValue != null && stockQtyValue > 0 && stockQtyValue <= 2;
  const favoriteBtn = `
    <button type="button" data-toggle-favorite="${p.id}" aria-label="${isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}" class="favorite-btn absolute right-1.5 top-1.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-lg shadow transition hover:bg-white">${isFav ? "❤️" : "🤍"}</button>
  `;

  let photoBlock;
  if (frames.length > 1) {
    const idx = (state.cardPhotoIndex[p.id] ?? 0) % frames.length;
    photoBlock = `
      <div class="relative aspect-square w-full overflow-hidden bg-cream-100" data-carousel="${p.id}">
        <button type="button" data-view-product="${p.id}" class="product-image-btn block h-full w-full border-0 p-0 transition hover:opacity-90">
          <img data-carousel-img="${p.id}" src="${frames[idx]}" alt="${escapeHtml(p.name)}" class="h-full w-full object-contain" loading="lazy" decoding="async" />
        </button>
        ${showCardBestSellerTag ? `<span class="best-seller-badge image-badge">Mais vendido</span>` : ""}
        <button type="button" data-carousel-prev="${p.id}" aria-label="Foto anterior" class="carousel-nav-btn absolute left-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-xl font-semibold text-navy-900 shadow">‹</button>
        <button type="button" data-carousel-next="${p.id}" aria-label="Próxima foto" class="carousel-nav-btn absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-xl font-semibold text-navy-900 shadow">›</button>
        ${favoriteBtn}
      </div>
    `;
  } else {
    const photoUrl = cardPreviewVariant?.photo_url || variants[0]?.photo_url || p.photo_url;
    photoBlock = `
      <div class="relative overflow-hidden">
        <button type="button" data-view-product="${p.id}" class="product-image-btn block aspect-square w-full border-0 bg-cream-100 p-0 transition hover:opacity-90">
          ${photoUrl
            ? `<img src="${photoUrl}" alt="${escapeHtml(p.name)}" class="h-full w-full object-contain" loading="lazy" decoding="async" />`
            : `<div class="flex h-full w-full items-center justify-center text-navy-200"><img src="logo-symbol.png" alt="" class="h-10 w-10 opacity-40" /></div>`}
        </button>
        ${showCardBestSellerTag ? `<span class="best-seller-badge image-badge">Mais vendido</span>` : ""}
        ${favoriteBtn}
      </div>
    `;
  }

  const summary = pricingSummary(p);
  const allVariantsSoldOut = variants.length > 0 && variants.every((v) => v.esgotado);
  const availableVariantCount = variants.filter((v) => !v.esgotado).length;
  const esgotadoTag = `<span class="rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-center text-sm font-semibold text-red-700">Esgotado</span>`;

  let addBlock;
  if (variants.length > 0) {
    addBlock = allVariantsSoldOut
      ? `<div class="mt-auto">${esgotadoTag}</div>`
      : `
        <div class="mt-auto">
          <p class="mb-2 text-xs font-medium text-navy-500">${availableVariantCount} ${availableVariantCount === 1 ? "modelo disponível" : "modelos disponíveis"}</p>
          <button type="button" data-view-product="${p.id}" class="large-touch-action view-options-btn w-full rounded-lg bg-gold-500 px-3 py-3 font-semibold text-navy-900 transition hover:bg-gold-400">Ver modelos e comprar</button>
        </div>
      `;
  } else if (p.esgotado) {
    addBlock = `<div class="mt-auto">${esgotadoTag}</div>`;
  } else {
    const key = cartKey(p.id, null);
    const qty = state.cart[key] ?? 0;
    addBlock = qty === 0
      ? `<button data-add="${key}" class="large-touch-action add-to-cart-btn mt-auto rounded-lg bg-gold-500 px-3 py-3 font-semibold text-navy-900 transition hover:bg-gold-400">Adicionar ao pedido</button>`
      : `
        <div class="mt-auto flex items-center justify-between rounded-lg border border-navy-200" style="min-height:48px">
          <button data-qty-minus="${key}" aria-label="Diminuir quantidade" class="qty-btn px-4 py-2 text-xl font-semibold text-navy-700">−</button>
          <span class="text-sm font-semibold text-navy-900">${qty} no pedido</span>
          <button data-qty-plus="${key}" aria-label="Aumentar quantidade" class="qty-btn px-4 py-2 text-xl font-semibold text-navy-700">+</button>
        </div>
      `;
  }

  return `
    <div data-product-card="${p.id}" class="flex flex-col overflow-hidden rounded-xl border border-navy-100 bg-white shadow">
      ${photoBlock}
      <div class="flex flex-1 flex-col gap-2 p-4">
        <div>
          <button type="button" data-view-product="${p.id}" class="block w-full" style="text-align:left">
            <p class="text-base font-semibold leading-snug text-navy-900">${escapeHtml(p.name)}</p>
          </button>
          <div class="mt-1 flex flex-wrap items-center gap-1.5">
            <button data-tag-category="${escapeHtml(p.category && p.category.trim() ? p.category.trim() : "Outros")}" class="category-tag-btn text-xs text-navy-500 hover:text-gold-600 hover:underline">${escapeHtml(p.category && p.category.trim() ? p.category.trim() : "Outros")}</button>
            ${p.material_tag ? `<span class="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-medium text-navy-500 ring-1 ring-navy-100">${escapeHtml(p.material_tag)}</span>` : ""}
          </div>
          <div class="mt-1 flex flex-wrap gap-1.5">
            <span class="availability-chip ${cardStatus === "ready" ? "availability-ready" : cardStatus === "order" ? "availability-order" : "availability-sold"}">${cardStatusLabel}</span>
            ${isNewProduct(p) ? `<span class="new-product-badge">Novidade</span>` : ""}
            ${showLowStock ? `<span class="low-stock-badge">Últimas ${stockQtyValue} unidades</span>` : ""}
          </div>
          ${cardStatus === "order" ? `<p class="mt-1 text-xs text-navy-500">${madeToOrderText(p)}</p>` : ""}
        </div>

        <div class="leading-tight" data-price-block="${p.id}">
          <p>${summary.variable ? `<span class="text-xs font-medium text-navy-500">A partir de </span>` : ""}<span class="text-lg font-semibold text-navy-900">${formatBRL(summary.creditPrice)}</span> <span class="text-[11px] font-normal text-navy-400">em até 3x no crédito</span></p>
          <p class="mt-1 text-sm text-navy-500">ou ${summary.variable ? "a partir de " : ""}<b>${formatBRL(summary.promoPrice)}</b> à vista (Pix ou espécie)</p>
        </div>
        ${variants.length === 0 && !p.in_stock && !p.esgotado ? `<p class="text-xs font-medium text-gold-700">🕑 ${madeToOrderText(p)}</p>` : ""}
        ${addBlock}
      </div>
    </div>
  `;
}

function renderCartBar() {
  const count = cartCount();
  if (count === 0) return "";
  return `
    <div class="fixed inset-x-0 bottom-0 z-20 border-t border-navy-100 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <span class="min-w-0 text-sm text-navy-600">
          <b class="block text-navy-900">Meu pedido · ${count} ${count === 1 ? "item" : "itens"}</b>
          <span>${formatBRL(cartTotal())} · salvo neste aparelho</span>
        </span>
        <button id="open-cart-btn" class="large-touch-action flex-shrink-0 rounded-lg bg-navy-900 px-5 py-2 font-semibold text-white transition hover:bg-navy-800">Continuar</button>
      </div>
    </div>
  `;
}

function renderCartDrawer() {
  const items = cartItems();
  return `
    <div id="cart-overlay" class="fixed inset-0 z-30 bg-navy-950/40">
      <div id="cart-drawer-panel" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title" tabindex="-1" class="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-xl outline-none">
        <div class="flex items-center justify-between border-b border-navy-100 px-4 py-3">
          <h2 id="cart-drawer-title" class="text-lg font-semibold text-navy-900">Meu pedido</h2>
          <button id="close-cart-btn" aria-label="Fechar carrinho" class="rounded px-2 py-1 text-navy-500 hover:bg-navy-50">✕</button>
        </div>
        <div class="flex-1 overflow-y-auto px-4 py-3">
          ${items.length === 0 ? `<p class="py-8 text-center text-navy-400">Seu carrinho está vazio.</p>` : items.map((it) => `
            <div class="flex items-center gap-3 border-b border-navy-50 py-3 last:border-0">
              <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-cream-100">
                ${(it.variant?.photo_url || it.product.photo_url) ? `<img src="${it.variant?.photo_url || it.product.photo_url}" alt="${escapeHtml(it.product.name)}" class="h-full w-full object-contain" />` : ""}
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-navy-900">${escapeHtml(it.product.name)}</p>
                ${it.variant ? `<p class="mt-0.5 text-xs font-medium text-gold-700">Modelo: ${escapeHtml(it.variant.name)}</p>` : ""}
                <p class="mt-0.5 text-xs text-navy-500">${formatBRL(priceFor(it.product, it.variant))} cada</p>
              </div>
              <div class="flex items-center gap-2">
                <button data-qty-minus="${it.key}" aria-label="Diminuir quantidade de ${escapeHtml(it.product.name)}" class="qty-btn rounded border border-navy-200 px-2 text-navy-700">−</button>
                <span class="w-5 text-center text-sm font-semibold" aria-live="polite">${it.quantity}</span>
                <button data-qty-plus="${it.key}" aria-label="Aumentar quantidade de ${escapeHtml(it.product.name)}" class="qty-btn rounded border border-navy-200 px-2 text-navy-700">+</button>
              </div>
            </div>
          `).join("")}
        </div>
        <div class="border-t border-navy-100 px-4 py-4">
          <div class="mb-3 flex items-center justify-between text-sm">
            <span class="text-navy-600">Total (${state.payment === "credito" ? "cartão de crédito" : "pix / à vista"})</span>
            <span class="text-lg font-semibold text-navy-900">${formatBRL(cartTotal())}</span>
          </div>
          <button id="go-checkout-btn" ${items.length === 0 ? "disabled" : ""} class="w-full rounded-lg bg-gold-500 px-4 py-3 text-sm font-semibold text-navy-900 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50">Continuar para finalizar</button>
        </div>
      </div>
    </div>
  `;
}

// Produtos relacionados: prioriza a mesma categoria do produto aberto
// (excluindo ele mesmo); se a categoria tiver poucos produtos, completa
// com outros produtos quaisquer até o limite, pra a seção nunca ficar
// vazia ou esquisitamente curta numa categoria pequena. Só considera
// produtos visíveis no catálogo (mesma base já filtrada em state.products).
function relatedProducts(product, limit = 4) {
  const categoryLabel = product.category && product.category.trim() ? product.category.trim() : "Outros";
  const others = state.products.filter((p) => p.id !== product.id);
  const sameCategory = others.filter((p) => (p.category && p.category.trim() ? p.category.trim() : "Outros") === categoryLabel);
  const rest = others.filter((p) => !sameCategory.includes(p));
  return [...sameCategory, ...rest].slice(0, limit);
}

/* =====================================================================
   PÁGINA INDIVIDUAL DO PRODUTO
   ===================================================================== */
function renderProductDetail() {
  const product = state.products.find((p) => String(p.id) === String(state.detailProductId));

  if (!product) {
    app.innerHTML = `
      ${renderHeader()}
      <main class="mx-auto max-w-3xl px-4 py-16 text-center">
        <p class="mb-4 text-navy-500">Não encontramos esse produto — talvez ele não esteja mais disponível.</p>
        <button id="back-to-catalog-btn" class="rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-800">&larr; Voltar ao catálogo</button>
      </main>
      ${renderFooter()}
    `;
    document.getElementById("back-to-catalog-btn").addEventListener("click", () => {
      state.screen = "catalog";
      state.detailProductId = null;
      history.replaceState({ productId: null }, "", CATALOG_BASE_URL);
      render();
    });
    return;
  }

  addRecentlyViewed(product.id);
  trackEvent("view_item", { item_id: String(product.id), item_name: product.name });

  const variants = variantsFor(product.id);
  const variant = currentVariant(product);
  const previewVariant = previewVariantForDetail(product);
  updateDynamicShareMeta(product, variant || previewVariant);
  const bestSelling = bestSellingVariant(product.id);
  const showingBestSellerPreview = !variant && !!previewVariant && !!bestSelling && previewVariant.id === bestSelling.id;
  const detailPricing = variant ? effectivePricing(product, variant) : pricingSummary(product);
  const key = variant ? cartKey(product.id, variant.id) : null;
  const qty = key ? (state.cart[key] ?? 0) : 0;
  const isInStock = variant ? variant.in_stock : product.in_stock;
  const isEsgotado = variant ? !!variant.esgotado : !!product.esgotado;
  const displayVariant = variant || previewVariant;
  const displayInStock = displayVariant ? !!displayVariant.in_stock : !!product.in_stock;
  const displayEsgotado = displayVariant ? !!displayVariant.esgotado : !!product.esgotado;
  const displayStatusText = displayEsgotado ? "Esgotado" : displayInStock ? "Pronta entrega" : "Sob encomenda";
  const displayStatusClass = displayEsgotado ? "text-red-600" : displayInStock ? "text-emerald-800" : "text-gold-700";
  const galleryPhotos = productGalleryPhotos(product, displayVariant);
  const galleryIndex = Math.min(state.detailGalleryIndex, Math.max(0, galleryPhotos.length - 1));
  const photoUrl = galleryPhotos[galleryIndex] ?? null;
  const categoryLabel = product.category && product.category.trim() ? product.category.trim() : "Outros";
  const hasDescription = product.description && product.description.trim();
  const related = relatedProducts(product);
  const isFav = !!state.favorites[product.id];
  const productReviews = reviewsFor(product.id);
  const avgRating = averageRating(productReviews);
  const selectedVariantPosition = variant ? variants.findIndex((v) => v.id === variant.id) + 1 : 0;

  app.innerHTML = `
    ${renderHeader()}
    <main class="mx-auto w-full max-w-3xl px-4 py-6">
      <button id="back-to-catalog-btn" class="mb-4 text-sm text-navy-600 hover:underline">&larr; Voltar ao catálogo</button>
      <div id="product-detail-panel" class="product-detail-grid">
        <div class="product-media-column">
          <div id="product-main-image-box" class="product-main-image-box relative aspect-square w-full overflow-hidden rounded-xl bg-cream-100">
            ${photoUrl
              ? `<img src="${photoUrl}" alt="${escapeHtml(product.name)}" class="h-full w-full object-contain" loading="eager" fetchpriority="high" decoding="async" />`
              : `<div class="flex h-full w-full items-center justify-center text-navy-200"><img src="logo-symbol.png" alt="" class="h-16 w-16 opacity-40" /></div>`}
            ${showingBestSellerPreview ? `<span class="best-seller-badge image-badge">Mais vendido</span>` : ""}
            <button type="button" data-toggle-favorite="${product.id}" aria-label="${isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}" class="favorite-btn absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-lg shadow transition hover:bg-white">${isFav ? "❤️" : "🤍"}</button>
            ${photoUrl ? `<button type="button" data-zoom-image="${photoUrl}" data-zoom-alt="${escapeHtml(displayVariant?.name || product.name)}" class="zoom-photo-btn" aria-label="Ampliar foto">Ampliar foto</button>` : ""}
            ${displayVariant ? `
              <div class="product-image-title-overlay">
                <span class="title">${escapeHtml(displayVariant.name)}</span>
                <span class="subtitle">${variant ? `Modelo selecionado · ${displayStatusText}` : showingBestSellerPreview ? `Modelo em destaque · ${displayStatusText}` : displayStatusText}</span>
              </div>
            ` : ""}
          </div>
          ${galleryPhotos.length > 1 ? `
            <div class="mt-2 flex flex-wrap gap-1.5">
              ${galleryPhotos.map((url, idx) => `
                <button type="button" data-gallery-index="${idx}" aria-label="Ver foto ${idx + 1}" class="gallery-thumb-btn h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg ring-2 transition ${idx === galleryIndex ? "ring-gold-500" : "ring-transparent hover:ring-navy-200"}">
                  <img src="${url}" alt="" class="h-full w-full object-contain" loading="lazy" decoding="async" />
                </button>
              `).join("")}
            </div>
          ` : ""}

          ${variants.length > 0 ? `
            <section class="variant-thumb-section" aria-label="Escolha do modelo">
              <p class="text-base font-semibold text-navy-900"><span class="checkout-step-badge">1</span>Escolha o modelo</p>
              <p class="mt-1 text-sm text-navy-500">Toque na miniatura desejada para ver a foto em destaque e selecionar o modelo.</p>
              <div class="model-scroll-hint">
                <span>Deslize para ver os demais modelos</span>
                <span>${selectedVariantPosition > 0 ? `${selectedVariantPosition} de ${variants.length}` : `${variants.length} modelos`}</span>
              </div>
              <div class="variant-thumb-row mt-3" role="list" aria-label="Modelos disponíveis">
                ${variants.map((v) => `
                  <button type="button" data-variant-select="${product.id}" data-variant-id="${v.id}" aria-pressed="${variant?.id === v.id ? "true" : "false"}" aria-label="${escapeHtml(v.name)}. ${v.esgotado ? "Esgotado" : v.in_stock ? "Pronta entrega" : "Sob encomenda"}. ${formatBRL(effectivePricing(product, v).promoPrice)} no Pix." class="variant-thumb-btn ${variant?.id === v.id ? "is-selected" : ""} ${v.esgotado ? "is-sold-out" : ""}">
                    ${v.photo_url ? `<img src="${v.photo_url}" alt="${escapeHtml(v.name)}" class="variant-thumb-photo" />` : `<span class="variant-thumb-photo flex items-center justify-center text-lg">◻</span>`}
                    <span class="variant-thumb-name">${escapeHtml(v.name)}</span>
                    ${isBestSellingVariant(product.id, v.id) ? `<span class="best-seller-badge" style="margin-top:4px;" title="Modelo mais escolhido pelos clientes">Mais vendido</span>` : ""}
                    <span class="variant-thumb-price">${formatBRL(effectivePricing(product, v).promoPrice)} no Pix</span>
                    <span class="variant-thumb-status ${v.esgotado ? "text-red-600" : v.in_stock ? "text-emerald-800" : "text-gold-700"}">${v.esgotado ? "Esgotado" : v.in_stock ? "Pronta entrega" : "Sob encomenda"}</span>
                  </button>
                `).join("")}
              </div>
              ${variant ? `
                <button type="button" data-quick-add="${cartKey(product.id, variant.id)}" ${variant.esgotado ? "disabled" : ""}
                  class="quick-model-add large-touch-action rounded-lg bg-gold-500 px-4 py-3 font-semibold text-navy-900 disabled:cursor-not-allowed disabled:opacity-50">
                  ${variant.esgotado ? "Modelo esgotado" : `Comprar este modelo · ${formatBRL(effectivePricing(product, variant).promoPrice)} no Pix`}
                </button>
              ` : `<button type="button" disabled class="quick-model-add large-touch-action rounded-lg bg-navy-50 px-4 py-3 font-semibold text-navy-400">Selecione um modelo</button>`}
              <button type="button" data-model-help="${product.id}" class="context-help-btn">Preciso de ajuda para escolher o modelo</button>
            </section>
          ` : ""}
        </div>
        <div class="flex flex-col gap-3">
          <div>
            <div class="flex items-start justify-between gap-2">
              <h1 class="text-xl font-semibold text-navy-900">${escapeHtml(product.name)}</h1>
              <button type="button" id="share-product-btn" class="share-product-btn flex-shrink-0">Compartilhar</button>
            </div>
            <div class="mt-1 flex flex-wrap items-center gap-1.5">
              <button data-tag-category="${escapeHtml(categoryLabel)}" class="category-tag-btn text-xs text-navy-500 hover:text-gold-600 hover:underline">${escapeHtml(categoryLabel)}</button>
              ${product.material_tag ? `<span class="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-medium text-navy-500 ring-1 ring-navy-100">${escapeHtml(product.material_tag)}</span>` : ""}
            </div>
            ${productReviews.length > 0 ? `
              <button data-scroll-to-reviews class="mt-1.5 flex items-center gap-1 text-sm text-navy-500 hover:text-navy-700">
                <span class="text-amber-500">${starDisplayCatalog(avgRating)}</span>
                <span>${avgRating.toFixed(1)} (${productReviews.length} ${productReviews.length === 1 ? "avaliação" : "avaliações"})</span>
              </button>
            ` : ""}
          </div>

          ${hasDescription ? `
            <details class="product-description-box rounded-xl border border-navy-100 bg-white px-3 py-1" ${window.innerWidth >= 640 ? "open" : ""}>
              <summary>${window.innerWidth >= 640 ? "Descrição" : "Ver descrição completa"}</summary>
              <div class="pb-3 text-justify text-sm leading-relaxed text-navy-600">${escapeHtml(product.description).replace(/\n/g, "<br>")}</div>
            </details>
          ` : ""}

          ${variants.length > 0 ? `
            <section class="selected-model-summary" aria-label="Resumo do modelo escolhido">
              <p class="text-base font-semibold text-navy-900"><span class="checkout-step-badge">1</span>Modelo</p>
              ${variant ? `
                <div class="mt-3 rounded-lg bg-cream-50 px-3 py-3">
                  <div class="flex flex-wrap items-center gap-2">
                    <b class="text-navy-900">${escapeHtml(variant.name)}</b>
                    ${isBestSellingVariant(product.id, variant.id) ? `<span class="best-seller-badge">Mais vendido</span>` : ""}
                  </div>
                  <p class="mt-1 text-sm ${displayStatusClass}">${displayStatusText}</p>
                </div>
              ` : showingBestSellerPreview ? `
                <div class="mt-3 rounded-lg bg-gold-50 px-3 py-3 text-sm font-medium text-gold-800 ring-1 ring-gold-200">Estamos mostrando o modelo mais vendido como destaque. Toque nas miniaturas abaixo para escolher o seu.</div>
              ` : `
                <div class="mt-3 rounded-lg bg-gold-50 px-3 py-3 text-sm font-medium text-gold-800 ring-1 ring-gold-200">Escolha um modelo nas miniaturas para continuar.</div>
              `}
            </section>
          ` : ""}

          <div class="leading-tight">
            <p>${variants.length > 0 && !variant && detailPricing.variable ? `<span class="text-sm font-medium text-navy-500">A partir de </span>` : ""}<span class="text-2xl font-semibold text-navy-900">${formatBRL(detailPricing.creditPrice)}</span> <span class="text-xs font-normal text-navy-400">em até 3x no crédito</span></p>
            <p class="mt-1 text-sm text-navy-500">ou ${variants.length > 0 && !variant && detailPricing.variable ? "a partir de " : ""}<b>${formatBRL(detailPricing.promoPrice)}</b> à vista (Pix ou espécie)</p>
          </div>

          ${variant && !isInStock && !isEsgotado ? `<p class="rounded-lg bg-gold-50 px-3 py-2 text-sm font-medium text-gold-800 ring-1 ring-gold-200">🕑 ${madeToOrderText(product)}</p>` : variants.length === 0 && !isInStock && !isEsgotado ? `<p class="rounded-lg bg-gold-50 px-3 py-2 text-sm font-medium text-gold-800 ring-1 ring-gold-200">🕑 ${madeToOrderText(product)}</p>` : ""}

          ${variants.length > 0 && !variant ? `
            <button type="button" disabled class="large-touch-action mt-2 w-full disabled:cursor-not-allowed rounded-lg bg-navy-50 px-4 py-3 font-semibold text-navy-400">Escolha um modelo para adicionar</button>
          ` : isEsgotado ? `
            <span class="mt-2 inline-block w-fit rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">Esgotado</span>
          ` : qty === 0 ? `
            <button data-add="${key}" class="large-touch-action add-to-cart-btn mt-2 w-full rounded-lg bg-gold-500 px-4 py-3 font-semibold text-navy-900 transition hover:bg-gold-400">Adicionar ao pedido</button>
          ` : `
            <div class="mt-2 flex w-full items-center justify-between rounded-lg border border-navy-200" style="min-height:50px;max-width:230px">
              <button data-qty-minus="${key}" class="qty-btn px-4 py-2.5 text-xl font-semibold text-navy-700">−</button>
              <span class="text-sm font-semibold text-navy-900">${qty} no pedido</span>
              <button data-qty-plus="${key}" class="qty-btn px-4 py-2.5 text-xl font-semibold text-navy-700">+</button>
            </div>
          `}
        </div>
      </div>
      </div>

      <div id="reviews-section" class="mt-10 border-t border-navy-100 pt-8">
        <h2 class="mb-4 text-lg font-semibold text-navy-900">Avaliações${productReviews.length > 0 ? ` (${productReviews.length})` : ""}</h2>

        ${productReviews.length === 0 ? `
          <p class="mb-6 text-sm text-navy-400">Ainda não tem avaliação pra esse produto — seja a primeira pessoa a avaliar!</p>
        ` : `
          <div class="mb-6 flex flex-col gap-3">
            ${productReviews.map((r) => `
              <div class="rounded-xl border border-navy-100 bg-white p-4 shadow-sm">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-sm font-medium text-navy-900">${escapeHtml(r.customer_name)}</p>
                  <span class="text-amber-500 text-sm">${starDisplayCatalog(r.rating)}</span>
                </div>
                ${r.comment ? `<p class="mt-1.5 text-sm text-navy-600">${escapeHtml(r.comment)}</p>` : ""}
              </div>
            `).join("")}
          </div>
        `}

        ${state.reviewForm.submitted ? `
          <p class="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200">✓ Obrigado! Sua avaliação foi enviada e vai aparecer aqui assim que for aprovada.</p>
        ` : `
          <form id="review-form" class="flex max-w-md flex-col gap-3 rounded-xl border border-navy-100 bg-white p-4 shadow-sm">
            <p class="text-sm font-medium text-navy-800">Deixe sua avaliação</p>
            <div class="flex items-center gap-1" id="review-star-picker">
              ${[1, 2, 3, 4, 5].map((n) => `
                <button type="button" data-review-star="${n}" aria-label="${n} estrela${n === 1 ? "" : "s"}" class="review-star-btn text-2xl leading-none ${n <= state.reviewForm.rating ? "text-amber-500" : "text-navy-200"}">★</button>
              `).join("")}
            </div>
            <input id="review-name" placeholder="Seu nome" value="${escapeHtml(state.reviewForm.name)}" class="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200" />
            <textarea id="review-comment" rows="3" placeholder="Comentário (opcional)" class="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200">${escapeHtml(state.reviewForm.comment)}</textarea>
            ${state.reviewForm.error ? `<p class="text-sm text-red-600">${escapeHtml(state.reviewForm.error)}</p>` : ""}
            <button type="submit" ${state.reviewForm.submitting ? "disabled" : ""} class="self-start rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-50">${state.reviewForm.submitting ? "Enviando..." : "Enviar avaliação"}</button>
          </form>
        `}
      </div>

      ${related.length > 0 ? `
        <div class="mt-10">
          <h2 class="mb-1 text-lg font-semibold text-navy-900">Você também pode gostar</h2><p class="mb-3 text-xs text-navy-500">Outras opções relacionadas a este produto</p>
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
            ${related.map((p) => renderProductCard(p, { hideDescription: true })).join("")}
          </div>
        </div>
      ` : ""}
    </main>
    ${renderFooter()}
    ${renderBackToTopButton()}
    ${renderCartBar()}
    ${state.cartOpen ? renderCartDrawer() : ""}
  `;
  document.getElementById("back-to-catalog-btn").addEventListener("click", () => {
    state.screen = "catalog";
    state.detailProductId = null;
    history.replaceState({ productId: null }, "", CATALOG_BASE_URL);
    render();
    requestAnimationFrame(() => window.scrollTo({ top: state.catalogScrollY || 0, left: 0, behavior: "auto" }));
  });
  wireCatalogEvents();
}

function openShareMenu(product) {
  if (!product) return;
  document.getElementById("share-menu-overlay")?.remove();

  const selectedVariant = currentVariant(product);
  const sharedVariant = selectedVariant || bestSellingVariant(product.id);
  const url = productSocialShareUrl(product.id, sharedVariant?.id || null);
  const modelSuffix = sharedVariant?.name ? ` — ${sharedVariant.name}` : "";
  const sharePricing = effectivePricing(product, sharedVariant || null);
  const message = `Olha este produto da Luz Mariana: ${product.name}${modelSuffix}\nÀ vista (Pix ou espécie): ${formatBRL(sharePricing.promoPrice)}`;

  const overlay = document.createElement("div");
  overlay.id = "share-menu-overlay";
  overlay.className = "share-menu-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Compartilhar produto");
  overlay.innerHTML = `
    <div class="share-menu-card" tabindex="-1">
      <button type="button" class="share-menu-close" aria-label="Fechar compartilhamento">×</button>
      <h2 class="pr-10 text-lg font-semibold text-navy-900">Compartilhar produto</h2>
      <p class="mt-1 text-sm text-navy-500">${escapeHtml(product.name)}</p>

      <div class="share-menu-grid">
        <button type="button" class="share-menu-option" data-share-whatsapp>WhatsApp</button>
        <button type="button" class="share-menu-option" data-share-instagram>Instagram</button>
        <button type="button" class="share-menu-option" data-share-email>E-mail</button>
        <button type="button" class="share-menu-option" data-share-copy>Copiar link</button>
      </div>

      ${navigator.share ? `<button type="button" class="share-menu-option mt-3 w-full" data-share-native>Mais opções de compartilhamento</button>` : ""}
      <p class="share-menu-note">No Instagram, o link é copiado e o Instagram é aberto para você colar onde preferir.</p>
    </div>`;

  const close = () => overlay.remove();
  document.body.appendChild(overlay);

  overlay.querySelector(".share-menu-close")?.addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });

  overlay.querySelector("[data-share-whatsapp]")?.addEventListener("click", () => {
    trackEvent("share_product", { item_id: String(product.id), method: "whatsapp" });
    window.open(`https://wa.me/?text=${encodeURIComponent(`${message}\n${url}`)}`, "_blank");
    close();
  });

  overlay.querySelector("[data-share-email]")?.addEventListener("click", () => {
    trackEvent("share_product", { item_id: String(product.id), method: "email" });
    window.location.href = `mailto:?subject=${encodeURIComponent(product.name + " — Luz Mariana")}&body=${encodeURIComponent(`${message}\n\n${url}`)}`;
    close();
  });

  overlay.querySelector("[data-share-copy]")?.addEventListener("click", async () => {
    trackEvent("share_product", { item_id: String(product.id), method: "copy_link" });
    try {
      await navigator.clipboard.writeText(url);
      alert("Link do produto copiado.");
    } catch (_err) {
      window.prompt("Copie o link do produto:", url);
    }
    close();
  });

  overlay.querySelector("[data-share-instagram]")?.addEventListener("click", async () => {
    trackEvent("share_product", { item_id: String(product.id), method: "instagram" });
    try { await navigator.clipboard.writeText(`${message}\n${url}`); } catch (_err) {}
    window.open("https://www.instagram.com/", "_blank");
    close();
  });

  overlay.querySelector("[data-share-native]")?.addEventListener("click", async () => {
    try {
      await navigator.share({ title: product.name, text: message, url });
      trackEvent("share_product", { item_id: String(product.id), method: "native" });
    } catch (_err) {}
    close();
  });

  const esc = (e) => {
    if (e.key === "Escape") {
      close();
      document.removeEventListener("keydown", esc);
    }
  };
  document.addEventListener("keydown", esc);
  overlay.querySelector(".share-menu-card")?.focus();
}

function openPhotoZoom(src, alt) {
  if (!src) return;
  document.getElementById("photo-zoom-overlay")?.remove();
  const overlay = document.createElement("div");
  overlay.id = "photo-zoom-overlay";
  overlay.className = "photo-zoom-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Foto ampliada do produto");
  overlay.innerHTML = `
    <div class="photo-zoom-dialog" tabindex="-1">
      <button type="button" class="photo-zoom-close" aria-label="Fechar foto ampliada">×</button>
      <img src="${src}" alt="${escapeHtml(alt)}" />
    </div>`;
  document.body.appendChild(overlay);
  const dialog = overlay.querySelector(".photo-zoom-dialog");
  const close = () => overlay.remove();
  overlay.querySelector(".photo-zoom-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  const escHandler = (e) => {
    if (e.key === "Escape") {
      close();
      document.removeEventListener("keydown", escHandler);
    }
  };
  document.addEventListener("keydown", escHandler);
  dialog.focus();
}

function showAddToast(key) {
  document.getElementById("catalog-add-toast")?.remove();
  const { productId, variantId } = parseCartKey(key);
  const product = state.products.find((p) => p.id === productId);
  const variant = variantId ? variantsFor(productId).find((v) => v.id === variantId) : null;
  if (!product) return;
  const toast = document.createElement("div");
  toast.id = "catalog-add-toast";
  toast.className = "catalog-add-toast";
  toast.innerHTML = `<b>✓ Adicionado ao pedido</b><br><span style="opacity:.9">${escapeHtml(product.name)}${variant ? ` · ${escapeHtml(variant.name)}` : ""}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}


let deferredInstallPrompt = null;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  setupInstallPromptButton();
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  trackEvent("pwa_installed");
  setupInstallPromptButton();
});

function setupInstallPromptButton() {
  const btn = document.getElementById("install-catalog-btn");
  if (!btn) return;
  btn.classList.toggle("hidden", !deferredInstallPrompt);
  btn.onclick = async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice.catch(() => null);
    trackEvent("pwa_install_prompt", { outcome: choice?.outcome || "unknown" });
    deferredInstallPrompt = null;
    setupInstallPromptButton();
  };
}

function wireGlobalUtilityEvents() {
  document.getElementById("retry-catalog-btn")?.addEventListener("click", async () => {
    state.loading = true;
    state.loadError = null;
    render();
    try { await loadCatalog(); }
    catch (err) {
      state.loading = false;
      state.loadError = err?.message || "Erro inesperado";
      render();
    }
  });

  document.querySelectorAll("[data-open-store-policy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.screen = "storepolicy";
      render();
      window.scrollTo({ top:0, behavior:"auto" });
    });
  });

  document.getElementById("view-all-new")?.addEventListener("click", () => {
    state.sortMode = "newest";
    state.categoryFilter = "all";
    state.favoritesOnly = false;
    render();
    requestAnimationFrame(() => document.getElementById("sort-filter")?.scrollIntoView({ behavior:"smooth", block:"center" }));
  });

  const topBtn = document.getElementById("back-to-top-btn");
  if (topBtn) {
    const update = () => topBtn.classList.toggle("is-visible", window.scrollY > 550);
    update();
    window.onscroll = update;
    topBtn.addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));
  } else {
    window.onscroll = null;
  }

  setupInstallPromptButton();
}

function wireCatalogEvents() {
  wireGlobalUtilityEvents();
  const searchInput = document.getElementById("catalog-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      state.searchQuery = searchInput.value;
      const cursorPos = searchInput.selectionStart;
      render();
      // Re-renderizar troca o elemento do input inteiro — sem isso, cada
      // letra digitada tirava o foco/cursor do campo de busca.
      const freshInput = document.getElementById("catalog-search-input");
      if (freshInput) { freshInput.focus(); freshInput.setSelectionRange(cursorPos, cursorPos); }
    });
  }
  const searchClearBtn = document.getElementById("catalog-search-clear");
  if (searchClearBtn) {
    searchClearBtn.addEventListener("click", () => {
      state.searchQuery = "";
      render();
      const freshInput = document.getElementById("catalog-search-input");
      if (freshInput) freshInput.focus();
    });
  }
  const availabilityFilter = document.getElementById("availability-filter");
  availabilityFilter?.addEventListener("change", () => { state.availabilityFilter = availabilityFilter.value; render(); });
  const priceFilter = document.getElementById("price-filter");
  priceFilter?.addEventListener("change", () => { state.priceFilter = priceFilter.value; render(); });
  const sortFilter = document.getElementById("sort-filter");
  sortFilter?.addEventListener("change", () => { state.sortMode = sortFilter.value; render(); });
  document.getElementById("dismiss-cart-restored")?.addEventListener("click", () => {
    state.cartRestoredNotice = false;
    try { sessionStorage.setItem(CART_RESTORED_SESSION_KEY, "1"); } catch (_err) {}
    render();
  });
  document.getElementById("clear-recently-viewed")?.addEventListener("click", () => {
    try { localStorage.removeItem(RECENT_PRODUCTS_KEY); } catch (_err) {}
    render();
  });
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.add;
      setQty(key, (state.cart[key] ?? 0) + 1);
      showAddToast(key);
      trackEvent("add_to_cart", { cart_key: key });
    });
  });
  document.querySelectorAll("[data-qty-plus]").forEach((btn) => {
    btn.addEventListener("click", () => setQty(btn.dataset.qtyPlus, (state.cart[btn.dataset.qtyPlus] ?? 0) + 1));
  });
  document.querySelectorAll("[data-qty-minus]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.qtyMinus;
      const current = state.cart[key] ?? 0;
      if (current <= 1 && !window.confirm("Remover este item do pedido?")) return;
      setQty(key, current - 1);
    });
  });
  const openBtn = document.getElementById("open-cart-btn");
  if (openBtn) openBtn.addEventListener("click", () => { state.cartOpen = true; render(); });
  const closeBtn = document.getElementById("close-cart-btn");
  if (closeBtn) closeBtn.addEventListener("click", () => { state.cartOpen = false; render(); });
  const overlay = document.getElementById("cart-overlay");
  if (overlay) overlay.addEventListener("click", (e) => { if (e.target === overlay) { state.cartOpen = false; render(); } });
  const checkoutBtn = document.getElementById("go-checkout-btn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", () => {
    trackEvent("begin_checkout", { value: cartTotal(), currency: "BRL", items_count: cartCount() });
    state.screen = "checkout";
    state.cartOpen = false;
    render();
    requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
  });
  manageCartFocus();
  document.querySelectorAll("[data-search-suggestion]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.catalogScrollY = window.scrollY;
      state.screen = "product";
      state.detailProductId = btn.dataset.searchSuggestion;
      state.searchQuery = "";
      syncProductUrl(state.detailProductId, true);
      state.detailGalleryIndex = 0;
      render();
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  });
  document.querySelectorAll(".category-bar-btn").forEach((btn) => {
    btn.addEventListener("click", () => { state.categoryFilter = btn.dataset.category; render(); });
  });
  const favoritesFilterBtn = document.getElementById("favorites-filter-btn");
  if (favoritesFilterBtn) {
    favoritesFilterBtn.addEventListener("click", () => { state.favoritesOnly = !state.favoritesOnly; render(); });
  }
  document.querySelectorAll("[data-toggle-favorite]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(btn.dataset.toggleFavorite);
    });
  });
  const scrollToReviewsBtn = document.querySelector("[data-scroll-to-reviews]");
  if (scrollToReviewsBtn) {
    scrollToReviewsBtn.addEventListener("click", () => {
      document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  const starPicker = document.getElementById("review-star-picker");
  if (starPicker) {
    starPicker.querySelectorAll("[data-review-star]").forEach((starBtn) => {
      starBtn.addEventListener("click", () => {
        const n = Number(starBtn.dataset.reviewStar);
        state.reviewForm.rating = n;
        // Atualiza só a cor das estrelas na hora, sem re-renderizar a
        // página inteira — um render() aqui perderia o que a pessoa já
        // tinha digitado no nome/comentário (o valor só é lido do DOM na
        // hora de enviar, não fica sincronizado com o state a cada tecla).
        starPicker.querySelectorAll("[data-review-star]").forEach((b) => {
          const active = Number(b.dataset.reviewStar) <= n;
          b.classList.toggle("text-amber-500", active);
          b.classList.toggle("text-navy-200", !active);
        });
      });
    });
  }
  const reviewForm = document.getElementById("review-form");
  if (reviewForm) {
    reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("review-name").value.trim();
      const comment = document.getElementById("review-comment").value.trim();
      const rating = state.reviewForm.rating;
      // Guarda o que já foi digitado ANTES de validar — se faltar nome ou
      // nota, o re-render (pra mostrar o erro) não pode apagar o que a
      // pessoa já preencheu.
      state.reviewForm.name = name;
      state.reviewForm.comment = comment;
      if (!name) { state.reviewForm.error = "Digite seu nome."; render(); return; }
      if (!rating) { state.reviewForm.error = "Escolha uma nota de 1 a 5 estrelas."; render(); return; }

      state.reviewForm.submitting = true;
      state.reviewForm.error = null;
      render();

      const { error } = await supabaseClient.from("product_reviews").insert({
        product_id: state.detailProductId,
        customer_name: name,
        rating,
        comment: comment || null,
      });

      state.reviewForm.submitting = false;
      if (error) {
        state.reviewForm.error = "Não foi possível enviar sua avaliação agora. Tente novamente em instantes.";
        render();
        return;
      }
      state.reviewForm.submitted = true;
      render();
      document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  document.querySelectorAll(".category-tag-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.categoryFilter = btn.dataset.tagCategory;
      state.searchQuery = "";
      state.screen = "catalog";
      state.detailProductId = null;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
  document.querySelectorAll(".gallery-thumb-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.detailGalleryIndex = Number(btn.dataset.galleryIndex) || 0;
      render();
    });
  });
  document.querySelectorAll("[data-variant-select]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.variantSelect;
      const row = btn.closest(".variant-thumb-row");
      state.variantScrollLeft[productId] = row ? row.scrollLeft : 0;
      state.selectedVariant[productId] = btn.dataset.variantId;
      state.detailGalleryIndex = 0;
      const currentProductUrl = new URL(window.location.href);
      const currentProduct = state.products.find((p) => String(p.id) === String(productId));
      const currentVariant = variantsFor(productId).find((v) => String(v.id) === String(btn.dataset.variantId));
      currentProductUrl.searchParams.set("produto", currentProduct ? slugifyUrl(currentProduct.name) : productId);
      currentProductUrl.searchParams.set("modelo", currentVariant ? slugifyUrl(currentVariant.name) : btn.dataset.variantId);
      history.replaceState({ productId, variantId: btn.dataset.variantId }, "", currentProductUrl);
      trackEvent("select_model", { product_id: String(productId), variant_id: String(btn.dataset.variantId) });
      render();
      requestAnimationFrame(() => {
        const freshRow = document.querySelector(".variant-thumb-row");
        if (freshRow) freshRow.scrollLeft = state.variantScrollLeft[productId] || 0;
        if (window.innerWidth < 768) {
          document.getElementById("product-main-image-box")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  });
  document.querySelectorAll("[data-view-product]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.catalogScrollY = window.scrollY;
      state.screen = "product";
      state.detailProductId = btn.dataset.viewProduct;
      state.detailGalleryIndex = 0;
      syncProductUrl(state.detailProductId, true);
      trackEvent("select_item", { item_id: String(state.detailProductId) });
      state.reviewForm = { rating: 0, name: "", comment: "", submitting: false, submitted: false, error: null };
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
  document.getElementById("share-product-btn")?.addEventListener("click", () => {
    const product = state.products.find((p) => String(p.id) === String(state.detailProductId));
    openShareMenu(product);
  });
  document.querySelectorAll("[data-zoom-image]").forEach((btn) => {
    btn.addEventListener("click", () => openPhotoZoom(btn.dataset.zoomImage, btn.dataset.zoomAlt || "Foto do produto"));
  });
  document.querySelectorAll("[data-model-help]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = state.products.find((p) => p.id === btn.dataset.modelHelp);
      const message = `Oi! Estou vendo ${product?.name || "um produto"} no catálogo e preciso de ajuda para escolher o modelo.`;
      window.open(`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    });
  });
  document.querySelectorAll("[data-quick-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const key = btn.dataset.quickAdd;
      setQty(key, (state.cart[key] ?? 0) + 1);
      showAddToast(key);
    });
  });
  document.querySelectorAll(".add-variant-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.closest("[data-variant-add-group]");
      const productId = group.dataset.variantAddGroup;
      const select = group.querySelector(".variant-add-select");
      // Segurança extra: o botão já some quando o modelo escolhido está
      // esgotado, mas não custa nada checar de novo antes de adicionar.
      if (select.selectedOptions[0]?.dataset.esgotado === "1") return;
      const variantId = select.value;
      const key = cartKey(productId, variantId);
      setQty(key, (state.cart[key] ?? 0) + 1);
      showAddToast(key);
    });
  });
  // Cada modelo tem seu próprio "pronta entrega / sob encomenda" e
  // "esgotado" agora — ao trocar o modelo escolhido no cartãozinho do
  // produto, atualiza os avisos na hora, sem precisar redesenhar o card
  // inteiro. IMPORTANTE: um produto "em destaque" aparece DUAS vezes na
  // página (na vitrine especial do topo e de novo na grade normal) —
  // então tem que buscar a nota/tag/botão só DENTRO do card que disparou
  // o evento (via [data-product-card], que envolve tudo), nunca com
  // document.querySelector(id), senão a troca de modelo num card acaba
  // atualizando o card ERRADO (o outro "clone" do mesmo produto).
  document.querySelectorAll(".variant-add-select").forEach((select) => {
    select.addEventListener("change", () => {
      const card = select.closest("[data-product-card]");
      if (!card) return;
      const group = select.closest("[data-variant-add-group]");
      const opt = select.selectedOptions[0];
      const inStock = opt?.dataset.inStock === "1";
      const esgotado = opt?.dataset.esgotado === "1";
      const note = card.querySelector("[data-stock-note]");
      if (note) note.classList.toggle("hidden", inStock || esgotado);
      const addBtn = group.querySelector(".add-variant-btn");
      if (addBtn) addBtn.classList.toggle("hidden", esgotado);
      const esgotadoTag = card.querySelector("[data-variant-esgotado-tag]");
      if (esgotadoTag) esgotadoTag.classList.toggle("hidden", !esgotado);
      const creditEl = card.querySelector("[data-price-credit]");
      const promoEl = card.querySelector("[data-price-promo]");
      if (creditEl && opt) creditEl.textContent = formatBRL(Number(opt.dataset.creditPrice));
      if (promoEl && opt) promoEl.textContent = formatBRL(Number(opt.dataset.promoPrice));
    });
  });
  document.querySelectorAll("[data-carousel-prev]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const productId = btn.dataset.carouselPrev;
      stepCarousel(productId, -1);
    });
  });
  document.querySelectorAll("[data-carousel-next]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const productId = btn.dataset.carouselNext;
      stepCarousel(productId, 1);
    });
  });
  setupCarousels();
}

/* =====================================================================
   CHECKOUT
   ===================================================================== */
function captureCheckoutDraft() {
  const nameEl = document.getElementById("ck-name");
  const whatsappEl = document.getElementById("ck-whatsapp");
  const instagramEl = document.getElementById("ck-instagram");
  const notesEl = document.getElementById("ck-notes");
  const shippingCepEl = document.getElementById("ck-shipping-cep");
  const shippingStreetEl = document.getElementById("ck-shipping-street");
  const shippingNumberEl = document.getElementById("ck-shipping-number");
  const shippingNeighborhoodEl = document.getElementById("ck-shipping-neighborhood");
  const shippingCityEl = document.getElementById("ck-shipping-city");
  const shippingStateEl = document.getElementById("ck-shipping-state");
  const shippingComplementEl = document.getElementById("ck-shipping-complement");
  if (nameEl) state.checkoutDraft.name = nameEl.value;
  if (whatsappEl) state.checkoutDraft.whatsapp = whatsappEl.value;
  if (instagramEl) state.checkoutDraft.instagram = instagramEl.value;
  if (notesEl) state.checkoutDraft.notes = notesEl.value;
  if (shippingCepEl) state.checkoutDraft.shippingCep = shippingCepEl.value;
  if (shippingStreetEl) state.checkoutDraft.shippingStreet = shippingStreetEl.value;
  if (shippingNumberEl) state.checkoutDraft.shippingNumber = shippingNumberEl.value;
  if (shippingNeighborhoodEl) state.checkoutDraft.shippingNeighborhood = shippingNeighborhoodEl.value;
  if (shippingCityEl) state.checkoutDraft.shippingCity = shippingCityEl.value;
  if (shippingStateEl) state.checkoutDraft.shippingState = shippingStateEl.value;
  if (shippingComplementEl) state.checkoutDraft.shippingComplement = shippingComplementEl.value;
}

function renderCheckout() {
  const items = cartItems();
  app.innerHTML = `
    ${renderHeader()}
    <main class="mx-auto max-w-lg px-4 py-6">
      <button id="back-to-catalog-btn" class="mb-4 text-sm font-medium text-navy-600 hover:underline">&larr; Voltar e alterar produtos</button>
      <h1 class="text-xl font-semibold text-navy-900">Finalizar pedido</h1>
      <p class="mt-1 mb-4 text-sm text-navy-500">Falta pouco. Confira o pedido, preencha seus dados e nós abriremos o WhatsApp com a mensagem pronta.</p>

      <div class="mb-4 flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-medium text-navy-500">
        <span class="whitespace-nowrap rounded-full bg-navy-900 px-3 py-1.5 text-white">1 Revisar</span><span>›</span>
        <span class="whitespace-nowrap rounded-full bg-gold-500 px-3 py-1.5 text-navy-900">2 Dados</span><span>›</span>
        <span class="whitespace-nowrap rounded-full bg-navy-50 px-3 py-1.5">3 Entrega</span><span>›</span>
        <span class="whitespace-nowrap rounded-full bg-navy-50 px-3 py-1.5">4 Pagamento</span><span>›</span>
        <span class="whitespace-nowrap rounded-full bg-navy-50 px-3 py-1.5">5 WhatsApp</span>
      </div>

      <div class="mb-4 rounded-xl border border-navy-100 bg-white p-4 shadow">
        <p class="mb-2 text-sm font-semibold text-navy-800">Revise seu pedido</p>
        ${items.map((it) => {
          const photo = it.variant?.photo_url || it.product.photo_url || "";
          return `<div class="checkout-review-item">
            ${photo ? `<img src="${photo}" alt="" class="checkout-review-photo" />` : `<div class="checkout-review-photo flex items-center justify-center">✦</div>`}
            <div class="min-w-0">
              <p class="text-sm font-semibold text-navy-900">${escapeHtml(it.product.name)}</p>
              ${it.variant ? `<p class="mt-0.5 text-xs font-medium text-gold-700">Modelo: ${escapeHtml(it.variant.name)}</p>` : ""}
              <div class="mt-2 flex flex-wrap items-center gap-2">
                <div class="inline-flex items-center rounded-lg border border-navy-200 bg-white">
                  <button type="button" data-checkout-qty-minus="${it.key}" aria-label="Diminuir quantidade de ${escapeHtml(it.product.name)}" class="px-3 py-1.5 text-lg font-semibold text-navy-700">−</button>
                  <span class="min-w-[28px] text-center text-sm font-semibold text-navy-900">${it.quantity}</span>
                  <button type="button" data-checkout-qty-plus="${it.key}" aria-label="Aumentar quantidade de ${escapeHtml(it.product.name)}" class="px-3 py-1.5 text-lg font-semibold text-navy-700">+</button>
                </div>
                <button type="button" data-checkout-remove="${it.key}" class="rounded-lg px-2 py-1.5 text-xs font-semibold text-red-600 underline">Remover</button>
              </div>
            </div>
            <span class="self-start text-sm font-semibold text-navy-900">${formatBRL(priceFor(it.product, it.variant) * it.quantity)}</span>
          </div>`;
        }).join("")}
        <div class="mt-3 border-t border-navy-100 pt-3">
          <button type="button" id="checkout-add-more-items"
            class="w-full rounded-lg border border-navy-200 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-700 transition hover:bg-navy-50">
            + Esqueci algo — adicionar mais itens
          </button>
        </div>
        <div id="ck-giftwrap-lines">
          ${selectedGiftWraps().map((g) => `
            <div class="flex items-center justify-between border-b border-navy-50 py-2 text-sm" data-giftwrap-line="${g.id}">
              <span>🎁 ${g.quantity}× ${escapeHtml(g.name)}</span>
              <span class="font-medium text-navy-900">${formatBRL(g.lineTotal)}</span>
            </div>
          `).join("")}
        </div>
        <div id="ck-discount-line" class="flex items-center justify-between border-b border-navy-50 py-2 text-sm text-emerald-800 ${state.appliedCoupon ? "" : "hidden"}">
          <span>Desconto (<span id="ck-discount-code">${state.appliedCoupon ? escapeHtml(state.appliedCoupon.code) : ""}</span>)</span>
          <span id="ck-discount-value">−${formatBRL(discountAmount())}</span>
        </div>
        <div id="ck-shipping-line" class="flex items-center justify-between border-b border-navy-50 py-2 text-sm text-navy-700">
          <span id="ck-shipping-label">${escapeHtml(shippingSummaryText())}</span>
          <span id="ck-shipping-value">${state.shippingMethod === "delivery" && state.shippingQuote?.type === "motoboy" ? (state.shippingQuote.free ? "Grátis" : formatBRL(shippingFeeAmount())) : state.shippingMethod === "pickup" ? "R$ 0,00" : "A calcular"}</span>
        </div>
        <div class="mt-2 flex items-center justify-between border-t border-navy-100 pt-2 text-base font-semibold text-navy-900">
          <span>Total</span>
          <span id="ck-total-value">${formatBRL(orderTotal())}</span>
        </div>
        <div class="mt-1 flex items-center justify-between text-xs font-medium text-gold-700">
          <span>Sinal p/ confirmar o pedido (${Math.round(DEPOSIT_RATE * 100)}%)</span>
          <span id="ck-deposit-value">${formatBRL(orderTotal() * DEPOSIT_RATE)}</span>
        </div>
      </div>

      <form id="checkout-form" class="flex flex-col gap-4 rounded-xl border border-navy-100 bg-white p-4 shadow">
        <p class="text-base font-semibold text-navy-900"><span class="checkout-step-badge">2</span>Seus dados</p>
        <div>
          <label class="mb-1 block text-sm font-semibold text-navy-800">Seu nome <span class="text-red-600">*</span></label>
          <input id="ck-name" required autocomplete="name" value="${escapeHtml(state.checkoutDraft.name)}" class="w-full rounded-lg border border-navy-200 px-3 py-3 text-base outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200" placeholder="Digite seu nome" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-semibold text-navy-800">Seu WhatsApp <span class="text-red-600">*</span></label>
          <input id="ck-whatsapp" required inputmode="tel" autocomplete="tel" value="${escapeHtml(state.checkoutDraft.whatsapp)}" class="w-full rounded-lg border border-navy-200 px-3 py-3 text-base outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200" placeholder="Ex.: (84) 99999-9999" />
          <p id="ck-whatsapp-msg" class="mt-1 text-xs text-navy-400">É pra esse número que vamos confirmar seu pedido.</p>
        </div>
        <div class="rounded-xl border border-navy-100 bg-cream-50 p-3">
          <div id="checkout-shipping-section" class="checkout-section-heading mb-2">
            <label class="block text-base font-semibold text-navy-900"><span class="checkout-step-badge">3</span>Entrega ou retirada</label>
            <button type="button" data-scroll-checkout="checkout-shipping-section" class="checkout-edit-btn">Editar</button>
          </div>
          <p class="mb-3 text-xs text-navy-500">Escolha como deseja receber o pedido.</p>

          <div class="shipping-method-grid">
            <button type="button" data-shipping-method="pickup" class="shipping-method-btn ${state.shippingMethod === "pickup" ? "is-selected" : ""}">Retirada a combinar</button>
            <button type="button" data-shipping-method="delivery" class="shipping-method-btn ${state.shippingMethod === "delivery" ? "is-selected" : ""}">Quero receber</button>
          </div>

          <div id="ck-shipping-fields" class="mt-3 ${state.shippingMethod === "delivery" ? "" : "hidden"}">
            <p class="mb-2 rounded-lg bg-white px-3 py-2 text-xs text-navy-600">
              Até 15 km: <b>entregador/motoboy</b> · acima de 15 km: <b>Correios PAC</b>.
            </p>

            <button type="button" id="ck-use-location" class="large-touch-action mb-2 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 font-semibold text-navy-700">
              Usar minha localização
            </button>
            <p id="ck-shipping-location-status" class="field-inline-status"></p>

            ${loadSavedShippingAddress() ? `
              <div class="saved-address-box">
                <div class="flex items-center justify-between gap-2">
                  <span><b>Endereço salvo neste aparelho</b><br>${escapeHtml([
                    loadSavedShippingAddress().street,
                    loadSavedShippingAddress().number,
                    loadSavedShippingAddress().neighborhood,
                    loadSavedShippingAddress().city,
                    loadSavedShippingAddress().stateUf
                  ].filter(Boolean).join(", "))}</span>
                  <button type="button" id="ck-use-saved-address" class="checkout-edit-btn">Usar</button>
                </div>
              </div>
            ` : ""}
            <p class="mb-2 text-[11px] leading-relaxed text-navy-500">
              Para produtos sob encomenda, o prazo de produção começa após a confirmação do pedido. O prazo da entrega começa após a finalização do pedido.
            </p>
            <div class="mb-2 flex items-center justify-between gap-3">
              <span class="text-xs font-semibold text-navy-700">
                ${state.shippingAddressMode === "manual" ? "Preencha o endereço" : "Informe o CEP"}
              </span>
              <button type="button" id="ck-toggle-address-mode" class="text-xs font-semibold text-navy-700 underline">
                ${state.shippingAddressMode === "manual" ? "Sei meu CEP" : "Não sei meu CEP"}
              </button>
            </div>

            <div class="grid gap-2 sm:grid-cols-[1fr_110px]">
              <div>
                <label for="ck-shipping-cep" class="mb-1 block text-xs font-semibold text-navy-700">
                  CEP ${state.shippingAddressMode === "manual" ? "(opcional)" : "da entrega"}
                </label>
                <input id="ck-shipping-cep" inputmode="numeric" autocomplete="postal-code"
                  value="${escapeHtml(state.checkoutDraft.shippingCep)}"
                  class="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  placeholder="00000-000" />
                <p id="ck-shipping-cep-status" class="mt-1 text-[11px] text-navy-500"></p>
              </div>
              <div>
                <label for="ck-shipping-number" class="mb-1 block text-xs font-semibold text-navy-700">Número</label>
                <input id="ck-shipping-number" inputmode="numeric"
                  value="${escapeHtml(state.checkoutDraft.shippingNumber)}"
                  class="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  placeholder="Nº" />
              </div>
            </div>

            <div class="mt-2">
              <label for="ck-shipping-street" class="mb-1 block text-xs font-semibold text-navy-700">Endereço</label>
              <input id="ck-shipping-street" autocomplete="address-line1"
                value="${escapeHtml(state.checkoutDraft.shippingStreet)}"
                ${state.shippingAddressMode === "cep" ? "readonly" : ""}
                class="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200 ${state.shippingAddressMode === "cep" ? "bg-navy-50" : ""}"
                placeholder="Rua, avenida..." />
            </div>

            <div class="mt-2 grid gap-2 sm:grid-cols-2">
              <div>
                <label for="ck-shipping-neighborhood" class="mb-1 block text-xs font-semibold text-navy-700">Bairro</label>
                <input id="ck-shipping-neighborhood"
                  value="${escapeHtml(state.checkoutDraft.shippingNeighborhood)}"
                  ${state.shippingAddressMode === "cep" ? "readonly" : ""}
                  class="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200 ${state.shippingAddressMode === "cep" ? "bg-navy-50" : ""}"
                  placeholder="Bairro" />
              </div>
              <div>
                <label for="ck-shipping-city" class="mb-1 block text-xs font-semibold text-navy-700">Cidade</label>
                <input id="ck-shipping-city"
                  value="${escapeHtml(state.checkoutDraft.shippingCity)}"
                  ${state.shippingAddressMode === "cep" ? "readonly" : ""}
                  class="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200 ${state.shippingAddressMode === "cep" ? "bg-navy-50" : ""}"
                  placeholder="Cidade" />
              </div>
            </div>

            <div class="mt-2 grid gap-2 sm:grid-cols-[100px_1fr]">
              <div>
                <label for="ck-shipping-state" class="mb-1 block text-xs font-semibold text-navy-700">UF</label>
                <input id="ck-shipping-state" maxlength="2"
                  value="${escapeHtml(state.checkoutDraft.shippingState)}"
                  ${state.shippingAddressMode === "cep" ? "readonly" : ""}
                  class="w-full uppercase rounded-lg border border-navy-200 bg-white px-3 py-2 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200 ${state.shippingAddressMode === "cep" ? "bg-navy-50" : ""}"
                  placeholder="RN" />
              </div>
              <div>
                <label for="ck-shipping-complement" class="mb-1 block text-xs font-semibold text-navy-700">Complemento (opcional)</label>
                <input id="ck-shipping-complement"
                  value="${escapeHtml(state.checkoutDraft.shippingComplement)}"
                  class="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  placeholder="Apartamento, bloco, referência..." />
              </div>
            </div>

            <label class="mt-3 flex items-center gap-2 text-xs text-navy-600">
              <input id="ck-save-address" type="checkbox" ${state.saveShippingAddress ? "checked" : ""} class="h-4 w-4 rounded border-navy-300" />
              Salvar este endereço neste aparelho para a próxima compra
            </label>

            <button type="button" id="ck-calculate-shipping" class="mt-3 large-touch-action w-full rounded-lg bg-navy-900 px-4 py-2.5 font-semibold text-white">Calcular entrega</button>
            <div id="ck-shipping-quote" class="shipping-quote-box mt-3 ${state.shippingQuote?.type === "motoboy" ? "is-ready" : state.shippingQuote?.type === "pac" ? "is-pac" : ""}">
              ${state.shippingQuote
                ? state.shippingQuote.type === "motoboy"
                  ? `<b>Motoboy disponível</b><br>${state.shippingQuote.distanceKm.toFixed(1).replace(".", ",")} km · ${state.shippingQuote.free ? `<span class="shipping-free-badge">Entrega grátis</span>` : `<b>Valor da entrega: ${formatBRL(state.shippingQuote.fee)}</b>`}${state.shippingQuote.address ? `<div class="shipping-address-summary">${escapeHtml(state.shippingQuote.address)}</div>` : ""}<p class="mt-2 text-xs text-navy-600"><b>Prazo:</b> horário combinado após a finalização do pedido.</p>`
                  : state.shippingQuote.type === "pac"
                    ? `<b>Correios PAC</b><br><b>Frete e prazo serão informados antes da confirmação final do pedido.</b>${state.shippingQuote.address ? `<div class="shipping-address-summary">${escapeHtml(state.shippingQuote.address)}</div>` : ""}<p class="mt-2 text-xs text-navy-600"><b>Prazo:</b> contado a partir da finalização do pedido, conforme a cotação dos Correios.</p>`
                    : `Entrega a confirmar pelo WhatsApp.`
                : `${state.shippingAddressMode === "cep" ? "Informe o CEP. O endereço será preenchido automaticamente." : "Preencha o endereço para calcular a entrega."}`}
            </div>
            <p class="mt-2 text-[11px] text-navy-500">Ponto de saída: ${STORE_ORIGIN_ADDRESS} · CEP ${formatCep(STORE_ORIGIN_CEP)}.</p>
          </div>
        </div>

        <div class="rounded-xl border border-navy-100 bg-white p-3 text-sm text-navy-600">
          <p class="font-semibold text-navy-900">Prazos do pedido</p>
          <p class="mt-1"><b>Produção:</b> até 2 dias úteis, contados a partir da confirmação do pedido, quando o item for sob encomenda.</p>
          <p class="mt-1"><b>Entrega:</b> o prazo começa a partir da finalização do pedido. Motoboy tem horário combinado; PAC segue o prazo informado na cotação.</p>
        </div>

        <div>
          <div id="checkout-payment-section" class="checkout-section-heading mb-2">
            <label class="block text-base font-semibold text-navy-900"><span class="checkout-step-badge">4</span>Forma de pagamento</label>
            <button type="button" data-scroll-checkout="checkout-payment-section" class="checkout-edit-btn">Editar</button>
          </div>
          <div class="flex gap-1 rounded-lg border border-navy-200 bg-cream-50 p-1 text-sm">
            <button type="button" data-payment="pix" class="checkout-payment-btn flex-1 rounded-md px-3 py-1.5 font-medium transition ${state.payment === "pix" ? "bg-gold-500 text-navy-900" : "text-navy-600"}">Pix / à vista</button>
            <button type="button" data-payment="credito" class="checkout-payment-btn flex-1 rounded-md px-3 py-1.5 font-medium transition ${state.payment === "credito" ? "bg-gold-500 text-navy-900" : "text-navy-600"}">Cartão de crédito</button>
          </div>
          <div class="mt-2 rounded-lg bg-cream-50 p-3 text-xs text-navy-600">
            <p class="mb-1"><b>Para confirmar hoje: <span id="ck-deposit-note-value">${formatBRL(orderTotal() * DEPOSIT_RATE)}</span></b> (${Math.round(DEPOSIT_RATE * 100)}% do pedido). Esse sinal confirma o pedido e inicia a produção. O restante é combinado na entrega/retirada.</p>
            ${state.payment === "pix" ? `
              <p class="mt-2 text-sm text-navy-600">No celular, toque em <b>Copiar chave Pix</b> e cole no aplicativo do seu banco quando for fazer o sinal.</p>
              <div class="mt-2 flex items-center gap-2">
                <input id="ck-pix-key" readonly value="${STORE_CNPJ}" class="min-w-0 flex-1 rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-sm text-navy-900" />
                <button type="button" id="ck-copy-pix" class="large-touch-action flex-shrink-0 rounded-lg border border-navy-300 bg-white px-3 py-2 font-medium text-navy-700 hover:bg-navy-100">Copiar</button>
              </div>
              <p class="mt-1 text-xs text-navy-400">Chave Pix: CNPJ da Luz Mariana.</p>
            ` : `
              <p class="mt-1 text-[11px] text-navy-400">Pagamento via link de pagamento ou maquineta — combinamos o melhor jeito com você pelo WhatsApp.</p>
            `}
          </div>
          <button type="button" id="checkout-payment-help" class="context-help-btn">Tenho uma dúvida sobre o pagamento</button>
        </div>
        ${state.giftWrapOptions.length > 0 ? `
        <div>
          <label class="flex items-center gap-2 text-sm font-medium text-navy-800">
            <input type="checkbox" id="ck-gift-wrap" ${state.giftWrapWanted ? "checked" : ""} class="rounded border-navy-300 text-gold-500 focus:ring-gold-400" />
            Embalar para presente?
          </label>
          <p class="mt-1 text-xs text-navy-400">Dá pra escolher mais de uma — tipos diferentes, ou mais de uma unidade da mesma.</p>
          <div id="ck-gift-wrap-list" class="mt-2 flex flex-col gap-2 rounded-lg bg-cream-50 p-3 ${state.giftWrapWanted ? "" : "hidden"}">
            ${state.giftWrapOptions.map((g) => `
              <div class="flex items-center justify-between gap-3 text-sm" data-giftwrap-row="${g.id}">
                <div class="flex-1">
                  <p class="font-medium text-navy-800">${escapeHtml(g.name)}</p>
                  <p class="text-xs text-navy-400">${formatBRL(g.price)} cada</p>
                </div>
                <div class="flex items-center gap-2">
                  <button type="button" data-giftwrap-minus="${g.id}" class="giftwrap-qty-btn rounded border border-navy-200 px-2 text-navy-700">−</button>
                  <span data-giftwrap-qty-display="${g.id}" class="w-5 text-center font-semibold">${state.giftWrapQuantities[g.id] || 0}</span>
                  <button type="button" data-giftwrap-plus="${g.id}" class="giftwrap-qty-btn rounded border border-navy-200 px-2 text-navy-700">+</button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
        ` : ""}

        <details class="rounded-lg border border-navy-100 bg-cream-50 px-3 py-2 open:pb-3" ${state.appliedCoupon ? "open" : ""}>
          <summary class="cursor-pointer select-none py-1 text-sm font-medium text-navy-700">Adicionar cupom de desconto ou observação</summary>
          <div class="mt-3 flex flex-col gap-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-navy-800">Cupom de desconto</label>
              <div class="flex gap-2">
                <input id="ck-coupon-input" value="${escapeHtml(state.couponCode || "")}" ${state.appliedCoupon ? "disabled" : ""}
                  class="min-w-0 flex-1 rounded-lg border border-navy-200 px-3 py-2 uppercase outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200 disabled:bg-white disabled:text-navy-400"
                  placeholder="Ex: BEMVINDA5" />
                <button type="button" id="ck-coupon-apply" class="flex-shrink-0 rounded-lg border border-navy-300 bg-white px-3 py-2 text-xs font-medium text-navy-700 hover:bg-navy-100 ${state.appliedCoupon ? "hidden" : ""}">Aplicar</button>
                <button type="button" id="ck-coupon-remove" class="flex-shrink-0 rounded-lg border border-navy-300 bg-white px-3 py-2 text-xs font-medium text-navy-700 hover:bg-navy-100 ${state.appliedCoupon ? "" : "hidden"}">Remover</button>
              </div>
              <p id="ck-coupon-msg" class="mt-1 text-xs"></p>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-navy-800">Observações</label>
              <textarea id="ck-notes" rows="2" class="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200" placeholder="Personalização, recado ou alguma observação...">${escapeHtml(state.checkoutDraft.notes)}</textarea>
            </div>
          </div>
        </details>

        <div id="ck-error" role="alert" aria-live="assertive" class="text-sm font-medium text-red-700"></div>
        <button type="submit" id="ck-submit" class="rounded-lg bg-navy-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-50">Enviar pedido pelo WhatsApp</button>
        <p class="text-center text-xs text-navy-400">O WhatsApp abrirá com seu pedido preenchido. Você só precisa tocar em “Enviar”.</p>
        <p class="text-center text-xs text-navy-400">Ao confirmar, você concorda com a <button type="button" data-open-policy="privacidade" class="underline hover:text-navy-600">Política de Privacidade</button> e os <button type="button" data-open-policy="termos" class="underline hover:text-navy-600">Termos de Uso</button>.</p>
      </form>
    </main>
    ${renderFooter()}
  `;

  document.getElementById("back-to-catalog-btn").addEventListener("click", () => {
    captureCheckoutDraft();
    if (!confirmCheckoutExit()) return;
    trackEvent("checkout_abandonment", { stage: state.checkoutStage, reason: "back_to_catalog" });
    state.screen = "catalog";
    render();
    requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
  });

  document.getElementById("checkout-add-more-items")?.addEventListener("click", () => {
    captureCheckoutDraft();
    state.screen = "catalog";
    render();
    requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
  });

  document.querySelectorAll("[data-checkout-qty-minus]").forEach((btn) => {
    btn.addEventListener("click", () => {
      captureCheckoutDraft();
      const key = btn.dataset.checkoutQtyMinus;
      const next = (state.cart[key] || 0) - 1;
      if (next <= 0) {
        if (!window.confirm("Remover este item do pedido?")) return;
        delete state.cart[key];
      } else state.cart[key] = next;
      saveCartToStorage();
      if (cartCount() === 0) {
        state.screen = "catalog";
        render();
        requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
      } else {
        render();
        requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
      }
    });
  });

  document.querySelectorAll("[data-checkout-qty-plus]").forEach((btn) => {
    btn.addEventListener("click", () => {
      captureCheckoutDraft();
      const key = btn.dataset.checkoutQtyPlus;
      state.cart[key] = (state.cart[key] || 0) + 1;
      saveCartToStorage();
      render();
      requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
    });
  });

  document.querySelectorAll("[data-checkout-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      captureCheckoutDraft();
      if (!window.confirm("Remover este item do pedido?")) return;
      delete state.cart[btn.dataset.checkoutRemove];
      saveCartToStorage();
      if (cartCount() === 0) {
        state.screen = "catalog";
        render();
        requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
      } else {
        render();
        requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
      }
    });
  });
  document.querySelectorAll("[data-shipping-method]").forEach((btn) => {
    btn.addEventListener("click", () => {
      captureCheckoutDraft();
      setCheckoutStage("shipping");
      state.shippingMethod = btn.dataset.shippingMethod;
      if (state.shippingMethod === "pickup") state.shippingQuote = null;
      render();
    });
  });

  document.getElementById("ck-use-location")?.addEventListener("click", () => {
    setCheckoutStage("shipping");
    useCurrentLocationForShipping();
  });

  document.getElementById("ck-use-saved-address")?.addEventListener("click", () => {
    const savedAddress = loadSavedShippingAddress();
    if (!savedAddress) return;
    state.shippingAddressMode = "manual";
    persistShippingAddressFields(savedAddress);
    fillShippingAddressInputs(savedAddress);
    setShippingInputsReadonly(false);
    markShippingQuoteStale("Endereço salvo carregado. Recalculando a entrega…");
    setTimeout(() => calculateShippingQuote(), 400);
  });

  document.getElementById("ck-save-address")?.addEventListener("change", (e) => {
    state.saveShippingAddress = e.target.checked;
  });

  document.getElementById("checkout-edit-products")?.addEventListener("click", () => {
    captureCheckoutDraft();
    state.screen = "catalog";
    render();
    window.scrollTo({ top: state.catalogScrollY || 0, behavior: "auto" });
  });

  document.querySelectorAll("[data-scroll-checkout]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById(btn.dataset.scrollCheckout)?.scrollIntoView({ behavior:"smooth", block:"center" });
    });
  });

  document.getElementById("ck-toggle-address-mode")?.addEventListener("click", () => {
    captureCheckoutDraft();
    state.shippingAddressMode = state.shippingAddressMode === "cep" ? "manual" : "cep";
    state.shippingQuote = null;
    render();
    requestAnimationFrame(() => {
      document.getElementById("ck-shipping-cep")?.focus();
    });
  });

  const shippingCepInput = document.getElementById("ck-shipping-cep");
  let cepLookupTimer = null;
  shippingCepInput?.addEventListener("input", () => {
    setCheckoutStage("shipping");
    shippingCepInput.value = formatCep(shippingCepInput.value);
    state.checkoutDraft.shippingCep = shippingCepInput.value;
    markShippingQuoteStale("CEP alterado. Atualizando o endereço…");

    if (state.shippingAddressMode === "cep") {
      clearTimeout(cepLookupTimer);
      if (normalizeCep(shippingCepInput.value).length === 8) {
        cepLookupTimer = setTimeout(async () => {
          const ok = await autofillShippingFromCep();
          const fields = getShippingAddressFields();
          if (ok && fields.street && fields.number && fields.neighborhood && fields.city && fields.stateUf) {
            calculateShippingQuote();
          }
        }, 250);
      }
    }
  });
  shippingCepInput?.addEventListener("blur", () => {
    if (state.shippingAddressMode === "cep" && normalizeCep(shippingCepInput.value).length === 8) {
      autofillShippingFromCep();
    }
  });

  let shippingRecalcTimer = null;
  const scheduleShippingRecalc = () => {
    if (state.shippingMethod !== "delivery") return;
    clearTimeout(shippingRecalcTimer);
    markShippingQuoteStale();
    const fields = getShippingAddressFields();
    if (fields.street && fields.number && fields.neighborhood && fields.city && fields.stateUf) {
      shippingRecalcTimer = setTimeout(() => calculateShippingQuote(), 1200);
    }
  };

  ["street", "number", "neighborhood", "city", "state", "complement"].forEach((field) => {
    const id = `ck-shipping-${field}`;
    document.getElementById(id)?.addEventListener("input", (e) => {
      const stateMap = {
        street: "shippingStreet",
        number: "shippingNumber",
        neighborhood: "shippingNeighborhood",
        city: "shippingCity",
        state: "shippingState",
        complement: "shippingComplement",
      };
      let value = e.target.value;
      if (field === "state") {
        value = value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2);
        e.target.value = value;
      }
      state.checkoutDraft[stateMap[field]] = value;
      if (field !== "complement") scheduleShippingRecalc();
    });
  });

  document.getElementById("ck-calculate-shipping")?.addEventListener("click", () => {
    setCheckoutStage("shipping");
    calculateShippingQuote();
  });

  document.addEventListener("click", (e) => {
    if (e.target?.id === "ck-continue-manual-shipping") {
      setCheckoutStage("shipping");
      e.target.textContent = "Entrega será confirmada pelo WhatsApp";
      e.target.disabled = true;
    }
  });

  document.querySelectorAll(".checkout-payment-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      captureCheckoutDraft();
      setCheckoutStage("payment");
      state.payment = btn.dataset.payment;
      savePaymentPreference(state.payment);
      render();
    });
  });
  document.getElementById("checkout-form").addEventListener("submit", onSubmitOrder);
  const checkoutWhatsappInput = document.getElementById("ck-whatsapp");
  checkoutWhatsappInput.addEventListener("input", () => {
    checkoutWhatsappInput.value = formatPhoneInputMask(checkoutWhatsappInput.value);
    state.checkoutDraft.whatsapp = checkoutWhatsappInput.value;
  });
  const validateNameLive = () => {
    const el = document.getElementById("ck-name");
    const status = document.getElementById("ck-name-status");
    if (!el || !status) return;
    const ok = el.value.trim().length >= 2;
    status.textContent = el.value ? (ok ? "Nome preenchido." : "Digite seu nome completo ou como prefere ser chamado.") : "";
    status.className = `field-inline-status ${el.value ? (ok ? "is-ok" : "is-error") : ""}`;
  };
  document.getElementById("ck-name")?.addEventListener("input", () => {
    setCheckoutStage("data");
    state.checkoutDraft.name = document.getElementById("ck-name").value;
    validateNameLive();
  });

  const validateWhatsappLive = () => {
    const status = document.getElementById("ck-whatsapp-status");
    if (!status) return;
    const digits = String(checkoutWhatsappInput.value || "").replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
    if (!digits.length) {
      status.textContent = "";
      status.className = "field-inline-status";
      return;
    }
    const ok = digits.length === 10 || digits.length === 11;
    status.textContent = ok ? "WhatsApp válido." : "Informe DDD + número.";
    status.className = `field-inline-status ${ok ? "is-ok" : "is-error"}`;
  };
  checkoutWhatsappInput.addEventListener("input", () => {
    setCheckoutStage("data");
    validateWhatsappLive();
  });
  checkoutWhatsappInput.addEventListener("blur", () => {
    onWhatsappBlur();
    validateWhatsappLive();
  });
  document.getElementById("checkout-payment-help")?.addEventListener("click", () => {
    const message = "Oi! Estou finalizando um pedido no catálogo da Luz Mariana e tenho uma dúvida sobre o pagamento.";
    window.open(`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  });
  document.getElementById("ck-coupon-apply").addEventListener("click", onApplyCoupon);
  document.getElementById("ck-coupon-remove").addEventListener("click", () => resetCouponClientSide(""));

  const copyPixBtn = document.getElementById("ck-copy-pix");
  if (copyPixBtn) {
    copyPixBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(STORE_CNPJ);
      } catch (_err) {
        // Sem permissão de clipboard (ex: navegador dentro de outro app):
        // seleciona o texto pra a pessoa copiar manualmente.
        const pixField = document.getElementById("ck-pix-key");
        if (pixField) { pixField.focus(); pixField.select(); }
      }
      const originalText = copyPixBtn.textContent;
      copyPixBtn.textContent = "Copiado!";
      setTimeout(() => { copyPixBtn.textContent = originalText; }, 1500);
    });
  }

  const giftWrapCheckbox = document.getElementById("ck-gift-wrap");
  const giftWrapList = document.getElementById("ck-gift-wrap-list");
  if (giftWrapCheckbox && giftWrapList) {
    giftWrapCheckbox.addEventListener("change", () => {
      state.giftWrapWanted = giftWrapCheckbox.checked;
      giftWrapList.classList.toggle("hidden", !state.giftWrapWanted);
      if (!state.giftWrapWanted) state.giftWrapQuantities = {};
      updateCheckoutTotals();
    });
    giftWrapList.querySelectorAll("[data-giftwrap-plus]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.giftwrapPlus;
        state.giftWrapQuantities[id] = (state.giftWrapQuantities[id] || 0) + 1;
        updateCheckoutTotals();
      });
    });
    giftWrapList.querySelectorAll("[data-giftwrap-minus]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.giftwrapMinus;
        const next = (state.giftWrapQuantities[id] || 0) - 1;
        if (next <= 0) delete state.giftWrapQuantities[id];
        else state.giftWrapQuantities[id] = next;
        updateCheckoutTotals();
      });
    });
  }
}

/* Atualiza só os valores de total/embalagens na tela de checkout, sem
   recriar o formulário inteiro (recriar apagaria o que a pessoa já
   digitou nos campos de nome/WhatsApp/observações). */
function updateCheckoutTotals() {
  const totalEl = document.getElementById("ck-total-value");
  const depositEl = document.getElementById("ck-deposit-value");
  const linesEl = document.getElementById("ck-giftwrap-lines");
  if (linesEl) {
    linesEl.innerHTML = selectedGiftWraps().map((g) => `
      <div class="flex items-center justify-between border-b border-navy-50 py-2 text-sm" data-giftwrap-line="${g.id}">
        <span>🎁 ${g.quantity}× ${escapeHtml(g.name)}</span>
        <span class="font-medium text-navy-900">${formatBRL(g.lineTotal)}</span>
      </div>
    `).join("");
  }
  const discountLineEl = document.getElementById("ck-discount-line");
  const discountValueEl = document.getElementById("ck-discount-value");
  const discountCodeEl = document.getElementById("ck-discount-code");
  if (discountLineEl) discountLineEl.classList.toggle("hidden", !state.appliedCoupon);
  if (discountValueEl) discountValueEl.textContent = "−" + formatBRL(discountAmount());
  if (discountCodeEl) discountCodeEl.textContent = state.appliedCoupon ? state.appliedCoupon.code : "";

  if (totalEl) totalEl.textContent = formatBRL(orderTotal());
  if (depositEl) depositEl.textContent = formatBRL(orderTotal() * DEPOSIT_RATE);
  const depositNoteEl = document.getElementById("ck-deposit-note-value");
  if (depositNoteEl) depositNoteEl.textContent = formatBRL(orderTotal() * DEPOSIT_RATE);
  const shippingLabelEl = document.getElementById("ck-shipping-label");
  const shippingValueEl = document.getElementById("ck-shipping-value");
  if (shippingLabelEl) shippingLabelEl.textContent = shippingSummaryText();
  if (shippingValueEl) {
    shippingValueEl.textContent = state.shippingMethod === "pickup"
      ? "R$ 0,00"
      : state.shippingQuote?.type === "motoboy"
        ? (state.shippingQuote.free ? "Grátis" : formatBRL(shippingFeeAmount()))
        : "A calcular";
  }

  state.giftWrapOptions.forEach((g) => {
    const qtyDisplay = document.querySelector(`[data-giftwrap-qty-display="${g.id}"]`);
    if (qtyDisplay) qtyDisplay.textContent = state.giftWrapQuantities[g.id] || 0;
  });
}

/* ---------------------------------------------------------------------
   Cupom de desconto — aplicar/remover na tela de checkout.

   Feito com manipulação direta do DOM (sem chamar render()), pelo
   mesmo motivo do resto do checkout: o formulário é "não controlado"
   (nome/whatsapp/instagram/observações só existem no DOM, não em
   `state`), então um render() completo apagaria o que a pessoa já
   tinha digitado.
   --------------------------------------------------------------------- */
function resetCouponClientSide(message) {
  state.appliedCoupon = null;
  const input = document.getElementById("ck-coupon-input");
  const applyBtn = document.getElementById("ck-coupon-apply");
  const removeBtn = document.getElementById("ck-coupon-remove");
  const msgEl = document.getElementById("ck-coupon-msg");
  if (input) input.disabled = false;
  if (applyBtn) { applyBtn.classList.remove("hidden"); applyBtn.disabled = false; applyBtn.textContent = "Aplicar"; }
  if (removeBtn) removeBtn.classList.add("hidden");
  if (msgEl) {
    msgEl.textContent = message || "";
    msgEl.classList.remove("text-emerald-600");
    msgEl.classList.add("text-red-600");
  }
  updateCheckoutTotals();
}

// Aplica um cupom já validado (por validate_coupon OU por
// find_auto_coupon_for_phone) na UI do checkout — extraído de
// onApplyCoupon() pra ser reaproveitado também pela aplicação automática
// (tryAutoApplyCoupon, abaixo), sem duplicar a lógica de "acender" o
// desconto na tela.
function applyCouponFromResult(result, code, whatsappDigits) {
  state.appliedCoupon = {
    id: result.coupon_id,
    code: code.toUpperCase(),
    discount_type: result.discount_type,
    discount_value: Number(result.discount_value),
    max_discount_amount: result.max_discount_amount != null ? Number(result.max_discount_amount) : null,
    validatedWhatsappDigits: whatsappDigits,
  };
  state.couponCode = code.toUpperCase();

  const input = document.getElementById("ck-coupon-input");
  const applyBtn = document.getElementById("ck-coupon-apply");
  const removeBtn = document.getElementById("ck-coupon-remove");
  const msgEl = document.getElementById("ck-coupon-msg");
  if (input) { input.value = state.couponCode; input.disabled = true; }
  if (applyBtn) { applyBtn.classList.add("hidden"); applyBtn.disabled = false; applyBtn.textContent = "Aplicar"; }
  if (removeBtn) removeBtn.classList.remove("hidden");
  if (msgEl) {
    msgEl.textContent = result.message || `Cupom "${state.appliedCoupon.code}" aplicado!`;
    msgEl.classList.remove("text-red-600");
    msgEl.classList.add("text-emerald-600");
  }

  updateCheckoutTotals();
}

// Confere se o WhatsApp que acabou de ser digitado tem direito a algum
// cupom especial cadastrado (ver "Números autorizados" no painel — ex:
// compensação por atraso na entrega) e, se tiver, aplica sozinho — sem
// precisar que o cliente digite nenhum código. Só entra em ação quando
// NENHUM cupom já está aplicado (manual ou automático), pra nunca
// sobrescrever silenciosamente uma escolha que a pessoa já fez.
async function tryAutoApplyCoupon(whatsapp) {
  if (state.appliedCoupon || !whatsapp) return;

  const { data, error } = await supabaseClient.rpc("find_auto_coupon_for_phone", { p_whatsapp: whatsapp });
  if (error) { console.error("find_auto_coupon_for_phone:", error.message); return; }

  const result = Array.isArray(data) ? data[0] : data;
  if (!result) return;

  // Confere de novo bem na hora de aplicar — o whatsapp pode ter mudado
  // de novo enquanto essa consulta estava no ar (RPC assíncrona).
  const whatsappField = document.getElementById("ck-whatsapp");
  const stillSamePhone = whatsappField && normalizeBrPhoneDigits(whatsappField.value.trim()) === normalizeBrPhoneDigits(whatsapp);
  if (!stillSamePhone || state.appliedCoupon) return;

  applyCouponFromResult(result, result.code, normalizeBrPhoneDigits(whatsapp));
}

async function onApplyCoupon() {
  const input = document.getElementById("ck-coupon-input");
  const applyBtn = document.getElementById("ck-coupon-apply");
  const removeBtn = document.getElementById("ck-coupon-remove");
  const msgEl = document.getElementById("ck-coupon-msg");
  if (!input || !msgEl) return;

  const code = input.value.trim();
  state.couponCode = code;

  if (!code) {
    msgEl.textContent = "Informe o código do cupom.";
    msgEl.classList.remove("text-emerald-600");
    msgEl.classList.add("text-red-600");
    return;
  }

  const whatsappField = document.getElementById("ck-whatsapp");
  const whatsappRaw = whatsappField ? whatsappField.value.trim() : "";
  const whatsapp = formatWhatsappBR(whatsappRaw) || whatsappRaw;
  if (!whatsapp) {
    msgEl.textContent = "Informe seu WhatsApp acima antes de aplicar o cupom.";
    msgEl.classList.remove("text-emerald-600");
    msgEl.classList.add("text-red-600");
    return;
  }

  if (applyBtn) { applyBtn.disabled = true; applyBtn.textContent = "Verificando..."; }
  msgEl.textContent = "Verificando cupom...";
  msgEl.classList.remove("text-emerald-600", "text-red-600");

  const { data, error } = await supabaseClient.rpc("validate_coupon", { p_code: code, p_whatsapp: whatsapp });
  const result = Array.isArray(data) ? data[0] : data;

  if (error || !result || !result.valid) {
    state.appliedCoupon = null;
    if (applyBtn) { applyBtn.disabled = false; applyBtn.textContent = "Aplicar"; }
    msgEl.textContent = error ? "Não foi possível validar o cupom agora. Tente de novo." : (result && result.message) || "Cupom inválido.";
    msgEl.classList.remove("text-emerald-600");
    msgEl.classList.add("text-red-600");
    return;
  }

  applyCouponFromResult(result, code, normalizeBrPhoneDigits(whatsapp));
}

/* ---------------------------------------------------------------------
   Ao sair do campo de WhatsApp: já formata o número com o +55 e, se
   reconhecer que essa pessoa já comprou antes (mesmo número, mesmo que
   cadastrado num formato diferente), preenche sozinho o nome e o
   instagram informados da primeira vez — só nos campos que ainda
   estiverem vazios, pra não sobrescrever o que a pessoa já digitou.
   --------------------------------------------------------------------- */
async function onWhatsappBlur() {
  const whatsappField = document.getElementById("ck-whatsapp");
  const msgEl = document.getElementById("ck-whatsapp-msg");
  if (!whatsappField || !msgEl) return;

  const raw = whatsappField.value.trim();
  if (!raw) { msgEl.textContent = ""; return; }

  const formatted = formatWhatsappBR(raw);
  if (formatted) whatsappField.value = formatted;

  // Se já tinha um cupom aplicado pra um WhatsApp diferente do que está
  // no campo agora, remove o cupom — a validação (principalmente a
  // regra de "só na primeira compra") foi feita pro número anterior e
  // pode não valer mais pra esse.
  if (state.appliedCoupon) {
    const currentDigits = normalizeBrPhoneDigits(formatted || raw);
    if (currentDigits !== state.appliedCoupon.validatedWhatsappDigits) {
      resetCouponClientSide("Cupom removido: o WhatsApp foi alterado. Aplique o cupom novamente se ainda for válido.");
    }
  }

  // Cupom automático: se não sobrou nenhum cupom aplicado agora (nem o
  // que acabou de ser removido acima, nem nenhum outro), confere se esse
  // WhatsApp tem direito a um cupom especial e aplica sozinho — sem
  // precisar digitar código nenhum.
  if (!state.appliedCoupon) {
    await tryAutoApplyCoupon(formatted || raw);
  }

  msgEl.textContent = "Verificando...";

  const { data, error } = await supabaseClient.rpc("lookup_customer_by_phone", { p_whatsapp: formatted || raw });

  if (error) {
    console.error("lookup_customer_by_phone:", error.message);
    msgEl.textContent = "";
    return;
  }

  const found = Array.isArray(data) ? data[0] : data;
  if (found) {
    const nameField = document.getElementById("ck-name");
    const instaField = document.getElementById("ck-instagram");
    if (nameField && !nameField.value.trim() && found.name) nameField.value = found.name;
    if (instaField && !instaField.value.trim() && found.instagram) instaField.value = found.instagram;
    msgEl.textContent = found.name ? `Bem-vindo(a) de volta, ${found.name}! Já preenchemos seus dados.` : "Bem-vindo(a) de volta! Já preenchemos seus dados.";
    msgEl.classList.add("text-emerald-600");
  } else {
    msgEl.textContent = "";
    msgEl.classList.remove("text-emerald-600");
  }
}

function showCheckoutFieldError(message, fieldId) {
  const errorEl = document.getElementById("ck-error");
  if (errorEl) errorEl.textContent = message;
  const field = fieldId ? document.getElementById(fieldId) : null;
  if (field) {
    field.setAttribute("aria-invalid", "true");
    field.focus({ preventScroll: true });
    field.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

async function onSubmitOrder(e) {
  e.preventDefault();
  captureCheckoutDraft();
  const errorEl = document.getElementById("ck-error");
  const submitBtn = document.getElementById("ck-submit");
  const name = document.getElementById("ck-name").value.trim();
  // Garante o +55 na frente mesmo que a pessoa tenha enviado o formulário
  // sem sair do campo de WhatsApp (o que dispararia a formatação sozinha).
  const whatsapp = formatWhatsappBR(document.getElementById("ck-whatsapp").value.trim()) || document.getElementById("ck-whatsapp").value.trim();
  const instagram = "";
  const notes = document.getElementById("ck-notes")?.value.trim() || "";

  document.getElementById("ck-name")?.removeAttribute("aria-invalid");
  document.getElementById("ck-whatsapp")?.removeAttribute("aria-invalid");
  if (!name) { showCheckoutFieldError("Digite seu nome para continuar.", "ck-name"); return; }
  const whatsappDigits = String(document.getElementById("ck-whatsapp").value || "").replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
  if (whatsappDigits.length < 10 || whatsappDigits.length > 11) {
    showCheckoutFieldError("Informe um WhatsApp válido com DDD, por exemplo: (84) 99999-9999.", "ck-whatsapp");
    return;
  }
  const items = cartItems();
  if (items.length === 0) { showCheckoutFieldError("Seu pedido está vazio. Adicione um produto para continuar."); return; }
  const giftWraps = selectedGiftWraps();
  if (state.giftWrapWanted && giftWraps.length === 0) {
    showCheckoutFieldError("Escolha ao menos uma embalagem ou desmarque “Embalar para presente?”.", "ck-gift-wrap");
    return;
  }

  if (state.shippingMethod === "delivery") {
    const fields = getShippingAddressFields();

    if (state.shippingAddressMode === "cep" && fields.cep.length !== 8) {
      showCheckoutFieldError("Informe um CEP válido ou toque em “Não sei meu CEP”.", "ck-shipping-cep");
      return;
    }
    if (!fields.street) {
      showCheckoutFieldError("Informe o endereço da entrega.", "ck-shipping-street");
      return;
    }
    if (!fields.number) {
      showCheckoutFieldError("Informe o número do endereço de entrega.", "ck-shipping-number");
      return;
    }
    if (!fields.neighborhood) {
      showCheckoutFieldError("Informe o bairro da entrega.", "ck-shipping-neighborhood");
      return;
    }
    if (!fields.city) {
      showCheckoutFieldError("Informe a cidade da entrega.", "ck-shipping-city");
      return;
    }
    if (!fields.stateUf || fields.stateUf.length !== 2) {
      showCheckoutFieldError("Informe a UF com 2 letras, por exemplo RN.", "ck-shipping-state");
      return;
    }

    persistShippingAddressFields(fields);
    if (state.saveShippingAddress) saveShippingAddressLocally(fields);

    if (!state.shippingQuote || state.shippingQuoteStale) await calculateShippingQuote();
    if (!state.shippingQuote) {
      showCheckoutFieldError("Não foi possível calcular a entrega. Tente novamente ou escolha retirada.", "ck-shipping-street");
      return;
    }
  }

  errorEl.textContent = "";
  state.checkoutSubmitted = true;
  setCheckoutStage("whatsapp");
  trackEvent("checkout_submit", {
    shipping_method: state.shippingMethod,
    shipping_type: state.shippingQuote?.type || "pickup",
    value: orderTotal(),
    currency: "BRL"
  });
  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando pedido...";

  // Abre a aba do WhatsApp já agora (síncrono, ligado ao clique) pra não
  // ser bloqueada como pop-up depois do "await" do envio pro Supabase.
  const waWindow = window.open("", "_blank");

  const orderId = crypto.randomUUID();
  const subtotal = cartTotal() + giftWraps.reduce((sum, g) => sum + g.lineTotal, 0);
  const discount = discountAmount();
  const shippingFee = shippingFeeAmount();
  const total = Math.max(0, subtotal - discount + shippingFee);
  const coupon = state.appliedCoupon;

  const shippingNote = state.shippingMethod === "pickup"
    ? "Retirada a combinar"
    : state.shippingQuote?.type === "motoboy"
      ? `Entrega por motoboy: ${state.shippingQuote.distanceKm.toFixed(1)} km, valor ${state.shippingQuote.free ? "Grátis" : formatBRL(state.shippingQuote.fee)}. Endereço: ${state.shippingQuote.address || ""}${state.checkoutDraft.shippingComplement ? `, complemento: ${state.checkoutDraft.shippingComplement}` : ""}`
      : state.shippingQuote?.type === "pac"
        ? `Envio Correios PAC, valor a calcular. Endereço: ${state.shippingQuote.address || ""}${state.checkoutDraft.shippingComplement ? `, complemento: ${state.checkoutDraft.shippingComplement}` : ""}`
        : `Entrega a confirmar. Endereço: ${[
            state.checkoutDraft.shippingStreet,
            state.checkoutDraft.shippingNumber,
            state.checkoutDraft.shippingNeighborhood,
            state.checkoutDraft.shippingCity,
            state.checkoutDraft.shippingState,
            state.checkoutDraft.shippingCep ? `CEP ${state.checkoutDraft.shippingCep}` : ""
          ].filter(Boolean).join(", ")}.`;
  const orderNotes = [notes, shippingNote].filter(Boolean).join(" | ");

  const { error: orderError } = await supabaseClient.from("orders").insert({
    id: orderId,
    customer_name: name,
    customer_whatsapp: whatsapp,
    customer_instagram: instagram || null,
    payment_method: state.payment,
    notes: orderNotes || null,
    total,
    coupon_id: coupon ? coupon.id : null,
    coupon_code: coupon ? coupon.code : null,
    discount_amount: discount > 0 ? discount : null,
  });
  // De propósito SEM .select() encadeado aqui: pedir a linha de volta
  // (RETURNING) exigiria uma política de leitura pública em "orders",
  // que abriria todos os pedidos de todo mundo pra leitura. O número do
  // pedido é buscado à parte logo abaixo, por uma função que só devolve
  // esse único número (ver get_order_number no supabase-schema.sql).

  if (orderError) {
    if (waWindow) waWindow.close();
    state.checkoutSubmitted = false;
    errorEl.textContent = "Não foi possível registrar o pedido: " + orderError.message;
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar pedido pelo WhatsApp";
    return;
  }

  let orderNumber = null;
  const { data: orderNumberData, error: orderNumberError } = await supabaseClient.rpc("get_order_number", { p_order_id: orderId });
  if (orderNumberError) {
    console.error("Erro ao buscar número do pedido:", orderNumberError.message);
    // Não trava o fluxo por isso — o pedido já foi criado de verdade, só
    // o número pra mostrar/rastrear na hora que pode faltar.
  } else {
    orderNumber = orderNumberData;
  }

  const itemRows = items.map((it) => ({
    order_id: orderId,
    product_id: it.product.id,
    product_name: it.product.name,
    variant_name: it.variant ? it.variant.name : null,
    unit_price: priceFor(it.product, it.variant),
    quantity: it.quantity,
  }));
  const { error: itemsError } = await supabaseClient.from("order_items").insert(itemRows);
  if (itemsError) {
    console.error("Erro ao salvar itens do pedido:", itemsError.message);
    // O pedido em si já foi criado — segue o fluxo mesmo assim, a loja
    // ainda recebe a mensagem completa no WhatsApp.
  }

  if (giftWraps.length > 0) {
    const giftWrapRows = giftWraps.map((g) => ({
      order_id: orderId,
      material_id: g.id,
      material_name: g.name,
      quantity: g.quantity,
      unit_price: g.price,
    }));
    const { error: giftWrapError } = await supabaseClient.from("order_gift_wraps").insert(giftWrapRows);
    if (giftWrapError) {
      console.error("Erro ao salvar embalagens do pedido:", giftWrapError.message);
      // Mesma lógica: o pedido já foi criado, segue o fluxo mesmo assim.
    }
  }

  // Cadastra (ou atualiza) o cliente no painel automaticamente. Se essa
  // pessoa já tinha comprado antes (mesmo WhatsApp), não duplica — só
  // completa o instagram, se informado agora. Isso não deve travar o
  // fluxo de compra mesmo se der algum problema.
  const { error: customerError } = await supabaseClient.rpc("upsert_customer_from_order", {
    p_name: name,
    p_whatsapp: whatsapp,
    p_instagram: instagram || null,
  });
  if (customerError) {
    console.error("Erro ao cadastrar cliente automaticamente:", customerError.message);
  }

  // Se um cupom foi usado (manual ou automático), marca esse WhatsApp
  // como "já usou" — só tem efeito de verdade em cupons restritos por
  // telefone (ver coupon_allowed_phones); pra cupons normais, é um
  // no-op seguro (não encontra nenhuma linha pra atualizar).
  if (coupon) {
    const { error: markUsedError } = await supabaseClient.rpc("mark_coupon_phone_used", {
      p_coupon_id: coupon.id, p_whatsapp: whatsapp, p_order_id: orderId,
    });
    if (markUsedError) {
      console.error("mark_coupon_phone_used:", markUsedError.message);
    }
  }

  const message = buildWhatsAppMessage({
    name, whatsapp, instagram, notes, items, subtotal, discount,
    couponCode: coupon ? coupon.code : null, total, payment: state.payment, giftWraps,
    shippingMethod: state.shippingMethod, shippingQuote: state.shippingQuote,
    shippingComplement: state.checkoutDraft.shippingComplement
  });
  const waUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  if (waWindow) waWindow.location.href = waUrl;
  else window.open(waUrl, "_blank");

  state.cart = {};
  saveCartToStorage();
  state.giftWrapWanted = false;
  state.giftWrapQuantities = {};
  state.couponCode = "";
  state.appliedCoupon = null;
  state.checkoutDraft = {
    name: "", whatsapp: "", instagram: "", notes: "",
    shippingCep: "", shippingStreet: "", shippingNumber: "",
    shippingNeighborhood: "", shippingCity: "", shippingState: "",
    shippingComplement: ""
  };
  state.shippingMethod = "pickup";
  state.shippingAddressMode = "cep";
  state.shippingQuote = null;
  state.shippingQuoteStale = false;
  state.saveShippingAddress = false;
  state.lastOrderNumber = orderNumber;
  state.lastOrderWhatsapp = whatsapp;
  state.screen = "success";
  render();
}

function buildWhatsAppMessage({
  name, whatsapp, instagram, notes, items, subtotal, discount, couponCode,
  total, payment, giftWraps, shippingMethod, shippingQuote, shippingComplement
}) {
  const lines = [];
  lines.push(`Olá! Gostaria de fazer um pedido pelo Catálogo Luz Mariana:`);
  lines.push("");
  items.forEach((it) => {
    const variantLabel = it.variant ? ` (${it.variant.name})` : "";
    lines.push(`• ${it.quantity}x ${it.product.name}${variantLabel} — ${formatBRL(priceFor(it.product, it.variant) * it.quantity)}`);
  });
  (giftWraps || []).forEach((g) => {
    lines.push(`🎁 ${g.quantity}x ${g.name} (embalagem p/ presente) — ${formatBRL(g.lineTotal)}`);
  });
  lines.push("");
  if (discount > 0) {
    lines.push(`Subtotal: ${formatBRL(subtotal)}`);
    lines.push(`Cupom ${couponCode}: −${formatBRL(discount)}`);
  }

  if (shippingMethod === "pickup") {
    lines.push(`Entrega/retirada: Retirada a combinar`);
  } else if (shippingQuote?.type === "motoboy") {
    lines.push(`Entrega: Motoboy — ${shippingQuote.distanceKm.toFixed(1).replace(".", ",")} km — ${shippingQuote.free ? "Grátis" : formatBRL(shippingQuote.fee)}`);
    lines.push(`Endereço: ${shippingQuote.address}${shippingComplement ? `, ${shippingComplement}` : ""}`);
  } else if (shippingQuote?.type === "pac") {
    lines.push(`Entrega: Correios PAC — frete a calcular`);
    lines.push(`Endereço: ${shippingQuote.address}${shippingComplement ? `, ${shippingComplement}` : ""}`);
  } else {
    lines.push(`Entrega: A confirmar pelo WhatsApp`);
  }

  lines.push(`Total${shippingQuote?.type === "pac" ? " parcial (sem PAC)" : ""}: ${formatBRL(total)}`);
  lines.push(`Sinal para confirmar o pedido (${Math.round(DEPOSIT_RATE * 100)}%): ${formatBRL(total * DEPOSIT_RATE)}`);
  lines.push(`Pagamento: ${payment === "credito" ? "Cartão de crédito" : "Pix / à vista"}`);
  if (payment === "pix") {
    lines.push(`Chave Pix (CNPJ): ${STORE_CNPJ}`);
  } else {
    lines.push(`Combinar link de pagamento ou maquineta.`);
  }
  lines.push("");
  lines.push(`Nome: ${name}`);
  lines.push(`WhatsApp: ${whatsapp}`);
  if (instagram) lines.push(`Instagram: @${instagram}`);
  if (notes) lines.push(`Observações: ${notes}`);
  return lines.join("\n");
}

/* =====================================================================
   SUCESSO
   ===================================================================== */
function renderSuccess() {
  app.innerHTML = `
    ${renderHeader()}
    <main class="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
      <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">✓</div>
      <h1 class="mb-2 text-xl font-semibold text-navy-900">Pedido enviado!</h1>
      ${state.lastOrderNumber ? `<p class="mb-1 text-sm font-medium text-navy-800">Pedido Nº ${String(state.lastOrderNumber).padStart(6, "0")}</p>` : ""}
      <p class="mb-4 text-sm text-navy-600">Confira a aba do WhatsApp que abriu e toque em "Enviar". O pedido só é considerado confirmado depois que a mensagem chegar à Luz Mariana e, quando houver sinal, após a confirmação do pagamento.</p>
      <div class="mb-6 w-full rounded-xl border border-navy-100 bg-white p-4 text-left shadow-sm">
        <p class="font-semibold text-navy-900">Próximos passos</p>
        <ol class="mt-2 space-y-2 text-sm text-navy-600">
          <li><b>1.</b> Envie a mensagem que já abrimos no WhatsApp.</li>
          <li><b>2.</b> A loja confirma disponibilidade, produção, entrega e o sinal do pedido, quando aplicável.</li>
          <li><b>3.</b> A produção começa após a confirmação do pedido. O prazo de entrega começa após a finalização do pedido.</li>
          <li><b>4.</b> Depois da confirmação, você pode acompanhar o andamento pelo número do pedido.</li>
        </ol>
      </div>
      <div class="flex flex-col gap-2 sm:flex-row">
        <button id="new-order-btn" class="rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-900 transition hover:bg-gold-400">Fazer novo pedido</button>
        ${state.lastOrderNumber ? `<button id="track-this-order-btn" class="rounded-lg border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-700 transition hover:bg-navy-50">Acompanhar meu pedido</button>` : ""}
      </div>
    </main>
    ${renderFooter()}
    ${renderBackToTopButton()}
  `;
  document.getElementById("new-order-btn").addEventListener("click", () => { state.screen = "catalog"; render(); });
  const trackBtn = document.getElementById("track-this-order-btn");
  if (trackBtn) {
    trackBtn.addEventListener("click", () => {
      state.trackWhatsapp = state.lastOrderWhatsapp;
      state.trackResults = null;
      state.trackError = null;
      state.screen = "track";
      render();
      searchTrackedOrder();
    });
  }
}

/* =====================================================================
   RASTREAR PEDIDO
   ===================================================================== */
// Busca todos os pedidos feitos com um WhatsApp, via função pública do
// banco (track_orders_by_phone) — devolve só nome/instagram-like dados
// do próprio pedido, nunca a lista de todos os pedidos da loja, então
// não dá pra "passear" pelos pedidos de outras pessoas sem saber o
// WhatsApp usado na compra delas. Mesmo padrão de segurança já usado
// aqui pra "lookup_customer_by_phone".
async function searchTrackedOrder() {
  if (!state.trackWhatsapp.trim()) {
    state.trackError = "Preencha o WhatsApp usado na compra.";
    state.trackResults = null;
    render();
    return;
  }
  state.trackLoading = true;
  state.trackError = null;
  state.trackResults = null;
  render();

  const whatsappFormatted = formatWhatsappBR(state.trackWhatsapp.trim()) || state.trackWhatsapp.trim();
  const { data, error } = await supabaseClient.rpc("track_orders_by_phone", {
    p_whatsapp: whatsappFormatted,
  });

  state.trackLoading = false;
  if (error) {
    state.trackError = "Não foi possível buscar seus pedidos agora. Tente novamente em instantes.";
    render();
    return;
  }
  const results = Array.isArray(data) ? data : data ? [data] : [];
  if (results.length === 0) {
    state.trackError = "Nenhum pedido encontrado pra esse WhatsApp. Confira se digitou o número usado na compra.";
    render();
    return;
  }
  state.trackResults = results;
  render();
}

const ORDER_STATUS_LABEL = { novo: "Recebido", em_andamento: "Em andamento", concluido: "Concluído", cancelado: "Cancelado" };
// Passos do "andamento" do pedido, na ordem — usado só pra desenhar a
// linha do tempo visual. Pedido cancelado não segue essa linha (mostra
// um aviso à parte, não uma etapa "concluída antes da hora").
const ORDER_TRACK_STEPS = [
  { key: "criado", label: "Pedido recebido" },
  { key: "aceito", label: "Aceito pela loja" },
  { key: "fabricacao", label: "Em preparação" },
  { key: "concluido", label: "Concluído" },
];
function trackStepsReached(order) {
  if (order.status === "cancelado") return [];
  const reached = ["criado"];
  if (order.accepted_at) reached.push("aceito");
  if (order.sent_to_manufacturer_at) reached.push("fabricacao");
  if (order.status === "concluido") reached.push("concluido");
  return reached;
}

function renderTrackForm() {
  return `
    <form id="track-form" class="flex flex-col gap-4 rounded-xl border border-navy-100 bg-white p-4 shadow">
      <div>
        <label class="mb-1 block text-sm font-medium text-navy-700">WhatsApp usado na compra</label>
        <input id="track-whatsapp" inputmode="tel" placeholder="(11) 91234-5678" value="${escapeHtml(state.trackWhatsapp)}" class="w-full rounded-lg border border-navy-200 px-3 py-2 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200" />
      </div>
      ${state.trackError ? `<p class="text-sm text-red-600">${escapeHtml(state.trackError)}</p>` : ""}
      <button type="submit" id="track-submit" ${state.trackLoading ? "disabled" : ""} class="rounded-lg bg-navy-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-50">${state.trackLoading ? "Buscando..." : "Buscar pedidos"}</button>
    </form>
  `;
}

function renderTrackOrderCard(order) {
  const reached = trackStepsReached(order);
  return `
    <div class="flex flex-col gap-4 rounded-xl border border-navy-100 bg-white p-4 shadow">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 class="text-base font-semibold text-navy-900">Pedido Nº ${String(order.order_number).padStart(6, "0")}</h2>
        <span class="rounded-full px-2.5 py-1 text-xs font-medium ${order.status === "cancelado" ? "bg-red-100 text-red-700" : order.status === "concluido" ? "bg-emerald-100 text-emerald-800" : "bg-gold-100 text-gold-800"}">${ORDER_STATUS_LABEL[order.status] || order.status}</span>
      </div>

      ${order.status === "cancelado" ? `
        <p class="text-sm text-red-600">Este pedido foi cancelado. Qualquer dúvida, fale com a gente pelo WhatsApp.</p>
      ` : `
        <ol class="flex flex-col gap-2">
          ${ORDER_TRACK_STEPS.map((step) => {
            const done = reached.includes(step.key);
            return `
              <li class="flex items-center gap-2 text-sm ${done ? "text-navy-900" : "text-navy-300"}">
                <span class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${done ? "bg-emerald-500 text-white" : "bg-navy-100"}">${done ? "✓" : ""}</span>
                ${escapeHtml(step.label)}
              </li>
            `;
          }).join("")}
        </ol>
      `}

      <div class="border-t border-navy-50 pt-3 text-sm text-navy-600">
        <p>Pagamento: <span class="font-medium text-navy-800">${order.paid ? "Confirmado" : "Ainda não confirmado"}</span></p>
        <p class="mt-1">Total: <span class="font-medium text-navy-800">${formatBRL(order.total)}</span>${order.discount_amount ? ` <span class="text-xs text-navy-400">(com desconto${order.coupon_code ? ` do cupom ${escapeHtml(order.coupon_code)}` : ""})</span>` : ""}</p>
      </div>

      ${(order.items || []).length > 0 ? `
        <div class="border-t border-navy-50 pt-3">
          <p class="mb-2 text-sm font-medium text-navy-700">Itens:</p>
          <ul class="flex flex-col gap-1 text-sm text-navy-600">
            ${order.items.map((it) => `<li>${it.quantity}x ${escapeHtml(it.product_name)}${it.variant_name ? ` (${escapeHtml(it.variant_name)})` : ""}</li>`).join("")}
          </ul>
        </div>
      ` : ""}
    </div>
  `;
}

function renderTrackResults() {
  if (!state.trackResults) return "";
  // Mais recente primeiro (a função do banco já devolve nessa ordem).
  return `
    <div class="mt-6 flex flex-col gap-4">
      ${state.trackResults.length > 1 ? `<p class="text-xs text-navy-400">${state.trackResults.length} pedidos encontrados pra esse WhatsApp.</p>` : ""}
      ${state.trackResults.map((order) => renderTrackOrderCard(order)).join("")}
    </div>
  `;
}

function renderTrack() {
  app.innerHTML = `
    ${renderHeader()}
    <main class="mx-auto max-w-lg px-4 py-8" id="main-content">
      <button data-go-home class="mb-6 inline-flex items-center gap-1 text-sm font-medium text-navy-500 hover:text-navy-700">← Voltar ao catálogo</button>
      <h1 class="mb-1 text-xl font-semibold text-navy-900">Rastrear pedido</h1>
      <p class="mb-6 text-sm text-navy-500">Digite o WhatsApp usado na compra pra ver o andamento dos seus pedidos.</p>
      ${renderTrackForm()}
      ${renderTrackResults()}
    </main>
    ${renderFooter()}
  `;
  const trackWhatsappInput = document.getElementById("track-whatsapp");
  trackWhatsappInput?.addEventListener("input", () => {
    trackWhatsappInput.value = formatPhoneInputMask(trackWhatsappInput.value);
  });
  document.getElementById("track-form").addEventListener("submit", (e) => {
    e.preventDefault();
    state.trackWhatsapp = document.getElementById("track-whatsapp").value.trim();
    searchTrackedOrder();
  });
}

// Clique na logo/"Luz Mariana" do cabeçalho leva pra homepage (catálogo
// completo, sem filtro de categoria nem produto aberto) — event
// delegation num listener só, ligado uma vez (o cabeçalho é
// re-desenhado em toda tela: catálogo, produto, checkout, sucesso...).
app.addEventListener("click", (e) => {
  if (e.target.closest("[data-go-home]")) {
    if (state.screen === "checkout") {
      captureCheckoutDraft();
      if (!confirmCheckoutExit()) return;
      trackEvent("checkout_abandonment", { stage: state.checkoutStage, reason: "home" });
    }
    state.screen = "catalog";
    state.detailProductId = null;
    state.categoryFilter = "all";
    state.searchQuery = "";
    state.cartOpen = false;
    history.replaceState({ productId: null }, "", CATALOG_BASE_URL);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const fontBtn = e.target.closest("[data-font-toggle]");
  if (fontBtn) {
    toggleFontSizePreference();
    return;
  }
  const headerWhatsappBtn = e.target.closest("[data-header-whatsapp]");
  if (headerWhatsappBtn) {
    trackEvent("contact_store", { source: "header" });
    const message = "Olá! Vim pelo catálogo da Luz Mariana e gostaria de falar com a loja.";
    window.open(`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    return;
  }

  const headerCustomOrderBtn = e.target.closest("[data-header-custom-order]");
  if (headerCustomOrderBtn) {
    trackEvent("custom_order_click", { source: "header" });
    const message = "Olá! Gostaria de solicitar um orçamento para uma encomenda personalizada da Luz Mariana.";
    window.open(`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    return;
  }

  const policyBtn = e.target.closest("[data-open-policy]");
  if (policyBtn) {
    state.screen = "policy";
    state.policyTab = policyBtn.getAttribute("data-open-policy");
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const helpBtn = e.target.closest("[data-open-help-guide]");
  if (helpBtn) {
    openHelpGuide();
    return;
  }
  const policyTabBtn = e.target.closest("[data-policy-tab]");
  if (policyTabBtn) {
    state.policyTab = policyTabBtn.getAttribute("data-policy-tab");
    render();
    return;
  }
  const trackBtn = e.target.closest("[data-open-track]");
  if (trackBtn) {
    state.screen = "track";
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

// Ajuda guiada: primeiro explica o passo a passo dentro do próprio site.
// Se a pessoa ainda precisar, há um botão para falar com a loja no WhatsApp.
const helpGuideOverlay = document.getElementById("help-guide-overlay");
const helpGuideDialog = helpGuideOverlay.querySelector(".help-guide-dialog");
function openHelpGuide() {
  helpGuideOverlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
  setTimeout(() => helpGuideDialog.focus(), 0);
}
function closeHelpGuide() {
  helpGuideOverlay.classList.remove("is-open");
  document.body.style.overflow = "";
  document.getElementById("help-guide-btn")?.focus();
}
document.getElementById("help-guide-btn").addEventListener("click", openHelpGuide);
document.getElementById("help-guide-close").addEventListener("click", closeHelpGuide);
document.getElementById("help-guide-done").addEventListener("click", closeHelpGuide);
helpGuideOverlay.addEventListener("click", (e) => { if (e.target === helpGuideOverlay) closeHelpGuide(); });
document.getElementById("help-guide-whatsapp").addEventListener("click", () => {
  const message = "Oi! Estou tentando fazer um pedido pelo catálogo da Luz Mariana e preciso de ajuda para concluir 🙏";
  window.open(`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && helpGuideOverlay.classList.contains("is-open")) closeHelpGuide();
});

document.getElementById("welcome-order-close-x")?.addEventListener("click", () => closeWelcomeOrder(true));
document.getElementById("welcome-order-close-btn")?.addEventListener("click", () => closeWelcomeOrder(true));
document.getElementById("welcome-order-whatsapp")?.addEventListener("click", () => {
  closeWelcomeOrder(true);
  trackEvent("custom_order_click", { source: "inactivity_popup" });
  const message = "Olá! Não encontrei exatamente o produto/modelo que procuro no catálogo da Luz Mariana e gostaria de solicitar um orçamento para uma encomenda personalizada.";
  window.open(`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
});
document.getElementById("welcome-order-overlay")?.addEventListener("click", (e) => {
  if (e.target.id === "welcome-order-overlay") closeWelcomeOrder(true);
});

["click", "touchstart", "keydown", "input", "scroll"].forEach((eventName) => {
  window.addEventListener(eventName, () => {
    if (document.getElementById("welcome-order-overlay")?.classList.contains("is-open")) return;
    scheduleWelcomeOrderAfterInactivity();
  }, { passive: true });
});

window.addEventListener("error", (event) => {
  console.error("Erro no catálogo:", event.error || event.message);
  if (state && state.loading) {
    state.loading = false;
    state.loadError = "Não foi possível abrir o catálogo agora. Atualize a página em alguns segundos.";
    try { render(); } catch (_err) {}
  }
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Erro assíncrono no catálogo:", event.reason);
  if (state && state.loading) {
    state.loading = false;
    state.loadError = "Não foi possível abrir o catálogo agora. Atualize a página em alguns segundos.";
    try { render(); } catch (_err) {}
  }
});

window.addEventListener("popstate", () => {
  if (state.loading) return;
  const popUrl = new URL(window.location.href);
  const productValue = popUrl.searchParams.get("produto");
  const variantValue = popUrl.searchParams.get("modelo");
  const popProduct = findProductByUrlValue(productValue);
  if (popProduct) {
    state.screen = "product";
    state.detailProductId = popProduct.id;
    state.detailGalleryIndex = 0;
    const popVariant = findVariantByUrlValue(popProduct.id, variantValue);
    if (popVariant) {
      state.selectedVariant[popProduct.id] = popVariant.id;
    }
  } else {
    state.screen = "catalog";
    state.detailProductId = null;
  }
  render();
  window.scrollTo({ top: 0, behavior: "auto" });
});

window.addEventListener("pagehide", () => {
  if (state.screen === "checkout" && !state.checkoutSubmitted) {
    trackEvent("checkout_abandonment", { stage: state.checkoutStage, reason: "pagehide" });
  }
});

window.addEventListener("beforeunload", (e) => {
  if (state.screen === "checkout" && !state.checkoutSubmitted && checkoutHasProgress()) {
    trackEvent("checkout_abandonment", { stage: state.checkoutStage, reason: "page_exit" });
  }
  if (cartCount() > 0 && state.screen !== "success") {
    e.preventDefault();
    e.returnValue = "";
  }
});

render();
loadCatalog()
  .then(() => requestAnimationFrame(() => scheduleWelcomeOrderAfterInactivity()))
  .catch((err) => {
    console.error("Erro inesperado ao carregar o catálogo:", err);
    state.loading = false;
    state.loadError = err?.message || "Erro inesperado";
    render();
  });

// Registra o service worker só pra habilitar "Adicionar à tela inicial"
// (ver comentário em sw.js — não guarda nada em cache). Silenciosamente
// não faz nada em navegadores sem suporte (ex: Safari mais antigo).
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((err) => {
      console.error("Não foi possível registrar o service worker (PWA):", err.message);
    });
  });
}
</script>
<!-- A compressão/redimensionamento/validação do arquivo ANTES do upload depende do Painel Admin.
     O catálogo público já usa lazy-loading, object-fit e decoding assíncrono na exibição. -->
</body>
</html>
