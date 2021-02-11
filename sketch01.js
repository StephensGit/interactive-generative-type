// Text to be displayed on screen
let type = 'test';

// Font Size
let fontSize = 250;

// Variable to hold the text graphic
let textImg;

// Point size
var pointDensity = 8;

let fonts = ['data/Roboto-Black.ttf'];

function preload() {
  font = loadFont(fonts[0]);
}

// Creates an offscreen graphics object to draw the text into
function setupText() {
  createCanvas(windowWidth, windowHeight);

  textImg = createGraphics(width, height);
  textImg.pixelDensity(1);
  textImg.background(255);
  textImg.textFont(font);
  textImg.textSize(fontSize);
  textImg.text(type, 100, fontSize + 50);
  textImg.loadPixels();
}

function setup() {
  let canvas = createCanvas(760, 500);
  canvas.parent('canvasHolder');
  setupText();
}

function draw() {
  background(255);

  fill(0);
  noStroke();

  for (var x = 0; x < textImg.width; x += pointDensity) {
    for (var y = 0; y < textImg.height; y += pointDensity) {
      // Calculate the index for the pixels array from x and y
      var index = (x + y * textImg.width) * 4;
      // Get the red value from image
      var r = textImg.pixels[index];

      if (r < 128) {
        ellipse(x, y, 5, 5);
      }
    }
  }
}
