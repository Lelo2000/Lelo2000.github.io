
function Obj(){
    this.x = 5;
}
Obj.prototype.ausgabe = function(){
    console.log(this.x);
};
Obj.prototype.plusEins = function(){
    this.x = addition(this.x,1);
 };
function TeilObject(){
    Obj.call(this);
    this.y = 4;
}
TeilObject.prototype = Object.create(Obj.prototype);
TeilObject.prototype.constructor = TeilObject;
function addition(x,y){
    return x+y;
}
obj1 = new Obj();

teilObj = new TeilObject();
function draw(){
    teilObj.ausgabe();
    //teilObj.plusEins();
}








