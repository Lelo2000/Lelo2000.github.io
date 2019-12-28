function Player(){
    this.x= room.rStartpoint[0];
    this.y= room.rStartpoint[1];
    this.xMap= 10;
    this.yMap= 10;
    this.rot= 0;
    this.speed= 7;
    this.aModus= 0;
    this.hp= 40;
    this.maxHp= 40;
    this.maxMana= 50;
    this.manaRegen= 3;
    this.mana= 40;
    this.invincibleTime=0;
    this.skin= 0;
    this.size= 60;
    this.inventory=[];
    this.skills = [];
    this.img= [mageFire, mageFire_shoot1,mageFireShield];
    this.animation= 0;

    controll = function() {
        for(let i in this.skills){
          if(this.skills[i].cooldownTimer < this.skills[i].cooldown){
            this.skills[i].cooldownTimer++;
          }
        }
        //Bewegunf
        //w
        if (keyIsDown(87) && inRoom(this.x,this.y-20)) {
          this.y = this.y - this.speed;
        }
        //a
        if (keyIsDown(65)&& inRoom(this.x-20,this.y)) {
          this.x = this.x - this.speed;
        }
        //s
        if (keyIsDown(83)&& inRoom(this.x,this.y+20)) {
          this.y = this.y + this.speed;
        }
        //d
        if (keyIsDown(68)&& inRoom(this.x+20,this.y)) {
          this.x = this.x + this.speed;
        }
        //Mana
        if(time % 20 === 0 && this.mana < this.maxMana){
            this.mana = this.mana + this.manaRegen;
        }
        if(this.mana> this.maxMana){
            this.mana = this.maxMana;
        }
        if(this.hp> this.maxHp){
          this.hp = this.maxHp;
      }
        //AngriffsAuswahl
        if(this.skills.length >= 1)
          if (keyIsDown(this.skills[0].key)) {
            this.aModus = 0;
          }
        if(this.skills.length >= 2)
        if (keyIsDown(this.skills[1].key)) {
          this.aModus = 1;
        }
        if(this.skills.length >= 3)
          if(keyIsDown(this.skills[2].key)){
           this.aModus = 2;
         }
        if(this.skills.length >= 4)
         if(keyIsDown(this.skills[3].key)){
           this.aModus = 3;
         }
        //Angriff
        if (mouseIsPressed) {
          if(mouseX< width/2+300){
            let vx = [1, 0];
            let vy = [mouseX - this.x, mouseY - this.y];
            let a = acos((vx[0] * vy[0] + vx[1] * vy[1]) / (betrag(vx) * betrag(vy)));
            if (mouseY < this.y) {
              a = -a;
            }
            this.rot = a;
            this.animation = 1;
            if(this.skills[this.aModus].cooldownTimer >= this.skills[this.aModus].cooldown && this.mana > this.skills[this.aModus].mana && this.invincibleTime <= 0){
              this.attack();
              this.skills[this.aModus].cooldownTimer = 0;
            }
          }
        }
    };
    attack = function () {
        bulletX = this.x+35*cos(this.rot-0.89);
        bulletY = this.y+35*sin(this.rot-0.89);
        let vx = [1, 0];
        let vy = [mouseX - bulletX, mouseY - bulletY];
        let bulletA = acos((vx[0] * vy[0] + vx[1] * vy[1]) / (betrag(vx) * betrag(vy)));
        if (mouseY < bulletY) {
          bulletA = -bulletA;
        }
          if(this.skills[this.aModus].type === 0){
              bulletSpawn(bulletA,0,bulletX,bulletY);
              soundFireball.setVolume(0.1);
              soundFireball.play();
            }
          if(this.skills[this.aModus].type === 1){
              bulletSpawn(bulletA,1,bulletX,bulletY,5);
              bulletSpawn(bulletA+0.15,1,bulletX,bulletY);
              bulletSpawn(bulletA-0.15,1,bulletX,bulletY);
              soundTrippelFireball.setVolume(0.1);
              soundTrippelFireball.play();
          }
          if(this.skills[this.aModus].type === 2){
            bulletSpawn(random(2*PI),1,bulletX,bulletY);
          }
          if(this.skills[this.aModus].type === 3){
            this.invincibleTime += 2;   
          }
          this.mana = this.mana -this.skills[this.aModus].mana;
      
    };
    collision =function() {
        //Türen  
        for(let i in room.doors){
          if(colPointBox(this.x,this.y,room.doors[i].x,room.doors[i].y,room.doors[i].sx,room.doors[i].sy) && room.doors[i].isOpen === true){
            switch(room.doors[i].direction){
              case 0:
                this.xMap += 1;
                roomChange(0);
              break;
              case 1:
                this.yMap += 1;
                roomChange(1);
              break;
              case 2:
                this.xMap -= 1;
                roomChange(2);
              break;
              case 3:
                this.yMap -= 1;
                roomChange(3);
              break;  
            } 
            return;     
          }
        }
        //Monster
        for(let i in room.enemys){
          if(colRObjRObj(player,room.enemys[i]) && this.invincibleTime <= 0 && room.enemys[i].isDead === false && room.enemys[i].spawnTime <= 0){
            this.hp = this. hp -3;
            this.invincibleTime = 5; 
          }
        }
        //Gegnerische Kugeln
        for(let i in bullets){
            if(bullets[i].type < 0 && colRObjRObj(bullets[i],player)){
                  if(this.invincibleTime <= 0)
                    this.hp = this.hp-bullets[i].damage;
                  bullets.splice(i,1);    
            }
        }
        //Items
        for(let i in room.items){
          if(colRObjRObj(player,room.items[i])){ 
              if(room.items[i].isConsumable === true){
                  switch(room.items[i].type){
                      case 0:
                          if(this.hp< this.maxHp){
                          this.hp = this.hp +4;
                          room.items.splice(i,1);
                          }
                      break;
                      case 1:
                          if(this.mana<this.maxMana){
                              this.mana = this.mana +4;
                              room.items.splice(i,1);
                          }
                      break;    
                  }
              }else{
                if(this.inventory.length < 20){
                  room.items[i].skin = 1;
                  this.inventory.push(room.items[i]);
                  room.items.splice(i,1);
                }
              }
          }
        }
        if(this.invincibleTime > 0){
          this.invincibleTime--;
        }
    };
    animation =function (){
        if(this.animation === 0){
          this.skin = 0;
        }
        if(this.animation === 1){
          this.skin = 1;
          this.animation = 0;
        }
        if(this.invincibleTime > 0){
          this.skin = 2;
        }
    };
    draw = function () {
        this.animation();
        push();
        translate(this.x, this.y);
        rotate(this.rot);
        translate(0, 0);
        rectMode(CENTER);
        imageMode(CENTER);
        image(this.img[this.skin],0,0,this.size*1.5,this.size*1.5);
        fill(0,0,0,50);
        pop();
        this.lifebar();
        this.drawinventory();
        DrawSkillbar();
    };
    drawInventory = function(){
        let ix = 0;
        let iy = 0;
        for(let i  in this.inventory){
          if(this.inventory[i].skin === 1){
            switch(this.inventory[i].type){
              case -1:
                fill(255,100,0);
              break;
              case -2:
                fill(0,100,255);
              break;
            }
            image(this.inventory[i].img[0],inventoryPos[0]+ix*50,inventoryPos[1] +50*iy,50,50);
            ix++;
            if(ix >= 5){
              iy++;
              ix = 0;
            }
          }
        }
    };
    lifebar = function(){
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
}
