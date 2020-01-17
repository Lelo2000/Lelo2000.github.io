
let Obj = function(){
    this.x = 0;
    this.y = 0;
    this.rot = 0;
    this.shape = 0;
    this.sizeX = 0;
    this.sizeY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.offsetSizeX = 0;
    this.offsetSizeY = 0;
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
      image(this.img[this.skin],this.offsetX,this.offsetY,this.sizeX+this.offsetSizeX,this.sizeX+this.offsetSizeX);
    if(this.shape === 1)
      image(this.img[this.skin],this.offsetX,this.offsetY,this.sizeX+this.offsetSizeX,this.sizeY+this.offsetSizeY);
    
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
  };