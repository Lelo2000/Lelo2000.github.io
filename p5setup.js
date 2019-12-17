function preload(){
  img = loadImage("Bilder/Feuerball.svg");
  doorClosed = loadImage("Bilder/doorClosed.svg");
  doorOpen = loadImage("Bilder/doorOpen.svg");
  enemySlime = loadImage("Bilder/enemySchleim.svg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  doorClosed.loadPixels();
  doorOpen.loadPixels();
  img.loadPixels();
  enemySlime.loadPixels();
}

window.addEventListener("resize", function() {
  resizeCanvas(windowWidth, windowHeight);
  clear();
});

new p5();
var width = windowWidth;
var height = windowHeight;
