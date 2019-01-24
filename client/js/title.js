
function Title(){
  // 0: Title Screen
  this.mode = 0;
  Title.prototype.update = function(){
    uCtx.clearRect(0, 0, windowWidth, windowHeight);
    
    switch (this.mode){
      case 0:
        this.titleScreen();
        break;
    }

    ui.press = false;
    ui.click = false;
  }
  Title.prototype.titleScreen = function(){

    // Title
    uCtx.font = "90px Arial";
    titleText = "Tank Battle";
    titleWidth = uCtx.measureText(titleText).width;
    titleX = Math.floor(windowWidth / 2 - titleWidth / 2);
    titleY = Math.floor(windowHeight / 4);

    uCtx.fillStyle = "rgb(50, 50, 50)";
    uCtx.fillText(titleText, titleX, titleY);

    // Play Online Button
    poText = "Play Online";
    poY = windowHeight / 2;
    poHeight = 40;
    poWidth = windowWidth / 4;
    clicked = button(0, poY, poWidth, poHeight, poText, 26, 20, true);

    if (clicked == true){
      socket.emit('new player', player);
      mode = 1;
    }
  }
}
