const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = 'public/uploads/' + req.cookies.userId
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: function(req, file, cb) {
    cb(null, req.body.title + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

module.exports = upload;