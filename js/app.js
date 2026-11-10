const GAMES_DATA = [
  {
    "id": "pacman",
    "title": "Pac-Man HTML5",
    "category": "classico",
    "description": "Percorra o labirinto, coma os pontinhos e desvie dos fantasmas. Recriação em HTML5.",
    "recent": true,
    "cover": "assets/covers/pacman.png",
    "platform": "flash"
  },
  {
    "id": "mario-html5",
    "title": "Infinite Mario",
    "category": "retro",
    "description": "Recriação HTML de Infinite Mario, com fases de plataforma.",
    "recent": true,
    "recreation": true,
    "platform": "console",
    "cover": "assets/covers/mario-html5.png"
  },
  {
    "id": "mario64-cleanroom",
    "title": "Mario 64 — Clean Room",
    "category": "retro",
    "description": "Versão de fãs para navegador com texturas e sons recriados.",
    "recent": true,
    "recreation": true,
    "platform": "console",
    "cover": "assets/covers/mario64-cleanroom.png"
  },
  {
    "id": "zelda-tribute",
    "title": "Zelda 30 Year Tribute",
    "category": "retro",
    "description": "Recriação 3D de fãs de The Legend of Zelda.",
    "recent": true,
    "recreation": true,
    "platform": "console",
    "cover": "assets/covers/zelda-tribute.png"
  },
  {
    "id": "flappy-bird",
    "title": "Flappy Bird",
    "category": "arcade",
    "description": "Recriação HTML: bata as asas e passe entre os canos.",
    "recent": true,
    "popular": true,
    "platform": "mobile",
    "cover": "assets/covers/flappy-bird.png"
  },
  {
    "id": "slope",
    "title": "Slope 3D",
    "category": "arcade",
    "description": "Uma pista infinita em alta velocidade.",
    "popular": true,
    "cover": "assets/covers/slope-play.png",
    "platform": "mobile"
  },
  {
    "id": "clumsy-bird",
    "title": "Clumsy Bird",
    "category": "arcade",
    "description": "Bata as asas e desvie dos canos.",
    "recent": true,
    "platform": "mobile",
    "cover": "assets/covers/clumsy-bird.png"
  },
  {
    "id": "tetris",
    "title": "Tetris",
    "category": "puzzle",
    "description": "Encaixe as peças e complete as linhas.",
    "recent": true,
    "platform": "flash",
    "cover": "assets/covers/tetris.png"
  },
  {
    "id": "hextris",
    "title": "Hextris",
    "category": "puzzle",
    "description": "Gire o hexágono e combine as cores.",
    "recent": true,
    "platform": "flash",
    "cover": "assets/covers/hextris.png"
  },
  {
    "id": "breakout",
    "title": "Breakout",
    "category": "arcade",
    "description": "Rebata a bola e destrua os blocos.",
    "recent": true,
    "platform": "flash",
    "cover": "assets/covers/breakout.png"
  },
  {
    "id": "fireboy-and-watergirl",
    "title": "Fogo e Água: Floresta",
    "category": "puzzle",
    "description": "Trabalhe em equipe com o Menino Fogo e a Menina Água para resolver enigmas.",
    "cover": "assets/covers/fireboy-and-watergirl.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "bad-ice-cream",
    "title": "Bad Ice Cream",
    "category": "arcade",
    "description": "Colete frutas e quebre paredes de gelo desviando dos monstros famintos.",
    "cover": "assets/covers/bad-ice-cream.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "bad-ice-cream-2",
    "title": "Bad Ice Cream 2",
    "category": "arcade",
    "description": "Segunda aventura do sorvete travesso com novos inimigos e frutas exóticas.",
    "cover": "assets/covers/bad-ice-cream-2.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "bad-ice-cream-3",
    "title": "Bad Ice Cream 3",
    "category": "arcade",
    "description": "Terceira edição com novos monstros de gelo e fases super desafiadoras.",
    "cover": "assets/covers/bad-ice-cream-3.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "moto-x3m",
    "title": "Moto X3M",
    "category": "acao",
    "description": "Pilote motos potentes, faça acrobacias insanas e desvie de serras mortais.",
    "cover": "assets/covers/moto-x3m.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "moto-x3m-winter",
    "title": "Moto X3M: Winter",
    "category": "acao",
    "description": "Acrobacias radicais na neve e gelo com pistas cheias de perigos congelantes.",
    "cover": "assets/covers/moto-x3m-winter.jpeg",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "moto-x3m-pool-party",
    "title": "Moto X3M: Pool Party",
    "category": "acao",
    "description": "Manobras aquáticas em toboáguas gigantes e rampas ensolaradas.",
    "cover": "assets/covers/moto-x3m-pool-party.jpg",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "moto-x3m-spooky-land",
    "title": "Moto X3M: Spooky Land",
    "category": "acao",
    "description": "Edição sombria de Halloween com pistas assombradas e armadilhas macabras.",
    "cover": "assets/covers/moto-x3m-spooky-land.jpeg",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "papas-pizzeria",
    "title": "Papa's Pizzeria",
    "category": "arcade",
    "description": "Asse e corte pizzas deliciosas no ponto perfeito para clientes exigentes.",
    "cover": "assets/covers/papas-pizzeria.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "papas-freezeria",
    "title": "Papa's Freezeria",
    "category": "arcade",
    "description": "Prepare sundaes e milk-shakes refrescantes na ilha tropical de Calypso.",
    "cover": "assets/covers/papas-freezeria.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "papas-burgeria",
    "title": "Papa's Burgeria",
    "category": "arcade",
    "description": "Grelhe hambúrgueres suculentos e monte lanches gigantescos sem errar.",
    "cover": "assets/covers/papas-burgeria.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "papas-hot-doggeria",
    "title": "Papa's Hot Doggeria",
    "category": "arcade",
    "description": "Sirva cachorros-quentes e pipoca para a torcida no estádio de beisebol.",
    "cover": "assets/covers/papas-hot-doggeria.jpg",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "papas-pancakeria",
    "title": "Papa's Pancakeria",
    "category": "arcade",
    "description": "Vire panquecas douradas e waffles fofinhos cobertos de xarope e frutas.",
    "cover": "assets/covers/papas-pancakeria.jpg",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "papas-sushiria",
    "title": "Papa's Sushiria",
    "category": "arcade",
    "description": "Enrole sushis artesanais e sirva chá de bolhas no restaurante japonês.",
    "cover": "assets/covers/papas-sushiria.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "papas-wingeria",
    "title": "Papa's Wingeria",
    "category": "arcade",
    "description": "Frite e empane asinhas de frango crocantes com os molhos mais picantes.",
    "cover": "assets/covers/papas-wingeria.jpg",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "papa-louie",
    "title": "Papa Louie: Attack",
    "category": "arcade",
    "description": "Resgate seus clientes em um mundo mágico onde as pizzas ganharam vida!",
    "cover": "assets/covers/papa-louie.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "age-of-war",
    "title": "Age of War",
    "category": "acao",
    "description": "Evolua da Idade da Pedra até o futuro cibernético e destrua a base rival.",
    "cover": "assets/covers/age-of-war.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "stick-war",
    "title": "Stick War: Legacy",
    "category": "acao",
    "description": "Comande seu exército de guerreiros stickman e domine o mundo de Inamorta.",
    "cover": "assets/covers/stick-war.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "bloons-td",
    "title": "Bloons Tower Defense",
    "category": "puzzle",
    "description": "Posicione macaquinhos e canhões para estourar todas as levas de balões.",
    "cover": "assets/covers/bloons-td.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "bloons-td-2",
    "title": "Bloons Tower Defense 2",
    "category": "puzzle",
    "description": "Novas torres, dardos teleguiados e balões especiais mais resistentes.",
    "cover": "assets/covers/bloons-td-2.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "bloons-td-4",
    "title": "Bloons Tower Defense 4",
    "category": "puzzle",
    "description": "A versão definitiva com gráficos aprimorados e dezenas de upgrades.",
    "cover": "assets/covers/bloons-td-4.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "vex-3",
    "title": "Vex 3",
    "category": "acao",
    "description": "Corra, escale paredes e desvie de armadilhas mortais com precisão milimétrica.",
    "cover": "assets/covers/vex-3.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "vex-4",
    "title": "Vex 4",
    "category": "acao",
    "description": "Fases ainda mais frenéticas no labirinto de espinhos e lasers neon.",
    "cover": "assets/covers/vex-4.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "vex-5",
    "title": "Vex 5",
    "category": "acao",
    "description": "Desafie seus reflexos com salas secretas e novos movimentos de parkour.",
    "cover": "assets/covers/vex-5.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "vex-6",
    "title": "Vex 6",
    "category": "acao",
    "description": "Skins desbloqueáveis, missões diárias e obstáculos acrobáticos velozes.",
    "cover": "assets/covers/vex-6.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "vex-7",
    "title": "Vex 7",
    "category": "acao",
    "description": "Aventura épica de parkour com espadas, cordas e chefões implacáveis.",
    "cover": "assets/covers/vex-7.jpeg",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "duck-life",
    "title": "Duck Life",
    "category": "arcade",
    "description": "Treine seu patinho em corrida, natação e voo para salvar sua fazenda.",
    "cover": "assets/covers/duck-life.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "duck-life-2",
    "title": "Duck Life 2",
    "category": "arcade",
    "description": "Novos torneios mundiais, habilidades de escalada e patos adversários velozes.",
    "cover": "assets/covers/duck-life-2.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "duck-life-3",
    "title": "Duck Life 3: Evolutions",
    "category": "arcade",
    "description": "Evolua geneticamente seu pato escolhendo entre 4 raças com superpoderes.",
    "cover": "assets/covers/duck-life-3.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "duck-life-4",
    "title": "Duck Life 4",
    "category": "arcade",
    "description": "Explore um vulcão ativo, treine uma equipe de patos e conquiste o troféu.",
    "cover": "assets/covers/duck-life-4.jpg",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "duck-life-treasure-hunt",
    "title": "Duck Life: Treasure",
    "category": "arcade",
    "description": "Desça em cavernas misteriosas em busca de gemas raras e tesouros de ouro.",
    "cover": "assets/covers/duck-life-treasure-hunt.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "bloxorz",
    "title": "Bloxorz",
    "category": "puzzle",
    "description": "Role o bloco retangular de metal até fazê-lo cair perfeitamente no buraco.",
    "cover": "assets/covers/bloxorz.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "fancy-pants-adventures",
    "title": "Fancy Pants Adventures",
    "category": "arcade",
    "description": "O clássico stickman de calças amarelas deslizando em colinas e saltos fluidos.",
    "cover": "assets/covers/fancy-pants-adventures.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "learn-to-fly",
    "title": "Learn to Fly",
    "category": "arcade",
    "description": "Ajude o pinguim determinado a provar que pinguins podem voar alto.",
    "cover": "assets/covers/learn-to-fly.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "learn-to-fly-2",
    "title": "Learn to Fly 2",
    "category": "arcade",
    "description": "Construa foguetes e planadores turbinados para destruir o iceberg.",
    "cover": "assets/covers/learn-to-fly-2.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "gun-mayhem",
    "title": "Gun Mayhem",
    "category": "acao",
    "description": "Batalhas frenéticas com armas de fogo em plataformas suspensas.",
    "cover": "assets/covers/gun-mayhem.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "gun-mayhem-2",
    "title": "Gun Mayhem 2: More",
    "category": "acao",
    "description": "Mais armas, novos modos de campanha e tiroteios explosivos em grupo.",
    "cover": "assets/covers/gun-mayhem-2.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "run-3",
    "title": "Run 3",
    "category": "acao",
    "description": "Corra e gire a gravidade em túneis espaciais tridimensionais sem fim.",
    "cover": "assets/covers/run-3.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "worlds-hardest-game",
    "title": "World's Hardest Game",
    "category": "puzzle",
    "description": "Guie o quadrado vermelho pelas bolas azuis sem levar nenhum toque.",
    "cover": "assets/covers/worlds-hardest-game.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "worlds-hardest-game-2",
    "title": "World's Hardest Game 2",
    "category": "puzzle",
    "description": "Cinquenta novos níveis com mecânicas insanas de paciência e precisão.",
    "cover": "assets/covers/worlds-hardest-game-2.jpg",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "the-impossible-quiz",
    "title": "The Impossible Quiz",
    "category": "puzzle",
    "description": "Perguntas malucas com pegadinhas inteligentes e hilárias.",
    "cover": "assets/covers/the-impossible-quiz.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "the-impossible-quiz-2",
    "title": "The Impossible Quiz 2",
    "category": "puzzle",
    "description": "A continuação oficial do teste mais traiçoeiro e divertido da internet.",
    "cover": "assets/covers/the-impossible-quiz-2.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "happy-wheels",
    "title": "Happy Wheels",
    "category": "acao",
    "description": "Física de ragdoll extrema e pistas repletas de serras, minas e catapultas.",
    "cover": "assets/covers/happy-wheels.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "boxhead-2play",
    "title": "Boxhead 2Play",
    "category": "acao",
    "description": "Sobreviva a hordas infinitas de zumbis em salas com barris explosivos.",
    "cover": "assets/covers/boxhead-2play.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "pandemic-2",
    "title": "Pandemic 2",
    "category": "puzzle",
    "description": "Evolua sintomas e vias de transmissão para contaminar o planeta inteiro.",
    "cover": "assets/covers/pandemic-2.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "henry-stickmin-breaking-the-bank",
    "title": "Stickmin: Breaking Bank",
    "category": "puzzle",
    "description": "Tente invadir o cofre do banco escolhendo as ferramentas mais bizarras.",
    "cover": "assets/covers/henry-stickmin-breaking-the-bank.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "henry-stickmin-escaping-the-prison",
    "title": "Stickmin: Escaping Prison",
    "category": "puzzle",
    "description": "Planeje sua fuga espetacular da prisão escolhendo entre planos malucos.",
    "cover": "assets/covers/henry-stickmin-escaping-the-prison.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "henry-stickmin-stealing-the-diamond",
    "title": "Stickmin: Stealing Diamond",
    "category": "puzzle",
    "description": "Roube o gigantesco diamante do museu usando alta tecnologia e trapalhadas.",
    "cover": "assets/covers/henry-stickmin-stealing-the-diamond.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "subway-surfers",
    "title": "Subway Surfers",
    "category": "arcade",
    "description": "Desvie de trens velozes e guardas correndo pelos trilhos da cidade.",
    "cover": "assets/covers/subway-surfers.png",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "temple-run-2",
    "title": "Temple Run 2",
    "category": "arcade",
    "description": "Escape com o ídolo dourado através de penhascos e minas perigosas.",
    "cover": "assets/covers/temple-run-2.png",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "cut-the-rope",
    "title": "Cut the Rope",
    "category": "puzzle",
    "description": "Corte as cordas na hora certa para alimentar o monstrinho verde Om Nom.",
    "cover": "assets/covers/cut-the-rope.png",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "cut-the-rope-2",
    "title": "Cut the Rope 2",
    "category": "puzzle",
    "description": "Novos cenários na floresta e amigos ajudantes com poderes especiais.",
    "cover": "assets/covers/cut-the-rope-2.png",
    "platform": "mobile",
    "popular": false,
    "recent": true
  },
  {
    "id": "crossy-road",
    "title": "Crossy Road",
    "category": "arcade",
    "description": "Por que a galinha atravessou a rua? Desvie de carros, trens e rios.",
    "cover": "assets/covers/crossy-road.png",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "doodle-jump",
    "title": "Doodle Jump",
    "category": "arcade",
    "description": "Pule sem parar em plataformas nas alturas atirando nos monstros com o focinho.",
    "cover": "assets/covers/doodle-jump.png",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "cookie-clicker",
    "title": "Cookie Clicker",
    "category": "arcade",
    "description": "Clique no biscoito gigante e contrate vovós para produzir bilhões de cookies.",
    "cover": "assets/covers/cookie-clicker.jpeg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "rooftop-snipers",
    "title": "Rooftop Snipers",
    "category": "acao",
    "description": "Duelos cômicos de sniper no topo de prédios usando física de boneco de pano.",
    "cover": "assets/covers/rooftop-snipers.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "getaway-shootout",
    "title": "Getaway Shootout",
    "category": "acao",
    "description": "Pule e atire para alcançar o helicóptero de fuga antes dos seus oponentes.",
    "cover": "assets/covers/getaway-shootout.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "tunnel-rush",
    "title": "Tunnel Rush",
    "category": "arcade",
    "description": "Velocidade alucinante dentro de um túnel psicodélico esquivando de barreiras.",
    "cover": "assets/covers/tunnel-rush.png",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "drive-mad",
    "title": "Drive Mad",
    "category": "acao",
    "description": "Pilote seu caminhão 4x4 por pistas cheias de pontes quebradas e cambalhotas.",
    "cover": "assets/covers/drive-mad.png",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "bitlife",
    "title": "BitLife",
    "category": "puzzle",
    "description": "Simulador de vida interativo: faça suas próprias escolhas do berço ao túmulo.",
    "cover": "assets/covers/bitlife.png",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "retro-bowl",
    "title": "Retro Bowl",
    "category": "arcade",
    "description": "Futebol americano retrô estilo 8-bits: gerencie sua equipe e faça touchdowns.",
    "cover": "assets/covers/retro-bowl.png",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "tiny-fishing",
    "title": "Tiny Fishing",
    "category": "arcade",
    "description": "Lance o anzol nas profundezas do lago e pesque os peixes mais valiosos.",
    "cover": "assets/covers/tiny-fishing.png",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "ovo",
    "title": "OvO",
    "category": "acao",
    "description": "Parkour em ritmo frenético com saltos duplos, mergulhos e esquivas perfeitas.",
    "cover": "assets/covers/ovo.png",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "friday-night-funkin",
    "title": "Friday Night Funkin'",
    "category": "arcade",
    "description": "Batalhas rítmicas de hip-hop para conquistar o coração da sua namorada.",
    "cover": "assets/covers/friday-night-funkin.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "baldis-basics",
    "title": "Baldi's Basics",
    "category": "acao",
    "description": "Colete 7 cadernos na escola bizarra do professor Baldi e tente escapar.",
    "cover": "assets/covers/baldis-basics.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "superhot",
    "title": "SUPERHOT Web",
    "category": "acao",
    "description": "O tempo só se move quando você se move. Elimine inimigos com estilo.",
    "cover": "assets/covers/superhot.jpg",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "time-shooter-3",
    "title": "Time Shooter 3: SWAT",
    "category": "acao",
    "description": "Operação tática com desaceleração do tempo ao estilo Matrix.",
    "cover": "assets/covers/time-shooter-3.png",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "smash-karts",
    "title": "Smash Karts",
    "category": "arcade",
    "description": "Corrida de kart 3D com caixas de armas, mísseis e bombas explosivas.",
    "cover": "assets/covers/smash-karts.png",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "paper-io-2",
    "title": "Paper.io 2",
    "category": "arcade",
    "description": "Conquiste território pintando o mapa e corte as trilhas dos outros jogadores.",
    "cover": "assets/covers/paper-io-2.png",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "craftmine",
    "title": "CraftMine",
    "category": "puzzle",
    "description": "Sobrevivência e mineração 2D: corte madeira, colete minérios e sobreviva à noite.",
    "cover": "assets/covers/craftmine.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "grindcraft",
    "title": "Grindcraft",
    "category": "puzzle",
    "description": "Clique para minerar matérias-primas e crie itens épicos no estilo Minecraft.",
    "cover": "assets/covers/grindcraft.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "toss-the-turtle",
    "title": "Toss The Turtle",
    "category": "arcade",
    "description": "Dispare a tartaruga com canhões gigantes e compre bombas para ir mais longe.",
    "cover": "assets/covers/toss-the-turtle.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "there-is-no-game",
    "title": "There Is No Game",
    "category": "puzzle",
    "description": "O narrador insiste que não há nada aqui. Encontre os segredos ocultos.",
    "cover": "assets/covers/there-is-no-game.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "this-is-the-only-level",
    "title": "This Is The Only Level",
    "category": "puzzle",
    "description": "O elefante precisa passar pelo mesmo nível, mas as regras mudam a cada vez.",
    "cover": "assets/covers/this-is-the-only-level.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "zombocalypse",
    "title": "Zombocalypse",
    "category": "acao",
    "description": "Lute contra ondas de mortos-vivos empunhando facas, escopetas e rifles de assalto.",
    "cover": "assets/covers/zombocalypse.svg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "1v1-lol",
    "title": "1v1.LOL",
    "category": "acao",
    "description": "Simulador competitivo de construção rápida e tiroteio em terceira pessoa.",
    "cover": "assets/covers/1v1-lol.png",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "angry-birds",
    "title": "Angry Birds Classic",
    "category": "arcade",
    "description": "Dispare os pássaros furiosos com o estilingue e derrube os porcos verdes.",
    "cover": "assets/covers/angry-birds.jpg",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "alien-hominid",
    "title": "Alien Hominid",
    "category": "acao",
    "description": "O clássico cult da Newgrounds: ajude o alienígena amarelo contra agentes do FBI.",
    "cover": "assets/covers/alien-hominid.jpeg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "awesome-tanks-2",
    "title": "Awesome Tanks 2",
    "category": "acao",
    "description": "Batalhas táticas de tanques: destrua bases inimigas e melhore sua blindagem.",
    "cover": "assets/covers/awesome-tanks-2.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "backflip-dive-3d",
    "title": "Backflip Dive 3D",
    "category": "arcade",
    "description": "Execute saltos mortais perfeitos e caia em pé de plataformas altíssimas.",
    "cover": "assets/covers/backflip-dive-3d.jpeg",
    "platform": "mobile",
    "popular": false,
    "recent": true
  },
  {
    "id": "basket-bros",
    "title": "Basket Bros",
    "category": "arcade",
    "description": "Basquete mano a mano com enterradas aéreas espetaculares e socos hilários.",
    "cover": "assets/covers/basket-bros.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "basketball-legends",
    "title": "Basketball Legends",
    "category": "arcade",
    "description": "Jogue basquete com lendas do esporte usando super arremessos em chamas.",
    "cover": "assets/covers/basketball-legends.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "basketball-stars",
    "title": "Basketball Stars",
    "category": "arcade",
    "description": "Drible adversários, bloqueie arremessos e pontue em partidas eletrizantes.",
    "cover": "assets/covers/basketball-stars.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "binding-of-isaac",
    "title": "The Binding of Isaac",
    "category": "acao",
    "description": "Explore masmorras geradas aleatoriamente cheias de monstros e itens místicos.",
    "cover": "assets/covers/binding-of-isaac.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "canyon-defense",
    "title": "Canyon Defense",
    "category": "puzzle",
    "description": "Construa torres de defesa avançadas no cânion para deter o comboio militar.",
    "cover": "assets/covers/canyon-defense.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "cars-simulator-3d",
    "title": "Cars Simulator 3D",
    "category": "arcade",
    "description": "Pilote superesportivos com física realista em uma cidade aberta cheia de rampas.",
    "cover": "assets/covers/cars-simulator-3d.png",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "chess-classic",
    "title": "Xadrez Clássico",
    "category": "classico",
    "description": "O jogo de estratégia milenar: desafie a inteligência artificial com táticas geniais.",
    "cover": "assets/covers/chess-classic.png",
    "platform": "mobile",
    "popular": false,
    "recent": true
  },
  {
    "id": "chrome-dino",
    "title": "T-Rex Dino Runner",
    "category": "retro",
    "description": "O dinossauro sem internet: pule cactos e desvie de pterodáctilos no deserto.",
    "cover": "assets/covers/chrome-dino.png",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "cluster-rush",
    "title": "Cluster Rush",
    "category": "arcade",
    "description": "Pule de caminhão em caminhão em alta velocidade sem tocar no asfalto.",
    "cover": "assets/covers/cluster-rush.jpg",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "color-switch",
    "title": "Color Switch",
    "category": "arcade",
    "description": "Toque para fazer a bola quicar atravessando obstáculos da mesma cor.",
    "cover": "assets/covers/color-switch.png",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "cubefield",
    "title": "Cubefield",
    "category": "retro",
    "description": "Desvie em alta velocidade de um campo infinito de cubos coloridos.",
    "cover": "assets/covers/cubefield.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "dadish",
    "title": "Dadish",
    "category": "arcade",
    "description": "Um pai rabanete em busca de seus filhotes travessos pelo mundo vegetal.",
    "cover": "assets/covers/reviewed/dadish.jpg",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "dadish-2",
    "title": "Dadish 2",
    "category": "arcade",
    "description": "Segunda aventura do rabanete herói com veículos espaciais e novos perigos.",
    "cover": "assets/covers/dadish-2.jpg",
    "platform": "mobile",
    "popular": false,
    "recent": true
  },
  {
    "id": "dadish-3",
    "title": "Dadish 3",
    "category": "arcade",
    "description": "Mais fases criativas, piadas inteligentes e reencontros emocionantes de rabanetes.",
    "cover": "assets/covers/dadish-3.jpg",
    "platform": "mobile",
    "popular": false,
    "recent": true
  },
  {
    "id": "death-run-3d",
    "title": "Death Run 3D",
    "category": "arcade",
    "description": "Túnel ultrarrápido em primeira pessoa que testará seus reflexos ao limite.",
    "cover": "assets/covers/death-run-3d.png",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "doge-miner-2",
    "title": "Doge Miner 2",
    "category": "arcade",
    "description": "Ajude o cachorro Doge a minerar dogecoins suficientes para ir até a Lua!",
    "cover": "assets/covers/reviewed/doge-miner-2.webp",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "elastic-man",
    "title": "Elastic Man",
    "category": "arcade",
    "description": "Brinque e puxe a face elástica super realista em um sandbox divertido.",
    "cover": "assets/covers/elastic-man.jpg",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "evil-glitch",
    "title": "Evil Glitch",
    "category": "acao",
    "description": "Shooter retrô minimalista: enfrente anomalias digitais e corrupção no sistema.",
    "cover": "assets/covers/evil-glitch.jpeg",
    "platform": "arcade",
    "popular": false,
    "recent": true
  },
  {
    "id": "factory-balls-forever",
    "title": "Factory Balls Forever",
    "category": "puzzle",
    "description": "Pinte e customize as bolinhas na ordem certa usando chapéus e máscaras.",
    "cover": "assets/covers/reviewed/factory-balls-forever.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "flood-runner-2",
    "title": "Flood Runner 2",
    "category": "arcade",
    "description": "Corra de uma onda gigante de lava enquanto salta sobre dinossauros.",
    "cover": "assets/covers/flood-runner-2.svg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "fruit-ninja",
    "title": "Fruit Ninja Classic",
    "category": "arcade",
    "description": "Fatie melancias, maçãs e bananas no ar como um mestre espadachim.",
    "cover": "assets/covers/fruit-ninja.jpg",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "getting-over-it-scratch",
    "title": "Getting Over It",
    "category": "arcade",
    "description": "Escale montanhas íngremes usando apenas uma marreta e muita paciência.",
    "cover": "assets/covers/getting-over-it-scratch.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "google-snake-custom",
    "title": "Google Snake Especial",
    "category": "classico",
    "description": "A cobrinha mais famosa do mundo com maçãs suculentas e mapas coloridos.",
    "cover": "assets/covers/google-snake-custom.png",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "grow-in-the-hole",
    "title": "Grow In The Hole",
    "category": "arcade",
    "description": "Minigolfe excêntrico com buracos encolhendo e bolas gigantescas.",
    "cover": "assets/covers/reviewed/grow-in-the-hole.png",
    "platform": "arcade",
    "popular": false,
    "recent": true
  },
  {
    "id": "gunspin",
    "title": "Gunspin",
    "category": "arcade",
    "description": "Dispare no momento exato para fazer o revólver voar a distâncias recordes.",
    "cover": "assets/covers/reviewed/gunspin.jpg",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "house-of-hazards",
    "title": "House of Hazards",
    "category": "acao",
    "description": "Sobreviva às armadilhas da casa enquanto seus amigos tentam te derrubar.",
    "cover": "assets/covers/house-of-hazards.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "idle-breakout",
    "title": "Idle Breakout",
    "category": "puzzle",
    "description": "A fusão viciante do clássico Breakout com a mecânica de evolução ociosa.",
    "cover": "assets/covers/idle-breakout.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "interactive-buddy",
    "title": "Interactive Buddy",
    "category": "arcade",
    "description": "O clássico simulador de física: interaja com o boneco usando dezenas de itens.",
    "cover": "assets/covers/interactive-buddy.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "jelly-truck",
    "title": "Jelly Truck",
    "category": "arcade",
    "description": "Dirija um caminhão gelatinoso que amassa e estica por mundos elásticos.",
    "cover": "assets/covers/reviewed/jelly-truck.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "jetpack-joyride",
    "title": "Jetpack Joyride",
    "category": "arcade",
    "description": "Voe pelo laboratório secreto com sua mochila a jato movida a metralhadoras.",
    "cover": "assets/covers/reviewed/jetpack-joyride.png",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "just-fall-lol",
    "title": "Just Fall.LOL",
    "category": "arcade",
    "description": "Batalha de sobrevivência em plataformas hexagonais que caem no abismo.",
    "cover": "assets/covers/just-fall-lol.png",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "line-rider",
    "title": "Line Rider",
    "category": "arcade",
    "description": "Desenhe pistas com lápis e assista ao trenó deslizar com física fluida.",
    "cover": "assets/covers/reviewed/line-rider.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "madalin-stunt-cars-2",
    "title": "Madalin Stunt Cars 2",
    "category": "arcade",
    "description": "Supercarros tunados em um parque de acrobacias 3D com loops e saltos gigantes.",
    "cover": "assets/covers/madalin-stunt-cars-2.png",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "madalin-stunt-cars-3",
    "title": "Madalin Stunt Cars 3",
    "category": "arcade",
    "description": "Terceira geração com novos supercarros de corrida e pistas multiplayer insanas.",
    "cover": "assets/covers/reviewed/madalin-stunt-cars-3.jpg",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "meat-boy-flash",
    "title": "Meat Boy Original",
    "category": "acao",
    "description": "O protótipo que deu origem a Super Meat Boy: precisão cirúrgica e serras.",
    "cover": "assets/covers/meat-boy-flash.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "minecraft-classic",
    "title": "Minecraft Classic",
    "category": "puzzle",
    "description": "O clássico de construção 3D com 32 blocos e modo criativo infinito.",
    "cover": "assets/covers/minecraft-classic.png",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "my-friend-pedro-flash",
    "title": "My Friend Pedro",
    "category": "acao",
    "description": "Acrobacias em câmera lenta sob as ordens de uma banana falante.",
    "cover": "assets/covers/my-friend-pedro-flash.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "ninja-dash",
    "title": "Ninja Dash",
    "category": "acao",
    "description": "Salte entre telhados e corte inimigos silenciosamente na calada da noite.",
    "cover": "assets/covers/ninja-dash.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "ninja-vs-evilcorp",
    "title": "Ninja vs Evilcorp",
    "category": "acao",
    "description": "Infiltre-se no arranha-céu da corporação maligna usando técnicas ninja.",
    "cover": "assets/covers/ninja-vs-evilcorp.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "pacman-fps",
    "title": "Pac-Man FPS 3D",
    "category": "acao",
    "description": "Vivencie o labirinto de Pac-Man em primeira pessoa fugindo dos fantasmas.",
    "cover": "assets/covers/pacman-fps.jpg",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "portal-flash",
    "title": "Portal: The Flash Version",
    "category": "puzzle",
    "description": "A recriação 2D genial de Portal com arma de portais e física de impulso.",
    "cover": "assets/covers/portal-flash.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "plants-vs-zombies-web",
    "title": "Plants vs Zombies",
    "category": "puzzle",
    "description": "Plante girassóis e ervilhas no jardim para deter o apocalipse zumbi.",
    "cover": "assets/covers/plants-vs-zombies-web.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "rolly-vortex",
    "title": "Rolly Vortex",
    "category": "arcade",
    "description": "Role a bola por um túnel espiral evitando bloqueios que giram no ritmo.",
    "cover": "assets/covers/rolly-vortex.png",
    "platform": "mobile",
    "popular": false,
    "recent": true
  },
  {
    "id": "sandboxels",
    "title": "Sandboxels",
    "category": "puzzle",
    "description": "Simulador de física de partículas: combine elementos, fogo, água e reações químicas.",
    "cover": "assets/covers/sandboxels.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "short-life-2",
    "title": "Short Life 2",
    "category": "acao",
    "description": "Guie o personagem pelas armadilhas mais absurdas e dolorosas já criadas.",
    "cover": "assets/covers/short-life-2.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "short-ride",
    "title": "Short Ride",
    "category": "acao",
    "description": "Pedale e pilote veículos bizarros enquanto desvia de machados e bombas.",
    "cover": "assets/covers/short-ride.jpg",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "super-mario-63",
    "title": "Super Mario 63",
    "category": "arcade",
    "description": "Uma obra-prima do Flash: a fusão impecável de Super Mario 64 e Sunshine em 2D.",
    "cover": "assets/covers/super-mario-63.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "sonic-the-hedgehog",
    "title": "Sonic the Hedgehog",
    "category": "arcade",
    "description": "A lenda veloz da Sega: colete anéis e derrote Dr. Robotnik em alta velocidade.",
    "cover": "assets/covers/sonic-the-hedgehog.png",
    "platform": "retro",
    "popular": true,
    "recent": true
  },
  {
    "id": "spelunky-html5",
    "title": "Spelunky Classic",
    "category": "acao",
    "description": "Explore cavernas perigosas cheias de armadilhas, morcegos e tesouros de ouro.",
    "cover": "assets/covers/spelunky-html5.png",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "stick-archers-battle",
    "title": "Stick Archers Battle",
    "category": "acao",
    "description": "Duelos de arquearia com flechas especiais, vento dinâmico e mira calculada.",
    "cover": "assets/covers/stick-archers-battle.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "stickman-boost",
    "title": "Stickman Boost",
    "category": "acao",
    "description": "Corra em pistas aéreas usando planadores e molas gigantes de aceleração.",
    "cover": "assets/covers/stickman-boost.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "stickman-dismount",
    "title": "Stickman Dismount",
    "category": "arcade",
    "description": "Arremesse o boneco de palito por escadas e despenhadeiros para quebrar ossos.",
    "cover": "assets/covers/stickman-dismount.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "stickman-epic-battle",
    "title": "Stickman Epic Battle",
    "category": "acao",
    "description": "Lute contra mestres de artes marciais usando socos e voadoras devastadoras.",
    "cover": "assets/covers/stickman-epic-battle.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "stickman-golf",
    "title": "Stickman Golf",
    "category": "arcade",
    "description": "Acerte a bolinha de golfe em tacadas perfeitas através de colinas coloridas.",
    "cover": "assets/covers/stickman-golf.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "storm-the-house-2",
    "title": "Storm the House 2",
    "category": "acao",
    "description": "Defenda sua casa com atiradores, silos de mísseis e cercas elétricas.",
    "cover": "assets/covers/storm-the-house-2.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "tank-trouble-2",
    "title": "Tank Trouble 2",
    "category": "acao",
    "description": "Duelo épico de tanques em labirintos com balas que ricocheteiam na parede.",
    "cover": "assets/covers/tank-trouble-2.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "tanuki-sunset",
    "title": "Tanuki Sunset",
    "category": "arcade",
    "description": "Desça montanhas no skate como um guaxinim elegante ao som de lofi hip-hop.",
    "cover": "assets/covers/tanuki-sunset.png",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "the-final-earth-2",
    "title": "The Final Earth 2",
    "category": "puzzle",
    "description": "Construa uma colônia espacial próspera em planetas flutuantes no espaço.",
    "cover": "assets/covers/the-final-earth-2.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "tube-jumpers",
    "title": "Tube Jumpers",
    "category": "arcade",
    "description": "Pule na boia aquática para não cair na água cheia de tubarões e pedras.",
    "cover": "assets/covers/tube-jumpers.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "wordle-classic",
    "title": "Wordle Clássico",
    "category": "puzzle",
    "description": "Adivinhe a palavra secreta de cinco letras em apenas seis tentativas.",
    "cover": "assets/covers/wordle-classic.png",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "zombs-royale",
    "title": "Zombs Royale 2D",
    "category": "acao",
    "description": "Battle Royale 2D frenético: aterrisse de paraquedas e seja o último sobrevivente.",
    "cover": "assets/covers/zombs-royale.png",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "achievement-unlocked",
    "title": "Achievement Unlocked",
    "category": "puzzle",
    "description": "Desbloqueie todas as 100 conquistas bizarras pulando com o elefante azul.",
    "cover": "assets/covers/achievement-unlocked.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "adrenaline-challenge",
    "title": "Adrenaline Challenge",
    "category": "acao",
    "description": "Manobras acrobáticas radicais com motos de motocross em tubos suspensos.",
    "cover": "assets/covers/adrenaline-challenge.jpg",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "anti-terrorist-rush",
    "title": "Anti Terrorist Rush",
    "category": "acao",
    "description": "Operação de resgate tático com esquadrões de elite contra insurgentes.",
    "cover": "assets/covers/anti-terrorist-rush.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "asteroids-arcade",
    "title": "Asteroids Arcade",
    "category": "retro",
    "description": "O clássico espacial de 1979: destrua asteroides gigantes no vácuo do espaço.",
    "cover": "assets/covers/asteroids-arcade.jpg",
    "platform": "retro",
    "popular": false,
    "recent": true
  },
  {
    "id": "battle-for-gondor",
    "title": "Battle for Gondor",
    "category": "acao",
    "description": "Defenda os portões da cidade sagrada contra orcs e catapultas de guerra.",
    "cover": "assets/covers/battle-for-gondor.jpg",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "champion-archer",
    "title": "Champion Archer",
    "category": "acao",
    "description": "Ajuste o ângulo e a potência do arco para acertar os arqueiros inimigos.",
    "cover": "assets/covers/champion-archer.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "circloo",
    "title": "circlO",
    "category": "puzzle",
    "description": "Quebra-cabeça de física circular onde o círculo cresce a cada esfera coletada.",
    "cover": "assets/covers/circloo.png",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "city-blocks-2",
    "title": "City Blocks 2",
    "category": "puzzle",
    "description": "Combine construções idênticas para evoluir sua pequena vila em uma metrópole.",
    "cover": "assets/covers/city-blocks-2.png",
    "platform": "mobile",
    "popular": false,
    "recent": true
  },
  {
    "id": "core-ball",
    "title": "Core Ball",
    "category": "arcade",
    "description": "Espete os alfinetes na esfera giratória central sem que eles se toquem.",
    "cover": "assets/covers/core-ball.png",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "csgo-case-clicker",
    "title": "CS:GO Case Clicker",
    "category": "arcade",
    "description": "Abra caixas raras de CS:GO, ganhe facas lendárias e monte seu inventário.",
    "cover": "assets/covers/csgo-case-clicker.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "defend-the-tank",
    "title": "Defend The Tank",
    "category": "acao",
    "description": "Comande soldados especializados protegendo seu tanque de guerra em comboio.",
    "cover": "assets/covers/defend-the-tank.png",
    "platform": "mobile",
    "popular": false,
    "recent": true
  },
  {
    "id": "double-wires",
    "title": "Double Wires",
    "category": "arcade",
    "description": "Lance teias de aranha para balançar como o Homem-Aranha entre os obstáculos.",
    "cover": "assets/covers/double-wires.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "draw-the-hill",
    "title": "Draw The Hill",
    "category": "arcade",
    "description": "Desenhe o caminho do carro na tela para evitar buracos e colinas pontudas.",
    "cover": "assets/covers/draw-the-hill.png",
    "platform": "mobile",
    "popular": false,
    "recent": true
  },
  {
    "id": "duke-dashington",
    "title": "Duke Dashington",
    "category": "arcade",
    "description": "Aventureiro veloz com apenas 10 segundos para escapar de templos desabando.",
    "cover": "assets/covers/duke-dashington.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "edge-surf",
    "title": "Edge Surf",
    "category": "arcade",
    "description": "O clássico de surfe no gelo com ondas radicais, ilhas e o polvo gigante.",
    "cover": "assets/covers/edge-surf.png",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "finns-food-machine",
    "title": "Finn's Food Machine",
    "category": "puzzle",
    "description": "Construa engenhocas mirabolantes para alimentar o aventureiro Finn.",
    "cover": "assets/covers/finns-food-machine.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "friendly-fire",
    "title": "Friendly Fire",
    "category": "acao",
    "description": "Tiroteios cooperativos táticos onde cada tiro desviado pode acertar um aliado.",
    "cover": "assets/covers/friendly-fire.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "gravity-soccer",
    "title": "Gravity Soccer",
    "category": "puzzle",
    "description": "Destrua blocos e use a gravidade para chutar a bola direto para o gol.",
    "cover": "assets/covers/gravity-soccer.png",
    "platform": "mobile",
    "popular": false,
    "recent": true
  },
  {
    "id": "hacker-typer",
    "title": "Hacker Typer",
    "category": "retro",
    "description": "Digite qualquer tecla como um hacker profissional de cinema invadindo servidores.",
    "cover": "assets/covers/reviewed/hacker-typer.jpg",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "hex-empire",
    "title": "Hex Empire",
    "category": "puzzle",
    "description": "Conquiste capitais rivais em um mapa de blocos hexagonais estratégicos.",
    "cover": "assets/covers/hex-empire.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "icys-purple-head",
    "title": "Icy Purple Head",
    "category": "puzzle",
    "description": "Alterne entre gelo escorregadio e borracha adesiva para alcançar a caixa.",
    "cover": "assets/covers/icys-purple-head.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "kart-fight-io",
    "title": "Kart Fight.io",
    "category": "arcade",
    "description": "Empurre os outros pilotos de kart para fora da arena para crescer de tamanho.",
    "cover": "assets/covers/kart-fight-io.jpg",
    "platform": "arcade",
    "popular": false,
    "recent": true
  },
  {
    "id": "klocki",
    "title": "Klocki",
    "category": "puzzle",
    "description": "Quebra-cabeça relaxante de conectar linhas e padrões com trilha ambiente suave.",
    "cover": "assets/covers/klocki.jpg",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "linquest",
    "title": "Linquest",
    "category": "arcade",
    "description": "Aventura de plataforma retrô com gráficos pixelados e tesouros lendários.",
    "cover": "assets/covers/linquest.jpg",
    "platform": "arcade",
    "popular": false,
    "recent": true
  },
  {
    "id": "matrix-rampage",
    "title": "Matrix Rampage",
    "category": "acao",
    "description": "Lute contra centenas de Agentes Smith no topo de prédios usando artes marciais.",
    "cover": "assets/covers/matrix-rampage.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "mini-stilts",
    "title": "Mini Stilts",
    "category": "arcade",
    "description": "Ande sobre pernas de pau esticáveis para desviar de poços de lava e espinhos.",
    "cover": "assets/covers/mini-stilts.png",
    "platform": "arcade",
    "popular": false,
    "recent": true
  },
  {
    "id": "mini-putt",
    "title": "Mini Putt Clássico",
    "category": "classico",
    "description": "O clássico minigolfe em campos verdes com moinhos de vento e rampas.",
    "cover": "assets/covers/mini-putt.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "n-gon",
    "title": "n-gon",
    "category": "acao",
    "description": "Atirador dimensional em arena com armas de física quântica e partículas neon.",
    "cover": "assets/covers/n-gon.png",
    "platform": "arcade",
    "popular": false,
    "recent": true
  },
  {
    "id": "osu-web",
    "title": "osu! Web",
    "category": "arcade",
    "description": "Clique nos círculos no ritmo da música com precisão e velocidade insanas.",
    "cover": "assets/covers/osu-web.png",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "packabunchas",
    "title": "Packabunchas",
    "category": "puzzle",
    "description": "Encaixe monstrinhos de formatos diferentes dentro da nave de resgate.",
    "cover": "assets/covers/packabunchas.svg",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "particle-clicker",
    "title": "Particle Clicker",
    "category": "puzzle",
    "description": "Administre o grande colisor de hádrons e descubra novas partículas subatômicas.",
    "cover": "assets/covers/particle-clicker.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "quake-1k",
    "title": "Q1K3",
    "category": "acao",
    "description": "Incrível demake 3D de Quake em apenas um kilobyte de código JavaScript.",
    "cover": "assets/covers/quake-1k.jpg",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "roadblocks",
    "title": "Roadblocks",
    "category": "puzzle",
    "description": "Deslize cubos de concreto para criar pontes e caminhos seguros na estrada.",
    "cover": "assets/covers/roadblocks.svg",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "this-is-sand",
    "title": "This Is Sand",
    "category": "puzzle",
    "description": "Deixe a areia colorida escorrer para criar paisagens e montanhas artísticas.",
    "cover": "assets/covers/this-is-sand.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "senya-and-oscar-2",
    "title": "Senya & Oscar 2",
    "category": "acao",
    "description": "O gato mágico e o bravo cavaleiro enfrentando monstros em florestas encantadas.",
    "cover": "assets/covers/senya-and-oscar-2.svg",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "shift",
    "title": "Shift",
    "category": "puzzle",
    "description": "Aperte Shift para inverter preto e branco, virando o chão de cabeça para baixo.",
    "cover": "assets/covers/shift.svg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "skyblock-2d",
    "title": "Skyblock 2D",
    "category": "puzzle",
    "description": "Sobreviva em uma pequena ilha flutuante com apenas uma árvore e um balde.",
    "cover": "assets/covers/skyblock-2d.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "solitaire-classic",
    "title": "Paciência Clássica",
    "category": "classico",
    "description": "O clássico jogo de cartas: organize as fileiras em ordem do Ás até o Rei.",
    "cover": "assets/covers/reviewed/solitaire-classic.jpg",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "sort-the-court",
    "title": "Sort the Court",
    "category": "puzzle",
    "description": "Governe seu reino dizendo apenas Sim ou Não para plebeus, magos e dragões.",
    "cover": "assets/covers/sort-the-court.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "tactical-assassin-2",
    "title": "Tactical Assassin 2",
    "category": "acao",
    "description": "Missões de sniper calculadas com rifle de precisão e alvos silenciosos.",
    "cover": "assets/covers/tactical-assassin-2.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "tower-master",
    "title": "Tower Master",
    "category": "arcade",
    "description": "Solte os andares do prédio no momento exato para construir a torre mais alta.",
    "cover": "assets/covers/tower-master.png",
    "platform": "mobile",
    "popular": false,
    "recent": true
  },
  {
    "id": "townscaper-web",
    "title": "Townscaper Web",
    "category": "puzzle",
    "description": "Construa cidades pitorescas à beira-mar com pontes, torres e arcos de conto de fadas.",
    "cover": "assets/covers/townscaper-web.jpg",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "trimps",
    "title": "Trimps",
    "category": "puzzle",
    "description": "RPG estratégico incremental: recrute criaturas e explore mapas infinitos.",
    "cover": "assets/covers/trimps.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "up-left-out",
    "title": "Up Left Out",
    "category": "puzzle",
    "description": "Desbloqueie todos os pinos deslizando elementos de madeira em paz e tranquilidade.",
    "cover": "assets/covers/up-left-out.svg",
    "platform": "mobile",
    "popular": false,
    "recent": true
  },
  {
    "id": "wolfenstein-3d",
    "title": "Wolfenstein 3D",
    "category": "retro",
    "description": "O pioneiro dos jogos de tiro em primeira pessoa: escape do castelo nazista.",
    "cover": "assets/covers/wolfenstein-3d.png",
    "platform": "retro",
    "popular": true,
    "recent": true
  },
  {
    "id": "yoshi-fabrication",
    "title": "Yoshi Fabrication",
    "category": "arcade",
    "description": "Crie e jogue fases de plataforma personalizadas estrelando o simpático Yoshi.",
    "cover": "assets/covers/yoshi-fabrication.png",
    "platform": "arcade",
    "popular": false,
    "recent": true
  },
  {
    "id": "10-minutes-till-dawn",
    "title": "10 Minutes Till Dawn",
    "category": "acao",
    "description": "Sobreviva 10 minutos contra levas infinitas de monstros das trevas com armas mágicas.",
    "cover": "assets/covers/10-minutes-till-dawn.png",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "8-ball-billiards",
    "title": "Sinuca 8 Ball Clássica",
    "category": "classico",
    "description": "Mire, calcule o efeito e encaçape todas as bolas de sinuca com maestria.",
    "cover": "assets/covers/8-ball-billiards.png",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "doge-miner",
    "title": "Doge Miner",
    "category": "arcade",
    "description": "Minere dogecoins até comprar sua primeira nave espacial para a Lua!",
    "cover": "assets/covers/doge-miner.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "fullscreen-mario",
    "title": "Super Mario Bros Full",
    "category": "retro",
    "description": "O clássico Super Mario Bros do Nintendinho jogável em tela cheia no navegador.",
    "cover": "assets/covers/fullscreen-mario.png",
    "platform": "retro",
    "popular": true,
    "recent": true
  },
  {
    "id": "black-knight",
    "title": "Black Knight",
    "category": "acao",
    "description": "Colete impostos e enfrente multidões rebeldes a mando do rei ganancioso.",
    "cover": "assets/covers/black-knight.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "cell-machine",
    "title": "Cell Machine",
    "category": "puzzle",
    "description": "Posicione células motoras, rotativas e destrutivas para resolver quebra-cabeças lógicos.",
    "cover": "assets/covers/cell-machine.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "deal-or-no-deal",
    "title": "Topa ou Não Topa",
    "category": "classico",
    "description": "Escolha sua maleta da sorte e negocie ofertas milionárias com o banqueiro.",
    "cover": "assets/covers/deal-or-no-deal.jpg",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "flappy-2048",
    "title": "Flappy 2048",
    "category": "arcade",
    "description": "A fusão hilária de Flappy Bird com 2048: voe e combine blocos numéricos.",
    "cover": "assets/covers/flappy-2048.png",
    "platform": "arcade",
    "popular": false,
    "recent": true
  },
  {
    "id": "google-solitaire",
    "title": "Google Paciência",
    "category": "classico",
    "description": "A versão limpa e colorida de paciência criada pelo Google com dois níveis.",
    "cover": "assets/covers/google-solitaire.png",
    "platform": "arcade",
    "popular": false,
    "recent": true
  },
  {
    "id": "super-smash-flash-2",
    "title": "Super Smash Flash",
    "category": "acao",
    "description": "Lute como Mario, Sonic, Goku e Naruto nas arenas clássicas de Smash.",
    "cover": "assets/covers/super-smash-flash-2.png",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "stickman-survival",
    "title": "Stickman Survival",
    "category": "acao",
    "description": "Atire contra ondas de inimigos armados e resista o máximo de tempo na trincheira.",
    "cover": "assets/covers/stickman-survival.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "indian-truck-simulator",
    "title": "Indian Truck 3D",
    "category": "arcade",
    "description": "Dirija caminhões decorados por estradas de montanha perigosas com cargas pesadas.",
    "cover": "assets/covers/indian-truck-simulator.png",
    "platform": "arcade",
    "popular": false,
    "recent": true
  },
  {
    "id": "geometry-dash",
    "title": "Geometry Dash",
    "category": "arcade",
    "description": "Pule e voe pelo perigo com ritmo musical em fases geométricas cheias de espinhos.",
    "cover": "assets/covers/geometry-dash.png",
    "platform": "mobile",
    "popular": true,
    "recent": true
  },
  {
    "id": "endless-war-3",
    "title": "Endless War 3",
    "category": "acao",
    "description": "Batalhas históricas da Segunda Guerra Mundial com tanques e fuzileiros.",
    "cover": "assets/covers/endless-war-3.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "kitten-cannon",
    "title": "Kitten Cannon",
    "category": "arcade",
    "description": "Dispare o gatinho pelo canhão e atinja dinamites para voar quilômetros!",
    "cover": "assets/covers/kitten-cannon.jpg",
    "platform": "flash",
    "popular": true,
    "recent": true
  },
  {
    "id": "krunker-web",
    "title": "Krunker.io",
    "category": "acao",
    "description": "FPS veloz em primeira pessoa estilo pixelado com saltos deslizantes e rifles.",
    "cover": "assets/covers/krunker-web.png",
    "platform": "arcade",
    "popular": true,
    "recent": true
  },
  {
    "id": "idle-shark",
    "title": "Idle Shark",
    "category": "arcade",
    "description": "Controle um tubarão feroz nas profundezas do oceano e devore cardumes.",
    "cover": "assets/covers/idle-shark.png",
    "platform": "flash",
    "popular": false,
    "recent": true
  },
  {
    "id": "dragon-vs-bricks",
    "title": "Dragon vs Bricks",
    "category": "arcade",
    "description": "Guie o dragão de esferas quebrando blocos numerados pelo caminho.",
    "cover": "assets/covers/dragon-vs-bricks.jpg",
    "platform": "mobile",
    "popular": false,
    "recent": true
  },
  {
    "id": "doctor-acorn-2",
    "title": "Doctor Acorn 2",
    "category": "puzzle",
    "description": "Ajude a bolota médica a voar de paraquedas e resgatar pássaros doentes.",
    "cover": "assets/covers/doctor-acorn-2.png",
    "platform": "mobile",
    "popular": false,
    "recent": true
  },
  {
    "id": "froggys-battle",
    "title": "Froggy's Battle",
    "category": "arcade",
    "description": "O sapinho guerreiro enfrentando monstros com combos e espadadas giratórias.",
    "cover": "assets/covers/froggys-battle.jpg",
    "platform": "arcade",
    "popular": false,
    "recent": true
  },
  {
    "id": "golf-classic",
    "title": "Golf Clássico",
    "category": "classico",
    "description": "Dê tacadas precisas lendo o relevo do campo e a força do vento.",
    "cover": "assets/covers/golf-classic.jpg",
    "platform": "arcade",
    "popular": false,
    "recent": true
  },
  {
    "id": "fnaf-night-at-mythius",
    "title": "FNAF: Night at Mythius",
    "category": "terror",
    "platform": "html5",
    "fnaf": true,
    "recent": true,
    "description": "Fangame independente de Matthias Southwick: vigie as câmeras e sobreviva no escritório.",
    "cover": "assets/covers/reviewed/fnaf-night-at-mythius.jpg"
  },
  {
    "id": "fnaf-security-console",
    "title": "FNAF: Security Console",
    "category": "terror",
    "platform": "html5",
    "fnaf": true,
    "recent": true,
    "description": "Fangame de Scald: use comandos para vigiar câmeras, explorar e se esconder.",
    "cover": "assets/covers/reviewed/fnaf-security-console.jpg"
  },
  {
    "id": "gta-san-andreas",
    "title": "GTA: San Andreas (2D Demake)",
    "category": "acao",
    "platform": "console",
    "recent": true,
    "popular": true,
    "description": "Demake 2D em Los Santos: ande pela cidade, dirija carros, fuja da policia e explore o mapa.",
    "cover": "assets/covers/gta-san-andreas.jpg"
  },
  {
    "id": "crash-bandicoot",
    "title": "Crash Bandicoot",
    "category": "classico",
    "platform": "console",
    "recent": true,
    "popular": true,
    "description": "O clássico do PlayStation: corra pela ilha, gire contra inimigos, destrua caixas e colete Wumpas.",
    "cover": "assets/covers/crash-bandicoot.jpg"
  },
  {
    "id": "crazy-taxi",
    "title": "Crazy Taxi",
    "category": "arcade",
    "platform": "arcade",
    "recent": true,
    "popular": true,
    "description": "O clássico de Dreamcast e fliperama: pegue passageiros, faça manobras insanas e ganhe dinheiro rápido.",
    "cover": "assets/covers/crazy-taxi.jpg"
  },
  {
    "id": "basket-random",
    "title": "Basket Random",
    "category": "classico",
    "platform": "html5",
    "recent": true,
    "popular": true,
    "description": "Basquete ragdoll com física maluca! Pule e balance os braços para fazer cestas em quadras aleatórias.",
    "cover": "assets/covers/basket-random.jpg"
  }
];
const labels={todos:'Todos os jogos',recentes:'Novos jogos',populares:'Em alta',favoritos:'Meus favoritos',arcade:'Arcade',puzzle:'Puzzle',classico:'Clássicos',acao:'Ação',retro:'Retrô',leves:'Jogos leves',mobile:'Mobile → PC',console:'Console Port',flash:'Estilo Flash',terror:'Terror',fnaf:'FNAF — jogos de fãs'};
const HEAVY_GAMES = new Set([
  'slope',
  'mario64-cleanroom',
  'zelda-tribute',
  'krunker-web',
  'smash-karts'
]);
const FEATURED_GAMES = new Set([
  'slope',
  'subway-surfers',
  'temple-run-2',
  'geometry-dash',
  'fireboy-and-watergirl',
  'bad-ice-cream',
  'moto-x3m',
  'papas-pizzeria',
  'age-of-war',
  'vex-3',
  'super-mario-63',
  'bloxorz',
  'duck-life'
]);


