let Rune = function(x,y,name,type){
    Item.call(this,x,y,name,type);
    this.sizeX = 17;
    this.isRune = true;
    this.damage = 0;
    this.maxMana = 0;
    this.manaRegen = 0;
    this.maxHp = 0;
    this.lifeRegen = 0;
    this.cooldownReduction = 0;
  };
  Rune.prototype = Object.create(Item.prototype);
  Rune.prototype.action = function(){
    player.runeBonus.damage += this.damage;
    player.runeBonus.maxMana += this.maxMana;
    player.runeBonus.manaRegen += this.manaRegen;
    player.runeBonus.liveRegen += this.lifeRegen;
    player.runeBonus.cooldownReduction += this.cooldownReduction;
    player.runeBonus.maxHp += this.maxHp;
  };
  



  let RuneMaxMana = function (x,y){
    Rune.call(this,x,y,"Manarune",Types.Item.RuneMaxMana);
    this.maxMana = 40;
    this.img = [runeMaxMana];
  };
  RuneMaxMana.prototype = Object.create(Rune.prototype);
  


  
  let RuneMaxHp = function(x,y){
    Rune.call(this,x,y,"Lebensrune",Types.Item.RuneMaxHP);
    this.maxHp = 20;
    this.img = [runeMaxHp];
  };
  RuneMaxHp.prototype = Object.create(Rune.prototype);
  