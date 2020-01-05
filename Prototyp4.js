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


let Skill = function(name,type,damage,cooldown,img){
  this.damage = damage;
  this.mana = 0;
  this.type= type;
  this.cooldown= cooldown;
  this.cooldownTimer= 0;
  this.name= name;
  this.img= img;
  this.flavorText="";
  this.key= 0;
  this.isInstant = false;
  this.startDamage = damage;
};
Skill.prototype.action = function(){
};
let Fireball = function(){
  Skill.call(this,"Feuerball",0,10,10,[fireball_skillbar]);
  this.flavorText="Ein mächtiger Feuerball der deine Gegner zerschmettert";
};
Fireball.prototype = Object.create(Skill.prototype);
Fireball.prototype.action = function(){
  bulletX = player.x+35*cos(player.rot-0.89);
  bulletY = player.y+35*sin(player.rot-0.89);
  let a = getAngelBetweenPoint(bulletX,bulletY,mouseX,mouseY);
  bullets.push(new Fireballbullet(bulletX,bulletY,a,0,this.damage));
};
let TripleFireball = function(){
  Skill.call(this,"Dreifach Feuerball",1,10,15,[trippelFireball_skillbar]);
  this.flavorText = "Drei kleinere Feuerbälle, um mehrere Gegner gleichzeitig zu besiegen";
}
TripleFireball.prototype = Object.create(Skill.prototype);
TripleFireball.prototype.action = function(){
  bulletX = player.x+35*cos(player.rot-0.89);
  bulletY = player.y+35*sin(player.rot-0.89);
  let a = getAngelBetweenPoint(bulletX,bulletY,mouseX,mouseY);
  bullets.push(new Fireballbullet(bulletX,bulletY,a+0.15,0,this.damage));
  bullets.push(new Fireballbullet(bulletX,bulletY,a-0.15,0,this.damage));
  bullets.push(new Fireballbullet(bulletX,bulletY,a,0,this.damage));
};

let MageShield = function(){
  Skill.call(this,"Magisches Schild",2,0,0,[magicShield_Skillbar]);
  this.flavorText= "Schützte dich mit einem Magischen Schild, der Angriffe abwehrt.";
  this.mana = 1;
  this.isInstant = true;
}
MageShield.prototype = Object.create(Skill.prototype);
MageShield.prototype.action = function(){
  player.invincibleTime = 2;
}

let Menue = function (type){
  this.buttons = [];
  this.type = type;
}
Menue.prototype.update = function (){
  clear();
  for(let i in this.buttons){
    this.buttons[i].draw();
    if(colPointObj(mouseX,mouseY,this.buttons[i])){
      this.buttons[i].hover();
    }else{
      this.buttons[i].hoverTime = 0;
    }
  }
}
let MenueStart = function(){
  Menue.call(this,1);
  this.buttons.push(new ButtonStart(width/2,height/2));
  this.buttons.push(new ButtonOptionen(width/2,height/2+60));
}
MenueStart.prototype = Object.create(Menue.prototype);

let MenueInGame = function(){
  Menue.call(this,0);
  this.buttons.push(new ButtonPause(inventoryPos[0]+45,inventoryPos[1]-30));
  //Runenbuttons: Oben
  this.buttons.push(new ButtonRuneSwitch(runenPos[0],runenPos[1]-70,0));
  //Oben rechts
  this.buttons.push(new ButtonRuneSwitch(runenPos[0]+40,runenPos[1]-40,1));
  //Rechts
  this.buttons.push(new ButtonRuneSwitch(runenPos[0]+70,runenPos[1],2));
  //Unten rechts
  this.buttons.push(new ButtonRuneSwitch(runenPos[0]+40,runenPos[1]+40,3));
  //Unten
  this.buttons.push(new ButtonRuneSwitch(runenPos[0],runenPos[1]+70,4));
  //Unten links
  this.buttons.push(new ButtonRuneSwitch(runenPos[0]-40,runenPos[1]+40,5));
  //Links
  this.buttons.push(new ButtonRuneSwitch(runenPos[0]-70,runenPos[1],6));
  //Oben Links
  this.buttons.push(new ButtonRuneSwitch(runenPos[0]-40,runenPos[1]-40,7));
}
MenueInGame.prototype = Object.create(Menue.prototype);

