(function () {
    const passive = (id, nome, resumo, bonus, requisito) => ({ id, nome, resumo, bonus, requisito: requisito || "" });
    const specialization = (id, nome, resumo) => ({ id, nome, resumo });

    window.CRIADOR_CLASS_COMPENDIUM = window.CRIADOR_CLASS_COMPENDIUM || {};

    window.CRIADOR_ABILITY_SLOT_RULES = [
        { key: "basico_1", tier: "basico", nomeTier: "Basico", label: "Basica I", minLevel: 1, limitText: "Escolha 2 no nivel 1." },
        { key: "basico_2", tier: "basico", nomeTier: "Basico", label: "Basica II", minLevel: 1, limitText: "Escolha 2 no nivel 1." },
        { key: "basico_3", tier: "basico", nomeTier: "Basico", label: "Basica III", minLevel: 5, limitText: "Ganha 1 basica extra no nivel 5." },
        { key: "intermediario_1", tier: "intermediario", nomeTier: "Intermediario", label: "Intermediaria", minLevel: 10, limitText: "Ganha 1 intermediaria no nivel 10." },
        { key: "avancado_1", tier: "avancado", nomeTier: "Avancado", label: "Avancada", minLevel: 25, limitText: "Ganha 1 avancada no nivel 25." },
        { key: "mestre_1", tier: "mestre", nomeTier: "Mestre", label: "Mestre", minLevel: 50, limitText: "Ganha 1 mestre no nivel 50." },
        { key: "supremo_1", tier: "supremo", nomeTier: "Supremo", label: "Suprema", minLevel: 75, limitText: "Ganha 1 suprema no nivel 75." },
        { key: "lendario_1", tier: "lendario", nomeTier: "Lendario", label: "Lendaria", minLevel: 100, limitText: "Ganha 1 lendaria no nivel 100." }
    ];

    window.CRIADOR_SPECIALIZATION_SLOTS = [
        { key: "especializacao_25", label: "Especializacao I", minLevel: 25 },
        { key: "especializacao_50", label: "Especializacao II", minLevel: 50 },
        { key: "especializacao_75", label: "Especializacao III", minLevel: 75 }
    ];

    window.CRIADOR_PASSIVE_ABILITIES = [
        passive("visao_agucada", "Visao Agucada", "Aperfeicoamento dos sentidos visuais.", "+4 em Percepcao para deteccao visual."),
        passive("ouvido_atento", "Ouvido Atento", "Capacidade de captar sons sutis e distantes.", "+4 em Intuicao para testes auditivos."),
        passive("rastreamento_natural", "Rastreamento Natural", "Habilidade nata para seguir rastros e analisar pegadas.", "+5 em Sobrevivencia para rastreamento."),
        passive("reflexos_rapidos", "Reflexos Rapidos", "Velocidade de reacao elevada para esquivas e defesas.", "+4 em testes de Agilidade."),
        passive("empatia_animal", "Empatia Animal", "Comunicacao intuitiva com animais.", "+5 em Natureza para interagir com animais e vantagem em adestramento."),
        passive("intuicao_aprimorada", "Intuicao Aprimorada", "Capacidade de perceber enganos e manipulacoes.", "+4 em Intuicao e resistencia a blefes."),
        passive("resistencia_mental", "Resistencia Mental", "Defesa contra ataques psiquicos e controle mental.", "+4 em Resistencia Psiquica e imunidade a feiticos basicos de controle mental."),
        passive("diplomacia_natural", "Diplomacia Natural", "Facilidade para convencer e negociar.", "+4 em Persuasao e testes de negociacao."),
        passive("maos_habeis", "Maos Habeis", "Destreza manual excepcional.", "+3 em Truques de Mao e Furtividade."),
        passive("afinidade_elemental", "Afinidade Elemental", "Resistencia e controle sobre um elemento especifico.", "+5 em Resistencia ao elemento escolhido e +2 no dano ao utiliza-lo."),
        passive("vigor_duradouro", "Vigor Duradouro", "Capacidade de manter energia por mais tempo.", "+4 em Resistencia Fisica e +25% de regeneracao de SP durante descansos curtos."),
        passive("olhos_da_percepcao", "Olhos da Percepcao", "Visao sobrenatural para detectar ilusoes e detalhes ocultos.", "+5 em testes para detectar ilusoes e ignora penalidades visuais."),
        passive("aprimoramento_noturno", "Aprimoramento Noturno", "Adaptacao a ambientes escuros.", "Visao no escuro ate 30m e +3 em Furtividade em areas sombrias."),
        passive("cura_natural", "Cura Natural", "Regeneracao acelerada do corpo.", "Recupera +10% de HP extra em descansos e +5% de cura ao usar ervas medicinais."),
        passive("afinidade_com_sombras", "Afinidade com Sombras", "Movimentacao furtiva aprimorada em locais escuros.", "+4 em Furtividade e -30% de chance de ser detectado em sombras."),
        passive("inspiracao_carismatica", "Inspiracao Carismatica", "Influencia positiva sobre aliados.", "Aliados a 10m recebem +2 em testes de Moral e resistencia contra medos."),
        passive("pele_de_pedra", "Pele de Pedra", "Resistencia fisica superior.", "Reduz dano fisico em 3 pontos e +2 em Defesa Fisica."),
        passive("equilibrio_sobrenatural", "Equilibrio Sobrenatural", "Controle corporal absoluto.", "+3 em Atletismo e ignora penalidades em terrenos dificeis."),
        passive("compreensao_de_idiomas", "Compreensao de Idiomas", "Permite compreender e falar a maioria dos idiomas, incluindo alguns textos magicos.", "+3 em testes de Decifrar e Comunicacao Multicultural.", "Arcanismo"),
        passive("sentido_magico", "Sentido Magico", "Sensibilidade inata para detectar magia ao redor.", "+5 em testes de Detectar Magia.", "Arcanismo"),
        passive("conhecimento_arcano", "Conhecimento Arcano", "Especializacao em estudos magicos e identificacao de encantamentos.", "+5 em Arcanismo e permite analise gratuita de itens magicos.", "Arcanismo"),
        passive("estudo_historico", "Estudo Historico", "Conhecimento profundo sobre eventos historicos e artefatos.", "+5 em Historia e vantagem para decifrar escrituras antigas.", "Historia"),
        passive("mestre_da_engenharia", "Mestre da Engenharia", "Pericia em mecanica, armadilhas e construcao.", "+4 em Engenharia e +50% de eficiencia ao reparar ou criar objetos mecanicos.", "Engenharia"),
        passive("dominio_elemental", "Dominio Elemental", "Controle avancado sobre um elemento escolhido.", "+4 no dano causado pelo elemento e permite criar efeitos ambientais menores.", "Magia Elemental"),
        passive("precisao_letal", "Precisao Letal", "Habilidade em atingir pontos vitais de inimigos.", "+3 em dano critico.", "Armadura Leve")
    ];

    window.CRIADOR_SPECIALIZATIONS = [
        specialization("escudo_amigo", "Escudo Amigo (Escudo)", "Enquanto empunhar um escudo, pode proteger um aliado adjacente contra projeteis; absorve 50% do dano total do ataque e reduz o dano sofrido pelo aliado em 60%."),
        specialization("equipamentos_grandes", "Proficiencia em Equipamentos Grandes", "Ataques com armas pesadas causam +50% de dano, porem todas as jogadas de ataque sao feitas com Desvantagem. Pode ser ativado ou desativado no inicio do turno."),
        specialization("duas_empunhaduras", "Proficiencia em Duas Empunhaduras", "Ao atacar, golpeia com ambas as armas; causa o dano normal da arma principal +25% do dano da arma secundaria."),
        specialization("equipamentos_versateis", "Proficiencia em Equipamentos Versateis", "Ao empunhar uma arma versatil com duas maos, seu modificador de dano aumenta; para cada 10 pontos de modificador, o dano fixo cresce em +1."),
        specialization("equipamentos_pequenos", "Proficiencia em Equipamentos Pequenos", "Um resultado 19 no d20 ou 95-100 no d100 conta como critico parcial, acrescentando +50% de dano."),
        specialization("arma_de_precisao", "Proficiencia em Arma de Precisao", "Quando obtem um acerto critico com armas de disparo/lanço, recebe 1 Acao extra imediatamente."),
        specialization("prof_elemental", "Proficiencia Elemental", "Escolhe um elemento; causa +25% de dano/habilidade nesse elemento, mas sofre -30% em todos os demais."),
        specialization("prof_cura", "Proficiencia em Cura", "Todas as magias de cura recebem +30% de eficacia; todas as demais magias sofrem -25%."),
        specialization("sobrecarga_magia", "Proficiencia em Sobrecarga de Magia", "Pode lancar a mesma magia duas vezes na mesma acao; o custo total de Mana e dobrado e o segundo lancamento produz 50% do efeito do primeiro."),
        specialization("proficiencia_cajado", "Proficiencia de Cajado", "O d6 de dano do cajado e substituido por um d6 que indica reducao no custo de Mana da habilidade conjurada."),
        specialization("fisico_natural", "Proficiencia Fisico Natural", "Sem usar armaduras, sempre que um inimigo errar um ataque contra voce pode contra-atacar com uma rolagem normal de ataque."),
        specialization("prof_roupas", "Proficiencia em Roupas", "Quaisquer encantamentos aplicados em roupas possuem +10% de eficacia."),
        specialization("prof_armadura_leve", "Proficiencia em Armadura Leve", "Concede +2 nas jogadas de ataque."),
        specialization("prof_armadura_media", "Proficiencia em Armadura Media", "Concede +1 nas jogadas de ataque e +1 na Classe de Armadura (C.A.)."),
        specialization("prof_armadura_pesada", "Proficiencia em Armadura Pesada", "Concede +2 na Classe de Armadura (C.A.).")
    ];
}());
