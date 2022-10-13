const Jimp = require('jimp');
const fs = require('fs'); // file system

console.log('start reading one frame');

let frameNummer = 1
// let startFrame = `front_end/tmpFrames/frame-${frameNummer}.png`
let startFrame = `testFrame.jpg`

//makes a coord float array from the incomming data 
// This is the data from the coords of the keyboards. I have to find a way that the used can upload this
function readCoordinates(filePath) {
  return fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .map(d => [parseFloat(d.split(' ')[0]), parseFloat(d.split(' ')[1])]);
}

const coords = readCoordinates('coords.txt')


Jimp.read(startFrame)
  .then(image=>{

    let allColors = []

    coords.forEach(c=>{
      const rgb = Jimp.intToRGBA(image.getPixelColor(c[0],c[1]))
      const hex = rgbToHex(rgb.r,rgb.g,rgb.b); 
      allColors.push(hex)
    })

    fs.writeFile('colortest.txt', allColors.join(' '), function (err) {
      if (err) return console.log(err);
    });
    
  })
  .catch(err => console.log(err))

function frameToPixels(value, frame){

  Jimp.read(frame)
  .then(image => {
    coordsOfKeys.forEach(key=>{
      const rgb = Jimp.intToRGBA(image.getPixelColor(key[0],key[1]))
      const hex = rgbToHex(rgb.r,rgb.g,rgb.b); 

      console.log(hex)

    })

    frameNummer++;
    startFrame = `front_end/tmpFrames/frame-${frameNummer}.png`
    // console.log(startFrame)

    console.log(frameNummer)
    if(frameNummer > 600){
      console.log('done')
      return
    }

    frameToPixels(0,startFrame)

    // return hex
  })
  .catch(err => {
    console.log(err)
    // Handle an exception.
  });
}


// const pixels = frameToPixels(0,startFrame)


function componentToHex(c) {
var hex = c.toString(16);
return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
return "" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
