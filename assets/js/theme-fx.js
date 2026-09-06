/* =====================================================================
 * assets/js/theme-fx.js
 * ---------------------------------------------------------------------
 * Fonte única do parallax do site. Antes disso, a MESMA lógica de
 * scroll existia duplicada em dois lugares (engine.js: setupParallax()
 * e assets/js/mini-parallax.js), uma pras 4 páginas-sede de curso e
 * outra pras 9 subpáginas — e as duas aplicavam o mesmo deslocamento
 * vertical em toda imagem, não importa o curso. Este arquivo substitui
 * as duas cópias e faz o parallax reagir ao tema ativo:
 *
 *   - padrão (IA, DevOps, Trigomante): deslocamento vertical, como
 *     antes, mas cada um desses 3 cursos GANHA uma camada extra por
 *     cima (estrelas, ondas, masmorra) — ver theme-fx.css.
 *   - Android: em vez de vertical, a foto desliza na HORIZONTAL, como
 *     um dedo passando de tela — o resto do site continua vertical,
 *     só o Android é diferente, de propósito.
 *
 * Todo o pacote (parallax base + camadas extras) desliga por completo
 * com prefers-reduced-motion: as camadas decorativas nem chegam a
 * entrar no DOM, e as fotos ficam paradas sem transform nenhum.
 * ===================================================================== */
