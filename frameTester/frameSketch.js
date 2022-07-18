let colors
let keybrd
function preload(){
  colors = loadStrings('data/colortest.txt')
  keybrd = loadStrings('data/coords.txt');
}

function setup(){
  createCanvas(1150,250);
  background(0);
  noLoop();

  const lengthOfColors = colors[0].split(' ').length;
  const lengthOfKeyboard = keybrd.length;

  if(lengthOfColors != lengthOfKeyboard){
    alert('lengte van het keyboard en de kleuren komen niet overeen. check je files even!');
  }

  const thiscolors = colors[0].split(' ');

  thiscolors.forEach((color,i)=>{    
    const x = keybrd[i].split(' ')[0]
    const y = keybrd[i].split(' ')[1]
    const hexColor = hexToRgb(color)

    fill(hexColor);
    ellipse(x,y,10,10);

  })

}


function hexToRgb(hex) {

  var bigint = parseInt(hex, 16);

  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return color(r, g, b);
}