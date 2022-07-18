const url = window.location.href;
let params = (new URL(url)).searchParams;
let numberofframes = params.get('numberofframes') // "n1"
const imagesFromFrames = [];

let firstFrame;

const coordsOfKeys = [
  [100,150],
  [150,150],
  [200,150],
  [250,150],
  [200,200],
  [87,70],
];

numberofframes = 100

function preload(){
  firstFrame = loadImage('tmpFrames/frame-1.png');
  
  for(let i = 1 ; i <= numberofframes ; i++){  
    imagesFromFrames[i-1] = loadImage(`tmpFrames/frame-${i}.png`);
    // console.log('loading frame' + i );
  }
}

const frame =[
  ["#ff0000","#ff0000","#ff0000","#ff0044","#ff0000","#ff0000"]
]


function setup() {
  createCanvas(300,300)
  background(0)
  noStroke();

  // frameRate(1) 
  
}

let counter = 0; 


// let x = coordsOfKeys[0][0]
// let y = coordsOfKeys[0][1]

function draw(){
  

  // const mappedXLocation = map(x,0,300,0,1804)
  // const mappedYLocation = map(y,0,300,0,1100)

  // const colorss = imagesFromFrames[counter++].get(mappedXLocation,mappedYLocation)
  // console.log(colorss)
  // fill(colorss)
  
  if(frame.length < numberofframes+1){
    image(imagesFromFrames[counter],0,0,300,300)
    // image(firstFrame,0,0,300,300)
  }


  if(frame.length === numberofframes+1){
    background(0)
    coordsOfKeys.forEach((e,i)=>{
      let c = color(frame[counter][i])
      fill(c)
      ellipse(e[0],e[1],30,30)
    })

  }else{

    coordsOfKeys.forEach((e,i)=>{
      fill(255,0,0);
      ellipse(e[0],e[1],30,30)
    })


  }

  counter++;
  
  // console.log("show")
  if(counter == numberofframes){
    counter = 0;
  }
}

function mousePressed(){
  console.log(mouseX,mouseY)
  coordsOfKeys.push([mouseX,mouseY])
  frame[0].push("#00ff00");

}

function keyPressed(){
  if(key == ' '){
    writeToTxt();
  }
}

const nof = numberofframes;


function writeToTxt(){
  counter = 0
  let imageCounter = 0; 
  for(let i = 1 ; i < nof+1 ; i++){
    console.log(i)

    const newImage = loadImage(`tmpFrames/frame-${i}.png`,e=>{
      let newcolors = [];
      console.log(coordsOfKeys.length)
      coordsOfKeys.forEach(e=>{
        // ellipse(e[0],e[1],20,20);
        const mappedXLocation = map(e[0],0,300,0,newImage.width)
        const mappedYLocation = map(e[1],0,300,0,newImage.height)

        // console.log(e)
        const colorss = newImage.get(mappedXLocation,mappedYLocation)
        // console.log(colorss)
        const toHex = rgbToHex(colorss[0],colorss[1],colorss[2])
        // console.log(toHex)
        newcolors.push(toHex)

      })

      console.log(i)
      // frame[0] = newcolors
      frame.push(newcolors)
      // filled = true;

      imageCounter++
    }, err=>{
      console.log(err)
    });

  }

}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

