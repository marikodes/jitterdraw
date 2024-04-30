//adding custom controls for each func
//<magic-controls v-if="mode=='magic'" :masterTime="masterTime" :glowCol="glowColor" :brothCol="brothColor" :ing1="ingredient1" :ing2="ingredient2" :ing3="ingredient3" :bubbleCol="bubbleColor" />
//magic controls are showing up, but not connected to data properly.
//so i'm just gonna use v-if to control when things show up
Vue.component("magic-controls", {
  template: `<div>
              <details>
              <summary>Motion</summary>
              Time
              <input type="range" v-model.number="masterTime" min=".1" max="1" step="0.01">{{masterTime}}</input>
              </details>
        
              <details>
              <summary>Emoji</summary>
              <emoji-text-input v-model="ing1"/>
              <emoji-text-input v-model="ing2"/>
              <emoji-text-input v-model="ing3"/>
              </details>

              <details>
              <summary>Color</summary>
              <input type="color" v-model="brothCol" >{{brothCol}}</input>
              <input type="color" v-model="bubbleCol">{{bubbleCol}}</input>
              <input type="color" v-model="glowCol">{{glowCol}}</input>
              </details>
                </div>`,

  methods: {},

  mounted() {},

  data() {
    return {};
  },
  props: [
    "masterTime",
    "glowCol",
    "brothCol",
    "ing1",
    "ing2",
    "ing3",
    "bubbleCol",
  ],
});

function drawMagic(
  p,
  t,
  offset,
  DIM,
  glowCol,
  brothCol,
  ing1,
  ing2,
  ing3,
  bubbleCol
) {
  //console.log("draw magic called");

  p.background(272, 100, 25);

  drawCouldron(p, DIM);

  createGlowEllipse(p, 30, 5, 10, 94, glowCol, DIM[0] / 2, 475);

  drawBrothBase(p, brothCol, DIM);
    
  console.log(ing1)

  drawIngredients(p, DIM, ing1, ing2, ing3, t);

  drawBubbles(p, DIM, bubbleCol);
}

// function ingredientPulse(p, offset, t) {
//   let size = 10 * p.sin(5 * t) + offset;
//   return size;
// }

function createGlowEllipse(
  p,
  count,
  inner_radius,
  blur_radius,
  height,
  hue,
  x,
  y
) {
  let col = p.color(hue);
  col.setAlpha(1 / count);
  p.fill(col);

  for (let i = 0; i < count; i++) {
    //let radius = i*10 + 10
    let width = p.map(i, 0, count, inner_radius, inner_radius + blur_radius);
    p.ellipse(x, y, width * 25, height);
  }
}

function drawCouldron(p, DIM) {
  //console.log("drawing couldron");
  p.fill(272, 0, 8);
  p.circle(DIM[0] / 2, 700, 350);
  p.ellipse(DIM[0] / 2, 475, 350, 125);
}

function drawBrothBase(p, brothColor, DIM) {
  p.fill(p.color(brothColor));
  p.ellipse(DIM[0] / 2, 475, 275, 90);
}

function drawIngredients(p, DIM, ingredient1, ingredient2, ingredient3, t) {
  function ingredientPulse(p, offset, t) {
    let size = 10 * p.sin(5 * t) + offset;
    return size;
  }
 
  p.textAlign(p.CENTER);
  p.textSize(50);

  //note, you can't pass in a function as a value with text, so I have to store the function value and pass it in :(
  let ing1y = ingredientPulse(p, 455, t);
  p.text(ingredient1, DIM[0] / 2 - 175, ing1y);

 
  let ing2y = ingredientPulse(p, 465, t);
  p.text(ingredient2, DIM[0] / 2, ing2y);

  let ing3y = ingredientPulse(p, 455, t);
  p.text(ingredient3, DIM[0] / 2 + 175, ing3y);

  //p.text("testing🥺👉👈", DIM[0] / 2, 475);
}

function drawBubbles(p, DIM, bubbleColor) {
  let bubCol = p.color(bubbleColor);
  bubCol.setAlpha(0.88);
  p.fill(bubCol);

  let bubbleCount = 20;
  let maxRadius = 25;
  let xUpLimit = DIM[0] / 2 + 250;
  let xBottomLimit = DIM[0] / 2 - 250;
  let yUpLimit = 500;
  let yBottomLimit = 455;
  for (let i = 0; i < bubbleCount; i++) {
    let x = p.random(xBottomLimit, xUpLimit);
    let y = p.random(yBottomLimit, yUpLimit);
    let r = p.random(1, maxRadius);
    p.circle(x, y, r);
  }
}
//ill come back to this later, working on bug fixes
function ghost(p, DIM, x, y, r) {
  p.circle();
}
function drawPet(p, pet, DIM) {
  let count = 5;
  function ingredientPulse(p, offset, t) {
    let size = 10 * p.sin(5 * t) + offset;
    return size;
  }
  if (pet == "bat") {
    for (let i = 0; i < count; i++) {}
  }
}
