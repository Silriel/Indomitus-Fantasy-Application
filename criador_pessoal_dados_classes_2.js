(function () {
    const ability = (id, nome, custo, descricao, efeito) => ({ id, nome, custo, descricao, efeito });

    Object.assign(window.CRIADOR_CLASS_COMPENDIUM, {
        cavaleiro_sangue: {
            hp: 16,
            mp: 4,
            sp: 4,
            passivas: [
                "Hemomancia.",
                "+1 de dano fisico para cada 10% de HP perdido.",
                "Quando derrota um inimigo, recupera 10% do HP maximo."
            ],
            subclasses: {
                lamina_carmesim: {
                    nome: "Lamina Carmesim",
                    foco: "Dano.",
                    efeitos: [
                        "+5% de dano corpo a corpo contra inimigos.",
                        "No mesmo turno em que aplicar Sangramento, ataques seguintes recebem +1 no Acerto (d20).",
                        "Ruptura Sangrenta: 1 vez por turno, ao consumir Sangramento, causa +1d4 de dano extra."
                    ]
                },
                vinculo_hematico: {
                    nome: "Vinculo Hematico",
                    foco: "Sustain.",
                    efeitos: [
                        "Roubo de Vida leve: cura 1% do dano corpo a corpo causado; 6% se o alvo tiver Sangramento aplicado por voce.",
                        "Vitalidade Coagulada: ao aplicar Sangramento pela primeira vez no turno, ganha +2 PV temporarios, acumulando ate +6.",
                        "Hemostase Instintiva: na primeira vez em cada combate que cair para 25% de Vida ou menos, recebe +2 de Defesa/C.A. ate o proximo turno."
                    ]
                }
            },
            abilities: {
                basico: [
                    ability("golpe_sanguinario", "Golpe Sanguinario", "10% HP", "Dano de arma + 2d6 em 1 inimigo a ate 2 metros.", "Se acertar, recupera metade do HP gasto."),
                    ability("lamina_vampirica", "Lamina Vampirica", "15% HP", "Dano de arma + 2d8 em 1 inimigo a ate 2 metros.", "Cura o Cavaleiro em 1d8 + Modificador de Forca."),
                    ability("aura_sangrenta", "Aura Sangrenta", "5% HP por turno", "Aliados a ate 5 metros ganham +1 ataque e +1 defesa enquanto a aura estiver ativa.", "Dura no maximo 3 turnos."),
                    ability("corrente_rubra", "Corrente Rubra", "8% HP", "2d6 magico em ate 2 inimigos a ate 10 metros.", "Reduz defesa dos alvos em -1 por 1 turno."),
                    ability("marca_do_sacrificio", "Marca do Sacrificio", "12% HP", "Marca 1 inimigo a ate 10 metros por 2 turnos.", "Todos os ataques contra ele causam +2d6 extra.")
                ],
                intermediario: [
                    ability("estouro_de_sangue", "Estouro de Sangue", "20% HP", "4d8 magico em ate 3 inimigos a ate 15 metros.", "Alvos podem ficar atordoados por 1 turno."),
                    ability("lamina_carmesim_habilidade", "Lamina Carmesim", "25% HP", "Dano de arma + 5d6 em 1 inimigo a ate 2 metros.", "Ignora armadura."),
                    ability("manto_de_sangue", "Manto de Sangue", "10% HP por turno", "Reduz todo dano recebido em 50% por 2 turnos.", "Defesa sustentada.")
                ],
                avancado: [
                    ability("oferenda_rubra", "Oferenda Rubra", "30% HP", "Cura ate 3 aliados dividindo a cura, a ate 10 metros, em 5d8 + Mod. Carisma.", "Suporte hematico."),
                    ability("colheita_sangrenta", "Colheita Sangrenta", "35% HP", "6d8 em area de 3 metros, ate 4 inimigos dividindo o dano, a ate 15 metros.", "Recupera metade do HP gasto."),
                    ability("escravo_de_sangue", "Escravo de Sangue", "28% HP", "Invoca uma criatura de sangue por 3 turnos.", "Ataque 4d10 + Mod. Forca; absorve ate 20 de dano por turno.")
                ],
                mestre: [
                    ability("tempestade_vermelha", "Tempestade Vermelha", "50% HP", "8d10 magico em todos os inimigos dividindo o dano, a ate 20 metros.", "Reduz ataque deles em -3 por 2 turnos."),
                    ability("exilio_vital", "Exilio Vital", "40% HP", "Rouba 6d10 de HP de ate 3 inimigos a ate 20 metros.", "Distribui igualmente entre os aliados."),
                    ability("cavaleiro_imortal", "Cavaleiro Imortal", "45% HP", "Por 2 turnos, nao pode ser reduzido abaixo de 1 HP.", "Ataques causam +5d10 extra.")
                ],
                supremo: [
                    ability("golpe_da_ruina", "Golpe da Ruina", "60% HP", "12d10 fisico em 1 inimigo a ate 3 metros.", "Se eliminar o alvo, recupera todo o HP perdido no custo."),
                    ability("corte_de_hemomancia", "Corte de Hemomancia", "55% HP", "10d10 magico cortante em ate 5 inimigos a ate 25 metros.", "Aplica sangramento 2d8 por turno por 2 turnos (teste D100)."),
                    ability("dominio_sangrento", "Dominio Sangrento", "70% HP", "Por 3 turnos, todos os aliados ganham +6 ataque, +5 defesa e regeneracao de 4d10 HP por turno.", "Aura de supremacia.")
                ],
                lendario: [
                    ability("avatar_carmesim", "Avatar Carmesim", "80% HP", "Por 3 turnos, o Cavaleiro recebe +10 em todos os atributos.", "Todos os ataques se tornam criticos automaticos."),
                    ability("colheita_final", "Colheita Final", "90% HP", "15d12 magico fisico em todos os inimigos no campo, ate 50 metros.", "Cura o Cavaleiro em 50% do dano total causado."),
                    ability("ascensao_de_sangue", "Ascensao de Sangue", "HP total, deixando com 1 HP", "Ressuscita ate 4 aliados caidos a ate 30 metros com HP e SP totais.", "Concede +10 ataque e +10 defesa a todos por 3 turnos.")
                ]
            }
        },
        clerigo: {
            hp: 12,
            mp: 6,
            sp: 4,
            passivas: [
                "Arcanismo.",
                "Religiao."
            ],
            subclasses: {
                mao_benevolente: {
                    nome: "Mao Benevolente",
                    foco: "Cura.",
                    efeitos: [
                        "+10% em curas de magias e oracoes do Clerigo.",
                        "Cura excedente vira Escudo de ate 5% da Vida Maxima por 1 turno.",
                        "Magias de cura alvo unico dao 10% da cura para um alvo adjacente.",
                        "Ao erguer uma criatura em 0 PV, ela ganha +1 em testes de Concentracao ate o proximo turno."
                    ]
                },
                muralha_sagrada: {
                    nome: "Muralha Sagrada",
                    foco: "Tank.",
                    efeitos: [
                        "-10% de dano fisico e elemental recebido enquanto empunhar escudo ou mantiver Concentracao em magia de protecao.",
                        "Reacao de reduzir dano em 1d4 + 10% do Mod. de Sabedoria em aliado adjacente.",
                        "+1 de Defesa/C.A. se estiver com armadura leve ou media e nao tiver sido derrubado no turno.",
                        "Vantagem em testes de Concentracao para magias de protecao."
                    ]
                }
            },
            abilities: {
                basico: [
                    ability("chuva_de_bencaos", "Chuva de Bencaos", "6 MP", "Cura 1 aliado a ate 5 metros com 2d6 + Modificador de Forca de vontade.", "Curacao simples."),
                    ability("toque_curativo", "Toque Curativo", "4 MP", "Cura 1 aliado tocado em 2d8 + Modificador de Forca de vontade.", "Adjacente."),
                    ability("luz_purificadora", "Luz Purificadora", "9 MP", "3d6 sagrado em ate 2 inimigos dividindo dano, a ate 10 metros.", "Cura aliados proximos ao alvo em 1d6."),
                    ability("escudo_divino", "Escudo Divino", "6 MP", "Cria uma barreira em 1 aliado a ate 5 metros.", "Bloqueia ate 10 de dano por 1 turno."),
                    ability("selo_de_repulsao", "Selo de Repulsao", "8 MP", "Empurra ate 2 inimigos em ate 5 metros.", "Afasta 3 metros e aplica -1 em ataques no proximo turno.")
                ],
                intermediario: [
                    ability("restauracao_espiritual", "Restauracao Espiritual", "12 MP", "Cura ate 3 aliados dividindo a cura a ate 10 metros com 3d8 + Modificador de Forca de vontade.", "Cura em grupo."),
                    ability("martelo_da_fe", "Martelo da Fe", "14 MP", "4d8 dano divino em 1 inimigo a ate 15 metros.", "Se atingir, reduz defesa magica do inimigo em -2 por 2 turnos."),
                    ability("abencoar_guerreiros", "Abencoar Guerreiros", "15 MP", "Ate 3 aliados em ate 10 metros recebem +2 ataque e +1 resistencia fisica por 3 turnos.", "Bencao ofensiva.")
                ],
                avancado: [
                    ability("convocacao_celestial", "Convocacao Celestial", "20 MP", "4d10 dano celestial em ate 3 inimigos a ate 20 metros.", "Cria um guardiao celeste por 2 turnos com ataque 2d6 + Mod. Forca de vontade."),
                    ability("lanca_de_luz", "Lanca de Luz", "22 MP", "5d10 dano sagrado perfurante em linha reta de 20 metros, atingindo ate 3 inimigos alinhados.", "Ataque em linha."),
                    ability("renovacao_total", "Renovacao Total", "25 MP", "Cura ate 3 aliados a ate 15 metros em 5d8 + Modificador de Forca de vontade.", "Remove efeitos negativos.")
                ],
                mestre: [
                    ability("esmagamento_divino", "Esmagamento Divino", "35 MP", "7d10 dano divino em 1 inimigo a ate 25 metros.", "Se atingir, atordoa o inimigo por 1 turno."),
                    ability("coro_de_anjos", "Coro de Anjos", "40 MP", "Aliados em ate 20 metros recebem +3 ataque, +3 defesa magica e +2d8 cura por turno por 3 turnos.", "Buff celestial."),
                    ability("selo_da_redencao", "Selo da Redencao", "38 MP", "Protege todos os aliados em ate 20 metros, prevenindo a morte uma vez por 2 turnos.", "Ao chegar a 0 HP, ficam em 1 HP.")
                ],
                supremo: [
                    ability("explosao_celestial", "Explosao Celestial", "55 MP", "10d10 dano sagrado em ate 5 inimigos a ate 30 metros.", "Aplica queimadura sagrada 2d6 por turno por 2 turnos."),
                    ability("manto_divino", "Manto Divino", "60 MP", "Aliados em ate 25 metros recebem escudo que absorve ate 50 de dano por 3 turnos.", "Grande protecao."),
                    ability("ressurreicao_em_massa", "Ressurreicao em Massa", "70 MP", "Revive ate 3 aliados caidos em ate 20 metros com metade do HP.", "Remove debuffs negativos.")
                ],
                lendario: [
                    ability("juizo_final", "Juizo Final", "100 MP", "12d12 dano sagrado em todos os inimigos no campo de batalha, ate 50 metros.", "Reduz defesa deles em -4 por 2 turnos."),
                    ability("milagre_supremo_clerigo", "Milagre Supremo", "110 MP", "Todos os aliados em campo sao curados totalmente, recuperam SP e MP em 50%.", "Ganham +5 ataque e +5 resistencia por 3 turnos."),
                    ability("avatar_da_luz", "Avatar da Luz", "120 MP", "O Clerigo assume a forma de um avatar divino por 3 turnos, recebendo +10 em todos os atributos.", "Aumenta o dano magico em +6d10 e cura aliados adjacentes ao atacar.")
                ]
            }
        },
        druida: {
            hp: 10,
            mp: 8,
            sp: 4,
            passivas: [
                "Arcanismo.",
                "Natureza.",
                "Sobrevivencia."
            ],
            subclasses: {
                ira_das_estacoes: {
                    nome: "Ira das Estacoes",
                    foco: "Dano elemental.",
                    efeitos: [
                        "+10% de dano em magias ofensivas de natureza.",
                        "Se a magia atingir pelo menos 2 alvos, causa +1d4 adicional a um deles, 1 vez por turno.",
                        "-1 de custo em magias ofensivas de alcance medio ou curto.",
                        "Na primeira magia ofensiva que acertar no turno, ganha +1 no Acerto para a proxima magia."
                    ]
                },
                fera_ancestral: {
                    nome: "Fera Ancestral",
                    foco: "Transformacao.",
                    efeitos: [
                        "+10% de dano corpo a corpo enquanto Transformado.",
                        "Primeiro ataque corpo a corpo que acertar enquanto Transformado adiciona +1d4 de dano.",
                        "Ao ser derrubado em forma animalesca, volta desacordado em sua forma base.",
                        "Se derrubar um inimigo enquanto Transformado, recebe +1 no Acerto contra ele ate o proximo turno."
                    ]
                },
                seiva_restauradora: {
                    nome: "Seiva Restauradora",
                    foco: "Cura.",
                    efeitos: [
                        "+10% de cura em magias e restauracoes do Druida.",
                        "Cura excedente vira Escudo de ate 5% da Vida Maxima do alvo por 1 turno.",
                        "Curas ao longo do tempo duram +1 turno ou curam +1 dado na aplicacao final.",
                        "Magias de cura alvo unico ganham +1 de alcance."
                    ]
                }
            },
            abilities: {
                basico: [
                    ability("eco_da_floresta", "Eco da Floresta", "6 MP", "Confunde ate 2 inimigos em ate 10 metros.", "Eles sofrem -2 ataque e -2 defesa por 2 turnos (teste D100)."),
                    ability("forma_selvagem_pequena", "Forma Selvagem", "5 MP 5 SP", "Transforma-se em animal pequeno: cao, pombo, gato ou tartaruga.", "Escolhe entre terrestre agil, resistente ou voador com ajustes descritos."),
                    ability("raizes_entrelacadas", "Raizes Entrelacadas", "6 MP", "2d6 de dano fisico em ate 2 inimigos a ate 10 metros.", "Imobiliza os alvos por 1 turno (teste D100)."),
                    ability("toque_da_natureza", "Toque da Natureza", "8 MP", "Cura 1 aliado tocado em 1d8 + Modificador de Forca de Vontade.", "Cura adjacente."),
                    ability("invocacao_animal", "Invocacao Animal", "8 MP", "Invoca 1 animal companheiro (lobo ou aguia) por 3 turnos.", "Ataque: 1d8 + Mod. Forca de vontade.")
                ],
                intermediario: [
                    ability("tempestade_de_folhas", "Tempestade de Folhas", "12 MP", "3d8 cortante em ate 3 inimigos a ate 15 metros.", "Reduz a velocidade dos alvos em -2 metros por turno por 2 turnos."),
                    ability("chicote_de_vinhas", "Chicote de Vinhas", "14 MP", "4d8 em 1 inimigo a ate 15 metros.", "Puxa o inimigo 3 metros para perto e aplica -1 defesa no proximo turno."),
                    ability("aura_da_vida_selvagem", "Aura da Vida Selvagem", "15 MP", "Aliados em ate 10 metros recebem +2 resistencia e regeneram 1d6 HP por turno por 3 turnos.", "Aura de vigor.")
                ],
                avancado: [
                    ability("furia_da_tempestade", "Furia da Tempestade", "20 MP", "4d10 eletrico em ate 3 inimigos a ate 20 metros.", "Aplica eletrificacao 1d6 por turno por 2 turnos."),
                    ability("armadura_de_casca", "Armadura de Casca", "22 MP", "Cria armadura natural em ate 3 aliados a ate 15 metros.", "Aumenta +3 resistencia fisica por 3 turnos."),
                    ability("chamada_das_feras", "Chamada das Feras", "25 MP", "Invoca 2 animais ferozes (urso ou leao) para lutar por 3 turnos.", "Ataque: 2d8 + Mod. Sabedoria."),
                    ability("forma_selvagem_melhorada", "Forma Selvagem Melhorada", "20 MP 20 SP", "Transforma-se em animal medio: urso, lobo, tigre ou harpia.", "Escolhe entre terrestre agil, resistente ou voador com ajustes descritos.")
                ],
                mestre: [
                    ability("terremoto_primordial", "Terremoto Primordial", "35 MP", "5d10 sismico em ate 5 inimigos a ate 25 metros.", "Derruba os inimigos automaticamente."),
                    ability("guardiao_ancestral", "Guardiao Ancestral", "38 MP", "Invoca um espirito protetor que reduz todo dano recebido pelos aliados em ate 10 metros em 50% por 2 turnos.", "Protecao espiritual."),
                    ability("renovacao_selvagem", "Renovacao Selvagem", "40 MP", "Cura todos os aliados em ate 15 metros com 6d8 + Modificador de Forca de Vontade.", "Remove todos os efeitos negativos.")
                ],
                supremo: [
                    ability("colheita_mortal", "Colheita Mortal", "55 MP", "8d10 venenoso em ate 6 inimigos a ate 30 metros.", "Aplica veneno 2d6 por turno por 3 turnos (teste D100)."),
                    ability("manto_da_floresta_eterna", "Manto da Floresta Eterna", "60 MP", "Aliados em ate 25 metros ganham +4 resistencia magica e fisica, e regeneracao de 2d6 HP por turno por 3 turnos.", "Aura ancestral."),
                    ability("chamado_do_antigo", "Chamado do Antigo", "65 MP", "Invoca um grande espirito da natureza (ent ou elemental) por 3 turnos.", "Ataque: 6d10 + Mod. Sabedoria."),
                    ability("forma_selvagem_grande", "Forma Selvagem", "50 MP 50 SP", "Transforma-se em animal grande: elefante, hipopotamo, dinossauro ou pterossauridio.", "Escolhe entre terrestre agil, resistente ou voador com ajustes descritos.")
                ],
                lendario: [
                    ability("tempestade_da_criacao", "Tempestade da Criacao", "100 MP", "12d12 misturado (vento, raio, terra) em todos os inimigos no campo ate 50 metros.", "Reduz defesa em -5 por 2 turnos."),
                    ability("coracao_da_floresta", "Coracao da Floresta", "110 MP", "Todos os aliados em ate 50 metros recuperam totalmente HP, SP e MP.", "Recebem +5 ataque por 3 turnos."),
                    ability("avatar_da_natureza", "Avatar da Natureza", "120 MP", "O druida torna-se um avatar colossal da natureza por 3 turnos.", "Recebe +10 em todos os atributos e causa +8d10 em todos os ataques.")
                ]
            }
        }
    });
}());
