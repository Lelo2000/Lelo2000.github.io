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
  hp: 0,
  maxHp: 0,
  invincibleTime: 0,
  skin: 0,
  size: 20
};
let enemy = {
  x: 0,
  y: 0,
  rot: 0,
  speed: 0,
  size: 0,
  type: 0,
  maxHp: 0,
  hp: 0,
  skin: 0,
  isDead: false
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
  rEnemyType: [],
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
  if(drawingMap=== true)
    mapDraw();
  enemyDraw();  
  playerControll();
  playerDraw();
  playerCollision();
  bulletMove();
  bulletDraw();
  bulletCollision();
  enemyMove();
  enemyCollision();
  drawDoors();
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
    hp: 40,
    maxHp: 40,
    invincibleTime:0,
    skin: 0,
    size: 20
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
  if (mouseIsPressed) {
    let vx = [1, 0];
    let vy = [mouseX - player.x, mouseY - player.y];
    let a = acos((vx[0] * vy[0] + vx[1] * vy[1]) / (betrag(vx) * betrag(vy)));
    if (mouseY < player.y) {
      a = -a;
    }
    player.rot = a;
    if(player.aTime > player.aSpeed){
      bulletSpawn();
      player.aTime = 0;
    }
  }
}
function playerAttack() {}
function playerCollision() {
  for(let i in room.doors){
    if(colPointBox(player.x,player.y,room.doors[i].x,room.doors[i].y,room.doors[i].sx,room.doors[i].sy) && room.doors[i].isOpen === true){
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
  if(player.invincibleTime > 0){
    player.invincibleTime--;
  }
  for(let i in room.enemys){
    if(colRObjRObj(player,room.enemys[i]) && player.invincibleTime <= 0 && room.enemys[i].isDead === false){
      player.hp = player. hp -3;
      player.invincibleTime = 5; 
    }
  }
}
function playerDraw() {
  push();
  translate(player.x, player.y);
  rotate(player.rot);
  translate(0, 0);
  rectMode(CENTER);
  if(player.invincibleTime> 0){
    fill(255,0,255);
  }else{
    fill(255);
  }
  circle(0, 0, player.size);
  fill("green");
  arc(0, 0, player.size*2, player.size*2, -HALF_PI, HALF_PI);
  pop();
  playerLifebar();
}

function playerLifebar(){
  push();
  noStroke();
  fill("red");
  rect(width/2-234,height/2 - 234,player.maxHp*2,10);
  if(player.hp > 0){
    fill("green");
    rect(width/2-234,height/2 - 234,player.hp*2,10);
  }
  pop();
}
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
  size:5,
  speed:9,
  type:0
  });
}
function bulletDraw(){
  push();
  fill(150);
  noStroke();
  for(let i in bullets){
    circle(bullets[i].x,bullets[i].y,bullets[i].size,bullets[i].size);
  }
  pop();
}
//Gegner
function enemySpawn() {
  let rnd = random(room.rEnemyType);
  switch(rnd){
    case 0:
        enemy = {
            x: 0,
            y: 0,
            rot: 0,
            speed: 3,
            size: 5,
            type: 0,
            maxHp: 15,
            hp: 0,
            skin: 0,
            isDead: false
      };
      break;
    case 1:
        enemy = {
            x: 0,
            y: 0,
            rot: 0,
            speed: 2,
            size: 20,
            type: 0,
            maxHp: 60,
            hp: 0,
            skin: 0,
            isDead: false
        };
      break;
  }
  let rndPos = rndPositionInRoom(enemy.size);
  enemy.x = rndPos[0];
  enemy.y = rndPos[1];
  enemy.hp = enemy.maxHp;
  enemy.type = rnd;
}
function enemyCollision(){
    for (let j in room.enemys){
        if(room.enemys[j].isDead === false){
            for(let i in bullets){
                if(colRObjRObj(room.enemys[j], bullets[i])){
                    switch(bullets[i].type){
                        case 0:
                         enemyDamage(room.enemys[j],15);
                        break;
                    }
                    bullets.splice(i,1);
                }
            }
        }
    }


}
function enemyDamage(enemy,damage){
    enemy.hp = enemy.hp - damage;
    if(enemy.hp <= 0){
        enemy.isDead = true;
        enemy.skin = -1;
        if (enemyCountAlive() <= 0){
            openDoors(true);
        }
    }
}
function enemyMove(){
    for(let i in room.enemys){
        if(room.enemys[i].isDead=== false){
            if(room.enemys[i].x > player.x){
                room.enemys[i].x = room.enemys[i].x - room.enemys[i].speed;
            }else if(room.enemys[i].x< player.x){
                room.enemys[i].x = room.enemys[i].x + room.enemys[i].speed;
            }
            if(room.enemys[i].y > player.y){
                room.enemys[i].y = room.enemys[i].y - room.enemys[i].speed;
             }else if(room.enemys[i].y< player.y){
                room.enemys[i].y = room.enemys[i].y + room.enemys[i].speed;
            }
        }
    }
}
function enemyDraw(){
    push();
  for(let i in room.enemys){
    switch(room.enemys[i].skin){
        case -1:
            fill("black"); 
        break;
        case 0: 
            fill("red");
        break;
    }
    circle(room.enemys[i].x,room.enemys[i].y,room.enemys[i].size);
  }
  drawLifebar();
  pop();
}
function enemyCountAlive(){
    let n = 0;
    for(let i in room.enemys){
        if(room.enemys[i].isDead === false){
            n++;
        }
    } 
    return n;
}
function drawLifebar(){
    push();
    for(let i in room.enemys){
        if(room.enemys[i].hp > 0){
         noStroke();
         fill("green");
         rect(room.enemys[i].x - room.enemys[i].hp/2,room.enemys[i].y+ room.enemys[i].size + 1,room.enemys[i].hp,3);
        }
    }
    pop();
}
//Rooms
function roomSet(rTyp) {
  switch (rTyp) {
    case -1:
      room = {
        x: 0,
        y: 0,
        rTyp: 0,
        rEnemyCount: 0,
        rEnemyType: [],
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
        rEnemyType: [],
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
        rEnemyCount: 5,
        rEnemyType: [0],
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
        rEnemyCount: rndInt(5),
        rEnemyType: [0,1],
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
function roomGeneration() {
  if(room.doors.length === 0)
    setDoors();
  while(room.enemys.length < room.rEnemyCount){
    enemySpawn();  
    room.enemys.push(enemy);
  }
}
function roomChange(direc){
  bullets= [];
  //raum wird Geändert
  for (let i in map) {
    if (map[i].x === player.xMap && map[i].y === player.yMap) {
      room = map[i];
    }
  }
  // Spieler wird gesetzt
  player.x = room.rStartpoint[0];
  player.y = room.rStartpoint[1];
  // Raum wird in die Karte Aufgenommen
  room.isVisited = true;
  // Raum Inhalt wird generiert
  roomGeneration();
  // Spieler wird zur Tür gesetzt
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
  if(enemyCountAlive() <= 0){
    openDoors(true);
  }else{
    openDoors(false);
  }
  //console.log("Raum Geändert");
}
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

function spawnItems() {}

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
function colRObjRObj(obj1,obj2){
    dx = abs(obj1.x - obj2 .x);
    dy = abs(obj1.y - obj2 .y);
    d = betrag([dx,dy]);
    if(d < obj1.size+obj2.size){
        return true;
    } 
    return false;
}
function betrag(vektor) {
  return sqrt(sq(vektor[0]) + sq(vektor[1]));
}
function rndPositionInRoom(size){
  let x = 0;
  let y = 0;
  if(room.rShape === 0){
     x = round(random(width/2 -room.rSizeX/2 + size, width/2 + room.rSizeX/2 - size));
     y = round(random(height/2 -room.rSizeY/2 + size, height/2 + room.rSizeY/2 - size));
  }
  //https://stackoverflow.com/questions/5837572/generate-a-random-point-within-a-circle-uniformly/50746409#50746409
  if(room.rShape === 1){  
    let R = random(room.rSizeX/2-size); 
    let r = R * sqrt(random(0,1));
    let theta = random() * 2 * PI;
    x = width/2 + r * cos(theta);
    y = height/2 + r * sin(theta);
  }
  return [x,y];
}
function rndInt(hoechsteNummer){
    return round(random(hoechsteNummer));
}
