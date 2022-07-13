const express = require('express')
const extractFrame = require('ffmpeg-extract-frames')
const ffmpeg = require('ffmpeg')
const fs = require('fs')

const path = require('path')

const app = express()
const PORT = 3000
const NAME_OF_TMP_FOLDER = 'tmpFrames'

const upload = require('./uploadFile.js')

const probe = require('ffmpeg-probe')

let removeTheFrames = false


app.use(express.static('front_end'))

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname, 'front_end/index.html'))
})

app.get('/showMovie',(req,res)=>{
  res.sendFile(path.join(__dirname, 'front_end/showMovie.html'))
})

app.listen(PORT, () =>{
	console.log(`example app listening on port ${PORT}`)
})

async function extractingFramesFromVideo(videoFile, tmpFolder,res){
  //create a tmp folder for the frames
  console.log('create a tmp folder for the frames')
  makefolder(tmpFolder);

  console.log('start with extracting the video into frames')
	const frames = await extractFrame({
		input:videoFile,
		output:`${tmpFolder}/frame-%d.png`
	})

	// extract the frames from the video and put them in a folder called frames.
	console.log('done with extracting the frames from the video');

  const numberOfFiles = getNumFiles(tmpFolder)
  console.log(numberOfFiles);
  
  const info = await probe(videoFile)
  const numFramesTotal = parseInt(info.streams[0].nb_frames)

  res.redirect(`/showMovie.html?numberofframes=${numFramesTotal}`);
  
}

function removeFilesFromDirectory(dirPath){
  const directoryPath = path.join(__dirname, dirPath)

  fs.readdir(directoryPath,(err,files) =>{
    if(err){
      console.error(err)
    }
    files.forEach(file=>{
      const filename = `frames/${file}`
      fs.unlink(filename,(err) =>{
        if(err){
          console.error(err)
          return
        }
      })
    })
  })
}

function makefolder(folder){
  try{
    if(!fs.existsSync(folder)){
      fs.mkdirSync(folder)
    }
  }catch(err){
    console.error(err)
  }

}

function removeFolder(folderName){
  fs.rmSync(folderName,{recursive: true,force:true})
}

app.post("/uploadFile", (req, res) => {
  upload(req, res, (err) => {
   if(err) {
     res.status(400).send(`An error occured: ${err}`);
   }

   extractingFramesFromVideo(`./Uploads/${req.file.originalname}`,'front_end/tmpFrames',res)
  

  // res.redirect('/showMovie.html');
  // console.log(req.file.originalname);
  

 })


//  extractingFramesFromVideo('./Uploads/Untitled.mp4','front_end/tmpFrames',res)
 
 
 
});




