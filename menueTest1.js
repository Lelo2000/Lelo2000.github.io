let menue = {
  type: 0,
  buttons: []
};
let menues = [];
let menueNow = 0;
let button = {
  x:0,
  y:0,
  sx: 0,
  sy: 0,
  id: 0,
  img: []
};
setMenues();
switchMenue(0);
function draw(){
  clear();
  drawMenue(menue.type);
}

function drawMenue(type){
  for(let i in menue.buttons){
    drawButton(i);
  }
  text("Hallo",100,100);
}
function switchMenue(i){
  menue = menues[i];
}
function setMenues(){
  menues.push({type: 0,
    buttons: [setButton(50,50,0),
              setButton(50,250,1) ]
  });
  menues.push({type: 1,
    buttons: [setButton(150,50,0),
              setButton(50,50,1)]
  });
  menues.push({type: 2,
    buttons: [setButton(150,50,0),
              setButton(50,50,1),
              setButton(250,50,1)]
  });
}
function onMenueClicked(){
  for(let i in menue.buttons){
    if(colPointBox(mouseX,mouseY,menue.buttons[i].x,menue.buttons[i].y,menue.buttons[i].sx,menue.buttons[i].sy)){
      buttonClicked(menue.buttons[i].id);
    }
  }
}
function mousePressed(){
  if(menue.type >= 0){
    onMenueClicked();
  }
}
function drawButton(i){
  push();
  switch(menue.buttons[i].id){
    case 0:
      fill("blue");
      rect(menue.buttons[i].x,menue.buttons[i].y,menue.buttons[i].sx,menue.buttons[i].sy);
      break;
    case 1:
      fill("red");
      rect(menue.buttons[i].x,menue.buttons[i].y,menue.buttons[i].sx,menue.buttons[i].sy);
      break;
  }
  pop();
}
function setButton(x,y,id){
  button = {
    x:x,
    y:y,
    sx: 0,
    sy: 0,
    id: id,
    img: []
  };
  switch(id){
    case 0:
      button.sx = 100;
      button.sy  = 100;
      button.img = [];
      break;
    case 1:
      button.sx = 150;
      button.sy  = 200;
      button.img = [];
      break;
  }
  return button;
}
function buttonClicked(id){
  switch(id){
    case 0:
    switchMenue(0);
    break;
    case 1:
    switchMenue(2);
    break;
  }
}
function colPointBox(x,y,bx,by,bsx,bsy){
  if(x > bx && x < bx + bsx && y >by && y<by + bsy){
    return true;
  }
  return false;
}