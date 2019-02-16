function button(x, y, width, height, text, textOffset, font, centered){
  
  // Text vars
  uCtx.font = font + "px Arial";
  textWidth = uCtx.measureText(text).width;

  // If text width is more than the entire width, change that
  if (textWidth > width){
    width = textWidth + 10;
  }

  if (centered == true){
    x = windowWidth / 2 - width / 2;
  }

  textX = x + (width / 2) - (textWidth / 2);
  textY = y + textOffset;

  // Outline
  uCtx.strokeStyle = "rgb(50, 50, 50)";
  uCtx.lineWidth = 2;

  uCtx.fillStyle = "rgb(230, 230, 230)";
  uCtx.fillRect(x, y, width, height);
  uCtx.strokeRect(x, y, width, height);

  clicked = false;

  if (ui.mouseX > x && ui.mouseX < x + width){
    if (ui.mouseY > y && ui.mouseY < y + height){

      uCtx.fillStyle = "rgb(170, 170, 170)";
      uCtx.fillRect(x, y, width, height);

      if (ui.click == true){
        clicked = true;
        
      }
    }
  }

  // Draw text
  uCtx.fillStyle = "rgb(50, 50, 50)";
  uCtx.fillText(text, textX, textY);

  if (clicked == true){
    return true;
  }else{
    return false;
  }
}

function star(cx, cy, spikes, outerRadius, innerRadius, ctx){
  var rot = Math.PI / 2 * 3;
  var x = cx;
  var y = cy;
  var step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius)

  for(i = 0; i < spikes; i++){
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y)
    rot += step

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y)
    rot += step
  }

  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'rgb(175, 162, 47)';
  ctx.stroke();
  ctx.fillStyle = 'rgb(247, 229, 69)';
  ctx.fill();
}

