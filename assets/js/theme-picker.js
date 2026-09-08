/* ================= shared theme popover ================= */
(function() {
    var STORAGE_KEY = "studyhub_theme_v1";
    var SWATCH_COLORS = {
        light: "#EDEAE2",
        dark: "#2B2620",
        blue: "#DCEBFA",
        "blue-dark": "#1B2A3D",
        green: "#DEF2E1",
        "green-dark": "#1B2B20",
        purple: "#E7E1FA",
        "purple-dark": "#241E38",
        amber: "#FBE8CE",
        "amber-dark": "#2E2013",
        rose: "#FBE2EA",
        "rose-dark": "#301621",
        cyan: "#DEF2F3",
        "cyan-dark": "#16323A",
        coral: "#FAE5DD",
        "coral-dark": "#3B1F19",
        space: "#7B6CFF",
    };

    window.setTheme = function(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {}
        if (theme && theme !== "light") {
            document.documentElement.setAttribute("data-theme", theme);
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
        document
            .querySelectorAll(".theme-swatch,.pf-swatch")
            .forEach(function(el) {
                var isActive = el.dataset.theme === theme;
                el.classList.toggle("active", isActive);
                if (el.tagName === "BUTTON")
                    el.setAttribute("aria-pressed", isActive ? "true" : "false");
            });
        document.querySelectorAll("[data-tp-dot]").forEach(function(dot) {
            dot.style.background = SWATCH_COLORS[theme] || SWATCH_COLORS.light;
        });
        document.querySelectorAll(".theme-popover-panel").forEach(function(panel) {
            panel.closest(".theme-popover") &&
                panel.closest(".theme-popover").classList.remove("open");
        });
    };

    window.toggleThemePopover = function(btn) {
        var wrap = btn.closest(".theme-popover");
        if (!wrap) return;
        var isOpen = wrap.classList.contains("open");
        document.querySelectorAll(".theme-popover.open").forEach(function(w) {
            w.classList.remove("open");
        });
        if (!isOpen) wrap.classList.add("open");
    };

    document.addEventListener("click", function(ev) {
        document.querySelectorAll(".theme-popover.open").forEach(function(w) {
            if (!w.contains(ev.target)) w.classList.remove("open");
        });
    });
    document.addEventListener("keydown", function(ev) {
        if (ev.key === "Escape") {
            document.querySelectorAll(".theme-popover.open").forEach(function(w) {
                w.classList.remove("open");
            });
        }
    });

    document.addEventListener("DOMContentLoaded", function() {
        var current = "light";
        try {
            current = localStorage.getItem(STORAGE_KEY) || "light";
        } catch (e) {}
        document
            .querySelectorAll(".theme-swatch,.pf-swatch")
            .forEach(function(el) {
                if (el.dataset.theme === current) {
                    el.classList.add("active");
                    if (el.tagName === "BUTTON") el.setAttribute("aria-pressed", "true");
                }
            });
        document.querySelectorAll("[data-tp-dot]").forEach(function(dot) {
            dot.style.background = SWATCH_COLORS[current] || SWATCH_COLORS.light;
        });
    });
})();