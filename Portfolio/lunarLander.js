//Objekte
var wohnblock = {
  XPos: 200,
  YPos: 100,
  XSpeed: 0,
  XSpeedMax: 0,
  YSpeed: 1,
  XAcc: 0.2,
  YAcc: 0.1,
  breite: 40,
  hoehe: 40,
  skin: 0,
  stapel: false,
  isFlying: true
};
//Variablen
var gameLost = false;
var wohnhauser = [];
var score = 0;
var stars = [];
let showHitbox = false;
var resetTimer = 40;
let pause = false;
//Functionen
function resetGame() {
  gameLost = false;
  NeuerWohnblock();
  wohnhauser = [];
  score = 0;
  resetTimer = 40;
}
//Function Calls vor dem game

resetGame();
setstars();
function draw() {
  if (pause === false) {
    if (gameLost === false) {
      backgroundDraw();
      wohnblockSteuerung();
      wohnblockCollision();
      wohnblockDraw(wohnblock);
      fill(255);
      //textSize(12);
      //text("Speed: " + wohnblock.YSpeed, 10, 10);
      push();
      noStroke();
      var g = 100 * wohnblock.YSpeed;
      fill((1 * g) / 5, (255 / g) * 60, 0);
      rect(20, 20, 10, 30);
      triangle(10, 40, 40, 40, 25, 80);
      pop();
    } else {
      resetTimer--;
      if (resetTimer < 0) {
        textSize(10);
        fill(255, 255, 255, 100);
        text("Press any button to reset", 240, 220);
      }
    }
    for (let i in wohnhauser) {
      wohnblockDraw(wohnhauser[i]);
    }
    if (showHitbox) drawHitbox();
  }
}

