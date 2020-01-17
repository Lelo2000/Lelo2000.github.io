
let start = true;
let player = {};
let room = {};
let map = [];

let mapSize = 20;
let drawMap = true;
let drawHitbox = false;
let bullets = [];
let time = 0;
let inventoryPos =[width/2 + 300,height/2-200];
let skillbarPos =[width/2 -120,height/2+225];
let runenPos = [width/2-400,height/2-150];
let menueNow = {};
let menueHistory = [];
let mouseDrag = [];




const Types = Object.freeze({
  Item: Object.freeze({
    ScrollTrippleFireball:-2,
    HealingBlob:-1,
    HealingPotion:0,
    RuneMaxMana:1,
    RuneMaxHP:2
  }),
  Enemy: Object.freeze({
    SlimeKing:-1,
    Slime:0,
    FireMage:1,
    SlimeArea:2,
  }),
  Menue: Object.freeze({
    Start: 1,
    InGame:0,
    Pause: 2,
    Optionen:3
  })
});


function draw(){
  if(start){
    player = new Player();
    player.setSkill(new Fireball());
    player.setSkill(new MageShield());
    switchMenue(1);
    mapGeneration();
    roomChange(-1);
    start = false;
  }
  menueNow.update();
  if(menueNow.type === 0){
    mapDraw();
    room.draw();
    for(let i in room.doors){
      room.doors[i].draw();
    }
    playerManager();
    enemyManager();
    for(let j in room.items){
      room.items[j].draw();
      room.items[j].hover();
    }
    player.animations();
    player.draw();
    player.drawHud();
    bulletHandler();
  }
  mouseDragUpdate();
  time++;
}
function switchMenue(type){
  switch(type){
    case Types.Menue.InGame:
      menueNow = new MenueInGame();
    break;
    case Types.Menue.Start:
      menueNow = new MenueStart();
    break;
    case Types.Menue.Pause:
      menueNow = new MenuePause();
    break;
    case Types.Menue.Optionen:
      menueNow = new MenueOptionen();
    break;
  }
  menueHistory.push(type);
}


function roomChange(direc){
  bullets= [];
  //raum wird Geändert
  for (let i in map) {
    if (map[i].mapX === player.xMap && map[i].mapY === player.yMap) {
      room = map[i];
    }
  }
   // Raum Inhalt wird generiert
  room.generation();
  // Spieler wird zur Tür gesetzt
    if(direc === 0){
    player.x = searchDoor(2).x+40;
    player.y = searchDoor(2).y;
  }else if(direc === 2){
    player.x = searchDoor(0).x-40;
    player.y = searchDoor(0).y;
  }else if(direc === 1){
    player.x = searchDoor(3).x;
    player.y = searchDoor(3).y+40;
  }else if(direc === 3){
    player.x = searchDoor(1).x;
    player.y = searchDoor(1).y-40;
  }else{
    player.x = room.startPoint[0];
    player.y = room.startPoint[1];
  }
  if(room.enemys.length <= 0){
    room.openDoors(true);
  }else{
    room.openDoors(false);
  }
  room.isVisited = true;
  //console.log("Raum Geändert");
}
function searchDoor(direc){
  for(let i in room.doors){
    if(room.doors[i].direction === direc){
      return room.doors[i];
    }
  }
}
//MAP
function mapDraw() {
  push();
  translate(width/2-500,height/2);
  for (let i in map) {
    switch (map[i].type) {
      case -2:
        fill("#00ffff");
        break;
      case -1:
        fill("#00ff00");
        break;
      case 0:
        fill("#ff0000");
        break;
      case 1:
        fill("#0000ff");
        break;
    }
    if(map[i].isVisited === true){
      rect(map[i].mapX * 10, map[i].mapY * 10, 10, 10);
    }
  }
  stroke(50);
  strokeWeight(2);
  noFill();
  rect(player.xMap * 10, player.yMap * 10, 10, 10);
  pop();
}
function mapGeneration(){
  let x = 0;
  let y = 0;
  let rndType = -1;
  if (map.length === 0) {
    map.push(new Room(x,y,-1));
  }
  while (map.length < mapSize) {
    rndType = floor(random(0, 2));
    let rnd = floor(random(0, 4));
    if (rnd === 0) {
      x = x + 1;
    } else if (rnd === 1) {
      y = y + 1;
    } else if (rnd === 2) {
      x = x + 1;
    } else if (rnd === 3) {
      y = y - 1;
    }
     if (colObjArray(x,y, map) === false) {
      if(map.length === mapSize -1)
         rndType = -2;
      map.push(new Room(x,y,rndType));
      }
  }
}
//Enemy und Item listen
function getEnemyFromType(type,x,y){
  switch(type){
    case Types.Enemy.Slime:
      return new Slime(x,y,4);
    case Types.Enemy.FireMage:
      return new fireMage(x,y); 
    case Types.Enemy.SlimeKing:
      return new SlimeKing(x,y);
  }
}
function getItemFromType(type,x,y){
  switch(type){
    case Types.Item.ScrollTrippleFireball:
      return new ScrollTrippleFireball(x,y);
    case Types.Item.HealingPotion:
      return new HealingPotion(x,y);
    case Types.Item.RuneMaxMana:
      return new RuneMaxMana(x,y);
    case Types.Item.RuneMaxHP:
      return new RuneMaxHp(x,y);
  }
}
//Drag and Drop
function mouseDragUpdate(){
  if(mouseDrag.length != 0){
    mouseDrag[0].x = mouseX;
    mouseDrag[0].y = mouseY;
    mouseDrag[0].sizeX = 40;
    mouseDrag[0].draw();
    mouseDrag[0].rot = 0;
  }
}
function mousePressed(){
  if(menueNow.type === 0){
    let i = getMouseInventoryClick();
    if(i > -1){
      if(mouseDrag.length != 0){
        if(player.inventory[i] === undefined){
          player.inventory.push(mouseDrag[0]);
        }else{
          player.inventory.splice(i,0,mouseDrag[0]);
        }
      mouseDrag.splice(0,1);
      }else{
        if(player.inventory[i] != undefined){
          if(player.inventory[i].isRune===false && (keyIsDown(17) === false || keyIsDown(17) === undefined)){
            player.inventory[i].action();
          }else{
            mouseDrag.push(player.inventory[i]);
            player.inventory[i].isUsed = true;
          }
          if(player.inventory[i].isUsed)
            player.inventory.splice(i,1);
        }   
      }
    }
  }
  for(let i in menueNow.buttons){
    if(colPointObj(mouseX,mouseY,menueNow.buttons[i])){
        if(menueNow.type === 3){
          for(let j in menueNow.buttons){
            menueNow.buttons[j].isPressed = false;
          }
        }
      menueNow.buttons[i].action();
      return;
    }
  }
}
function isKeyFree(key){
  for(let i in player.keyListMovement){
    if(player.keyListMovement[i] === key)
      return false;
  }
  for(let i in player.skills){
    if(player.skills[i].key === key)
      return false;
  }
  return true;
}
function getMouseInventoryClick(){
  if(mouseX > inventoryPos[0] && mouseX < inventoryPos[0] + 250 && mouseY > inventoryPos[1] && mouseY < inventoryPos[1] + 250)
  {
    let x = mouseX - inventoryPos[0];
    let y = mouseY - inventoryPos[1];
    let i = floor(x / 50) + 5 * floor(y/50);
    return(i);
  }else{
    return -1;
  }
}

