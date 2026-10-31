/* Máscara visual: logos originais, sem modificar as fotos ou os arquivos de marca. */
(() => {
  'use strict';
  const logos = {
    iluminart: 'loja-assets/9fe7abb22dd904ea.png',
    luz_mariana: 'loja-assets/5f3d81aae6ac3a7e.png',
    combined: 'loja-assets/marcas-juntas-original.png'
  };
  function brand(product) {
    const choice = product?.watermark_brand || product?.brand;
    return Object.hasOwn(logos, choice) ? choice : '';
  }
  window.LMPhoto = { brand, attrs: p => 'data-photo-brand="' + brand(p) + '"' };
  const style = document.createElement('style');
  style.textContent = '[data-photo-brand]{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;-webkit-user-drag:none}.lm-photo-watermark{position:absolute!important;display:block!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;transform:none!important;filter:none!important;background-color:transparent!important;pointer-events:none!important;opacity:.18!important;background-repeat:no-repeat;background-position:center;background-size:contain;z-index:1;user-select:none;-webkit-touch-callout:none}.lm-photo-watermark[hidden]{display:none!important}';
  document.head.append(style);
  const masks = new WeakMap();
  const observed = new Set();
  let scheduled = false;
  function update(img) {
    const key = img.dataset.photoBrand, parent = img.parentElement;
    if (!parent) return;
    let mask = masks.get(img);
    if (!logos[key]) { if (mask && !mask.hidden) mask.hidden = true; return; }
    if (!mask || mask.parentElement !== parent) {
      mask?.remove();
      if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
      mask = document.createElement('span');
      mask.className = 'lm-photo-watermark'; mask.setAttribute('aria-hidden', 'true');
      parent.append(mask); masks.set(img, mask);
      img.draggable = false;
      img.addEventListener('load', schedule); img.addEventListener('error', schedule);
      observer?.observe(img); observed.add(img);
    }
    const rect = img.getBoundingClientRect(), box = parent.getBoundingClientRect();
    const hidden = !img.complete || !img.naturalWidth || !rect.width || !rect.height;
    if (mask.hidden !== hidden) mask.hidden = hidden;
    if (mask.hidden) return;
    const css = getComputedStyle(img);
    const innerWidth = Math.max(0, img.clientWidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight));
    const innerHeight = Math.max(0, img.clientHeight - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom));
    const scale = Math.min(innerWidth / img.naturalWidth, innerHeight / img.naturalHeight);
    const photoWidth = css.objectFit === 'contain' ? img.naturalWidth * scale : innerWidth;
    const photoHeight = css.objectFit === 'contain' ? img.naturalHeight * scale : innerHeight;
    const width = photoWidth * .40;
    const aspect = key === 'iluminart' ? 1434 / 1097 : key === 'luz_mariana' ? 2079 / 756 : 2048 / 500;
    const height = width / aspect;
    const left = rect.left - box.left - parent.clientLeft + parent.scrollLeft + rect.width / 2 - width / 2;
    const top = rect.top - box.top - parent.clientTop + parent.scrollTop + rect.height / 2 - height / 2;
    const desired = `left:${left}px;top:${top}px;width:${width}px;height:${height}px;background-image:url("${logos[key]}")`;
    if (mask.style.cssText !== desired + ';') mask.style.cssText = desired;
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; for (const img of observed) { if (!img.isConnected) { observer?.unobserve(img); observed.delete(img); } } document.querySelectorAll('img[data-photo-brand]').forEach(update); });
  }
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
  new MutationObserver(schedule).observe(document.documentElement, {childList:true,subtree:true,attributes:true,attributeFilter:['src','data-photo-brand','open','hidden']});
  window.addEventListener('resize', schedule); document.addEventListener('DOMContentLoaded', schedule);
  document.addEventListener('contextmenu', e => {
    if (!e.target.closest('input,textarea,[contenteditable="true"]')) e.preventDefault();
  });
  document.addEventListener('dragstart', e => { if (e.target.closest('img')) e.preventDefault(); });
  schedule();
})();
