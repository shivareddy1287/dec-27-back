const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

//storage
const multerStorage = multer.memoryStorage();

//file type check

const multerFilter = (req, file, cb) => {
  //check file type
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    //regected files
    cb({ message: "unsupported file format" }, false);
  }
};

const photoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

//Image Resizing
const profilePhotoResizing = async (req, res, next) => {
  //check if there is no file
  if (!req.file) return next();

  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));
  next();
};

module.exports = { photoUpload, profilePhotoResizing };
