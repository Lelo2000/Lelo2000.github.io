
let Skill = function(name,type,damage,cooldown,img){
    this.damage = damage;
    this.mana = 0;
    this.type= type;
    this.cooldown= cooldown;
    this.cooldownTimer= 0;
    this.name= name;
    this.img= img;
    this.flavorText="";
    this.key= 0;
    this.isInstant = false;
    this.startDamage = damage;
  };
  Skill.prototype.action = function(){
  };
  let Fireball = function(){
    Skill.call(this,"Feuerball",0,10,10,[fireball_skillbar]);
    this.flavorText="Ein mächtiger Feuerball der deine Gegner zerschmettert";
  };
  Fireball.prototype = Object.create(Skill.prototype);
  Fireball.prototype.action = function(){
    bulletX = player.x+35*cos(player.rot-0.89);
    bulletY = player.y+35*sin(player.rot-0.89);
    let a = getAngelBetweenPoint(bulletX,bulletY,mouseX,mouseY);
    bullets.push(new Fireballbullet(bulletX,bulletY,a,0,this.damage));
  };
  let TripleFireball = function(){
    Skill.call(this,"Dreifach Feuerball",1,10,15,[trippelFireball_skillbar]);
    this.flavorText = "Drei kleinere Feuerbälle, um mehrere Gegner gleichzeitig zu besiegen";
  };
  TripleFireball.prototype = Object.create(Skill.prototype);
  TripleFireball.prototype.action = function(){
    bulletX = player.x+35*cos(player.rot-0.89);
    bulletY = player.y+35*sin(player.rot-0.89);
    let a = getAngelBetweenPoint(bulletX,bulletY,mouseX,mouseY);
    bullets.push(new Fireballbullet(bulletX,bulletY,a+0.15,0,this.damage));
    bullets.push(new Fireballbullet(bulletX,bulletY,a-0.15,0,this.damage));
    bullets.push(new Fireballbullet(bulletX,bulletY,a,0,this.damage));
  };
  
  let MageShield = function(){
    Skill.call(this,"Magisches Schild",2,0,0,[magicShield_Skillbar]);
    this.flavorText= "Schützte dich mit einem Magischen Schild, der Angriffe abwehrt.";
    this.mana = 1;
    this.isInstant = true;
  };
  MageShield.prototype = Object.create(Skill.prototype);
  MageShield.prototype.action = function(){
    player.invincibleTime = 2;
  };