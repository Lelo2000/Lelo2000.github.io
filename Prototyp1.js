//Objekte
let player = {
  x: 0,
  y: 0,
  xMap: 10,
  yMap: 10,
  rot: 0,
  speed: 0,
  aModus: 0,
  aSpeed: 0,
  aTime: 0,
  life: 0,
  maxLife: 0,
  skin: 0,
  hitRadius: 0
};
let door={
  x:0,
  y:0,
  sx: 40,
  sy: 40,
  isOpen: false,
  direction: 0
};
let room = {
  x: 0,
  y: 0,
  rTyp: 0,
  rEnemyCount: 0,
  rItemCount: 0,
  rSizeX: 0,
  rSizeY: 0,
  rShape: 0,
  rHitbox: 0,
  rStartpoint: [],
  isVisited: false,
  items: [],
  enemys: [],
  doors: []
};
let bullet= {
  x: 0,
  y:0,
  rot:0,
  size:0,
  speed:0,
  type:0
};
let ersteller = {
  x: 10,
  y: 10
};
//Arrays
let map = [];
let bullets = [];
//Variablen
let mapSize = 20;
let drawingMap = false;
//GameSetup

mapGeneration();
roomChange();
playerSetup();

function draw() {
  clear();
  roomDraw();
  //console.log("Räume gemalt");
  if(drawingMap=== true)
    mapDraw();
  //console.log("Karte gemalt");
  playerControll();
  //console.log("Spieler Kontroliert");
  playerDraw();
  //console.log("Spieler gemalt");
  playerCollision();
  bulletMove();
  bulletDraw();
  bulletCollision();
  //console.log("Spieler Kollidiert");
  drawDoors();
  //console.log("Türen gemalt");
}



//Player
function playerSetup() {
  player = {
    x: room.rStartpoint[0],
    y: room.rStartpoint[1],
    xMap: 10,
    yMap: 10,
    rot: 0,
    speed: 7,
    aModus: 0,
    aSpeed: 10,
    aTime: 0,
    life: 40,
    maxLife: 40,
    skin: 0,
    hitRadius: 0
  };
}
function playerControll() {
  player.aTime++;
  //w
  if (keyIsDown(87) && inRoom(player.x,player.y-20)) {
    player.y = player.y - player.speed;
  }
  //a
  if (keyIsDown(65)&& inRoom(player.x-20,player.y)) {
    player.x = player.x - player.speed;
  }
  //s
  if (keyIsDown(83)&& inRoom(player.x,player.y+20)) {
    player.y = player.y + player.speed;
  }
  //d
  if (keyIsDown(68)&& inRoom(player.x+20,player.y)) {
    player.x = player.x + player.speed;
  }
}
function playerAttack() {}
function playerCollision() {
  for(let i in room.doors){
    if(colPointBox(player.x,player.y,room.doors[i].x,room.doors[i].y,room.doors[i].sx,room.doors[i].sy)){
      switch(room.doors[i].direction){
        case 0:
          player.xMap += 1;
          roomChange(0);
        break;
        case 1:
          player.yMap += 1;
          roomChange(1);
        break;
        case 2:
          player.xMap -= 1;
          roomChange(2);
        break;
        case 3:
          player.yMap -= 1;
          roomChange(3);
        break;  
      } 
      return;     
    }
  }
}


function playerDraw() {
  push();
  translate(player.x, player.y);
  rotate(player.rot);
  translate(0, 0);
  rectMode(CENTER);
  fill(255);
  circle(0, 0, 20);
  fill("green");
  arc(0, 0, 40, 40, -HALF_PI, HALF_PI);
  pop();}

//Bullets
function bulletCollision(){
  for(let i in bullets){
    if (inRoom(bullets[i].x + bullets[i].size, bullets[i].y) === false ||
    inRoom(bullets[i].x - bullets[i].size, bullets[i].y) === false ||
    inRoom(bullets[i].x, bullets[i].y+ bullets[i].size) === false ||
    inRoom(bullets[i].x, bullets[i].y- bullets[i].size) === false ) {
     bullets.splice(i, 1);
    }
  }
}

