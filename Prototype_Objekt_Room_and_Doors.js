
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
          this.itemCount = rndInt(1);
          this.itemType = [0];
          this.enemyCount = 0;
          this.enemyType = [];
          this.startPoint= [width/2, height/2];
          this.img = [roomRectangle];
        break;
      case -2:
          this.sizeX= 580;
          this.sizeY= 400;
          this.enemyCount = 1;
          this.enemyType= [Types.Enemy.SlimeKing];
          this.startPoint= [width/2, height/2];
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
          this.enemyType= [Types.Enemy.Slime];
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
        let en = {};
        if(enType >= 0){
          en = getEnemyFromType(enType,0,0);
          let pos = this.rndPositionInRoom(en.sizeX); 
          en.x = pos[0];
          en.y = pos[1];
        }else{
          en = getEnemyFromType(enType,width/2,height/2);
        }
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
  };
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
  };
  
  