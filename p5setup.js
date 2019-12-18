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
}

window.addEventListener("resize", function() {
  resizeCanvas(windowWidth, windowHeight);
  clear();
});

new p5();
var width = windowWidth;
var height = windowHeight;
