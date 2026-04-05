(() => {
    const entries = [
        { file: "tradutores.html", title: "Torre", flavor: "Hub" },
        { file: "tradutor_eladre.html", title: "Elandre", flavor: "Celestial" },
        { file: "tradutor_desereth.html", title: "Desereth", flavor: "Deserto" },
        { file: "tradutor_alto_humano.html", title: "Alto Humano", flavor: "Imperial" },
        { file: "tradutor_anao.html", title: "Anao", flavor: "Forja" },
        { file: "tradutor_draconico.html", title: "Draconico", flavor: "Fogo" },
        { file: "tradutor_draconico_antigo.html", title: "Drac. Antigo", flavor: "Ancestral" },
        { file: "tradutor_edelin.html", title: "Edelin", flavor: "Sagrado" },
        { file: "tradutor_elfico.html", title: "Elfico", flavor: "Luar" },
        { file: "tradutor_elfico_antigo.html", title: "Elfico Antigo", flavor: "Ruinas" },
        { file: "tradutor_elfico_florialis.html", title: "Florialis", flavor: "Flores" },
        { file: "tradutor_hespelerine.html", title: "Hespelerine", flavor: "Mares" },
        { file: "tradutor_snarilil.html", title: "Snarilil", flavor: "Neblina" }
    ];

    const currentFile = (() => {
        const raw = window.location.pathname.split("/").pop() || "";
        return raw.toLowerCase();
    })();

    const main = document.querySelector("main");
    if (!main) {
        return;
    }

    const shell = document.createElement("section");
    shell.className = "language-tabs-shell";

    const wrapper = document.createElement("div");
    wrapper.className = "language-tabs";

    const top = document.createElement("div");
    top.className = "language-tabs-top";

    const copy = document.createElement("div");
    copy.className = "language-tabs-copy";
    copy.innerHTML =
        '<span class="language-tabs-kicker">Rotas da Torre</span>' +
        "<p>Troque de idioma como quem abre alas de um codex arcano, com navegacao mais nobre e leitura mais rapida.</p>";

    const badge = document.createElement("div");
    badge.className = "language-tabs-badge";
    badge.textContent = "Idiomas Vivos";

    top.append(copy, badge);

    const list = document.createElement("div");
    list.className = "language-tab-list";

    for (const entry of entries) {
        const link = document.createElement("a");
        link.className = "language-tab";
        link.href = entry.file;

        if (entry.file.toLowerCase() === currentFile) {
            link.classList.add("is-active");
            link.setAttribute("aria-current", "page");
        }

        const mark = document.createElement("span");
        mark.className = "language-tab-mark";
        mark.setAttribute("aria-hidden", "true");

        const inner = document.createElement("span");
        inner.className = "language-tab-copy";

        const title = document.createElement("span");
        title.className = "language-tab-title";
        title.textContent = entry.title;

        const flavor = document.createElement("span");
        flavor.className = "language-tab-flavor";
        flavor.textContent = entry.flavor;

        inner.append(title, flavor);
        link.append(mark, inner);
        list.append(link);
    }

    wrapper.append(top, list);
    shell.append(wrapper);

    const hero = currentFile === "tradutores.html" ? main.querySelector(".tower-hero") : null;
    if (hero) {
        hero.insertAdjacentElement("afterend", shell);
    } else {
        main.insertAdjacentElement("afterbegin", shell);
    }
})();
