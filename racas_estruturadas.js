(function () {
    "use strict";

    const ATTR_KEYS = ["forca", "inteligencia", "forcaVontade", "agilidade", "resistencia", "carisma"];
    const ZERO_MODIFIERS = {
        "força": 0,
        "inteligência": 0,
        "forçaVontade": 0,
        "agilidade": 0,
        "resistência": 0,
        "carisma": 0
    };

    function advantage(id, texto, annuls) {
        return {
            id: String(id || ""),
            texto: String(texto || ""),
            annuls: Array.isArray(annuls) ? annuls.map((item) => String(item || "")).filter(Boolean) : []
        };
    }

    function drawback(id, texto) {
        return {
            id: String(id || ""),
            texto: String(texto || "")
        };
    }

    function mods(forca, inteligencia, forcaVontade, agilidade, resistencia, carisma) {
        return {
            "força": Number(forca || 0),
            "inteligência": Number(inteligencia || 0),
            "forçaVontade": Number(forcaVontade || 0),
            "agilidade": Number(agilidade || 0),
            "resistência": Number(resistencia || 0),
            "carisma": Number(carisma || 0)
        };
    }

    const STRUCTURED_RACES = {
        "19": {
            nome: "Abysanguina'tor",
            modificadores: mods(4, 2, 1, 5, 4, 1),
            passivaRacial: "",
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: []
        },
        "20": {
            nome: "Abyssalords",
            modificadores: mods(4, 2, 1, 3, 4, 1),
            passivaRacial: "Canalizam o poder do Abismo. Ao derrotar um inimigo, absorvem 20% da vida, mana e estamina do alvo derrotado.",
            vantagensPadrao: [],
            vantagensSituacionais: [
                advantage("20_medo_absoluto", "Pode invocar medo absoluto com d100 75+, reduzindo ataque e defesa dos inimigos proximos em 15% por 3 rodadas."),
                advantage("20_invocar_demonios", "Uma vez por combate, pode invocar ate 3 demonios menores por 5 rodadas.")
            ],
            desvantagens: [
                drawback("20_divino", "Magias e ataques divinos causam dano extra e podem quebrar temporariamente sua ligacao com o Abismo."),
                drawback("20_energia_abismo", "Precisa absorver energia do Abismo regularmente; sem isso, seus atributos diminuem gradualmente."),
                drawback("20_locais_consagrados", "Locais consagrados ou abencoados reduzem suas capacidades magicas e dificultam invocacoes.")
            ]
        },
        "21": {
            nome: "Abyssaterrox",
            modificadores: mods(10, 3, 3, 7, 10, 3),
            passivaRacial: "Furia Abissal: ao entrar em combate, pode ganhar +30% de Forca e Resistencia por 5 rodadas e regenera 2% de vida por rodada, mas prioriza ataques diretos.",
            vantagensPadrao: [],
            vantagensSituacionais: [
                advantage("21_bonus_derrota", "Ao derrotar um inimigo, recebe +10% de Agilidade e Resistencia por 2 rodadas, acumulando ate 3 vezes."),
                advantage("21_rugido", "Uma vez por combate, pode emitir um rugido aterrorizante; inimigos proximos que falharem em d100 70+ sofrem -15% ataque por 3 rodadas.")
            ],
            desvantagens: [
                drawback("21_mental", "Tem desvantagem contra ataques mentais."),
                drawback("21_sagrado", "Magias sagradas causam dano extra e podem dissipar temporariamente a Furia Abissal.")
            ]
        },
        "22": {
            nome: "Altum Unmo",
            modificadores: mods(4, 2, 3, 2, 2, 2),
            passivaRacial: "Guardioes Andarilhos: pode rolar d100 e, com 65 ou mais, levantar apos ser nocauteado fatalmente.",
            vantagensPadrao: [
                advantage("22_trevas", "Tem vantagem em resistencia contra trevas.")
            ],
            vantagensSituacionais: [],
            desvantagens: []
        },
        "23": {
            nome: "Anjos",
            modificadores: mods(11, 11, 11, 11, 11, 11),
            passivaRacial: "Guardioes eternos: recebem bonus contra todas as criaturas das trevas e malignas.",
            vantagensPadrao: [],
            vantagensSituacionais: [
                advantage("23_elementos", "Tem vantagem contra todos os tipos de elementos, exceto divino.")
            ],
            desvantagens: []
        },
        "24": {
            nome: "Arcanjos",
            modificadores: mods(13, 13, 12, 12, 13, 13),
            passivaRacial: "Vigilantes do Cosmos: possuem conexao profunda com as forcas primordiais e recebem bonus contra entidades cosmicas, forcas do mal e disturbios no equilibrio.",
            vantagensPadrao: [
                advantage("24_resistencia_psiquica", "Possuem resistencia natural a danos psiquicos e magicos.")
            ],
            vantagensSituacionais: [
                advantage("24_mal_elementos", "Tem vantagem contra todos os tipos de elementos e forcas malignas, exceto as ligadas a essencia divina.")
            ],
            desvantagens: []
        },
        "25": {
            nome: "Anoes Abissais",
            modificadores: mods(2, 1, 0, 0, 3, 0),
            passivaRacial: "Visao abissal: enxerga no escuro.",
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: []
        },
        "26": {
            nome: "Anoes das Profundezas",
            modificadores: mods(0, 2, 1, 0, 4, 0),
            passivaRacial: "Alquimia profunda: com d100 75+, consegue transformar minerio em outro equivalente ao numero.",
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: []
        },
        "27": {
            nome: "Anoes Vulcanicos",
            modificadores: mods(2, 0, 1, 0, 5, 0),
            passivaRacial: "Resistencia elemental.",
            vantagensPadrao: [],
            vantagensSituacionais: [
                advantage("27_fogo_lava", "Tem vantagem contra fogo, lava e derivados.")
            ],
            desvantagens: []
        },
        "28": {
            nome: "Akash",
            modificadores: mods(1, 1, 2, 3, 2, 1),
            passivaRacial: "Olhar da verdade: pode fazer um teste de indole com vantagem para analisar se a indole de alguem e boa ou ruim. Usa uma vez por pessoa e recarrega em 3 descansos longos.",
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: []
        },
        "29": {
            nome: "Ciclope",
            modificadores: mods(8, 0, 0, 0, 2, 0),
            passivaRacial: "Forca monocular: ganha modificadores raciais elevados ligados a sua forca bruta.",
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: []
        },
        "30": {
            nome: "Demonios",
            modificadores: mods(6, 6, 6, 6, 6, 6),
            passivaRacial: "Crias dos Chaos: podem corromper uma pessoa gradualmente.",
            vantagensPadrao: [
                advantage("30_imune_doenca_veneno", "Sao imunes a doencas e venenos.")
            ],
            vantagensSituacionais: [
                advantage("30_elementos", "Tem vantagem contra todos os elementos."),
                advantage("30_neutros", "Tem vantagem em acerto contra criaturas neutras, como humanos, elfos, anoes e racas comuns."),
                advantage("30_trevas", "Tem vantagem em acerto com ataques das trevas.")
            ],
            desvantagens: [
                drawback("30_divino_draconico", "Recebem desvantagem contra golpes divinos e draconicos.")
            ]
        },
        "31": {
            nome: "Demonios Principialis",
            modificadores: mods(7, 7, 7, 7, 7, 7),
            passivaRacial: "Mestre da Corrupcao: corrompem gradualmente seres dos planos materiais, degenerando mente, corpo e essencia das vitimas.",
            vantagensPadrao: [],
            vantagensSituacionais: [
                advantage("31_elementos", "Tem resistencia natural e vantagem contra ataques elementares."),
                advantage("31_neutros", "Tem vantagem em acerto contra criaturas neutras."),
                advantage("31_trevas", "Tem vantagem em acerto com ataques das trevas e magia sombria.")
            ],
            desvantagens: []
        },
        "32": {
            nome: "Draconatos Antigos",
            modificadores: mods(4, 3, 0, 3, 4, 2),
            passivaRacial: "Escolhe uma resistencia elemental e pode lancar feiticos de fogo pela boca.",
            vantagensPadrao: [],
            vantagensSituacionais: [
                advantage("32_voo", "Pode voar por 3 turnos em combate e por 1 hora em acoes fora de combate.")
            ],
            desvantagens: []
        },
        "33": {
            nome: "Dragoes",
            modificadores: mods(4, 5, 3, 4, 7, 5),
            passivaRacial: "Furia draconica: apos cair em combate, volta com 50% da vida e status duplicados por 3 turnos.",
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: []
        },
        "34": {
            nome: "Dreadlords",
            modificadores: mods(2, 5, 3, 3, 2, 7),
            passivaRacial: "Sussurros do Medo: em um raio de 10 metros, inimigos que falharem em d100 70+ entram em panico, perdendo 20% de precisao e esquiva por 3 rodadas e ficando limitados em habilidades de alto custo.",
            vantagensPadrao: [],
            vantagensSituacionais: [
                advantage("34_recupera_panico", "Quando um inimigo em panico e derrotado, recupera 10% de vida e mana."),
                advantage("34_tentaculos", "Uma vez por combate, pode criar tentaculos sombrios que restringem inimigos por ate 2 rodadas.")
            ],
            desvantagens: [
                drawback("34_luz_sagrado", "Magias de luz e habilidades sagradas causam dano amplificado e dissipam temporariamente seus efeitos de medo."),
                drawback("34_escuridao", "Dependem da escuridao. Em areas muito iluminadas ou consagradas, seus poderes ficam severamente enfraquecidos."),
                drawback("34_psiquico", "Ataques psiquicos bem-sucedidos causam mais dano por sua conexao profunda com mente e emocao.")
            ]
        },
        "35": {
            nome: "Dwevers",
            modificadores: mods(3, 3, 1, 2, 4, 0),
            passivaRacial: "Engenheiro excepcional: rola um dado com vantagem ao criar algo ligado a forja, artifice e derivados.",
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: []
        },
        "36": {
            nome: "Edelins",
            modificadores: mods(5, 7, 6, 5, 5, 6),
            passivaRacial: "Forca Imparavel: pode rolar d100 para se levantar apos nocaute fatal; com mais de 60, volta sem sequelas.",
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: []
        },
        "37": {
            nome: "Elandres",
            modificadores: mods(10, 10, 10, 10, 10, 10),
            passivaRacial: "Perfeicao do criador: se aprimoram e elevam seus niveis com uma curva ascendente de poder.",
            vantagensPadrao: [
                advantage("37_imune_doenca_veneno", "Sao imunes a doencas e venenos.")
            ],
            vantagensSituacionais: [
                advantage("37_elementos", "Tem vantagem contra todos os elementos."),
                advantage("37_trevas", "Tem vantagem em acerto contra criaturas das trevas."),
                advantage("37_divino", "Tem vantagem em acerto de ataques divinos.")
            ],
            desvantagens: []
        },
        "38": {
            nome: "Elandres Indorielien",
            modificadores: mods(13, 13, 13, 13, 13, 13),
            passivaRacial: "Luz Suprema: causa +25% de dano contra criaturas das trevas ou malignas, reduz 50% do dano de ataques sombrios ou malignos e fortalece aliados proximos com +5 em todos os atributos em um raio de 20 metros.",
            vantagensPadrao: [
                advantage("38_imunidades", "Sao imunes a doencas, venenos e efeitos de manipulacao mental.")
            ],
            vantagensSituacionais: [
                advantage("38_trevas_impuros", "Tem vantagem em acerto contra criaturas das trevas ou impuras."),
                advantage("38_elementos", "Recebem resistencia total a todos os elementos, exceto divino."),
                advantage("38_presenca", "Inspiram aliados ao redor, aumentando combate, defesa e magia enquanto estiverem presentes."),
                advantage("38_magia_divina", "Dominam magia divina de cura, protecao e ataque em grande escala.")
            ],
            desvantagens: []
        },
        "39": {
            nome: "Elfarin",
            modificadores: mods(5, 6, 4, 6, 6, 4),
            passivaRacial: "Aprendizagem rapida: ganha vantagem a cada tres dias para aprender ou melhorar uma habilidade.",
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: []
        },
        "40": {
            nome: "Elfae",
            modificadores: mods(5, 7, 4, 7, 4, 5),
            passivaRacial: "Aprendizagem rapida: ganha vantagem a cada quatro dias para aprender ou melhorar uma habilidade.",
            vantagensPadrao: [],
            vantagensSituacionais: [
                advantage("40_trevas_profano", "Tem vantagem em resistencia a trevas e profano.")
            ],
            desvantagens: []
        },
        "41": {
            nome: "Elfos das Areias",
            modificadores: mods(0, 3, 1, 5, 3, 6),
            passivaRacial: "Resistencia a desolacao: pode ficar ate 1 dia sem comer nem beber agua sem sofrer penalidade.",
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: []
        },
        "42": {
            nome: "Elfos do Mar",
            modificadores: mods(1, 4, 2, 4, 3, 2),
            passivaRacial: "Respiracao aquatica: pode ficar ate 10 horas abaixo da agua.",
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: []
        },
        "43": {
            nome: "Elfos da Luz",
            modificadores: mods(7, 7, 7, 7, 7, 7),
            passivaRacial: "Aprendizagem rapida: ganha vantagem a cada dia para aprender ou melhorar uma habilidade.",
            vantagensPadrao: [
                advantage("43_imune_doenca_veneno", "Sao imunes a doencas e venenos.")
            ],
            vantagensSituacionais: [
                advantage("43_elementos", "Tem vantagem contra todos os elementos."),
                advantage("43_trevas", "Tem vantagem em acerto contra criaturas das trevas."),
                advantage("43_divino", "Tem vantagem em acerto de ataques divinos.")
            ],
            desvantagens: []
        },
        "44": {
            nome: "Elfos da Noite",
            modificadores: mods(2, 5, 0, 3, 2, 1),
            passivaRacial: "Noite da mortalha: ganha vantagem em acoes e ataques durante a noite.",
            vantagensPadrao: [],
            vantagensSituacionais: [
                advantage("44_noite", "Tem vantagem em acoes e ataques durante a noite.")
            ],
            desvantagens: []
        },
        "45": {
            nome: "Eltmar",
            modificadores: mods(3, 0, 0, 3, 3, 0),
            passivaRacial: "Xamanismo aureo espiritual das eras passadas: pode se comunicar com um espirito ancestral.",
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: []
        },
        "46": {
            nome: "Ferrekins",
            modificadores: mods(5, 0, 5, 0, 5, 0),
            passivaRacial: "Forja viva: consegue criar armas ou ferramentas a partir do proprio corpo, usando metade do modificador de ataque como base.",
            vantagensPadrao: [],
            vantagensSituacionais: [
                advantage("46_fisico_veneno", "Tem alta resistencia a ataques fisicos e venenosos.")
            ],
            desvantagens: [
                drawback("46_agua_gelo", "Sofrem desvantagem contra agua, gelo e derivados.")
            ]
        },
        "47": {
            nome: "Gigantes",
            modificadores: mods(7, 0, 3, 0, 4, 0),
            passivaRacial: "Muralha viva: se permanecer parado em combate, pode rolar d100 e, com 75 ou mais, reduzir o dano pela metade.",
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: []
        },
        "48": {
            nome: "Haesir",
            modificadores: mods(4, 4, 3, 4, 4, 5),
            passivaRacial: "Engenheiro inato: rola dados com vantagem quando estiver criando maquinario.",
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: []
        },
        "49": {
            nome: "Kametari",
            modificadores: mods(2, 6, 6, 3, 5, 4),
            passivaRacial: "Morte Alem: se morrer, pode rolar d100 e, com resultado acima de 70, voltar a vida como um lich.",
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: []
        },
        "50": {
            nome: "Licantropo",
            defaultVariant: "ipo_1",
            variants: {
                ipo_1: {
                    label: "1o Ipo",
                    modificadores: mods(2, 0, -3, 2, 3, 0),
                    passivaRacial: "Lobisomem Amaldicoado: transforma automaticamente na lua cheia, perde o controle e depois sofre exaustao severa. Extras fora da ficha atual: +2 Constituicao e +2 Percepcao.",
                    vantagensPadrao: [
                        advantage("50_1_regeneracao", "Tem regeneracao natural acelerada fora de combate."),
                        advantage("50_1_doencas", "E imune a doencas comuns e tem vantagem contra venenos e doencas."),
                        advantage("50_1_rastreamento", "Tem vantagem em rastreamento por sentidos agucados.")
                    ],
                    vantagensSituacionais: [
                        advantage("50_1_lua", "Na noite de lua cheia, recebe +10% de vida e estamina."),
                        advantage("50_1_abate", "Ao reduzir um inimigo a 0 em combate corpo a corpo, recupera 5% da vida maxima.")
                    ],
                    desvantagens: [
                        drawback("50_prata", "Prata ignora sua regeneracao e causa dano adicional."),
                        drawback("50_instintos", "Instintos agressivos podem gerar conflitos sociais e decisoes impulsivas."),
                        drawback("50_lua_cheia", "Na lua cheia, pode perder totalmente o controle e a sanidade temporariamente."),
                        drawback("50_mental_luz", "Recebe desvantagem contra controle mental, efeitos lunares, luz e magias divinas.")
                    ]
                },
                ipo_2: {
                    label: "2o Ipo",
                    modificadores: mods(3, 0, -1, 3, 4, 0),
                    passivaRacial: "Lobisomem Desperto: pode se transformar por ate 6 turnos ou minutos, 2 vezes por dia, mantendo controle mental na maior parte do tempo. Extras fora da ficha atual: +2 Constituicao e +3 Percepcao.",
                    vantagensPadrao: [
                        advantage("50_2_regeneracao", "Tem regeneracao natural acelerada fora de combate."),
                        advantage("50_2_doencas", "E imune a doencas comuns e tem vantagem contra venenos e doencas."),
                        advantage("50_2_rastreamento", "Tem vantagem em rastreamento por sentidos agucados.")
                    ],
                    vantagensSituacionais: [
                        advantage("50_2_lua", "Na noite de lua cheia, recebe +10% de vida e estamina."),
                        advantage("50_2_abate", "Ao reduzir um inimigo a 0 em combate corpo a corpo, recupera 5% da vida maxima."),
                        advantage("50_2_forma", "Na lua cheia, ganha duas transformacoes extras, mas ainda testa autocontrole.")
                    ],
                    desvantagens: [
                        drawback("50_prata", "Prata ignora sua regeneracao e causa dano adicional."),
                        drawback("50_instintos", "Instintos agressivos podem gerar conflitos sociais e decisoes impulsivas."),
                        drawback("50_mental_luz", "Recebe desvantagem contra controle mental, efeitos lunares, luz e magias divinas.")
                    ]
                },
                ipo_3: {
                    label: "3o Ipo",
                    modificadores: mods(4, 0, 1, 4, 5, 0),
                    passivaRacial: "Lobisomem Alfa: pode transformar-se livremente, sem perder sanidade, e lidera outros licantropos. Extras fora da ficha atual: +4 Constituicao e +4 Percepcao.",
                    vantagensPadrao: [
                        advantage("50_3_regeneracao", "Tem regeneracao natural acelerada fora de combate."),
                        advantage("50_3_doencas", "E imune a doencas comuns e tem vantagem contra venenos e doencas."),
                        advantage("50_3_rastreamento", "Tem vantagem em rastreamento por sentidos agucados."),
                        advantage("50_3_alcateia", "Pode liderar alcateias e fortalecer aliados licantropos proximos.")
                    ],
                    vantagensSituacionais: [
                        advantage("50_3_lua", "Na noite de lua cheia, recebe +10% de vida e estamina."),
                        advantage("50_3_abate", "Ao reduzir um inimigo a 0 em combate corpo a corpo, recupera 5% da vida maxima.")
                    ],
                    desvantagens: [
                        drawback("50_prata", "Prata ignora sua regeneracao e causa dano adicional."),
                        drawback("50_instintos", "Instintos agressivos podem gerar conflitos sociais e decisoes impulsivas."),
                        drawback("50_mental_luz", "Recebe desvantagem contra controle mental, efeitos lunares, luz e magias divinas.")
                    ]
                }
            }
        },
        "51": {
            nome: "Nolare",
            modificadores: mods(8, 8, 8, 8, 8, 8),
            passivaRacial: "Adeptos de Sar-Urdun: se aprimoram e elevam seus niveis com uma curva ascendente de poder.",
            vantagensPadrao: [
                advantage("51_imune_doenca_veneno", "Sao imunes a doencas e venenos.")
            ],
            vantagensSituacionais: [
                advantage("51_elementos", "Tem vantagem contra todos os elementos."),
                advantage("51_luz", "Tem vantagem em acerto contra criaturas da luz."),
                advantage("51_trevas", "Tem vantagem em acerto de ataques das trevas.")
            ],
            desvantagens: []
        },
        "52": {
            nome: "Nobraqui",
            modificadores: mods(6, 6, 6, 6, 6, 6),
            passivaRacial: "Aprendizagem demoniaca: ganha vantagem a cada tres dias para aprender ou melhorar uma habilidade.",
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: []
        },
        "53": {
            nome: "Sanguinor",
            modificadores: mods(4, 6, 4, 6, 6, 4),
            passivaRacial: "Roubo de Vitalidade: pode consumir sangue de um inimigo e ganhar 1% dos status; apos descanso longo, pode roubar 50% de vida, mana e estamina com d100 75+.",
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: [
                drawback("53_divino", "Tem desvantagem contra magias divinas.")
            ]
        },
        "54": {
            nome: "Sylvaras",
            modificadores: mods(7, 0, 3, 0, 7, 8),
            passivaRacial: "Ciclo natural: adaptam-se as estacoes e mudam seus bonus conforme o ambiente natural ao redor.",
            vantagensPadrao: [],
            vantagensSituacionais: [
                advantage("54_primavera", "Na primavera, recebem o dobro de vida ao receber cura."),
                advantage("54_verao", "No verao, aumentam forca e resistencia fisica, causando mais dano corpo a corpo."),
                advantage("54_outono", "No outono, ganham bonus em percepcao e reflexos."),
                advantage("54_inverno", "No inverno, ficam mais furtivos, com bonus em furtividade e esquiva.")
            ],
            desvantagens: [
                drawback("54_fogo", "Tem desvantagem contra fogo e derivados.")
            ]
        },
        "55": {
            nome: "Trovarin",
            modificadores: mods(4, 4, 2, 6, 4, 0),
            passivaRacial: "Vitalidade ancestral: quando a vida chega a 20%, pode rolar um d20 para definir quantos pontos percentuais regenera. Recarrega apos descanso longo.",
            vantagensPadrao: [],
            vantagensSituacionais: [
                advantage("55_veneno", "Tem vantagem contra veneno.")
            ],
            desvantagens: []
        },
        "56": {
            nome: "Troll",
            modificadores: mods(2, 2, 1, 4, 2, 0),
            passivaRacial: "Vitalidade da selva: quando a vida chega a 10%, pode rolar um d10 para definir quantos pontos percentuais regenera. Recarrega apos descanso longo.",
            vantagensPadrao: [],
            vantagensSituacionais: [
                advantage("56_veneno", "Tem vantagem contra veneno.")
            ],
            desvantagens: []
        },
        "57": {
            nome: "Orcarins",
            modificadores: mods(7, 2, 4, 4, 6, 3),
            passivaRacial: "FURIA: quando fica abaixo de 50% de vida, entra em furia, duplicando os status por 3 turnos. Recarrega apos descanso longo.",
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: []
        },
        "58": {
            nome: "Unmo Superioris",
            modificadores: mods(8, 7, 8, 7, 9, 5),
            passivaRacial: "Disciplina inata: em combate, pode ganhar duas acoes extras em um turno. Recarrega apos descanso longo.",
            vantagensPadrao: [
                advantage("58_imune_doenca_veneno", "Sao imunes a doencas e venenos.")
            ],
            vantagensSituacionais: [
                advantage("58_elementos", "Tem vantagem contra todos os elementos."),
                advantage("58_trevas", "Tem vantagem em acerto contra criaturas das trevas."),
                advantage("58_divino", "Tem vantagem em acerto de ataques divinos.")
            ],
            desvantagens: []
        },
        "59": {
            nome: "Vampiro",
            modificadores: mods(3, 3, 3, 3, 4, 3),
            passivaRacial: "Ladrao de Sangue: ao se alimentar, recupera 10% da vida e 5% da mana e estamina, alem de ganhar +2 em Forca e Resistencia por 3 turnos.",
            vantagensPadrao: [
                advantage("59_imune_doenca_veneno", "Sao imunes a doencas mortais, venenos comuns e possuem resistencia mental contra medo e manipulacoes emocionais.")
            ],
            vantagensSituacionais: [
                advantage("59_servos", "Pode criar servos vampiros e controla 1 servo por cada 70 niveis."),
                advantage("59_magnetismo", "Tem magnetismo sobrenatural com vantagem contra alvos com Carisma inferior ao seu.")
            ],
            desvantagens: [
                drawback("59_sol", "Sofre dano constante sob luz solar direta e perde boa parte das habilidades durante o dia."),
                drawback("59_fome", "Se ficar sem sangue por mais de tres dias, perde gradualmente Forca e Resistencia."),
                drawback("59_servos_rebeldes", "Servos podem desafiar o controle se o vampiro estiver fraco ou distraido."),
                drawback("59_territorio", "Conflitos por territorio e influencia dificultam cooperacao com outros vampiros."),
                drawback("59_divino_draconico", "Recebe desvantagem de golpes divinos e draconicos.")
            ]
        },
        "60": {
            nome: "Vampyr",
            modificadores: mods(6, 2, 2, 6, 6, 1),
            passivaRacial: "Sangue Roubado: com toque ou mordida, drena vida, alma, mana e estamina, recuperando 25% da vida, mana e estamina da vitima.",
            vantagensPadrao: [
                advantage("60_imune_doenca_veneno", "E imune a doencas e venenos e resiste melhor a efeitos mentais de mortais.")
            ],
            vantagensSituacionais: [
                advantage("60_servos", "Pode transformar vitimas em servos vampiros com d100 acima de 85, uma vez por alvo."),
                advantage("60_animais", "Pode obter sangue de animais para reduzir a necessidade de alimento humano.")
            ],
            desvantagens: [
                drawback("60_sol", "Tem desvantagem sob luz solar direta."),
                drawback("60_fome", "Se ficar sem sangue, suas habilidades diminuem e ele enfraquece progressivamente."),
                drawback("60_limite_servos", "Controlar servos demais enfraquece o vinculo e pode causar rebelioes; controla 1 servo pleno a cada 50 niveis.")
            ]
        },
        "61": {
            nome: "Vampyr'rein",
            modificadores: mods(6, 7, 4, 5, 5, 5),
            passivaRacial: "Roubo de Vitalidade: pode consumir o sangue de um inimigo e ganhar 0,5% dos status; apos descanso longo, pode roubar 25% de vida, mana e estamina com d100 80+.",
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: [
                drawback("61_divino", "Tem desvantagem contra magias divinas."),
                drawback("61_draconico", "Tem desvantagem contra efeitos draconicos."),
                drawback("61_sol", "Tem desvantagem sob a luz solar.")
            ]
        }
    };

    function cloneAdvantageList(lista) {
        return (Array.isArray(lista) ? lista : []).map((item) => advantage(item.id, item.texto, item.annuls));
    }

    function cloneDrawbackList(lista) {
        return (Array.isArray(lista) ? lista : []).map((item) => drawback(item.id, item.texto));
    }

    function normalizeModifiers(raw) {
        return {
            ...ZERO_MODIFIERS,
            ...(raw && typeof raw === "object" ? raw : {})
        };
    }

    function normalizeLegacyRaceEntry(raceId, legacyEntry) {
        const passivas = Array.isArray(legacyEntry?.passivas)
            ? legacyEntry.passivas.map((item) => String(item || "").trim()).filter(Boolean)
            : [];
        return {
            id: String(raceId || ""),
            nome: String(legacyEntry?.nome || `Raca ${raceId}`),
            modificadores: normalizeModifiers(legacyEntry?.modificadores),
            passivaRacial: passivas.join(" | "),
            vantagensPadrao: [],
            vantagensSituacionais: [],
            desvantagens: [],
            defaultVariant: "",
            variants: {}
        };
    }

    function normalizeStructuredRaceEntry(raceId, structuredEntry, legacyEntry) {
        const base = normalizeLegacyRaceEntry(raceId, legacyEntry);
        const current = structuredEntry && typeof structuredEntry === "object" ? structuredEntry : {};
        const variants = current.variants && typeof current.variants === "object" ? current.variants : {};
        return {
            ...base,
            ...current,
            nome: String(current.nome || base.nome),
            modificadores: normalizeModifiers(current.modificadores || base.modificadores),
            passivaRacial: String(current.passivaRacial != null ? current.passivaRacial : base.passivaRacial || ""),
            vantagensPadrao: cloneAdvantageList(current.vantagensPadrao || base.vantagensPadrao),
            vantagensSituacionais: cloneAdvantageList(current.vantagensSituacionais || base.vantagensSituacionais),
            desvantagens: cloneDrawbackList(current.desvantagens || base.desvantagens),
            defaultVariant: String(current.defaultVariant || ""),
            variants
        };
    }

    function getIndomitusRaceVariants(raceId, legacyEntry) {
        const current = normalizeStructuredRaceEntry(raceId, STRUCTURED_RACES[String(raceId)], legacyEntry);
        const variants = current.variants && typeof current.variants === "object" ? current.variants : {};
        return Object.entries(variants).map(([key, variant]) => ({
            key,
            label: String(variant?.label || key)
        }));
    }

    function resolveVariantData(baseEntry, variantKey) {
        const variants = baseEntry.variants && typeof baseEntry.variants === "object" ? baseEntry.variants : {};
        const keys = Object.keys(variants);
        if (!keys.length) {
            return {
                variantKey: "",
                variantLabel: "",
                modificadores: baseEntry.modificadores,
                passivaRacial: baseEntry.passivaRacial,
                vantagensPadrao: baseEntry.vantagensPadrao,
                vantagensSituacionais: baseEntry.vantagensSituacionais,
                desvantagens: baseEntry.desvantagens
            };
        }
        const resolvedKey = variants[variantKey] ? String(variantKey) : String(baseEntry.defaultVariant || keys[0]);
        const variant = variants[resolvedKey] || {};
        return {
            variantKey: resolvedKey,
            variantLabel: String(variant.label || resolvedKey),
            modificadores: normalizeModifiers(variant.modificadores || baseEntry.modificadores),
            passivaRacial: String(variant.passivaRacial != null ? variant.passivaRacial : baseEntry.passivaRacial || ""),
            vantagensPadrao: cloneAdvantageList(variant.vantagensPadrao || baseEntry.vantagensPadrao),
            vantagensSituacionais: cloneAdvantageList(variant.vantagensSituacionais || baseEntry.vantagensSituacionais),
            desvantagens: cloneDrawbackList(variant.desvantagens || baseEntry.desvantagens)
        };
    }

    function resolveIndomitusRaceData(raceId, legacyEntry, variantKey) {
        const current = normalizeStructuredRaceEntry(raceId, STRUCTURED_RACES[String(raceId)], legacyEntry);
        const resolved = resolveVariantData(current, variantKey);
        const displayName = resolved.variantLabel ? `${current.nome} - ${resolved.variantLabel}` : current.nome;
        return {
            id: String(raceId || ""),
            nome: displayName,
            baseNome: current.nome,
            displayNome: displayName,
            variantKey: resolved.variantKey,
            variantLabel: resolved.variantLabel,
            modificadores: normalizeModifiers(resolved.modificadores),
            passivaRacial: String(resolved.passivaRacial || ""),
            passivas: String(resolved.passivaRacial || "").trim() ? [String(resolved.passivaRacial || "").trim()] : [],
            vantagensPadrao: cloneAdvantageList(resolved.vantagensPadrao),
            vantagensSituacionais: cloneAdvantageList(resolved.vantagensSituacionais),
            desvantagens: cloneDrawbackList(resolved.desvantagens)
        };
    }

    window.INDOMITUS_RACE_ATTR_KEYS = ATTR_KEYS.slice();
    window.INDOMITUS_STRUCTURED_RACES = STRUCTURED_RACES;
    window.getIndomitusRaceVariants = getIndomitusRaceVariants;
    window.resolveIndomitusRaceData = resolveIndomitusRaceData;
})();
