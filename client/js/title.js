 
function Title(){
  // 0: Title Screen 1: Profile and Stats 2: Credits
  this.mode = 0;
  Title.prototype.update = function(){
    uCtx.clearRect(0, 0, windowWidth, windowHeight);

    uCtx.fillStyle = "rgb(240, 240, 240)";
    uCtx.fillRect(0, 0, windowWidth, windowHeight);
    
    switch (this.mode){
      case 0:
        this.titleScreen();
        break;
      case 1:
        this.statsScreen();
        break;
      case 2:
        this.creditsScreen();
        break;
    }

    ui.press = false;
    ui.click = false;
  }
  Title.prototype.titleScreen = function(){
    width = windowWidth * 0.4;
    height = windowHeight * 0.8;

    x = (windowWidth / 2) - (width / 2);
    y = (windowHeight / 2) - (height / 2);

    // ---------- Background
    uCtx.fillStyle = "rgb(220, 220, 220)";
    uCtx.strokeStyle = "rgb(100, 100, 100)";
    uCtx.lineWidth = 2;
    uCtx.globalAlpha = 0.85;
    uCtx.fillRect(x, y, width, height);
    uCtx.strokeRect(x, y, width, height);
    uCtx.globalAlpha = 1;

    // Title
    uCtx.font = "80px Arial";
    titleText = "Tank Battle";
    titleWidth = uCtx.measureText(titleText).width;
    titleX = Math.floor(windowWidth / 2 - titleWidth / 2);
    titleY = Math.floor(windowHeight / 3);

    uCtx.fillStyle = "rgb(70, 70, 70)";
    uCtx.fillText(titleText, titleX, titleY);

    // Play Online Button
    poText = "Play Online";
    poY = windowHeight / 2;
    poHeight = 40;
    poWidth = windowWidth / 4;
    clicked = button(0, poY, poWidth, poHeight, poText, 26, 20, true);

    if (clicked == true){
      world.join();
    }

    // Profile and Stats button
    psText = "Profile and Stats";
    psY = poY + 50;
    psHeight = 40;
    psWidth = windowWidth / 4;
    clicked = button(0, psY, psWidth, psHeight, psText, 26, 20, true);

    if (clicked == true){
      this.mode = 1;
    }

    // Credits Button
    creditsText = "Credits";
    creditsY = psY + 50;
    creditsHeight = 40;
    creditsWidth = windowWidth / 4;
    clicked = button(0, creditsY, creditsWidth, creditsHeight, creditsText, 26, 20, true);

    if (clicked == true){
      this.mode = 2;
    }
  }

  Title.prototype.statsScreen = function(){

    width = windowWidth * 0.4;
    height = windowHeight * 0.8;

    x = (windowWidth / 2) - (width / 2);
    y = (windowHeight / 2) - (height / 2);

    // ---------- Background
    uCtx.fillStyle = "rgb(220, 220, 220)";
    uCtx.strokeStyle = "rgb(100, 100, 100)";
    uCtx.lineWidth = 2;
    uCtx.globalAlpha = 0.85;
    uCtx.fillRect(x, y, width, height);
    uCtx.strokeRect(x, y, width, height);
    uCtx.globalAlpha = 1;

    closeX = x + 30;
    closeY = y + 30;
    closeWidth = 20;
    closeHeight = 20;
    closeRadius = 17;

    dist = findDistance(ui.mouseX - (closeX + (closeWidth / 2)), ui.mouseY - (closeY + (closeHeight / 2)))
    
    // If button is hovered on and clicked
    if (dist < closeRadius){
      uCtx.fillStyle = "rgb(180, 180, 180)";
      uCtx.beginPath();
      uCtx.arc(closeX + (closeWidth / 2), closeY + (closeHeight / 2), closeRadius, 0, 2 * Math.PI);
      uCtx.fill();

      if (ui.click == true){
        this.mode = 0;
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

    // Profile Header
    uCtx.font = "40px Arial";
    uCtx.fillStyle = "rgb(100, 100, 100)";
    headerText = "Profile";
    headerWidth = uCtx.measureText(headerText).width;
    headerX = (windowWidth / 2) - (headerWidth / 2);
    headerY = y + 110;

    uCtx.fillText(headerText, headerX, headerY);

    // Underline
    lineWidth = width * 0.85;
    lineHeight = 2;
    lineY = headerY + 30;
    lineX = (windowWidth / 2) - (lineWidth / 2);
    uCtx.fillStyle = "rgb(100, 100, 100)";
    uCtx.fillRect(lineX, lineY, lineWidth, lineHeight);

    // Name
    nameText = "Username: " + player.username;
    nameX = x + 80;
    nameY = lineY + 50;
    uCtx.font = "20px Arial";
    uCtx.fillText(nameText, nameX, nameY);

    // Change Username Button
    cuText = "Change";
    cuX = x + width - 180;
    cuY = nameY - 20;
    cuHeight = 40;
    cuWidth = 60;
    clicked = button(cuX, cuY, cuWidth, cuHeight, cuText, 26, 20, false);

    if (clicked == true){
      player.changeUsername();
      ui.mouseX = 0;
      ui.mouseY = 0;
    }

    // Stats Header
    uCtx.font = "40px Arial";
    uCtx.fillStyle = "rgb(100, 100, 100)";
    headerText = "Stats";
    headerWidth = uCtx.measureText(headerText).width;
    headerX = (windowWidth / 2) - (headerWidth / 2);
    headerY = y + 270;

    uCtx.fillText(headerText, headerX, headerY);

    // Underline
    lineWidth = width * 0.85;
    lineHeight = 2;
    lineY = headerY + 30;
    lineX = (windowWidth / 2) - (lineWidth / 2);
    uCtx.fillStyle = "rgb(100, 100, 100)";
    uCtx.fillRect(lineX, lineY, lineWidth, lineHeight);

    lineY -= 20;

    if (windowHeight > 800){
        uCtx.font = "20px Arial";
        offset = 60;
        spacing = 25;
    }else{
        uCtx.font = "13px Arial";
        spacing = 15;
        offset = 40;
    }

    // Wins
    text = "Wins";
    textX = x + 80;
    textY = lineY + offset;
    uCtx.fillText(text, textX, textY);

    num = player.wins;
    textX = x + width - 120;
    uCtx.fillText(num, textX, textY);

    // Losses
    text = "Losses";
    textX = x + 80;
    textY = lineY + offset + spacing * 1;
    uCtx.fillText(text, textX, textY);

    num = player.games - player.wins;
    textX = x + width - 120;
    uCtx.fillText(num, textX, textY);

    // Games Played
    text = "Games Played";
    textX = x + 80;
    textY = lineY + offset + spacing * 2;
    uCtx.fillText(text, textX, textY);

    num = player.games;
    textX = x + width - 120;
    uCtx.fillText(num, textX, textY);




    // Kills
    text = "Kills";
    textX = x + 80;
    textY = lineY + offset + spacing * 3;
    uCtx.fillText(text, textX, textY);

    num = player.kills;
    textX = x + width - 120;
    uCtx.fillText(num, textX, textY);

    // Deaths
    text = "Deaths";
    textX = x + 80;
    textY = lineY + offset + spacing * 4;
    uCtx.fillText(text, textX, textY);

    num = player.deaths;
    textX = x + width - 120;
    uCtx.fillText(num, textX, textY);

    // Kill/Death Ratio
    text = "Kill / Death Ratio";
    textX = x + 80;
    textY = lineY + offset + spacing * 5;
    uCtx.fillText(text, textX, textY);

    num = Math.round((player.kills / player.deaths) * 100) / 100;

    if (isNaN(num)){
      num = 0;
    }

    textX = x + width - 120;
    uCtx.fillText(num, textX, textY);




    // Hits
    text = "Hits";
    textX = x + 80;
    textY = lineY + offset + spacing * 6;
    uCtx.fillText(text, textX, textY);

    num = player.hits;
    textX = x + width - 120;
    uCtx.fillText(num, textX, textY);

    // Misses
    text = "Misses";
    textX = x + 80;
    textY = lineY + offset + spacing * 7;
    uCtx.fillText(text, textX, textY);

    num = player.shots - player.hits;
    textX = x + width - 120;
    uCtx.fillText(num, textX, textY);

    // Shots Fired
    text = "Shots Fired";
    textX = x + 80;
    textY = lineY + offset + spacing * 8;
    uCtx.fillText(text, textX, textY);

    num = player.shots;
    textX = x + width - 120;
    uCtx.fillText(num, textX, textY);

    // Accuracy
    text = "Accuracy";
    textX = x + 80;
    textY = lineY + offset + spacing * 9;
    uCtx.fillText(text, textX, textY);

    num = Math.round((player.hits / player.shots) * 1000) / 10;

    if (isNaN(num)){
      num =  "0%";
    }else{
      num = num + "%";
    }

    textX = x + width - 120;
    uCtx.fillText(num, textX, textY);
  }

  Title.prototype.creditsScreen = function(){
    width = windowWidth * 0.4;
    height = windowHeight * 0.8;

    x = (windowWidth / 2) - (width / 2);
    y = (windowHeight / 2) - (height / 2);

    // ---------- Background
    uCtx.fillStyle = "rgb(220, 220, 220)";
    uCtx.strokeStyle = "rgb(100, 100, 100)";
    uCtx.lineWidth = 2;
    uCtx.globalAlpha = 0.85;
    uCtx.fillRect(x, y, width, height);
    uCtx.strokeRect(x, y, width, height);
    uCtx.globalAlpha = 1;

    closeX = x + 30;
    closeY = y + 30;
    closeWidth = 20;
    closeHeight = 20;
    closeRadius = 17;

    dist = findDistance(ui.mouseX - (closeX + (closeWidth / 2)), ui.mouseY - (closeY + (closeHeight / 2)))
    
    // If button is hovered on and clicked
    if (dist < closeRadius){
      uCtx.fillStyle = "rgb(180, 180, 180)";
      uCtx.beginPath();
      uCtx.arc(closeX + (closeWidth / 2), closeY + (closeHeight / 2), closeRadius, 0, 2 * Math.PI);
      uCtx.fill();

      if (ui.click == true){
        this.mode = 0;
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

    uCtx.font = "20px Arial";
    uCtx.fillStyle = "rgb(100, 100, 100)"
    c1Text = "Maps Watermelon, Keyboard, Battle Royale";
    c1Width = uCtx.measureText(c1Text).width;
    c1X = windowWidth / 2 - c1Width / 2;
    c1Y = windowHeight * 0.35;

    uCtx.font = "20px Arial";
    uCtx.fillStyle = "rgb(100, 100, 100)"
    c2Text = "Normandy, and Riot by AJ Cozzy";
    c2Width = uCtx.measureText(c2Text).width;
    c2X = windowWidth / 2 - c2Width / 2;
    c2Y = c1Y + 25;

    // Credits
    uCtx.font = "20px Arial";
    uCtx.fillStyle = "rgb(100, 100, 100)"
    c3Text = "Art, Code, and Design";
    c3Width = uCtx.measureText(c3Text).width;
    c3X = windowWidth / 2 - c3Width / 2;
    c3Y = c2Y + 100;

    uCtx.font = "20px Arial";
    uCtx.fillStyle = "rgb(100, 100, 100)"
    c4Text = "by Thomas Breimer";
    c4Width = uCtx.measureText(c4Text).width;
    c4X = windowWidth / 2 - c4Width / 2;
    c4Y = c3Y + 25;


    uCtx.fillText(c1Text, c1X, c1Y);
    uCtx.fillText(c2Text, c2X, c2Y);

    uCtx.fillText(c3Text, c3X, c3Y);
    uCtx.fillText(c4Text, c4X, c4Y);

    // ---------- YouTube Button
    yWidth = windowWidth * 0.2;
    yHeight = 40;

    yX = (windowWidth / 2) - (yWidth / 2);
    yY = windowHeight * 0.65;

    // Text
    uCtx.font = "20px Arial";
    yText = "YouTube";

    clicked = button(yX, yY, yWidth, yHeight, yText, 26, 20);

    if (clicked == true){
      window.location.href = 'https://www.youtube.com/channel/UCNLVHLULKjDT2CPzfToXK7Q';
    }

    // ---------- Website Button
    wWidth = windowWidth * 0.2;
    wHeight = 40;

    wX = (windowWidth / 2) - (wWidth / 2);
    wY = yY + 50;

    // Text
    uCtx.font = "20px Arial";
    wText = "Website";

    clicked = button(wX, wY, wWidth, wHeight, wText, 26, 20);

    if (clicked == true){
      window.location.href = 'https://www.forestquest.net/';
    }
  }
}
