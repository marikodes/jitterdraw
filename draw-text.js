

function drawText(p, t, style, header, text1, text2, scrollDir, strokeSize) {
  //this function is drawing the alternating scrolling text
  //need to add two phrases & font to style

  //welcome to the world of switches (case statements)
  //switches are like if statements on steroids
  //

  //console.log(scrollDir);

  const speed = 200;

  let drawStuff = () => {
    drawAlternatingText(p, text1, text2, style.fontName, style, strokeSize);
    drawHeader(
      p,
      header,
      style.palette.headColor,
      style.palette.strokeColor,
      style.fontName
    );
    //p.circle(0, 0, 100);

    //console.log(text1,text2)
  };
  //set the phrase color and draw the phrase

  // console.log(style.fontName)
  // console.log(style)
  p.fill(style.palette.phraseColor);

  //console.log("scrollDir", typeof scrollDir);
  switch (scrollDir) {
    case 0:
      //console.log("scrollUp");
      scrollUp(p, drawStuff, speed, t);
      break; //important, otherwise it will run multiple cases

    case 1:
      //console.log("scrollDown");
      scrollDown(p, drawStuff, speed, t);
      break;

    case 2:
      //console.log("scrollLeft");
      scrollLeft(p, drawStuff, speed, t);
      break;
    
    case 3:
      //console.log("scrollRight");
      scrollRight(p, drawStuff, speed, t);
      break;
    
    case 4:
      //console.log("scrollBounceHoriz");
      scrollBounceHoriz(p, drawStuff, speed, t);
      break;
      
    default:
      scrollBounceVert(p, drawStuff, speed, t);
  }
  //p, drawFunct, speed, time
  //scrollUp(p, drawStuff, speed, t)

  //now determine scroll direction and draw the phrase
  // if (this.scrollDir == 0) {
  //   p.fill(p.color(this.phraseColor));
  //   //tip for using data with functions
  //   //Use an unnamed function
  //   scrollUp(() => {
  //     bgText(this.phrase1, this.phrase2, this.font[0]);
  //   }, 200);
  // } else if (this.scrollDir == 1) {
  //   p.fill(p.color(this.phraseColor));
  //   scrollDown(() => {
  //     bgText(this.phrase1, this.phrase2, this.font[0]);
  //   }, 200);
  // } else if (this.scrollDir == 2) {
  //   p.fill(p.color(this.phraseColor));
  //   scrollLeft(() => {
  //     bgText(this.phrase1, this.phrase2, this.font[0]);
  //   }, 200);
  // } else if (this.scrollDir == 3) {
  //   p.fill(p.color(this.phraseColor));
  //   scrollRight(() => {
  //     bgText(this.phrase1, this.phrase2, this.font[0]);
  //   }, 200);
  // } else if (this.scrollDir == 4) {
  //   p.fill(p.color(this.phraseColor));
  //   scrollBounceVert(() => {
  //     bgText(this.phrase1, this.phrase2, this.font[0]);
  //   }, 200);
  // } else {
  //   p.fill(p.color(this.phraseColor));
  //   scrollBounceHoriz(() => {
  //     bgText(this.phrase1, this.phrase2, this.font[0]);
  //   }, 200);
  // }
}

//scrolling direction functions (just pass in p5 to use anywhere)
function scrollUp(p, drawFunct, speed, time) {
  let yOff = time * speed;
  yOff = yOff % DIM[1];
  p.push();
  p.translate(0, yOff);
  drawFunct();
  p.pop();
  p.push();
  p.translate(0, yOff - DIM[1]);
  drawFunct();
  p.pop();
}

function scrollDown(p, drawFunct, speed, time) {
  let yOff = time * speed;
  yOff = yOff % DIM[1];
  p.push();
  p.translate(0, -yOff);
  drawFunct();
  p.pop();
  p.push();
  p.translate(0, -yOff + DIM[1]);
  drawFunct();
  p.pop();
}
function scrollLeft(p, drawFunct, speed, time) {
  let xOff = time * speed;
  //time*speed, when equal to x, you loop from the starting pos
  xOff = xOff % DIM[0];
  p.push();
  p.translate(xOff, -30);
  drawFunct();
  p.pop();
  p.push();
  p.translate(xOff - DIM[0], -30);
  drawFunct();
  p.pop();
}
function scrollRight(p, drawFunct, speed, time) {
  let xOff = time * speed;
  xOff = xOff % DIM[0];
  p.push();
  p.translate(-xOff, -30);
  drawFunct();
  p.pop();
  p.push();
  p.translate(-xOff + DIM[0], -30);
  drawFunct();
  p.pop();
}

function scrollBounceVert(p, drawFunct, speed, time) {
  let yOff = time * speed;
  yOff = yOff % DIM[1];
  p.push();
  p.translate(0, yOff - 75);
  drawFunct();
  p.pop();
  p.push();
  p.translate(0, -yOff + DIM[1] - 75);
  drawFunct();
  p.pop();
}

function scrollBounceHoriz(p, drawFunct, speed, time) {
  let xOff = time * speed;
  xOff = xOff % DIM[0];
  p.push();
  p.translate(xOff - 75, -30);
  drawFunct();
  p.pop();
  p.push();
  p.translate(-xOff + DIM[0] - 75, -30);
  drawFunct();
  p.pop();
}

///draws the scrolling text, alternating between two phrases
function drawAlternatingText(p, text1, text2, fontType, style, strokeSize) {
  p.fill(style.palette.phraseColor);
  p.stroke(style.palette.strokeColor);
  p.strokeWeight(strokeSize);
  p.textSize(36);
  p.textAlign(p.LEFT);
  p.textStyle(p.NORMAL);
  p.textFont(fontType);
  for (let i = 0; i < 12; i++) {
    let spacing = 75;
    let x = 10;
    let y = 40 * i + spacing;
    if (i % 2 == 0) {
      p.text(text1, x, y);
    } else {
      p.text(text2, x, y);
    }
  }
}

//creates the pulsing text effect using sin funcs

function drawHeader(p, header, headerCol, strokeCol, font, time) {
  function textPulse(p, maxSize, time) {
    let size = 10 * p.sin(5 * time) + maxSize;
    return size;
  }
  //draws the header which grows and shrings using the textPulse funct
  p.fill(p.color(headerCol));
  p.stroke(p.color(strokeCol));
  p.textSize(() => {
    textPulse(p, 75, time);
  });
  p.textAlign(p.CENTER);
  p.textStyle(p.ITALIC);
  p.textFont(font);
  //let startX = DIM[0]/2
  p.text(header, DIM[0] / 2, DIM[1] / 2);
  //drawText(p, t, style, text1, text2)
}
