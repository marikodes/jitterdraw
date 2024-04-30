//base component for blob controls
//reminder for html inputs -->they will return strings by default, you may have to convert value
//ask chat gpt for functions to convert between color types (and leave the prompt in code with comements)
Vue.component("single-blob-control", {
  template: `<div>
          <input type="range" min= "1" max="300" v-model.number="b.r"/>
          <input type="color" v-model="b.color"/>
          </div>`,

  methods: {},

  mounted() {},

  data() {
    return {};
  },
  props: ["b"],
});

Vue.component("test-controls", {
  template: `<div> Controls go here 
          <button @click="createNewBlob()">+</button>
          <single-blob-control :b="blob" v-for="blob in blobs" />
          
          </div>`,

  methods: {
    createNewBlob() {
      console.log("start test mode");
      let b = new Blob(
        Math.floor(Math.random() * 720),
        Math.floor(Math.random() * 720),
        Math.floor(Math.random() * 200), this.time
      );
      console.log(b);
      this.blobs.push(b);
    },
  },

  mounted() {
    //use splice to take things out of an array
    this.blobs.splice(0, this.blobs.length);
    this.createNewBlob();
    this.createNewBlob();
    this.createNewBlob();
  },

  data() {
    return {};
  },
  props: ["blobs","time"],
});

let heldBlob = undefined;

let testMode = {
  touchStarted(ev, { p, blobs }) {
    heldBlob = findClosestBlob(p, blobs);
    console.log("touch started, you touched this blob:", heldBlob); //to do, use distance to figure out which blob is closest to the mouse
    //!!!to do: you only set the held blob if you are within the canvas bounds (width and height)
  },
  touchMoved(ev, { p, blobs }) {
    //destructuring: take what you pass in and assign it to the appropriate parameter
    // console.log("custom touchMoved stuff")
    // console.log(ev)
    // console.log(p.mouseX,p.mouseY)
    //pulled an condition from this: https://editor.p5js.org/codingtrain/sketches/lE4ypFpI
    let d = p.dist(p.mouseX, p.mouseY, heldBlob.x, heldBlob.y);
    if (d < heldBlob.r) {
      heldBlob.x = p.mouseX;
      heldBlob.y = p.mouseY;
    }
  },
  touchEnded(ev, { p, blobs }) {
    //heldBlob = findClosestBlob(p, blobs)
  },
};

function drawTest(p, blobs, time) {
  //similar to list comps in python
  //apply this function to every item in this list
  blobs.forEach((b) => {
    b.draw(p);
  });
  //p.circle(0,0,50)
  //polar coordinates refresher
  // let count = 50
  // for (let i=0; i < count; i++){
  //   //all about radius and theta(angle)
  //   let circleRad = 5
  //   let radius = 100
  //   let theta = i*2+animPCT
  //   let x = radius*Math.cos(theta) + p.width/2
  //   let y = radius*Math.sin(theta) + p.height/2
  //   p.circle(x,y,circleRad*i*0.1 + 3)
  // }
  // for (let i = 0; i < 10; i++) {
  //   let myPCT = animPCT + i*0.05
  //   // scrollLeftLoop(
  //   //   p,
  //   //   () => {
  //   //     p.circle(0, 0, 50);
  //   //   },
  //   //   myPCT,
  //   //   p.width,
  //   //   50*i +50
  //   // );
  //   let x = Math.sin(myPCT*2*Math.PI)*200 + 200
  //   let y = 50*i + 50
  //   p.circle(x,y,50)
  // }''
}

function scrollLeftLoop(p, drawFunct, animPCT, w, y) {
  let xOff = animPCT * w;
  //console.log(xOff)
  //p.circle(xOff, 100, 50);
  //animPCT goes from 0-1 and recycles indefinitely
  //time*speed, when equal to x, you loop from the starting pos
  p.push();
  p.translate(xOff, y);
  drawFunct();
  p.pop();
  p.push();
  p.translate(xOff - w, y);
  drawFunct();
  p.pop();
}

function createGlow(p, count, inner_radius, blur_radius, hue, x, y) {
  p.fill(hue, 100, 75, 1 / count);
  for (let i = 0; i < count; i++) {
    //let radius = i*10 + 10
    let radius = p.map(i, 0, count, inner_radius, inner_radius + blur_radius);
    p.circle(x, y, radius);
  }
}

function orbitBlob(p, hue, x_pos, y_pos, rad, time) {
  p.push();
  p.translate(x_pos, y_pos);
  p.fill(p.color(hue));
  p.beginShape();
  let xoff = 0;
  let yoff = 0;
  for (var a = 0; a < p.TWO_PI; a += 0.1) {
    let offset = p.map(
      p.sin(a + p.frameCount * 0.1) + p.noise(xoff, yoff),
      -1,
      1,
      -25,
      25
    );
    let r = rad + offset + time;
    let x = r * p.cos(a);
    let y = r * p.sin(a) + time;
    p.vertex(x, y);
    xoff += 0.1;
    //ellipse(x, y, 4, 4);
  }
  p.endShape();
 // p.color(hue).setAlpha(0.8);
  p.fill(p.color(hue));
  p.textSize(500);
  //p.text(text, 0, 0);
  p.pop();

  yoff += 0.01;
}

