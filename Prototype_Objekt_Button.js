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
  };
  let ButtonStart = function(x,y){
    Button.call(this,x,y);
    this.sizeX = 100;
    this.sizeY = 50;
    this.img = [startButton];
  };
  ButtonStart.prototype = Object.create(Button.prototype);
  ButtonStart.prototype.action = function (){
    switchMenue(Types.Menue.InGame);
  };
  
  let ButtonPause = function(x,y){
    Button.call(this,x,y);
    this.sizeX = 90;
    this.sizeY = 30;
    this.img = [buttonPause];
  };
  ButtonPause.prototype = Object.create(Button.prototype);
  ButtonPause.prototype.action = function (){
    switchMenue(Types.Menue.Pause);
  };
  let ButtonWeiter = function(x,y){
    Button.call(this,x,y);
    this.sizeX = 100;
    this.sizeY = 50;
    this.img= [buttonWeiter];
  };
  ButtonWeiter.prototype = Object.create(Button.prototype);
  ButtonWeiter.prototype.action = function(){
    switchMenue(Types.Menue.InGame);
  };
  
  let ButtonOptionen = function(x,y){
    Button.call(this,x,y);
    this.sizeX = 100;
    this.sizeY = 50;
    this.img = [buttonOptionen];
  };
  ButtonOptionen.prototype = Object.create(Button.prototype);
  ButtonOptionen.prototype.action = function(){
    switchMenue(Types.Menue.Optionen);
  };
  
  let ButtonOptionenTastenauswahl = function(x,y){
    Button.call(this,x,y);
    this.sizeX = 20;
    this.sizeY = 20;
    this.img=[buttonTasten];
    this.isPressed = false;
    this.keyWhenPressed = 0;
  };
  ButtonOptionenTastenauswahl.prototype = Object.create(Button.prototype);
  ButtonOptionenTastenauswahl.prototype.action = function(){
    this.isPressed = true;
    this.keyWhenPressed = keyCode;
  };
  
  let ButtonRuneSwitch = function (x,y,id){
    Button.call(this,x,y);
    this.sizeX = 40;
    this.sizeY = 40;
    this.img = [buttonTasten];
    this.id = id;
  };
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
  };
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
  };
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
  };
  
  let ButtonBack = function(x,y){
    Button.call(this,x,y);
    this.sizeX = 90;
    this.sizeY = 30;
    this.img = [buttonBack];
  };
  ButtonBack.prototype = Object.create(Button.prototype);
  ButtonBack.prototype.action = function(){
    switchMenue(menueHistory[menueHistory.length-2]);
  };