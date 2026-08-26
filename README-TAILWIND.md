# CSS do Tailwind (tailwind-built.css)

O catálogo (`index.html`) e o painel (`admin/index.html`) usam um único
arquivo de CSS pré-compilado, `tailwind-built.css`, que fica na raiz do
site (o painel referencia ele como `../tailwind-built.css`). Antes, os
dois arquivos carregavam o Tailwind pela CDN (`cdn.tailwindcss.com`), que
recompila tudo no navegador de cada visitante a cada carregamento —
mais lento, e depende de um domínio externo continuar no ar. O arquivo
estático já vem pronto, com só as classes realmente usadas.

## Quando regenerar

Só precisa regenerar esse arquivo se **uma classe nova do Tailwind** for
usada em `index.html` ou `admin/index.html` e ela aparecer sem estilo
nenhum na tela (o navegador ignora silenciosamente qualquer classe que
não existir no CSS carregado — não dá erro nenhum no console). Editar
texto, lógica JS, ou reusar classes que já existem no site NÃO exige
regenerar nada.

## Como regenerar

Precisa de Node.js instalado. Não precisa instalar nada permanentemente
no projeto — os passos abaixo criam uma pasta temporária só pra gerar o
arquivo.

```bash
mkdir -p /tmp/tw-build && cd /tmp/tw-build
npm init -y
npm install -D tailwindcss@3

# Copia os dois arquivos HTML pra essa pasta temporária
cp /caminho/do/site/index.html ./catalog.html
cp /caminho/do/site/admin/index.html ./admin.html
```

Crie `tailwind.config.js` nessa pasta com este conteúdo (é a mesma
configuração de cores — navy/gold/cream — que já era usada no
`tailwind.config` embutido no `<script>` da versão antiga com CDN):

```js
module.exports = {
  content: ["./catalog.html", "./admin.html"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef1fa", 100: "#d7ddf2", 200: "#aeb9e4", 300: "#8091d3",
          400: "#4e64bd", 500: "#2740a3", 600: "#152e8a", 700: "#0d2276",
          800: "#071a68", 900: "#001868", 950: "#000f42",
        },
        gold: {
          50: "#fdf6e3", 100: "#faeab8", 200: "#f6da85", 300: "#f2c852",
          400: "#efb92c", 500: "#e8a000", 600: "#c98900", 700: "#a06d00",
          800: "#7a5300", 900: "#5c3f00",
        },
        cream: { 50: "#fdfbf7", 100: "#f8f0e8" },
      },
    },
  },
};
```

E `input.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Depois gere o CSS:

```bash
npx tailwindcss -c tailwind.config.js -i input.css -o tailwind-built.css --minify
```

Isso cria `tailwind-built.css` na pasta temporária — copie ele por cima
do `tailwind-built.css` que fica na raiz do site (mesmo lugar de sempre,
o `<link>` nos dois HTMLs já aponta pra lá, não precisa mudar nada nos
HTMLs).

## Por que não automatizar isso pra rodar sozinho

De propósito, esse processo não roda automaticamente a cada mudança —
isso exigiria um passo de build no fluxo de trabalho de vocês dois
(algo tipo `npm run build` toda vez antes de publicar), o que foi
combinado que não queríamos introduzir. Regenerar é raro (só quando uma
classe nova aparece sem estilo) e leva menos de um minuto quando
precisar.
