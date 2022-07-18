const Jimp = require('jimp')

console.log('start reading one frame')

let frameNummer = 1
// let startFrame = `front_end/tmpFrames/frame-${frameNummer}.png`
let startFrame = `testFrame.jpg`

// let coords = []

const coordsOfKeys = [
  [10,10],
  [400,100],
];


const fs = require('fs');

function readCoordinates(filePath){
  return fs.readFileSync(filePath,'utf8');
}

const coorddata = readCoordinates('coords.txt')
const splitted = coorddata.split('\n')

const coords = splitted.map(d=>{
  const c = d.split(' ')
  return c
})



Jimp.read(startFrame)
  .then(image=>{
    // console.log(image)
    coordsOfKeys.forEach(key=>{
      const rgb = Jimp.intToRGBA(image.getPixelColor(key[0],key[1]))
      const hex = rgbToHex(rgb.r,rgb.g,rgb.b); 

      // console.log(hex)


    })
  })
  .catch(err => console.err(err))



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
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
