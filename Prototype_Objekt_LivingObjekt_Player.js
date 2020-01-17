

let Player = function (){
    this.startHp = 40;
    LivingObject.call(this,this.startHp);
    this.sizeX = 40;
    this.startSpeed = 7;
    this.speed = 7;
    this.img = [mageFire, mageFire_shoot1];
    this.shape = 0;
    this.offsetSizeX = 20;
    this.offsetX = 5;
    this.offsetY = 0;
  
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
    if (keyIsDown(this.keyListMovement[0]) && inRoom(this.x,this.y-this.sizeX/2)) {
      this.move(-HALF_PI);
    }
    //a
    if (keyIsDown(this.keyListMovement[1])&& inRoom(this.x-this.sizeX/2,this.y)) {
      this.move(PI);
    }
    //s
    if (keyIsDown(this.keyListMovement[2])&& inRoom(this.x,this.y+this.sizeX/2)) {
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
            this.mana  = this.mana -this.skills[this.skill].mana;
            this.skills[this.skill].cooldownTimer = this.skills[this.skill].cooldown;
           }
        }
    }
  };
  Player.prototype.collision = function(){
    this.speed = this.startSpeed;
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
          if(this.inventory.length < 25){
            this.inventory.push(room.items[i]);
            room.items.splice(i,1);
          }
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
          if(room.enemys[i].bodyDamage > 0)
            this.invincibleTime = 5;
          if(room.enemys[i].type === Types.Enemy.SlimeArea){
              this.speed = this.speed/5;
          }
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
    rect(inventoryPos[0],inventoryPos[1],250,250);
    pop();
    for(let i  in this.inventory){
      image(this.inventory[i].img[0],inventoryPos[0]+ix*50,inventoryPos[1] +50*iy,50,50);
      ix++;
      if(ix >= 5){
        iy++;
        ix = 0;
      }
    }
    ix = 0;
    iy = 0;
    for(let i in this.inventory){
      if(colPointBox(mouseX,mouseY,inventoryPos[0]+ix*50,inventoryPos[1] +50*iy,50,50)){
        this.inventory[i].drawHover();
      }
      ix++;
      if(ix >= 5){
        iy++;
        ix = 0;
      }
    }
  };
  Player.prototype.drawRunes = function(){
    push();
    imageMode(CENTER);
    image(runenCenter,runenPos[0],runenPos[1],100,100);
    pop();
  };
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
  };
  Player.prototype.drawHud = function(){
    this.drawInventory();
    this.drawSkillbar();
    this.drawStats();
    this.drawSkillbarHover();
    this.drawRunes();
    text("M: Map   Strg: Items im inventar bewegen",width/2+300,height/2+70);
  
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
  };
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
  };
  
  function playerManager(){
    player.getRuneBonuses();
    player.collision();
    player.controll();
  }