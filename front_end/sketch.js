const url = window.location.href;
let params = (new URL(url)).searchParams;
const numberofframes = params.get('numberofframes') // "n1"


const imagesFromFrames = [];

let img;

function preload(){
  img = loadImage('tmpFrames/frame-1.png');
  
  for(let i = 1 ; i <= numberofframes ; i++){  
    imagesFromFrames[i-1] = loadImage(`tmpFrames/frame-${i}.png`);
  }
}

function setup() {
  createCanvas(300,300);
  background(0);
}

let counter = 0; 

function draw(){
  image(imagesFromFrames[counter++],0,0,300,300);

  if(counter == numberofframes){
    counter = 0;
  }

}