function bulletMove(){
  for (let i in bullets) {
    bullets[i].x = bullets[i].x + cos(bullets[i].rot) * bullets[i].speed;
    bullets[i].y = bullets[i].y + sin(bullets[i].rot) * bullets[i].speed;
  }
}
function bulletSpawn(){
  bullets.push({
  x:player.x,
  y:player.y,
  rot:player.rot,
  size:10,
  speed:9,
  type:0
  });
}
function bulletDraw(){
  push();
  fill(150);
  noStroke();
  for(let i in bullets){
    ellipse(bullets[i].x,bullets[i].y,bullets[i].size,bullets[i].size);
  }
  pop();
}
//Rooms
function roomGeneration() {}
function roomDraw() {
  push();
  fill(255);
  let mx = width/2 ;
  let my = height/2;
  let rmx = mx - room.rSizeX/2;
  let rmy = my - room.rSizeY/2;
  switch (room.rTyp) {
    case -2:
      if(room.rShape === 0)
      rect(rmx, rmy, room.rSizeX, room.rSizeY);
      break;
    case -1:   
      if(room.rShape === 0)
        rect(rmx, rmy, room.rSizeX, room.rSizeY);
      break;
    case 0:
      if(room.rShape===1)
      ellipse(mx, my, room.rSizeX, room.rSizeY);
      break;
    case 1:
        if(room.rShape === 0)
        rect(rmx, rmy, room.rSizeX, room.rSizeY);
      break;
  }
  pop();
}
function setDoors(){
  //console.log("Türen werden gesetzt");
  if(colPointArray(player.xMap, player.yMap - 1, map)){
    room.doors.push({x:width/2-20, y: height/2 - room.rSizeY/2,sx:40,sy:40,isOpen:true,direction:3});
  }
  //console.log("Türen oben esetzt");
  if (colPointArray(player.xMap - 1, player.yMap, map)) {
    room.doors.push({x:width/2 -room.rSizeX/2 ,y:height/2 -20,sx:40,sy:40, isOpen:true,direction:2});  

  }
  //console.log("Türen links esetzt");
  if (colPointArray(player.xMap, player.yMap + 1, map)) {
    room.doors.push({x:width/2-20,y:height/2 + room.rSizeY/2-40,sx:40,sy:40,isOpen:true,direction:1});
  }
  //console.log("Türen unten esetzt");
  if (colPointArray(player.xMap + 1, player.yMap, map)) {
    room.doors.push({x:width/2+ room.rSizeX/2-40,y:height/2 -20,sx:40,sy:40, iOpen: true,direction:0});
  }
  //console.log("Türen rechts esetzt");
}
function drawDoors(){
  push();
  fill(100);
  for(let i in room.doors){
    if(room.doors[i].isOpen === true){
      fill(0,255,255);
    }else{
      fill(100);
    }
    rect(room.doors[i].x,room.doors[i].y,40,40);
  }
  pop();
}
function roomChange(direc){
  //console.log("Raum wird Geändert");
  bullets= [];
  for (let i in map) {
    if (map[i].x === player.xMap && map[i].y === player.yMap) {
      room = map[i];
    }
  }
  //console.log("Neuer Raum X" + room.x + "Neuer Raum Y"+ room.y);
  //console.log("Spieler wird gesetzt");
  player.x = room.rStartpoint[0];
  player.y = room.rStartpoint[1];
  room.isVisited = true;
  //console.log("Spieler wurde gesetzt");
  if(room.doors.length === 0)
    setDoors();
  if(direc === 0){
    player.x = searchDoor(2).x+40;
    player.y = searchDoor(2).y+20;
  }else if(direc === 2){
    player.x = searchDoor(0).x-1;
    player.y = searchDoor(0).y+20;
  }else if(direc === 1){
    player.x = searchDoor(3).x+20;
    player.y = searchDoor(3).y+40;
  }else if(direc === 3){
    player.x = searchDoor(1).x+20;
    player.y = searchDoor(1).y-1;
  }
  if(room.enemys.length === 0){
    openDoors(true);
  }else{
    openDoors(false);
  }
  //console.log("Raum Geändert");
}
function searchDoor(direc){
  for(let i in room.doors){
    if(room.doors[i].direction === direc){
      return room.doors[i];
    }
  }
}
function openDoors(open){
  if(open){
    for(let i in room.doors){
      room.doors[i].isOpen = true;
    }
  }else{
    for(let i in room.doors){
      room.doors[i].isOpen = false;
    }
  }
}

