
let Item = function(x,y,name,type){
    Obj.call(this);
    this.x = x;
    this.y = y;
    this.type = type;
    this.instantConsumable = false;
    this.isUsed = false;
    this.name = name;
    this.isRune = false;
  };
  Item.prototype = Object.create(Obj.prototype);
  Item.prototype.hover = function (){
    if(colPointObj(mouseX,mouseY,this)){
      this.drawHover();
    }
  };
  Item.prototype.drawHover= function (){
    push();
    fill(200);
    noStroke();
    rect(mouseX,mouseY-11,this.name.length*6.5,14);
    fill(0);
    text(this.name,mouseX,mouseY);
    console.log(this.name.length);
    pop();
  };
  let HealingPotion = function (x,y){
    Item.call(this,x,y,"Heiltrank",Types.Item.HealingPotion);
    this.sizeX = 30;
    this.img = [healingPotion];
  };
  HealingPotion.prototype = Object.create(Item.prototype);
  HealingPotion.prototype.action = function(){
    player.hp = player.hp + 15;
    this.isUsed = true;
  };
  
  let HealingBlob = function(x,y){
    Item.call(this,x,y,"Healing Blob",Types.Item.HealingBlob);
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
    Item.call(this,x,y,"Schriftrolle Dreifach Feuerball",Types.Item.ScrollTrippleFireball);
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