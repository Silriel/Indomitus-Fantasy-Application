(function () {
    const STORAGE_KEY = "INDOMITUS_SCREEN_DOCK_STATE_V1";
    const LINKS = [
        { href: "calculadora_rpg.html", label: "Calculadora" },
        { href: "criador_pessoal.html", label: "Criador Pessoal" },
        { href: "rolagens.html", label: "Rolagens" },
        { href: "tradutores.html", label: "Tradutores" }
    ];

    function injectStyles() {
        if (document.getElementById("indomitus-screen-dock-style")) return;
        const style = document.createElement("style");
        style.id = "indomitus-screen-dock-style";
        style.textContent = `
            .indomitus-screen-dock-shell,
            .indomitus-screen-dock,
            .indomitus-screen-dock a,
            .indomitus-screen-dock-toggle {
                box-sizing: border-box;
            }

            .indomitus-screen-dock-shell {
                --dock-width: 224px;
                position: fixed;
                left: 0;
                top: 50%;
                z-index: 9999;
                display: flex;
                align-items: stretch;
                transform: translateY(-50%);
                transition: transform 0.24s ease;
            }

            .indomitus-screen-dock-shell.is-collapsed {
                transform: translate(calc(var(--dock-width) * -1), -50%);
            }

            .indomitus-screen-dock {
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: stretch;
                gap: 10px;
                width: var(--dock-width);
                padding: 14px;
                margin: 0;
                border-radius: 0 18px 18px 0;
                border: 1px solid rgba(255, 255, 255, 0.12);
                background: rgba(8, 12, 18, 0.86);
                box-shadow: 0 18px 42px rgba(0, 0, 0, 0.34);
                backdrop-filter: blur(14px);
            }

            .indomitus-screen-dock-toggle {
                width: 46px;
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-left: none;
                border-radius: 0 16px 16px 0;
                background: rgba(8, 12, 18, 0.92);
                color: #f3ead2;
                font: 700 0.82rem "Cinzel", serif;
                letter-spacing: 0.6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 18px 42px rgba(0, 0, 0, 0.28);
                transition: background 0.18s ease, color 0.18s ease;
                writing-mode: vertical-rl;
                text-orientation: mixed;
                padding: 14px 0;
            }

            .indomitus-screen-dock-toggle:hover {
                background: rgba(212, 175, 55, 0.16);
                color: #fff4d0;
            }

            .indomitus-screen-dock a {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                width: 100%;
                min-height: 46px;
                padding: 12px 14px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.08);
                color: #f3ead2;
                text-decoration: none;
                font: 600 0.92rem "Cinzel", serif;
                letter-spacing: 0.3px;
                background: rgba(255, 255, 255, 0.04);
                transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
            }

            .indomitus-screen-dock a:hover {
                transform: translateX(2px);
                border-color: rgba(212, 175, 55, 0.45);
                background: rgba(212, 175, 55, 0.12);
            }

            .indomitus-screen-dock a.is-active {
                color: #1a1204;
                border-color: rgba(247, 200, 115, 0.85);
                background: linear-gradient(135deg, rgba(247, 200, 115, 0.98), rgba(212, 175, 55, 0.94));
                box-shadow: 0 10px 24px rgba(212, 175, 55, 0.24);
            }

            @media (max-width: 720px) {
                .indomitus-screen-dock-shell {
                    --dock-width: 184px;
                }

                .indomitus-screen-dock {
                    padding: 12px;
                }

                .indomitus-screen-dock a {
                    font-size: 0.86rem;
                }

                .indomitus-screen-dock-toggle {
                    width: 40px;
                    font-size: 0.75rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function readCollapsedState() {
        try {
            return localStorage.getItem(STORAGE_KEY) !== "open";
        } catch (_error) {
            return true;
        }
    }

    function writeCollapsedState(isCollapsed) {
        try {
            localStorage.setItem(STORAGE_KEY, isCollapsed ? "collapsed" : "open");
        } catch (_error) {
            // ignora falha no localStorage
        }
    }

    function injectDock() {
        if (document.querySelector(".indomitus-screen-dock-shell")) return;
        injectStyles();
        const pageName = window.location.pathname.split(/[\\/]/).pop().toLowerCase();
        const collapsed = readCollapsedState();
        const shell = document.createElement("div");
        shell.className = `indomitus-screen-dock-shell${collapsed ? " is-collapsed" : ""}`;
        shell.setAttribute("data-collapsed", collapsed ? "true" : "false");

        const nav = document.createElement("nav");
        nav.className = "indomitus-screen-dock";
        nav.setAttribute("aria-label", "Navegacao rapida");
        nav.innerHTML = LINKS.map((link) => {
            const activeClass = pageName === link.href.toLowerCase() ? "is-active" : "";
            return `<a class="${activeClass}" href="${link.href}">${link.label}</a>`;
        }).join("");

        const toggle = document.createElement("button");
        toggle.className = "indomitus-screen-dock-toggle";
        toggle.type = "button";
        toggle.setAttribute("aria-label", collapsed ? "Mostrar navegacao" : "Esconder navegacao");
        toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
        toggle.textContent = collapsed ? "Menu" : "Fechar";
        toggle.addEventListener("click", () => {
            const isCollapsed = shell.classList.toggle("is-collapsed");
            shell.setAttribute("data-collapsed", isCollapsed ? "true" : "false");
            toggle.setAttribute("aria-label", isCollapsed ? "Mostrar navegacao" : "Esconder navegacao");
            toggle.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
            toggle.textContent = isCollapsed ? "Menu" : "Fechar";
            writeCollapsedState(isCollapsed);
        });

        shell.appendChild(nav);
        shell.appendChild(toggle);
        document.body.appendChild(shell);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", injectDock);
    } else {
        injectDock();
    }
})();
