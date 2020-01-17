
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
  