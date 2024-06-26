/* eslint-disable no-console */
// libraries
const extractFrame = require("ffmpeg-extract-frames")
const fs = require("fs")
const Jimp = require("jimp")
const probe = require("ffmpeg-probe")

// Consts
const COORDSFILE = "newCoordinates.txt"
const TMPFOLDER = "tmpfolder"
const VIDEO = "30vs120.mp4"
const OUTPUTFILE = "../frameTester/data/colortest.bin"

function componentToHex(c) {
  const hex = c.toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}

function rgbToHex(r, g, b) {
  return `${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
}

async function analyseFrame(coordinatesOfKeys, startFrame) {
  const colorData = await Jimp.read(startFrame)
    .then((image) => {
      const allColors = []

      coordinatesOfKeys.forEach((c) => {
        const rgb = Jimp.intToRGBA(image.getPixelColor(c[0], c[1]))
        //        console.log(image.getPixelColor(c[0], c[1]), rgb)
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b)

        const binary =
          rgb.r.toString(2).padStart(8, "0") +
          rgb.g.toString(2).padStart(8, "0") +
          rgb.b.toString(2).padStart(8, "0")

        const rgbArray = [
          rgb.r.toFixed(1),
          rgb.g.toFixed(1),
          rgb.b.toFixed(1),
          (1.0).toFixed(1),
        ]

        allColors.push(binary)
      })
      // console.log(allColors)
      // return allColors
      return allColors.join("")
    })
    .catch((err) => console.log(err))
  return colorData
}

// Make folder
function makefolder(folder) {
  try {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder)
    }
  } catch (err) {
    console.error(err)
  }
}

function removeFile(outputfile) {
  try {
    if (fs.existsSync(outputfile)) {
      fs.unlinkSync(outputfile)
      return true
    }
  } catch (err) {
    console.error(err)
  }
  return false
}

// misschien moet ik hier nog een check aan toevoegen of het wel bestaat.
function removeFolder(dir) {
  fs.rm(dir, { recursive: true }, (err) => {
    if (err) {
      throw err
    }
    console.log(`${dir} is deleted!`)
  })
}

async function extractFramesFromVideo(videoFile, tmpFolder, coordinatesOfKeys) {
  // create a tmp folder for the frames
  makefolder(tmpFolder)

  await extractFrame({
    input: videoFile,
    output: `${tmpFolder}/frame-%d.png`,
  })

  const info = await probe(videoFile)
  const numFramesTotal = parseInt(info.streams[0].nb_frames, 10)

  console.log("Total frames in video: ", numFramesTotal)

  for (let i = 1; i <= numFramesTotal; i++) {
    if (i % 100 === 0) {
      console.log("frames processed: ", i)
    }
    if (fs.existsSync(`${tmpFolder}/frame-${i}.png`)) {
      const frameAnalysisResults = await analyseFrame(
        coordinatesOfKeys,
        `${tmpFolder}/frame-${i}.png`
      )
      appendToFile(frameAnalysisResults, i, numFramesTotal)
    }
  }

  return numFramesTotal
}

function binaryStringToBuffer(binaryString) {
  const byteLength = Math.ceil(binaryString.length / 8)
  const buffer = Buffer.alloc(byteLength)
  for (let i = 0; i < binaryString.length; i++) {
    const byteIndex = Math.floor(i / 8)
    const bitIndex = i % 8
    const bit = binaryString[i] === "1" ? 1 : 0
    buffer[byteIndex] |= bit << (7 - bitIndex) // Assuming big-endian bit order
  }
  return buffer
}
function saveBinaryDataToFile(binaryString, filePath) {
  const buffer = binaryStringToBuffer(binaryString)
  // Use fs.appendFile to append to the file
  fs.appendFile(filePath, buffer, (err) => {
    if (err) {
      console.error("Error appending to binary file:", err)
    } else {
      // console.log("Binary data appended successfully.")
    }
  })
}

// Ik wil er nog zorgen dat de laaste regel niet wordt overgeslagen
function appendToFile(stp, currentFrame, totalFrames) {
  let stringToAppend = stp

  if (currentFrame !== totalFrames) {
    stringToAppend += "\n"
  }

  saveBinaryDataToFile(stringToAppend, OUTPUTFILE)

  // fs.appendFileSync(OUTPUTFILE, `${stringToAppend}`)
  // fs.appendFileSync(OUTPUTFILE, `${stringToAppend}`)
  //  fs.writeFile(OUTPUTFILE, "b", 0b000000000000000000000000)
}

function readCoordinates(filePath) {
  return fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    .map((d) => [parseFloat(d.split(" ")[0]), parseFloat(d.split(" ")[1])])
}

const start = async (video, outputfile) => {
  removeFile(outputfile) // if there is a outfile, remove it

  const coordinatesOfKeys = readCoordinates(COORDSFILE)
  await extractFramesFromVideo(video, TMPFOLDER, coordinatesOfKeys)
  removeFolder(TMPFOLDER)
}

if (process.argv[2] != null) {
  console.log("start to render outputfile ")
  start(process.argv[2], OUTPUTFILE)
} else {
  console.log("please provide file SJEF  ")
}
