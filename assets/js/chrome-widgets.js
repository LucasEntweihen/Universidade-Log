/* =====================================================================
 * assets/js/chrome-widgets.js
 * ---------------------------------------------------------------------
 * Fonte única de verdade para os dois componentes de "chrome" que
 * aparecem em (quase) toda página do site: o seletor de tema
 * (.theme-popover) e o painel de acessibilidade (.a11y-popover).
 *
 * Por que isso existe:
 * Antes, cada uma das 21 páginas que usam esses dois componentes
 * tinha sua PRÓPRIA cópia colada do HTML deles. Com o tempo, isso
 * fez as cópias divergirem: android.html, devops.html e ia.html
 * ficaram travados numa versão antiga do seletor de tema (sem os
 * 6 tons escuros e sem o tema espacial) e sem o painel de
 * acessibilidade; index.html tinha os rótulos em inglês e sem
 * `data-theme`; devops-material.html tinha só 2 das 13 opções de
 * tema; android-projeto.html tinha inclusive uma cópia acidental
 * colada dentro de uma tag <style>, além de uma segunda cópia
 * quebrada no meio do HTML. Nenhuma dessas divergências era
 * intencional — era só o preço de não ter um componente único.
 *
 * Este arquivo resolve isso na raiz: as duas funções abaixo têm o
 * HTML completo e correto de cada widget, e são injetadas em
 * qualquer `<div data-chrome-widget="theme">` /
 * `data-chrome-widget="a11y"` que existir na página. Editar o
 * seletor de tema ou o painel de acessibilidade agora significa
 * editar UM lugar, não 21.
 *
 * Ordem de carregamento importa: este script precisa rodar ANTES
 * de theme-picker.js e accessibility.js, porque os dois dependem
 * de elementos que só existem depois desta injeção (o `<select
 * id="a11yCvd">`, os botões `.theme-swatch`, etc). Como os scripts
 * ficam no fim do <body> e este roda de forma síncrona assim que a
 * tag é alcançada, os mounts já estão no DOM e o conteúdo injetado
 * está pronto antes do DOMContentLoaded dos outros dois arquivos.
 * ===================================================================== */
