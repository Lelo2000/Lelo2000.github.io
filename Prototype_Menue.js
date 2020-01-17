let Menue = function (type){
    this.buttons = [];
    this.type = type;
  };
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
  };
  

  let MenueStart = function(){
    Menue.call(this,Types.Menue.Start);
    this.buttons.push(new ButtonStart(width/2,height/2));
    this.buttons.push(new ButtonOptionen(width/2,height/2+60));
  };
  MenueStart.prototype = Object.create(Menue.prototype);
  
  let MenueInGame = function(){
    Menue.call(this,Types.Menue.InGame);
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
  };
  MenueInGame.prototype = Object.create(Menue.prototype);
  
  let MenuePause = function(){
    Menue.call(this,Types.Menue.Pause);
    this.buttons.push(new ButtonWeiter(width/2+60,height/2));
    this.buttons.push(new ButtonOptionen(width/2-60,height/2));
  };
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
  };
  
  let MenueOptionen = function(){
    Menue.call(this,Types.Menue.Optionen);
    this.state =0;
    this.activeButton = -1;
  };
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
        push();
        rectMode(CENTER);
        noFill();
        rect(width/2+153,height/2+50*i-194,20,20);
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
  };  