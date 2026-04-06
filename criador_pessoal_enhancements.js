(function () {
    "use strict";

    const DRAFT_KEY = "INDOMITUS_FICHA_DRAFT_V2";
    const QUICK_ACTION_TYPES = [
        { value: "dano", label: "Dano" },
        { value: "cura", label: "Cura" },
        { value: "efeito", label: "Efeito" },
        { value: "dano_efeito", label: "Dano + efeito" },
        { value: "cura_efeito", label: "Cura + efeito" }
    ];
    const SLOT_LABELS = {
        armadura: "Armadura",
        mao_direita: "Mao direita",
        mao_esquerda: "Mao esquerda",
        adorno_1: "Adorno 1",
        adorno_2: "Adorno 2",
        adorno_3: "Adorno 3",
        nenhum: "Sem slot"
    };
    const EQUIP_GROUP_LABELS = {
        armadura: "Armadura",
        mao: "Mao",
        adorno: "Adorno",
        nenhum: "Nao equipavel"
    };
    const HAND_MODE_LABELS = {
        one_hand: "1 mao",
        two_hands: "2 maos",
        flex: "1 ou 2 maos",
        none: "Sem uso nas maos"
    };
    const HAND_SLOTS = ["mao_direita", "mao_esquerda"];
    const ADORN_SLOTS = ["adorno_1", "adorno_2", "adorno_3"];
    const EQUIPMENT_SLOT_ORDER = ["armadura", ...HAND_SLOTS, ...ADORN_SLOTS];
    const DEFAULT_FILTERS = {
        abilities: { search: "", tier: "todos", unlockedOnly: false, selectedOnly: false },
        passives: { search: "", selected: "todas", requirement: "todas", availability: "todas" },
        inventory: { search: "", type: "todos", rarity: "todas", status: "todos" }
    };
    const DEFAULT_STATE = {
        autosaveDraftVersion: 4,
        skillQuickActions: {},
        combatActionHistory: [],
        equipmentSlots: { armadura: "", mao_direita: "", mao_esquerda: "", adorno_1: "", adorno_2: "", adorno_3: "" },
        compare: [],
        filters: DEFAULT_FILTERS
    };

    const state = {
        autosaveDraftVersion: 4,
        skillQuickActions: {},
        combatActionHistory: [],
        equipmentSlots: { armadura: "", mao_direita: "", mao_esquerda: "", adorno_1: "", adorno_2: "", adorno_3: "" },
        compare: [],
        filters: clone(DEFAULT_FILTERS)
    };

    const original = {};
    let autosaveTimer = null;

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function normalizarTexto(texto) {
        return String(texto || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    function arredondar(numero) {
        const valor = Number(numero);
        return Number.isFinite(valor) ? Number(valor.toFixed(2)) : 0;
    }

    function normalizarInteiro(valor, fallback) {
        const numero = parseInt(valor, 10);
        return Number.isFinite(numero) ? numero : (parseInt(fallback, 10) || 0);
    }

    function parsePesoNumero(valor) {
        if (typeof valor === "number" && Number.isFinite(valor)) return valor;
        const match = String(valor || "").replace(",", ".").match(/-?\d+(\.\d+)?/);
        return match ? Number(match[0]) : 0;
    }

    function normalizarSlotTipo(valor) {
        const slot = normalizarTexto(valor);
        return Object.prototype.hasOwnProperty.call(SLOT_LABELS, slot) ? slot : "nenhum";
    }

    function normalizarEquipGroup(valor) {
        const group = normalizarTexto(valor);
        return Object.prototype.hasOwnProperty.call(EQUIP_GROUP_LABELS, group) ? group : "nenhum";
    }

    function normalizarHandMode(valor) {
        const mode = normalizarTexto(valor);
        if (mode === "one_hand" || mode === "two_hands" || mode === "flex" || mode === "none") return mode;
        return "none";
    }

    function obterEstadoSerializado() {
        return {
            autosaveDraftVersion: 4,
            skillQuickActions: clone(state.skillQuickActions),
            combatActionHistory: clone(state.combatActionHistory),
            equipmentSlots: clone(state.equipmentSlots),
            compare: Array.isArray(state.compare) ? state.compare.slice(0, 2) : [],
            filters: clone(state.filters)
        };
    }

    function aplicarEstadoExtra(extra) {
        const dados = extra && typeof extra === "object" ? extra : {};
        state.autosaveDraftVersion = 4;
        state.skillQuickActions = sanitizarQuickActions(dados.skillQuickActions);
        state.combatActionHistory = sanitizarHistorico(dados.combatActionHistory);
        state.equipmentSlots = sanitizarEquipmentSlots(dados.equipmentSlots);
        state.compare = sanitizarCompare(dados.compare);
        state.filters = sanitizarFilters(dados.filters);
    }

    function sanitizarQuickActions(raw) {
        const obj = raw && typeof raw === "object" ? raw : {};
        const saida = {};
        Object.entries(obj).forEach(([key, value]) => {
            if (!key) return;
            const atual = value && typeof value === "object" ? value : {};
            saida[key] = {
                hpCost: Math.max(0, parseInt(atual.hpCost, 10) || 0),
                mpCost: Math.max(0, parseInt(atual.mpCost, 10) || 0),
                spCost: Math.max(0, parseInt(atual.spCost, 10) || 0),
                formula: String(atual.formula || "").trim(),
                actionType: QUICK_ACTION_TYPES.some((item) => item.value === atual.actionType) ? atual.actionType : "dano",
                effectText: String(atual.effectText || "").trim()
            };
        });
        return saida;
    }

    function sanitizarHistorico(raw) {
        if (!Array.isArray(raw)) return [];
        return raw.map((item) => {
            const atual = item && typeof item === "object" ? item : {};
            return {
                id: String(atual.id || `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`),
                label: String(atual.label || "Acao"),
                formula: String(atual.formula || ""),
                actionType: String(atual.actionType || "efeito"),
                result: arredondar(atual.result),
                effectText: String(atual.effectText || ""),
                hpCost: Math.max(0, parseInt(atual.hpCost, 10) || 0),
                mpCost: Math.max(0, parseInt(atual.mpCost, 10) || 0),
                spCost: Math.max(0, parseInt(atual.spCost, 10) || 0),
                source: String(atual.source || ""),
                createdAt: String(atual.createdAt || new Date().toISOString())
            };
        }).slice(-80);
    }

    function sanitizarEquipmentSlots(raw) {
        const slots = clone(DEFAULT_STATE.equipmentSlots);
        const source = raw && typeof raw === "object" ? raw : {};
        EQUIPMENT_SLOT_ORDER.forEach((key) => {
            slots[key] = typeof source[key] === "string" ? source[key] : "";
        });
        if (!slots.mao_direita && typeof source.arma === "string") {
            slots.mao_direita = source.arma;
        }
        if (!slots.armadura && typeof source.armadura === "string") {
            slots.armadura = source.armadura;
        }
        const adornosLegados = [source.anel, source.colar, source.acessorio]
            .filter((itemId) => typeof itemId === "string" && itemId.trim())
            .filter((itemId, index, lista) => lista.indexOf(itemId) === index);
        ADORN_SLOTS.forEach((slot, index) => {
            if (!slots[slot] && adornosLegados[index]) {
                slots[slot] = adornosLegados[index];
            }
        });
        return slots;
    }

    function sanitizarCompare(raw) {
        return Array.isArray(raw)
            ? raw.map((item) => String(item || "")).filter(Boolean).slice(0, 2)
            : [];
    }

    function sanitizarFilters(raw) {
        const next = clone(DEFAULT_FILTERS);
        const source = raw && typeof raw === "object" ? raw : {};
        next.abilities = { ...next.abilities, ...(source.abilities || {}) };
        next.passives = { ...next.passives, ...(source.passives || {}) };
        next.inventory = { ...next.inventory, ...(source.inventory || {}) };
        next.abilities.unlockedOnly = Boolean(next.abilities.unlockedOnly);
        next.abilities.selectedOnly = Boolean(next.abilities.selectedOnly);
        return next;
    }

    function debounceAutosave() {
        window.clearTimeout(autosaveTimer);
        autosaveTimer = window.setTimeout(salvarRascunhoLocal, 180);
    }

    function salvarRascunhoLocal() {
        if (!window.localStorage || typeof window.coletarDadosFicha !== "function") return;
        try {
            const payload = window.coletarDadosFicha();
            window.localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
        } catch (_error) {
            // ignora falhas de armazenamento local
        }
    }

    function carregarRascunhoLocal() {
        if (!window.localStorage) return false;
        try {
            const bruto = window.localStorage.getItem(DRAFT_KEY);
            if (!bruto) return false;
            const payload = JSON.parse(bruto);
            if (!payload || typeof payload !== "object" || !payload.dados) return false;
            window.aplicarDadosFicha(payload.dados);
            if (typeof window.atualizarStatusSave === "function") {
                window.atualizarStatusSave("Rascunho local restaurado automaticamente.");
            }
            return true;
        } catch (_error) {
            return false;
        }
    }

    function inferirEquipMeta(item) {
        const forgeTipo = normalizarTexto(item && item.forgeTipo);
        const tipo = normalizarTexto(item && item.tipo);
        const categoria = normalizarTexto(item && item.categoria);
        const groupDireto = normalizarEquipGroup(item && item.equipGroup);
        const modeDireto = normalizarHandMode(item && item.handMode);
        if (groupDireto !== "nenhum") {
            return {
                equipGroup: groupDireto,
                handMode: groupDireto === "mao" ? (modeDireto === "none" ? "flex" : modeDireto) : "none"
            };
        }
        if (forgeTipo.startsWith("armadura") || forgeTipo === "roupas" || (categoria === "armadura" && forgeTipo !== "escudo")) {
            return { equipGroup: "armadura", handMode: "none" };
        }
        if (forgeTipo === "escudo") {
            return { equipGroup: "mao", handMode: "one_hand" };
        }
        if (forgeTipo === "equip_grande") {
            return { equipGroup: "mao", handMode: "two_hands" };
        }
        if (forgeTipo === "equip_misto" || forgeTipo === "equip_definitivo") {
            return { equipGroup: "mao", handMode: "flex" };
        }
        if (forgeTipo === "equip_pequeno" || forgeTipo === "equip_magico") {
            return { equipGroup: "mao", handMode: "one_hand" };
        }
        if (forgeTipo === "anel" || forgeTipo === "colar" || categoria === "adorno" || tipo === "acessorio") {
            return { equipGroup: "adorno", handMode: "none" };
        }
        if (categoria === "arma" || tipo === "equipamento" || tipo === "arma") {
            return { equipGroup: "mao", handMode: "flex" };
        }
        return { equipGroup: "nenhum", handMode: "none" };
    }

    function inferirSlotItem(item) {
        const meta = inferirEquipMeta(item);
        if (meta.equipGroup === "armadura") return "armadura";
        if (meta.equipGroup === "adorno") return "adorno_1";
        if (meta.equipGroup === "mao") return "mao_direita";
        return "nenhum";
    }

    function obterSlotsHintPorEstado() {
        const hints = {};
        Object.entries(sanitizarEquipmentSlots(state.equipmentSlots)).forEach(([slot, itemId]) => {
            if (!itemId) return;
            if (!hints[itemId]) hints[itemId] = [];
            hints[itemId].push(slot);
        });
        return hints;
    }

    function obterSlotsLegadosItem(item, meta) {
        if (!item || !item.equipado) return [];
        const slotLegado = normalizarTexto(item.slotTipo);
        if (meta.equipGroup === "armadura") return ["armadura"];
        if (meta.equipGroup === "adorno") return ["adorno_auto"];
        if (meta.equipGroup === "mao") {
            if (meta.handMode === "two_hands") return HAND_SLOTS.slice();
            if (slotLegado === "mao_esquerda") return ["mao_esquerda"];
            return ["mao_direita"];
        }
        return [];
    }

    function sanitizarSlotsSolicitados(item, meta, hintSlots) {
        const raw = Array.isArray(item && item.equippedSlots)
            ? item.equippedSlots.map((slot) => normalizarSlotTipo(slot)).filter((slot) => slot !== "nenhum")
            : [];
        if (raw.length) return raw;
        if (Array.isArray(hintSlots) && hintSlots.length) {
            return hintSlots.map((slot) => normalizarSlotTipo(slot)).filter((slot) => slot !== "nenhum");
        }
        return obterSlotsLegadosItem(item, meta);
    }

    function alocarSlotsItem(meta, requestedSlots, occupied) {
        const pedidos = Array.isArray(requestedSlots) ? requestedSlots.slice() : [];
        if (meta.equipGroup === "nenhum") return [];
        if (meta.equipGroup === "armadura") {
            if (!pedidos.length || occupied.has("armadura")) return [];
            return ["armadura"];
        }
        if (meta.equipGroup === "adorno") {
            const preferido = pedidos.find((slot) => ADORN_SLOTS.includes(slot));
            if (preferido && !occupied.has(preferido)) return [preferido];
            const livre = ADORN_SLOTS.find((slot) => !occupied.has(slot));
            return livre ? [livre] : [];
        }
        if (meta.equipGroup === "mao") {
            if (meta.handMode === "two_hands") {
                return HAND_SLOTS.every((slot) => !occupied.has(slot)) ? HAND_SLOTS.slice() : [];
            }
            const pedidosDeMao = pedidos.filter((slot) => HAND_SLOTS.includes(slot));
            if (meta.handMode === "flex" && pedidosDeMao.length === 2) {
                return HAND_SLOTS.every((slot) => !occupied.has(slot)) ? HAND_SLOTS.slice() : [];
            }
            const ordem = pedidosDeMao.length
                ? pedidosDeMao.concat(HAND_SLOTS.filter((slot) => !pedidosDeMao.includes(slot)))
                : HAND_SLOTS.slice();
            const livre = ordem.find((slot) => !occupied.has(slot));
            return livre ? [livre] : [];
        }
        return [];
    }

    function obterSlotTipoCompat(meta, equippedSlots) {
        if (meta.equipGroup === "armadura") return "armadura";
        if (meta.equipGroup === "adorno") return "adorno";
        if (meta.equipGroup === "mao") return "mao";
        return "nenhum";
    }

    function obterDescricaoSlots(item) {
        const slots = Array.isArray(item && item.equippedSlots) ? item.equippedSlots : [];
        if (!slots.length) return "Guardado";
        return slots.map((slot) => SLOT_LABELS[slot] || slot).join(" + ");
    }

    function garantirIntegridadeSlots(itens) {
        const lista = Array.isArray(itens) ? itens : [];
        const slots = clone(DEFAULT_STATE.equipmentSlots);
        const vistos = new Set();
        const hints = obterSlotsHintPorEstado();
        const saida = lista.map((item) => {
            const meta = inferirEquipMeta(item);
            const requestedSlots = sanitizarSlotsSolicitados(item, meta, hints[item.id]);
            const equippedSlots = alocarSlotsItem(meta, requestedSlots, vistos);
            equippedSlots.forEach((slot) => {
                vistos.add(slot);
                slots[slot] = item.id;
            });
            const equipado = equippedSlots.length > 0;
            return {
                ...item,
                equipGroup: meta.equipGroup,
                handMode: meta.handMode,
                equippedSlots,
                equipado,
                slotTipo: obterSlotTipoCompat(meta, equippedSlots),
                statusEquipado: equipado ? "equipado" : "guardado",
                bonusFisico: arredondar(item.bonusFisico),
                bonusMagico: arredondar(item.bonusMagico),
                pesoNumero: arredondar(item.pesoNumero || parsePesoNumero(item.peso)),
                caBonus: Math.max(0, normalizarInteiro(item.caBonus, 0))
            };
        });

        Object.keys(DEFAULT_STATE.equipmentSlots).forEach((key) => {
            state.equipmentSlots[key] = slots[key] || "";
        });

        return saida;
    }

    function obterResumoStatusItem(item) {
        if (!item) return "guardado";
        return item.equipado ? `equipado (${obterDescricaoSlots(item)})` : "guardado";
    }

    function obterConfigQuickAction(key) {
        return state.skillQuickActions[key] || {
            hpCost: 0,
            mpCost: 0,
            spCost: 0,
            formula: "",
            actionType: "dano",
            effectText: ""
        };
    }

    function atualizarConfigQuickAction(key, campo, valor) {
        if (!key) return;
        const atual = obterConfigQuickAction(key);
        const proximo = { ...atual };
        if (campo === "hpCost" || campo === "mpCost" || campo === "spCost") {
            proximo[campo] = Math.max(0, parseInt(valor, 10) || 0);
        } else if (campo === "formula") {
            proximo.formula = String(valor || "").trim();
        } else if (campo === "effectText") {
            proximo.effectText = String(valor || "").trim();
        } else if (campo === "actionType") {
            proximo.actionType = QUICK_ACTION_TYPES.some((item) => item.value === valor) ? valor : "dano";
        }
        state.skillQuickActions[key] = proximo;
        debounceAutosave();
        if (typeof window.calcularFicha === "function" && document.getElementById("resultado")?.innerHTML.trim()) {
            window.calcularFicha(true);
        }
    }

    function setFiltro(bloco, campo, valor) {
        if (!state.filters[bloco]) return;
        state.filters[bloco][campo] = valor;
        if (bloco === "abilities" && typeof window.renderPainelClasseHabilidades === "function") {
            window.renderPainelClasseHabilidades();
        } else if (bloco === "passives" && typeof window.renderPainelPassivas === "function") {
            window.renderPainelPassivas();
        } else if (bloco === "inventory" && typeof window.renderPainelInventario === "function") {
            window.renderPainelInventario();
            if (document.getElementById("resultado")?.innerHTML.trim()) window.calcularFicha(true);
        }
        debounceAutosave();
    }

    function alternarComparacao(id, ativo) {
        const atuais = state.compare.filter((itemId) => itemId !== id);
        if (ativo) atuais.push(id);
        state.compare = atuais.slice(-2);
        if (typeof window.renderPainelInventario === "function") {
            window.renderPainelInventario();
        }
        if (document.getElementById("resultado")?.innerHTML.trim()) {
            window.calcularFicha(true);
        }
        debounceAutosave();
    }

    function obterHabilidadesRapidasDisponiveis() {
        const aprendidas = typeof window.obterHabilidadesSelecionadasDetalhadas === "function"
            ? window.obterHabilidadesSelecionadasDetalhadas().map((item) => ({
                key: `class:${item.id}`,
                nome: item.nome,
                subtitulo: `${item.tierLabel} | ${item.custo}`,
                descricao: `${item.descricao || ""}${item.efeito ? ` Efeito: ${item.efeito}` : ""}`.trim(),
                origem: "Classe"
            }))
            : [];
        const personalizadas = typeof window.obterHabilidadesPersonalizadas === "function"
            ? window.obterHabilidadesPersonalizadas().map((item) => ({
                key: `custom:${item.id}`,
                nome: item.nome,
                subtitulo: item.custo || "Sem custo",
                descricao: item.descricao || "",
                origem: "Personalizada"
            }))
            : [];
        return [...aprendidas, ...personalizadas];
    }

    function habilidadeConfigurada(config) {
        if (!config) return false;
        return Boolean(config.formula || config.effectText || config.hpCost || config.mpCost || config.spCost);
    }

    function rolarFormulaSimples(formula) {
        const limpa = String(formula || "").replace(/\s+/g, "");
        if (!limpa) return { ok: false, total: 0, detalhes: "Sem formula." };
        const partes = limpa.match(/[+-]?[^+-]+/g);
        if (!partes || !partes.length) return { ok: false, total: 0, detalhes: "Formula invalida." };

        const detalhes = [];
        let total = 0;

        for (const parte of partes) {
            const sinal = parte.startsWith("-") ? -1 : 1;
            const termo = parte.replace(/^[+-]/, "");
            const dado = termo.match(/^(\d*)d(\d+)$/i);
            if (dado) {
                const quantidade = Math.max(1, parseInt(dado[1] || "1", 10));
                const lados = Math.max(1, parseInt(dado[2], 10));
                const rolagens = [];
                for (let i = 0; i < quantidade; i += 1) {
                    rolagens.push(1 + Math.floor(Math.random() * lados));
                }
                const subtotal = rolagens.reduce((acc, valor) => acc + valor, 0) * sinal;
                total += subtotal;
                detalhes.push(`${sinal < 0 ? "-" : "+"}${quantidade}d${lados} [${rolagens.join(", ")}]`);
                continue;
            }
            if (!/^\d+(\.\d+)?$/.test(termo)) {
                return { ok: false, total: 0, detalhes: "Formula invalida." };
            }
            total += Number(termo) * sinal;
            detalhes.push(`${sinal < 0 ? "-" : "+"}${termo}`);
        }

        return {
            ok: true,
            total: arredondar(total),
            detalhes: detalhes.join(" ").replace(/^\+/, "")
        };
    }

    function registrarHistoricoAcao(entrada) {
        state.combatActionHistory = sanitizarHistorico([
            ...state.combatActionHistory,
            {
                id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                createdAt: new Date().toISOString(),
                ...entrada
            }
        ]);
        debounceAutosave();
    }

    function aplicarDeltaRecurso(id, delta, maximo) {
        const el = document.getElementById(id);
        if (!el) return 0;
        const atual = Math.max(0, parseInt(el.value || 0, 10) || 0);
        const novo = Math.max(0, Math.min(maximo, atual + delta));
        el.value = novo;
        return novo;
    }

    function usarHabilidadeRapida(key) {
        const habilidade = obterHabilidadesRapidasDisponiveis().find((item) => item.key === key);
        const config = obterConfigQuickAction(key);
        if (!habilidade || !habilidadeConfigurada(config)) {
            alert("Configure a habilidade antes de usar.");
            return;
        }
        const rolagem = config.formula ? rolarFormulaSimples(config.formula) : { ok: true, total: 0, detalhes: "Sem rolagem." };
        if (!rolagem.ok) {
            alert("A formula dessa habilidade esta invalida.");
            return;
        }
        const ficha = typeof window.obterDadosFichaBase === "function" ? window.obterDadosFichaBase() : null;
        if (!ficha) return;
        const recursos = typeof window.sincronizarRecursosAtuais === "function" ? window.sincronizarRecursosAtuais(ficha) : {
            hpAtual: ficha.hpMax,
            mpAtual: ficha.mpMax,
            spAtual: ficha.spMax
        };
        if (recursos.hpAtual < config.hpCost || recursos.mpAtual < config.mpCost || recursos.spAtual < config.spCost) {
            alert("Recursos atuais insuficientes para essa habilidade.");
            return;
        }
        aplicarDeltaRecurso("hpAtual", -config.hpCost, ficha.hpMax);
        aplicarDeltaRecurso("mpAtual", -config.mpCost, ficha.mpMax);
        aplicarDeltaRecurso("spAtual", -config.spCost, ficha.spMax);
        if (config.actionType === "cura" || config.actionType === "cura_efeito") {
            aplicarDeltaRecurso("hpAtual", rolagem.total, ficha.hpMax);
        }
        registrarHistoricoAcao({
            label: habilidade.nome,
            formula: config.formula,
            actionType: config.actionType,
            result: rolagem.total,
            effectText: config.effectText,
            hpCost: config.hpCost,
            mpCost: config.mpCost,
            spCost: config.spCost,
            source: habilidade.origem
        });
        if (typeof window.calcularFicha === "function") {
            window.calcularFicha(true);
        }
    }

    function esc(valor) {
        return typeof window.escaparHtml === "function" ? window.escaparHtml(valor) : String(valor || "");
    }

    function obterNivelMinimoPorTier(tier) {
        const niveis = ABILITY_SLOT_RULES.filter((item) => item.tier === tier).map((item) => item.minLevel);
        return niveis.length ? Math.min(...niveis) : 1;
    }

    function obterRaridadesDisponiveis(itens) {
        return [...new Set((Array.isArray(itens) ? itens : []).map((item) => String(item.raridadeNome || "").trim()).filter(Boolean))];
    }

    function criarControlesFiltros() {
        return `
            <style id="criadorEnhancementStyles">
                .cp-filter-grid,.cp-quick-grid,.cp-slot-grid,.cp-compare-grid{display:grid;gap:12px}
                .cp-filter-grid{grid-template-columns:repeat(auto-fit,minmax(160px,1fr));margin:14px 0}
                .cp-slot-grid,.cp-compare-grid{grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin-top:14px}
                .cp-quick-grid{grid-template-columns:repeat(auto-fit,minmax(260px,1fr));margin-top:14px}
                .cp-filter-box,.cp-slot-card,.cp-compare-card,.cp-history-item,.cp-quick-card{padding:14px;border-radius:14px;border:1px solid rgba(241,216,166,.14);background:rgba(255,255,255,.035)}
                .cp-filter-box label,.cp-quick-field label{display:block;font-size:.82rem;color:var(--text-muted);margin-bottom:6px}
                .cp-filter-box input,.cp-filter-box select,.cp-quick-field input,.cp-quick-field select,.cp-quick-field textarea{width:100%;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:rgba(7,9,14,.72);color:#f4efe3;padding:10px}
                .cp-filter-check{display:flex;align-items:center;gap:8px;padding-top:24px}
                .cp-slot-card strong,.cp-compare-card strong,.cp-quick-card strong{display:block;margin-bottom:6px}
                .cp-slot-card small,.cp-compare-card small,.cp-quick-card small,.cp-history-item small{display:block;color:var(--text-muted)}
                .cp-slot-empty{opacity:.8;font-style:italic}
                .cp-compare-row{display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06)}
                .cp-compare-row:last-child{border-bottom:none}
                .cp-compare-row.is-better .cp-compare-value{color:#8ae38c;font-weight:700}
                .cp-quick-meta{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 12px}
                .cp-quick-pill{padding:4px 8px;border-radius:999px;background:rgba(255,255,255,.08);font-size:.78rem}
                .cp-quick-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
                .cp-quick-field.full{grid-column:1 / -1}
                .cp-status-warning{color:#ffd68c}
                .cp-history-list{display:grid;gap:10px;margin-top:12px}
            </style>
        `;
    }

    function obterResumoEquipavelItem(item) {
        const partes = [EQUIP_GROUP_LABELS[item.equipGroup] || EQUIP_GROUP_LABELS.nenhum];
        if (item.equipGroup === "mao") {
            partes.push(HAND_MODE_LABELS[item.handMode] || HAND_MODE_LABELS.none);
        }
        return partes.join(" | ");
    }

    function renderAcoesEquiparItem(item) {
        if (item.equipGroup === "nenhum") {
            return `<span class="inventory-flag">Nao equipavel</span>`;
        }
        const botoes = [];
        if (item.equipado) {
            botoes.push(`<button class="action-btn mini-btn secondary" type="button" onclick="guardarItemInventario('${item.id}')">Guardar</button>`);
        }
        if (item.equipGroup === "armadura") {
            botoes.push(`<button class="action-btn mini-btn" type="button" onclick="equiparItemInventario('${item.id}','armadura')">Equipar</button>`);
        } else if (item.equipGroup === "adorno") {
            ADORN_SLOTS.forEach((slot) => {
                botoes.push(`<button class="action-btn mini-btn" type="button" onclick="equiparItemInventario('${item.id}','${slot}')">${SLOT_LABELS[slot]}</button>`);
            });
        } else if (item.equipGroup === "mao") {
            if (item.handMode === "one_hand" || item.handMode === "flex") {
                botoes.push(`<button class="action-btn mini-btn" type="button" onclick="equiparItemInventario('${item.id}','mao_direita')">Mao direita</button>`);
                botoes.push(`<button class="action-btn mini-btn" type="button" onclick="equiparItemInventario('${item.id}','mao_esquerda')">Mao esquerda</button>`);
            }
            if (item.handMode === "two_hands" || item.handMode === "flex") {
                botoes.push(`<button class="action-btn mini-btn" type="button" onclick="equiparItemInventario('${item.id}','two_hands')">2 maos</button>`);
            }
        }
        return botoes.join("");
    }

    function criarCardInventarioAprimorado(item, permitirAcoes) {
        const categoriaVisual = item.categoria === "armadura" ? "armadura" : (item.categoria === "arma" ? "arma" : "item");
        const materialColor = item.materialCorHex || "#d4af37";
        const glow = typeof window.obterGlowRaridade === "function" ? window.obterGlowRaridade(item.raridadeId) : "#d4af37";
        const artPath = typeof window.obterArteInventarioItem === "function" ? window.obterArteInventarioItem(item) : "";
        const iconHtml = artPath
            ? `<img src="${esc(artPath)}" alt="">`
            : (typeof window.obterSvgInventarioCategoria === "function" ? window.obterSvgInventarioCategoria(categoriaVisual) : "");
        const flags = [
            INVENTORY_TYPE_LABELS[item.tipo] || item.categoriaLabel || "Item",
            obterResumoEquipavelItem(item),
            item.raridadeNome,
            item.materialNome,
            item.caBonus > 0 ? `CA +${window.formatarValorFicha ? window.formatarValorFicha(item.caBonus) : item.caBonus}` : "",
            item.bonusMagico ? `Magico +${item.bonusMagico}` : "",
            item.peso ? `Peso ${item.peso}` : "",
            item.equipado ? `Equipado em ${obterDescricaoSlots(item)}` : "Guardado"
        ].filter(Boolean);
        const checkedCompare = state.compare.includes(item.id);

        return `
            <div class="inventory-card ${item.equipado ? "is-equipped" : ""}">
                <div class="inventory-header">
                    <div class="inventory-visual" style="--material-color:${esc(materialColor)}; --rarity-glow:${esc(glow)};">
                        <div class="inventory-item-icon" aria-hidden="true">${iconHtml}</div>
                    </div>
                    <div class="inventory-details">
                        <strong>${esc(item.nome)}</strong>
                        <small>${esc(item.resumo || item.categoriaLabel || "Item de inventario")}</small>
                    </div>
                </div>
                <div class="inventory-flags">${flags.map((flag) => `<span class="inventory-flag">${esc(flag)}</span>`).join("")}</div>
                ${item.descricao ? `<div class="inventory-description">${esc(item.descricao)}</div>` : ""}
                ${item.danoResumo ? `<div class="inventory-description">Dano/efeito: ${esc(item.danoResumo)}</div>` : ""}
                ${permitirAcoes ? `
                    <div class="inventory-actions">
                        ${renderAcoesEquiparItem(item)}
                        <label class="inline-check"><input type="checkbox" ${checkedCompare ? "checked" : ""} onchange="alternarComparacao('${item.id}', this.checked)"><span>Comparar</span></label>
                        <button class="action-btn mini-btn danger" type="button" onclick="removerItemInventario('${item.id}')">Remover</button>
                    </div>
                ` : ""}
            </div>
        `;
    }

    function renderPainelClasseHabilidadesAvancado() {
        const painel = document.getElementById("painelClasseHabilidades");
        if (!painel) return;
        const classe = typeof window.obterClasseAtualDetalhada === "function" ? window.obterClasseAtualDetalhada() : null;
        const nivel = typeof window.obterNivelAtual === "function" ? window.obterNivelAtual() : 1;
        if (!classe) {
            painel.innerHTML = "";
            return;
        }

        const escolhas = typeof window.obterEscolhasHabilidades === "function" ? window.obterEscolhasHabilidades() : [];
        const escolhidasIds = new Set((typeof window.obterHabilidadesSelecionadasDetalhadas === "function" ? window.obterHabilidadesSelecionadasDetalhadas() : []).map((item) => item.id));
        const filtro = state.filters.abilities;
        const subclasseAtual = document.getElementById("subclasseId")?.value;
        const subclasseAtiva = subclasseAtual && subclasseAtual !== "none" && classe.subclasses ? classe.subclasses[subclasseAtual] : null;

        const slotsHtml = ABILITY_SLOT_RULES.map((regra, index) => {
            const lista = window.obterHabilidadesPorTier(classe, regra.tier);
            if (nivel < regra.minLevel) {
                return `<div class="selection-card"><strong>${regra.label}</strong><small>Liberada no nivel ${regra.minLevel}. ${regra.limitText}</small></div>`;
            }
            return `<div class="selection-card ${escolhas[index] ? "is-selected" : ""}"><strong>${regra.label}</strong><small>${regra.limitText}</small><select onchange="selecionarHabilidade('${regra.key}', this.value)"><option value="">Nao escolher agora</option>${lista.map((item) => `<option value="${item.id}" ${item.id === escolhas[index] ? "selected" : ""}>${item.nome}</option>`).join("")}</select></div>`;
        }).join("");

        const listaHabilidades = Object.keys(TIER_TITLES).flatMap((tier) => window.obterHabilidadesPorTier(classe, tier).map((item) => ({
            ...item,
            tier,
            tierLabel: TIER_TITLES[tier],
            minLevel: obterNivelMinimoPorTier(tier),
            selecionada: escolhidasIds.has(item.id)
        }))).filter((item) => {
            const busca = normalizarTexto(`${item.nome} ${item.descricao} ${item.efeito} ${item.custo}`);
            if (filtro.search && !busca.includes(normalizarTexto(filtro.search))) return false;
            if (filtro.tier !== "todos" && item.tier !== filtro.tier) return false;
            if (filtro.unlockedOnly && nivel < item.minLevel) return false;
            if (filtro.selectedOnly && !item.selecionada) return false;
            return true;
        });

        painel.innerHTML = `${criarControlesFiltros()}<h4 class="codex-title">Resumo da classe</h4><p class="codex-note">Escolha as habilidades liberadas pelo nivel e use os filtros para localizar o que interessa mais rapido.</p><div class="meta-grid"><div class="meta-card"><strong>${esc(classe.nome)}</strong><small>HP base ${classe.hp} | MP base ${classe.mp} | SP base ${classe.sp}</small></div><div class="meta-card"><strong>Passivas da classe</strong><small>${esc((classe.passivas || []).join(" | ") || "Sem passivas detalhadas.")}</small></div><div class="meta-card"><strong>Escolhas liberadas</strong><small>${esc(ABILITY_SLOT_RULES.filter((item) => nivel >= item.minLevel).map((item) => item.label).join(" | ") || "Nenhuma escolha liberada.")}</small></div><div class="meta-card"><strong>Subclasse</strong><small>${esc(subclasseAtiva ? subclasseAtiva.nome : (nivel >= 15 ? "Nenhuma escolhida ainda." : "Disponivel no nivel 15."))}</small></div></div><div class="selection-grid">${slotsHtml}</div><div class="cp-filter-grid"><div class="cp-filter-box"><label>Buscar habilidade</label><input type="text" value="${esc(filtro.search)}" oninput="setFiltro('abilities','search',this.value)" placeholder="Nome, custo ou efeito"></div><div class="cp-filter-box"><label>Tier</label><select onchange="setFiltro('abilities','tier',this.value)"><option value="todos" ${filtro.tier === "todos" ? "selected" : ""}>Todos</option>${Object.entries(TIER_TITLES).map(([key, label]) => `<option value="${key}" ${filtro.tier === key ? "selected" : ""}>${label}</option>`).join("")}</select></div><label class="cp-filter-box cp-filter-check"><input type="checkbox" ${filtro.unlockedOnly ? "checked" : ""} onchange="setFiltro('abilities','unlockedOnly',this.checked)"><span>Mostrar so liberadas no nivel atual</span></label><label class="cp-filter-box cp-filter-check"><input type="checkbox" ${filtro.selectedOnly ? "checked" : ""} onchange="setFiltro('abilities','selectedOnly',this.checked)"><span>Mostrar so escolhidas</span></label></div><div class="ability-grid">${listaHabilidades.length ? listaHabilidades.map((item) => `<div class="ability-card ${item.selecionada ? "is-selected" : ""}"><strong>${esc(item.nome)}</strong><small>${esc(item.tierLabel)} | Nivel ${item.minLevel} | ${esc(item.custo || "Sem custo")}</small><div class="inventory-description">${esc(item.descricao || "")}</div>${item.efeito ? `<div class="inventory-description">Efeito: ${esc(item.efeito)}</div>` : ""}</div>`).join("") : '<p class="codex-note">Nenhuma habilidade encontrada com esse filtro.</p>'}</div>`;
    }

    function renderPainelPassivasAvancado() {
        const painel = document.getElementById("painelPassivasGlobais");
        if (!painel) return;
        const periciasDaClasse = typeof window.detectarPericiasDaClasse === "function" ? window.detectarPericiasDaClasse(window.obterClasseAtualDetalhada()) : [];
        const periciasDisponiveis = typeof window.obterPericiasDisponiveis === "function" ? window.obterPericiasDisponiveis() : [];
        const periciasExtras = new Set(typeof window.obterPericiasExtras === "function" ? window.obterPericiasExtras() : []);
        const selecionadas = new Set(typeof window.sanitizarPassivasSelecionadas === "function" ? window.sanitizarPassivasSelecionadas() : []);
        const filtro = state.filters.passives;

        const extrasHtml = EXTRA_SKILL_OPTIONS.map((nome) => {
            const automatico = periciasDaClasse.includes(nome);
            const marcado = automatico || periciasExtras.has(nome);
            return `<label class="toggle-card ${automatico ? "is-locked" : ""}"><input type="checkbox" ${marcado ? "checked" : ""} ${automatico ? "disabled" : ""} onchange="alternarPericiaExtra('${nome}', this.checked)"><span><strong>${esc(nome)}</strong><small>${automatico ? "Concedida automaticamente pela classe atual." : "Marque se a ficha possui essa pericia fora da classe."}</small></span></label>`;
        }).join("");

        const listaPassivas = PASSIVE_ABILITIES.filter((item) => {
            const desbloqueada = typeof window.passivaDesbloqueada === "function" ? window.passivaDesbloqueada(item, periciasDisponiveis) : true;
            const marcada = selecionadas.has(item.id);
            const busca = normalizarTexto(`${item.nome} ${item.resumo} ${item.bonus} ${item.requisito || ""}`);
            if (filtro.search && !busca.includes(normalizarTexto(filtro.search))) return false;
            if (filtro.selected === "selecionadas" && !marcada) return false;
            if (filtro.requirement === "com" && !item.requisito) return false;
            if (filtro.requirement === "sem" && item.requisito) return false;
            if (filtro.availability === "liberadas" && !desbloqueada) return false;
            if (filtro.availability === "bloqueadas" && desbloqueada) return false;
            return true;
        });

        painel.innerHTML = `${criarControlesFiltros()}<h4 class="codex-title">Passivas</h4><p class="codex-note">As passivas com requisito so liberam quando a ficha tem a pericia correspondente.</p><div class="tag-list">${[...periciasDisponiveis].map((nome) => `<span class="tag-pill">${esc(nome)}</span>`).join("") || '<span class="tag-pill">Nenhuma pericia detectada</span>'}</div><div class="toggle-grid">${extrasHtml}</div><div class="cp-filter-grid"><div class="cp-filter-box"><label>Buscar passiva</label><input type="text" value="${esc(filtro.search)}" oninput="setFiltro('passives','search',this.value)" placeholder="Nome, bonus ou requisito"></div><div class="cp-filter-box"><label>Selecao</label><select onchange="setFiltro('passives','selected',this.value)"><option value="todas" ${filtro.selected === "todas" ? "selected" : ""}>Todas</option><option value="selecionadas" ${filtro.selected === "selecionadas" ? "selected" : ""}>So selecionadas</option></select></div><div class="cp-filter-box"><label>Requisito</label><select onchange="setFiltro('passives','requirement',this.value)"><option value="todas" ${filtro.requirement === "todas" ? "selected" : ""}>Todas</option><option value="com" ${filtro.requirement === "com" ? "selected" : ""}>Com requisito</option><option value="sem" ${filtro.requirement === "sem" ? "selected" : ""}>Sem requisito</option></select></div><div class="cp-filter-box"><label>Disponibilidade</label><select onchange="setFiltro('passives','availability',this.value)"><option value="todas" ${filtro.availability === "todas" ? "selected" : ""}>Todas</option><option value="liberadas" ${filtro.availability === "liberadas" ? "selected" : ""}>Liberadas</option><option value="bloqueadas" ${filtro.availability === "bloqueadas" ? "selected" : ""}>Bloqueadas</option></select></div></div><div class="toggle-grid">${listaPassivas.length ? listaPassivas.map((item) => { const desbloqueada = typeof window.passivaDesbloqueada === "function" ? window.passivaDesbloqueada(item, periciasDisponiveis) : true; const marcada = selecionadas.has(item.id); return `<label class="toggle-card ${desbloqueada ? "" : "is-locked"} ${marcada ? "is-selected" : ""}"><input type="checkbox" ${marcada ? "checked" : ""} ${desbloqueada ? "" : "disabled"} onchange="alternarPassiva('${item.id}', this.checked)"><span><strong>${esc(item.nome)}</strong><small>${esc(item.resumo)} Bonus: ${esc(item.bonus)}${item.requisito ? ` Requisito: ${esc(item.requisito)}.` : ""}</small></span></label>`; }).join("") : '<p class="codex-note">Nenhuma passiva encontrada com esse filtro.</p>'}</div>`;
    }

    function renderPainelComparacaoHtml(itens) {
        const selecionados = (Array.isArray(itens) ? itens : []).filter((item) => state.compare.includes(item.id)).slice(0, 2);
        if (!selecionados.length) {
            return '<p class="codex-note" style="margin-top:14px;">Marque ate 2 itens para comparar lado a lado.</p>';
        }
        const campos = [
            { key: "equipLabel", label: "Tipo", numeric: false },
            { key: "danoResumo", label: "Dano/efeito", numeric: false },
            { key: "caBonus", label: "CA", numeric: true },
            { key: "bonusMagico", label: "Bonus magico", numeric: true },
            { key: "pesoNumero", label: "Peso", numeric: true },
            { key: "materialNome", label: "Material", numeric: false },
            { key: "raridadeNome", label: "Raridade", numeric: false },
            { key: "statusEquipado", label: "Status", numeric: false }
        ];
        const maior = {};
        campos.forEach((campo) => {
            if (!campo.numeric) return;
            maior[campo.key] = Math.max(...selecionados.map((item) => Number(item[campo.key]) || 0));
        });
        return `<div class="cp-compare-grid">${selecionados.map((item) => `<div class="cp-compare-card"><strong>${esc(item.nome)}</strong><small>${esc(INVENTORY_TYPE_LABELS[item.tipo] || item.categoriaLabel || "Item")}</small>${campos.map((campo) => { const valor = campo.key === "statusEquipado" ? obterResumoStatusItem(item) : (campo.key === "equipLabel" ? obterResumoEquipavelItem(item) : (campo.numeric ? String(Number(item[campo.key]) || 0) : (item[campo.key] || "-"))); const destaque = campo.numeric && (Number(item[campo.key]) || 0) === maior[campo.key] && maior[campo.key] > 0; return `<div class="cp-compare-row ${destaque ? "is-better" : ""}"><span>${campo.label}</span><span class="cp-compare-value">${esc(valor)}</span></div>`; }).join("")}</div>`).join("")}</div>`;
    }

    function renderListaInventarioHtml(itens, vazio) {
        return itens.length
            ? `<div class="inventory-list">${itens.map((item) => criarCardInventarioAprimorado(item, true)).join("")}</div>`
            : `<p class="codex-note">${esc(vazio)}</p>`;
    }

    function renderPainelInventarioAvancado() {
        const painel = document.getElementById("painelInventario");
        if (!painel) return;
        const itens = typeof window.obterInventarioItens === "function" ? window.obterInventarioItens() : [];
        const bonusCa = typeof window.obterBonusCaInventario === "function" ? window.obterBonusCaInventario() : 0;
        const filtro = state.filters.inventory;
        const raridades = obterRaridadesDisponiveis(itens);
        const filtrados = itens.filter((item) => {
            const busca = normalizarTexto(`${item.nome} ${item.descricao} ${item.resumo} ${item.materialNome} ${item.raridadeNome}`);
            if (filtro.search && !busca.includes(normalizarTexto(filtro.search))) return false;
            if (filtro.type !== "todos") {
                if (filtro.type === "nao_equipavel" && item.equipGroup !== "nenhum") return false;
                if (["armadura", "mao", "adorno"].includes(filtro.type) && item.equipGroup !== filtro.type) return false;
                if (!["armadura", "mao", "adorno", "nao_equipavel"].includes(filtro.type) && item.tipo !== filtro.type) return false;
            }
            if (filtro.rarity !== "todas" && item.raridadeNome !== filtro.rarity) return false;
            if (filtro.status !== "todos" && (item.equipado ? "equipado" : "guardado") !== filtro.status) return false;
            return true;
        });
        const equipados = EQUIPMENT_SLOT_ORDER.map((slot) => ({
            slot,
            item: itens.find((item) => Array.isArray(item.equippedSlots) && item.equippedSlots.includes(slot)) || null
        }));
        const equipadosFiltrados = filtrados.filter((item) => item.equipado);
        const guardadosFiltrados = filtrados.filter((item) => !item.equipado);

        painel.innerHTML = `${criarControlesFiltros()}<h4 class="codex-title">Itens do inventario</h4><p class="codex-note">A defesa soma a CA de qualquer item equipado. Use os slots abaixo para ver o que esta em uso.</p><div class="tag-list"><span class="tag-pill">Itens: ${itens.length}</span><span class="tag-pill">CA dos itens equipados: +${window.formatarValorFicha ? window.formatarValorFicha(bonusCa) : bonusCa}</span><span class="tag-pill">Comparando: ${state.compare.length}/2</span></div><div class="cp-slot-grid">${equipados.map(({ slot, item }) => `<div class="cp-slot-card"><strong>${SLOT_LABELS[slot]}</strong><small>${item ? esc(item.nome) : '<span class="cp-slot-empty">Nenhum item equipado</span>'}</small>${item ? `<small>${esc(item.raridadeNome || "Sem raridade")} | ${esc(item.materialNome || "Sem material")}</small>` : ""}</div>`).join("")}</div><div class="cp-filter-grid"><div class="cp-filter-box"><label>Buscar item</label><input type="text" value="${esc(filtro.search)}" oninput="setFiltro('inventory','search',this.value)" placeholder="Nome, material ou descricao"></div><div class="cp-filter-box"><label>Grupo</label><select onchange="setFiltro('inventory','type',this.value)"><option value="todos" ${filtro.type === "todos" ? "selected" : ""}>Todos</option><option value="armadura" ${filtro.type === "armadura" ? "selected" : ""}>Armadura</option><option value="mao" ${filtro.type === "mao" ? "selected" : ""}>Mao</option><option value="adorno" ${filtro.type === "adorno" ? "selected" : ""}>Adorno</option><option value="item" ${filtro.type === "item" ? "selected" : ""}>Item geral</option><option value="consumivel" ${filtro.type === "consumivel" ? "selected" : ""}>Consumivel</option><option value="nao_equipavel" ${filtro.type === "nao_equipavel" ? "selected" : ""}>Nao equipavel</option></select></div><div class="cp-filter-box"><label>Raridade</label><select onchange="setFiltro('inventory','rarity',this.value)"><option value="todas" ${filtro.rarity === "todas" ? "selected" : ""}>Todas</option>${raridades.map((nome) => `<option value="${esc(nome)}" ${filtro.rarity === nome ? "selected" : ""}>${esc(nome)}</option>`).join("")}</select></div><div class="cp-filter-box"><label>Status</label><select onchange="setFiltro('inventory','status',this.value)"><option value="todos" ${filtro.status === "todos" ? "selected" : ""}>Todos</option><option value="equipado" ${filtro.status === "equipado" ? "selected" : ""}>Equipado</option><option value="guardado" ${filtro.status === "guardado" ? "selected" : ""}>Guardado</option></select></div></div>${renderPainelComparacaoHtml(itens)}<div style="margin-top:14px;"><h4 class="codex-title">Equipado</h4>${renderListaInventarioHtml(equipadosFiltrados, "Nenhum item equipado com esse filtro.")}</div><div style="margin-top:14px;"><h4 class="codex-title">Inventario guardado</h4>${renderListaInventarioHtml(guardadosFiltrados, "Nenhum item guardado com esse filtro.")}</div>`;
    }

    function renderAcoesRapidasResultado() {
        const resultado = document.getElementById("resultado");
        if (!resultado) return;
        const grid = resultado.querySelector(".resource-grid");
        if (!grid) return;
        const habilidades = obterHabilidadesRapidasDisponiveis();
        const anchorPanel = [...grid.querySelectorAll(".resource-panel")].find((panel) => normalizarTexto(panel.querySelector("h4")?.textContent).includes("habilidades personalizadas"));
        if (!anchorPanel) return;
        grid.querySelectorAll(".resource-panel.cp-enhanced-panel").forEach((panel) => panel.remove());

        const painelAcoes = document.createElement("div");
        painelAcoes.className = "resource-panel cp-enhanced-panel";
        painelAcoes.innerHTML = `<h4 style="color:var(--primary); margin:0 0 14px 0; border-bottom:1px solid #444; padding-bottom:5px;">Acoes rapidas</h4>${habilidades.length ? `<div class="cp-quick-grid">${habilidades.map((item) => { const config = obterConfigQuickAction(item.key); const pronta = habilidadeConfigurada(config); return `<div class="cp-quick-card"><strong>${esc(item.nome)}</strong><small>${esc(item.subtitulo)}</small><div class="cp-quick-meta"><span class="cp-quick-pill">${esc(item.origem)}</span><span class="cp-quick-pill ${pronta ? "" : "cp-status-warning"}">${pronta ? "Configurada" : "Precisa configurar"}</span></div><div class="cp-quick-fields"><div class="cp-quick-field"><label>HP</label><input type="number" min="0" value="${config.hpCost}" onchange="atualizarConfigQuickAction('${item.key}','hpCost',this.value)"></div><div class="cp-quick-field"><label>MP</label><input type="number" min="0" value="${config.mpCost}" onchange="atualizarConfigQuickAction('${item.key}','mpCost',this.value)"></div><div class="cp-quick-field"><label>SP</label><input type="number" min="0" value="${config.spCost}" onchange="atualizarConfigQuickAction('${item.key}','spCost',this.value)"></div><div class="cp-quick-field"><label>Tipo</label><select onchange="atualizarConfigQuickAction('${item.key}','actionType',this.value)">${QUICK_ACTION_TYPES.map((opt) => `<option value="${opt.value}" ${config.actionType === opt.value ? "selected" : ""}>${opt.label}</option>`).join("")}</select></div><div class="cp-quick-field full"><label>Formula</label><input type="text" value="${esc(config.formula)}" placeholder="Ex.: 2d6+4" onchange="atualizarConfigQuickAction('${item.key}','formula',this.value)"></div><div class="cp-quick-field full"><label>Efeito curto</label><textarea rows="2" placeholder="Ex.: empurra 2 metros" onchange="atualizarConfigQuickAction('${item.key}','effectText',this.value)">${esc(config.effectText)}</textarea></div></div><div class="panel-actions" style="margin-top:12px;"><button class="action-btn mini-btn" type="button" onclick="usarHabilidadeRapida('${item.key}')">Usar</button></div></div>`; }).join("")}</div>` : '<p class="codex-note">Nenhuma habilidade disponivel para acao rapida.</p>'}`;

        const painelHistorico = document.createElement("div");
        painelHistorico.className = "resource-panel cp-enhanced-panel";
        painelHistorico.innerHTML = `<h4 style="color:var(--primary); margin:0 0 14px 0; border-bottom:1px solid #444; padding-bottom:5px;">Historico de acoes</h4><div class="panel-actions"><button class="action-btn mini-btn secondary" type="button" onclick="limparHistoricoCombate()">Limpar historico</button></div>${state.combatActionHistory.length ? `<div class="cp-history-list">${[...state.combatActionHistory].reverse().map((item) => `<div class="cp-history-item"><strong>${esc(item.label)}</strong><small>${esc(item.source)} | ${esc(item.actionType)}${item.formula ? ` | ${esc(item.formula)}` : ""}${item.result ? ` | Resultado ${esc(item.result)}` : ""}</small>${item.effectText ? `<div class="inventory-description">${esc(item.effectText)}</div>` : ""}<small>Custos: HP ${item.hpCost} | MP ${item.mpCost} | SP ${item.spCost}</small></div>`).join("")}</div>` : '<p class="codex-note">Nenhuma acao usada ainda.</p>'}`;

        anchorPanel.insertAdjacentElement("afterend", painelHistorico);
        anchorPanel.insertAdjacentElement("afterend", painelAcoes);
    }

    function renderInventarioResultado() {
        const resultado = document.getElementById("resultado");
        if (!resultado) return;
        const panel = [...resultado.querySelectorAll(".resource-panel")].find((item) => normalizarTexto(item.querySelector("h4")?.textContent) === "inventario");
        if (!panel) return;
        const itens = typeof window.obterInventarioItens === "function" ? window.obterInventarioItens() : [];
        const equipados = EQUIPMENT_SLOT_ORDER.map((slot) => ({ slot, item: itens.find((item) => Array.isArray(item.equippedSlots) && item.equippedSlots.includes(slot)) || null }));
        const itensEquipados = itens.filter((item) => item.equipado);
        const itensGuardados = itens.filter((item) => !item.equipado);
        panel.innerHTML = `<h4 style="color:var(--primary); margin:0 0 14px 0; border-bottom:1px solid #444; padding-bottom:5px;">Inventario</h4><textarea id="inventarioTextoCard" class="notes-area" placeholder="Descreva o inventario dessa ficha..." oninput="sincronizarInventarioTexto(this.value, 'card')">${esc(document.getElementById("inventarioTexto")?.value || "")}</textarea><div class="notes-help">Os itens equipados ficam separados por slot e o restante continua guardado logo abaixo.</div><div class="cp-slot-grid">${equipados.map(({ slot, item }) => `<div class="cp-slot-card"><strong>${SLOT_LABELS[slot]}</strong><small>${item ? esc(item.nome) : '<span class="cp-slot-empty">Nenhum item equipado</span>'}</small></div>`).join("")}</div>${renderPainelComparacaoHtml(itens)}<div style="margin-top:14px;"><h4 class="codex-title">Equipado</h4>${renderListaInventarioHtml(itensEquipados, "Nenhum item equipado ainda.")}</div><div style="margin-top:14px;"><h4 class="codex-title">Inventario guardado</h4>${renderListaInventarioHtml(itensGuardados, "Nenhum item guardado ainda.")}</div>`;
    }

    function limparHistoricoCombate() {
        state.combatActionHistory = [];
        debounceAutosave();
        if (typeof window.calcularFicha === "function") window.calcularFicha(true);
    }

    function resolverSlotsDesejados(meta, modo, itensAtuais, alvoId) {
        const ocupados = new Set();
        (Array.isArray(itensAtuais) ? itensAtuais : []).forEach((item) => {
            if (!item || item.id === alvoId || !Array.isArray(item.equippedSlots)) return;
            item.equippedSlots.forEach((slot) => ocupados.add(slot));
        });
        if (meta.equipGroup === "armadura") {
            return ["armadura"];
        }
        if (meta.equipGroup === "adorno") {
            if (ADORN_SLOTS.includes(modo)) return [modo];
            const livre = ADORN_SLOTS.find((slot) => !ocupados.has(slot));
            return livre ? [livre] : [];
        }
        if (meta.equipGroup === "mao") {
            if (meta.handMode === "two_hands" || modo === "two_hands") {
                return HAND_SLOTS.slice();
            }
            if (HAND_SLOTS.includes(modo)) return [modo];
            const livre = HAND_SLOTS.find((slot) => !ocupados.has(slot));
            return [livre || "mao_direita"];
        }
        return [];
    }

    function guardarItemInventario(id) {
        const atuais = typeof window.obterInventarioItens === "function" ? window.obterInventarioItens() : [];
        const itens = atuais.map((item) => item.id === id ? { ...item, equippedSlots: [], equipado: false } : item);
        window.salvarInventarioItens(itens);
        window.renderPainelInventario();
        if (document.getElementById("resultado")?.innerHTML.trim()) window.calcularFicha(true);
        debounceAutosave();
    }

    function equiparItemInventario(id, modo) {
        const atuais = typeof window.obterInventarioItens === "function" ? window.obterInventarioItens() : [];
        const alvo = atuais.find((item) => item.id === id);
        if (!alvo) return;
        const meta = inferirEquipMeta(alvo);
        if (meta.equipGroup === "nenhum") {
            alert("Esse item nao pode ser equipado.");
            return;
        }
        const desiredSlots = resolverSlotsDesejados(meta, modo, atuais, id);
        if (!desiredSlots.length) {
            alert("Nao foi possivel equipar esse item nesse slot.");
            return;
        }
        const itens = atuais.map((item) => {
            if (item.id === id) {
                return { ...item, equipGroup: meta.equipGroup, handMode: meta.handMode, equippedSlots: desiredSlots, equipado: true };
            }
            const atuaisSlots = Array.isArray(item.equippedSlots) ? item.equippedSlots : [];
            const conflita = atuaisSlots.some((slot) => desiredSlots.includes(slot));
            return conflita ? { ...item, equippedSlots: [], equipado: false } : item;
        });
        window.salvarInventarioItens(itens);
        window.renderPainelInventario();
        if (document.getElementById("resultado")?.innerHTML.trim()) window.calcularFicha(true);
        debounceAutosave();
    }

    function atualizarCamposEquipamentoManual() {
        const groupEl = document.getElementById("inventarioManualEquipGroup");
        const handWrap = document.getElementById("inventarioManualHandModeWrap");
        const handEl = document.getElementById("inventarioManualHandMode");
        if (!groupEl || !handWrap || !handEl) return;
        const mostrarMao = groupEl.value === "mao" || groupEl.value === "auto";
        handWrap.style.display = mostrarMao ? "" : "none";
        if (!mostrarMao) {
            handEl.value = "auto";
        }
    }

    function garantirCampoSlotManual() {
        if (document.getElementById("inventarioManualEquipGroup")) return;
        const tipoGrupo = document.getElementById("inventarioManualTipo")?.closest(".resource-input");
        if (!tipoGrupo || !tipoGrupo.parentElement) return;
        const groupDiv = document.createElement("div");
        groupDiv.className = "resource-input";
        groupDiv.innerHTML = `<label for="inventarioManualEquipGroup">Grupo equipavel</label><select id="inventarioManualEquipGroup" onchange="atualizarCamposEquipamentoManual()"><option value="auto">Detectar automaticamente</option><option value="armadura">Armadura</option><option value="mao">Mao</option><option value="adorno">Adorno</option><option value="nenhum">Nao equipavel</option></select>`;
        const handDiv = document.createElement("div");
        handDiv.className = "resource-input";
        handDiv.id = "inventarioManualHandModeWrap";
        handDiv.innerHTML = `<label for="inventarioManualHandMode">Uso nas maos</label><select id="inventarioManualHandMode"><option value="auto">Detectar automaticamente</option><option value="one_hand">1 mao</option><option value="two_hands">2 maos</option><option value="flex">1 ou 2 maos</option></select>`;
        tipoGrupo.parentElement.insertBefore(groupDiv, tipoGrupo.nextSibling);
        tipoGrupo.parentElement.insertBefore(handDiv, groupDiv.nextSibling);
        atualizarCamposEquipamentoManual();
    }

    function inserirBotaoLimparRascunho() {
        if (document.getElementById("btnLimparRascunhoFicha")) return;
        const container = document.querySelector("#sec-acoes .utility-actions");
        if (!container) return;
        const button = document.createElement("button");
        button.id = "btnLimparRascunhoFicha";
        button.className = "action-btn utility-btn secondary";
        button.type = "button";
        button.textContent = "Limpar rascunho local";
        button.addEventListener("click", limparRascunhoLocalFicha);
        container.appendChild(button);
    }

    function envolverFuncoesBase() {
        original.sanitizarInventarioItens = window.sanitizarInventarioItens;
        original.obterDadosFichaBase = window.obterDadosFichaBase;
        original.coletarDadosFicha = window.coletarDadosFicha;
        original.aplicarDadosFicha = window.aplicarDadosFicha;
        original.calcularFicha = window.calcularFicha;
        original.removerItemInventario = window.removerItemInventario;
        original.removerHabilidadePersonalizada = window.removerHabilidadePersonalizada;

        window.sanitizarInventarioItens = function (lista) {
            const brutos = Array.isArray(lista) ? lista : [];
            const base = original.sanitizarInventarioItens ? original.sanitizarInventarioItens(brutos) : [];
            const enriquecidos = base.map((item, index) => {
                const bruto = brutos[index] && typeof brutos[index] === "object" ? brutos[index] : {};
                const meta = inferirEquipMeta({ ...item, ...bruto });
                return {
                    ...item,
                    slotTipo: normalizarTexto(bruto.slotTipo || item.slotTipo || ""),
                    equipGroup: meta.equipGroup,
                    handMode: meta.handMode,
                    equippedSlots: Array.isArray(bruto.equippedSlots) ? bruto.equippedSlots.slice(0, 2) : (Array.isArray(item.equippedSlots) ? item.equippedSlots.slice(0, 2) : []),
                    bonusFisico: arredondar(bruto.bonusFisico),
                    bonusMagico: arredondar(bruto.bonusMagico),
                    pesoNumero: arredondar(bruto.pesoNumero || parsePesoNumero(item.peso)),
                    caBonus: Math.max(0, normalizarInteiro(bruto.caBonus ?? item.caBonus, 0))
                };
            });
            return garantirIntegridadeSlots(enriquecidos);
        };

        window.obterBonusCaInventario = function () {
            return (typeof window.obterInventarioItens === "function" ? window.obterInventarioItens() : []).reduce((acc, item) => acc + (item.equipado ? (Number(item.caBonus) || 0) : 0), 0);
        };

        window.obterDadosFichaBase = function () {
            const ficha = original.obterDadosFichaBase ? original.obterDadosFichaBase() : null;
            if (!ficha) return ficha;
            const caBaseManual = Math.max(0, normalizarInteiro(ficha.caBase, 2));
            const caAtributos = Math.floor((Number(ficha.aFim) || 0) / 10) + Math.floor((Number(ficha.rFim) || 0) / 10);
            const caNivel = Math.floor((Number(ficha.nivel) || 0) / 5);
            const caEquipamentos = window.obterBonusCaInventario();
            ficha.caBase = caBaseManual;
            ficha.caBaseManual = caBaseManual;
            ficha.caAtributos = caAtributos;
            ficha.caNivel = caNivel;
            ficha.caEquipamentos = caEquipamentos;
            ficha.caInventario = caEquipamentos;
            ficha.caTotal = caBaseManual + caAtributos + caNivel + caEquipamentos;
            return ficha;
        };

        window.alternarEquipadoInventario = function (id, ativo) {
            if (!ativo) {
                guardarItemInventario(id);
                return;
            }
            const atuais = typeof window.obterInventarioItens === "function" ? window.obterInventarioItens() : [];
            const alvo = atuais.find((item) => item.id === id);
            if (!alvo) return;
            const meta = inferirEquipMeta(alvo);
            if (meta.equipGroup === "armadura") {
                equiparItemInventario(id, "armadura");
                return;
            }
            if (meta.equipGroup === "adorno") {
                equiparItemInventario(id, "auto");
                return;
            }
            if (meta.equipGroup === "mao") {
                equiparItemInventario(id, meta.handMode === "two_hands" ? "two_hands" : "mao_direita");
            }
        };

        window.adicionarItemManualInventario = function () {
            const nomeEl = document.getElementById("inventarioManualNome");
            const tipoEl = document.getElementById("inventarioManualTipo");
            const groupEl = document.getElementById("inventarioManualEquipGroup");
            const handModeEl = document.getElementById("inventarioManualHandMode");
            const caEl = document.getElementById("inventarioManualCa");
            const descricaoEl = document.getElementById("inventarioManualDescricao");
            const nome = String(nomeEl && nomeEl.value || "").trim();
            const descricao = String(descricaoEl && descricaoEl.value || "").trim();
            const tipo = INVENTORY_TYPE_LABELS[tipoEl?.value] ? tipoEl.value : "item";
            const categoria = tipo === "armadura" ? "armadura" : ((tipo === "equipamento") ? "arma" : "item");
            const caBonus = normalizarInteiro(caEl && caEl.value, 0);
            if (!nome && !descricao) {
                alert("Preencha pelo menos o nome ou a descricao do item manual.");
                return;
            }
            const metaInferida = inferirEquipMeta({ tipo, categoria });
            const equipGroup = groupEl && groupEl.value !== "auto" ? normalizarEquipGroup(groupEl.value) : metaInferida.equipGroup;
            const handMode = equipGroup === "mao"
                ? (handModeEl && handModeEl.value !== "auto" ? normalizarHandMode(handModeEl.value) : (metaInferida.handMode === "none" ? "flex" : metaInferida.handMode))
                : "none";
            const itens = typeof window.obterInventarioItens === "function" ? window.obterInventarioItens() : [];
            itens.push({
                id: typeof window.criarIdLocal === "function" ? window.criarIdLocal("item") : `item_${Date.now()}`,
                origem: "manual",
                nome: nome || "Item sem nome",
                tipo,
                categoria,
                categoriaLabel: INVENTORY_TYPE_LABELS[tipo],
                descricao,
                resumo: "Item manual da ficha.",
                caBonus: Math.max(0, caBonus),
                equipado: false,
                slotTipo: equipGroup === "armadura" ? "armadura" : (equipGroup === "mao" ? "mao" : (equipGroup === "adorno" ? "adorno" : "nenhum")),
                equipGroup,
                handMode,
                equippedSlots: [],
                materialNome: "",
                materialCorHex: "",
                materialCor: "",
                materialIds: [],
                materialReferenciaId: "",
                raridadeId: "",
                raridadeNome: "",
                peso: "",
                pesoNumero: 0,
                danoResumo: "",
                bonusFisico: 0,
                bonusMagico: 0,
                fonte: "Manual",
                artPath: "",
                forgeTipo: ""
            });
            window.salvarInventarioItens(itens);
            if (nomeEl) nomeEl.value = "";
            if (descricaoEl) descricaoEl.value = "";
            if (caEl) caEl.value = "0";
            if (tipoEl) tipoEl.value = "item";
            if (groupEl) groupEl.value = "auto";
            if (handModeEl) handModeEl.value = "auto";
            atualizarCamposEquipamentoManual();
            window.renderPainelInventario();
            if (document.getElementById("resultado")?.innerHTML.trim()) window.calcularFicha(true);
            debounceAutosave();
        };

        window.importarItensDaCalculadora = function () {
            const compartilhados = typeof window.sanitizarInventarioItens === "function" ? window.sanitizarInventarioItens(typeof window.lerItensForjadosCompartilhados === "function" ? window.lerItensForjadosCompartilhados() : []) : [];
            if (!compartilhados.length) {
                if (typeof window.atualizarStatusSave === "function") window.atualizarStatusSave("Nenhum item forjado foi encontrado na calculadora ainda.", true);
                return;
            }
            const atuais = typeof window.obterInventarioItens === "function" ? window.obterInventarioItens() : [];
            const idsAtuais = new Set(atuais.map((item) => item.id));
            const novos = compartilhados.filter((item) => !idsAtuais.has(item.id)).map((item) => {
                const meta = inferirEquipMeta(item);
                const equippedSlots = resolverSlotsDesejados(meta, "auto", [...atuais, ...compartilhados], item.id);
                return {
                    ...item,
                    equipGroup: meta.equipGroup,
                    handMode: meta.handMode,
                    equippedSlots,
                    equipado: equippedSlots.length > 0
                };
            });
            if (!novos.length) {
                if (typeof window.atualizarStatusSave === "function") window.atualizarStatusSave("Todos os itens forjados ja foram importados para o inventario.");
                return;
            }
            window.salvarInventarioItens([...atuais, ...novos]);
            window.renderPainelInventario();
            if (document.getElementById("resultado")?.innerHTML.trim()) window.calcularFicha(true);
            if (typeof window.atualizarStatusSave === "function") window.atualizarStatusSave(`${novos.length} item(ns) importado(s) da calculadora para o inventario.`);
            debounceAutosave();
        };

        window.removerItemInventario = function (id) {
            state.compare = state.compare.filter((itemId) => itemId !== id);
            if (original.removerItemInventario) {
                original.removerItemInventario(id);
            }
            debounceAutosave();
        };

        window.removerHabilidadePersonalizada = function (id) {
            delete state.skillQuickActions[`custom:${id}`];
            if (original.removerHabilidadePersonalizada) {
                original.removerHabilidadePersonalizada(id);
            }
            debounceAutosave();
        };

        window.coletarDadosFicha = function () {
            const payload = original.coletarDadosFicha ? original.coletarDadosFicha() : { version: 1, exportedAt: new Date().toISOString(), dados: {} };
            payload.dados.autosaveDraftVersion = 4;
            payload.dados.skillQuickActions = clone(state.skillQuickActions);
            payload.dados.combatActionHistory = clone(state.combatActionHistory);
            payload.dados.equipmentSlots = clone(state.equipmentSlots);
            payload.dados.compare = Array.isArray(state.compare) ? state.compare.slice(0, 2) : [];
            payload.dados.filters = clone(state.filters);
            return payload;
        };

        window.aplicarDadosFicha = function (dados) {
            if (original.aplicarDadosFicha) original.aplicarDadosFicha(dados);
            aplicarEstadoExtra(dados);
            atualizarCamposEquipamentoManual();
            if (typeof window.renderPainelsDeClasse === "function") window.renderPainelsDeClasse();
            if (document.getElementById("resultado")?.innerHTML.trim() && typeof window.calcularFicha === "function") {
                window.calcularFicha(true);
            }
            debounceAutosave();
        };

        window.renderPainelClasseHabilidades = renderPainelClasseHabilidadesAvancado;
        window.renderPainelPassivas = renderPainelPassivasAvancado;
        window.renderPainelInventario = renderPainelInventarioAvancado;

        window.calcularFicha = function (silencioso) {
            const retorno = original.calcularFicha ? original.calcularFicha(silencioso) : undefined;
            renderAcoesRapidasResultado();
            renderInventarioResultado();
            debounceAutosave();
            return retorno;
        };
    }

    function anexarListenersAutosave() {
        document.addEventListener("input", (event) => {
            if (event.target && event.target.closest("#resultado")) return;
            debounceAutosave();
        });
        document.addEventListener("change", () => debounceAutosave());
    }

    function inicializar() {
        envolverFuncoesBase();
        garantirCampoSlotManual();
        atualizarCamposEquipamentoManual();
        inserirBotaoLimparRascunho();
        anexarListenersAutosave();
        if (!carregarRascunhoLocal() && typeof window.renderPainelsDeClasse === "function") {
            window.renderPainelsDeClasse();
        }
        if (document.getElementById("resultado")?.innerHTML.trim()) {
            window.calcularFicha(true);
        }
    }

    function limparRascunhoLocalFicha() {
        if (window.localStorage) {
            window.localStorage.removeItem(DRAFT_KEY);
        }
        window.location.reload();
    }

    window.atualizarConfigQuickAction = atualizarConfigQuickAction;
    window.usarHabilidadeRapida = usarHabilidadeRapida;
    window.setFiltro = setFiltro;
    window.alternarComparacao = alternarComparacao;
    window.limparHistoricoCombate = limparHistoricoCombate;
    window.limparRascunhoLocalFicha = limparRascunhoLocalFicha;
    window.equiparItemInventario = equiparItemInventario;
    window.guardarItemInventario = guardarItemInventario;
    window.atualizarCamposEquipamentoManual = atualizarCamposEquipamentoManual;
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", inicializar);
    } else {
        inicializar();
    }
})();
