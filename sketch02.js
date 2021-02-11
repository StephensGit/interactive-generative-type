// Text to be displayed on screen
let type = 'test';
let textInput;

// Font Size
let fontSize = 250;

// Point size
var pointDensity = 10;

// Shape Size
let shapeWidth = 20;

let shapeOpacity = 200;

// Variable to hold the text graphic
let textImg;

// Two arrays to store the random position of the points when page loads and where they finish
let startPos = [];
let endPos = [];

// Variables to hold the x and y positions on the canvas
let xPos;
let yPos;

// Array to store the colour gradients
let currentGradient = [];
let gradient1;
let gradient2;
let gradient3;
let gradient4;
let gradient5;
let gradient6;
let gradient7;

// Create an array for the fonts
let fonts = ['data/Roboto-Black.ttf'];

let lerpAmount = 0;
let easing = 0.00001;

function preload() {
  font = loadFont('data/Roboto-Black.ttf');

  gradient2 = loadImage('data/col2.jpg');
}

function setup() {
  let canvas = createCanvas(760, 500);
  canvas.parent('canvasHolder');

  // Text Input
  textInput = createInput(type, 'text');
  textInput.addClass('form-control');
  textInput.parent('textController');
  textInput.changed(update);

  // Loads the pixels data for this image
  gradient2.loadPixels();
  currentGradient = gradient2.pixels;

  setUpText();
  startPoints();
}

function startPoints() {
  for (let y = 0; y < height; y += pointDensity) {
    for (let x = 0; x < width; x += pointDensity) {
      let index = (x + y * textImg.width) * 4;

      startPos[index] = {
        // x: x,
        // y: y,
        x: Math.floor(random(0, width)),
        y: Math.floor(random(0, height)),
      };
      endPos[index] = { x: x, y: y };
    }
  }
}

function draw() {
  background(255);
  fill(50);

  // Loop through the array of pixels
  for (let y = 0; y < height; y += pointDensity) {
    for (let x = 0; x < width; x += pointDensity) {
      // Calculate the index for the pixels array from x and y
      let index = (x + y * textImg.width) * 4;
      // Get the red value from image
      let tr = textImg.pixels[index];
      // Assign pixel value into fill colour
      let r = currentGradient[index];
      let g = currentGradient[index + 1];
      let b = currentGradient[index + 2];
      let colour = color(r, g, b, shapeOpacity);

      var dx = 1 - lerpAmount;
      lerpAmount += dx * easing;
      //Calculate the starting x and y positions
      xPos = lerp(startPos[index].x, endPos[index].x, lerpAmount);
      yPos = lerp(startPos[index].y, endPos[index].y, lerpAmount);

      if (tr < 128) {
        fill(colour);
        stroke(255);
        ellipse(xPos, yPos, shapeWidth, shapeWidth);
      }
    }
  }
}

// Creates an offscreen graphics object to draw the text into
function setUpText() {
  // textImg = createGraphics(760, 500);
  textImg = createGraphics(width, height);
  textImg.pixelDensity(1);
  textImg.background(255);
  textImg.textFont(font);
  textImg.textSize(fontSize);
  textImg.textAlign(CENTER, CENTER);
  textImg.text(type, width / 2, height / 4 + fontSize / 4);
  textImg.loadPixels();
}

function update() {
  lerpAmount = 0;

  type = textInput.value();
  setUpText();
  startPoints();
}