function reverseBlob(p, hue, x_pos, y_pos, rad, time, count = 10, yoff = 0) {
  p.push();
  p.translate(x_pos, y_pos);
 // p.color(hue).setAlpha(0.8);
  p.fill(p.color(hue));
  p.beginShape();
  //let xoff = 0;
  //helper function for making the x/y positions without all this text!
  //returns x/y coords as an array you can index
  function getCoord(percent) {
    //this is where to calculate the radius components
    let pulse = p.sin(time * 10);
    //remember calculus (inside parameter is the frequence, outside is the amplitude)
    //add inside to translate horizontally, add outside to translate vertically
    let texture = p.noise(percent * 50 + time * -5);
    let offset = p.map(pulse + texture * 3, -1, 1, -25, 25);

    //converting polar to cartesian
    let angle = percent * p.TWO_PI;

    let r = rad + offset; //you can remove time here if you don't want it to get bigger over time
    let x = r * p.sin(angle); //making circle coordinates
    let y = r * p.cos(angle);

    return [x, y];
  }
  for (let i = 0; i < count; i++) {
    //segmenting with variables makes code more readable
    //and you know what each part does!
    let percent = i / count;
    let coord = getCoord(percent);
    p.vertex(...coord); //***shorthand for splitting two vars within a data structure and passing then a params
    //xoff += 0.1;
    //ellipse(x, y, 4, 4);
  }
  p.endShape();
  let emojiCount = 10;
  //adding the emoji around the blob
  for (let i = 0; i < emojiCount; i++) {
    //segmenting with variables makes code more readable
    //and you know what each part does!
    p.fill(p.color(hue));
    let percent = i / emojiCount;
    let coord = getCoord(percent);
    //p.circle(...coord,10)
    //p.text(text, ...coord);
    //inside
  }

  p.textSize(500);

  p.pop();

  yoff += 0.01;
}

function flatBlob(p, color, x, y, rad, time) {
  p.push();
  p.translate(x, y);
  //p.color(color).setAlpha(0.8)
  p.fill(p.color(color));
  p.beginShape();
  let xoff = 0;
  let yoff = 0;
  for (var a = 0; a < p.TWO_PI; a += 0.1) {
    let offset = p.map(
      p.sin(a + p.frameCount * 0.1) + p.noise(xoff, yoff),
      -1,
      1,
      -25,
      25
    );
    let r = rad + offset + time;
    let x = r * p.sin(a);
    let y = r;
    p.vertex(x, y);
    xoff += 0.1;
    //ellipse(x, y, 4, 4);
  }
  p.endShape();
  p.pop();

  yoff += 0.01;
}

function findClosestBlob(p, blobs) {
  //calculates which blob is closest to the mouse
  //following the methodology of the find northern most
  let closestBlob = blobs[0];
  console.log("starting closest blob:", closestBlob);
  let winDist = 1000; //we want to minimize dist, so loop over and compare to currMin
  //if equal to min, you just continue
  //if less, set that blob
  // console.log(blobs)

  blobs.forEach((b) => {
    console.log(b);
    let d = p.dist(p.mouseX, p.mouseY, b.x, b.y) - b.r;
    console.log(d);
    if (d < winDist) {
      winDist = d;
      closestBlob = b;
      console.log("new closest blob:", closestBlob);
    }
  });

  //looping over arrays in Javascript is not the same as python, it loops over properties, not object
  // for (let b in blobs) {
  //   console.log(b)
  //   let d = p.dist(p.mouseX, p.mouseY, b.x, b.y);
  //   // console.log(d,b)
  //   if (d < 1000) {
  //     closestBlob = b;
  //     console.log("new closest blob:", closestBlob);
  //   } else {
  //     continue;
  //   }
  // }
  return closestBlob;
}
//building off yet another coding train tutorial : https://editor.p5js.org/codingtrain/sketches/lE4ypFpI
//i'm going to create a blob class to make it easier for the user to manipulate the blobs individually
//the only tricky thing will be giving multiple blobs their own controls (and connecting multiple blobs to data)

//note : classes should have a capital name
//keep things simple, don't give total control, just maybe speed and texture
class Blob {
  constructor(x, y, r = 100, type = 0, time) {
    //takes x/y coordinates and radius, last one is a value to determine what type of blob (using switches)
    this.x = x;
    this.y = y;
    this.r = r;
    this.type = Math.floor(Math.random() * 3); //this is to randomly choose w
    this.color = hslToHex(Math.floor(Math.random() * 361), Math.floor(Math.random() * 101), Math.floor(Math.random() * 101));
    this.time = time//Math.floor(Math.random()*16777215).toString(16); //
    //console.log(this.color);
    //^^plug the palettes into the blob colors!
  }

  //methods
  //displaying the blobs

  draw(p) {
    //console.log("is this working")

    //p.fill(p.color(this.color));
    //p.circle(this.x, this.y, this.r);
    switch (this.type) {
      case 1: //flat
        //console.log("flat blob");
        flatBlob(p,this.color, this.x, this.y, this.rad, this.time)
        break;

      case 2: //reverse
        //console.log("reverse blob");
        reverseBlob(p, this.color, this.x, this.y, this.r, this.time)
        break;

      case 0:
        //oscillate is the default (type=0)
        //console.log("oscillate blob");
        orbitBlob(p, this.color, this.x, this.y, this.r, this.time);
        break;
    }
  }
}
//https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex <---hsl to hex generator
