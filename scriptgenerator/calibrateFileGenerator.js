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
const OUTPUTFILE = "colortest.txt"

function componentToHex(c) {
  const hex = c.toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}

function rgbToHex(r, g, b) {
  return `${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
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

async function analyseFrame(coordinatesOfKeys, startFrame, stringsToAppend, i) {
  const a = await Jimp.read(startFrame)
    .then((image) => {
      const allColors = []

      coordinatesOfKeys.forEach((c) => {
        const rgb = Jimp.intToRGBA(image.getPixelColor(c[0], c[1]))
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
        allColors.push(hex)
      })

      // eslint-disable-next-line no-param-reassign
      stringsToAppend[i] = allColors.join(" ")
      // console.log(stringsToAppend);
      return stringsToAppend
    })
    .catch((err) => console.log(err))

  return a
}

function appendToFile(stp, currentFrame, totalFrames) {
  let stringToAppend = stp

  if (currentFrame !== totalFrames) {
    stringToAppend += "\n"
  }

  fs.appendFileSync("colortest.txt", `${stringToAppend}`)
}

function readCoordinates(filePath) {
  return fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    .map((d) => [parseFloat(d.split(" ")[0]), parseFloat(d.split(" ")[1])])
}

const start = async (image, outputfile) => {
  const stringsToAppend = []
  const coordinatesOfKeys = readCoordinates(COORDSFILE)

  removeFile(outputfile) // if there is a outfile, remove it
  const frameAnalysis = await analyseFrame(
    coordinatesOfKeys,
    image,
    stringsToAppend,
    1
  )
  appendToFile(frameAnalysis, 1, 1)
}

//get the file extension of process.argv[2]
const fileExtension = process.argv[2].split(".").pop()

// check if the file is a image file
if (
  fileExtension === "png" ||
  fileExtension === "jpg" ||
  fileExtension === "jpeg"
) {
  console.log("this is a image file")
  start(process.argv[2], OUTPUTFILE)
  console.log("done")
} else {
  console.log("this is not a image file")
  console.log("please provide a image file")
  process.exit(1)
}
