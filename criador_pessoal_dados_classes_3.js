(function () {
    const ability = (id, nome, custo, descricao, efeito) => ({ id, nome, custo, descricao, efeito });

    Object.assign(window.CRIADOR_CLASS_COMPENDIUM, {
        feiticeiro: {
            hp: 8,
            mp: 10,
            sp: 4,
            passivas: [
                "+2 Carisma a cada 10 niveis.",
                "Vantagem em criar magias ja vistas.",
                "Desvantagem em criar habilidades magicas novas e entender arcanismo."
            ],
            subclasses: {
                linhagem_draconica: {
                    nome: "Linhagem Draconica",
                    foco: "Dano elemental.",
                    efeitos: [
                        "+10% de dano em magias ofensivas do elemento escolhido.",
                        "Quando sofrer dano do proprio elemento, reduz 2 do dano recebido por instancia.",
                        "Se o alvo tiver Fraqueza Elemental ao seu elemento, adiciona +1d4 de dano extra a magia que o acertar, 1 vez por turno."
                    ]
                },
                sifonista_do_vazio: {
                    nome: "Sifonista do Vazio",
                    foco: "Sustain de MP.",
                    efeitos: [
                        "Ao causar dano com magia, recupera MP igual a 5% do MP gasto, minimo 1 e maximo 1 vez por turno.",
                        "Ao reduzir inimigo a 0 PV com magia, recupera 1% a 15% de MP conforme o porte do alvo.",
                        "+1 em testes de Concentracao enquanto mantiver uma magia ativa.",
                        "Na primeira vez em cada combate que gastar 25 MP ou mais de uma vez, ganha +3 PV temporarios por 1 turno."
                    ]
                },
                duelista_sortilego: {
                    nome: "Duelista Sortilego",
                    foco: "Corpo a corpo.",
                    efeitos: [
                        "+5% de dano em magias alvo unico ou ataques corpo a corpo com arma leve.",
                        "Apos acertar magia alvo unico, pode gastar mesmo custo em MP para fazer 1 ataque corpo a corpo como acao bonus com +1 no Acerto.",
                        "Se o alvo nao tiver aliados adjacentes, ganha +1 no Acerto contra ele.",
                        "Ganha proficiencia em armadura media."
                    ]
                }
            },
            abilities: {
                basico: [
                    ability("raio_arcano", "Raio Arcano", "6 MP", "2d6 dano arcano em 1 inimigo a ate 15 metros.", "Chance de causar -1 na resistencia magica do alvo por 1 turno (teste D100)."),
                    ability("explosao_de_energia", "Explosao de Energia", "15 MP", "3d8 magico em area de 3 metros, ate 3 inimigos em ate 20 metros.", "Empurra os alvos 2 metros para tras (teste D100)."),
                    ability("escudo_magico", "Escudo Magico", "5 MP", "Cria um escudo em si ou 1 aliado a ate 10 metros.", "Bloqueia ate 10 de dano por 2 turnos."),
                    ability("teleporte_instantaneo", "Teleporte Instantaneo", "6 MP", "Teleporta ate 10 metros para um local visivel, ignorando obstaculos fisicos.", "Reposicionamento."),
                    ability("estrondo_psiquico", "Estrondo Psiquico", "10 MP", "4d6 psiquico em ate 2 inimigos a ate 15 metros.", "Alvos ficam atordoados por 1 turno (teste D100).")
                ],
                intermediario: [
                    ability("furacao_arcano", "Furacao Arcano", "16 MP", "3d10 de vento magico em ate 3 inimigos a ate 20 metros.", "Reduz velocidade dos alvos em -3 metros por turno por 2 turnos."),
                    ability("prisao_de_energia", "Prisao de Energia", "18 MP", "Prende 1 inimigo a ate 20 metros dentro de uma jaula magica por 1 turno.", "Ele nao pode agir ou se mover (teste D100)."),
                    ability("invocacao_elemental", "Invocacao Elemental", "20 MP", "Invoca 1 elemental (fogo, agua ou terra) para lutar por 3 turnos.", "Ataque: 3d8 + Mod. Carisma.")
                ],
                avancado: [
                    ability("rajada_de_caos", "Rajada de Caos", "25 MP", "6d8 magico caotico em ate 4 inimigos a ate 25 metros.", "Aplica efeito aleatorio: -2 defesa, -2 ataque ou -2 resistencia por 2 turnos."),
                    ability("toque_etereo", "Toque Etereo", "28 MP", "5d10 espiritual em 1 inimigo tocado.", "Recupera metade do dano como HP."),
                    ability("barreira_arcana_feiticeiro", "Barreira Arcana", "30 MP", "Cria uma barreira protetora de 5 metros ao redor de ate 3 aliados.", "Bloqueia ate 40 de dano por 2 turnos.")
                ],
                mestre: [
                    ability("distorcao_da_realidade", "Distorcao da Realidade", "80 MP", "Cria um efeito caotico em area de 30 metros.", "Rolagem aleatoria: dano 10d10, cura 10d10, teleporte ou prisao magica por 1 turno."),
                    ability("tempestade_de_mana", "Tempestade de Mana", "45 MP", "8d10 em todos os inimigos em area de 25 metros.", "Reduz a resistencia magica em -3 por 2 turnos."),
                    ability("esfera_aniquiladora", "Esfera Aniquiladora", "50 MP", "10d12 em 1 alvo a ate 30 metros.", "Se o alvo cair a 0 HP, explode causando 6d8 em inimigos a 5 metros.")
                ],
                supremo: [
                    ability("chamado_abissal", "Chamado Abissal", "70 MP", "Invoca 2 demonios abissais por 3 turnos.", "Ataque: 8d8 + Mod. Carisma."),
                    ability("anel_de_desintegracao", "Anel de Desintegracao", "75 MP", "10d10 em area circular de 30 metros, atingindo ate 6 inimigos.", "Alvos perdem -4 defesa fisica por 2 turnos."),
                    ability("coracao_do_caos", "Coracao do Caos", "80 MP", "Por 3 turnos, todos os ataques do Feiticeiro causam +6d10 extra.", "Ignoram resistencia magica.")
                ],
                lendario: [
                    ability("o_fim_da_realidade", "O Fim da Realidade", "120 MP", "15d12 em todos os inimigos no campo, ate 50 metros.", "Alvos sobreviventes perdem metade do MP e SP."),
                    ability("ascensao_arcana_feiticeiro", "Ascensao Arcana", "130 MP", "Transforma-se em uma entidade magica por 3 turnos.", "Recebe +10 em todos os atributos, regenera 30 MP por turno e duplica o dano magico."),
                    ability("ressurreicao_caotica", "Ressurreicao Caotica", "140 MP", "Revive ate 4 aliados em ate 30 metros com metade do HP e MP.", "Concede +5 ataque e +5 resistencia por 2 turnos.")
                ]
            }
        },
        feiticeiro_espada: {
            hp: 10,
            mp: 7,
            sp: 7,
            passivas: [
                "Pode conjurar magias basicas enquanto segura arma de duas maos.",
                "+1 de dano magico para cada 5 niveis.",
                "+1 de dano fisico para cada 5 niveis."
            ],
            subclasses: {
                conjurador_da_lamina: {
                    nome: "Conjurador da Lamina",
                    foco: "Magia.",
                    efeitos: [
                        "+5% de dano em magias ofensivas enquanto empunhar uma arma corpo a corpo.",
                        "-1 MP em magias de toque ou imbuimento de arma.",
                        "Quando acertar uma magia, o proximo ataque corpo a corpo ate o fim do turno recebe +1 no Acerto.",
                        "Se lancar uma magia no turno, ganha +1 de Defesa/C.A. ate o proximo turno."
                    ]
                },
                lamina_vinculada: {
                    nome: "Lamina Vinculada",
                    foco: "Ataque fisico.",
                    efeitos: [
                        "+5% de dano corpo a corpo se a arma estiver imbuida ou se mantiver Concentracao.",
                        "Ao acertar ataque corpo a corpo, pode gastar 3 MP para causar +1d4 de dano elemental.",
                        "+1 no Acerto contra inimigos afetados por condicao aplicada por sua magia.",
                        "Se lancou magia no turno anterior, recebe +1 em testes de Concentracao neste turno."
                    ]
                },
                duelista_mistico: {
                    nome: "Duelista Mistico",
                    foco: "Hibrido.",
                    efeitos: [
                        "Apos lancar uma magia, o proximo ataque corpo a corpo no mesmo turno recebe +1 no Acerto e +1d4 de dano.",
                        "Ao acertar ataque corpo a corpo, a proxima magia ofensiva ate o fim do proximo turno tem -1 MP ou +5 no teste (D100).",
                        "Alternando entre magia e ataque em turnos consecutivos, ganha +4% de dano em ambos.",
                        "Ao consumir efeito de movimento ou teleporte curto, ganha +1 de Defesa/C.A. ate o proximo turno."
                    ]
                }
            },
            abilities: {
                basico: [
                    ability("golpe_arcano", "Golpe Arcano", "4 MP", "Dano de arma + 1d6 magico em 1 inimigo a ate 2 metros.", "Adiciona +1d6 se o inimigo estiver encantado."),
                    ability("lamina_flamejante", "Lamina Flamejante", "6 MP", "Dano de arma + 2d6 fogo em 1 inimigo a ate 2 metros.", "Aplica queimadura leve 1d4 por turno por 2 turnos (teste D100)."),
                    ability("escudo_energetico", "Escudo Energetico", "5 MP", "Concede +2 defesa magica e fisica por 1 turno a si mesmo.", "Buff defensivo."),
                    ability("empuxo_magico", "Empuxo Magico", "4 MP", "2d6 magico em 1 inimigo a ate 10 metros.", "Empurra o alvo 2 metros para tras (teste D100)."),
                    ability("resiliencia_arcana", "Resiliencia Arcana", "4 SP", "Recupera 1d8 HP + Modificador de Constituicao.", "So pode ser usado uma vez a cada 2 turnos.")
                ],
                intermediario: [
                    ability("impacto_runico", "Impacto Runico", "10 MP", "Dano de arma + 3d6 magico em 1 inimigo a ate 2 metros.", "Reduz a resistencia magica do alvo em -1 por 1 turno."),
                    ability("corte_relampejante", "Corte Relampejante", "12 SP", "Dano de arma + 3d6 eletrico em ate 2 inimigos adjacentes.", "Atinge dois inimigos colados."),
                    ability("bencao_da_lamina", "Bencao da Lamina", "8 MP", "Por 2 turnos, todos os ataques com arma causam +1d6 dano magico adicional.", "Imbuimento.")
                ],
                avancado: [
                    ability("rajada_flamejante", "Rajada Flamejante", "20 MP", "4d8 fogo em ate 3 inimigos a ate 15 metros.", "Explosao de fogo."),
                    ability("armadura_arcana_feiticeiro_espada", "Armadura Arcana", "18 MP", "Por 2 turnos, reduz em 50% o dano magico recebido.", "Mitigacao mistica."),
                    ability("combinacao_impecavel", "Combinacao Impecavel", "20 SP + 10 MP", "Dano de arma + 5d6 magico em 1 inimigo a ate 3 metros.", "Se acertar, o proximo ataque corpo a corpo nao gasta SP.")
                ],
                mestre: [
                    ability("espada_astral", "Espada Astral", "35 MP", "6d8 magico fisico em ate 3 inimigos a ate 3 metros.", "Ignora resistencias medias."),
                    ability("pulso_elemental", "Pulso Elemental", "40 MP", "5d10 de fogo, gelo ou eletrico em todos os inimigos numa area de 10 metros a ate 25 metros.", "Aplica queimadura, lentidao ou paralisia leve."),
                    ability("resistencia_runica", "Resistencia Runica", "30 MP", "Por 3 turnos, recebe +3 defesa fisica, +3 defesa magica e imunidade a empurrao ou derrubada.", "Postura runica.")
                ],
                supremo: [
                    ability("tempestade_arcana_feiticeiro_espada", "Tempestade Arcana", "60 MP", "8d10 magico em ate 5 inimigos a ate 30 metros.", "Reduz resistencia magica dos alvos em -3 por 2 turnos."),
                    ability("espada_da_fenix", "Espada da Fenix", "65 MP + 30 SP", "Dano de arma + 10d8 fogo em 1 inimigo a ate 3 metros.", "Se acertar, recupera 20% do HP."),
                    ability("corte_do_vazio", "Corte do Vazio", "70 MP", "12d8 sombrio em 1 inimigo a ate 25 metros.", "Chance de silenciar o alvo por 1 turno (teste D100).")
                ],
                lendario: [
                    ability("golpe_do_eclipse", "Golpe do Eclipse", "120 MP + 60 SP", "15d10 magico fisico em todos os inimigos num raio de 20 metros.", "Aplica -4 defesa por 2 turnos."),
                    ability("avatar_arcano_feiticeiro_espada", "Avatar Arcano", "130 MP", "Por 3 turnos, todos os ataques causam +8d10 dano magico.", "Defesa fisica e magica aumentam +10 e regenera 20 MP por turno."),
                    ability("renovacao_elemental", "Renovacao Elemental", "140 MP", "Cura todos os aliados a ate 30 metros em 6d10 HP.", "Remove efeitos negativos.")
                ]
            }
        },
        guerreiro: {
            hp: 14,
            mp: 4,
            sp: 6,
            passivas: [
                "Escolher proficiencia em uma categoria de armadura (Leve, Media ou Pesada).",
                "+1 de dano em uma categoria de arma (Pequenas, Mistas ou Grandes)."
            ],
            subclasses: {
                lamina_de_batalha: {
                    nome: "Lamina de Batalha",
                    foco: "Dano.",
                    efeitos: [
                        "+10% de dano em ataques corpo a corpo com armas marciais.",
                        "Se nao se deslocar no turno antes de atacar, ganha +1 no Acerto corpo a corpo.",
                        "1 vez por turno, apos um inimigo atacar, pode sacrificar uma acao do proximo turno para tentar ataca-lo.",
                        "-5% de custo em SP em habilidades de golpe unico corpo a corpo."
                    ]
                },
                muralha_de_ferro: {
                    nome: "Muralha de Ferro",
                    foco: "Tanque.",
                    efeitos: [
                        "-5% de dano fisico recebido enquanto empunhar escudo ou vestir armadura media/pesada.",
                        "Reacao para reduzir dano em 1d4 + 10% do Mod. de Constituicao em aliado adjacente.",
                        "Se nao correr nem investir, ganha +1 de Defesa/C.A. ate o proximo turno.",
                        "Vantagem contra empurrao e derrubar; ao passar no teste, pode gastar 1 SP para nao ser deslocado."
                    ]
                }
            },
            abilities: {
                basico: [
                    ability("ataque_imparavel", "Ataque Imparavel", "6 SP", "Dano de arma + 1d6 em 1 inimigo a ate 2 metros.", "Se acertar, proximo ataque tem vantagem."),
                    ability("cortar_defesa", "Cortar Defesa", "6 SP", "Dano de arma + 1d6 em 1 inimigo a ate 2 metros.", "Ignora escudo do alvo se o resultado ficar ate 3 pontos abaixo da C.A."),
                    ability("golpe_poderoso", "Golpe Poderoso", "2 SP", "Dano de arma + 1d4 em 1 inimigo a ate 2 metros.", "Pode ser usado como reacao quando for atacado."),
                    ability("formacao_defensiva", "Formacao Defensiva", "5 SP", "Concede +1 resistencia fisica e magica por 2 turnos ao guerreiro e ate 2 aliados adjacentes.", "Postura defensiva."),
                    ability("investida_poderosa", "Investida Poderosa", "4 SP", "Dano de arma + 1d8 em 1 inimigo a ate 4 metros, avancando ate ele.", "Se acertar, empurra o alvo 1 metro para tras (teste D100).")
                ],
                intermediario: [
                    ability("golpe_relampago", "Golpe Relampago", "12 SP", "Dano de arma + 2d6 em 2 inimigos adjacentes dividindo o dano.", "Pode atacar os dois com apenas uma acao."),
                    ability("esmagamento_decisivo", "Esmagamento Decisivo", "12 SP", "Dano de arma + 2d6 em 1 inimigo a ate 2 metros.", "Reduz a defesa do alvo em -1 por 1 turno."),
                    ability("postura_de_ferro", "Postura de Ferro", "15 SP", "O guerreiro recebe -50% de dano fisico por 2 turnos.", "Nao pode se mover nesse tempo.")
                ],
                avancado: [
                    ability("furia_determinada", "Furia Determinada", "20 SP", "Dano de arma + 2d8 em 1 inimigo a ate 2 metros.", "Se reduzir o alvo a 0 HP, ganha +1 ataque extra no turno."),
                    ability("investida_quebradora", "Investida Quebradora", "25 SP", "Dano de arma + 3d8 em 1 inimigo a ate 5 metros, avancando ate ele.", "Quebra armadura leve e media, aplicando -2 defesa fisica por 2 turnos."),
                    ability("barreira_de_aco", "Barreira de Aco", "22 SP", "Cria uma defesa em area de 2 metros ao redor.", "Aliados adjacentes ganham +3 resistencia fisica por 2 turnos.")
                ],
                mestre: [
                    ability("assalto_mortal", "Assalto Mortal", "35 SP", "Dano de arma + 5d10 em 1 inimigo a ate 3 metros.", "Se causar golpe critico, ignora totalmente a armadura do alvo."),
                    ability("muralha_imovel", "Muralha Imovel", "40 SP", "Torna-se imune a empurroes, derrubadas e efeitos de controle por 3 turnos.", "Ainda pode atacar normalmente."),
                    ability("corte_giratorio", "Corte Giratorio", "38 SP", "Dano de arma + 4d10 em ate 4 inimigos dividindo o dano ao redor, em area de 2 metros.", "Aplica sangramento 2d6 por turno por 2 turnos (teste D100).")
                ],
                supremo: [
                    ability("golpe_de_ruptura", "Golpe de Ruptura", "60 SP", "8d10 esmagador em 1 inimigo a ate 4 metros.", "Se atingir, o alvo e derrubado e perde 1 turno (teste D100)."),
                    ability("chamada_do_campeao", "Chamada do Campeao", "65 SP", "Todos os aliados a ate 10 metros recebem +4 ataque e +3 resistencia por 3 turnos.", "Buff marcial."),
                    ability("furia_sangrenta_guerreiro", "Furia Sangrenta", "70 SP", "Dano de arma + 10d8 em 1 inimigo a ate 3 metros.", "O guerreiro se cura em metade do dano causado.")
                ],
                lendario: [
                    ability("ruptura_final", "Ruptura Final", "120 SP", "12d12 em 1 inimigo a ate 5 metros.", "Se o golpe finalizar o alvo, causa explosao de 6d10 em inimigos adjacentes."),
                    ability("gloria_imortal", "Gloria Imortal", "130 SP", "Por 3 turnos, o guerreiro nao pode ser reduzido abaixo de 1 HP.", "Ganha +10 em todos os testes de ataque e defesa."),
                    ability("exercito_de_aco", "Exercito de Aco", "140 SP", "Invoca 4 copias espectrais do guerreiro, cada uma atacando um inimigo diferente em ate 10 metros.", "Cada ataque: dano de arma + 6d10.")
                ]
            }
        }
    });
}());
