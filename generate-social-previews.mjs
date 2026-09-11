import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SUPABASE_URL = "https://xgcsdpqaqxstcfwgwaxw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnY3NkcHFhcXhzdGNmd2d3YXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MDE3MTQsImV4cCI6MjEwMjM3NzcxNH0.WFYm2q4ljkQMRiaQzhJ-yf01wj80xsO0ykmH7jhtUoo";
const BASE_URL = "https://lojaluzmariana.github.io/catalogo/";
const ROOT = process.cwd();
const SHARE_DIR = path.join(ROOT, "share");
const IMAGE_DIR = path.join(ROOT, "og-modelos");

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function fetchJson(table) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=*`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${table}: ${res.status} ${await res.text()}`);
  return res.json();
}

function variantSales(v) {
  return Number(
    v?.units_sold ??
    v?.unitsSold ??
    v?.sales_count ??
    v?.sold_count ??
    v?.total_sold ??
    0
  ) || 0;
}

function variantStatusRank(v) {
  return v?.esgotado ? 2 : (v?.in_stock ? 0 : 1);
}

function sortVariants(list) {
  return [...list].sort((a, b) => {
    const status = variantStatusRank(a) - variantStatusRank(b);
    if (status !== 0) return status;
    const sort = Number(a.sort_order ?? 9999) - Number(b.sort_order ?? 9999);
    if (sort !== 0) return sort;
    return String(a.name || "").localeCompare(String(b.name || ""), "pt-BR");
  });
}

function bestSellingVariant(list) {
  if (!list.length) return null;
  return [...list].sort((a, b) => {
    const sales = variantSales(b) - variantSales(a);
    if (sales !== 0) return sales;
    const photo = Number(!!b.photo_url) - Number(!!a.photo_url);
    if (photo !== 0) return photo;
    const status = variantStatusRank(a) - variantStatusRank(b);
    if (status !== 0) return status;
    return Number(a.sort_order ?? 9999) - Number(b.sort_order ?? 9999);
  })[0] || null;
}

async function localizeImage(sourceUrl, fileBase) {
  if (!sourceUrl) return `${BASE_URL}og-image.jpg`;
  try {
    const res = await fetch(sourceUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());

    const outputName = `${fileBase}.jpg`;
    const outputPath = path.join(IMAGE_DIR, outputName);

    // Gera JPEG quadrado 1200×1200 sem cortar a foto original.
    await sharp(buffer)
      .rotate()
      .resize(1200, 1200, {
        fit: "contain",
        background: { r: 248, g: 246, b: 239, alpha: 1 },
        withoutEnlargement: false,
      })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(outputPath);

    return `${BASE_URL}og-modelos/${encodeURIComponent(outputName)}`;
  } catch (err) {
    console.warn(`Não foi possível espelhar ${sourceUrl}: ${err.message}`);
    return `${BASE_URL}og-image.jpg`;
  }
}

function previewHtml({ product, variant, imageUrl, redirectUrl }) {
  const title = `${product.name}${variant?.name ? ` — ${variant.name}` : ""} | Luz Mariana`;
  const description = variant?.name
    ? `${product.name} — ${variant.name}. Veja este modelo no catálogo da Luz Mariana.`
    : `${product.name}. Veja este produto no catálogo da Luz Mariana.`;

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Luz Mariana">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(redirectUrl)}">
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="1200">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}">

  <link rel="canonical" href="${escapeHtml(redirectUrl)}">
  <meta http-equiv="refresh" content="0;url=${escapeHtml(redirectUrl)}">
</head>
<body>
  <p>Abrindo o produto… <a href="${escapeHtml(redirectUrl)}">Continuar para a Luz Mariana</a></p>
  <script>location.replace(${JSON.stringify(redirectUrl)});</script>
</body>
</html>`;
}

async function writePreview(product, variant, imageUrl) {
  const productId = String(product.id);
  const variantId = variant?.id ? String(variant.id) : null;
  const redirect = new URL(BASE_URL);
  redirect.searchParams.set("produto", productId);
  if (variantId) redirect.searchParams.set("modelo", variantId);

  const dir = variantId
    ? path.join(SHARE_DIR, productId, variantId)
    : path.join(SHARE_DIR, productId);

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(
    path.join(dir, "index.html"),
    previewHtml({
      product,
      variant,
      imageUrl,
      redirectUrl: redirect.toString(),
    }),
    "utf8"
  );
}

async function main() {
  await fs.rm(SHARE_DIR, { recursive: true, force: true });
  await fs.rm(IMAGE_DIR, { recursive: true, force: true });
  await fs.mkdir(SHARE_DIR, { recursive: true });
  await fs.mkdir(IMAGE_DIR, { recursive: true });

  const [products, variants] = await Promise.all([
    fetchJson("catalog_products"),
    fetchJson("catalog_product_variants"),
  ]);

  const byProduct = new Map();
  for (const v of variants) {
    const key = String(v.product_id);
    if (!byProduct.has(key)) byProduct.set(key, []);
    byProduct.get(key).push(v);
  }

  let pages = 0;

  for (const product of products) {
    const productVariants = sortVariants(byProduct.get(String(product.id)) || []);
    const best = bestSellingVariant(productVariants);

    // Página do produto sem modelo: se houver variantes, usa o mais vendido.
    const productPreviewVariant = best || null;
    const productImageSource = productPreviewVariant?.photo_url || product.photo_url || null;
    const productImageUrl = await localizeImage(
      productImageSource,
      `produto-${product.id}${productPreviewVariant?.id ? `-${productPreviewVariant.id}` : ""}`
    );
    await writePreview(product, productPreviewVariant, productImageUrl);
    pages++;

    // Uma página estática por modelo, com a foto desse modelo.
    for (const variant of productVariants) {
      const imageSource = variant.photo_url || product.photo_url || productPreviewVariant?.photo_url || null;
      const imageUrl = await localizeImage(imageSource, `modelo-${variant.id}`);
      await writePreview(product, variant, imageUrl);
      pages++;
    }
  }

  await fs.writeFile(
    path.join(ROOT, "social-preview-manifest.json"),
    JSON.stringify({ generated_at: new Date().toISOString(), products: products.length, variants: variants.length, pages }, null, 2),
    "utf8"
  );

  console.log(`Pré-visualizações geradas: ${pages} páginas.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
