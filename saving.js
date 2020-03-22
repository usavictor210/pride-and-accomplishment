function ex(x) { // Patcail's
  let nex = E(0);
  nex.array = x.array;
  nex.sign = x.sign;
  nex.layer = x.layer;
  return nex;
}

function save() { // Katakana's, from this
	localStorage.setItem('paacsv', btoa(JSON.stringify(Game)));
}

function wipe() { // Reinhardt's, from TI
	if (confirm('Do you really want to wipe this save?')) {
		Game = {
      version: 3,
      dop: E(0),
      highestDop: E(1),
      gens: E(0),
      genCost: E(10),
      dps: E(1),
      currentTab: "generator",
      achr1s: E(0),
      achr1req: E(10),
      achr1mlt: E(1),
      achr1t: E(0),
      achr1bfr: E(0),
      prstUnl: false,
      prestUpgRebuyable: [false,false,true],
      prestUpgs: [false,false,E(0)],
      prestUpgCosts: [E("e10"),E("e20"),E("e30")],
    }
	}
}

// Retrieve your data from the depths of the localStorage variable...
function load(x) { // Patcail's, from "5 hours"
  if (typeof x == "string") {
    let load = JSON.parse(atob(x))
    let loadCounter
    var i;
    for (loadCounter in load) {
      Game[loadCounter] = load[loadCounter]
    }
    Game.dop = ex(Game.dop);
    Game.highestDop = ex(Game.highestDop);
    Game.gens = ex(Game.gens);
    Game.achr1s = ex(Game.achr1s);
    Game.achr1req = ex(Game.achr1req);
    Game.achr1mlt = ex(Game.achr1mlt);
    Game.achr1t = ex(Game.achr1t);
    Game.achr1bfr = ex(Game.achr1bfr);
    for (i in Game.prestUpgs){
      if(typeof Game.prestUpgs[i] != "boolean"){
        Game.prestUpgs[i] = ex(Game.prestUpgs[i]);
      }
    }
    for(i in Game.prestUpgCosts){
      Game.prestUpgCosts[i] = ex(Game.prestUpgCosts[i]);
    }
  }
  if(Game.version == 0){
    Game.version = 1;
    Game.currentTab = "generator";
  }
  if(Game.version == 1){
    Game.version = 2;
    Game.achr1s = E(0);
    Game.achr1bfr = E(0);
    Game.highestDop = E(1);
  }
  if(Game.version == 2){
    Game.version = 3;
    Game.prstUnl = false;
  }
}
