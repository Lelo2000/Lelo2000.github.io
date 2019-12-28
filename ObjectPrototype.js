function Obj(location){
    this.x = location.x;
    this.y = location.y;
    this.size = 10;
}

Object.prototype.draw = function(){
    rect(this.x,this.y,this.size,this.size);
};

function Player (){
    Obj.call(this,{x: 100,y:100});
    this.speed = 1;
    this.size = 100;
}

Player.prototype = Object.create(Object.prototype);
Player.prototype.constructor = Player;
Player.prototype.move = function (){
    this.x = this.x +this.speed;
};

let pl = new Player();
console.log(pl);
function draw(){
    clear();
    pl.draw();
    pl.move();
}
