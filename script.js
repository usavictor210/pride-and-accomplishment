/* NOTE TO SELF:
Whenever updating the 'Game' variable, update saving.js to fit the new game variable.

If this is meant to become a new version of the game, increment 'version' and add new version-specific code in 'load(x)' in saving.js.
This is meant to prevent silly mistakes about not syncing the code properly.
*/

let E = x => {
  return new ExpantaNum(x); // Ignore
}

var EN = ExpantaNum;

let update = x =>{
  return document.getElementById(x);
}

var Game = {
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

var now = Date.now();
var diff = 0;

load(localStorage.getItem("paacsv"));

setInterval(save);

function notate(x,r = 2){
  if(x.lt(1e6)){
    return x.toNumber().toFixed(r);
  } else if(x.lt(E("ee6"))){
    return x.div(E(10).pow(x.log10().floor())).toNumber().toFixed(2) + "e" + x.log10().floor();
  } else {
    return "e" + notate(x.log10());
  }
}

function buyMult(amt){
  if(amt == 1){
    if(Game.dop.gte(Game.genCost)){
      Game.dop = Game.dop.sub(Game.genCost);
      Game.gens = Game.gens.add(1);
    }
  }
  if(amt == "max"){
    var origDop = Game.dop;
    Game.dop = Game.dop.sub(EN.sumGeometricSeries(EN.affordGeometricSeries(Game.dop,E(10),E(2),Game.gens),E(10),E(2),Game.gens));
    Game.gens = Game.gens.add(EN.affordGeometricSeries(origDop,E(10),E(2),Game.gens));
  }
}

function prestige(){
  Game.achr1bfr = Game.achr1t;
  Game.dop = E(0);
  Game.highestDop = E(1);
  Game.gens = E(0);
  Game.genCost = E(10);
  Game.dps = E(1);
  Game.achr1s = E(0);
  Game.achr1req = E(10);
  Game.achr1mlt = E(1);
}

function buyPrestUpg(upg,mode = 0){
  if(mode == 0){
  if(Game.achr1bfr.gte(Game.prestUpgCosts[upg]) && Game.prestUpgs[upg] != true){
    Game.achr1bfr = Game.achr1bfr.sub(Game.prestUpgCosts[upg]);
    if(Game.prestUpgRebuyable[upg] == false){
      Game.prestUpgs[upg] = true;
    } else {
      Game.prestUpgs[upg] = Game.prestUpgs[upg].add(1);
      if(upg == 3 && Game.prestUpgs[3].eq(10)){
        Game.prestUpgs[upg] = true;
      }
    }
  }
  } else {
  if(Game.achr1bfr.gte(Game.prestUpgCosts[upg]) && Game.prestUpgs[upg] != true){
    return "lightblue";
  }
  if(!Game.achr1bfr.gte(Game.prestUpgCosts[upg])){
    return "pink";
  }
  if(Game.prestUpgs[upg] == true){
    return "lightgreen";
  }
  }
}

function doCalculations(){
  diff = Date.now()-now;
  Game.genCost = E(2).pow(E(Game.gens)).mul(10);
  Game.dps = E(1.8).pow(E(Game.gens)).mul(Game.achr1mlt);
  Game.dop = E(Game.dop).add(Game.dps.mul(E(diff).div(1000)));
  if(Game.dop.gt(Game.highestDop)){
    Game.highestDop = Game.dop;
  }
  Game.achr1s = Game.highestDop.log10().floor();
  Game.achr1req = E(10).pow(Game.achr1s.add(1));
  Game.achr1t = Game.achr1bfr.add(Game.achr1s);
  Game.achr1mlt = E(1.01).pow(Game.achr1t);
  if(Game.prstUnl || Game.highestDop.gte(E("e6"))){
    for(var i = 0; i < document.getElementsByClassName("prestige").length; i++){
      document.getElementsByClassName("prestige")[i].style.display = "inline";
    }
    Game.prstUnl = true;
  } else {
    for(var i = 0; i < document.getElementsByClassName("prestige").length; i++){
      document.getElementsByClassName("prestige")[i].style.display = "none";
    }
    Game.prstUnl = false;
  }
  if(Game.prestUpgs[0]){
    buyMult("max");
  }
  now = Date.now();
}

function switchTabs(dest){
  update("options").style.display = "none";
  update("generator").style.display = "none";
  update("achievements").style.display = "none";
  update("prestige").style.display = "none";
  Game.currentTab = dest;
  update(Game.currentTab).style.display = "block";
}

switchTabs(Game.currentTab);

function updateText(){
  update("dopamineDisplay").textContent = notate(E(Game.dop));
  update("dopamineProduction").textContent = notate(Game.dps);
  update("dopeUpgCost").textContent = notate(Game.genCost,0);
  update("achr1").textContent = notate(Game.achr1s,0);
  update("achr1bon").textContent = notate(Game.achr1mlt) + "x";
  update("achr1req").textContent = notate(Game.achr1req,0);
  update("bAchs").textContent = notate(Game.achr1bfr,0);
}

function updateStyles(){
  
}

function loop(){
  doCalculations();
  updateText();
}

setInterval(loop,1000/30);

setInterval(function(){
  if(Game.prestUpgs[1]){
    prestige();
  }
},100);
