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
        arma: "Arma",
        armadura: "Armadura",
        anel: "Anel",
        colar: "Colar",
        acessorio: "Acessorio",
        nenhum: "Sem slot"
    };
    const DEFAULT_FILTERS = {
        abilities: { search: "", tier: "todos", unlockedOnly: false, selectedOnly: false },
        passives: { search: "", selected: "todas", requirement: "todas", availability: "todas" },
        inventory: { search: "", type: "todos", rarity: "todas", status: "todos" }
    };
    const DEFAULT_STATE = {
        autosaveDraftVersion: 3,
        skillQuickActions: {},
        combatActionHistory: [],
        equipmentSlots: { arma: "", armadura: "", anel: "", colar: "", acessorio: "" },
        compare: [],
        filters: DEFAULT_FILTERS
    };

    const state = {
        autosaveDraftVersion: 3,
        skillQuickActions: {},
        combatActionHistory: [],
        equipmentSlots: { arma: "", armadura: "", anel: "", colar: "", acessorio: "" },
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

    function parsePesoNumero(valor) {
        if (typeof valor === "number" && Number.isFinite(valor)) return valor;
        const match = String(valor || "").replace(",", ".").match(/-?\d+(\.\d+)?/);
        return match ? Number(match[0]) : 0;
    }

    function normalizarSlotTipo(valor) {
        const slot = normalizarTexto(valor);
        if (slot === "acessorio" || slot === "acessorio") return "acessorio";
        return Object.prototype.hasOwnProperty.call(SLOT_LABELS, slot) ? slot : "nenhum";
    }

    function obterEstadoSerializado() {
        return {
            autosaveDraftVersion: 3,
            skillQuickActions: clone(state.skillQuickActions),
            combatActionHistory: clone(state.combatActionHistory),
            equipmentSlots: clone(state.equipmentSlots),
            compare: Array.isArray(state.compare) ? state.compare.slice(0, 2) : [],
            filters: clone(state.filters)
        };
    }

    function aplicarEstadoExtra(extra) {
        const dados = extra && typeof extra === "object" ? extra : {};
        state.autosaveDraftVersion = 3;
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
        Object.keys(slots).forEach((key) => {
            slots[key] = typeof source[key] === "string" ? source[key] : "";
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

    function inferirSlotItem(item) {
        const forgeTipo = normalizarTexto(item && item.forgeTipo);
        const tipo = normalizarTexto(item && item.tipo);
        const categoria = normalizarTexto(item && item.categoria);
        if (forgeTipo.includes("armadura") || categoria === "armadura") return "armadura";
        if (forgeTipo.includes("equip") || categoria === "arma" || tipo === "equipamento" || tipo === "arma") return "arma";
        if (forgeTipo === "anel") return "anel";
        if (forgeTipo === "colar") return "colar";
        if (tipo === "acessorio") return "acessorio";
        return "nenhum";
    }

    function garantirIntegridadeSlots(itens) {
        const lista = Array.isArray(itens) ? itens : [];
        const slots = { arma: "", armadura: "", anel: "", colar: "", acessorio: "" };
        const vistos = new Set();
        const saida = lista.map((item) => {
            const slotTipo = normalizarSlotTipo(item.slotTipo || inferirSlotItem(item));
            let equipado = Boolean(item.equipado);
            if (slotTipo === "nenhum") {
                equipado = false;
            } else if (equipado && vistos.has(slotTipo)) {
                equipado = false;
            } else if (equipado) {
                vistos.add(slotTipo);
                slots[slotTipo] = item.id;
            }
            return {
                ...item,
                slotTipo,
                equipado,
                statusEquipado: equipado ? "equipado" : "guardado",
                bonusFisico: arredondar(item.bonusFisico),
                bonusMagico: arredondar(item.bonusMagico),
                pesoNumero: arredondar(item.pesoNumero || parsePesoNumero(item.peso))
            };
        });

        Object.keys(state.equipmentSlots).forEach((key) => {
            state.equipmentSlots[key] = slots[key] || "";
        });

        return saida;
    }

    function obterResumoStatusItem(item) {
        if (!item) return "guardado";
        return item.equipado ? "equipado" : "guardado";
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
            SLOT_LABELS[item.slotTipo] || SLOT_LABELS.nenhum,
            item.raridadeNome,
            item.materialNome,
            item.caBonus > 0 ? `CA +${window.formatarValorFicha ? window.formatarValorFicha(item.caBonus) : item.caBonus}` : "",
            item.bonusMagico ? `Magico +${item.bonusMagico}` : "",
            item.peso ? `Peso ${item.peso}` : "",
            obterResumoStatusItem(item) === "equipado" ? "Equipado" : "Guardado"
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
                        ${item.slotTipo !== "nenhum" ? `<label class="inline-check"><input type="checkbox" ${item.equipado ? "checked" : ""} onchange="alternarEquipadoInventario('${item.id}', this.checked)"><span>Equipado</span></label>` : `<span class="inventory-flag">Nao equipavel</span>`}
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
        return `<div class="cp-compare-grid">${selecionados.map((item) => `<div class="cp-compare-card"><strong>${esc(item.nome)}</strong><small>${esc(INVENTORY_TYPE_LABELS[item.tipo] || item.categoriaLabel || "Item")}</small>${campos.map((campo) => { const valor = campo.key === "statusEquipado" ? obterResumoStatusItem(item) : (item[campo.key] || "—"); const destaque = campo.numeric && (Number(item[campo.key]) || 0) === maior[campo.key] && maior[campo.key] > 0; return `<div class="cp-compare-row ${destaque ? "is-better" : ""}"><span>${campo.label}</span><span class="cp-compare-value">${esc(valor)}</span></div>`; }).join("")}</div>`).join("")}</div>`;
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
            if (filtro.type !== "todos" && item.tipo !== filtro.type && item.slotTipo !== filtro.type) return false;
            if (filtro.rarity !== "todas" && item.raridadeNome !== filtro.rarity) return false;
            if (filtro.status !== "todos" && obterResumoStatusItem(item) !== filtro.status) return false;
            return true;
        });
        const equipados = Object.keys(state.equipmentSlots).map((slot) => ({
            slot,
            item: itens.find((item) => item.equipado && item.slotTipo === slot) || null
        }));

        painel.innerHTML = `${criarControlesFiltros()}<h4 class="codex-title">Itens do inventario</h4><p class="codex-note">Os itens equipados aparecem separados por slot. A defesa soma qualquer item equipado com bonus de CA.</p><div class="tag-list"><span class="tag-pill">Itens: ${itens.length}</span><span class="tag-pill">CA dos itens equipados: +${window.formatarValorFicha ? window.formatarValorFicha(bonusCa) : bonusCa}</span><span class="tag-pill">Comparando: ${state.compare.length}/2</span></div><div class="cp-slot-grid">${equipados.map(({ slot, item }) => `<div class="cp-slot-card"><strong>${SLOT_LABELS[slot]}</strong><small>${item ? esc(item.nome) : '<span class="cp-slot-empty">Nenhum item equipado</span>'}</small>${item ? `<small>${esc(item.raridadeNome || "Sem raridade")} | ${esc(item.materialNome || "Sem material")}</small>` : ""}</div>`).join("")}</div><div class="cp-filter-grid"><div class="cp-filter-box"><label>Buscar item</label><input type="text" value="${esc(filtro.search)}" oninput="setFiltro('inventory','search',this.value)" placeholder="Nome, material ou descricao"></div><div class="cp-filter-box"><label>Tipo ou slot</label><select onchange="setFiltro('inventory','type',this.value)"><option value="todos" ${filtro.type === "todos" ? "selected" : ""}>Todos</option><option value="item" ${filtro.type === "item" ? "selected" : ""}>Item geral</option><option value="equipamento" ${filtro.type === "equipamento" ? "selected" : ""}>Equipamento</option><option value="armadura" ${filtro.type === "armadura" ? "selected" : ""}>Armadura</option><option value="acessorio" ${filtro.type === "acessorio" ? "selected" : ""}>Acessorio</option><option value="consumivel" ${filtro.type === "consumivel" ? "selected" : ""}>Consumivel</option><option value="arma" ${filtro.type === "arma" ? "selected" : ""}>Slot arma</option><option value="anel" ${filtro.type === "anel" ? "selected" : ""}>Slot anel</option><option value="colar" ${filtro.type === "colar" ? "selected" : ""}>Slot colar</option></select></div><div class="cp-filter-box"><label>Raridade</label><select onchange="setFiltro('inventory','rarity',this.value)"><option value="todas" ${filtro.rarity === "todas" ? "selected" : ""}>Todas</option>${raridades.map((nome) => `<option value="${esc(nome)}" ${filtro.rarity === nome ? "selected" : ""}>${esc(nome)}</option>`).join("")}</select></div><div class="cp-filter-box"><label>Status</label><select onchange="setFiltro('inventory','status',this.value)"><option value="todos" ${filtro.status === "todos" ? "selected" : ""}>Todos</option><option value="equipado" ${filtro.status === "equipado" ? "selected" : ""}>Equipado</option><option value="guardado" ${filtro.status === "guardado" ? "selected" : ""}>Guardado</option></select></div></div>${renderPainelComparacaoHtml(itens)}${filtrados.length ? `<div class="inventory-list">${filtrados.map((item) => criarCardInventarioAprimorado(item, true)).join("")}</div>` : '<p class="codex-note">Nenhum item encontrado com esse filtro.</p>'}`;
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
        const equipados = Object.keys(state.equipmentSlots).map((slot) => ({ slot, item: itens.find((item) => item.equipado && item.slotTipo === slot) || null }));
        panel.innerHTML = `<h4 style="color:var(--primary); margin:0 0 14px 0; border-bottom:1px solid #444; padding-bottom:5px;">Inventario</h4><textarea id="inventarioTextoCard" class="notes-area" placeholder="Descreva o inventario dessa ficha..." oninput="sincronizarInventarioTexto(this.value, 'card')">${esc(document.getElementById("inventarioTexto")?.value || "")}</textarea><div class="notes-help">Os itens equipados ficam separados por slot. O restante continua no inventario abaixo.</div><div class="cp-slot-grid">${equipados.map(({ slot, item }) => `<div class="cp-slot-card"><strong>${SLOT_LABELS[slot]}</strong><small>${item ? esc(item.nome) : '<span class="cp-slot-empty">Nenhum item equipado</span>'}</small></div>`).join("")}</div>${renderPainelComparacaoHtml(itens)}<div style="margin-top:14px;">${itens.length ? `<div class="inventory-list">${itens.map((item) => criarCardInventarioAprimorado(item, true)).join("")}</div>` : '<p class="codex-note">Nenhum item foi adicionado ao inventario ainda.</p>'}</div>`;
    }

    function limparHistoricoCombate() {
        state.combatActionHistory = [];
        debounceAutosave();
        if (typeof window.calcularFicha === "function") window.calcularFicha(true);
    }

    function garantirCampoSlotManual() {
        if (document.getElementById("inventarioManualSlot")) return;
        const tipoGrupo = document.getElementById("inventarioManualTipo")?.closest(".resource-input");
        if (!tipoGrupo || !tipoGrupo.parentElement) return;
        const div = document.createElement("div");
        div.className = "resource-input";
        div.innerHTML = `<label for="inventarioManualSlot">Slot</label><select id="inventarioManualSlot"><option value="auto">Detectar automaticamente</option><option value="arma">Arma</option><option value="armadura">Armadura</option><option value="anel">Anel</option><option value="colar">Colar</option><option value="acessorio">Acessorio</option><option value="nenhum">Sem slot</option></select>`;
        tipoGrupo.parentElement.insertBefore(div, tipoGrupo.nextSibling);
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
                return {
                    ...item,
                    slotTipo: normalizarSlotTipo(bruto.slotTipo || item.slotTipo || inferirSlotItem({ ...item, ...bruto })),
                    bonusFisico: arredondar(bruto.bonusFisico),
                    bonusMagico: arredondar(bruto.bonusMagico),
                    pesoNumero: arredondar(bruto.pesoNumero || parsePesoNumero(item.peso))
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
            ficha.caInventario = window.obterBonusCaInventario();
            ficha.caTotal = ficha.caBase + ficha.caInventario;
            return ficha;
        };

        window.alternarEquipadoInventario = function (id, ativo) {
            const atuais = typeof window.obterInventarioItens === "function" ? window.obterInventarioItens() : [];
            const alvo = atuais.find((item) => item.id === id);
            const itens = atuais.map((item) => {
                if (item.id === id) {
                    return { ...item, equipado: alvo && alvo.slotTipo !== "nenhum" ? !!ativo : false };
                }
                if (ativo && alvo && alvo.slotTipo !== "nenhum" && item.slotTipo === alvo.slotTipo) {
                    return { ...item, equipado: false };
                }
                return item;
            });
            window.salvarInventarioItens(itens);
            window.renderPainelInventario();
            if (document.getElementById("resultado")?.innerHTML.trim()) window.calcularFicha(true);
            debounceAutosave();
        };

        window.adicionarItemManualInventario = function () {
            const nomeEl = document.getElementById("inventarioManualNome");
            const tipoEl = document.getElementById("inventarioManualTipo");
            const slotEl = document.getElementById("inventarioManualSlot");
            const caEl = document.getElementById("inventarioManualCa");
            const descricaoEl = document.getElementById("inventarioManualDescricao");
            const nome = String(nomeEl && nomeEl.value || "").trim();
            const descricao = String(descricaoEl && descricaoEl.value || "").trim();
            const tipo = INVENTORY_TYPE_LABELS[tipoEl?.value] ? tipoEl.value : "item";
            const categoria = tipo === "armadura" ? "armadura" : ((tipo === "equipamento") ? "arma" : "item");
            const caBonus = Number.parseFloat(caEl && caEl.value);
            if (!nome && !descricao) {
                alert("Preencha pelo menos o nome ou a descricao do item manual.");
                return;
            }
            const brutoSlot = slotEl ? slotEl.value : "auto";
            const slotTipo = brutoSlot === "auto" ? normalizarSlotTipo(inferirSlotItem({ tipo, categoria })) : normalizarSlotTipo(brutoSlot);
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
                caBonus: Number.isFinite(caBonus) ? Math.max(0, Number(caBonus.toFixed(2))) : 0,
                equipado: false,
                slotTipo,
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
            if (slotEl) slotEl.value = "auto";
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
            const slotsOcupados = new Set(atuais.filter((item) => item.equipado).map((item) => item.slotTipo));
            const novos = compartilhados.filter((item) => !idsAtuais.has(item.id)).map((item) => {
                const slotTipo = normalizarSlotTipo(item.slotTipo || inferirSlotItem(item));
                const equipado = slotTipo !== "nenhum" && !slotsOcupados.has(slotTipo);
                if (equipado) slotsOcupados.add(slotTipo);
                return { ...item, slotTipo, equipado };
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
            payload.dados.autosaveDraftVersion = 3;
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
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", inicializar);
    } else {
        inicializar();
    }
})();
