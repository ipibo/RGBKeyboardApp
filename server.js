const express = require("express")
var bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")

const extractFrame = require("ffmpeg-extract-frames")
const ffmpeg = require("ffmpeg")
const fs = require("fs")
const path = require("path")
const probe = require("ffmpeg-probe")

const upload = require("./uploadFile.js")

const app = express()
const PORT = 3000
const NAME_OF_TMP_FOLDER = "tmpFrames"

const helperFunctions = require("./helperFunctions.js")
console.log(helperFunctions)

let removeTheFrames = false

app.use(express.static("front_end"))
app.use(express.static("setupKeyboard"))
app.use(express.static("frameTester"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(fileUpload())

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "front_end/index.html"))
})

app.get("/showMovie", (req, res) => {
  console.log("showmovie")
  res.sendFile(path.join(__dirname, "front_end/showMovie.html"))
})

app.get("/setupKeyboard", (req, res) => {
  console.log("keyboardMaker")

  res.sendFile(path.join(__dirname, "setupKeyboard/index.html"))
})

app.get("/frameTester", (req, res) => {
  console.log("frameTester")
  res.sendFile(path.join(__dirname, "frameTester/index.html"))
})

app.post("/uploadImage", (req, res) => {
  helperFunctions.makefolder("upload")
  // Get the file that was set to our field named "image"
  const { image } = req.files

  // If no image submitted, exit
  if (!image) return res.sendStatus(400)

  // Get the extension from the image
  const extension = path.extname(image.name)
  console.log(extension)

  // Move the uploaded image to our upload folder
  image.mv(__dirname + "/upload/test" + extension)

  // res.sendStatus(200)
  res.redirect(`/setupKeyboard`)
})

app.post("/saveFile", function (req, res) {
  console.log("saveFile")

  const keyboardLayout = req.body.keyboardLayout
  const data = keyboardLayout.join("\n")

  const allKeyboards = req.body.allKeyboards
  console.log(typeof allKeyboards)
  const s = JSON.stringify(allKeyboards)

  fs.writeFile("setupKeyboard/keyboardLayout.json", s, (err) => {
    if (err) throw err
    console.log("Keyboard layout saved to keyboardLayout.json")
  })

  fs.writeFile("frameTester/data/coords.txt", data, (err) => {
    // In case of a error throw err.
    if (err) throw err
  })
  fs.writeFile("scriptGenerator/newCoordinates.txt", data, (err) => {
    // In case of a error throw err.
    if (err) throw err
  })

  res.sendStatus(200)
})

app.listen(PORT, () => {
  console.log(`example app listening on port ${PORT}`)
})

// async function extractingFramesFromVideo(videoFile, tmpFolder, res) {
//   res.redirect(`/showMovie.html`)
//   //create a tmp folder for the frames
//   console.log("create a tmp folder for the frames")
//   makefolder(tmpFolder)

//   console.log("start with extracting the video into frames")
//   const frames = await extractFrame({
//     input: videoFile,
//     output: `${tmpFolder}/frame-%d.png`,
//   })

//   // extract the frames from the video and put them in a folder called frames.
//   console.log("done with extracting the frames from the video")

//   const info = await probe(videoFile)
//   const numFramesTotal = parseInt(info.streams[0].nb_frames)

//   // res.redirect(`/showMovie.html?numberofframes=${numFramesTotal}`);
// }
