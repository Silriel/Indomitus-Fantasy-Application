(function () {
    const ability = (id, nome, custo, descricao, efeito) => ({ id, nome, custo, descricao, efeito });

    Object.assign(window.CRIADOR_CLASS_COMPENDIUM, {
        ladino: {
            hp: 6,
            mp: 6,
            sp: 10,
            passivas: [
                "+2 de Furtividade a cada 10 niveis.",
                "+2 de Prestidigitacao a cada 10 niveis."
            ],
            subclasses: {
                sombra_silenciosa: {
                    nome: "Sombra Silenciosa",
                    foco: "Furtividade.",
                    efeitos: [
                        "+2 em testes de Furtividade e Acrobacia para esgueiro.",
                        "Se comecar o turno Oculto, ganha +1 de Movimento sem provocar no primeiro deslocamento.",
                        "Ao sair da cobertura e atacar no mesmo turno, recebe +1 no Acerto.",
                        "Reacao 1 vez por combate: ao evitar dano com teste bem-sucedido, pode tentar Furtividade imediatamente."
                    ]
                },
                punhal_fantasma: {
                    nome: "Punhal Fantasma",
                    foco: "Dano furtivo.",
                    efeitos: [
                        "1 vez por turno, se o alvo estiver Surpreendido, Flanqueado ou voce estiver Oculto, adiciona +1d4 de dano ao primeiro ataque que acertar.",
                        "+5% de dano com armas leves quando tiver vantagem no ataque.",
                        "Em critico nessas condicoes, o alvo sofre -1 de Defesa/C.A. ate o proximo turno.",
                        "Apos um ataque que ative esse bonus, voce pode recuar 1 metro sem provocar ataque de oportunidade."
                    ]
                },
                franco_atirador_sombrio: {
                    nome: "Franco-Atirador Sombrio",
                    foco: "Distancia.",
                    efeitos: [
                        "+5% de dano com armas a distancia e arremessos.",
                        "Se nao se deslocar antes de atacar a distancia, ganha +1 no Acerto; se acertar, causa +1d4 de dano adicional.",
                        "Ignora meia cobertura do alvo.",
                        "Apos acertar um ataque a distancia, pode mover 1 metro sem provocar ataque de oportunidade."
                    ]
                }
            },
            abilities: {
                basico: [
                    ability("ataque_sorrateiro", "Ataque Sorrateiro", "10 SP", "Dano de arma + 2d6 em 1 inimigo a ate 2 metros.", "Se estiver furtivo, causa +1d6 adicional."),
                    ability("caminho_das_sombras", "Caminho das Sombras", "4 MP", "Torna-se invisivel por 1 turno e pode mover ate 6 metros sem ser detectado.", "Teste de Acrobacia se atravessar areas iluminadas."),
                    ability("contragolpe_rapido", "Contragolpe Rapido", "8 MP", "Dano de arma + 2d8 em 1 inimigo adjacente.", "So pode ser usado como reacao ao sofrer um ataque."),
                    ability("ilusao_assassina", "Ilusao Assassina", "9 MP", "3d6 ilusorio em ate 2 inimigos a ate 10 metros.", "Inimigos fazem teste D100 vs 80 ou ficam desorientados."),
                    ability("olhar_perspicaz", "Olhar Perspicaz", "8 MP", "Marca 1 inimigo a ate 10 metros por 2 turnos.", "Proximo ataque contra ele causa +2d6.")
                ],
                intermediario: [
                    ability("veneno_mortal", "Veneno Mortal", "11 MP", "Dano de arma + 3d6 venenoso em 1 inimigo a ate 2 metros.", "Alvo sofre 1d6 por turno de veneno por 2 turnos (teste D100)."),
                    ability("ladino_sombrio", "Ladino Sombrio", "16 SP", "Dano de arma + 3d6 em 1 inimigo a ate 2 metros.", "Ignora resistencia fisica se usado enquanto furtivo."),
                    ability("trama_sombria", "Trama Sombria", "18 MP", "Cria sombras ilusorias em area de 6 metros.", "Reduz a visao dos inimigos e impõe -2 em ataque a distancia por 2 turnos.")
                ],
                avancado: [
                    ability("execucao_silenciosa", "Execucao Silenciosa", "25 SP", "Dano de arma + 4d8 em 1 inimigo a ate 2 metros.", "So pode ser usado enquanto furtivo; se eliminar o alvo, pode usar Caminho das Sombras sem custo."),
                    ability("corrente_de_laminas", "Corrente de Laminas", "28 SP", "Dano de arma + 5d6 em ate 3 inimigos adjacentes dividindo o dano.", "Aplica sangramento 1d6 por turno por 2 turnos."),
                    ability("brumas_enganosas", "Brumas Enganosas", "30 MP", "O ladino se torna intangivel por 1 turno.", "Ignora ataques fisicos e passa por obstaculos de ate 1 metro.")
                ],
                mestre: [
                    ability("lamina_sombria_suprema", "Lamina Sombria Suprema", "40 SP", "Dano de arma + 6d10 em 1 inimigo a ate 3 metros.", "Alvo pode ficar atordoado por 1 turno (teste D100)."),
                    ability("mestre_das_sombras", "Mestre das Sombras", "45 MP", "Torna-se invisivel por 3 turnos.", "Pode atravessar qualquer area e ataques nesse tempo causam +4d6."),
                    ability("veneno_paralitico", "Veneno Paralitico", "42 MP", "Dano de arma + 6d8 em 1 inimigo a ate 2 metros.", "Alvo faz teste D100 vs 110; se falhar, fica paralisado por 1 turno.")
                ],
                supremo: [
                    ability("sombra_multiplicada", "Sombra Multiplicada", "60 MP", "Cria 3 duplicatas ilusorias que confundem ate 3 inimigos a ate 10 metros.", "Se falharem no teste D100 vs 120, atacam as ilusoes por 1 turno."),
                    ability("execucao_perfeita", "Execucao Perfeita", "65 SP", "Dano de arma + 10d8 em 1 inimigo a ate 2 metros.", "Se o alvo for eliminado, pode fazer mais 1 ataque imediato em outro inimigo adjacente."),
                    ability("nevoa_letal", "Nevoa Letal", "70 MP", "8d10 venenoso em area de 10 metros, ate 5 inimigos.", "Alvos afetados sofrem -3 resistencia por 2 turnos.")
                ],
                lendario: [
                    ability("mestre_das_facas", "Mestre das Facas", "120 SP", "Arremessa facas em ate 8 inimigos a ate 20 metros; cada ataque causa dano de arma + 6d10.", "Aplica sangramento 2d6 por turno por 3 turnos (teste D100)."),
                    ability("assassino_imortal", "Assassino Imortal", "130 MP", "Durante 3 turnos, ataques ignoram armaduras, imunidades e resistencias.", "Causam +10d8 extra."),
                    ability("sombra_final", "Sombra Final", "140 MP", "Um ataque unico de dano de arma + 15d12 em 1 inimigo a ate 3 metros.", "Se o alvo for derrotado, todos os aliados recuperam 50% do HP e SP.")
                ]
            }
        },
        monge: {
            hp: 10,
            mp: 6,
            sp: 6,
            passivas: [
                "A cada 5 niveis adicionar um d6 no dano do punho.",
                "Sem usar armadura o C.A. natural sera dobrado.",
                "Se usar armadura podera ter apenas uma acao por turno.",
                "Arcanismo."
            ],
            subclasses: {
                punho_do_vendaval: {
                    nome: "Punho do Vendaval",
                    foco: "Dano.",
                    efeitos: [
                        "+5% de dano em ataques desarmados e com arma monastica.",
                        "Se acertar 2 ataques no mesmo alvo no turno, causa +1d6 de dano adicional 1 vez por turno.",
                        "Se nao estiver usando armadura nem escudo, ganha +1 no Acerto no primeiro ataque do turno.",
                        "-1 de custo em habilidades de multiplos golpes."
                    ]
                },
                caminho_da_serenidade: {
                    nome: "Caminho da Serenidade",
                    foco: "Defesa e mobilidade.",
                    efeitos: [
                        "-5% de dano recebido enquanto sem armadura e usando arma monastica ou ataques desarmados.",
                        "Reacao 1 vez por turno: ao ser alvo de um ataque, +1 de Defesa/C.A. contra aquele ataque.",
                        "Quando gastar SP/MP em habilidade, ganha +1 de Movimento ate o fim do turno.",
                        "1 vez por turno, se passar num teste para reduzir dano em area, reduz o dano a 0; em falha, sofre metade."
                    ]
                }
            },
            abilities: {
                basico: [
                    ability("barragem_de_chutes", "Barragem de Chutes", "10 SP", "4d6 fisico em 1 inimigo a ate 2 metros.", "Chance de derrubar o alvo e faze-lo perder 1 acao no proximo turno (teste D100)."),
                    ability("chute_giratorio", "Chute Giratorio", "4 SP", "1d6 fisico em todos os inimigos adjacentes.", "Reduz velocidade dos alvos atingidos em -2 metros no proximo turno."),
                    ability("evasao", "Evasao", "4 SP", "Reduz dano recebido pela metade no proximo ataque sofrido.", "Usa Modificador de Agilidade."),
                    ability("lamina_de_vento", "Lamina de Vento", "11 MP", "2d10 cortante em 1 inimigo a ate 10 metros.", "Ignora armaduras leves."),
                    ability("passo_das_sombras_monge", "Passo das Sombras", "5 MP", "Teleporta ate 5 metros para um local visivel.", "Evita ataques de oportunidade no turno.")
                ],
                intermediario: [
                    ability("reflexos_afiados", "Reflexos Afiados", "5 SP", "Concede +1d4 em Esquiva por 2 turnos.", "Aplica-se a todos os ataques recebidos."),
                    ability("soco_energizado", "Soco Energizado", "6 MP", "2d8 fisico em 1 inimigo a ate 2 metros.", "Chance de empurrar o inimigo 2 metros para tras (teste D100)."),
                    ability("golpe_do_leopardo", "Golpe do Leopardo", "14 SP", "3d8 fisico em 1 inimigo a ate 3 metros.", "Adiciona +1d8 se o monge estiver em movimento no turno.")
                ],
                avancado: [
                    ability("voo_do_dragao", "Voo do Dragao", "20 SP", "3 golpes de 3d6 fisico em 1 inimigo, totalizando 9d6, alcance de ate 3 metros.", "Se o ultimo golpe for critico, aplica atordoamento por 1 turno."),
                    ability("muralha_invisivel", "Muralha Invisivel", "22 MP", "Cria uma barreira de energia ao redor de ate 3 metros.", "Bloqueia projeteis e ataques a distancia por 2 turnos."),
                    ability("chamas_internas", "Chamas Internas", "25 SP", "6d8 magico-fisico em 1 inimigo a ate 3 metros.", "Cura o monge em metade do dano causado.")
                ],
                mestre: [
                    ability("rugido_celestial", "Rugido Celestial", "35 MP", "8d10 sonoro em ate 4 inimigos dividindo o dano a ate 10 metros.", "Alvos podem ficar surdos e perder 1 acao no proximo turno (teste D100)."),
                    ability("lotus_desabrochando", "Lotus Desabrochando", "38 SP", "10d8 fisico em 1 inimigo a ate 3 metros.", "Ignora armadura media."),
                    ability("alma_de_aco", "Alma de Aco", "40 SP", "Durante 3 turnos, o monge recebe metade do dano de todos os ataques.", "Ganha +2d6 de contra-ataque automatico quando atacado corpo a corpo.")
                ],
                supremo: [
                    ability("asas_do_relampago", "Asas do Relampago", "60 MP", "10d10 eletrico em ate 5 inimigos dividindo o dano a ate 15 metros.", "Reduz resistencia magica dos alvos em -3 por 2 turnos."),
                    ability("pulso_vital", "Pulso Vital", "65 SP", "12d8 fisico em area circular de 4 metros ao redor.", "Cura o monge em 2d10 para cada inimigo atingido."),
                    ability("caminho_dos_espiritos", "Caminho dos Espiritos", "70 MP", "Durante 2 turnos, o monge fica intangivel e ignora ataques fisicos.", "Causa +5d10 extra em todos os ataques.")
                ],
                lendario: [
                    ability("punho_do_ceu", "Punho do Ceu", "120 SP", "15d12 fisico em 1 inimigo a ate 5 metros.", "Se finalizar o alvo, todos os inimigos em 5 metros sofrem 6d10 de impacto dividido."),
                    ability("avatar_da_harmonia", "Avatar da Harmonia", "130 MP", "Por 3 turnos, o monge e todos os aliados a ate 15 metros recebem +10 resistencia, +5 ataque e regeneram 4d10 HP por turno.", "Aura lendaria."),
                    ability("ultimo_sopro", "Ultimo Sopro", "140 SP", "Dano de arma + 20d12 em 1 inimigo a ate 5 metros.", "Depois de usar, o monge fica exausto por 1 turno.")
                ]
            }
        },
        mago: {
            hp: 8,
            mp: 12,
            sp: 2,
            passivas: [
                "Arcanismo.",
                "Historia.",
                "Vantagem em criar habilidades magicas.",
                "Pode aprender habilidades de tomos e pergaminhos."
            ],
            subclasses: {
                savant_elemental: {
                    nome: "Savant Elemental",
                    foco: "Dano elemental unico.",
                    efeitos: [
                        "Escolha 1 elemento; suas magias ofensivas desse elemento causam +10% de dano.",
                        "1 vez por turno, se o alvo tiver Resistencia ao seu elemento, reduza-a em 1 nivel apenas para a magia.",
                        "Se lancar 2 magias do mesmo elemento em turnos consecutivos, a segunda recebe +1 no Acerto ou -5% MP.",
                        "Quando sofrer dano do proprio elemento, reduz 2 desse dano por instancia."
                    ]
                },
                arquimago_arcano: {
                    nome: "Arquimago Arcano",
                    foco: "Dano magico total.",
                    efeitos: [
                        "+5% de dano em todas as magias ofensivas.",
                        "+10 em Arcanismo e criacao de habilidade.",
                        "-1 MP em magias com Concentracao.",
                        "1 vez por turno, ao errar uma magia por 1 ponto no Acerto, pode gastar 2 MP para causar metade do dano sem efeitos secundarios."
                    ]
                },
                thaumaturgo_verde: {
                    nome: "Thaumaturgo Verde",
                    foco: "Cura e alquimia.",
                    efeitos: [
                        "+10% de cura em magias e ritos de restauracao do Mago.",
                        "Cura excedente vira Escudo de ate 5% da Vida Maxima por 1 turno.",
                        "Pode usar 1 pocao como acao bonus 1 vez por turno; pocoes de cura usadas por voce curam +1 dado minimo.",
                        "-1 MP em magias de suporte ou +1 de duracao em efeitos de cura ao longo do tempo ou escudo."
                    ]
                },
                battlemage: {
                    nome: "Battlemage",
                    foco: "Corpo a corpo.",
                    efeitos: [
                        "+5% de dano em magias ofensivas de toque ou alcance curto.",
                        "Apos lancar magia ofensiva que acerte, o proximo ataque corpo a corpo no mesmo turno recebe +1 no Acerto e +1d4 de dano.",
                        "Se lancar uma magia e errar, estando com arma corpo a corpo equipada pode rolar um d20 para tentar um ataque corpo a corpo basico no inimigo.",
                        "Ganha proficiencia em armadura media."
                    ]
                }
            },
            abilities: {
                basico: [
                    ability("barreira_arcana_mago", "Barreira Arcana", "6 MP", "Cria uma barreira magica em torno de si ou de 1 aliado a ate 10 metros.", "Bloqueia ate 10 de dano por 2 turnos."),
                    ability("bola_de_fogo_inicial", "Bola de Fogo Inicial", "4 MP", "1d6 de fogo em area de 2 metros, ate 2 inimigos dividindo o dano, a ate 15 metros.", "Aplica queimadura 1d4 por turno por 2 turnos (teste D100)."),
                    ability("raio_desintegrador", "Raio Desintegrador", "9 MP", "2d8 de desintegracao em 1 inimigo a ate 20 metros.", "Chance de ignorar resistencia magica (teste D100)."),
                    ability("telecinese", "Telecinese", "5 MP", "Move objetos de ate 10 kg a ate 10 metros ou puxa ou empurra 1 inimigo leve ate 3 metros.", "Controle fisico (teste D100)."),
                    ability("luz_arcana", "Luz Arcana", "3 MP", "Cria uma esfera de luz flutuante que ilumina ate 20 metros.", "Revela inimigos invisiveis (teste D100).")
                ],
                intermediario: [
                    ability("invisibilidade", "Invisibilidade", "9 MP", "Torna-se invisivel por ate 2 turnos ou ate atacar.", "Se atacar, o primeiro ataque ganha +2d6 extra."),
                    ability("lancas_de_gelo", "Lancas de Gelo", "12 MP", "3d8 perfurante e frio em ate 3 inimigos dividindo o dano a ate 20 metros.", "Reduz velocidade dos alvos em -2 metros por 2 turnos."),
                    ability("protecao_antimagia", "Protecao Antimagia", "8 MP", "Cria uma aura de 5 metros ao redor neutralizando magias inimigas de mesmo nivel ou inferior.", "Campo antimagico.")
                ],
                avancado: [
                    ability("invocacao_astral", "Invocacao Astral", "25 MP", "Invoca ate 2 entidades astrais por 3 turnos.", "Ataque: 3d10 magico."),
                    ability("explosao_elemental_mago", "Explosao Elemental", "28 MP", "5d8 de fogo, gelo ou eletrico em area de 5 metros, ate 4 inimigos a ate 25 metros.", "Aplica queimadura, congelamento ou paralisia leve por 1 turno."),
                    ability("esfera_de_forca", "Esfera de Forca", "30 MP", "Cria uma esfera protetora ao redor de si mesmo.", "Fica imune a dano fisico e magico por 1 turno, mas nao pode atacar.")
                ],
                mestre: [
                    ability("chuva_de_meteoro", "Chuva de Meteoro", "40 MP", "5d10 impacto em area de 10 metros, ate 6 inimigos a ate 30 metros.", "Derruba inimigos atingidos."),
                    ability("corrente_eletrica_suprema", "Corrente Eletrica Suprema", "45 MP", "7d10 eletrico em ate 5 inimigos encadeados dividindo o dano.", "Aplica paralisia por 1 turno."),
                    ability("portal_dimensional", "Portal Dimensional", "50 MP", "Teleporta ate 4 aliados para um local visivel a ate 50 metros.", "Movimentacao estrategica.")
                ],
                supremo: [
                    ability("tormenta_arcana_mago", "Tormenta Arcana", "70 MP", "10d10 magico em todos os inimigos em area de 20 metros.", "Reduz resistencia magica dos alvos em -4 por 2 turnos."),
                    ability("encantamento_supremo", "Encantamento Supremo", "75 MP", "Todos os aliados a ate 15 metros recebem +5 ataque magico e fisico, +4 resistencia magica, e regeneram 2d10 HP por turno por 3 turnos.", "Buff total."),
                    ability("prisao_temporal", "Prisao Temporal", "80 MP", "Congela ate 3 inimigos a ate 30 metros no tempo por 1 turno.", "Eles nao podem agir se falharem no teste D100.")
                ],
                lendario: [
                    ability("impacto_estelar", "Impacto Estelar", "120 MP", "15d12 magico cosmico em todos os inimigos no campo ate 50 metros.", "Reduz HP maximo dos alvos em 25% por 2 turnos."),
                    ability("ascensao_arcana_mago", "Ascensao Arcana", "130 MP", "Por 3 turnos, o mago se torna uma entidade arcana, recebendo +10 em todos os atributos.", "Duplica o dano das magias e regenera 30 MP por turno."),
                    ability("ressurreicao_suprema", "Ressurreicao Suprema", "140 MP", "Revive ate 4 aliados caidos a ate 30 metros com 50% do HP e MP.", "Remove todos os efeitos negativos.")
                ]
            }
        }
    });
}());