let MenuePause = function(){
  Menue.call(this,2);
  this.buttons.push(new ButtonWeiter(width/2+60,height/2));
  this.buttons.push(new ButtonOptionen(width/2-60,height/2));
}
MenuePause.prototype = Object.create(Menue.prototype);
MenuePause.prototype.update = function(){
  clear();
  mapDraw();
  room.draw();
  for(let i in room.doors){
    room.doors[i].draw();
  }
  for(let j in room.items){
    room.items[j].draw();
  }
  player.draw();
  player.drawHud();
  for(let k in room.enemys){
    room.enemys[k].draw();
  }
  push();
  fill(0,0,0,40);
  rect(0,0,width,height);
  pop();
  for(let i in this.buttons){
    this.buttons[i].draw();
    if(colPointObj(mouseX,mouseY,this.buttons[i])){
      this.buttons[i].hover();
    }else{
      this.buttons[i].hoverTime = 0;
    }
  }
}

let MenueOptionen = function(){
  Menue.call(this,3);
  this.state =0;
  this.activeButton = -1;
}
MenueOptionen.prototype = Object.create(Menue.prototype);
MenueOptionen.prototype.update= function(){
  clear();
  for(let i in this.buttons){
    if(this.buttons[i].isPressed){
      this.activeButton = i;
      break;
    }else{
      this.activeButton = -1;
    }
  }
  for(let i in this.buttons){
    this.buttons[i].draw();
    if(colPointObj(mouseX,mouseY,this.buttons[i])){
      this.buttons[i].hover();
    }else{
      this.buttons[i].hoverTime = 0;
    }
    if(this.activeButton === i){
      push()
      rectMode(CENTER);
      noFill();
      rect(width/2+153,height/2+50*i-194,20,20)
      pop();
    }
  }
  for(let i in player.skills){
    if(this.state === 0){
      this.buttons.push(new ButtonOptionenTastenauswahl(width/2+153,height/2+50*i-194));
    }
    text(player.skills[i].name,width/2-150,height/2+50*i-200,width,height);
    text(String.fromCharCode(player.skills[i].key),width/2+150,height/2+50*i-190);
  }
  if(this.state===0){
    this.buttons.push(new ButtonBack(100,100));
    this.state= 1;
  }
  if(this.activeButton > -1){
    if(this.buttons[this.activeButton].keyWhenPressed != keyCode){
      if(keyCode >= 97 && keyCode <= 122)
        keyCode = keyCode -32;
      if(isKeyFree(keyCode)){
        player.skills[this.activeButton].key = keyCode;
        this.buttons[this.activeButton].isPressed = false;
      }else{
        text("Diese Taste ist schon belegt",mouseX,mouseY);
      }
    }
  }
}


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
      ellipse(0,0,this.sizeX,this.sizeX);
  }  
  pop();
};
Obj.prototype.action = function (){
  console.log("Hey ich bin"+this);
}




let Button = function (x,y){
  Obj.call(this);
  this.x = x;
  this.y = y;
  this.shape = 1;
  this.hoverTime =0;
}; 
Button.prototype = Object.create(Obj.prototype);
Button.prototype.hover = function (){
  push();
  fill(255,255,255,this.hoverTime);
  noStroke();
  rect(this.x-this.sizeX/2,this.y-this.sizeY/2,this.sizeX,this.sizeY);
  pop();
  if(this.hoverTime < 100){
    this.hoverTime = this.hoverTime +15;
  }
}
let ButtonStart = function(x,y){
  Button.call(this,x,y);
  this.sizeX = 100;
  this.sizeY = 50;
  this.img = [startButton];
}
ButtonStart.prototype = Object.create(Button.prototype);
ButtonStart.prototype.action = function (){
  switchMenue(0);
}

let ButtonPause = function(x,y){
  Button.call(this,x,y);
  this.sizeX = 90;
  this.sizeY = 30;
  this.img = [buttonPause];
}
ButtonPause.prototype = Object.create(Button.prototype);
ButtonPause.prototype.action = function (){
  switchMenue(2);
}
let ButtonWeiter = function(x,y){
  Button.call(this,x,y);
  this.sizeX = 100;
  this.sizeY = 50;
  this.img= [buttonWeiter];
}
ButtonWeiter.prototype = Object.create(Button.prototype);
ButtonWeiter.prototype.action = function(){
  switchMenue(0);
}

let ButtonOptionen = function(x,y){
  Button.call(this,x,y);
  this.sizeX = 100;
  this.sizeY = 50;
  this.img = [buttonOptionen];
}
ButtonOptionen.prototype = Object.create(Button.prototype);
ButtonOptionen.prototype.action = function(){
  switchMenue(3);
}

