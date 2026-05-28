// =====================
// SONIDOS
// =====================
const sounds = {
  attack: new Audio("https://play.pokemonshowdown.com/audio/attack-hit.mp3"),
  heal: new Audio("https://play.pokemonshowdown.com/audio/heal.wav"),
  click: new Audio("https://play.pokemonshowdown.com/audio/click.wav")
};

function playSound(s){
  if(sounds[s]){
    sounds[s].currentTime = 0;
    sounds[s].play();
  }
}

// =====================
// POKÉMON DATA
// =====================
const pokemons = [
  { name:"Charmander", type:"fire", hp:100, atk:20, def:10 },
  { name:"Charmeleon", type:"fire", hp:130, atk:30, def:15 },
  { name:"Charizard", type:"fire", hp:170, atk:45, def:20 },

  { name:"Squirtle", type:"water", hp:110, atk:18, def:20 },
  { name:"Wartortle", type:"water", hp:140, atk:28, def:25 },
  { name:"Blastoise", type:"water", hp:180, atk:40, def:35 },

  { name:"Bulbasaur", type:"grass", hp:105, atk:18, def:15 },
  { name:"Ivysaur", type:"grass", hp:135, atk:28, def:20 },
  { name:"Venusaur", type:"grass", hp:175, atk:40, def:30 },

  { name:"Pikachu", type:"electric", hp:95, atk:35, def:10 },
  { name:"Raichu", type:"electric", hp:140, atk:50, def:20 },

  { name:"Eevee", type:"normal", hp:120, atk:25, def:20 },

  { name:"Machop", type:"fighting", hp:130, atk:35, def:25 },
  { name:"Machoke", type:"fighting", hp:160, atk:45, def:35 },
  { name:"Machamp", type:"fighting", hp:200, atk:60, def:45 },
];

// =====================
// SPRITES POKEAPI
// =====================
function getSprite(name){
  const map = {
    Charmander:4, Charmeleon:5, Charizard:6,
    Squirtle:7, Wartortle:8, Blastoise:9,
    Bulbasaur:1, Ivysaur:2, Venusaur:3,
    Pikachu:25, Raichu:26,
    Eevee:133,
    Machop:66, Machoke:67, Machamp:68
  };

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${map[name]}.png`;
}

// =====================
// STATE
// =====================
let playerTeam = [clone("Charmander"), clone("Pikachu"), clone("Squirtle")];
let enemyTeam = [clone("Bulbasaur"), clone("Machop"), clone("Eevee")];

let player = playerTeam[0];
let enemy = enemyTeam[0];

player.currentHp = player.hp;
enemy.currentHp = enemy.hp;

player.energy = 50;
enemy.energy = 50;

let logBox = document.getElementById("log");

// =====================
function clone(name){
  return JSON.parse(JSON.stringify(pokemons.find(p=>p.name===name)));
}

function log(msg){
  logBox.innerHTML += `<div>${msg}</div>`;
  logBox.scrollTop = logBox.scrollHeight;
}

// =====================
// UPDATE
// =====================
function update(){

  document.getElementById("playerName").innerText = player.name;
  document.getElementById("enemyName").innerText = enemy.name;

  document.getElementById("playerHp").style.width =
    (player.currentHp/player.hp*100)+"%";

  document.getElementById("enemyHp").style.width =
    (enemy.currentHp/enemy.hp*100)+"%";

  document.getElementById("playerEnergy").style.width =
    player.energy+"%";

  document.getElementById("enemyEnergy").style.width =
    enemy.energy+"%";

  document.getElementById("playerSprite").innerHTML =
    `<img src="${getSprite(player.name)}">`;

  document.getElementById("enemySprite").innerHTML =
    `<img src="${getSprite(enemy.name)}">`;
}

// =====================
// COMBATE
// =====================
function attack(){
  playSound("attack");

  let dmg = Math.max(5, player.atk - enemy.def/2);
  enemy.currentHp -= dmg;

  log(`${player.name} hace ${dmg} daño`);

  if(enemy.currentHp <= 0){
    log(`${enemy.name} debilitado!`);
    nextEnemy();
  }

  update();
  setTimeout(enemyTurn, 800);
}

function special(){
  if(player.energy < 20) return log("No energía");

  player.energy -= 20;
  playSound("attack");

  let dmg = player.atk * 1.8;
  enemy.currentHp -= dmg;

  log("Ataque especial!");

  update();
  setTimeout(enemyTurn, 800);
}

function heal(){
  player.currentHp = Math.min(player.hp, player.currentHp + 30);
  playSound("heal");

  log(`${player.name} se cura`);

  update();
  setTimeout(enemyTurn, 800);
}

function switchPokemon(){
  playSound("click");

  playerTeam.push(playerTeam.shift());
  player = playerTeam[0];
  player.currentHp = player.hp;

  log(`Cambio a ${player.name}`);
  update();
}

// =====================
function enemyTurn(){
  let dmg = Math.max(5, enemy.atk - player.def/2);
  player.currentHp -= dmg;

  log(`${enemy.name} ataca`);

  update();
}

function nextEnemy(){
  enemyTeam.push(enemyTeam.shift());
  enemy = enemyTeam[0];
  enemy.currentHp = enemy.hp;

  log(`Nuevo enemigo: ${enemy.name}`);
  update();
}

// =====================
update();
log("Batalla iniciada!");