function UI(){
  this.mouseX = 0;
  this.mouseY = 0;
  this.mousePressed = false;
  this.press = false;
  this.click = false;

  this.diedScreenUp = false;
  this.pauseScreenUp = false;

  this.mouseWx;
  this.mouseWy;

  UI.prototype.update = function(){
    uCtx.clearRect(0, 0, windowWidth, windowHeight);

    // Get the world coordinates of the mouse
    this.mouseWx = Math.floor(world.canvasTopX + this.mouseX);
    this.mouseWy = Math.floor(world.canvasTopY + this.mouseY);

    switch (world.mode){
      case 0:
        this.lobby();
        break;
      case 1:
        this.pauseButton();

        if (player.type == 'spectator' && this.diedScreenUp == false){
          this.spectating();
        }

        if (this.pauseScreenUp == true){
          this.pauseScreen();
        }

        if (this.diedScreenUp == true){
          this.diedScreen();
        }

        if (devMode == true){
          this.debugScreen();
        }

        break;
      case 2:
        this.pauseButton();
        

        if (player.type == 'spectator'){
          this.spectating();
        }

        if (this.pauseScreenUp == true){
          this.pauseScreen();
        }

        if (this.diedScreenUp == true){
          this.diedScreen();
        }

        this.winScreen();
    }

    this.press = false;
    this.click = false;
  }

  UI.prototype.debugScreen = function(){
    uCtx.fillStyle = "black";
    uCtx.font = 16 + "px Arial";

    // Difference in y value between elements
    space = 20;

    y = windowHeight - 70;

    x = 10;

    uCtx.fillText("FPS " + fps, x, y);
    uCtx.fillText("X " + Math.floor(player.x) + ", sX " + player.screenX + ", mX " + this.mouseWx + ", mSx " + this.mouseX, x, y + (space * 1));
    uCtx.fillText("Y " + Math.floor(player.y) + ", sY " + player.screenY + ", mY" + this.mouseWy + ", mSy " + this.mouseY, x, y + (space * 2));
  }

  UI.prototype.pauseButton = function(){
    menuText = "Menu";
    menuX = 20;
    menuY = 20;
    menuHeight = 40;
    menuWidth = 60;
    clicked = button(menuX, menuY, menuWidth, menuHeight, menuText, 26, 20, false);

    if (clicked == true){
      if (this.pauseScreenUp == true){
        this.pauseScreenUp = false;
      }else{
        this.pauseScreenUp = true;
      }
      
    }
  }

  UI.prototype.pauseScreen = function(){
    // Background
    bgWidth = windowWidth / 2;
    bgHeight = windowHeight * 0.8;

    bgX = (windowWidth / 2) - (bgWidth / 2);
    bgY = (windowHeight / 2) - (bgHeight / 2);

    uCtx.strokeStyle = "rgb(50, 50, 50)";
    uCtx.lineWidth = 2;

    uCtx.fillStyle = "rgb(230, 230, 230)";
    uCtx.fillRect(bgX, bgY, bgWidth, bgHeight);
    uCtx.strokeRect(bgX, bgY, bgWidth, bgHeight);

    // ----------- Close Button
    closeX = bgX + 30;
    closeY = bgY + 30;
    closeWidth = 20;
    closeHeight = 20;
    closeRadius = 17;

    dist = findDistance(ui.mouseX - (closeX + (closeWidth / 2)), ui.mouseY - (closeY + (closeHeight / 2)))
    
    // If button is hovered on and clicked
    if (dist < closeRadius){
      uCtx.fillStyle = "rgb(170, 170, 170)";
      uCtx.beginPath();
      uCtx.arc(closeX + (closeWidth / 2), closeY + (closeHeight / 2), closeRadius, 0, 2 * Math.PI);
      uCtx.fill();

      if (ui.click == true){
        this.pauseScreenUp = false;
      }
    }

    uCtx.beginPath();
    uCtx.moveTo(closeX, closeY);
    uCtx.lineTo(closeX + closeWidth, closeY + closeHeight);
    uCtx.stroke();

    uCtx.beginPath();
    uCtx.moveTo(closeX + closeWidth, closeY);
    uCtx.lineTo(closeX, closeY + closeHeight);
    uCtx.stroke();

    quitText = "Quit";
    quitHeight = 40;
    quitWidth = 60;
    quitX = (windowWidth / 2) - (quitWidth / 2);
    quitY = bgY + bgHeight - 80;
    clicked = button(quitX, quitY, quitWidth, quitHeight, quitText, 26, 20, false);
    
    if (clicked == true){
      pCtx.clearRect(0, 0, windowWidth, windowHeight);

      mode = 0;

      socket.emit('leave');

      this.pauseScreenUp = false;
    }
    
  }

  UI.prototype.winScreen = function(){
    // Background
    bgWidth = windowWidth / 2;
    bgHeight = windowHeight * 0.8;

    bgX = (windowWidth / 2) - (bgWidth / 2);
    bgY = (windowHeight / 2) - (bgHeight / 2);

    uCtx.strokeStyle = "rgb(50, 50, 50)";
    uCtx.lineWidth = 2;

    uCtx.fillStyle = "rgb(230, 230, 230)";
    uCtx.fillRect(bgX, bgY, bgWidth, bgHeight);
    uCtx.strokeRect(bgX, bgY, bgWidth, bgHeight);

    // Player Won!
    if (player.dead == false){
      winText = "You Won!"
    }else{
      winText = world.winner + " Won!"
    }

    uCtx.font = "40px Arial";
    winWidth = uCtx.measureText(winText).width;
    winX = Math.floor(windowWidth / 2 - winWidth / 2);
    winY = windowHeight * 0.5;

    uCtx.fillStyle = "rgb(50, 50, 50)";
    uCtx.fillText(winText, winX, winY);
  }

  UI.prototype.diedScreen = function(){
    // Background
    bgWidth = windowWidth / 2;
    bgHeight = windowHeight * 0.8;

    bgX = (windowWidth / 2) - (bgWidth / 2);
    bgY = (windowHeight / 2) - (bgHeight / 2);

    uCtx.strokeStyle = "rgb(50, 50, 50)";
    uCtx.lineWidth = 2;

    uCtx.fillStyle = "rgb(230, 230, 230)";
    uCtx.fillRect(bgX, bgY, bgWidth, bgHeight);
    uCtx.strokeRect(bgX, bgY, bgWidth, bgHeight);

    // Quit Button
    quitText = "Quit";
    quitHeight = 40;
    quitWidth = 120;
    quitX = (windowWidth / 2) - (quitWidth / 2);
    quitY = bgY + bgHeight - 80;
    clicked = button(quitX, quitY, quitWidth, quitHeight, quitText, 26, 20, false);
    
    if (clicked == true){
      pCtx.clearRect(0, 0, windowWidth, windowHeight);

      mode = 0;

      socket.emit('leave');

      this.diedScreenUp = false;
    }

    // Spectate Button
    spectateText = "Spectate";
    spectateHeight = 40;
    spectateWidth = 120;
    spectateX = (windowWidth / 2) - (quitWidth / 2);
    spectateY = bgY + bgHeight - 130;
    clicked = button(spectateX, spectateY, spectateWidth, spectateHeight, spectateText, 26, 20, false);
    
    if (clicked == true){
      this.diedScreenUp = false;
    }

    // You Died!
    uCtx.font = "60px Arial";
    ydText = "You Died!";
    ydWidth = uCtx.measureText(ydText).width;
    ydX = Math.floor(windowWidth / 2 - ydWidth / 2);
    ydY = windowHeight * 0.5;

    uCtx.fillStyle = "rgb(50, 50, 50)";
    uCtx.fillText(ydText, ydX, ydY);
  }

  UI.prototype.spectating = function(){



    // Text Coords
    uCtx.font = "30px Arial";
    spectateText = "Spectating";
    spectateWidth = uCtx.measureText(spectateText).width;
    spectateX = Math.floor(windowWidth / 2 - spectateWidth / 2);
    spectateY = 35;

    // Box
    uCtx.fillStyle = "black";
    uCtx.fillRect(spectateX, 44, spectateWidth, 2);

    // Draw Coords
    uCtx.fillStyle = "rgb(50, 50, 50)";
    uCtx.fillText(spectateText, spectateX, spectateY);


  }

  UI.prototype.lobby = function(){
    // Back Button
    backText = "Back";
    backX = 50;
    backY = 50;
    backHeight = 40;
    backWidth = 100;
    clicked = button(backX, backY, backWidth, backHeight, backText, 26, 20, false);

    if (clicked == true){
      mode = 0;
      socket.emit('leave');
    }

    // Players Label
    uCtx.font = "70px Arial";
    playersText = "Players";
    playersWidth = uCtx.measureText(playersText).width;
    playersX = Math.floor(windowWidth / 2 - playersWidth / 2);
    playersY = 90;

    uCtx.fillStyle = "rgb(50, 50, 50)";
    uCtx.fillText(playersText, playersX, playersY);

    x = 0;
    for (var id in world.players) {
      var user = world.players[id];

      // Outline
      playerWidth = windowWidth * .75;
      playerHeight = 40;
      playerY = x * 45 + 200;
      playerX = (windowWidth / 2) - (playerWidth / 2);

      uCtx.strokeStyle = "black";
      uCtx.lineWidth = 2;
      uCtx.strokeRect(playerX, playerY, playerWidth, playerHeight);

      // Username
      userX = playerX + 15;
      userY = playerY + 27;
      userText = user.username;

      uCtx.fillStyle = "black";
      uCtx.font = "20px Arial";
      uCtx.fillText(userText, userX, userY);

      if (user.host == true){
        star(playerX - 27, playerY + 20, 5, 15, 7, uCtx);
      }

      if (player.host == true){
        // Kick Button
        closeX = playerX + playerWidth + 15;
        closeY = playerY + 10;
        closeWidth = 20;
        closeHeight = 20;
        closeRadius = 17;

        dist = findDistance(ui.mouseX - (closeX + (closeWidth / 2)), ui.mouseY - (closeY + (closeHeight / 2)))
        
        // If button is hovered on and clicked
        if (dist < closeRadius){
          uCtx.fillStyle = "rgb(255, 168, 168)";
          uCtx.beginPath();
          uCtx.arc(closeX + (closeWidth / 2), closeY + (closeHeight / 2), closeRadius, 0, 2 * Math.PI);
          uCtx.fill();

          if (ui.click == true){
            socket.emit('kick', id);
          }
        }

        uCtx.lineWidth = 3;
        uCtx.strokeStyle = "red";

        uCtx.beginPath();
        uCtx.moveTo(closeX, closeY);
        uCtx.lineTo(closeX + closeWidth, closeY + closeHeight);
        uCtx.stroke();

        uCtx.beginPath();
        uCtx.moveTo(closeX + closeWidth, closeY);
        uCtx.lineTo(closeX, closeY + closeHeight);
        uCtx.stroke();
      }
      
      x ++;
    }

    if (player.host == true && Object.keys(world.players).length > 1){
      // Start game button
      // Back Button
      startText = "Start Game";
      startX = windowWidth - 170;
      startY = windowHeight - 90;
      startHeight = 40;
      startWidth = 100;
      clicked = button(startX, startY, startWidth, startHeight, startText, 26, 20, false);

      if (clicked == true){
        socket.emit('start game');
      }
    }
  }
}