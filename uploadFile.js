// module.exports
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null,'./uploads')
  },
  filename: (req,file,cb) => {
    cb(null, file.originalname) // hier pakt die nu de originele filename. Als deze al bestaat op de server, zal die overschreven worden
  }
})

// this code goes inside the object passed to multer()
function fileFilter (req, file, cb) {    
  // Allowed ext
  const filetypes = /mp4|mov/;
  // Check ext
  const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: mp4 and mov Only!');
  }
}

function test(){
  console.log('hoi')

}


const upload = multer({
  storage,
  limits: {fileSize: 100000000},
  fileFilter,
  
}).single("demo_image");


module.exports = upload