const library = window.PlaynovaLibrary || window.FrivDigitalLibrary;
library.configure(GAMES_DATA);
window.PlaynovaCatalog = GAMES_DATA; window.FrivDigitalCatalog = GAMES_DATA;
const ROOT_URL = new URL('../', document.currentScript.src);
let currentCat='todos', searchQ='', currentControl='', currentCollection='', currentSort='recommended';
let favorites=library.favorites(), recentPlayed=library.recents();
const normalize=text=>String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const esc=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const feature=g=>(window.PlaynovaGameFeatures||window.FrivDigitalGameFeatures)?.[g.id]||{};
const isAvailable=id=>(window.PlaynovaGameAvailability||window.FrivDigitalGameAvailability)?.[id]?.status==='available';
let onlyAvailable=new URLSearchParams(location.search).get('disponiveis')==='1';
const gameRoute=id=>`games/${encodeURIComponent(id)}/index.html`;
function recordRecent(id){if(isAvailable(id))library.record(id);}
function filterGames(){
  const collection=library.collections().find(c=>c.id===currentCollection);
  const result=GAMES_DATA.filter(g=>{
    const category=currentCat==='todos'||(currentCat==='fnaf'?Boolean(g.fnaf):currentCat==='favoritos'?favorites.includes(g.id):currentCat==='recentes'?g.recent:currentCat==='populares'?g.popular:currentCat==='leves'?!HEAVY_GAMES.has(g.id):['mobile','console','flash'].includes(currentCat)?g.platform===currentCat:g.category===currentCat);
    const f=feature(g); const controls=!currentControl||(currentControl==='two'?(f.players||1)>=2:currentControl==='gamepad'?f.controls?.gamepad:currentControl==='touch'?f.controls?.touch:f.controls?.keyboard);
    return category&&controls&&(!onlyAvailable||isAvailable(g.id))&&(!collection||collection.games.includes(g.id))&&normalize(`${g.title} ${g.description} ${labels[g.category]||''}`).includes(normalize(searchQ.trim()));
  });
  if(currentSort==='name')result.sort((a,b)=>a.title.localeCompare(b.title,'pt-BR'));
  if(currentSort==='recent')result.sort((a,b)=>(recentPlayed.includes(a.id)?recentPlayed.indexOf(a.id):999)-(recentPlayed.includes(b.id)?recentPlayed.indexOf(b.id):999));
  return result;
}
function icon(name){return (window.PlaynovaIcons||window.FrivDigitalIcons).markup(name);}
function bindCoverFallback(image,title){image.addEventListener('error',()=>{if(image.dataset.fallback)return;image.dataset.fallback='true';image.src='assets/covers/unavailable.svg';image.alt=`${title} — capa indisponível`;});}
function renderRecentPlayed(){
  const section=document.getElementById('recent-played-section'),container=document.getElementById('recent-list');
  if(!section||!container)return;
  section.hidden=!recentPlayed.some(isAvailable)||Boolean(searchQ.trim())||currentCat!=='todos'||Boolean(currentControl)||Boolean(currentCollection);
  container.replaceChildren();if(section.hidden)return;
  for(const id of recentPlayed){
    const g=library.game(id);if(!g||!isAvailable(id))continue;
    const a=document.createElement('a');a.className='recent-card';a.href=gameRoute(g.id);a.title=`Jogar ${g.title} novamente`;
    a.innerHTML=`<img src="${esc(g.cover||`assets/covers/${g.id}.svg`)}" alt="" width="48" height="48" loading="lazy"><span class="recent-info"><strong>${esc(g.title)}</strong><span>${icon('play')}Jogar novamente</span></span>`;
    a.addEventListener('click',()=>recordRecent(id));bindCoverFallback(a.querySelector('img'),g.title);container.append(a);
  }
}
function syncCollectionOptions(){
  const select=document.getElementById('collection-filter');if(!select)return;
  const collections=library.collections();if(currentCollection&&!collections.some(c=>c.id===currentCollection))currentCollection='';
  select.replaceChildren(new Option('Todas as listas',''));
  for(const c of collections)select.add(new Option(`${c.name} (${c.games.length})`,c.id));
  select.value=currentCollection;
}
function controlPills(g){const f=feature(g);const pills=[];if((f.players||1)>=2)pills.push('2 jogadores');if(f.controls?.gamepad)pills.push('Controle');if(f.controls?.touch)pills.push('Toque');return pills.slice(0,2).map(v=>`<span class="control-pill">${v}</span>`).join('');}
function renderAll(focusFavorite){
  favorites=library.favorites();recentPlayed=library.recents();syncCollectionOptions();
  const grid=document.getElementById('games-grid'),games=filterGames();grid.replaceChildren();
  const filtered=Boolean(searchQ.trim()||currentControl||currentCollection||currentCat!=='todos'||onlyAvailable);
  const collection=library.collections().find(c=>c.id===currentCollection);
  document.getElementById('grid-title').textContent=searchQ.trim()?'Resultado da busca':collection?.name||labels[currentCat]||'Todos os jogos';
  document.getElementById('grid-counter').textContent=`${games.length} jogos · ${games.filter(g=>isAvailable(g.id)).length} com abertura verificada`;
  document.getElementById('only-available')?.setAttribute('aria-pressed',String(onlyAvailable));
  document.getElementById('fav-count').textContent=favorites.length;
  document.getElementById('reset-filters').hidden=!filtered;
  document.getElementById('filter-note').hidden=!currentControl;
  renderRecentPlayed();
  for(const g of games){
    const card=document.createElement('article');card.dataset.gameId=g.id;
    card.className='game-card';const fav=favorites.includes(g.id);
    const badge='';
    card.innerHTML=`<a href="${gameRoute(g.id)}" class="game-thumb-link" title="${esc(g.title+' — '+g.description)}"><img class="game-cover" src="${esc(g.cover||`assets/covers/${g.id}.svg`)}" alt="${esc(g.title)}" width="256" height="256" loading="lazy" decoding="async"><span class="play-overlay" aria-hidden="true"><span>${icon('play')}</span></span>${badge}</a><button class="btn-favorite ${fav?'active':''}" data-id="${esc(g.id)}" aria-label="${fav?'Remover':'Adicionar'} ${esc(g.title)} ${fav?'dos':'aos'} favoritos" aria-pressed="${fav}">${icon('star')}</button><div class="game-details"><a class="game-name" href="${gameRoute(g.id)}" title="${esc(g.title)}">${esc(g.title)}</a></div>`;
    for(const a of card.querySelectorAll('a'))a.addEventListener('click',()=>recordRecent(g.id));
    card.querySelector('.btn-favorite').onclick=()=>{library.toggleFavorite(g.id);document.querySelector(`[data-id="${CSS.escape(g.id)}"]`)?.focus();};
    const state=(window.PlaynovaGameAvailability||window.FrivDigitalGameAvailability)?.[g.id];
    card.dataset.availability=state?.status||'pending';
    if(!isAvailable(g.id)){
      card.classList.remove('featured-card');
      card.querySelector('.new-badge')?.remove();
      const status=document.createElement('span');status.className='availability-label status-corner';status.textContent=state?.status==='issues'?'Com falhas':'Sem arquivos';
      card.querySelector('.game-thumb-link').append(status);
      const overlay=card.querySelector('.play-overlay');overlay.textContent=state?.status==='issues'?'Tentar jogar':'Ver status';
    }
    bindCoverFallback(card.querySelector('img'),g.title);grid.append(card);
  }
  if(!games.length){
    const empty=document.createElement('div');empty.className='empty-state';
    empty.innerHTML='<h2>Nenhum jogo nesta seleção</h2><p>Experimente outra busca, escolha uma lista diferente ou limpe os filtros.</p><button type="button">Limpar filtros</button>';empty.querySelector('button').onclick=resetFilters;grid.append(empty);
  }
  if(typeof focusFavorite==='string')document.querySelector(`[data-id="${CSS.escape(focusFavorite)}"]`)?.focus();
}
function selectCategory(cat){currentCat=cat;document.querySelectorAll('[data-cat]').forEach(button=>{const active=button.dataset.cat===cat;button.classList.toggle('active',active);button.setAttribute('aria-pressed',active);});renderAll();}
function resetFilters(){searchQ='';currentControl='';currentCollection='';currentSort='recommended';onlyAvailable=false;document.getElementById('search-input').value='';document.getElementById('control-filter').value='';document.getElementById('sort-games').value='recommended';selectCategory('todos');}
for(const button of document.querySelectorAll('[data-cat]'))button.onclick=()=>selectCategory(button.dataset.cat);
document.getElementById('search-input').addEventListener('input',event=>{searchQ=event.target.value;if(normalize(searchQ).includes('samuel'))window.triggerEasterEgg?.();renderAll();});
document.getElementById('search-form').addEventListener('submit',event=>{event.preventDefault();if(normalize(searchQ).includes('samuel'))window.triggerEasterEgg?.();renderAll();});
document.getElementById('control-filter').onchange=event=>{currentControl=event.target.value;renderAll();};
document.getElementById('collection-filter')?.addEventListener('change',event=>{currentCollection=event.target.value;renderAll();});
document.getElementById('sort-games').onchange=event=>{currentSort=event.target.value;renderAll();};
document.getElementById('reset-filters').onclick=resetFilters;
document.getElementById('manage-collections')?.addEventListener('click',()=>(window.PlaynovaCommunity||window.FrivDigitalCommunity)?.collections());
document.getElementById('request-game').onclick=()=>(window.PlaynovaCommunity||window.FrivDigitalCommunity)?.request();
document.getElementById('report-site')?.addEventListener('click',()=>(window.PlaynovaCommunity||window.FrivDigitalCommunity)?.report());
document.getElementById('clear-recent').onclick=()=>library.clearHistory();
document.getElementById('only-available')?.addEventListener('click',()=>{onlyAvailable=!onlyAvailable;renderAll();});
document.addEventListener('playnova:library-change',event=>{if(event.detail?.type==='history'){recentPlayed=library.recents();requestAnimationFrame(renderRecentPlayed);}else renderAll();});
document.addEventListener('playnova:open-collection',event=>{currentCollection=event.detail;selectCategory('todos');document.getElementById('catalogo').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});});
const initialFilter=new URLSearchParams(location.search).get('filtro');
if(initialFilter&&Object.hasOwn(labels,initialFilter))selectCategory(initialFilter);else renderAll();
document.title=`FRIV DIGITAL — ${GAMES_DATA.length} jogos no catálogo`;
