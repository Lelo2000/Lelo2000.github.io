let map = [];
let mapSize = 20;
let drawMap = true;
let drawHitbox = false;
let bullets = [];

let Obj = function(){
  this.x = 0;
  this.y = 0;
  this.rot = 0;
  this.shape = 0;
  this.sizeX = 0;
  this.sizeY = 0;
  this.img = [];
  this.skin = 0;
  this.type = 0;
};
Obj.prototype.draw = function(){
  push();
  translate(this.x,this.y);
  rotate(this.rot);
  imageMode(CENTER);
  if(this.shape === 0)
    image(this.img[this.skin],0,0,this.sizeX,this.sizeX);
  if(this.shape === 1)
    image(this.img[this.skin],0,0,this.sizeX,this.sizeY);
  
    if(drawHitbox){
    circle(0,0,4);
    rectMode(CENTER);
    noFill();
    if(this.shape === 1)
      rect(0,0,this.sizeX,this.sizeY);
    if(this.shape === 0)
      ellipse(0,0,this.sizeX,this.sizeY);
  }  
  pop();
};

let Skill = function(name,type,mana,cooldown,img){
  this.startX = 0;
  this.startY = 0;
  this.damage = 0;
  this.mana = mana;
  this.type= type;
  this.cooldown= cooldown;
  this.cooldownTimer= 0;
  this.name= name;
  this.img= img;
  this.flavorText="";
  this.key= 0;
  this.isInstant = false;
};
Skill.prototype.action = function(){
};
let Feuerball = function(x,y){
  Skill.call(this,"Feuerball",0,5,10,[fireball]);
  this.damage = 10;
  this.startX = x;
  this.startY = y;
  this.flavorText="Ein mächtiger Feuerball der deine Gegner zerschmettert";
};
Feuerball.prototype = Object.create(Skill.prototype);
Feuerball.prototype.action = function(){
  let a = getAngelBetweenPoint(this.startX,this.startY,mouseX,mouseY);
  this.rot = a;
  bullets.push(new Bullet(this.x,this.y,a,1,5,[fireball],10,4));
};
let Door = function(x,y,direction,type){
  Obj.call(this);
  this.x = x;
  this.y = y;
  this.type = type;
  this.img = [doorClosed,doorOpen];
  this.sizeX = 40;
  this.sizeY = 40;
  this.shape = 1;

  this.direction = direction;
  this.isOpen = false;
};
Door.prototype = Object.create(Obj.prototype);
Door.prototype.open = function (bool){
  this.isOpen = bool;
  if(bool)
    this.skin = 1;
};


let Room = function(x,y,type){
  Obj.call(this);
  this.x = x;
  this.y = y;
  this.type = type;

  this.enemyCount = 0;
  this.enemyType = [];
  this.itemCount = 0;
  this.itemType = [];
  this.startPoint = [];
  this.isVisited = false;
  this.items = [];
  this.enemys = [];
  this.deadEnemys = [];
  this.doors = [];
  switch (type) {
    case -1:
        this.sizeX= 469;
        this.sizeY= 430;
        this.shape= 1;
        this.itemCount = 1;
        this.itemType = [-1];
        this.startPoint= [width/2, height/2];
      break;
    case -2:
        this.sizeX= 300;
        this.sizeY= 300;
        this.shape= 1;
      break;
    case 0:
        this.enemyCount= 5;
        this.enemyType= [0,0,0,0,0,0,0,0,3];
        if(rndOutcome(20))
          this.itemCount= 1;
        this.itemType = [-1];
        this.sizeX= 430;
        this.sizeY= 430;
        this.shape= 0;
      break;
    case 1:
        this.enemyCount= rndInt(6);
        this.enemyType= [0,1,2];
        this.itemCount= 0;
        this.sizeX= 500;
        this.sizeY= 360;
        this.shape= 1;
      break;
  }
};
Room.prototype = Object.create(Obj.prototype);
Room.prototype.generation = function (){
    if(this.doors.length === 0)
      this.setDoors();
    while(this.enemys.length + this.deadEnemys.length < this.enemyCount ){
      //let enType = random(this.enemyType);
      let en = new fireMage(0,0);
      let pos = this.rndPositionInRoom(en.sizeX); 
      en.x = pos[0];
      en.y = pos[1];
      this.enemys.push(en);  
    }
    // if(this.isVisited === false){
    //   while(this.items.length < this.itemCount){
    //       itemSpawn(this.itemType,0,0);
    //       let pos = rndPositionInRoom(item.size); 
    //       item.x = pos[0];
    //       item.y= pos[1]; 
    //       room.items.push(item);
    //   } 
    // }
};
Room.prototype.setDoors = function(){
    //console.log("Türen werden gesetzt");
    let i = getInPointArray(player.xMap, player.yMap - 1, map);
    if( i>=0){
      if(map[i].type === -2){
        this.doors.push(new Door(width/2,height/2-this.sizeY/2+20,3,0));
      }else{
        this.doors.push(new Door(width/2,height/2-this.sizeY/2+20,3,0));
      }
      console.log("Türen oben esetzt");
    }
    i = getInPointArray(player.xMap - 1, player.yMap, map);
    if ( i>=0) {
      if(map[i].rTyp === -2){
        this.doors.push(new Door(width/2-this.sizeX/2 +20,height/2,2,0));  
      }else{
        this.doors.push(new Door(width/2-this.sizeX/2 +20,height/2,2,0));  
      }  
    }
    //console.log("Türen links esetzt");
    i= getInPointArray(player.xMap, player.yMap + 1, map);
    if (i >=0) {
      if(map[i].rTyp === -2){
        this.doors.push(new Door(width/2,height/2+this.sizeY/2-20,1,0));
      }else{
        this.doors.push(new Door(width/2,height/2+this.sizeY/2-20,1,0));
      }
    }
    //console.log("Türen unten esetzt");
    i = getInPointArray(player.xMap + 1, player.yMap, map);
    if (i >= 0) {
      if(map[i].rTyp === -2){
        this.doors.push(new Door(width/2+this.sizeX/2-20,height/2,0,0));
      }else{
        this.doors.push(new Door(width/2+this.sizeX/2-20,height/2,0,0));
      }
    }
};
Room.prototype.openDoors = function(bool){
  for(let i in this.doors){
    this.doors[i].open(bool);
  }
}
Room.prototype.draw = function (){
  push();
  fill(255);
  let mx = width/2 ;
  let my = height/2;
  let rmx = mx - this.sizeX/2;
  let rmy = my - this.sizeY/2;
  if(this.shape === 1){
    rect(rmx,rmy,this.sizeX,this.sizeY);
  }
  for(let i in this.doors){
    this.doors[i].draw();
  }
  pop();
};
Room.prototype.rndPositionInRoom = function(size){
    let x = 0;
    let y = 0;
    if(this.shape === 0){
       x = round(random(width/2 -this.sizeX/2 + size, width/2 + this.sizeX/2 - size));
       y = round(random(height/2 -this.sizeY/2 + size, height/2 + this.sizeY/2 - size));
    }
    //https://stackoverflow.com/questions/5837572/generate-a-random-point-within-a-circle-uniformly/50746409#50746409
    if(this.shape === 1){  
      let R = random(this.sizeX/2-size); 
      let r = R * sqrt(random(0,1));
      let theta = random() * 2 * PI;
      x = width/2 + r * cos(theta);
      y = height/2 + r * sin(theta);
    }
    return [x,y];
}


