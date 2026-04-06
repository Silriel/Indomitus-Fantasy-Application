(() => {
    const entries = [
        { file: "tradutores.html", title: "Menu", note: "Idiomas" },
        { file: "tradutor_eladre.html", title: "Eladre", note: "Claro" },
        { file: "tradutor_desereth.html", title: "Desereth", note: "Deserto" },
        { file: "tradutor_alto_humano.html", title: "Alto Humano", note: "Formal" },
        { file: "tradutor_anao.html", title: "Anao", note: "Runas" },
        { file: "tradutor_draconico.html", title: "Draconico", note: "Atual" },
        { file: "tradutor_draconico_antigo.html", title: "Draconico Antigo", note: "Antigo" },
        { file: "tradutor_edelin.html", title: "Edelin", note: "Imperial" },
        { file: "tradutor_elfico.html", title: "Elfico", note: "Padrao" },
        { file: "tradutor_elfico_antigo.html", title: "Elfico Antigo", note: "Antigo" },
        { file: "tradutor_elfico_florialis.html", title: "Florialis", note: "Natureza" },
        { file: "tradutor_hespelerine.html", title: "Hespelerine", note: "Mar" },
        { file: "tradutor_snarilil.html", title: "Snarilil", note: "Frio" }
    ];

    const translatorMeta = {
        "tradutor_alto_humano.html": { name: "Alto Humano" },
        "tradutor_anao.html": { name: "Anao" },
        "tradutor_desereth.html": { name: "Desereth" },
        "tradutor_draconico.html": { name: "Draconico" },
        "tradutor_draconico_antigo.html": { name: "Draconico Antigo" },
        "tradutor_edelin.html": { name: "Edelin" },
        "tradutor_eladre.html": { name: "Eladre" },
        "tradutor_elfico.html": { name: "Elfico" },
        "tradutor_elfico_antigo.html": { name: "Elfico Antigo" },
        "tradutor_elfico_florialis.html": { name: "Florialis" },
        "tradutor_hespelerine.html": { name: "Hespelerine" },
        "tradutor_snarilil.html": { name: "Snarilil" }
    };

    const hubCardMeta = {
        "tradutor_alto_humano.html": { title: "Alto Humano", note: "Formal" },
        "tradutor_anao.html": { title: "Anao", note: "Runas" },
        "tradutor_desereth.html": { title: "Desereth", note: "Deserto" },
        "tradutor_draconico_antigo.html": { title: "Draconico Antigo", note: "Versao antiga" },
        "tradutor_draconico.html": { title: "Draconico", note: "Versao atual" },
        "tradutor_edelin.html": { title: "Edelin", note: "Imperial" },
        "tradutor_eladre.html": { title: "Eladre", note: "Claro" },
        "tradutor_elfico_antigo.html": { title: "Elfico Antigo", note: "Versao antiga" },
        "tradutor_elfico.html": { title: "Elfico", note: "Uso geral" },
        "tradutor_elfico_florialis.html": { title: "Florialis", note: "Natureza" },
        "tradutor_hespelerine.html": { title: "Hespelerine", note: "Mar" },
        "tradutor_snarilil.html": { title: "Snarilil", note: "Noite" }
    };

    const currentFile = (() => {
        const raw = window.location.pathname.split("/").pop() || "";
        return raw.toLowerCase();
    })();

    const normalizeAscii = (value) =>
        (value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

    const setText = (selector, text) => {
        const node = document.querySelector(selector);
        if (node) {
            node.textContent = text;
        }
    };

    const getHeaderLinkText = (href) => {
        const clean = (href || "").split("#")[0].split("?")[0].split("/").pop();

        switch (clean) {
            case "menu.html":
                return "Menu principal";
            case "tradutores.html":
                return "Menu de idiomas";
            case "calculadora_rpg.html":
                return "Calculadora";
            case "rolagens.html":
                return "Rolagens";
            case "criador_personagem.html":
                return "Criador automatico";
            case "criador_pessoal.html":
                return "Criador pessoal";
            default:
                return null;
        }
    };

    const simplifyNav = () => {
        document.querySelectorAll("header nav a").forEach((link) => {
            const label = getHeaderLinkText(link.getAttribute("href"));
            if (label) {
                link.textContent = label;
            }
        });
    };

    const buildTabs = () => {
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
            '<span class="language-tabs-kicker">Menu de idiomas</span>' +
            "<p>Abra outro idioma rapidamente. Cada pagina recebe texto em portugues e mostra o resultado no idioma escolhido.</p>";

        const badge = document.createElement("div");
        badge.className = "language-tabs-badge";
        badge.textContent = "Acesso rapido";

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

            const note = document.createElement("span");
            note.className = "language-tab-flavor";
            note.textContent = entry.note;

            inner.append(title, note);
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
    };

    const simplifyHub = () => {
        document.title = "Indomitus Fantasy - Tradutores";

        setText(".tower-kicker", "Menu de idiomas");
        setText(".tower-hero h2", "Escolha o idioma que voce quer abrir.");
        setText(
            ".tower-hero p",
            "Use este menu para abrir um tradutor. Em cada pagina voce digita um texto em portugues e ve o resultado no idioma escolhido."
        );

        const pills = Array.from(document.querySelectorAll(".tower-pill"));
        ["Palavras", "Frases", "Resultado", "Acesso rapido"].forEach((text, index) => {
            if (pills[index]) {
                pills[index].textContent = text;
            }
        });

        const panelTexts = [
            { label: "Menu", text: "Abra qualquer tradutor a partir desta pagina." },
            { label: "Uso", text: "Cada card leva direto para um idioma." },
            { label: "Fluxo", text: "Digite o texto em portugues e veja o resultado na mesma tela." },
            { label: "Leitura", text: "Os nomes e descricoes agora estao mais simples." }
        ];

        Array.from(document.querySelectorAll(".tower-panel")).forEach((panel, index) => {
            const item = panelTexts[index];
            if (!item) {
                return;
            }

            const label = panel.querySelector("span");
            const text = panel.querySelector("strong");
            if (label) {
                label.textContent = item.label;
            }
            if (text) {
                text.textContent = item.text;
            }
        });

        setText(".hub-title h2", "Tradutores");
        setText(".hub-title p", "Selecione um idioma para abrir o tradutor correspondente.");

        document.querySelectorAll(".lang-card").forEach((card) => {
            const href = (card.getAttribute("href") || "").split("/").pop();
            const meta = hubCardMeta[href];
            if (!meta) {
                return;
            }

            const title = card.querySelector("span");
            const note = card.querySelector("small");

            if (title) {
                title.textContent = meta.title;
            }
            if (note) {
                note.textContent = meta.note;
            }
        });

        const footer = document.querySelector("footer");
        if (footer) {
            footer.textContent = "Indomitus Fantasy - Menu de tradutores";
        }
    };

    const ensureFieldLabel = (input) => {
        if (!input || !input.parentElement) {
            return;
        }

        const wrapper = input.parentElement;
        let label = wrapper.querySelector(".translator-field-label[data-role='input']");

        if (!label) {
            label = document.createElement("div");
            label.className = "translator-field-label";
            label.dataset.role = "input";
            wrapper.insertBefore(label, input);
        }

        label.textContent = "Texto em portugues";
    };

    const ensureResultLabel = (output) => {
        if (!output || !output.parentElement) {
            return;
        }

        const outputBox = output.closest(".output-box");
        if (outputBox) {
            let label = outputBox.querySelector(".output-label");
            if (!label) {
                label = document.createElement("div");
                label.className = "output-label";
                outputBox.insertBefore(label, output);
            }
            label.textContent = "Resultado";
            return;
        }

        const wrapper = output.parentElement;
        let label = wrapper.querySelector(".translator-field-label[data-role='result']");
        if (!label) {
            label = document.createElement("div");
            label.className = "translator-field-label is-result";
            label.dataset.role = "result";
            wrapper.insertBefore(label, output);
        }
        label.textContent = "Resultado";
    };

    const ensureHelpNote = (input) => {
        if (!input || !input.parentElement) {
            return;
        }

        const existing = input.parentElement.querySelector(".translation-note");
        if (existing) {
            return;
        }

        const note = document.createElement("div");
        note.className = "translation-note";
        note.textContent = "A traducao aparece abaixo e atualiza enquanto voce digita.";
        input.insertAdjacentElement("afterend", note);
    };

    const normalizeResultText = (output) => {
        if (!output) {
            return;
        }

        const label = output.querySelector("span");
        if (label) {
            const labelText = normalizeAscii(label.textContent);
            if (labelText.includes("traducao") || labelText.includes("resultado") || labelText.includes("fonetica")) {
                label.textContent = "Resultado";
            }
        }

        const rawText = output.textContent || "";
        const normalized = normalizeAscii(rawText).trim();

        const isPlaceholder =
            normalized.includes("guardia descansa") ||
            normalized.includes("vento aguarda") ||
            normalized.includes("resultado vai aparecer aqui") ||
            normalized.includes("silencio") ||
            normalized.includes("aguarda em silencio");

        if (isPlaceholder) {
            output.textContent = "O resultado vai aparecer aqui.";
        }
    };

    const normalizeErrorText = (errorBox) => {
        if (!errorBox) {
            return;
        }

        const text = errorBox.textContent || "";
        if (!text) {
            return;
        }

        const normalized = normalizeAscii(text);
        if (normalized.includes("simbolo profano")) {
            const match = text.match(/"(.+?)"/);
            const detail = match ? `: "${match[1]}"` : ".";
            errorBox.textContent = `Caractere nao suportado${detail}`;
        }
    };

    const observeBox = (node, callback) => {
        if (!node) {
            return;
        }

        const observer = new MutationObserver(() => callback(node));
        observer.observe(node, {
            childList: true,
            subtree: true,
            characterData: true
        });
    };

    const simplifyTranslatorPage = () => {
        const meta = translatorMeta[currentFile];
        if (!meta) {
            return;
        }

        document.title = `Indomitus Fantasy - Tradutor ${meta.name}`;

        const title = document.querySelector(".forge-header h2, .translator-header h2, .forest-header h2");
        if (title) {
            title.textContent = `Tradutor ${meta.name}`;
        }

        const subtitle = document.querySelector(".forge-header .subtitle, .translator-header p, .forest-header p");
        if (subtitle) {
            subtitle.textContent = `Digite uma palavra ou frase em portugues para ver o resultado em ${meta.name}.`;
        }

        const input = document.querySelector("#inputWord, #inputText, textarea, input[type='text']");
        if (input) {
            input.placeholder = "Digite uma palavra ou frase em portugues";
            input.setAttribute("aria-label", "Texto em portugues");
            ensureFieldLabel(input);
            ensureHelpNote(input);
        }

        const output = document.querySelector("#transcription, #outputText, .translation-text, .output");
        ensureResultLabel(output);
        normalizeResultText(output);

        const errorBox = document.querySelector("#error, #errorLog, .error, .error-msg, .error-log");
        normalizeErrorText(errorBox);

        observeBox(output, normalizeResultText);
        observeBox(errorBox, normalizeErrorText);

        if (input && output) {
            input.addEventListener("input", () => {
                window.setTimeout(() => normalizeResultText(output), 0);
            });
        }
    };

    buildTabs();
    simplifyNav();

    if (currentFile === "tradutores.html") {
        simplifyHub();
    } else {
        simplifyTranslatorPage();
    }
})();
