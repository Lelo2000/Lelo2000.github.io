
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
  };
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
  };
  Enemy.prototype.onDeath = function(){
  };
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
  };
  
  
  
  let Slime = function(x,y,bigness){
    Enemy.call(this,bigness*5,Types.Enemy.Slime);
    this.x = x;
    this.y = y;
    this.speed = 8-bigness;
    this.sizeX = bigness*8;
    this.bodyDamage = bigness*2;
    this.bigness = bigness;
    this.img = [enemySlime,enemySlimeDead,enemySlimeSpawning,enemySlime];
  }; 
  Slime.prototype = Object.create(Enemy.prototype);
  Slime.prototype.action= function (){
    this.movingToPlayer();
  };
  Slime.prototype.onDeath= function(){
    //Teilung in 2 Schleims
    this.bigness--;
    if(this.bigness>1){
      room.enemys.push(new Slime(this.x-random(-8,8),this.y-random(-8,8),this.bigness));
      room.enemys.push(new Slime(this.x-random(-8,8),this.y-random(-8,8),this.bigness));
    }  
    //Item Dropp
    if(rndOutcome(5)){
      room.items.push(new HealingBlob(this.x,this.y));
    }
    if(this.bigness === 1){
      if(rndOutcome(2)){
        let rnd = rndInt(1);
        rnd++;
        room.items.push(getItemFromType(rnd,this.x+random(-this.sizeX,this.sizeX),this.y+random(-this.sizeX,this.sizeX)));
      }
    }
  };
  
  
  
  let fireMage = function(x,y){
    Enemy.call(this,240,Types.Enemy.FireMage);
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
      stroke(255,0,0,160);
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
  };
  fireMage.prototype.onDeath= function(){
    if(rndOutcome(30)){
      room.items.push(new ScrollTrippleFireball(this.x,this.y));
    }
  };
  
  
  
  let SlimeArea = function(px,py,size){
    Enemy.call(this,size,Types.Enemy.SlimeArea);
    this.x = px;
    this.y = py;
    this.sizeX = size;
    this.speed = 0;
    this.bodyDamage = 0;
    this.img = [slimeArea,slimeArea,slimeArea,slimeArea];
  };
  SlimeArea.prototype = Object.create(Enemy.prototype);
  SlimeArea.prototype.collision = function(){
    this.hp = this.hp-0.5;
    if(this.hp <= 0){
      this.isAlive = false;
    }
  };
  SlimeArea.prototype.drawLifebar = function(){
  };
  
  
  
  let SlimeKing = function(x,y){
    Enemy.call(this,1240,Types.Enemy.SlimeKing);
    this.x = x;
    this.y = y; 
    this.sizeX = 200;
    this.speed = 0;
    this.aSpeed = 15;
    this.aModus = 1;
    this.img = [slimeKing,slimeKing,slimeKing,slimeKingAttack,slimeKingShadow];
    this.jumpTime = 0;
    this.modusSwitch = false;
  };
  
  SlimeKing.prototype = Object.create(Enemy.prototype);
  SlimeKing.prototype.drawLifebar = function (){
    push();
    fill("red");
    rect(width/2-250,height/2-215,500,10);
    let t = 500 / this.maxHp;
    fill("green");
    rect(width/2-250,height/2-215,t*this.hp,10);
    pop();
  };
  
  SlimeKing.prototype.action = function (){
      this.rot = getAngelBetweenPoint(this.x,this.y,player.x,player.y);
      let bulletX = this.x+75*cos(this.rot-0);
      let bulletY = this.y+75*sin(this.rot-0);
  
      if(this.modusSwitch === true){
        this.modusSwitch = false;
        if(rndOutcome(6)){
          this.aModus = 2;
        }else{
          this.aModus = 1;
        }
      }
      if(this.aModus === 1){
        if(this.aTime <= 6){
          this.animationTimer = 6;
          this.animation = 1;
          push();
          pop();
        }
        if(this.aTime <= 0){
          if(player.x > this.x){
            if(keyIsDown(player.keyListMovement[0])){
              bullets.push(new BulletSlimeKing(bulletX,bulletY,this.rot-random(0.4),5));
            }else if(keyIsDown(player.keyListMovement[2])){
              bullets.push(new BulletSlimeKing(bulletX,bulletY,this.rot+random(0.4),5));
            }else{
              bullets.push(new BulletSlimeKing(bulletX,bulletY,this.rot,5));
            }
          }else{
            if(keyIsDown(player.keyListMovement[0])){
              bullets.push(new BulletSlimeKing(bulletX,bulletY,this.rot+random(0.4),5));
            }else if(keyIsDown(player.keyListMovement[2])){
              bullets.push(new BulletSlimeKing(bulletX,bulletY,this.rot-random(0.4),5));
            }else{
              bullets.push(new BulletSlimeKing(bulletX,bulletY,this.rot,5));
            }
          }
          this.aTime = this.aSpeed;
          this.modusSwitch = true;
        }else{
        this.aTime--;
      }
    }
    if(this.aModus === 2){
      this.modusSwitch = true;
      let pos = room.rndPositionInRoom(70);
      room.enemys.unshift(new SlimeArea(pos[0],pos[1],70));
    }
    console.log(this.modusSwitch);
  };

  
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
      }
    }
    for(let i in room.enemys){
      if(room.enemys[i].isAlive === false){
      room.enemys.splice(i,1);
        if(room.enemys.length<= 0){
          room.openDoors(true);
        }
      }
    }
  }