(function() {
    "use strict";

    var reduceMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var body = document.body;
    var COURSES = [
        "course-ia",
        "course-android",
        "course-devops",
        "course-trigomante",
    ];
    var course = null;
    for (var i = 0; i < COURSES.length; i++) {
        if (body.classList.contains(COURSES[i])) {
            course = COURSES[i];
            break;
        }
    }

    /* ---------------------------------------------------------------
     * Parallax base nas imagens de hero/módulo (substitui engine.js
     * setupParallax() e mini-parallax.js por completo).
     * --------------------------------------------------------------- */
    function setupPhotoParallax() {
        var wraps = document.querySelectorAll(".hero-photo-wrap, .mod-photo-wrap");
        if (!wraps.length || reduceMotion) return;
        var ticking = false;

        function update() {
            var vh = window.innerHeight || document.documentElement.clientHeight;
            for (var i = 0; i < wraps.length; i++) {
                var w = wraps[i];
                var rect = w.getBoundingClientRect();
                if (rect.bottom < -200 || rect.top > vh + 200) continue;
                var img = w.querySelector(".hero-photo, .mod-photo, img");
                if (!img) continue;
                var center = rect.top + rect.height / 2;
                var progress = (center - vh / 2) / vh; // aprox. -0.5 .. 0.5
                if (course === "course-android") {
                    img.style.transform =
                        "translateX(" + (progress * 70).toFixed(1) + "px)";
                } else {
                    img.style.transform =
                        "translateY(" + (progress * 90).toFixed(1) + "px)";
                }
            }
            ticking = false;
        }

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }
        window.addEventListener("scroll", onScroll, {
            passive: true
        });
        window.addEventListener("resize", onScroll);
        update();
    }

    /* ---------------------------------------------------------------
     * IA — duas camadas extras de estrelas por cima do campo estático
     * que já existe em course-themes.css (body.course-ia::before).
     * --------------------------------------------------------------- */
    function setupStarfield() {
        var layer = document.createElement("div");
        layer.className = "fx-layer";
        layer.setAttribute("aria-hidden", "true");

        var configs = [{
                count: 26,
                size: [1, 2],
                speed: 0.035,
                dur: [3, 6]
            },
            {
                count: 14,
                size: [2, 3.4],
                speed: 0.075,
                dur: [2.4, 4.5]
            },
        ];
        var groups = configs.map(function(cfg) {
            var g = document.createElement("div");
            g.style.position = "absolute";
            g.style.inset = "0";
            for (var i = 0; i < cfg.count; i++) {
                var s = document.createElement("span");
                s.className = "fx-star" + (Math.random() < 0.4 ? " is-nebula" : "");
                var size = (
                    cfg.size[0] +
                    Math.random() * (cfg.size[1] - cfg.size[0])
                ).toFixed(1);
                s.style.width = size + "px";
                s.style.height = size + "px";
                s.style.left = (Math.random() * 100).toFixed(1) + "%";
                s.style.top = (Math.random() * 100).toFixed(1) + "%";
                s.style.setProperty(
                    "--fx-dur",
                    (cfg.dur[0] + Math.random() * (cfg.dur[1] - cfg.dur[0])).toFixed(1) +
                    "s",
                );
                s.style.setProperty("--fx-delay", (Math.random() * 4).toFixed(1) + "s");
                g.appendChild(s);
            }
            layer.appendChild(g);
            return {
                el: g,
                speed: cfg.speed
            };
        });
        body.prepend(layer);

        var ticking = false;

        function update() {
            var y = window.scrollY || window.pageYOffset;
            groups.forEach(function(g) {
                g.el.style.transform =
                    "translateY(" + (-(y * g.speed)).toFixed(1) + "px)";
            });
            ticking = false;
        }

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }
        window.addEventListener("scroll", onScroll, {
            passive: true
        });
        update();
    }

    /* ---------------------------------------------------------------
     * DevOps — 3 camadas de onda em SVG, as de trás mais lentas.
     * O formato da onda reaproveita a curva já usada em ".wire"
     * (course-themes.css), só maior, pra manter a mesma linguagem
     * visual em vez de inventar uma curva nova.
     * --------------------------------------------------------------- */
    function setupWaves() {
        var layer = document.createElement("div");
        layer.className = "fx-layer";
        layer.setAttribute("aria-hidden", "true");
        var svgNS = "http://www.w3.org/2000/svg";
        var defs = [{
                color: "var(--sea,#1B4F72)",
                opacity: 0.09,
                duration: "42s",
                height: "16vh",
                bottom: "0",
            },
            {
                color: "var(--sea-2,#2E86C1)",
                opacity: 0.14,
                duration: "27s",
                height: "11vh",
                bottom: "0",
            },
            {
                color: "var(--sand,#E9C46A)",
                opacity: 0.16,
                duration: "18s",
                height: "6vh",
                bottom: "0",
            },
        ];
        defs.forEach(function(cfg) {
            var svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("viewBox", "0 0 84 16");
            svg.setAttribute("preserveAspectRatio", "none");
            svg.classList.add("fx-wave-svg");
            svg.style.height = cfg.height;
            svg.style.bottom = cfg.bottom;
            svg.style.opacity = cfg.opacity;
            svg.style.animationDuration = cfg.duration;
            var path = document.createElementNS(svgNS, "path");
            // mesma curva de .wire (M0 8 Q10.5 1 21 8 T42 8), repetida e
            // duplicada horizontalmente pra poder rodar em loop sem costura
            path.setAttribute(
                "d",
                "M0,8 Q10.5,1 21,8 T42,8 T63,8 T84,8 L84,16 L0,16 Z",
            );
            path.setAttribute("fill", cfg.color);
            svg.appendChild(path);
            layer.appendChild(svg);
        });
        body.prepend(layer);
    }

    /* ---------------------------------------------------------------
     * Trigomante — profundidade de masmorra: parede ao fundo (mais
     * lenta que o conteúdo ao rolar) + tochas tremeluzindo (CSS puro,
     * sem depender do scroll).
     * --------------------------------------------------------------- */
    function setupDungeon() {
        var layer = document.createElement("div");
        layer.className = "fx-layer";
        layer.setAttribute("aria-hidden", "true");

        var walls = document.createElement("div");
        walls.className = "fx-dungeon-walls";
        layer.appendChild(walls);

        var torchSpots = [
            [6, 18],
            [94, 30],
            [10, 72],
            [90, 60],
        ];
        torchSpots.forEach(function(pos, i) {
            var t = document.createElement("div");
            t.className = "fx-torch";
            t.style.left = pos[0] + "%";
            t.style.top = pos[1] + "%";
            t.style.animationDelay = (i * 0.5).toFixed(1) + "s";
            layer.appendChild(t);
        });
        body.prepend(layer);

        if (reduceMotion) return; // tochas já saem sem animação via CSS; só falta não mover a parede
        var ticking = false;

        function update() {
            var y = window.scrollY || window.pageYOffset;
            walls.style.transform = "translateY(" + (-(y * 0.12)).toFixed(1) + "px)";
            ticking = false;
        }

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }
        window.addEventListener("scroll", onScroll, {
            passive: true
        });
        update();
    }

    function init() {
        setupPhotoParallax();
        if (reduceMotion) return; // camadas decorativas extras nem entram no DOM
        if (course === "course-ia") setupStarfield();
        else if (course === "course-devops") setupWaves();
        else if (course === "course-trigomante") setupDungeon();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();