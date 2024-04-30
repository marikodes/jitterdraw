//useful functions for the project

//noise functions from easings.net

//https://easings.net/#easeInOutBack

function easeInOutBack(x) {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;

  return x < 0.5
    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}

//custom blob functions expanding on Daniel Shiffman's blobs
// //coding train blob tutorial - https://editor.p5js.org/codingtrain/sketches/L_ME8qKmQ
//note, this code expects to be within the p5.js js context
//creates a blob that rotates in the opposite direction
// function reverseBlob(hue, x_pos, y_pos, rad, time, emoji) {
//   p.push();
//   p.translate(x_pos, y_pos);
//   p.fill(hue, 70, 63, 0.8);
//   p.beginShape();
//   //let xoff = 0;
//   //helper function for making the x/y positions without all this text!
//   //returns x/y coords as an array you can index
//   function getCoord(percent) {
//     //this is where to calculate the radius components
//     let pulse = p.sin(time * 10);
//     //remember calculus (inside parameter is the frequence, outside is the amplitude)
//     //add inside to translate horizontally, add outside to translate vertically
//     let texture = p.noise(percent * 50 + time * -5);
//     let offset = p.map(pulse + texture * 3, -1, 1, -25, 25);

//     //converting polar to cartesian
//     let angle = percent * p.TWO_PI;

//     let r = rad + offset + time; //you can remove time here if you don't want it to get bigger over time
//     let x = r * p.sin(angle); //making circle coordinates
//     let y = r * p.cos(angle);

//     return [x, y];
//   }
//   for (let i = 0; i < count; i++) {
//     //segmenting with variables makes code more readable
//     //and you know what each part does!
//     let percent = i / count;
//     let coord = getCoord(percent);
//     p.vertex(...coord); //***shorthand for splitting two vars within a data structure and passing then a params
//     //xoff += 0.1;
//     //ellipse(x, y, 4, 4);
//   }
//   p.endShape();
//   let emojiCount = 10;
//   for (let i = 0; i < emojiCount; i++) {
//     //segmenting with variables makes code more readable
//     //and you know what each part does!
//     p.fill(hue, 70, 63, 1);
//     let percent = i / emojiCount;
//     let coord = getCoord(percent);
//     //p.circle(...coord,10)
//     p.text(emoji, ...coord);
//     //inside
//   }

//   p.textSize(500);

//   p.pop();

//   yoff += 0.01;
// }

//https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex <---hsl to hex generator
function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

//blob functions

// function orbitBlob(hue, x_pos, y_pos, rad, time, p, text) {
//   p.push();
//   p.translate(x_pos, y_pos);
//   p.fill(p.color)
//   p.beginShape();
//   let xoff = 0;
//   for (var a = 0; a < p.TWO_PI; a += 0.1) {
//     let offset = p.map(
//       p.sin(a + p.frameCount * 0.1) + p.noise(xoff, yoff),
//       -1,
//       1,
//       -25,
//       25
//     );
//     let r = rad + offset + time;
//     let x = r * p.cos(a);
//     let y = r * p.sin(a) + time;
//     p.vertex(x, y);
//     xoff += 0.1;
//     //ellipse(x, y, 4, 4);
//   }
//   p.endShape();
//   p.fill(hue, 75, 60, 1);
//   p.textSize(500);
//   p.text(this.emoji, 0, 0);
//   p.pop();

//   yoff += 0.01;
// }
//creates a blob that rotates in the opposite direction
// function reverseBlob(hue, x_pos, y_pos, rad, time, emoji) {
//   p.push();
//   p.translate(x_pos, y_pos);
//   p.fill(hue, 70, 63, 0.8);
//   p.beginShape();
//   //let xoff = 0;
//   //helper function for making the x/y positions without all this text!
//   //returns x/y coords as an array you can index
//   function getCoord(percent) {
//     //this is where to calculate the radius components
//     let pulse = p.sin(time * 10);
//     //remember calculus (inside parameter is the frequence, outside is the amplitude)
//     //add inside to translate horizontally, add outside to translate vertically
//     let texture = p.noise(percent * 50 + time * -5);
//     let offset = p.map(pulse + texture * 3, -1, 1, -25, 25);

//     //converting polar to cartesian
//     let angle = percent * p.TWO_PI;

//     let r = rad + offset; //you can remove time here if you don't want it to get bigger over time
//     let x = r * p.sin(angle); //making circle coordinates
//     let y = r * p.cos(angle);

//     return [x, y];
//   }
//   for (let i = 0; i < count; i++) {
//     //segmenting with variables makes code more readable
//     //and you know what each part does!
//     let percent = i / count;
//     let coord = getCoord(percent);
//     p.vertex(...coord); //***shorthand for splitting two vars within a data structure and passing then a params
//     //xoff += 0.1;
//     //ellipse(x, y, 4, 4);
//   }
//   p.endShape();
//   let emojiCount = 10;
//   //adding the emoji around the blob
//   for (let i = 0; i < emojiCount; i++) {
//     //segmenting with variables makes code more readable
//     //and you know what each part does!
//     p.fill(hue, 70, 63, 1);
//     let percent = i / emojiCount;
//     let coord = getCoord(percent);
//     //p.circle(...coord,10)
//     p.text(emoji, ...coord);
//     //inside
//   }

//   p.textSize(500);

//   p.pop();

//   yoff += 0.01;
// }
//blob that moves left and right on the x axis - end work 7/6
// function oscillateHorizBlob(hue, x, y, rad, time) {
//   p.push();
//   p.translate(x, y);
//   p.fill(hue, 70, 63, 0.8);
//   p.beginShape();
//   let xoff = 0;
//   for (var a = 0; a < p.TWO_PI; a += 0.1) {
//     let offset = p.map(
//       p.sin(a + p.frameCount * 0.1) + p.noise(xoff, yoff),
//       -1,
//       1,
//       -25,
//       25
//     );
//     let r = rad + offset + time;
//     let x = a;
//     let y = p.sin(a);
//     p.vertex(x, y);
//     xoff += 0.1;
//     //ellipse(x, y, 4, 4);
//   }
//   p.endShape();
//   p.pop();

//   yoff += 0.01;
// }
// //flat blob (mess with y to get coolleaf-like effects)
// function flatBlob(hue, x, y, rad, time) {
//   p.push();
//   p.translate(x, y);
//   p.fill(hue, 70, 63, 0.8);
//   p.beginShape();
//   let xoff = 0;
//   for (var a = 0; a < p.TWO_PI; a += 0.1) {
//     let offset = p.map(
//       p.sin(a + p.frameCount * 0.1) + p.noise(xoff, yoff),
//       -1,
//       1,
//       -25,
//       25
//     );
//     let r = rad + offset + time;
//     let x = r * p.sin(a);
//     let y = r;
//     p.vertex(x, y);
//     xoff += 0.1;
//     //ellipse(x, y, 4, 4);
//   }
//   p.endShape();
//   p.pop();

//   yoff += 0.01;
// }
