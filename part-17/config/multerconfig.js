const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/upload"); // file saving path
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, (err, bytes) => {
      const fn = bytes.toString("hex") + path.extname(file.originalname);
      // path.extname(file.originalname) is code se file/image  ke extention ka type btati hai (jpg,png) bahar aajye ga
      cb(null, fn);
    });
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
