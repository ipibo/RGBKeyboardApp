/* eslint-disable no-console */
// libraries
const extractFrame = require('ffmpeg-extract-frames');
const fs = require('fs');
const Jimp = require('jimp');
const probe = require('ffmpeg-probe');

// Consts
const COORDSFILE = 'newCoordinates.txt';
const TMPFOLDER = 'tmpfolder';
const VIDEO = '30vs120.mp4';
const OUTPUTFILE = 'colortest.txt';




function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

function rgbToHex(r, g, b) {
  return `${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function analyseFrame(coordinatesOfKeys, startFrame, stringsToAppend, i) {
  Jimp.read(startFrame)
    .then((image) => {
      const allColors = [];

      coordinatesOfKeys.forEach((c) => {
        const rgb = Jimp.intToRGBA(image.getPixelColor(c[0], c[1]));
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        allColors.push(hex);
      });

      // eslint-disable-next-line no-param-reassign
      stringsToAppend[i] = allColors.join(' ');
    })
    .catch((err) => console.log(err));
}

// Make folder
function makefolder(folder) {
  try {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
  } catch (err) {
    console.error(err);
  }
}

function removeFile(outputfile) {
  try {
    if (fs.existsSync(outputfile)) {
      fs.unlinkSync(outputfile);
      return true;
    }
  } catch (err) {
    console.error(err);
  }
  return false;
}

// misschien moet ik hier nog een check aan toevoegen of het wel bestaat.
function removeFolder(dir) {
  fs.rm(dir, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
    console.log(`${dir} is deleted!`);
  });
}

async function extractFramesFromVideo(videoFile, tmpFolder) {
  // create a tmp folder for the frames
  makefolder(tmpFolder);

  // eslint-disable-next-line no-unused-vars
  const frames = await extractFrame({
    input: videoFile,
    output: `${tmpFolder}/frame-%d.png`,
  });

  const info = await probe(videoFile);
  const numFramesTotal = parseInt(info.streams[0].nb_frames, 10);

  return numFramesTotal;
}

// Ik wil er nog zorgen dat de laaste regel niet wordt overgeslagen
function appendToFile(stp, currentFrame, totalFrames) {
  let stringToAppend = stp;

  if (currentFrame !== totalFrames) {
    stringToAppend += '\n';
  }

  fs.appendFileSync('colortest.txt', `${stringToAppend}`);
}

function readCoordinates(filePath) {
  return fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .map((d) => [parseFloat(d.split(' ')[0]), parseFloat(d.split(' ')[1])]);
}

const start = async (video,outputfile) => {
  const result = await extractFramesFromVideo(video, TMPFOLDER);
  const startFrameNumber = 1;
  const stringsToAppend = [];
  const coordinatesOfKeys = readCoordinates(COORDSFILE);

  removeFile(outputfile); // if there is a outfile, remove it

  for (let i = startFrameNumber; i <= result; i += 1) {
    const startFrame = `${TMPFOLDER}/frame-${i}.png`;
    analyseFrame(coordinatesOfKeys, startFrame, stringsToAppend, i);
  }

  const saveToFile = () => {
    if (stringsToAppend.length !== result + 1) {
      setTimeout(saveToFile, 100);
    } else {
      stringsToAppend.forEach((string, i) => {
        appendToFile(string, i, result);
      });
    }
  };

  saveToFile(stringsToAppend);
  removeFolder(TMPFOLDER);
};


if (process.argv[2] != null){
    console.log('start to render outputfile ')
    start(process.argv[2],OUTPUTFILE);
}else{
    console.log("please provide file SJEF  ")
}


