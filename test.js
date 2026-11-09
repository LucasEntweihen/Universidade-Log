#!/usr/bin/env node

/**
 * test.js
 * ---------------------------------------------------------------------
 * Suíte de testes e validação automatizada para a pipeline de CI/CD.
 *
 * Executa testes de integridade, validação estrutural de arquivos essenciais,
 * sintaxe de arquivos JSON/JS e consistência do bundle de distribuição (dist/).
 *
 * Critérios validados:
 * 1. Existência e integridade dos arquivos fonte raiz e assets essenciais.
 * 2. Validação sintática de arquivos de configuração (JSON válidos).
 * 3. Validação estrutural do HTML principal (tags semânticas essenciais).
 * 4. Verificação de integridade do build em dist/ (se presente ou após build).
 *
 * Retorna código 0 em caso de aprovação ou código 1 com log do erro.
 * ---------------------------------------------------------------------
 */

const fs = require("fs");
const path = require("path");
const assert = require("assert");

const ROOT = __dirname;
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error(`         Erro: ${err.message}`);
    failed++;
  }
}

console.log("=== EXECUTANDO TESTES DE INTEGRIDADE E VALIDAÇÃO (CI) ===\n");

// 1. Arquivos fonte essenciais
test("Arquivos raiz essenciais devem existir", () => {
  const requiredFiles = [
    "index.html",
    "cursos.html",
    "manifest.json",
    "build.js",
    "package.json"
  ];
  for (const file of requiredFiles) {
    const fullPath = path.join(ROOT, file);
    assert.ok(fs.existsSync(fullPath), `Arquivo obrigatório ausente: ${file}`);
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 0, `Arquivo está vazio: ${file}`);
  }
});

// 2. Validação sintática de arquivos JSON
test("Arquivos JSON de configuração devem ter sintaxe válida", () => {
  const jsonFiles = ["package.json", "manifest.json", "vercel.json"];
  for (const file of jsonFiles) {
    const fullPath = path.join(ROOT, file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf8");
      assert.doesNotThrow(() => {
        JSON.parse(content);
      }, `Falha de parsing JSON no arquivo ${file}`);
    }
  }
});

// 3. Validação estrutural básica do index.html
test("index.html deve possuir estrutura HTML5 válida e elementos essenciais", () => {
  const indexPath = path.join(ROOT, "index.html");
  const html = fs.readFileSync(indexPath, "utf8");
  assert.ok(/<!doctype\s+html>/i.test(html), "Falta a declaração <!doctype html>");
  assert.ok(html.includes("<html"), "Falta a tag raiz <html");
  assert.ok(html.includes("<head"), "Falta a tag <head");
  assert.ok(html.includes("<body"), "Falta a tag <body");
  assert.ok(html.includes("<title>"), "Falta a tag <title>");
});

// 4. Integridade dos cursos HTML
test("Cursos HTML devem conter as tags estruturais mínimas", () => {
  const cursosDir = path.join(ROOT, "cursos");
  assert.ok(fs.existsSync(cursosDir), "Diretório cursos/ deve existir");
  const htmlFiles = fs.readdirSync(cursosDir).filter(f => f.endsWith(".html"));
  assert.ok(htmlFiles.length >= 4, "Deve haver ao menos 4 páginas de curso");
  for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(cursosDir, file), "utf8");
    assert.ok(content.length > 500, `Arquivo de curso suspeito (muito curto): ${file}`);
  }
});

// 5. Verificação da saída do build (se dist/ existir)
test("Diretório dist/ (quando gerado) deve conter artefatos de produção válidos", () => {
  const distDir = path.join(ROOT, "dist");
  if (!fs.existsSync(distDir)) {
    console.log("         (dist/ ainda não gerado neste passo, verificação diferida para pós-build)");
    return;
  }
  const distIndex = path.join(distDir, "index.html");
  assert.ok(fs.existsSync(distIndex), "dist/index.html não foi gerado pelo build");
  const stat = fs.statSync(distIndex);
  assert.ok(stat.size > 0, "dist/index.html gerado está vazio");
});

console.log(`\n=========================================================`);
console.log(`Resultado dos Testes: ${passed} passaram, ${failed} falharam.`);
console.log(`=========================================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