function wohnblockSteuerung() {
  if (wohnblock.isFlying === true) {
    wohnblock.YPos = wohnblock.YPos + wohnblock.YSpeed;
    wohnblock.XPos = wohnblock.XPos + wohnblock.XSpeed;
    wohnblock.XSpeed = wohnblock.XSpeed - wohnblock.XSpeed / 15;
    //w
    if (keyIsDown(87)) {
      wohnblock.YSpeed = wohnblock.YSpeed - wohnblock.YAcc;
    } else {
      wohnblock.YSpeed = wohnblock.YSpeed + wohnblock.YAcc;
    }
    //a
    if (keyIsDown(65)) {
      wohnblock.XSpeed = wohnblock.XSpeed - wohnblock.XAcc;
    }
    //d
    if (keyIsDown(68)) {
      wohnblock.XSpeed = wohnblock.XSpeed + wohnblock.XAcc;
    }
    if (wohnblock.YSpeed < 0) wohnblock.YSpeed = 0;
  }
}
function wohnblockCollision() {
  if (wohnblock.YPos > 510 - wohnblock.hoehe) {
    wohnblock.isFlying = false;
    wohnblock.YPos = 510 - wohnblock.hoehe;
    winGame();
  }
  for (let i in wohnhauser) {
    let hit = false;
    //Wohnblock
    if (Collision(wohnblock.XPos, wohnblock.YPos, wohnhauser[i])) {
      hit = true;
    }
    if (
      Collision(wohnblock.XPos, wohnblock.YPos + wohnblock.hoehe, wohnhauser[i])
    ) {
      hit = true;
    }
    if (
      Collision(
        wohnblock.XPos + wohnblock.breite,
        wohnblock.YPos,
        wohnhauser[i]
      )
    ) {
      hit = true;
    }
    if (
      Collision(
        wohnblock.XPos + wohnblock.breite,
        wohnblock.YPos + wohnblock.hoehe,
        wohnhauser[i]
      )
    ) {
      hit = true;
    }
    //Wohnhauser
    if (Collision(wohnhauser[i].XPos, wohnhauser[i].YPos, wohnblock)) {
      hit = true;
    }
    if (
      Collision(
        wohnhauser[i].XPos,
        wohnhauser[i].YPos + wohnhauser[i].hoehe,
        wohnblock
      )
    ) {
      hit = true;
    }
    if (
      Collision(
        wohnhauser[i].XPos + wohnhauser[i].breite,
        wohnhauser[i].YPos,
        wohnblock
      )
    ) {
      hit = true;
    }
    if (
      Collision(
        wohnhauser[i].XPos + wohnhauser[i].breite,
        wohnhauser[i].YPos + wohnhauser[i].hoehe,
        wohnblock
      )
    ) {
      hit = true;
    }
    if (hit === true) {
      if (wohnhauser[i].stapel === false) {
        gameLost = true;
      }
      if (
        wohnblock.XPos - wohnhauser[i].XPos < 6 &&
        wohnblock.XPos - wohnhauser[i].XPos > -6
      ) {
        wohnblock.XPos = wohnhauser[i].XPos;
      }
      if (
        wohnblock.XPos +
          wohnblock.breite -
          wohnhauser[i].XPos +
          wohnhauser[i].breite <
          6 &&
        wohnblock.XPos +
          wohnblock.breite -
          wohnhauser[i].XPos +
          wohnhauser[i].breite >
          -6
      ) {
        wohnblock.XPos = wohnblock.XPos - wohnblock.breite;
      }
      if (
        wohnblock.YPos - wohnhauser[i].YPos < 6 &&
        wohnblock.YPos - wohnhauser[i].YPos > -6
      ) {
        wohnblock.YPos = wohnhauser[i].YPos;
      }
      winGame();
    }
  }
}
function Collision(x, y, obj) {
  console.log("X " + x);
  console.log("Y " + y);
  console.log("Breite " + obj.breite);
  console.log("Höhe " + obj.hoehe);
  if (
    x > obj.XPos &&
    x < obj.XPos + obj.breite &&
    y > obj.YPos &&
    y < obj.YPos + obj.hoehe
  ) {
    return true;
  } else {
    return false;
  }
}
function winGame() {
  if (wohnblock.YSpeed > 3 || gameLost === true) {
    fill(255, 255, 255, 100);
    scoreCount();
    textSize(50);
    text("Your Score: " + score, 160, 136);
    console.log("Score: " + score);
    textSize(80);
    text("Game Over", 100, 200);
    gameLost = true;
  } else {
    wohnhauser.push(wohnblock);
    NeuerWohnblock();
  }
}
function drawHitbox() {
  push();
  noFill();
  stroke(0, 0, 255);
  strokeWeight(1);
  rect(wohnblock.XPos, wohnblock.YPos, wohnblock.breite, wohnblock.hoehe);
  for (let i in wohnhauser) {
    if (wohnhauser[i].stapel === true) {
      stroke(0, 255, 0);
      rect(
        wohnhauser[i].XPos,
        wohnhauser[i].YPos,
        wohnhauser[i].breite,
        wohnhauser[i].hoehe
      );
    } else {
      stroke(255, 0, 0);
      rect(
        wohnhauser[i].XPos,
        wohnhauser[i].YPos,
        wohnhauser[i].breite,
        wohnhauser[i].hoehe
      );
    }
  }
  pop();
}
function scoreCount() {
  for (let i in wohnhauser) {
    score = score + 1;
  }
}
function backgroundDraw() {
  background(0);
  fill(255);
  noStroke();
  rect(0, 500, width, height);
  drawStars();
}
function keyPressed() {
  if (gameLost === true && resetTimer < 0) {
    resetGame();
  }
  if (keyCode === 72) {
    if (showHitbox === false) {
      showHitbox = true;
    } else {
      showHitbox = false;
    }
  }
  if (keyCode === 80) {
    if (pause) {
      pause = false;
    } else {
      pause = true;
    }
  }
}
function setstars() {
  stars = [];
  let n = random(100, 300);
  for (let i = 0; i < n; i++) {
    stars.push({ x: random(0, width), y: random(0, height), s: random(1, 3) });
  }
}
function drawStars() {
  for (let i in stars) {
    push();
    fill(255);
    noStroke();
    ellipse(stars[i].x, stars[i].y, stars[i].s);
    pop();
  }
}
function NeuerWohnblock() {
  let rnd = floor(random(0, 3));
  switch (rnd) {
    case 0:
      wohnblock = {
        XPos: 200,
        YPos: 100,
        XSpeed: 0,
        XSpeedMax: 0,
        YSpeed: 1,
        XAcc: 0.2,
        YAcc: 0.3,
        breite: 150,
        hoehe: 60,
        skin: 0,
        stapel: true,
        isFlying: true
      };
      break;
    case 1:
      wohnblock = {
        XPos: 200,
        YPos: 100,
        XSpeed: 0,
        XSpeedMax: 0,
        YSpeed: 1,
        XAcc: 0.2,
        YAcc: 0.1,
        breite: 150,
        hoehe: 79,
        skin: 1,
        stapel: false,
        isFlying: true
      };
      break;
    case 2:
      wohnblock = {
        XPos: 200,
        YPos: 100,
        XSpeed: 0,
        XSpeedMax: 0,
        YSpeed: 1,
        XAcc: 0.5,
        YAcc: 0.1,
        breite: 50,
        hoehe: 109,
        skin: 2,
        stapel: true,
        isFlying: true
      };
      break;
  }
  wohnblock.XPos = random(0, width - wohnblock.breite);
  wohnblock.YPos = 0;
}
function wohnblockDraw(block) {
  switch (block.skin) {
    case 0:
      push();
      noStroke();
      fill(191, 191, 191);
      rect(block.XPos, block.YPos, block.breite, block.hoehe, 3);
      stroke(100, 100, 100);
      strokeWeight(2);
      fill(179, 217, 255);
      rect(block.XPos + 10, block.YPos + 15, 30, 30, 3);
      fill(179, 217, 255);
      rect(block.XPos + 53, block.YPos + 15, 45, 30, 3);
      fill(179, 217, 255);
      rect(block.XPos + 110, block.YPos + 15, 30, 30, 3);
      pop();
      break;
    case 1:
      push();
      //fill("255");
      //rect(block.XPos, block.YPos, block.breite, block.hoehe);
      noStroke();
      fill(191, 191, 191);
      rect(block.XPos, block.YPos + 63, block.breite, 20, 3);

      //Baum
      tree(block.XPos, block.YPos);
      tree(block.XPos + 30, block.YPos);
      tree(block.XPos + 60, block.YPos);
      tree(block.XPos + 090, block.YPos);

      stroke(0);
      fill(179, 217, 255, 100);
      arc(block.XPos + 75, block.YPos + 65, 150, 130, PI, 0);
      pop();

      break;
    case 2:
      push();
      noStroke();
      fill(191, 191, 191);
      rect(block.XPos, block.YPos, block.breite, block.hoehe, 1);
      stroke(100, 100, 100);
      strokeWeight(2);
      fill(179, 217, 255);
      rect(block.XPos + 4, block.YPos + 3, 30, 30, 5);
      rect(block.XPos + 15, block.YPos + 40, 30, 30, 5);
      rect(block.XPos + 4, block.YPos + 77, 30, 30, 5);

      pop();
      break;
    case 3:
      push();
      fill("red");
      rect(block.XPos, block.YPos, block.breite, block.hoehe);
      pop();
      break;
  }
}

function tree(x, y) {
  fill("brown");
  rect(x + 20, y + 40, 10, 24);
  fill("green");
  ellipse(x + 20, y + 40, 10);
  ellipse(x + 29, y + 40, 10);
  ellipse(x + 25, y + 44.5, 10);
  ellipse(x + 25, y + 36, 10);
  ellipse(x + 22, y + 44, 10);
  ellipse(x + 28, y + 44, 10);
}