function getInPointArray(x, y, array) {
  for (let i  = 0; i < array.length; i++) {
    if (x === array[i].x && y === array[i].y) {
      return i;
    }
  }
  return -1;
}

function getInPointMap(x, y) {
  for (let i  = 0; i < map.length; i++) {
    if (x === map[i].mapX && y === map[i].mapY) {
      return i;
    }
  }
  return -1;
}

function colObjArray(x,y, array) {
  for (let i in array) {
    if (x === array[i].x && y === array[i].y) {
      return true;
    }
  }
  return false;
}

function rndInt(hoechsteNummer){
  return round(random(hoechsteNummer));
}

function rndOutcome(p){
  let rnd = rndInt(100);
  if(rnd < p){
    return true;
  }else{
    return false;
  }
}

function inRoom(x,y){
  let dx = abs(x - width/2);
  let dy = abs(y - height/2);
  if(room.shape===1){
    if(dx > room.sizeX/2 || dy > room.sizeY/2){
      return false;
    }
  }else if(room.shape===0){
    let d = betrag([dx,dy]);
    if(d> room.sizeX/2){
      return false;
    }
  }
  return true;
}
function colObjObj (obj1,obj2){
  let dx = abs(obj1.x - obj2.x);
  let dy = abs(obj1.y - obj2.y);
  d = betrag([dx,dy]);
  //if(obj1.shape === 0 && obj2.shape === 0){
    if(d < (obj1.sizeX/2+obj2.sizeX/2)){
      return true;
    }
    return false;
  //}
}
function betrag(vektor) {
  return sqrt(sq(vektor[0]) + sq(vektor[1]));
}
function colPointObj(x,y,obj){
  if(obj.shape ===1){
    ox = obj.x -obj.sizeX/2;
    oy = obj.y -obj.sizeY/2;
    if(x > ox && x < ox + obj.sizeX && y >oy && y<oy + obj.sizeY){
      return true;
    }
      return false;
  }
  if(obj.shape === 0){
    let dx = abs(x - obj.x);
    let dy = abs(y - obj.y);
    let d = betrag([dx,dy]);
    if(d<obj.sizeX){
      return true;
    }
    return false;
  }
}
function colPointBox(x,y,bx,by,bsx,bsy){
  if(x > bx && x < bx + bsx && y >by && y<by + bsy){
    return true;
  }
  return false;
}
function getAngelBetweenPoint(x,y,ax,ay){
  let vx = [-1, 0];
  let vy = [x - ax, y - ay];
  let a = acos((vx[0] * vy[0] + vx[1] * vy[1]) / (betrag(vx) * betrag(vy)));
  if (ay < y) {
      a = -a;
  }
  return a;
}