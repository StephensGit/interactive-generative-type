// Text to be displayed on screen
let type = 'hello';
// The input by the user, will be updated
let textInput;

// Font Variables
let fontSize = 250;
let fontSizeOptions;
let fontStyleOptions;
let fontStyle;

// Point/Density
let density = 10;
let densitySlider;

// Shape Variables
let shapeWidth = 10;
let shapeSlider;

// Opacity
let shapeOpacity = 100;
let opacitySlider;

// RADIO BUTTON FOR SHAPE
let radioShape;
let shape = 1;

// RADIO BUTTON FOR FILL
let radioFill;
let fillInitially = 1;

// RADIO BUTTON FOR COLOURS
let radioColour;
let colourInitially = 1;

// CHECKBOX FOR MOVEMENT
let shakeCheckBox;
let shake = false;
let moveCheckBox;
let move = false;

// Initiale variable to store distance formula
let moveCalc;

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

// Stores the font
let firstLoadFont = 'data/Roboto-Black.ttf';

let lerpAmount = 0;
let easing = 0.00001;

//Pre Loads all images & fonts
function preload() {
  font = loadFont(firstLoadFont);
  gradient1 = loadImage('data/col1.jpg');
  gradient2 = loadImage('data/col2.jpg');
  gradient3 = loadImage('data/col3.jpg');
  gradient4 = loadImage('data/col4.png');
  gradient5 = loadImage('data/col5.jpg');
  gradient6 = loadImage('data/col6.jpg');
}

function setup() {
  let canvas = createCanvas(1000, 700);
  canvas.parent('canvasHolder');
  fontStyle = BOLD;
  moveCalc = dist(0, 0, width * 2, height * 2);

  // Text Input
  textInput = createInput(type, 'text');
  textInput.addClass('form-control');
  textInput.parent('textController');
  textInput.changed(update);

  // Shape Size Input
  shapeSlider = createSlider(10, 30, 10);
  shapeSlider.parent('shapeSizeController');
  shapeSlider.input(update);

  // Density Input
  densitySlider = createSlider(10, 20, 10);
  densitySlider.parent('densityController');
  densitySlider.input(update);

  // Opacity Input
  opacitySlider = createSlider(10, 255, 150);
  opacitySlider.parent('opacityController');
  opacitySlider.input(update);

  // Dropdown menu for the font size
  fontSizeOptions = createSelect();
  fontSizeOptions.parent('fontSizeOptions');
  fontSizeOptions.option(250);
  fontSizeOptions.option(300);
  fontSizeOptions.option(400);
  fontSizeOptions.option(500);
  fontSizeOptions.changed(update);

  // Dropdown menu for font styles
  fontStyleOptions = createSelect();
  fontStyleOptions.parent('fontStyleOptions');
  fontStyleOptions.option(NORMAL);
  fontStyleOptions.option(ITALIC);
  fontStyleOptions.option(BOLD);
  fontStyleOptions.changed(update);

  // Shape Options
  radioShape = createRadio();
  radioShape.option('Ellipse', 1);
  radioShape.option('Rect', 2);
  radioShape._getInputChildrenArray()[0].checked = true;
  radioShape.parent('shapeController');
  radioShape.changed(update);

  // Fill Options
  radioFill = createRadio();
  radioFill.option('Fill', 1);
  radioFill.option('Stroke', 2);
  radioFill.option('Both', 3);
  radioFill._getInputChildrenArray()[0].checked = true;
  radioFill.parent('fillController');
  radioFill.changed(update);

  // Colour Options
  radioColour = createRadio();
  radioColour.option('Green', 1);
  radioColour.option('Red', 2);
  radioColour.option('Blue', 3);
  radioColour.option('Black', 4);
  radioColour._getInputChildrenArray()[0].checked = true;
  radioColour.parent('colourController');
  radioColour.changed(update);

  // Movement Options SHAKE
  shakeCheckBox = createCheckbox('Shake', shake);
  shakeCheckBox.parent('shakeController');
  shakeCheckBox.changed(update);

  // Movement Options CHAOS
  moveCheckBox = createCheckbox('Chaos', move);
  moveCheckBox.parent('moveController');
  moveCheckBox.changed(update);

  // Loads the pixels data for this image
  gradient1.loadPixels();
  gradient2.loadPixels();
  gradient3.loadPixels();
  gradient4.loadPixels();
  gradient5.loadPixels();
  gradient6.loadPixels();
  currentGradient = gradient6.pixels;

  setUpText();
}

