const fs = require("fs")
function makefolder(folder) {
  try {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder)
    }
  } catch (err) {
    console.error(err)
  }
}

function removeFolder(folderName) {
  fs.rmSync(folderName, { recursive: true, force: true })
}

function removeFilesFromDirectory(dirPath) {
  const directoryPath = path.join(__dirname, dirPath)

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(err)
    }
    files.forEach((file) => {
      const filename = `frames/${file}`
      fs.unlink(filename, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
    })
  })
}

module.exports = {
  makefolder,
  removeFolder,
  removeFilesFromDirectory,
}
