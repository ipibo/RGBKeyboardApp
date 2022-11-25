/* eslint-disable no-bitwise */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
let colors;
let keybrd;
let numberOfFrames;

function preload() {
  colors = loadStrings('data/colortest.txt');
  keybrd = loadStrings('data/coords.txt');
}

function setup() {
  createCanvas(1150, 250);
  background(0);
  // noLoop();

  const lengthOfColors = colors[0].split(' ').length;
  const lengthOfKeyboard = keybrd.length;



  console.log(colors.length)

  numberOfFrames = colors.length -1 

  colors.forEach((frame) => {
    // console.log(frame);
  });

  // if (lengthOfColors !== lengthOfKeyboard) {
  //   const newLocal = 'lengte van het keyboard en de kleuren komen niet overeen. check je files even!';
  //   alert(newLocal);
  // }
}

function hexToRgb(hex) {
  const bigint = parseInt(hex, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return color(r, g, b);
}

let currentFrame = 0;

function draw() {
  currentFrame += 1;
  console.log(currentFrame)
  if (currentFrame > numberOfFrames) {
    currentFrame = 0;
  }
  // print(currentFrame);
  const thiscolors = colors[currentFrame].split(' ');

  thiscolors.forEach((color, i) => {
    const x = keybrd[i].split(' ')[0];
    const y = keybrd[i].split(' ')[1];
    const hexColor = hexToRgb(color);

    fill(hexColor);
    ellipse(x, y, 10, 10);
  });
}

function keyPressed() {
  currentFrame += 1;
  print(currentFrame);
}