function draw() {
  background(255);

  // Loop through the array of pixels
  for (let y = 0; y < height; y += density) {
    for (let x = 0; x < width; x += density) {
      //Calculates the distance between the mouse and pixels x,y
      let size = dist(mouseX, mouseY, x, y);
      size = (size / moveCalc) * 80;

      // The color values of the image are stored as a long string of values
      // to get the colour value of a pixel an index must be calculated from x&y
      // The factor 4 is neccessary cause 1 pixel consists of 4 values(rgbTrans)
      // Calculate the index for the pixels array from x and y of the
      let index = (x + y * textImg.width) * 4;
      startPos[index] = {
        // x: x,
        // y: y,
        x: Math.floor(random(0, width)),
        y: Math.floor(random(0, height)),
      };
      endPos[index] = { x: x, y: y };

      // Get the red value from image, used below to in a condition
      // to check only if the red value r is below a certain limit
      // in which case it is a dark pixel
      let tr = textImg.pixels[index];

      // Assign pixel value into fill colour
      let r = currentGradient[index];
      let g = currentGradient[index + 1];
      let b = currentGradient[index + 2];
      // shapeOpacity is controlled by slider
      let colour = color(r, g, b, shapeOpacity);

      var dx = 1 - lerpAmount;
      lerpAmount += dx * easing;
      // Calculate the starting x and y positions
      // last value in lerp is between 0.0 & 1.0, this is used to create a nice easing motion
      // rather than two points essentially teleporting
      xPos = lerp(startPos[index].x, endPos[index].x, lerpAmount);
      yPos = lerp(startPos[index].y, endPos[index].y, lerpAmount);

      // Check to see if the shake checkbox is filled
      // Using thr random function to craete movement
      if (shake) {
        xPos = random(xPos - 6, xPos + 6);
        yPos = random(yPos - 6, yPos + 6);
      }

      if (move) {
        shapeWidth = size;
      }
      // Conditions ot check the colour from radio buttons
      if (colourInitially == 1) {
        currentGradient = gradient1.pixels;
      } else if (colourInitially == 2) {
        currentGradient = gradient2.pixels;
      } else if (colourInitially == 3) {
        currentGradient = gradient5.pixels;
      } else if (colourInitially == 4) {
        currentGradient = gradient6.pixels;
      }

      // Condition to check fill colours
      if (tr < 128) {
        if (fillInitially == 1) {
          fill(colour);
          noStroke();
        } else if (fillInitially == 2) {
          noFill();
          stroke(colour);
        } else if (fillInitially == 3) {
          fill(colour);
          stroke(255);
        }
        // condition to check which shape is selected
        if (shape == 1) {
          ellipse(xPos, yPos, shapeWidth, shapeWidth);
        } else if (shape == 2) {
          rectMode(CENTER);
          rect(xPos, yPos, shapeWidth, shapeWidth);
        }
      }
    }
  }
}
// function to export canvas as png
function keyReleased() {
  if (keyCode == CONTROL) saveCanvas(gd.timestamp(), 'png');
}

// Each time the text is changed, the setupText() function is called
// Creates an offscreen graphics object to draw the text into
// This is an image that is not visible but exists only in memory
function setUpText() {
  textImg = createGraphics(width, height);
  textImg.pixelDensity(1);
  textImg.background(255);
  textImg.textStyle(fontStyle);
  textImg.textFont('Roboto');
  textImg.textSize(fontSize);
  textImg.textAlign(CENTER, CENTER);
  textImg.text(type, width / 2, height / 4 + fontSize / 6);
  textImg.loadPixels();
}
// Update function is called whenever a user interacts with the controls
function update() {
  type = textInput.value();
  shapeWidth = shapeSlider.value();
  density = densitySlider.value();
  shapeOpacity = opacitySlider.value();
  let size = fontSizeOptions.value();
  fontSize = int(size);
  fontStyle = fontStyleOptions.value();
  shape = radioShape.value();
  fillInitially = radioFill.value();
  shake = shakeCheckBox.checked();
  move = moveCheckBox.checked();
  colourInitially = radioColour.value();

  setUpText();
}
