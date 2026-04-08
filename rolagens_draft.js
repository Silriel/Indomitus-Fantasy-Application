(function () {
    const STORAGE_KEY = "INDOMITUS_ROLAGENS_DRAFT_V1";
    const storage = window.INDOMITUS_STORAGE || {};
    let restoring = false;
    let timer = null;

    function readDraft() {
        return typeof storage.readJson === "function"
            ? storage.readJson(STORAGE_KEY, null)
            : (() => {
                try {
                    const raw = localStorage.getItem(STORAGE_KEY);
                    return raw ? JSON.parse(raw) : null;
                } catch (_error) {
                    return null;
                }
            })();
    }

    function collectModifiers() {
        return Array.from(document.querySelectorAll("#modifierList .mod-row")).map((row) => {
            const inputs = row.querySelectorAll("input");
            return {
                label: inputs[0] ? inputs[0].value : "",
                value: inputs[1] ? inputs[1].value : "0"
            };
        });
    }

    function getActiveSides() {
        const active = document.querySelector(".dice-preset.is-active");
        return active ? active.dataset.sides : "20";
    }

    function writeDraft() {
        if (restoring) return;
        const payload = {
            rollLabel: document.getElementById("rollLabel") ? document.getElementById("rollLabel").value : "",
            diceCount: document.getElementById("diceCount") ? document.getElementById("diceCount").value : "1",
            baseModifier: document.getElementById("baseModifier") ? document.getElementById("baseModifier").value : "0",
            customSides: document.getElementById("customSides") ? document.getElementById("customSides").value : "20",
            sidesMode: getActiveSides(),
            modifiers: collectModifiers()
        };
        if (typeof storage.writeJson === "function") {
            storage.writeJson(STORAGE_KEY, payload);
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        }
    }

    function scheduleWriteDraft() {
        if (restoring) return;
        clearTimeout(timer);
        timer = setTimeout(writeDraft, 220);
    }

    function restoreDraft() {
        const draft = readDraft();
        if (!draft || typeof draft !== "object") return;
        restoring = true;
        try {
            if (document.getElementById("rollLabel")) document.getElementById("rollLabel").value = draft.rollLabel || "";
            if (document.getElementById("diceCount")) document.getElementById("diceCount").value = draft.diceCount || "1";
            if (document.getElementById("baseModifier")) document.getElementById("baseModifier").value = draft.baseModifier || "0";
            if (document.getElementById("customSides")) document.getElementById("customSides").value = draft.customSides || "20";

            const targetButton = document.querySelector(`.dice-preset[data-sides="${draft.sidesMode || "20"}"]`);
            if (targetButton) {
                targetButton.click();
            }

            if (document.getElementById("modifierList")) {
                document.getElementById("modifierList").innerHTML = "";
                const modifiers = Array.isArray(draft.modifiers) && draft.modifiers.length ? draft.modifiers : [{ label: "Atributo", value: 0 }];
                modifiers.forEach((mod) => createModifierRow(String(mod.label || ""), Number(mod.value || 0)));
            }

            if (typeof updateFormulaPreview === "function") updateFormulaPreview();
        } finally {
            restoring = false;
            scheduleWriteDraft();
        }
    }

    function clearDraft() {
        if (typeof storage.remove === "function") {
            storage.remove(STORAGE_KEY);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
        if (typeof resetForm === "function") {
            resetForm();
        }
    }

    function injectControls() {
        if (document.getElementById("clearRollDraftBtn")) return;
        const actions = document.querySelector(".stack-actions");
        if (!actions) return;
        const button = document.createElement("button");
        button.type = "button";
        button.id = "clearRollDraftBtn";
        button.className = "ghost-btn";
        button.textContent = "Limpar rascunho local";
        actions.appendChild(button);
        button.addEventListener("click", clearDraft);
    }

    function init() {
        injectControls();
        restoreDraft();

        document.addEventListener("input", (event) => {
            if (!event.target) return;
            if (event.target.closest("#modifierList") || ["rollLabel", "diceCount", "baseModifier", "customSides"].includes(event.target.id)) {
                scheduleWriteDraft();
            }
        }, true);

        document.addEventListener("click", (event) => {
            const target = event.target;
            if (!target) return;
            if (target.closest(".dice-preset") || target.id === "addModifierBtn" || target.classList.contains("remove-btn") || target.id === "resetBtn" || target.id === "rollBtn") {
                setTimeout(scheduleWriteDraft, 0);
            }
        }, true);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
