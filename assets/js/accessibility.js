/**
 * assets/js/accessibility.js
 * ---------------------------------------------------------------
 * Controla os três recursos da aba "Acessibilidade" (ícone no menu
 * de todas as páginas). Nada aqui depende de nenhuma outra
 * biblioteca — é JS puro, carregado antes do </body> em toda página
 * que tiver o painel .a11y-popover-panel no HTML.
 *
 * O que cada recurso faz, de verdade (sem prometer mais do que o
 * código entrega):
 *
 * 1. TAMANHO DA FONTE — grava um data-fontsize no <html> e escala
 *    o font-size raiz. Como o CSS do site inteiro é escrito em rem,
 *    isso aumenta proporcionalmente TUDO (texto, espaçamentos que
 *    usam rem, ícones em em) — não é um zoom de navegador, é escala
 *    de verdade dentro do layout responsivo.
 *
 * 2. MODO DALTONISMO — NÃO é um filtro "mágico" que corrige cores
 *    (matrizes de correção por tipo de daltonismo são complexas e
 *    fáceis de implementar errado). O que este modo realmente faz:
 *    (a) aumenta contraste/saturação gerais via CSS filter, o que
 *    ajuda a diferenciar tons próximos em várias formas de daltonismo,
 *    e (b) o site já usa ✓/✗ além de cor em todo feedback de
 *    certo/errado dos minijogos (assets/css/games.css) — isso vale
 *    sempre, esteja o modo ligado ou não.
 *
 * 3. LEITURA EM VOZ ALTA — usa a Web Speech API (speechSynthesis) do
 *    próprio navegador. NÃO é o leitor de tela do sistema operacional
 *    (NVDA, JAWS, VoiceOver) — uma página web não tem permissão pra
 *    ligar isso. É uma leitura embutida no site: liga, lê o título e
 *    a introdução da página automaticamente, e depois qualquer
 *    título ou parágrafo clicado é lido em voz alta. Pra quem já usa
 *    um leitor de tela de verdade, a marcação semântica e os aria-label
 *    do site continuam funcionando normalmente com ou sem isso ligado.
 * ---------------------------------------------------------------
 */
(function() {
    "use strict";

    var STORAGE_KEY = "studyhub_a11y_v1";
    var root = document.documentElement;

    function loadPrefs() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    function savePrefs(prefs) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
        } catch (e) {}
    }

    var prefs = loadPrefs();

    function applyFontSize(size) {
        if (size === "large") root.style.fontSize = "118%";
        else if (size === "xlarge") root.style.fontSize = "135%";
        else root.style.fontSize = "";
        root.setAttribute("data-fontsize", size || "normal");
    }

    function applyCvdFilter(type) {
        var wrapper = document.body;
        wrapper.classList.remove(
            "cvd-protanopia",
            "cvd-deuteranopia",
            "cvd-tritanopia",
            "cvd-protanomalia",
            "cvd-deuteranomalia",
            "cvd-tritanomalia",
            "cvd-achromatopsia",
        );
        if (type !== "none") {
            wrapper.classList.add("cvd-" + type);
        }
    }

    var speaking = false;

    function speak(text) {
        if (!("speechSynthesis" in window) || !text) return;
        window.speechSynthesis.cancel();
        var utter = new SpeechSynthesisUtterance(text);
        utter.lang = "pt-BR";
        utter.rate = 0.98;
        window.speechSynthesis.speak(utter);
    }

    function stopSpeaking() {
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    }

    function readAloudClickHandler(e) {
        var el = e.target.closest("h1,h2,h3,p,li,summary");
        if (!el) return;
        if (e.target.closest("a,button,input,select,textarea,label")) return;
        var text = el.innerText && el.innerText.trim();
        if (text) {
            speak(text);
            el.classList.add("a11y-reading-now");
            setTimeout(function() {
                el.classList.remove("a11y-reading-now");
            }, 1200);
        }
    }

    function applyReadAloud(on) {
        root.setAttribute("data-read-aloud", on ? "on" : "off");
        if (on) {
            document.addEventListener("click", readAloudClickHandler, true);
            var h1 = document.querySelector("h1");
            var lead = document.querySelector(
                "h1 + p, .lp-hero-text p, .section-sub",
            );
            var introText = [
                    document.title,
                    h1 ? h1.innerText : "",
                    lead ? lead.innerText : "",
                ]
                .filter(Boolean)
                .join(". ");
            speak(introText || document.title);
        } else {
            document.removeEventListener("click", readAloudClickHandler, true);
            stopSpeaking();
        }
    }

    // aplica tudo assim que o script carrega, antes de qualquer clique
    applyFontSize(prefs.fontsize);
    // leitura em voz alta nunca começa ligada sozinha entre sessões —
    // ninguém quer que o navegador comece a falar sozinho ao abrir uma
    // aba nova sem esperar por isso.

    function wireControls() {
        var panel = document.querySelector(".a11y-popover-panel");
        if (!panel) return;

        var fontButtons = panel.querySelectorAll("[data-fontsize]");

        function syncFontButtons() {
            var current = root.getAttribute("data-fontsize") || "normal";
            fontButtons.forEach(function(b) {
                var active = b.dataset.fontsize === current;
                b.classList.toggle("active", active);
                b.setAttribute("aria-pressed", active ? "true" : "false");
            });
        }
        fontButtons.forEach(function(b) {
            b.addEventListener("click", function() {
                applyFontSize(b.dataset.fontsize);
                prefs.fontsize = b.dataset.fontsize;
                savePrefs(prefs);
                syncFontButtons();
            });
        });
        syncFontButtons();

        var cvdSelect = panel.querySelector("#a11yCvd");
        if (cvdSelect) {
            cvdSelect.value = prefs.cvdType || "none";
            applyCvdFilter(cvdSelect.value);
            cvdSelect.addEventListener("change", function() {
                applyCvdFilter(cvdSelect.value);
                prefs.cvdType = cvdSelect.value;
                savePrefs(prefs);
            });
        }

        var readToggle = panel.querySelector("#a11yReadAloud");
        if (readToggle) {
            readToggle.checked = false;
            readToggle.addEventListener("change", function() {
                applyReadAloud(readToggle.checked);
            });
        }

        var stopBtn = panel.querySelector("#a11yStopSpeaking");
        if (stopBtn) {
            stopBtn.addEventListener("click", function() {
                stopSpeaking();
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", wireControls);
    } else {
        wireControls();
    }

    // popover open/close — mesmo padrão do seletor de temas
    document.addEventListener("click", function(e) {
        var trigger = e.target.closest(".a11y-trigger");
        var openPopover = document.querySelector(".a11y-popover.open");
        if (trigger) {
            var pop = trigger.closest(".a11y-popover");
            var willOpen = !pop.classList.contains("open");
            if (openPopover) openPopover.classList.remove("open");
            pop.classList.toggle("open", willOpen);
            trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
            return;
        }
        if (openPopover && !e.target.closest(".a11y-popover")) {
            openPopover.classList.remove("open");
            var t = openPopover.querySelector(".a11y-trigger");
            if (t) t.setAttribute("aria-expanded", "false");
        }
    });
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            var openPopover = document.querySelector(".a11y-popover.open");
            if (openPopover) {
                openPopover.classList.remove("open");
                var t = openPopover.querySelector(".a11y-trigger");
                if (t) t.setAttribute("aria-expanded", "false");
            }
        }
    });
})();