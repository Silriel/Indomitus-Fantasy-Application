(function () {
    const ability = (id, nome, custo, descricao, efeito) => ({ id, nome, custo, descricao, efeito });

    Object.assign(window.CRIADOR_CLASS_COMPENDIUM, {
        atirador_arcano: {
            hp: 8,
            mp: 6,
            sp: 8,
            passivas: [
                "+1 de dano a distancia a cada 5 niveis.",
                "Recebe desvantagem quando atacado em corpo a corpo (inimigos adjacentes).",
                "Bonus de +2 em testes de Percepcao e Mira."
            ],
            subclasses: {
                precisao: {
                    nome: "Atirador de Precisao",
                    foco: "Tiros unicos fortes.",
                    efeitos: [
                        "+10% de dano em toda habilidade de tiro unico.",
                        "+2 no Acerto (d20) quando a habilidade for de alvo unico a distancia.",
                        "-2 de custo (SP/MP) em habilidades de tiro unico.",
                        "Em critico natural num tiro unico, adiciona +1 dado de dano base."
                    ]
                },
                supressao: {
                    nome: "Atirador de Supressao",
                    foco: "Multiplos disparos.",
                    efeitos: [
                        "+5% de dano em toda habilidade com 1+ projeteis.",
                        "Ganha +1 projetil adicional em habilidades de multishot com 2 ou mais tiros.",
                        "-1 de custo (SP/MP) por habilidade multidisparo."
                    ]
                }
            },
            abilities: {
                basico: [
                    ability("tiro_preciso", "Tiro Preciso", "4 SP", "Dano de arma + 2d6 em 1 inimigo a ate 20 metros.", "Ignora cobertura leve."),
                    ability("disparo_rapido", "Disparo Rapido", "6 SP", "Dano de arma + 1d6 em ate 2 inimigos diferentes, dividindo o dano.", "Se acertar os dois, ganha +1 acao menor no proximo turno."),
                    ability("flecha_explosiva", "Flecha Explosiva", "10 MP", "2d8 explosivo em area de 3 metros, ate 3 inimigos a ate 25 metros.", "Empurra alvos atingidos 1 metro para tras (teste D100)."),
                    ability("mira_certeira", "Mira Certeira", "5 SP", "Garante +2 no proximo ataque a distancia.", "Dura 1 turno."),
                    ability("rolamento_tatico", "Rolamento Tatico", "4 SP", "Move ate 4 metros sem provocar ataques de oportunidade.", "Mobilidade imediata.")
                ],
                intermediario: [
                    ability("rajada_de_tiros", "Rajada de Tiros", "12 SP", "Dano de arma + 3d6 em ate 3 inimigos, dividindo o dano, a ate 30 metros.", "Se acertar pelo menos 2, aplica -1 defesa nos alvos por 1 turno."),
                    ability("seta_congelante", "Seta Congelante", "10 MP", "3d8 gelo em 1 inimigo a ate 25 metros.", "Reduz velocidade em -3 metros por 1 turno (teste D100)."),
                    ability("disparo_ricochete", "Disparo Ricochete", "14 SP", "Dano de arma + 2d6 saltando entre ate 3 inimigos a ate 20 metros de distancia entre si.", "Salta entre alvos validos.")
                ],
                avancado: [
                    ability("flecha_de_penetracao", "Flecha de Penetracao", "20 MP", "5d8 perfurante em linha reta de ate 30 metros, atingindo ate 3 inimigos alinhados, dividindo o dano.", "Atravessa a linha de alvos."),
                    ability("salva_arcana", "Salva Arcana", "22 MP", "6d8 magico (fogo, gelo ou eletrico) em ate 4 inimigos dividindo o dano a ate 30 metros.", "Escolhe o elemento ao usar."),
                    ability("manto_da_nevoa", "Manto da Nevoa", "25 MP", "Cria uma nevoa magica em area de 10 metros.", "Inimigos sofrem -3 em ataque a distancia por 2 turnos.")
                ],
                mestre: [
                    ability("tempestade_de_flechas", "Tempestade de Flechas", "40 SP", "Dano de arma + 7d10 em todos os inimigos, dividindo o dano, em area de 15 metros a ate 40 metros.", "Cobre a area inteira."),
                    ability("tiro_perfurante_supremo", "Tiro Perfurante Supremo", "45 MP", "10d10 perfurante em 1 inimigo a ate 50 metros.", "Um d10 para aumentar o numero de acerto."),
                    ability("olho_de_aguia", "Olho de Aguia", "40 MP", "Durante 1 turno, acerta automaticamente qualquer ataque a distancia.", "Rola dano maximo nos dados.")
                ],
                supremo: [
                    ability("tornado_de_projeteis", "Tornado de Projeteis", "70 SP", "Dano de arma + 12d8 em ate 6 inimigos, dividindo o dano, a ate 50 metros.", "Aplica sangramento 2d6 por turno por 2 turnos (teste D100)."),
                    ability("explosao_elemental_atirador", "Explosao Elemental", "75 MP", "15d10 magico (fogo, gelo ou trovao) em area de 20 metros a ate 60 metros.", "Escolhe o elemento ao usar."),
                    ability("postura_imparavel", "Postura Imparavel", "70 MP", "Durante 3 turnos, nao sofre penalidades por movimento, recarregamento ou mira.", "Pode atacar duas vezes por turno.")
                ],
                lendario: [
                    ability("flecha_estelar", "Flecha Estelar", "120 SP + 60 MP", "20d12 radiante em todos os inimigos no campo, ate 70 metros.", "Alvos sobreviventes ficam cegos por 1 turno (teste D100)."),
                    ability("lenda_do_atirador", "Lenda do Atirador", "130 MP", "Durante 3 turnos, todos os ataques do Atirador causam +10d12 extra.", "Nao podem ser bloqueados e ignoram cobertura."),
                    ability("chuva_mortal", "Chuva Mortal", "140 MP", "Dano de arma + 25d12 em area de 30 metros a ate 80 metros.", "Aplica sangramento massivo 4d8 por turno por 3 turnos (teste D100).")
                ]
            }
        },
        barbaro: {
            hp: 16,
            mp: 2,
            sp: 6,
            passivas: [
                "C.A +1.",
                "+2 de Vida a cada 10 niveis.",
                "Sobrevivencia."
            ],
            subclasses: {
                destruidor_implacavel: {
                    nome: "Destruidor Implacavel",
                    foco: "Ataque bruto.",
                    efeitos: [
                        "+10% de dano em ataques corpo a corpo enquanto estiver em Furia.",
                        "+2 no Acerto (d20) contra inimigos com 50% ou menos de Vida.",
                        "Critico Brutal: em critico corpo a corpo, adiciona +1 dado de dano base da arma.",
                        "Golpe Unico Eficiente: -2 de custo em habilidades de golpe unico corpo a corpo."
                    ]
                },
                bastiao_totemico: {
                    nome: "Bastiao Totemico",
                    foco: "Defesa e permanencia.",
                    efeitos: [
                        "Pele de Ferro: +10 de vida.",
                        "Postura Inabalavel: +2 de Defesa/C.A. enquanto sem armadura pesada.",
                        "Vontade Indomita: vantagem contra empurrao, derrubar ou atordoar.",
                        "Resiliencia Primal: no proximo combate, recupera 1% da Vida Maxima ao sofrer dano."
                    ]
                }
            },
            abilities: {
                basico: [
                    ability("frenesi_brutal", "Frenesi Brutal", "6 MP", "Dano de arma + 1d8.", "Aumenta em +1 o numero de ataques no turno."),
                    ability("furia_descontrolada", "Furia Descontrolada", "4 SP", "Recebe +2 de resistencia fisica por 4 turnos.", "Buff defensivo."),
                    ability("furia_revigorante", "Furia Revigorante", "10 SP", "Dano de arma + 2d8.", "Recupera +2 SP ao causar dano bem-sucedido."),
                    ability("golpe_sismico", "Golpe Sismico", "15 SP", "3d6 dano sismico em 3 metros de raio, ate 3 inimigos.", "Pode derrubar os inimigos atingidos (teste D100)."),
                    ability("grito_de_guerra", "Grito de Guerra", "7 SP", "Aliados em raio de 5 metros recebem +1 em dano fisico por 3 turnos.", "Suporte ofensivo.")
                ],
                intermediario: [
                    ability("investida_selvagem", "Investida Selvagem", "10 SP", "Dano de arma + 3d6.", "Empurra o inimigo 2 metros para tras (teste D100)."),
                    ability("muralha_de_forca_barbaro", "Muralha de Forca", "12 SP", "Cria uma barreira fisica a frente de 2 metros de largura.", "Bloqueia um ataque."),
                    ability("rugido_trovejante", "Rugido Trovejante", "10 SP", "2d8 trovejante em area de 3 metros.", "Atordoa inimigos por 1 turno se falharem resistencia (teste D100).")
                ],
                avancado: [
                    ability("furia_sangrenta_barbaro", "Furia Sangrenta", "25 SP", "4d6 cortante em alvo unico.", "Cura o Barbaro em metade do dano causado."),
                    ability("terremoto_selvagem", "Terremoto Selvagem", "30 SP", "3d8 em area de 5 metros.", "Derruba todos os inimigos na area (teste D100)."),
                    ability("escudo_de_ossos", "Escudo de Ossos", "20 SP", "Reduz todo dano fisico recebido em 50% por 3 turnos.", "Mitigacao pesada.")
                ],
                mestre: [
                    ability("carnificina_imparavel", "Carnificina Imparavel", "40 SP", "6d8 em ate 3 inimigos no raio de 3 metros.", "Se derrotar um inimigo, pode atacar novamente."),
                    ability("rugido_ancestral", "Rugido Ancestral", "35 SP", "Todos os aliados em 10 metros recebem +3 dano e +2 resistencia por 3 turnos.", "Buff de grupo."),
                    ability("golpe_do_colosso", "Golpe do Colosso", "45 SP", "8d10 esmagador em alvo unico.", "Quebra armaduras, reduzindo em -2 a defesa fisica do alvo.")
                ],
                supremo: [
                    ability("furia_dos_espiritos", "Furia dos Espiritos", "60 SP", "10d6 magico-fisico em area de 10 metros.", "Inimigos atingidos tem -3 nos ataques por 2 turnos."),
                    ability("barbaro_imortal", "Barbaro Imortal", "70 SP", "Durante 2 turnos, nao pode ser reduzido abaixo de 1 HP.", "Resiste a quedas letais."),
                    ability("tempestade_de_machados", "Tempestade de Machados", "65 SP", "6d10 em ate 6 inimigos a ate 10 metros.", "Aplica sangramento 1d6 por turno por 3 turnos (teste D100).")
                ],
                lendario: [
                    ability("avatar_da_destruicao", "Avatar da Destruicao", "100 SP", "12d12 em area de 20 metros.", "Destroi construcoes leves e derruba inimigos (teste D100)."),
                    ability("rugido_do_mundo_antigo", "Rugido do Mundo Antigo", "90 SP", "Paralisa todos os inimigos em 20 metros por 1 turno.", "Aliados ganham +5 dano."),
                    ability("ultima_furia", "Ultima Furia", "100 SP", "15d10 em alvo unico.", "Se o alvo for derrotado, o Barbaro recupera todo o SP.")
                ]
            }
        },
        bardo: {
            hp: 10,
            mp: 8,
            sp: 4,
            passivas: [
                "+2 de Carisma a cada 10 niveis.",
                "Arcanismo."
            ],
            subclasses: {
                trovador_guerra: {
                    nome: "Trovador de Guerra",
                    foco: "Buff.",
                    efeitos: [
                        "+15% de potencia em buffs do Bardo.",
                        "+1 alvo adicional para cancoes de suporte.",
                        "+1 turno em buffs com duracao de 2 turnos ou mais.",
                        "-1 de custo em habilidades exclusivamente de buff."
                    ]
                },
                menestrel_curandeiro: {
                    nome: "Menestrel Curandeiro",
                    foco: "Cura.",
                    efeitos: [
                        "+15% de cura em cancoes e magias de restauracao.",
                        "Cura excedente vira Escudo ate 10% da Vida Maxima por 1 turno.",
                        "Curas em area ganham +1 no raio.",
                        "Ao curar aliado com 25% ou menos de Vida, ele ganha +2 de Defesa/C.A. ate o proximo turno."
                    ]
                },
                virtuoso_batalha: {
                    nome: "Virtuoso de Batalha",
                    foco: "Dano.",
                    efeitos: [
                        "+10% de dano em habilidades ofensivas do Bardo.",
                        "Critico musical: +1 dado de dano base da habilidade em critico.",
                        "-1 de custo em habilidades ofensivas do Bardo.",
                        "Desconcertar: inimigos atingidos sofrem -2 em testes de Concentracao ate o fim do proximo turno."
                    ]
                }
            },
            abilities: {
                basico: [
                    ability("canto_da_cura", "Canto da Cura", "5 MP", "Cura 1 aliado a ate 5 metros em 1d6 + modificador de Carisma.", "Cura direta."),
                    ability("cordas_encantadas", "Cordas Encantadas", "2 MP", "Cria ilusoes sonoras que confundem 1 inimigo em ate 10 metros.", "Da -2 em ataques por 1 turno."),
                    ability("danca_das_sombras", "Danca das Sombras", "6 MP", "2d6 sombrios em 1 inimigo em ate 10 metros.", "Se houver sombra e o inimigo estiver distraido, causa +1d6."),
                    ability("harmonia_protetora", "Harmonia Protetora", "6 MP", "Concede a 1 aliado em ate 5 metros +2 resistencia contra ataques fisicos e magicos por 2 turnos.", "Buff protetivo."),
                    ability("ilusao_envolvente", "Ilusao Envolvente", "4 MP", "Cria ilusoes visuais em 1 inimigo a ate 10 metros.", "Fica confuso e perde 1 acao no turno (teste D100).")
                ],
                intermediario: [
                    ability("inspirar_grandeza", "Inspirar Grandeza", "10 MP", "Ate 3 aliados em ate 10 metros recebem +2 ataque e +2 resistencia por 3 turnos.", "Canal de suporte."),
                    ability("melodia_da_distracao", "Melodia da Distracao", "8 MP", "Desorienta ate 2 inimigos em ate 10 metros.", "Teste de resistencia ou -3 em ataque e defesa por 2 turnos."),
                    ability("ressurreicao_melodica", "Ressurreicao Melodica", "15 MP", "Revive 1 aliado caido a ate 5 metros com 25% do HP maximo.", "Remove um efeito negativo ativo.")
                ],
                avancado: [
                    ability("arpejo_cortante", "Arpejo Cortante", "20 MP", "4d6 cortante magico em ate 2 inimigos a ate 15 metros.", "Pode aplicar sangramento 1d6 por turno por 2 turnos."),
                    ability("sinfonia_de_luz", "Sinfonia de Luz", "18 MP", "Cura ate 3 aliados em ate 10 metros com 3d6 dividido total + modificador de Carisma.", "Concede +1 resistencia magica por 3 turnos."),
                    ability("marcha_das_almas", "Marcha das Almas", "22 MP", "5d6 dano espiritual em ate 3 inimigos dividindo o dano, a ate 15 metros.", "Reduz resistencia deles em -2 por 2 turnos.")
                ],
                mestre: [
                    ability("concerto_de_guerra", "Concerto de Guerra", "35 MP", "Aliados em ate 20 metros ganham +4 ataque, +3 resistencia e +2d6 dano adicional por 3 turnos.", "Grande buff de combate."),
                    ability("balada_espectral", "Balada Espectral", "40 MP", "8d8 de dano espectral em ate 5 inimigos a ate 20 metros.", "Chance de atordoar por 1 turno."),
                    ability("aura_imortal", "Aura Imortal", "38 MP", "Todos os aliados em ate 15 metros nao podem ser reduzidos abaixo de 1 HP por 2 turnos.", "Mantem o grupo de pe.")
                ],
                supremo: [
                    ability("opera_dos_elementos", "Opera dos Elementos", "60 MP", "10d6 misturado (fogo, gelo, eletrico) em ate 6 inimigos, dividindo o dano, a ate 25 metros.", "Reduz resistencia elemental em -4 por 3 turnos."),
                    ability("verso_eterno", "Verso Eterno", "65 MP", "Revive ate 2 aliados caidos em ate 10 metros com metade do HP e SP.", "Remove todos os efeitos negativos."),
                    ability("melodia_das_estrelas", "Melodia das Estrelas", "55 MP", "Cura todos os aliados em ate 20 metros em 5d10 dividido + modificador de Carisma.", "Da +4 resistencia a magias por 3 turnos.")
                ],
                lendario: [
                    ability("sinfonia_divina", "Sinfonia Divina", "100 MP", "Aliados em ate 30 metros recebem +10 ataque, +10 resistencia e +6d10 dano adicional por 3 turnos.", "Buff lendario."),
                    ability("trovao_da_criacao", "Trovao da Criacao", "110 MP", "12d12 dano elemental a escolha do Bardo em ate 8 inimigos a ate 30 metros.", "Aplica queimadura, congelamento ou choque por 2 turnos."),
                    ability("ultima_cancao", "Ultima Cancao", "120 MP", "Todos os aliados caidos sao revividos a ate 30 metros com HP/SP/MP totais.", "O Bardo fica exausto por 2 turnos.")
                ]
            }
        }
    });
}());
