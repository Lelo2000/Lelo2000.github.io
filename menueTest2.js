let menueNow = 1;
let buttons = [];
  let button = {
    x:0,
    y:0,
    sx: 0,
    sy: 0,
    id: 0,
    img: []
  };
  switchMenue(menueNow);
  function draw(){
    clear();
    drawButtons();
  }
  function onClicked(){
    for(let i in buttons){
      if(colPointBox(mouseX,mouseY,buttons[i].x,buttons[i].y,buttons[i].sx,buttons[i].sy)){
        buttonClicked(buttons[i].id);
      }
    }
  }
  function switchMenue(id){
    buttons = [];
    switch(id){
      case 1:
        setButton(50,100,0);
        setButton(100,200,1);
      break;  
      case 2:
        setButton(100,100,0);
        setButton(200,100,1);
      break;    
    }
  }

  function drawButtons(i){
    push();
    for(let i in buttons){
      switch(buttons[i].id){
       case 0:
        fill("blue");
        rect(buttons[i].x,buttons[i].y,buttons[i].sx,buttons[i].sy);
        break;
       case 1:
        fill("red");
        rect(buttons[i].x,buttons[i].y,buttons[i].sx,buttons[i].sy);
        break;
      }
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
    buttons.push(button);
  }
  function buttonClicked(id){
    switch(id){
      case 0:
      switchMenue(1);
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
  function mousePressed(){
    onClicked();
  }