function spawnEnemy() {}
function spawnItems() {}
function roomSet(rTyp) {
  switch (rTyp) {
    case -1:
      room = {
        x: 0,
        y: 0,
        rTyp: 0,
        rEnemyCount: 0,
        rItemCount: 0,
        rSizeX: 469,
        rSizeY: 430,
        rShape: 0,
        rHitbox: 0,
        rStartpoint: [width/2, height/2],
        isVisited: false,
        items: [],
        enemys: [],
        doors: []
      };
      break;
    case -2:
      room = {
        x: 0,
        y: 0,
        rTyp: 0,
        rEnemyCount: 0,
        rItemCount: 0,
        rSizeX: 300,
        rSizeY: 300,
        rShape: 0,
        rHitbox: 0,
        rStartpoint: [width/2,height/2],
        isVisited: false,
        items: [],
        enemys: [],
        doors: []
      };
      break;
    case 0:
      room = {
        x: 0,
        y: 0,
        rTyp: 0,
        rEnemyCount: 0,
        rItemCount: 0,
        rSizeX: 430,
        rSizeY: 430,
        rShape: 1,
        rHitbox: 0,
        rStartpoint: [width/2,height/2],
        isVisited: false,
        items: [],
        enemys: [],
        doors: []
      };
      break;
    case 1:
      room = {
        x: 0,
        y: 0,
        rTyp: 0,
        rEnemyCount: 0,
        rItemCount: 0,
        rSizeX: 500,
        rSizeY: 360,
        rShape: 0,
        rHitbox: 0,
        rStartpoint: [width/2,height/2],
        isVisited: false,
        items: [],
        enemys: [],
        doors: []
      };
      break;
  }
  room.rTyp = rTyp;
}
//Map
function mapDraw() {
  push();
  translate(width/2-500,height/2);
  for (let i in map) {
    switch (map[i].rTyp) {
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
    if(map[i].isVisited === true)
      rect(map[i].x * 10, map[i].y * 10, 10, 10);
  }
  noFill();
  stroke(50);
  strokeWeight(2);
  rect(player.xMap * 10, player.yMap * 10, 10, 10);
  pop();
}
function mapGeneration() {
  let rndType = -1;
  if (map.length === 0) {
    roomSet(rndType);
    room.x = ersteller.x;
    room.y = ersteller.y;
    map.push(room);
  }
  while (map.length < mapSize) {
    rndType = floor(random(0, 2));
    let rnd = floor(random(0, 4));
    if (rnd === 0) {
      ersteller.x = ersteller.x + 1;
    } else if (rnd === 1) {
      ersteller.y = ersteller.y + 1;
    } else if (rnd === 2) {
      ersteller.x = ersteller.x + 1;
    } else if (rnd === 3) {
      ersteller.y = ersteller.y - 1;
    }
    if (colObjArray(ersteller, map) === false) {
      roomSet(rndType);
      room.x = ersteller.x;
      room.y = ersteller.y;
      map.push(room);
    }
  }
  rndType = -2;
  roomSet(rndType);
  room.x = ersteller.x;
  room.y = ersteller.y;
  map.push(room);
}
function keyPressed() {
  if(keyCode === 77){
    if(drawingMap === false){
      drawingMap = true;
    }else{
      drawingMap = false;
    }
  }
}
function mousePressed() {
  if (player.aTime > player.aSpeed) {
    let vx = [1, 0];
    let vy = [mouseX - player.x, mouseY - player.y];
    let a = acos((vx[0] * vy[0] + vx[1] * vy[1]) / (betrag(vx) * betrag(vy)));
    if (mouseY < player.y) {
      a = -a;
    }
    player.rot = a;
    bulletSpawn();
    player.aTime = 0;
  }
}
function inRoom(x,y){
  let dx = abs(x - width/2);
  let dy = abs(y - height/2);
  if(room.rShape===0){
    if(dx > room.rSizeX/2 || dy > room.rSizeY/2){
      return false;
    }
  }else if(room.rShape===1){
    let d = betrag([dx,dy]);
    if(d> room.rSizeX/2){
      return false;
    }
  }
  return true;
}
function colObjArray(obj, array) {
  for (let i in array) {
    if (obj.x === array[i].x && obj.y === array[i].y) {
      return true;
    }
  }
  return false;
}
function colPointArray(x, y, array) {
  for (let i in array) {
    if (x === array[i].x && y === array[i].y) {
      return true;
    }
  }
  return false;
}
function colPointBox(x,y,bx,by,bsx,bsy){
  if(x > bx && x < bx + bsx && y >by && y<by + bsy){
    return true;
  }
  return false;
}
function betrag(vektor) {
  return sqrt(sq(vektor[0]) + sq(vektor[1]));
}
