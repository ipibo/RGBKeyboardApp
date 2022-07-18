const Jimp = require('jimp')

console.log('start reading one frame')

let frameNummer = 1
let startFrame = `front_end/tmpFrames/frame-${frameNummer}.png`

const coordsOfKeys = [
  [10,10],
];


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


const pixels = frameToPixels(0,startFrame)


function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