let LivingObject= function(maxHp) {
  Obj.call(this);
  this.speed= 0;
  this.maxHp = maxHp;
  this.hp = this.maxHp;
  this.isAlive = true;
  this.animation = 0;
};
LivingObject.prototype = Object.create(Obj.prototype);
LivingObject.prototype.move = function(rot){
  this.x = this.x + cos(rot) * this.speed;
  this.y = this.y + sin(rot) * this.speed;
};

let Player = function (){
  LivingObject.call(this,40);
  this.sizeX = 60;
  this.sizeY = 60;
  this.speed = 7;
  this.img = [mageFire, mageFire_shoot1,mageFireShield];

  this.xMap = 0;
  this.yMap = 0;
  this.maxMana = 40;
  this.mana = this.maxMana;
  this.manaRegen = 5;
  this.manaRegenTime = 3;
  this.invincibleTime = 0;
  this.skills = [];
};
Player.prototype = Object.create(LivingObject.prototype);
Player.prototype.controll = function (){
  // for(let i in this.skills){
  //   if(this.skills[i].cooldownTimer < this.skills[i].cooldown){
  //     this.skills[i].cooldownTimer++;
  //   }
  // }
  //Bewegung
  //w
  if (keyIsDown(87) && inRoom(this.x,this.y-this.sizeY/2)) {
    this.move(-HALF_PI);
  }
  //a
  if (keyIsDown(65)&& inRoom(this.x-this.sizeX/2,this.y)) {
    this.move(PI);
  }
  //s
  if (keyIsDown(83)&& inRoom(this.x,this.y+this.sizeY/2)) {
    this.move(HALF_PI);
  }
  //d
  if (keyIsDown(68)&& inRoom(this.x+this.sizeX/2,this.y)) {
    this.move(0);
  }
  //Mana
  // if(time % 20 === 0 && player.mana < player.maxMana){
  //     player.mana = player.mana + player.manaRegen;
  // }
  // if(player.mana> player.maxMana){
  //     player.mana = player.maxMana;
  // }
  // if(player.hp> player.maxHp){
  //   player.hp = player.maxHp;
  // }
  //AngriffsAuswahl
  // if(player.skills.length >= 1)
  //   if (keyIsDown(player.skills[0].key)) {
  //     player.aModus = 0;
  //   }
  // if(player.skills.length >= 2)
  // if (keyIsDown(player.skills[1].key)) {
  //   player.aModus = 1;
  // }
  // if(player.skills.length >= 3)
  //   if(keyIsDown(player.skills[2].key)){
  //    player.aModus = 2;
  //  }
  // if(player.skills.length >= 4)
  //  if(keyIsDown(player.skills[3].key)){
  //    player.aModus = 3;
  //  }
  // //Angriff
  if (mouseIsPressed) {
     if(mouseX< width/2+300){
      let a = getAngelBetweenPoint(this.x,this.y,mouseX,mouseY);
         this.rot = a;
         bullets.push(new Bullet(this.x,this.y,a,1,5,[fireball],10,4));
  //     player.animation = 1;
  //     if(player.skills[player.aModus].cooldownTimer >= player.skills[player.aModus].cooldown && player.mana > player.skills[player.aModus].mana && player.invincibleTime <= 0){
  //       playerAttack();
  //       player.skills[player.aModus].cooldownTimer = 0;
  //     }
     }
  }
} ;
Player.prototype.collision = function(){
  for(let i in room.doors){
    if(colPointObj(player.x,player.y,room.doors[i]) && room.doors[i].isOpen === true){
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

let Bullet = function(x,y,a,type,maxHp,img,size,speed){
  LivingObject.call(this, maxHp);
  this.x = x;
  this.y = y;
  this.rot = a;
  this.type = type;
  this.img = img;
  this.sizeX = size*2;
  this.sizeY = size;
  this.shape = 1;
  this.speed = speed;
}
Bullet.prototype = Object.create(LivingObject.prototype);

let Enemy = function(maxHp,type){
  LivingObject.call(this,maxHp);
  this.x = 0;
  this.y = 0;
  this.type = type;
  this.aTime = 0;
  this.aSpeed = 0;
  this.aModus = 0;
  this.spawnTime = 20;
  this.bodyDamage = 0;
}
Enemy.prototype = Object.create(LivingObject.prototype);
Enemy.prototype.drawLifebar = function (){
  push();
  if(this.hp > 0){
    let n = 0;
    let l = this.hp;
    while(l > 100){
          l =l- 100;
          n++;
        }
        switch(n){
          case 0:
            fill("green");
          break;
          case 1:
            fill(0, 255, 225);
          break;
          case 2:
            fill(34, 0, 255);
          break;
          case 3:
            fill(255, 0, 225);
          break;
          default:
            fill(0);
          break;
        }
          noStroke();
          rect(this.x - l/2,this.y+ (this.sizeX/2) + 1,l,3);
  }
  pop();
};
Enemy.prototype.action = function(){};
Enemy.prototype.movingToPlayer = function(){
  this.move(getAngelBetweenPoint(this.x,this.y,player.x,player.y));
};
let Slime = function(x,y){
  Enemy.call(this,40,0);
  this.x = x;
  this.y = y;
  this.speed = 6;
  this.sizeX = 18;
  this.img = [enemySlime,enemySlimeDead,enemySlimeSpawning,enemySlime];
} 
Slime.prototype = Object.create(Enemy.prototype);
Slime.prototype.action= function (){
  this.movingToPlayer();
}
let fireMage = function(x,y){
  Enemy.call(this,40,1)
  this.x = x;
  this.y = y; 
  this.sizeX = 30;
  this.aSpeed = 15;
  this.img = [enemyFireMage,enemyFireMageDead,enemyFireMage,enemyFireMageAttack];
};
fireMage.prototype = Object.create(Enemy.prototype);



let start = true;
let player = {};
let room = {};
function draw(){
  if(start){
    player = new Player();
    mapGeneration();
    roomChange(-1);
    start = false;
  }
  clear();
  mapDraw();
  room.draw();
  player.draw();
  playerManager();
  enemyManager();
  bulletHandler();
}
function bulletHandler(){
  for(let i  in bullets){
    bullets[i].draw();
    bullets[i].move(bullets[i].rot);
    if (inRoom(bullets[i].x + bullets[i].sizeX/2, bullets[i].y) === false ||
    inRoom(bullets[i].x - bullets[i].sizeX/2, bullets[i].y) === false ||
    inRoom(bullets[i].x, bullets[i].y+ bullets[i].sizeY/2) === false ||
    inRoom(bullets[i].x, bullets[i].y- bullets[i].sizeY/2) === false ) {
     bullets.splice(i, 1);
    }
  }
}
function playerManager(){
  player.controll();
  player.collision();
}
function enemyManager(){
  for(let i in room.enemys){
    room.enemys[i].draw();
    room.enemys[i].drawLifebar();
    room.enemys[i].action();
  }
}
function roomChange(direc){
  //bullets= [];
  //raum wird Geändert
  for (let i in map) {
    if (map[i].x === player.xMap && map[i].y === player.yMap) {
      room = map[i];
    }
  }
   // Raum Inhalt wird generiert
  room.generation();
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
  translate(width/2-400,height/2);
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
   // if(map[i].isVisited === true)
      rect(map[i].x * 10, map[i].y * 10, 10, 10);
  }
  noFill();
  stroke(50);
  strokeWeight(2);
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


function getInPointArray(x, y, array) {
  for (let i  = 0; i < array.length; i++) {
    if (x === array[i].x && y === array[i].y) {
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
  let dy = abs(Obj1.y - obj2.y);
  if(obj1.shape === 0 && obj2.shape === 0){
    if(dx < (obj1.sizeX/2+obj2.sizeX/2)){
      return true;
    }
    return false();
  }
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