let ButtonOptionenTastenauswahl = function(x,y){
  Button.call(this,x,y);
  this.sizeX = 20;
  this.sizeY = 20;
  this.img=[buttonTasten];
  this.isPressed = false;
  this.keyWhenPressed = 0;
}
ButtonOptionenTastenauswahl.prototype = Object.create(Button.prototype);
ButtonOptionenTastenauswahl.prototype.action = function(){
  this.isPressed = true;
  this.keyWhenPressed = keyCode;
}

let ButtonRuneSwitch = function (x,y,id){
  Button.call(this,x,y);
  this.sizeX = 40;
  this.sizeY = 40;
  this.img = [buttonTasten];
  this.id = id;
}
ButtonRuneSwitch.prototype = Object.create(Button.prototype);
ButtonRuneSwitch.prototype.action = function(){
  console.log(player.runes[this.id]);
  console.log(mouseDrag[0]);
  if(mouseDrag.length >0){
    if(mouseDrag[0].isRune){
      this.hover();
      if(player.runes[this.id] === undefined){
        player.runes[this.id] = mouseDrag[0];
        mouseDrag = [];
      }else{
        let zwischenablage = mouseDrag[0];
        mouseDrag[0] = player.runes[this.id];
        player.runes[this.id] = zwischenablage;
      }
    }
  }else{
    if(player.runes[this.id] != undefined){
      mouseDrag[0] = player.runes[this.id];
      delete player.runes[this.id];
    }
  }
}
ButtonRuneSwitch.prototype.draw = function (){
  push();
  imageMode(CENTER);
  image(this.img[0],this.x,this.y,this.sizeX,this.sizeY);
  pop();
  if(player.runes[this.id] != undefined){
    push();
    imageMode(CENTER);
    translate(this.x,this.y);
    rotate(player.runes[this.id].rot);
    image(player.runes[this.id].img[0],0,0,40,40);
    pop();
  }
}
ButtonRuneSwitch.prototype.hover = function(){
  if(mouseDrag.length > 0){
    if(mouseDrag[0].isRune){
      switch(this.id){
        case 1:
          mouseDrag[0].rot = PI/4; 
        break;
        case 2:
          mouseDrag[0].rot = PI/2; 
        break;
        case 3:
          mouseDrag[0].rot = PI*3/4; 
        break;
        case 4:
          mouseDrag[0].rot = -PI; 
        break;
        case 5:
          mouseDrag[0].rot = -PI*3/4; 
        break;
        case 6:
          mouseDrag[0].rot = -PI/2; 
        break;
        case 7:
          mouseDrag[0].rot = -PI*1/4; 
        break;
      }
    }
  }
}

