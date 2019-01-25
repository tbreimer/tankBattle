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

  UI.prototype.update = function(){
    uCtx.clearRect(0, 0, windowWidth, windowHeight);

    switch (world.mode){
      case 0:
        this.lobby();
        break;
      case 1:
        this.quitButton();
    }

    this.press = false;
    this.click = false;
  }

  UI.prototype.quitButton = function(){
    quitText = "Quit";
    quitX = 20;
    quitY = 20;
    quitHeight = 40;
    quitWidth = 60;
    clicked = button(quitX, quitY, quitWidth, quitHeight, quitText, 26, 20, false);

    if (clicked == true){
      pCtx.clearRect(0, 0, windowWidth, windowHeight);
      mode = 0;
      socket.emit('leave');
    }

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

    if (player.host == true){
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