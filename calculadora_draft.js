(function () {
    const STORAGE_KEY = "INDOMITUS_CALCULADORA_DRAFT_V1";
    const FIELD_IDS = [
        "equipamento",
        "modificador-forca",
        "tecido",
        "material",
        "raridade",
        "cristal",
        "encantamento_grau",
        "encantamento_tipo"
    ];
    let restoring = false;
    let timer = null;

    function readDraft() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (_error) {
            return null;
        }
    }

    function writeDraft() {
        if (restoring) return;
        const payload = {
            fields: FIELD_IDS.reduce((acc, id) => {
                const el = document.getElementById(id);
                if (el) acc[id] = el.value;
                return acc;
            }, {}),
            fusionIds: typeof obterIdsMateriaisFusao === "function" ? obterIdsMateriaisFusao() : [],
            hadCalculated: Boolean(document.getElementById("resultado-container") && document.getElementById("resultado-container").style.display === "block")
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
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
            FIELD_IDS.forEach((id) => {
                if (!draft.fields || !Object.prototype.hasOwnProperty.call(draft.fields, id)) return;
                const el = document.getElementById(id);
                if (!el) return;
                if (el.tagName === "SELECT") {
                    if ([...el.options].some((option) => option.value === String(draft.fields[id]))) {
                        el.value = draft.fields[id];
                    }
                } else {
                    el.value = draft.fields[id];
                }
            });

            const fusionState = document.getElementById("material-fusao-state");
            if (fusionState && Array.isArray(draft.fusionIds)) {
                fusionState.value = JSON.stringify(draft.fusionIds.map((item) => String(item)));
            }

            if (typeof toggleCampos === "function") toggleCampos();
            if (typeof renderizarMateriaisFusao === "function") renderizarMateriaisFusao();

            if (draft.hadCalculated && typeof forjarEquipamento === "function") {
                forjarEquipamento();
            }
        } finally {
            restoring = false;
            scheduleWriteDraft();
        }
    }

    function clearDraft() {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
    }

    function injectControls() {
        if (document.getElementById("clearCalcDraftBtn")) return;
        const host = document.querySelector(".calc-actions");
        if (!host) return;
        const wrap = document.createElement("div");
        wrap.style.cssText = "display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:14px;";
        wrap.innerHTML = `
            <button class="action-btn" id="clearCalcDraftBtn" type="button" style="background:rgba(255,255,255,0.08);">Limpar rascunho local</button>
            <small style="color:var(--text-muted);">Os campos desta calculadora salvam automaticamente no navegador.</small>
        `;
        host.appendChild(wrap);
        document.getElementById("clearCalcDraftBtn").addEventListener("click", clearDraft);
    }

    function init() {
        injectControls();
        restoreDraft();

        document.addEventListener("input", (event) => {
            const target = event.target;
            if (!target || !FIELD_IDS.includes(target.id)) return;
            scheduleWriteDraft();
        }, true);

        document.addEventListener("change", (event) => {
            const target = event.target;
            if (!target || !FIELD_IDS.includes(target.id)) return;
            scheduleWriteDraft();
        }, true);

        if (typeof salvarIdsMateriaisFusao === "function") {
            const originalSalvarIds = salvarIdsMateriaisFusao;
            window.salvarIdsMateriaisFusao = function salvarIdsMateriaisFusaoComDraft(ids) {
                const result = originalSalvarIds.call(this, ids);
                scheduleWriteDraft();
                return result;
            };
        }

        if (typeof forjarEquipamento === "function") {
            const originalForjar = forjarEquipamento;
            window.forjarEquipamento = function forjarEquipamentoComDraft() {
                const result = originalForjar.apply(this, arguments);
                scheduleWriteDraft();
                return result;
            };
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