let ButtonBack = function(x,y){
  Button.call(this,x,y);
  this.sizeX = 90;
  this.sizeY = 30;
  this.img = [buttonBack];
}
ButtonBack.prototype = Object.create(Button.prototype);
ButtonBack.prototype.action = function(){
  switchMenue(menueHistory[menueHistory.length-2]);
}




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
  this.x = width/2;
  this.y = height/2;
  this.type = type;

  this.mapX = x;
  this.mapY = y;
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
        this.itemCount = 20;
        this.itemType = [1,0,2];
        this.enemyCount = 0;
        this.enemyType = [1];
        this.startPoint= [width/2, height/2];
        this.img = [roomRectangle];
      break;
    case -2:
        this.sizeX= 300;
        this.sizeY= 300;
        this.shape= 1;
        this.img = [roomRectangle];
      break;
    case 0:
        this.enemyCount= 3;
        this.enemyType= [0,0,0,0,0,0,0,0,1];
        if(rndOutcome(20))
          this.itemCount = 1;
        this.itemType = [0];
        this.sizeX= 430;
        this.sizeY= 430;
        this.shape= 0;
        this.img = [roomCircle];
      break;
    case 1:
        this.enemyCount= rndInt(3);
        this.enemyType= [0];
        this.sizeX= 500;
        this.sizeY= 360;
        this.shape= 1;
        this.img = [roomRectangle];
      break;
  }
};
Room.prototype = Object.create(Obj.prototype);
Room.prototype.generation = function (){
    if(this.doors.length === 0)
      this.setDoors();
    while(this.enemys.length + this.deadEnemys.length < this.enemyCount ){
      let enType = random(this.enemyType);
      let en = getEnemyFromType(enType,0,0);
      let pos = this.rndPositionInRoom(en.sizeX); 
      en.x = pos[0];
      en.y = pos[1];
      this.enemys.push(en);  
    }
    if(this.isVisited === false){
      while(this.items.length < this.itemCount){
          let itemType = random(this.itemType);
          let item = getItemFromType(itemType,0,0);
          let pos = this.rndPositionInRoom(item.sizeX);
          item.x = pos[0];
          item.y = pos[1];  
          room.items.push(item);
      } 
    }
};
Room.prototype.setDoors = function(){
    //console.log("Türen werden gesetzt");
    let i = getInPointMap(player.xMap, player.yMap - 1);
    if( i>=0){
      if(map[i].type === -2){
        this.doors.push(new Door(width/2,height/2-this.sizeY/2+20,3,0));
      }else{
        this.doors.push(new Door(width/2,height/2-this.sizeY/2+20,3,0));
      }
      console.log("Türen oben esetzt");
    }
    i = getInPointMap(player.xMap - 1, player.yMap);
    if ( i>=0) {
      if(map[i].rTyp === -2){
        this.doors.push(new Door(width/2-this.sizeX/2 +20,height/2,2,0));  
      }else{
        this.doors.push(new Door(width/2-this.sizeX/2 +20,height/2,2,0));  
      }  
    }
    //console.log("Türen links esetzt");
    i= getInPointMap(player.xMap, player.yMap + 1);
    if (i >=0) {
      if(map[i].rTyp === -2){
        this.doors.push(new Door(width/2,height/2+this.sizeY/2-20,1,0));
      }else{
        this.doors.push(new Door(width/2,height/2+this.sizeY/2-20,1,0));
      }
    }
    //console.log("Türen unten esetzt");
    i = getInPointMap(player.xMap + 1, player.yMap);
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
Room.prototype.rndPositionInRoom = function(size){
    let x = 0;
    let y = 0;
    if(this.shape === 1){
       x = round(random(width/2 -this.sizeX/2 + size, width/2 + this.sizeX/2 - size));
       y = round(random(height/2 -this.sizeY/2 + size, height/2 + this.sizeY/2 - size));
    }
    //https://stackoverflow.com/questions/5837572/generate-a-random-point-within-a-circle-uniformly/50746409#50746409
    if(this.shape === 0){  
      let R = random(this.sizeX/2-size); 
      let r = R * sqrt(random(0,1));
      let theta = random() * 2 * PI;
      x = width/2 + r * cos(theta);
      y = height/2 + r * sin(theta);
    }
    return [x,y];
}




let Item = function(x,y,name,type){
  Obj.call(this);
  this.x = x;
  this.y = y;
  this.type = type;
  this.instantConsumable = false;
  this.isUsed = false;
  this.name = name;
  this.isRune = false;
}
Item.prototype = Object.create(Obj.prototype);

let HealingPotion = function (x,y){
  Item.call(this,x,y,"Heiltrank",0);
  this.sizeX = 30;
  this.img = [healingPotion];
};
HealingPotion.prototype = Object.create(Item.prototype);
HealingPotion.prototype.action = function(){
  player.hp = player.hp + 15;
  this.isUsed = true;
};

let HealingBlob = function(x,y){
  Item.call(this,x,y,"Healing Blob",-1);
  this.sizeX= 8;
  this.img = [lifeItem];
  this.instantConsumable = true;
};

HealingBlob.prototype = Object.create(Item.prototype);
HealingBlob.prototype.action = function (){
  if(player.hp < player.maxHp){
    player.hp = player.hp +5;
    this.isUsed = true;
  }
};

let ScrollTrippleFireball = function(x,y){
  Item.call(this,x,y,"Schriftrolle Dreifach Feuerball",-2);
  this.sizeX = 40;
  this.img = [scrollTrippleFireball];
  this.instantConsumable = true;
};
ScrollTrippleFireball.prototype = Object.create(Item.prototype);
ScrollTrippleFireball.prototype.action= function(){
  if(player.searchSkill(1) < 0){
    player.setSkill(new TripleFireball());
    this.isUsed = true;
  }
};



let Rune = function(x,y,name,type){
  Item.call(this,x,y,name,type);
  this.sizeX = 40;
  this.isRune = true;
  this.damage = 0;
  this.maxMana = 0;
  this.manaRegen = 0;
  this.maxHp = 0;
  this.lifeRegen = 0;
  this.cooldownReduction = 0;
}
Rune.prototype = Object.create(Item.prototype);
Rune.prototype.action = function(){
  player.runeBonus.damage += this.damage;
  player.runeBonus.maxMana += this.maxMana;
  player.runeBonus.manaRegen += this.manaRegen;
  player.runeBonus.liveRegen += this.lifeRegen;
  player.runeBonus.cooldownReduction += this.cooldownReduction;
  player.runeBonus.maxHp += this.maxHp;
}

let RuneMaxMana = function (x,y){
  Rune.call(this,x,y,"Manarune",1);
  this.maxMana = 40;
  this.img = [runeMaxMana];
}
RuneMaxMana.prototype = Object.create(Rune.prototype);

let RuneMaxHp = function(x,y){
  Rune.call(this,x,y,"Lebensrune",2);
  this.maxHp = 20;
  this.img = [runeMaxHp];
}
RuneMaxHp.prototype = Object.create(Rune.prototype);



let LivingObject= function(maxHp) {
  Obj.call(this);
  this.speed= 0;
  this.maxHp = maxHp;
  this.hp = this.maxHp;
  this.isAlive = true;
  this.animation = 0;
  this.animationTimer = 0;
};
LivingObject.prototype = Object.create(Obj.prototype);
LivingObject.prototype.move = function(rot){
  this.x = this.x + cos(rot) * this.speed;
  this.y = this.y + sin(rot) * this.speed;
};



let Player = function (){
  this.startHp = 40;
  LivingObject.call(this,this.startHp);
  this.sizeX = 60;
  this.sizeY = 60;
  this.speed = 7;
  this.img = [mageFire, mageFire_shoot1];

  this.xMap = 0;
  this.yMap = 0;
  this.startMana = 40;
  this.maxMana = this.startMana;
  this.mana = this.maxMana;
  this.startManaRegen = 2;
  this.manaRegen = this.startManaRegen;
  this.manaRegenTime = 15;
  this.invincibleTime = 0;
  this.skill = 0;
  this.skills = [];
  this.inventory = [];
  this.keyListStandardSkill = [49,50,51,52];
  this.keyListMovement = [87,65,83,68];
  //Runen Bonus   
  //this.runeBonus = {damage: 0, maxMana:0,manaRegen:0,lifeRegen:0,cooldownReduction:0};
  this.runes = [];
};
Player.prototype = Object.create(LivingObject.prototype);
Player.prototype.controll = function (){
   for(let i in this.skills){
     if(this.skills[i].cooldownTimer > 0){
       this.skills[i].cooldownTimer--;
    }
  }
  //Bewegung
  //w
  if (keyIsDown(this.keyListMovement[0]) && inRoom(this.x,this.y-this.sizeY/2)) {
    this.move(-HALF_PI);
  }
  //a
  if (keyIsDown(this.keyListMovement[1])&& inRoom(this.x-this.sizeX/2,this.y)) {
    this.move(PI);
  }
  //s
  if (keyIsDown(this.keyListMovement[2])&& inRoom(this.x,this.y+this.sizeY/2)) {
    this.move(HALF_PI);
  }
  //d
  if (keyIsDown(this.keyListMovement[3])&& inRoom(this.x+this.sizeX/2,this.y)) {
    this.move(0);
  }
  //Mana
  if(time % this.manaRegenTime === 0 && player.mana < player.maxMana){   
    player.mana = player.mana + player.manaRegen;
  }
 if(this.mana> this.maxMana){
    this.mana = this.maxMana;
  }
  if(this.hp> this.maxHp){
    this.hp = this.maxHp;
  }

  for(let i = 0; i< this.skills.length; i++){
    if(keyIsDown(this.skills[i].key)){
      if(this.skills[i].isInstant){
        if(this.mana> this.skills[i].mana){
         this.skills[i].action();
         this.mana = this.mana - this.skills[i].mana;
        }
      }else{
        this.skill = i;
      }
    }
  }
  // //Angriff
  if (mouseIsPressed) {
     if(mouseX< width/2+300){
      let a = getAngelBetweenPoint(this.x,this.y,mouseX,mouseY);
         this.rot = a;
         if(this.skills[this.skill].cooldownTimer <= 0 && this.mana >this.skills[this.skill].mana){
          player.animation = 1;
          player.animationTimer = 15;
          this.skills[this.skill].action();
          this.mana  = this.mana -this.skills[this.skill].mana
          this.skills[this.skill].cooldownTimer = this.skills[this.skill].cooldown;
         }
      }
  }
};
Player.prototype.collision = function(){
  if(this.invincibleTime > 0)
    this.invincibleTime--;
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
  for(let i in room.items){
    if(colObjObj(this,room.items[i])){
      if(room.items[i].instantConsumable === false){
        this.inventory.push(room.items[i]);
        room.items.splice(i,1);
      }else{
        room.items[i].action();
        if(room.items[i].isUsed)
          room.items.splice(i,1);
      }
    }
  }
  for(let i in bullets){
    if(bullets[i].type < 0){
      if(colObjObj(this,bullets[i])){
        if(this.invincibleTime <= 0)
          this.hp = this.hp - bullets[i].damage;
        bullets.splice(i,1);
      }
    }
  }
  if(this.invincibleTime <= 0){
    for(let i in room.enemys){
      if(colObjObj(this,room.enemys[i]) &&room.enemys[i].spawnTime <= 0){
        this.hp = this.hp-room.enemys[i].bodyDamage;
        this.invincibleTime = 5;
      }
    }
  }
};
Player.prototype.setSkill = function(skill){
  skill.key = this.keyListStandardSkill[this.skills.length];
  this.skills.push(skill);
};
Player.prototype.drawSkillbar = function(){
    for(let i= 0 ;i<this.skills.length; i++){
      image(this.skills[i].img[0],skillbarPos[0]+(i*60),skillbarPos[1],50,50);
      fill(0);
      text(String.fromCharCode(this.skills[i].key),skillbarPos[0]+23+(i*60),skillbarPos[1]+53,50,50);
      push();
      fill(0,0,0,100);
      noStroke();
      let rectHoehe = (this.skills[i].cooldownTimer) * (50 / this.skills[i].cooldown);
      rect(skillbarPos[0]+(i*60),skillbarPos[1]+50,50,-rectHoehe);
      pop();
      if(i === this.skill){
        push();
        stroke(0);
        strokeWeight(4);
        noFill();
        rect(skillbarPos[0]+(i*60),skillbarPos[1],50,50);
        pop();
      }
  }
};
Player.prototype.drawStats = function(){
    push();
    noStroke();
    fill("red");
    rect(width/2-234,height/2 - 254,this.maxHp*2,10);
    if(this.hp > 0){
      fill("green");
      rect(width/2-234,height/2 - 254,this.hp*2,10);
    }
    fill(0,0,100);
    rect(width/2-234,height/2 - 234,this.maxMana*2,10);
    if(this.mana > 0){
      fill(50,50,255);
      rect(width/2-234,height/2 - 234,this.mana*2,10);
    }
    pop();
};
Player.prototype.drawInventory = function(){
  let ix = 0;
  let iy = 0;
  push();
  noFill();
  rect(inventoryPos[0],inventoryPos[1],250,500)
  pop();
  for(let i  in this.inventory){
      image(this.inventory[i].img[0],inventoryPos[0]+ix*50,inventoryPos[1] +50*iy,50,50);
      ix++;
      if(ix >= 5){
        iy++;
        ix = 0;
      }
  }
}
Player.prototype.drawRunes = function(){
  push();
  imageMode(CENTER);
  image(runenCenter,runenPos[0],runenPos[1],100,100);
  pop();
}
Player.prototype.drawSkillbarHover = function(){
  for(let i = 0; i < this.skills.length; i++){
    if(colPointBox(mouseX,mouseY,skillbarPos[0] + (i*60),skillbarPos[1],50,50)){
      push();
      fill(0,0,0,140);
      rect(mouseX,mouseY-120,200,120);
      noStroke();
      fill(255);
      textSize(14);
      text(this.skills[i].name,mouseX +3,mouseY - 106);
      fill(255,0,0);
      text("Damage: " +this.skills[i].damage,mouseX + 3,mouseY - 90);
      fill(0,0,255);
      text("Mana: " + this.skills[i].mana,mouseX +85,mouseY - 90);
      fill(255);
      textSize(10);
      textStyle(ITALIC);
      text(this.skills[i].flavorText,mouseX +3,mouseY - 75,190,120);
      pop();
    }
  }
}
Player.prototype.drawHud = function(){
  this.drawInventory();
  this.drawSkillbar();
  this.drawStats();
  this.drawSkillbarHover();
  this.drawRunes();
  text("M: Map   Strg: Items im inventar bewegen",width/2-400,height/2+250);

};
Player.prototype.animations = function(){
  if(this.animationTimer> 0){
    this.animationTimer--;  
    if(this.animation === 1){
      this.skin = 1;
    }
  }else{
    this.skin = 0;
  }
  if(this.invincibleTime> 0){
    push();
    fill(0,0,255,140);
    noStroke();
    ellipse(this.x,this.y,this.sizeX,this.sizeX);
    pop();
  }
};
Player.prototype.searchSkill = function(t){
  for(let i in this.skills){
    if(this.skills[i].type === t){
      return i;
    }
  }
  return -1;
}
Player.prototype.getRuneBonuses = function(){
  this.runeBonus = {damage: 0, maxMana:0,manaRegen:0,lifeRegen:0,cooldownReduction:0,maxHp: 0};
  for(let i in this.runes){
    this.runes[i].action();
  }
  this.maxMana = this.startMana + this.runeBonus.maxMana;
  this.manaRegen = this.startManaRegen + this.runeBonus.manaRegen;
  this.maxHp = this.startHp+this.runeBonus.maxHp;
  for(let j in this.skills){
    this.skills[j].damage = this.skills[j].startDamage + this.runeBonus.damage;
  }
}

let Bullet = function(x,y,a,type,maxHp,img,size,speed,damage){
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
  this.damage = damage;
}
Bullet.prototype = Object.create(LivingObject.prototype);

let Fireballbullet = function (x,y,a,type,damage){
  Bullet.call(this,x,y,a,type,1,[],12,12,damage);
  if(type === 0){
    this.img = [fireball];
  }else{
    this.img = [enemyFireball];
  }
}
Fireballbullet.prototype = Object.create(Bullet.prototype);

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
Enemy.prototype.movingToPlayer = function(){
  this.rot =getAngelBetweenPoint(this.x,this.y,player.x,player.y); 
  this.move(this.rot);
};
Enemy.prototype.collision = function (){
  for(let i in bullets){
    if(bullets[i].type >= 0){
      if(colObjObj(this,bullets[i])){
        this.hp = this.hp - bullets[i].damage;
        bullets.splice(i,1);
        if(this.hp <= 0){
          this.onDeath();
          this.isAlive = false;
          this.skin = 1;
          room.deadEnemys.push(this);  
        }
        return;
      }
    }
  }
}
Enemy.prototype.onDeath = function(){

}
Enemy.prototype.animations = function(){
  if(this.animationTimer>0){
    this.animationTimer--;
    if(this.animation === 1){
      this.skin = 3;
    }
  }else{
    this.skin = 0;
  }
  if(this.spawnTime > 0){
    this.skin = 2;
  }
}

let Slime = function(x,y,bigness){
  Enemy.call(this,bigness*5,0);
  this.x = x;
  this.y = y;
  this.speed = 8-bigness;
  this.sizeX = bigness*8;
  this.bodyDamage = bigness*2;
  this.bigness = bigness;
  this.img = [enemySlime,enemySlimeDead,enemySlimeSpawning,enemySlime];
} 
Slime.prototype = Object.create(Enemy.prototype);
Slime.prototype.action= function (){
  this.movingToPlayer();
}
Slime.prototype.onDeath= function(){
  //Teilung in 2 Schleims
  if(this.bigness>2){
    this.bigness--;
    room.enemys.push(new Slime(this.x-random(-8,8),this.y-random(-8,8),this.bigness));
    room.enemys.push(new Slime(this.x-random(-8,8),this.y-random(-8,8),this.bigness));
  }  
  //Item Dropp
  if(rndOutcome(5)){
    room.items.push(new HealingBlob(this.x,this.y));
  }
}
let fireMage = function(x,y){
  Enemy.call(this,240,1)
  this.x = x;
  this.y = y; 
  this.sizeX = 50;
  this.aSpeed = 15;
  this.bodyDamage = 1;
  this.img = [enemyFireMage,enemyFireMageDead,enemyFireMage,enemyFireMageAttack];
};
fireMage.prototype = Object.create(Enemy.prototype);
fireMage.prototype.action = function(){
  this.rot = getAngelBetweenPoint(this.x,this.y,player.x,player.y);
  let bulletX = this.x+17*cos(this.rot-0.95);
  let bulletY = this.y+17*sin(this.rot-0.95);
  if(this.aTime <= 6){
    this.animationTimer = 6;
    this.animation = 1;
    push();
    fill(0,0,0,160);
    stroke(255,0,0,160)
    strokeWeight(2);
    circle(bulletX,bulletY,7-this.aTime);
    pop();
  }
  if(this.aTime <= 0){

  bullets.push(new Fireballbullet(bulletX,bulletY,this.rot+0.35,-1,6));
  bullets.push(new Fireballbullet(bulletX,bulletY,this.rot-0.35,-1,6));
  bullets.push(new Fireballbullet(bulletX,bulletY,this.rot,-1,6));

  this.aTime = this.aSpeed;
  }else{
    this.aTime--;
  }
}
fireMage.prototype.onDeath= function(){
  if(rndOutcome(30)){
    room.items.push(new ScrollTrippleFireball(this.x,this.y));
  }
}


let start = true;
let player = {};
let room = {};
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
    enemyManager();
    playerManager();
    for(let j in room.items){
      room.items[j].draw();
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
    case 0:
      menueNow = new MenueInGame();
    break;
    case 1:
      menueNow = new MenueStart();
    break;
    case 2:
      menueNow = new MenuePause();
    break;
    case 3:
      menueNow = new MenueOptionen();
    break;
  }
  menueHistory.push(type);
}
function bulletHandler(){
  for(let i  in bullets){
    bullets[i].draw();
    bullets[i].move(bullets[i].rot);
  }
  for(let i in bullets){
    if (inRoom(bullets[i].x + bullets[i].sizeX/2, bullets[i].y) === false ||
    inRoom(bullets[i].x - bullets[i].sizeX/2, bullets[i].y) === false ||
    inRoom(bullets[i].x, bullets[i].y+ bullets[i].sizeY/2) === false ||
    inRoom(bullets[i].x, bullets[i].y- bullets[i].sizeY/2) === false ) {
     
      bullets.splice(i, 1);
    }  
  }
}
function playerManager(){
  player.getRuneBonuses();
  player.controll();
  player.collision();
}
function enemyManager(){
  for(let i in room.deadEnemys){
    room.deadEnemys[i].draw();
  }
  for(let i in room.enemys){
    if(room.enemys[i].isAlive === true){
     room.enemys[i].animations();
     room.enemys[i].draw();
     if(room.enemys[i].spawnTime <= 0){
      room.enemys[i].drawLifebar();
      room.enemys[i].action();
      room.enemys[i].collision();
     }else{
      room.enemys[i].spawnTime--;
      }
    }else{
     room.enemys.splice(i,1);
     if(room.enemys.length<= 0){
       room.openDoors(true);
     }
    }
  }
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
    case 0:
      return new Slime(x,y,4);
    break;
    case 1:
      return new fireMage(x,y) 
    break;
  }
}
function getItemFromType(type,x,y){
  switch(type){
    case -2:
      return new ScrollTrippleFireball(x,y);
    break;
    case 0:
      return new HealingPotion(x,y);
    break;
    case 1:
      return new RuneMaxMana(x,y);
    break;
    case 2:
      return new RuneMaxHp(x,y);
    break;
  }
}
//Drag and Drop
function mouseDragUpdate(){
  if(mouseDrag.length != 0){
    mouseDrag[0].x = mouseX;
    mouseDrag[0].y = mouseY;
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
function getMouseRunenBoardClick(){
  //Oben
  if(colPointBox(mouseX,mouseY,runenPos[0]-20,runenPos[1]-90,40,40))
    return 0
  //Schrägt oben rechts
  if(colPointBox(mouseX,mouseY,runenPos[0]+28,runenPos[1]-68,40,40))
    return 1;
  //Mitte rechts
  if(colPointBox(mouseX,mouseY,runenPos[0]+50,runenPos[1]-20,40,40))
    return 2;
  //Schrägt unten rechts
  if(colPointBox(mouseX,mouseY,runenPos[0]+28,runenPos[1]+29,40,40))
    return 3;
  //Unten
  if(colPointBox(mouseX,mouseY,runenPos[0]-20,runenPos[1]+50,40,40))
    return 4;
  //Schräg unten links
  if(colPointBox(mouseX,mouseY,runenPos[0]-72,runenPos[1]+29,40,40))
    return 5;
  //Mitte Links
  if(colPointBox(mouseX,mouseY,runenPos[0]-90,runenPos[1]-20,40,40))
    return 6;
  if(colPointBox(mouseX,mouseY,runenPos[0]-72,runenPos[1]-68,40,40))
    return 7;
  return -1;
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