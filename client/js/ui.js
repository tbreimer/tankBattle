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
  uCtx.strokeStyle = "rgb(100, 100, 100)";
  uCtx.lineWidth = 2;

  uCtx.fillStyle = "rgb(235, 235, 235)";
  uCtx.fillRect(x, y, width, height);
  
  clicked = false;

  if (ui.mouseX > x && ui.mouseX < x + width){
    if (ui.mouseY > y && ui.mouseY < y + height){

      uCtx.fillStyle = "rgb(200, 200, 200)";
      uCtx.fillRect(x, y, width, height);

      if (ui.click == true){
        clicked = true;
        
      }
    }
  }

  uCtx.strokeRect(x, y, width, height);

  // Draw text
  uCtx.fillStyle = "rgb(100, 100, 100)";
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
  this.chatUp = true;

  // Pushes debug screen over
  this.chatWidth;

  this.mouseWx;
  this.mouseWy;

  UI.prototype.update = function(){
    uCtx.clearRect(0, 0, windowWidth, windowHeight);

    // Get the world coordinates of the mouse
    this.mouseWx = Math.floor(world.canvasTopX + this.mouseX);
    this.mouseWy = Math.floor(world.canvasTopY + this.mouseY);

    this.chat();

    switch (world.mode){
      case 0:
        this.lobby();
        break;
      case 1:
        this.pauseButton();
        this.dataBar();

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

    x = this.chatWidth + 10;

    uCtx.fillText("FPS " + fps, x, y);
    uCtx.fillText("X " + Math.floor(player.x) + ", sX " + player.screenX + ", mX " + this.mouseWx + ", mSx " + this.mouseX, x, y + (space * 1));
    uCtx.fillText("Y " + Math.floor(player.y) + ", sY " + player.screenY + ", mY" + this.mouseWy + ", mSy " + this.mouseY, x, y + (space * 2));
    uCtx.fillText(player.username, x, y + (space * 3));
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

  UI.prototype.dataBar = function(){

    height = 40;
    width = Math.floor(windowWidth / 5);

    x = windowWidth / 2 - width / 2;
    y = 20;

    // Gray bar
    uCtx.fillStyle = "rgb(230, 230, 230)";
    uCtx.fillRect(x, y, width, height);

    uCtx.strokeStyle = "rgb(135, 135, 135)";
    uCtx.strokeRect(x, y, width, height);

    if (player.health > 1){

      // Health indicator
      multiplier = (width - 20) / player.maxHealth;
      uCtx.fillStyle = "red";
      uCtx.fillRect(x + 10, y + 9, player.health * multiplier, height - 25);
      uCtx.strokeStyle = "rgb(165, 0, 0)";
      uCtx.strokeRect(x + 10, y + 9, player.health * multiplier, height - 25);

      // Reload indicator
      multiplier = (width - 20) / player.reloadTime;
      uCtx.fillStyle = "DeepSkyBlue";
      uCtx.fillRect(x + 10, y + 26, Math.abs(player.reload - player.reloadTime) * multiplier, height - 34);
      uCtx.strokeStyle = "rgb(0, 141, 188)";
      uCtx.strokeRect(x + 10, y + 26, Math.abs(player.reload - player.reloadTime) * multiplier, height - 34);
    }
    
  }

  UI.prototype.pauseScreen = function(){
    // Background
    bgWidth = windowWidth / 2;
    bgHeight = windowHeight * 0.8;

    bgX = (windowWidth / 2) - (bgWidth / 2);
    bgY = (windowHeight / 2) - (bgHeight / 2);

    uCtx.strokeStyle = "rgb(135, 135, 135)";
    uCtx.lineWidth = 2;

    uCtx.fillStyle = "rgb(230, 230, 230)";
    uCtx.fillRect(bgX, bgY, bgWidth, bgHeight);
    uCtx.strokeRect(bgX, bgY, bgWidth, bgHeight);

    // Menu Label
    uCtx.font = "80px Arial";
    menuText = "Menu";
    menuWidth = uCtx.measureText(menuText).width;
    menuX = Math.floor(windowWidth / 2 - menuWidth / 2);
    menuY = bgY + 150;

    uCtx.fillStyle = "rgb(100, 100, 100)";
    uCtx.fillText(menuText, menuX, menuY);

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

    uCtx.strokeStyle = "rgb(135, 135, 135)";
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

    height = 40;
    width = Math.floor(windowWidth / 5);

    x = windowWidth / 2 - width / 2;
    y = 20;

    // Gray bar
    uCtx.fillStyle = "rgb(230, 230, 230)";
    uCtx.fillRect(x, y, width, height);

    uCtx.strokeStyle = "rgb(135, 135, 135)";
    uCtx.strokeRect(x, y, width, height);

    // Text Coords
    uCtx.font = "20px Arial";
    spectateText = "Spectating";
    spectateWidth = uCtx.measureText(spectateText).width;
    spectateX = Math.floor(windowWidth / 2 - spectateWidth / 2);
    spectateY = 47;

    // Draw Coords
    uCtx.fillStyle = "rgb(80, 80, 80)";
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

    // Lobby Label
    uCtx.font = "70px Arial";
    playersText = "Lobby";
    playersWidth = uCtx.measureText(playersText).width;
    playersX = Math.floor(windowWidth / 2 - playersWidth / 2);
    playersY = 90;

    uCtx.fillStyle = "rgb(50, 50, 50)";
    uCtx.fillText(playersText, playersX, playersY);

    x = 0;
    for (var id in world.players) {
      var user = world.players[id];

      // Outline
      playerWidth = windowWidth * .5;
      playerHeight = 40;
      playerY = x * 45 + 200;
      playerX = 70;

      uCtx.strokeStyle = "black";
      uCtx.lineWidth = 2;
      uCtx.strokeRect(playerX, playerY, playerWidth, playerHeight);

      // Username and stats
      userX = playerX + 15;
      userY = playerY + 27;
      userText = user.username;

      stats = " | Wins " + user.gameWins + " Kills " + user.gameKills;

      kdRatio = Math.round((user.gameKills / user.gameDeaths) * 10) / 10;
      accuracy = Math.round((user.gameHits / user.gameShots) * 100);

      if (isNaN(kdRatio) == false){
        stats = stats + " K/D " + kdRatio;
      }

      if (isNaN(accuracy) == false){
        stats = stats + " Accuracy " + accuracy + "%";
      }

      uCtx.fillStyle = "black";
      uCtx.font = "20px Arial";

      if (uCtx.measureText(userText + stats).width < playerWidth - 20){
        uCtx.fillText(userText + stats, userX, userY);
      }else{
        uCtx.fillText(userText, userX, userY);
      }
      

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

    // Players Label
    uCtx.font = "40px Arial";
    playersText = "Players";
    playersWidth = uCtx.measureText(playersText).width;
    playersX = Math.floor(windowWidth / 4 - playersWidth / 2) + 70;
    playersY = 175;

    uCtx.fillStyle = "rgb(50, 50, 50)";
    uCtx.fillText(playersText, playersX, playersY);

    // Maps
    maps = world.maps.index;
    for (var x = 0; x < maps.length; x ++){
      // Outline
      mapWidth = windowWidth - (70 + windowWidth / 2 + 90);
      mapHeight = 40;
      mapY = x * 45 + 200;
      mapX = (70 + windowWidth / 2 + 60);


      // Highlight Selected One
      if (x == world.mapIndex){
        uCtx.fillStyle = "rgb(230, 230, 230)";
        uCtx.fillRect(mapX, mapY, mapWidth, mapHeight);
      }

      // Highlight one moused over if player is host and also if clicked change map
      if (player.host == true){
        if (ui.mouseX > mapX && ui.mouseX < mapX + mapWidth)
          if (ui.mouseY > mapY && ui.mouseY < mapY + mapHeight){
            uCtx.fillStyle = "rgb(230, 230, 230)";
            uCtx.fillRect(mapX, mapY, mapWidth, mapHeight);

            if (ui.click == true){
              world.changeMap(x);
            }
          }
      }

      // Outline
      uCtx.strokeStyle = "black";
      uCtx.lineWidth = 2;
      uCtx.strokeRect(mapX, mapY, mapWidth, mapHeight);

      // Name
      nameX = mapX + 15;
      nameY = mapY + 27;
      nameText = maps[x].name;

      uCtx.fillStyle = "black";
      uCtx.font = "20px Arial";
      uCtx.fillText(nameText, nameX, nameY);

      // Size
      sizeText = maps[x].size;
      sizeWidth = uCtx.measureText(sizeText).width;
      sizeX = mapX + mapWidth - sizeWidth - 13;
      sizeY = mapY + 27;
      

      uCtx.fillStyle = "black";
      uCtx.font = "20px Arial";
      uCtx.fillText(sizeText, sizeX, sizeY);

    
    }

    // Map Label
    uCtx.font = "40px Arial";
    mapText = "Map";
    mapWidth = uCtx.measureText(mapText).width;
    // If you ever end up needing to edit any of this code, you're better off just rewriting the whole thing.
    mapX = (70 + windowWidth / 2 + 60) + ((windowWidth - (70 + windowWidth / 2 + 90))/ 2) - (mapWidth / 2);
    mapY = 175;

    uCtx.fillStyle = "rgb(50, 50, 50)";
    uCtx.fillText(mapText, mapX, mapY);

    // Health Label
    uCtx.font = "40px Arial";
    healthText = "Health";
    healthWidth = uCtx.measureText(healthText).width;
    healthX = (70 + windowWidth / 2 + 60) + ((windowWidth - (70 + windowWidth / 2 + 90))/ 2) - (healthWidth / 2);
    healthY = 175 + (world.maps.index.length * 45) + 75;

    uCtx.fillStyle = "rgb(50, 50, 50)";
    uCtx.fillText(healthText, healthX, healthY);

    healthSelectWidth = windowWidth - (70 + windowWidth / 2 + 90);
    interval = healthSelectWidth / 5;
    selectWidth = interval - 5;
    selectHeight = 40;

    for (x = 0; x < 5; x++){
      selectX = (70 + windowWidth / 2 + 60) + (x * interval);
      selectY = healthY + 25;

      // Select if that value is current starting health
      if ((10 + (x * 10)) == player.maxHealth){
        uCtx.fillStyle = "rgb(230, 230, 230)";
        uCtx.fillRect(selectX, selectY, selectWidth, selectHeight);
      }

      // Select if host
      if (player.host == true){
        if (ui.mouseX > selectX && ui.mouseX < selectX + selectWidth)
          if (ui.mouseY > selectY && ui.mouseY < selectY + selectHeight){
            uCtx.fillStyle = "rgb(230, 230, 230)";
            uCtx.fillRect(selectX, selectY, selectWidth, selectHeight);

            if (ui.click == true){
              world.changeStartingHealth(10 + (x * 10));
            }
          }
      }

      // Health Boxes
      uCtx.strokeStyle = 2;
      uCtx.strokeRect(selectX, selectY, selectWidth, selectHeight);

      uCtx.fillStyle = "black";
      uCtx.font = "20px Arial";

      // Health Text
      numberText = 10 + (x * 10);
      numberWidth = uCtx.measureText(numberText).width;
      numberX = selectX + (selectWidth / 2) - (numberWidth / 2);
      numberY = selectY + 27;

      uCtx.fillText(numberText, numberX, numberY);
    }

    if (player.host == true && Object.keys(world.players).length > 1){
      // Start game button
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

  UI.prototype.chat = function(){
    

    if (this.chatUp == false){
      chatText = "Chat";
      chatX = 20;
      chatY = windowHeight - 60;
      chatHeight = 40;
      chatWidth = 60;
      clicked = button(chatX, chatY, chatWidth, chatHeight, chatText, 26, 20, false);

      this.chatWidth = chatWidth + 20;

      if (clicked == true){
        this.chatUp = true;
      }
    }else{
      // Box
      boxWidth = 400;
      boxHeight = 175;

      this.chatWidth = boxWidth;

      boxX = 0;
      boxY = windowHeight - boxHeight;

      uCtx.fillStyle = "rgb(230, 230, 230)";
      uCtx.fillRect(boxX + 1, boxY - 1 , boxWidth, boxHeight);

      uCtx.strokeStyle = "rgb(135, 135, 135)";
      uCtx.lineWidth = 2;
      uCtx.strokeRect(boxX + 1, boxY - 1, boxWidth, boxHeight);

      // Button
      chatText = "Chat";
      chatX = 5;
      chatY = windowHeight - 45;
      chatHeight = 40;
      chatWidth = 60;
      clicked = button(chatX, chatY, chatWidth, chatHeight, chatText, 26, 20, false);

      this.chatWidth = boxWidth;

      if (clicked == true){
        // Unhighlights button
        this.mouseX = 0;
        this.mouseY = 0;

        player.newMessage();
      }

      // Close Button
      closeX = boxWidth - 35;
      closeY = windowHeight - 35;
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
          this.chatUp = false;
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

      uCtx.font = "15px Arial";
      uCtx.fillStyle = "rgb(60, 60, 60)";
      textX = 8;
      textY = windowHeight - 55;

      it = 0;

      for (x = world.chat.length - 1; x >= 0; x -= 1){

        msgY = textY - (it * 16);

        if (msgY < boxY + 20){
          break;
        }

        uCtx.fillText(world.chat[x], textX, msgY);

        it += 1;
      }
    }
  }
}