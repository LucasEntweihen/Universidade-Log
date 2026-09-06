#!/usr/bin/env node
/**
 * build.js
 * ---------------------------------------------------------------------
 * Passo de build OPCIONAL para produção. O site inteiro continua
 * funcionando perfeitamente sem rodar isso — é só HTML/CSS/JS puro,
 * sem framework, sem bundler, do jeito que sempre foi. Este script
 * existe só pra resolver o pedido de "bundles JS mais compactos":
 * como não existia nenhum passo de build, não havia como "compactar
 * o bundle" sem antes ter um bundle. O que este script faz é gerar
 * uma cópia inteira do site em dist/, byte a byte equivalente à
 * original, mas com:
 *
 *   - CSS minificado (clean-css)     — remove espaços, comentários
 *   - JS minificado (esbuild)        — idem, sem alterar comportamento
 *   - HTML minificado (html-minifier-terser) — mesmo conteúdo, menos bytes
 *
 * NENHUM arquivo muda de nome (sem hash no nome, de propósito — ver
 * comentário em netlify.toml sobre cache), então dist/ é uma cópia
 * publicável direta: aponte o Netlify/Vercel pra dist/ em vez da raiz
 * se quiser servir a versão minificada, ou continue servindo a raiz
 * normalmente se preferir simplicidade a esses ~35-45% de economia
 * de bytes. Nenhuma funcionalidade, complexidade ou comportamento é
 * removido — só formatação e espaços em branco.
 *
 * Uso:
 *   npm run build
 * ---------------------------------------------------------------------
 */
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const CleanCSS = require("clean-css");
const { minify: minifyHtml } = require("html-minifier-terser");

const ROOT = __dirname;
const OUT = path.join(ROOT, "dist");

const SKIP_DIRS = new Set(["dist", "node_modules", ".git", "scripts"]);
const SKIP_FILES = new Set(["build.js", "package.json", "package-lock.json"]);

let totals = { before: 0, after: 0, files: 0 };

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else {
      processFile(full);
    }
  }
}

function outPath(fullPath) {
  const rel = path.relative(ROOT, fullPath);
  return path.join(OUT, rel);
}

function ensureDirFor(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

async function processFile(fullPath) {
  const rel = path.relative(ROOT, fullPath);
  if (SKIP_FILES.has(path.basename(fullPath))) return;
  const ext = path.extname(fullPath).toLowerCase();
  const dest = outPath(fullPath);
  ensureDirFor(dest);
  const before = fs.statSync(fullPath).size;

  try {
    if (ext === ".css") {
      const src = fs.readFileSync(fullPath, "utf8");
      const out = new CleanCSS({ level: 2 }).minify(src);
      if (out.errors && out.errors.length)
        throw new Error(out.errors.join("; "));
      fs.writeFileSync(dest, out.styles, "utf8");
      report(rel, before, Buffer.byteLength(out.styles, "utf8"));
    } else if (ext === ".js") {
      const result = esbuild.transformSync(fs.readFileSync(fullPath, "utf8"), {
        minify: true,
        loader: "js",
        target: "es2018",
      });
      fs.writeFileSync(dest, result.code, "utf8");
      report(rel, before, Buffer.byteLength(result.code, "utf8"));
    } else if (ext === ".html") {
      const src = fs.readFileSync(fullPath, "utf8");
      const out = await minifyHtml(src, {
        collapseWhitespace: true,
        conservativeCollapse: true, // não junta tudo numa linha só, preserva 1 espaço onde importa (evita grudar palavras)
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
        keepClosingSlash: true,
        // não mexe em atributos on* nem em SVG — html-minifier-terser
        // já respeita SVG por padrão; isso evita quebrar viewBox etc.
      });
      fs.writeFileSync(dest, out, "utf8");
      report(rel, before, Buffer.byteLength(out, "utf8"));
    } else {
      fs.copyFileSync(fullPath, dest);
      report(rel, before, before, true);
    }
  } catch (err) {
    console.error(`  ERRO em ${rel}, copiando sem minificar: ${err.message}`);
    fs.copyFileSync(fullPath, dest);
    report(rel, before, before, true);
  }
}

function report(rel, before, after, copied) {
  totals.before += before;
  totals.after += after;
  totals.files += 1;
  if (!copied && before > 0) {
    const pct = (100 * (1 - after / before)).toFixed(0);
    console.log(
      `  ${rel.padEnd(48)} ${before.toString().padStart(7)} -> ${after.toString().padStart(7)} bytes  (-${pct}%)`,
    );
  }
}

(async () => {
  if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  console.log("Gerando build de produção em dist/ ...\n");

  // processFile é async por causa do html-minifier-terser; para manter
  // a ordem de leitura simples, coletamos e resolvemos sequencialmente.
  const files = [];
  (function collect(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) collect(full);
      else if (!SKIP_FILES.has(entry.name)) files.push(full);
    }
  })(ROOT);

  for (const f of files) {
    await processFile(f);
  }

  const savedBytes = totals.before - totals.after;
  const savedPct = totals.before
    ? ((100 * savedBytes) / totals.before).toFixed(1)
    : "0";
  console.log(`\n${totals.files} arquivos processados.`);
  console.log(`Total antes:  ${(totals.before / 1024).toFixed(1)} KB`);
  console.log(`Total depois: ${(totals.after / 1024).toFixed(1)} KB`);
  console.log(
    `Economia:     ${(savedBytes / 1024).toFixed(1)} KB (${savedPct}%)`,
  );
  console.log(
    `\nBuild pronto em ./dist — aponte seu host de produção pra essa pasta se quiser servir a versão minificada.`,
  );
})();