(function() {
    "use strict";

    var THEME_POPOVER_HTML =
        '<div class="theme-popover">' +
        '<button type="button" class="theme-popover-trigger" onclick="toggleThemePopover(this)" aria-haspopup="true" aria-label="Escolher tema de cores">' +
        '<span class="tp-dot" data-tp-dot></span>Tema' +
        '<svg class="ic-mono sm" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>' +
        "</button>" +
        '<div class="theme-popover-panel" role="group" aria-label="Temas de cores">' +
        '<p class="tp-panel-title">Escolha um tema</p>' +
        '<div class="tp-grid">' +
        '<div class="tp-family"><span class="tp-family-name">Neutro</span><div class="tp-family-swatches">' +
        '<button type="button" class="theme-swatch swatch-light" data-theme="light" onclick="setTheme(\'light\')" title="Claro" aria-label="Tema claro" aria-pressed="false"></button>' +
        '<button type="button" class="theme-swatch swatch-dark" data-theme="dark" onclick="setTheme(\'dark\')" title="Escuro" aria-label="Tema escuro" aria-pressed="false"></button>' +
        "</div></div>" +
        '<div class="tp-family"><span class="tp-family-name">Azul</span><div class="tp-family-swatches">' +
        '<button type="button" class="theme-swatch swatch-blue" data-theme="blue" onclick="setTheme(\'blue\')" title="Azul claro" aria-label="Tema azul claro" aria-pressed="false"></button>' +
        '<button type="button" class="theme-swatch swatch-blue-dark" data-theme="blue-dark" onclick="setTheme(\'blue-dark\')" title="Azul noite" aria-label="Tema azul noite" aria-pressed="false"></button>' +
        "</div></div>" +
        '<div class="tp-family"><span class="tp-family-name">Verde</span><div class="tp-family-swatches">' +
        '<button type="button" class="theme-swatch swatch-green" data-theme="green" onclick="setTheme(\'green\')" title="Verde claro" aria-label="Tema verde claro" aria-pressed="false"></button>' +
        '<button type="button" class="theme-swatch swatch-green-dark" data-theme="green-dark" onclick="setTheme(\'green-dark\')" title="Verde noite" aria-label="Tema verde noite" aria-pressed="false"></button>' +
        "</div></div>" +
        '<div class="tp-family"><span class="tp-family-name">Roxo</span><div class="tp-family-swatches">' +
        '<button type="button" class="theme-swatch swatch-purple" data-theme="purple" onclick="setTheme(\'purple\')" title="Roxo claro" aria-label="Tema roxo claro" aria-pressed="false"></button>' +
        '<button type="button" class="theme-swatch swatch-purple-dark" data-theme="purple-dark" onclick="setTheme(\'purple-dark\')" title="Roxo noite" aria-label="Tema roxo noite" aria-pressed="false"></button>' +
        "</div></div>" +
        '<div class="tp-family"><span class="tp-family-name">Âmbar</span><div class="tp-family-swatches">' +
        '<button type="button" class="theme-swatch swatch-amber" data-theme="amber" onclick="setTheme(\'amber\')" title="Âmbar claro" aria-label="Tema âmbar claro" aria-pressed="false"></button>' +
        '<button type="button" class="theme-swatch swatch-amber-dark" data-theme="amber-dark" onclick="setTheme(\'amber-dark\')" title="Âmbar noite" aria-label="Tema âmbar noite" aria-pressed="false"></button>' +
        "</div></div>" +
        '<div class="tp-family"><span class="tp-family-name">Rosa</span><div class="tp-family-swatches">' +
        '<button type="button" class="theme-swatch swatch-rose" data-theme="rose" onclick="setTheme(\'rose\')" title="Rosa claro" aria-label="Tema rosa claro" aria-pressed="false"></button>' +
        '<button type="button" class="theme-swatch swatch-rose-dark" data-theme="rose-dark" onclick="setTheme(\'rose-dark\')" title="Rosa noite" aria-label="Tema rosa noite" aria-pressed="false"></button>' +
        "</div></div>" +
        '<div class="tp-family tp-family-space"><span class="tp-family-name">✦ Espacial <small>(novo)</small></span><div class="tp-family-swatches">' +
        '<button type="button" class="theme-swatch swatch-space" data-theme="space" onclick="setTheme(\'space\')" title="Espacial" aria-label="Tema espacial" aria-pressed="false"></button>' +
        "</div></div>" +
        "</div>" +
        "</div>" +
        "</div>";

    var A11Y_POPOVER_HTML =
        '<div class="a11y-popover">' +
        '<button type="button" class="a11y-trigger" aria-haspopup="true" aria-label="Recursos de Acessibilidade">' +
        '<svg class="ic-mono sm" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v5l3.5 3.5 1.4-1.4L13 11V7zm-2 5v2h2v-2h-2z"/></svg>' +
        "</button>" +
        '<div class="a11y-popover-panel" role="group" aria-label="Acessibilidade">' +
        '<div class="a11y-group">' +
        '<p class="a11y-group-label">Tamanho da fonte</p>' +
        '<div class="a11y-font-buttons">' +
        '<button type="button" data-fontsize="normal">A</button>' +
        '<button type="button" data-fontsize="large">A+</button>' +
        '<button type="button" data-fontsize="xlarge">A++</button>' +
        "</div>" +
        "</div>" +
        '<div class="a11y-group">' +
        '<label for="a11yCvd">Modo Daltonismo</label>' +
        '<select id="a11yCvd">' +
        '<option value="none">Nenhum</option>' +
        '<option value="protanopia">Protanopia</option>' +
        '<option value="deuteranopia">Deuteranopia</option>' +
        '<option value="tritanopia">Tritanopia</option>' +
        '<option value="protanomalia">Protanomalia</option>' +
        '<option value="deuteranomalia">Deuteranomalia</option>' +
        '<option value="tritanomalia">Tritanomalia</option>' +
        '<option value="achromatopsia">Acromatopsia</option>' +
        "</select>" +
        "</div>" +
        '<div class="a11y-group">' +
        '<label class="a11y-toggle"><input type="checkbox" id="a11yReadAloud" /> Leitura em voz alta</label>' +
        '<button type="button" class="a11y-stop-btn" id="a11yStopSpeaking">Parar</button>' +
        "</div>" +
        "</div>" +
        "</div>";

    function inject(selector, html) {
        var mounts = document.querySelectorAll(selector);
        for (var i = 0; i < mounts.length; i++) {
            mounts[i].outerHTML = html;
        }
    }

    inject('[data-chrome-widget="theme"]', THEME_POPOVER_HTML);
    inject('[data-chrome-widget="a11y"]', A11Y_POPOVER_HTML);
})();