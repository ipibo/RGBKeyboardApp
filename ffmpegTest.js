const extractFrame = require('ffmpeg-extract-frames')
const ffmpeg = require('ffmpeg')
const fs = require('fs')

async function extractingFramesFromVideo(videoFile, tmpFolder){
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

  // const numberOfFiles = getNumFiles(tmpFolder)
  // console.log(numberOfFiles);
  
  // const info = await probe(videoFile)
  // const numFramesTotal = parseInt(info.streams[0].nb_frames)

  // res.redirect(`/showMovie.html?numberofframes=${numFramesTotal}`);
  
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


extractingFramesFromVideo('./uploads/output.mp4','tmpfolder')