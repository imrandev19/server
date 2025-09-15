const multer  = require('multer')
const path = require('path')
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|jfif|png|gif|webp|mp4|mov|avi|wmv|mkv|webm/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null, true);
    } else {
      return cb(null, false);
    }
  }
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const fileExtension = file.mimetype.split('/')
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix+'.'+fileExtension[fileExtension.length-1])
  }
})
const upload = multer({ storage: storage,
    fileFilter: function(_req, file, cb){
    checkFileType(file, cb)},
    limits: { fileSize: 3000000 }
 })
 module.exports = upload