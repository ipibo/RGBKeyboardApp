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

//makes a coord float array from the incomming data 
const coords = coorddata
  .split('\n')
  .map(d=>[parseFloat(d.split(' ')[0]),parseFloat(d.split(' ')[1])])


Jimp.read(startFrame)
  .then(image=>{
    // console.log(image)
    // coordsOfKeys.forEach(key=>{
    //   const rgb = Jimp.intToRGBA(image.getPixelColor(key[0],key[1]))
    //   const hex = rgbToHex(rgb.r,rgb.g,rgb.b); 

    // })

    coords.forEach(c=>{
      const rgb = Jimp.intToRGBA(image.getPixelColor(c[0],c[1]))
      const hex = rgbToHex(rgb.r,rgb.g,rgb.b); 
    })

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
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
