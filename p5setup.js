function preload(){
  fireball = loadImage("Bilder/Feuerball.svg");
  fireball_skillbar = loadImage("Bilder/Feuerball_Skillbar.svg");
  trippelFireball_skillbar = loadImage("Bilder/DreifachFeuerball_Skillbar.svg");
  firehell_skillbar = loadImage("Bilder/Feuerhoelle_Skillbar.svg");
  doorClosed = loadImage("Bilder/doorClosed.svg");
  doorOpen = loadImage("Bilder/doorOpen.svg");
  enemySlime = loadImage("Bilder/enemySchleim.svg");
  enemySlimeDead = loadImage("Bilder/enemySchleimTod.svg");
  enemySlimeSpawning = loadImage("Bilder/enemySchleimSpawning.svg");
  healingPotion = loadImage("Bilder/healingPotion.svg");
  manaItem = loadImage("Bilder/Manapoint.svg");
  lifeItem = loadImage("Bilder/Lifepoint.svg");
  startButton = loadImage("Bilder/startButton.svg");
  startButton = loadImage("Bilder/startButton.svg");
  buttonPause = loadImage("Bilder/buttonPause.svg");
  buttonWeiter = loadImage("Bilder/buttonWeiter.svg");  
  buttonOptionen = loadImage("Bilder/buttonOptionen.svg");
  buttonTasten = loadImage("Bilder/buttonTasten.svg");
  buttonBack = loadImage("Bilder/buttonzurueck.svg");
  mageFire = loadImage("Bilder/mageFire.svg");
  mageFire_shoot1 = loadImage("Bilder/mageFire_shoot1.svg");
  mageFireShield = loadImage("Bilder/mageFireShield.svg");
  enemyFireMage = loadImage("Bilder/enemyFireMage.svg");
  enemyFireMageAttack = loadImage("Bilder/enemyFireMageAttack.svg");
  enemyFireMageDead = loadImage("Bilder/enemyFireMageDead.svg");
  enemyFireball = loadImage("Bilder/enemyFireball.svg");
  roomRectangle = loadImage("Bilder/roomRectangle.svg");
  roomCircle = loadImage("Bilder/roomCircle.svg");
  scrollTrippleFireball = loadImage("Bilder/ScrollTrippleFireball.svg");
  magicShield_Skillbar = loadImage("Bilder/MagicShield_Skillbar.svg");
  runeMaxMana = loadImage("Bilder/runeMana.svg");
  runenCenter = loadImage("Bilder/runenMitte.svg");
  runeMaxHp = loadImage("Bilder/runeMaxHp.svg");

  soundFormats('mp3', 'ogg');
  //http://soundbible.com/tags-fireball.html
  soundFireball = loadSound('Musik/Flame Arrow-SoundBible.com-618067908.mp3');
  soundTrippelFireball = loadSound("Musik/Catapult-SoundBible.com-829548288.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  doorClosed.loadPixels();
  doorOpen.loadPixels();
  fireball.loadPixels();
  enemySlime.loadPixels();
  enemySlimeDead.loadPixels();
  enemySlimeSpawning.loadPixels();
  healingPotion.loadPixels();
  fireball_skillbar.loadPixels();
  trippelFireball_skillbar.loadPixels();
  firehell_skillbar.loadPixels();
  manaItem.loadPixels();
  lifeItem.loadPixels();
  startButton.loadPixels();
  buttonOptionen.loadPixels();
  buttonTasten.loadPixels();
  buttonBack.loadPixels();
  mageFire.loadPixels();
  mageFire_shoot1.loadPixels();
  mageFireShield.loadPixels();
  enemyFireMage.loadPixels();
  enemyFireMageAttack.loadPixels();
  enemyFireMageDead.loadPixels();
  enemyFireball.loadPixels();
  roomRectangle.loadPixels();
  scrollTrippleFireball.loadPixels();
  runeMaxMana.loadPixels();
  //runenCenter.loadPixels();
  runeMaxHp.loadPixels();
}

window.addEventListener("resize", function() {
  resizeCanvas(windowWidth, windowHeight);
  clear();
});

new p5();
var width = windowWidth;
var height = windowHeight;
