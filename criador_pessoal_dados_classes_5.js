(function () {
    const ability = (id, nome, custo, descricao, efeito) => ({ id, nome, custo, descricao, efeito });

    Object.assign(window.CRIADOR_CLASS_COMPENDIUM, {
        necromante: {
            hp: 8,
            mp: 12,
            sp: 4,
            passivas: [
                "Arcanismo.",
                "Religiao.",
                "Dominio em Magia das Trevas."
            ],
            subclasses: {
                senhor_dos_tumulos: {
                    nome: "Senhor dos Tumulos",
                    foco: "Invocacao.",
                    efeitos: [
                        "+1 no limite de lacaios ativos invocados por suas magias.",
                        "+5% de dano causado pelos lacaios.",
                        "-5% MP ao invocar ou reativar um lacaio que voce ja controlou no combate, 1 vez por turno.",
                        "Se voce acertar magia necromantica em um alvo, um lacaio recebe +1 no Acerto contra esse alvo ate o fim do turno.",
                        "Quando lacaio atingir um alvo com Maldicao sua, adiciona +1d4 de dano necrotico 1 vez por turno.",
                        "Lacaios reduzem 1 do dano de area recebido por instancia."
                    ]
                },
                arquiteto_do_breu: {
                    nome: "Arquiteto do Breu",
                    foco: "Magia.",
                    efeitos: [
                        "+10% de dano em magias necromanticas ou ofensivas sombrias.",
                        "1 vez por turno, se o alvo estiver Amaldicoado, Aterrorizado ou Sangrando, sua magia ofensiva causa +1d4 de dano necrotico.",
                        "Cura 5% do dano necrotico causado pelas magias, ate 10% da Vida Maxima por turno.",
                        "-1 MP em magias necromanticas com Concentracao.",
                        "Na primeira vez em cada combate que reduzir inimigo a 0 PV com magia necromantica, recupera 2 MP."
                    ]
                }
            },
            abilities: {
                basico: [
                    ability("toque_funebre", "Toque Funebre", "6 MP", "2d6 necrotico em 1 inimigo a ate 10 metros.", "Cura o necromante em metade do dano causado."),
                    ability("levantar_esqueleto", "Levantar Esqueleto", "8 MP", "Levanta 1 esqueleto para lutar por 3 turnos.", "Ataque: 2d8 + Mod. Inteligencia; reduz 5 de dano recebido."),
                    ability("olhar_da_morte", "Olhar da Morte", "5 MP", "Marca 1 inimigo a ate 15 metros.", "Proximo ataque magico contra ele causa +2d6 adicional."),
                    ability("sussurros_sombrios", "Sussurros Sombrios", "6 MP", "3d6 mental em ate 2 inimigos a ate 15 metros.", "Se falharem no teste, ficam atordoados por 1 turno."),
                    ability("armadilha_de_ossos", "Armadilha de Ossos", "8 MP", "2d8 fisico em area de 2 metros, ate 2 inimigos a ate 10 metros.", "Imobiliza por 1 turno (teste D100).")
                ],
                intermediario: [
                    ability("explosao_cadaverica", "Explosao Cadaverica", "14 MP", "4d8 necrotico em area de 3 metros, ate 3 inimigos a ate 20 metros.", "Reduz resistencia fisica dos alvos em -2 por 2 turnos."),
                    ability("levantar_zumbi", "Levantar Zumbi", "16 MP", "Levanta 1 zumbi por 3 turnos.", "Ataque: 3d10 + Mod. Inteligencia; absorve 10 de dano recebido."),
                    ability("roubo_de_alma", "Roubo de Alma", "15 MP", "5d6 espiritual em 1 inimigo a ate 15 metros.", "Recupera HP e MP equivalentes a metade do dano.")
                ],
                avancado: [
                    ability("exercito_de_mortos", "Exercito de Mortos", "30 MP", "Invoca ate 3 esqueletos ou 2 zumbis para lutar por 3 turnos.", "Multiplica servos."),
                    ability("correntes_de_sangue", "Correntes de Sangue", "28 MP", "5d8 necrotico em ate 4 inimigos a ate 20 metros.", "Reduz velocidade dos alvos em -3 metros por 2 turnos."),
                    ability("maldicao_do_crepusculo", "Maldicao do Crepusculo", "25 MP", "Aplica maldicao em ate 3 inimigos a ate 15 metros.", "Eles sofrem -3 ataque e -3 defesa por 2 turnos.")
                ],
                mestre: [
                    ability("avatar_das_sombras", "Avatar das Sombras", "50 MP", "Por 2 turnos, o necromante recebe +5 ataque magico e +5 defesa.", "Todos os ataques drenam 50% do dano em HP."),
                    ability("peste_negra", "Peste Negra", "55 MP", "8d10 venenoso/necrotico em todos os inimigos numa area de 10 metros a ate 30 metros.", "Alvos sofrem -4 resistencia por 2 turnos."),
                    ability("levantamento_massivo", "Levantamento Massivo", "60 MP", "Levanta ate 5 esqueletos ou 3 zumbis por 3 turnos.", "Marcha dos mortos.")
                ],
                supremo: [
                    ability("tempestade_sombria", "Tempestade Sombria", "75 MP", "10d10 magico sombrio em todos os inimigos em area de 20 metros a ate 40 metros.", "Aplica cegueira por 1 turno (teste D100)."),
                    ability("corrupcao_absoluta", "Corrupcao Absoluta", "80 MP", "12d8 espiritual em ate 5 inimigos a ate 30 metros.", "Alvos atingidos nao podem se curar por 2 turnos."),
                    ability("mestre_dos_mortos", "Mestre dos Mortos", "85 MP", "Por 3 turnos, todos os mortos-vivos invocados ganham +5d10 de dano.", "Tambem resistem a dano magico.")
                ],
                lendario: [
                    ability("apocalipse_dos_mortos", "Apocalipse dos Mortos", "200 MP", "15d12 magico sombrio em todos os inimigos no campo, ate 50 metros.", "Todos os inimigos perdem metade do MP e SP por 2 turnos."),
                    ability("chamado_do_lich_supremo", "Chamado do Lich Supremo", "130 MP", "Invoca o Lich Supremo por 3 turnos.", "Ataque: 12d12 + Mod. Inteligencia; absorve ate 100 de dano por turno."),
                    ability("ressurreicao_sombria", "Ressurreicao Sombria", "140 MP", "Revive ate 4 aliados mortos como espectros poderosos por 3 turnos.", "Ataque: 8d10 + Mod. Inteligencia; ignoram resistencia fisica e magica.")
                ]
            }
        },
        paladino: {
            hp: 12,
            mp: 6,
            sp: 6,
            passivas: [
                "Medicina.",
                "Proficiencia em Armadura Pesada.",
                "Religiao."
            ],
            subclasses: {
                cruzado_luminar: {
                    nome: "Cruzado Luminar",
                    foco: "Dano.",
                    efeitos: [
                        "+5% de dano em ataques corpo a corpo enquanto a arma estiver consagrada ou voce mantiver uma bencao ativa.",
                        "1 vez por turno, ao acertar ataque corpo a corpo, pode gastar 3 MP para causar +1d6 de dano radiante.",
                        "+1 no Acerto contra inimigos marcados por sua Marca ou Condenacao Sagrada.",
                        "-10% MP em habilidades de Golpe Sagrado."
                    ]
                },
                guardiao_consagrado: {
                    nome: "Guardiao Consagrado",
                    foco: "Tanque.",
                    efeitos: [
                        "-10% de dano fisico recebido enquanto empunhar escudo ou mantiver Concentracao em magia de protecao.",
                        "Reacao 1 vez por turno: quando um aliado adjacente sofrer dano, reduza em 1d6 + metade do Mod. de Carisma.",
                        "Voce e aliados adjacentes tem +1% em testes contra Medo e Encantamento.",
                        "Se nao correr nem investir, ganha +1 de Defesa/C.A. ate o proximo turno."
                    ]
                },
                mao_da_redencao: {
                    nome: "Mao da Redencao",
                    foco: "Cura e suporte.",
                    efeitos: [
                        "+10% de cura em magias e poderes de restauracao do Paladino.",
                        "Cura excedente vira Escudo de ate 5% da Vida Maxima do alvo por 1 turno.",
                        "1 vez por turno, ao curar um aliado com 25% ou menos de Vida, ele recebe +5% do heal ate o inicio do proximo turno.",
                        "Curas alvo unico ganham +1 de alcance."
                    ]
                }
            },
            abilities: {
                basico: [
                    ability("aura_protetora", "Aura Protetora", "6 MP", "Cria uma aura de 5 metros ao redor, concedendo +2 resistencia fisica e magica a si mesmo e aliados por 2 turnos.", "Protecao em area."),
                    ability("cura_radiante", "Cura Radiante", "9 MP", "Cura 1 aliado a ate 5 metros em 2d8 + Modificador de Carisma.", "Luz restauradora."),
                    ability("fe_inabalavel", "Fe Inabalavel", "6 MP", "Concede resistencia contra efeitos negativos a si mesmo por 2 turnos.", "Imunidade a medo, confusao e envenenamento."),
                    ability("martelo_divino", "Martelo Divino", "8 MP", "2d8 dano divino em 1 inimigo a ate 10 metros.", "Chance de derrubar o alvo (teste D100)."),
                    ability("justica_divina", "Justica Divina", "10 MP", "Dano de arma + 2d8 em 1 inimigo adjacente.", "Proximo ataque contra o mesmo alvo ganha +1d8 extra.")
                ],
                intermediario: [
                    ability("luz_purificadora_paladino", "Luz Purificadora", "12 MP", "3d6 sagrado em ate 2 inimigos a ate 10 metros.", "Cura aliados proximos ao alvo em 1d6."),
                    ability("golpe_abencoado", "Golpe Abencoado", "14 MP", "Dano de arma + 3d8 em 1 inimigo adjacente.", "Ignora resistencia magica se usado contra criaturas malignas."),
                    ability("barreira_de_fe", "Barreira de Fe", "15 MP", "Cria uma barreira protetora em 1 aliado a ate 5 metros.", "Bloqueia ate 30 de dano por 2 turnos.")
                ],
                avancado: [
                    ability("julgamento_celestial", "Julgamento Celestial", "30 MP", "4d10 dano celestial em ate 3 inimigos a ate 15 metros.", "Reduz defesa magica dos alvos em -2 por 2 turnos."),
                    ability("toque_da_graca", "Toque da Graca", "28 MP", "Cura ate 3 aliados dividindo a cura a ate 10 metros em 4d8 + Modificador de Carisma.", "Remove efeitos negativos."),
                    ability("sentinela_divina", "Sentinela Divina", "25 MP", "Por 2 turnos, o paladino intercepta qualquer ataque direcionado a aliados em ate 5 metros.", "Sofre metade do dano.")
                ],
                mestre: [
                    ability("chama_da_retidao", "Chama da Retidao", "70 MP", "10d10 fogo sagrado em ate 5 inimigos a ate 20 metros.", "Aplica queimadura 2d6 por turno por 2 turnos."),
                    ability("espada_da_luz", "Espada da Luz", "45 MP", "6d10 dano sagrado em 1 inimigo a ate 15 metros.", "Se o alvo for maligno, aplica cegueira por 1 turno."),
                    ability("resplendor_protetor", "Resplendor Protetor", "40 MP", "Todos os aliados em ate 15 metros recebem +4 resistencia e regeneram 2d10 HP por turno por 3 turnos.", "Protecao e cura.")
                ],
                supremo: [
                    ability("intervencao_divina", "Intervencao Divina", "50 MP", "Invoca uma entidade divina para proteger todos os aliados em ate 20 metros.", "Efeito aleatorio entre cura total, escudo impenetravel por 1 turno, ou dano celestial 6d10 em todos os inimigos."),
                    ability("guardiao_celestial", "Guardiao Celestial", "75 MP", "Invoca um guardiao angelical por 3 turnos.", "Ataque: 6d10 + Modificador de Carisma; defesa: bloqueia ate 40 de dano por turno."),
                    ability("juramento_final", "Juramento Final", "80 MP", "Por 2 turnos, o paladino nao pode ser reduzido abaixo de 1 HP.", "Todos os ataques causam +5d10 de dano extra.")
                ],
                lendario: [
                    ability("ascensao_divina", "Ascensao Divina", "120 MP", "Por 3 turnos, o paladino ganha asas de luz e pode voar.", "Recebe +10 em todos os atributos e todos os ataques se tornam sagrados, ignorando resistencias."),
                    ability("exilio_dos_malignos", "Exilio dos Malignos", "130 MP", "15d12 dano sagrado em todos os inimigos malignos em ate 30 metros.", "Alvos sobreviventes ficam atordoados por 1 turno."),
                    ability("milagre_supremo_paladino", "Milagre Supremo", "140 MP", "Revive ate 4 aliados a ate 30 metros com HP e MP cheios.", "Remove todos os efeitos negativos e concede +5 ataque e defesa por 3 turnos.")
                ]
            }
        },
        ranger: {
            hp: 10,
            mp: 4,
            sp: 8,
            passivas: [
                "Lidar com Animais.",
                "Natureza.",
                "Sobrevivencia."
            ],
            subclasses: {
                cacador_de_alcance: {
                    nome: "Cacador de Alcance",
                    foco: "Dano a distancia.",
                    efeitos: [
                        "+5% de dano com arcos, bestas e arremessos.",
                        "Se nao se deslocar antes de atacar a distancia, ganha +1 no Acerto e +1d4 de dano adicional ao acertar, 1 vez por turno.",
                        "Ignora meia cobertura do alvo.",
                        "-1 de custo em habilidades de tiro unico a distancia."
                    ]
                },
                mestre_da_fera: {
                    nome: "Mestre da Fera",
                    foco: "Companheiro.",
                    efeitos: [
                        "Seu companheiro animal causa +5% de dano.",
                        "1 vez por turno, se voce e o companheiro acertarem o mesmo alvo, adiciona +1d4 de dano.",
                        "+1 no Acerto contra inimigos adjacentes ao seu companheiro.",
                        "-1 de custo em acoes ou ordens que gastem recurso para o companheiro agir.",
                        "O companheiro reduz 1 de dano de area recebido por instancia."
                    ]
                },
                tecelao_de_trilhas: {
                    nome: "Tecelao de Trilhas",
                    foco: "Controle e armadilhas.",
                    efeitos: [
                        "+1 no CD/Acerto das suas armadilhas e zonas.",
                        "1 vez por turno, quando uma armadilha sua for ativada, um alvo afetado sofre +1d4 de dano adicional.",
                        "-1 de custo em habilidades de controle.",
                        "Apos colocar armadilha no turno, ganha +1 de Movimento ate o fim do turno.",
                        "Ataques a distancia contra inimigo Imobilizado ou Lento por sua armadilha recebem +1 no Acerto."
                    ]
                }
            },
            abilities: {
                basico: [
                    ability("armadilha_magica", "Armadilha Magica", "5 MP", "Coloca uma armadilha em area de 2 metros.", "Quando ativada, imobiliza ate 2 inimigos por 1 turno e aplica -1 defesa (teste D100)."),
                    ability("cacada_implacavel", "Cacada Implacavel", "8 SP", "Dano de arma + 3d6 em 1 inimigo a ate 15 metros.", "Proximo ataque contra o mesmo alvo ganha +1d6."),
                    ability("disparo_duplo", "Disparo Duplo", "5 SP", "Dano de arma + 2d6 em ate 2 inimigos diferentes a ate 15 metros.", "Se ambos acertarem, ganha +1 acao menor no proximo turno."),
                    ability("flecha_arcana_ranger", "Flecha Arcana", "6 MP", "2d6 arcano em 1 inimigo a ate 20 metros.", "Ignora resistencia magica."),
                    ability("instinto_predatorio", "Instinto Predatorio", "5 SP", "Concede vantagem em testes de percepcao e rastreamento por 2 turnos.", "Bonus = modificador de inteligencia.")
                ],
                intermediario: [
                    ability("chuva_de_flechas_ranger", "Chuva de Flechas", "12 SP", "Dano de arma + 2d8 em ate 4 inimigos dividindo o dano, numa area de 5 metros a ate 20 metros.", "Alvos atingidos sofrem -2 em esquiva no proximo turno."),
                    ability("furia_bestial", "Furia Bestial", "8 SP", "Dano de arma + 2d8 em 1 inimigo a ate 10 metros.", "Se acertar, aplica sangramento 1d6 por turno por 2 turnos."),
                    ability("seta_envenenada", "Seta Envenenada", "8 SP", "Dano de arma + 2d6 venenoso em 1 inimigo a ate 15 metros.", "Alvo sofre 1d6 por turno de veneno por 2 turnos.")
                ],
                avancado: [
                    ability("marca_do_cacador", "Marca do Cacador", "20 SP", "Marca 1 inimigo a ate 20 metros por 3 turnos.", "Todos os ataques contra ele causam +2d6 extra."),
                    ability("armadilha_de_espinhos", "Armadilha de Espinhos", "22 MP", "4d8 perfurante em ate 3 inimigos numa area de 3 metros a ate 15 metros.", "Imobiliza por 1 turno (teste D100)."),
                    ability("besta_fantasma", "Besta Fantasma", "25 MP", "Invoca uma besta espiritual que ataca por 3 turnos.", "Ataque: 3d10 + Modificador de inteligencia; alcance ate 20 metros.")
                ],
                mestre: [
                    ability("rajada_devastadora", "Rajada Devastadora", "40 SP", "Dano de arma + 6d10 em 1 inimigo a ate 25 metros.", "Se acertar, aplica -3 defesa no inimigo por 2 turnos."),
                    ability("chuva_sombria", "Chuva Sombria", "45 MP", "8d10 sombrio em todos os inimigos numa area de 10 metros a ate 30 metros.", "Reduz a resistencia magica deles em -3 por 2 turnos."),
                    ability("furia_da_natureza_ranger", "Furia da Natureza", "50 MP", "Concede a si mesmo e aliados a ate 10 metros +4 ataque, +3 esquiva e +2d8 dano adicional por 3 turnos.", "Buff de cacada.")
                ],
                supremo: [
                    ability("golpe_do_predador", "Golpe do Predador", "70 SP", "Dano de arma + 10d8 em 1 inimigo a ate 30 metros.", "Se o alvo estiver com menos de 50% de HP, aplica dano critico dobrado."),
                    ability("legiao_de_espiritos", "Legiao de Espiritos", "75 MP", "Invoca 3 espiritos animais para lutar por 3 turnos.", "Cada um ataca com 6d10 + Modificador de inteligencia."),
                    ability("cacador_imortal", "Cacador Imortal", "80 MP", "Por 3 turnos, o ranger nao pode ser reduzido abaixo de 1 HP.", "Todos os ataques causam +6d10 extra.")
                ],
                lendario: [
                    ability("tempestade_de_flechas_ranger", "Tempestade de Flechas", "120 SP", "Dano de arma + 12d12 em todos os inimigos numa area de 20 metros a ate 40 metros.", "Aplica sangramento 2d6 por turno por 3 turnos."),
                    ability("chamado_da_besta_ancestral", "Chamado da Besta Ancestral", "130 MP", "Invoca uma besta ancestral unica para lutar por 3 turnos.", "Ataque: 10d12 + Modificador de inteligencia; bloqueia ate 60 de dano por turno."),
                    ability("cacador_supremo", "Cacador Supremo", "140 MP", "Por 3 turnos, todos os ataques do ranger acertam automaticamente.", "Ignoram esquiva e causam +10d12 extra.")
                ]
            }
        }
    });
}());
