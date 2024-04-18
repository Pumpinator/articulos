const multer = require('multer')
const path = require('path')
const fs = require('fs')

function cleanTitle(title) {
  return title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'public/uploads/' + req.cookies.userId
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: function (req, file, cb) {
    cb(null, cleanTitle(req.body.title) + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage })

module.exports = upload
