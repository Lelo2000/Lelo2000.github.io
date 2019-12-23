//Objekte
let player = {
  x: 0,
  y: 0,
  xMap: 10,
  yMap: 10,
  rot: 0,
  speed: 0,
  aModus: 0,
  hp: 0,
  maxHp: 0,
  maxMana: 0,
  mana: 0,
  manaRegen: 0,
  invincibleTime: 0,
  skin: 0,
  size: 20,
  inventory: [],
  skills : [],
  img: []
};
let skill = {
  damage: 0,
  mana: 0,
  type: 0,
  cooldown: 0,
  cooldownTimer: 0,
  name: "",
  img: []
};
let enemy = {
  x: 0,
  y: 0,
  rot: 0,
  speed: 0,
  size: 0,
  type: 0,
  aTime: 0,
  aSpeed:0,
  aModus:0,
  maxHp: 0,
  hp: 0,
  skin: 0,
  isDead: false,
  img: []
};
let door={
  x:0,
  y:0,
  sx: 40,
  sy: 40,
  isOpen: false,
  direction: 0,
  skin: 0,
  img: []
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
  deadEnemys: [],
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
//skin 0 liegt auf dem Boden Skin 1 im inventar
let item = {
  x:0,
  y:0,
  size:0,
  type:0,
  isConsumable: false,
  skin:0,
  img: []
};
let ersteller = {
  x: 10,
  y: 10
};
let buttons = [];
  let button = {
    x:0,
    y:0,
    sx: 0,
    sy: 0,
    id: 0,
    img: []
  };
//Arrays
let map = [];
let bullets = [];
//Variablen
let mapSize = 20;
let drawingMap = true;
let time = 0;
let inventoryPos =[width/2 + 300,height/2-200];
let skillbarPos =[width/2 -120,height/2+225];
// Sagt wenn ein Menu gezeichnet werden muss
// 0 keins 1 StartMenu
let menueNow = 1;
//GameSetup
let start = false;
function draw() {
  clear();
  if(start === false){
    mapGeneration();
    roomChange(-1);
    playerSetup();
    switchMenue(menueNow);
    start = true;
  }
  if(menueNow === 0){
    clear();
    roomDraw();
    if(drawingMap=== true)
      mapDraw();
    drawDoors();
    enemyDraw();
    itemDraw();  
    playerControll();
    playerDraw();
    playerCollision();
    bulletMove();
    bulletDraw();
    bulletCollision();
    enemyAttack();
    enemyMove();
    enemyCollision();
    drawSkillHover();
    time++;
  }
  menueDraw();
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
    hp: 40,
    maxHp: 40,
    maxMana: 50,
    manaRegen: 3,
    mana: 25,
    invincibleTime:0,
    skin: 0,
    size: 30,
    inventory:[],
    skills : [],
    img: [mageFire, mageFire_shoot1]
  };
  setSkills(0);
  setSkills(1);
  setSkills(2);
}
function playerControll() {
  player.skin=0;
  for(let i in player.skills){
    if(player.skills[i].cooldownTimer < player.skills[i].cooldown){
      player.skills[i].cooldownTimer++;
    }
  }
  //Bewegunf
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
  //Mana
  if(time % 20 === 0 && player.mana < player.maxMana){
      player.mana = player.mana + player.manaRegen;
  }
  if(player.mana> player.maxMana){
      player.mana = player.maxMana;
  }
  if(player.hp> player.maxHp){
    player.hp = player.maxHp;
}
  //AngriffsAuswahl
  if (keyIsDown(49) && player.skills.length >= 1) {
    player.aModus = 0;
  }
  if (keyIsDown(50)&& player.skills.length >= 2) {
    player.aModus = 1;
  }
  if(keyIsDown(51)&& player.skills.length >= 3){
    player.aModus = 2;
  }
  if(keyIsDown(52)&& player.skills.length >= 4){
    player.aModus = 3;
  }
  //Angriff
  if (mouseIsPressed) {
    if(mouseX< width/2+300){
      let vx = [1, 0];
      let vy = [mouseX - player.x, mouseY - player.y];
      let a = acos((vx[0] * vy[0] + vx[1] * vy[1]) / (betrag(vx) * betrag(vy)));
      if (mouseY < player.y) {
        a = -a;
      }
      player.rot = a;
      player.skin = 1;
      if(player.skills[player.aModus].cooldownTimer >= player.skills[player.aModus].cooldown && player.mana > player.skills[player.aModus].mana){
        playerAttack();
        player.skills[player.aModus].cooldownTimer = 0;
      }
    }
  }
}
function playerAttack() {
  bulletX = player.x+35*cos(player.rot-0.89);
  bulletY = player.y+35*sin(player.rot-0.89);
  let vx = [1, 0];
  let vy = [mouseX - bulletX, mouseY - bulletY];
  let bulletA = acos((vx[0] * vy[0] + vx[1] * vy[1]) / (betrag(vx) * betrag(vy)));
  if (mouseY < bulletY) {
    bulletA = -bulletA;
  }
    if(player.skills[player.aModus].type === 0){
        bulletSpawn(bulletA,0,bulletX,bulletY);
        player.mana = player.mana -player.skills[player.aModus].mana;
    }
    if(player.skills[player.aModus].type === 1){
        bulletSpawn(bulletA,1,bulletX,bulletY,5);
        bulletSpawn(bulletA+0.15,1,bulletX,bulletY);
        bulletSpawn(bulletA-0.15,1,bulletX,bulletY);
        player.mana = player.mana -player.skills[player.aModus].mana;
    }
    if(player.skills[player.aModus].type === 2){
      bulletSpawn(random(2*PI),1,bulletX,bulletY);
      player.mana = player.mana -player.skills[player.aModus].mana;
  }
}
function playerCollision() {
  //Türen  
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
  //Monster
  for(let i in room.enemys){
    if(colRObjRObj(player,room.enemys[i]) && player.invincibleTime <= 0 && room.enemys[i].isDead === false && room.enemys[i].spawnTime <= 0){
      player.hp = player. hp -3;
      player.invincibleTime = 5; 
    }
  }
  //Gegnerische Kugeln
  for(let i in bullets){
      if(bullets[i].type < 0 && colRObjRObj(bullets[i],player)){
            player.hp = player.hp-bullets[i].damage;
            bullets.splice(i,1);    
      }
  }
  //Items
  for(let i in room.items){
    if(colRObjRObj(player,room.items[i])){ 
        if(room.items[i].isConsumable === true){
            switch(room.items[i].type){
                case 0:
                    if(player.hp< player.maxHp){
                    player.hp = player.hp +4;
                    room.items.splice(i,1);
                    }
                break;
                case 1:
                    if(player.mana<player.maxMana){
                        player.mana = player.mana +4;
                        room.items.splice(i,1);
                    }
                break;    
            }
        }else{
          if(player.inventory.length < 20){
            room.items[i].skin = 1;
            player.inventory.push(room.items[i]);
            room.items.splice(i,1);
          }
        }
    }
  }
}
function playerDraw() {
  push();
  translate(player.x, player.y);
  rotate(player.rot);
  translate(0, 0);
  rectMode(CENTER);
  imageMode(CENTER);
  // if(player.invincibleTime> 0){
  //   fill(255,0,255);
  // }else{
  //   fill(255);
  // }
  //circle(0, 0, player.size);
  // fill("green");
  // arc(0, 0, player.size*2, player.size*2, -HALF_PI, HALF_PI);
  image(player.img[player.skin],0,0,player.size*3,player.size*3);
  pop();
  playerLifebar();
  playerDrawinventory();
  playerDrawSkillbar();
}
function playerDrawinventory(){
  let ix = 0;
  let iy = 0;
  for(let i  in player.inventory){
    if(player.inventory[i].skin === 1){
      switch(player.inventory[i].type){
        case -1:
          fill(255,100,0);
        break;
        case -2:
          fill(0,100,255);
        break;
      }
      image(player.inventory[i].img[0],inventoryPos[0]+ix*50,inventoryPos[1] +50*iy,50,50);
      ix++;
      if(ix >= 5){
        iy++;
        ix = 0;
      }
    }
  }
}
function playerLifebar(){
  push();
  noStroke();
  fill("red");
  rect(width/2-234,height/2 - 254,player.maxHp*2,10);
  if(player.hp > 0){
    fill("green");
    rect(width/2-234,height/2 - 254,player.hp*2,10);
  }
  fill(0,0,100);
  rect(width/2-234,height/2 - 234,player.maxMana*2,10);
  if(player.mana > 0){
    fill(50,50,255);
    rect(width/2-234,height/2 - 234,player.mana*2,10);
  }
  pop();
}
//Bullets
function bulletCollision(){
  for(let i in bullets){
    if (inRoom(bullets[i].x + bullets[i].size/2, bullets[i].y) === false ||
    inRoom(bullets[i].x - bullets[i].size/2, bullets[i].y) === false ||
    inRoom(bullets[i].x, bullets[i].y+ bullets[i].size/2) === false ||
    inRoom(bullets[i].x, bullets[i].y- bullets[i].size/2) === false ) {
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
function bulletSpawn(rot,type,x,y){
  let bullet = {
  x:x,
  y:y,
  rot:rot,
  size:0,
  speed:0,
  type:type,
  damage: 0,
  img: []
  };
  switch(type){
    case -1:
      bullet.size = 5;
      bullet.speed = 10;
      bullet.damage = 10;
      break;
    case 0:
      bullet.size = 16;
      bullet.speed = 9;
      bullet.damage = 15;
      bullet.img = [fireball];
      break; 
    case 1:
      bullet.size = 12;
      bullet.speed = 11;
      bullet.damage = 10;
      bullet.img = [fireball];
      break;  
  }
  bullets.push(bullet);
}
function bulletDraw(){
  push();
  noStroke();
  for(let i in bullets){
    switch(bullets[i].type){
        case -1:
            fill(10,100,250);
        break;
        case 0:
            fill(150);
        break;    
    }  
    if(bullets[i].type === -1){
      circle(bullets[i].x,bullets[i].y,bullets[i].size,bullets[i].size);
    }else{
      push();
      imageMode(CENTER);
      translate(bullets[i].x,bullets[i].y);
      rotate(bullets[i].rot);
      image(bullets[i].img[0],0,0,bullets[i].size*2,bullets[i].size);
      pop();
    }
  }
  pop();
}
//Skills
function setSkills(type){
  switch(type){
    case 0:
      skill = {
        damage: 15,
        mana: 5,
        type: type,
        cooldown: 10,
        cooldownTimer: 0,
        name: "Feuerball",
        img: [fireball_skillbar],
        flavorText:"Ein mächtiger Feuerball der deine Gegner zerschmettert"
      };
      break;
    case 1:
      skill = {
        damage: 10,
        mana: 10,
        type: type,
        cooldown: 15,
        cooldownTimer: 0,
        name: "Dreifacher Feuerball",
        img: [trippelFireball_skillbar],
        flavorText: "Drei kleinere Feuerbälle, um mehrere Gegner gleichzeitig zu besiegen"
      };
      break;
    case 2:
      skill = {
        damage: 10,
        mana: 1,
        type: type,
        cooldown: 1,
        cooldownTimer: 0,
        name: "Feuer Hölle",
        img: [firehell_skillbar],
        flavorText: "Verschieße unkontrolliebar viele Feuerbälle"
      };
      break;
  }
  player.skills.push(skill);
}
function playerDrawSkillbar(){
  for(let i= 0 ;i<player.skills.length; i++){
    image(player.skills[i].img[0],skillbarPos[0]+(i*60),skillbarPos[1],50,50);
    fill(0);
    text(i+1,skillbarPos[0]+23+(i*60),skillbarPos[1]+53,50,50);
    push();
    fill(0,0,0,100);
    noStroke();
    let rectHoehe = (player.skills[i].cooldown - player.skills[i].cooldownTimer) * (50 / player.skills[i].cooldown);
    rect(skillbarPos[0]+(i*60),skillbarPos[1]+50,50,-rectHoehe);
    pop();
    if(i === player.aModus){
      push();
      stroke(0);
      strokeWeight(4);
      noFill();
      rect(skillbarPos[0]+(i*60),skillbarPos[1],50,50);
      pop();
    }
  }
}
function drawSkillHover(){
  for(let i = 0; i < player.skills.length; i++){
    if(colPointBox(mouseX,mouseY,skillbarPos[0] + (i*60),skillbarPos[1],50,50)){
      push();
      fill(0,0,0,140);
      rect(mouseX,mouseY-120,200,120);
      noStroke();
      fill(255);
      textSize(14);
      text(player.skills[i].name,mouseX +3,mouseY - 106);
      fill(255,0,0);
      text("Damage: " +player.skills[i].damage,mouseX + 3,mouseY - 90);
      fill(0,0,255);
      text("Mana: " + player.skills[i].mana,mouseX +85,mouseY - 90);
      fill(255);
      textSize(10);
      textStyle(ITALIC);
      text(player.skills[i].flavorText,mouseX +3,mouseY - 75,190,120);
      pop();
    }
  }
}
// Items
function itemSpawn(type,x,y){
    item = {
        x:x,
        y:y,
        size:0,
        type:0,
        isConsumable: false,
        skin:0,
        img: []
    };
    let rnd = random(type);
    //Positive Consumabels Negative Ausrüstungen
    item.type = rnd;
    switch(rnd){
        case -2:
            item.size =  7;
            item.isConsumable = false;
            item.img = [healingPotion];
        break;
        case -1:
            //Lebenstrank
            item.size =  30;
            item.isConsumable = false;
            item.img = [healingPotion];
        break;
        case 0:
            //Gedroppte Lebenitems
            item.size =  10;
            item.isConsumable = true;
            item.img = [lifeItem];
        break;
        case 1:
            // Gedroppte Manaitems
            item.size =  10;
            item.isConsumable = true;
            item.img = [manaItem];
        break;
    }
}
function itemDraw(){
    for(let i in room.items){
      push();
      imageMode(CENTER);
      image(room.items[i].img[0],room.items[i].x,room.items[i].y,room.items[i].size,room.items[i].size);
      pop();
    }
}
//Gegner
function enemySpawn() {
  let rnd = random(room.rEnemyType);
  enemy = {
    x: 0,
    y: 0,
    rot: 0,
    speed: 0,
    size: 0,
    type: 0,
    aTime: 0,
    aSpeed:0,
    aModus:0,
    maxHp: 0,
    hp: 0,
    skin: 2,
    isDead: false,
    spawnTime: 20,
    img: []
  };
  switch(rnd){
    case 0:
        enemy.speed= 3;
        enemy.size= 18;
        enemy.maxHp= 15;
        enemy.img = [enemySlime,enemySlimeDead,enemySlimeSpawning];
      break;
    case 1:
        enemy.speed= 2;
        enemy.size= 40;
        enemy.maxHp= 60;
        enemy.img = [enemySlime,enemySlimeDead,enemySlimeSpawning];
      break;
    case 2:
        enemy.speed= 2;
        enemy.size= 30;
        enemy.maxHp= 60;
        enemy.aSpeed = 20;
        enemy.img = [enemySlime,enemySlimeDead,enemySlimeSpawning];
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
                if(colRObjRObj(room.enemys[j], bullets[i])&& bullets[i].type>-1){
                    enemyDamage(room.enemys[j],bullets[i].damage);
                    bullets.splice(i,1);
                    if(room.enemys[j].isDead){
                      room.deadEnemys.push(room.enemys[j]);
                      room.enemys.splice(j,1);
                    }
                    return;
                }
            }
        }
    }


}
function enemyDamage(enemy,damage){
    enemy.hp = enemy.hp - damage;
    if(enemy.hp <= 0){
        enemy.isDead = true;
        let rnd = rndInt(100);
        if(rnd < 10){
            itemSpawn([1],enemy.x +random (-4,4),enemy.y+random (-4,4));
            room.items.push(item);
        }else if(rnd>95){
            itemSpawn([0],enemy.x +random (-4,4),enemy.y+random (-4,4));
            room.items.push(item);
        }
        if (enemyCountAlive() <= 0){
            openDoors(true);
            player.mana = player.maxMana;
        }
    }
}
function enemyMove(){
    for(let i in room.enemys){
        if(room.enemys[i].isDead=== false ){
            if(room.enemys[i].spawnTime <= 0){
                if(room.enemys[i].type !=2){
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
              let vx = [-1, 0];
              let vy = [room.enemys[i].x - player.x, room.enemys[i].y - player.y];
              let a = acos((vx[0] * vy[0] + vx[1] * vy[1]) / (betrag(vx) * betrag(vy)));
              if (player.y < room.enemys[i].y) {
                  a = -a;
              }
              room.enemys[i].rot = a;
            }else{
                room.enemys[i].spawnTime--;
            }
        }
    }
}
function enemyAttack(){
    for(let i in room.enemys){
        if(room.enemys[i].isDead === false){
            switch(room.enemys[i].type){
                case 2:
                    let vx = [-1, 0];
                    let vy = [room.enemys[i].x - player.x+random(-10,10), room.enemys[i].y - player.y+random(-10,10)];
                    let a = acos((vx[0] * vy[0] + vx[1] * vy[1]) / (betrag(vx) * betrag(vy)));
                    if (player.y < room.enemys[i].y) {
                        a = -a;
                    }
                    room.enemys[i].rot = a;
                    room.enemys[i].aTime++;
                    if(room.enemys[i].aTime > room.enemys[i].aSpeed){
                        bulletSpawn(a,-1,room.enemys[i].x,room.enemys[i].y);
                        room.enemys[i].aTime = 0;
                    }
                break;    
            }
        }
    }
}
function enemyDraw(){
    //Skin 2 ist am Aufwachen | Skin 1 ist Tod | Skin 0 ist am Leben
    push();
  for(let j in room.deadEnemys){
    push();
    fill(0);
    imageMode(CENTER);  
    translate(room.deadEnemys[j].x,room.deadEnemys[j].y);
    rotate(room.deadEnemys[j].rot);  
    image(room.deadEnemys[j].img[1],0,0,room.deadEnemys[j].size,room.deadEnemys[j].size);
    pop();
  }  
  for(let i in room.enemys){
    push();
    if(room.enemys[i].spawnTime <= 0)
        room.enemys[i].skin = 0;  
    imageMode(CENTER); 
    translate(room.enemys[i].x,room.enemys[i].y);
    rotate(room.enemys[i].rot);
    image(room.enemys[i].img[room.enemys[i].skin],0,0,room.enemys[i].size,room.enemys[i].size);
    pop();
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
    room = {
        x: 0,
        y: 0,
        rTyp: 0,
        rEnemyCount: 0,
        rEnemyType: [],
        rItemCount: 0,
        rItemType:[],
        rSizeX: 0,
        rSizeY: 0,
        rShape: 0,
        rStartpoint: [],
        isVisited: false,
        items: [],
        enemys: [],
        deadEnemys: [],
        doors: []
    };
  switch (rTyp) {
    case -1:
        room.rSizeX= 469;
        room.rSizeY= 430;
        room.rShape= 0;
        room.rItemCount = 1;
        room.rItemType = [-1];
        room.rStartpoint= [width/2, height/2];
      break;
    case -2:
        room.rSizeX= 300;
        room.rSizeY= 300;
        room.rShape= 0;
        room.rStartpoint= [width/2,height/2];
      break;
    case 0:
        room.rEnemyCount= 5;
        room.rEnemyType= [0];
        if(rndOutcome(20))
          room.rItemCount= 1;
        room.rItemType = [-1];
        room.rSizeX= 430;
        room.rSizeY= 430;
        room.rShape= 1;
        room.rStartpoint= [width/2,height/2];
      break;
    case 1:
        room.rEnemyCount= rndInt(6);
        room.rEnemyType= [0,1,2];
        room.rItemCount= 0;
        room.rSizeX= 500;
        room.rSizeY= 360;
        room.rShape= 0;
        room.rStartpoint= [width/2,height/2];
      break;
  }
  room.rTyp = rTyp;
}
function roomGeneration() {

  if(room.doors.length === 0)
    setDoors();
  while(room.enemys.length + room.deadEnemys.length < room.rEnemyCount ){
    enemySpawn();  
    room.enemys.push(enemy);
  }
  if(room.isVisited === false){
    while(room.items.length < room.rItemCount){
        itemSpawn(room.rItemType,0,0);
        let pos = rndPositionInRoom(item.size); 
        item.x = pos[0];
        item.y= pos[1]; 
        room.items.push(item);
    } 
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
  }else{
    player.x = room.rStartpoint[0];
    player.y = room.rStartpoint[1];
  }
  if(enemyCountAlive() <= 0){
    openDoors(true);
  }else{
    openDoors(false);
  }
  room.isVisited = true;
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
  let i = getInPointArray(player.xMap, player.yMap - 1, map);
  if(typeof doorClosed !== "undefined"){ 
  if( i>=0){
    if(map[i].rTyp === -2){
      room.doors.push({x:width/2-20, y: height/2 - room.rSizeY/2,sx:40,sy:40,isOpen:true,direction:3,img: [doorClosed,doorOpen]});
    }else{
      room.doors.push({x:width/2-20, y: height/2 - room.rSizeY/2,sx:40,sy:40,isOpen:true,direction:3,img: [doorClosed,doorOpen]});
    }
    console.log("Türen oben esetzt");
  }
  }
  i = getInPointArray(player.xMap - 1, player.yMap, map);
  if ( i>=0) {
    if(map[i].rTyp === -2){
      room.doors.push({x:width/2 -room.rSizeX/2 ,y:height/2 -20,sx:40,sy:40, isOpen:true,direction:2,img: [doorClosed,doorOpen]});  
    }else{
      room.doors.push({x:width/2 -room.rSizeX/2 ,y:height/2 -20,sx:40,sy:40, isOpen:true,direction:2,img: [doorClosed,doorOpen]});  
    }  
  }
  //console.log("Türen links esetzt");
  i= getInPointArray(player.xMap, player.yMap + 1, map);
  if (i >=0) {
    if(map[i].rTyp === -2){
      room.doors.push({x:width/2-20,y:height/2 + room.rSizeY/2-40,sx:40,sy:40,isOpen:true,direction:1,img: [doorClosed,doorOpen]});
    }else{
      room.doors.push({x:width/2-20,y:height/2 + room.rSizeY/2-40,sx:40,sy:40,isOpen:true,direction:1,img: [doorClosed,doorOpen]});
    }
  }
  //console.log("Türen unten esetzt");
  i = getInPointArray(player.xMap + 1, player.yMap, map);
  if (i >= 0) {
    if(map[i].rTyp === -2){
      room.doors.push({x:width/2+ room.rSizeX/2-40,y:height/2 -20,sx:40,sy:40, iOpen: true,direction:0,img: [doorClosed,doorOpen]});
    }else{
      room.doors.push({x:width/2+ room.rSizeX/2-40,y:height/2 -20,sx:40,sy:40, iOpen: true,direction:0,img: [doorClosed,doorOpen]});
    }
  }
}
function drawDoors(){
  push();
  fill(100);
  for(let i in room.doors){
    if(room.doors[i].isOpen === true){
      image(room.doors[i].img[1],room.doors[i].x,room.doors[i].y,40,40);
    }else{
      image(room.doors[i].img[0],room.doors[i].x,room.doors[i].y,34,40);
    }
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
      if(map.length === mapSize -1){
        rndType = -2;
        roomSet(rndType);
        room.x = ersteller.x;
        room.y = ersteller.y;
        map.push(room);
      }else{
        roomSet(rndType);
        room.x = ersteller.x;
        room.y = ersteller.y;
        map.push(room);
        }
      }
  }
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
  let i = getMouseInventoryClick();
  if(i > -1){
    if(player.inventory[i] != null){
      switch(player.inventory[i].type){
        case -1:
          player.hp = player.hp+10;
          player.inventory.splice(i,1);
        break;  
      }
    }   
  }
  onMenueClicked();
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
function getInPointArray(x, y, array) {
  for (let i  = 0; i < array.length; i++) {
    if (x === array[i].x && y === array[i].y) {
      return i;
    }
  }
  return -1;
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
    if(d < obj1.size/2+obj2.size/2){
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
function rndOutcome(p){
  let rnd = rndInt(100);
  if(rnd < p){
    return true;
  }else{
    return false;
  }
}


//Menues
function menueDraw(){
  if(menueNow === 2){
    roomDraw();
    if(drawingMap=== true)
    mapDraw();
    drawDoors();
    enemyDraw();
    itemDraw(); 
    playerDraw();
    bulletDraw();
  }
  switch(menueNow){
    case 2:
      push();
      noStroke();
      fill(50,50,50,30);
      rect(0,0,width,height);
      pop();
    break;  
  }
  drawButtons();
}
function onMenueClicked(){
  for(let i in buttons){
    if(colPointBox(mouseX,mouseY,buttons[i].x,buttons[i].y,buttons[i].sx,buttons[i].sy)){
      buttonClicked(buttons[i].id);
      return;
    }
  }
}
function switchMenue(id){
  //1:StartMenue, 2: PauseMenue
  buttons = [];
  menueNow = id;
  switch(id){
    case 0:
      setButton(width/2+350,height/2-260,1);
    break;
    case 1:
      setButton(width/2-50,height/2-25,0);
    break;  
    case 2:
      setButton(width/2-50,height/2-25,2);
    break;    
  }
}

function drawButtons(i){
  push();
  for(let i in buttons){
    image(buttons[i].img[0],buttons[i].x ,buttons[i].y,buttons[i].sx,buttons[i].sy);
  }
  pop();
}
function setButton(x,y,id){
  button = {
    x:x,
    y:y,
    sx: 0,
    sy: 0,
    id: id,
    img: []
  };
  switch(id){
    // 0: Start,1: Pause,2: weiter
    case 0:
      button.sx = 100;
      button.sy  = 50;
      button.img = [startButton];
      break;
    case 1:
      button.sx = 70;
      button.sy  = 25;
      button.img = [buttonPause];
      break;
    case 2:
      button.sx = 100;
      button.sy  = 50;
      button.img = [buttonWeiter];
    break;
  }
  buttons.push(button);
}
function buttonClicked(id){
  //1:StartMenue, 2PauseMenue
  switch(id){
    case 0:
    switchMenue(0);
    break;
    case 1:
    switchMenue(2);
    break;
    case 2:
    switchMenue(0);
    break;
  }
}