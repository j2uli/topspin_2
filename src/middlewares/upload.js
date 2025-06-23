const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/productos/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      return cb(new Error('Solo se permiten imágenes'));
    }
    cb(null, true);
  }
});

module.exports = upload;
