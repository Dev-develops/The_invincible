const fs = require("fs");
const mongoose = require("mongoose");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const User = require("../models/user");
const Doc = require("../models/techdocs");
const Project = require("../models/project");
const { FILE_UPLOAD_PATH } = require("../config/uploadpath");

mongoose.set("useFindAndModify", false);

//techDoc Uploads
exports.techdocs = async (req, res, next) => {
  console.log(req.file);
  try {
    const file = req.file;
    const name = req.body.name;
    // console.log(req);
    const fileName = name + file.detectedFileExtension;
    await pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/../../uploads/techDocs/${fileName}`)
    );
    //Putting file names in database
    const doc = new Doc({
      _id: mongoose.Types.ObjectId(),
      name: fileName,
      path: `/techDocs/${fileName}`,
    });
    await doc.save();
    res.status(200).json({
      message: "File uploaded!",
      data: fileName,
    });
  } catch (err) {
    console.log(err);
  }
};

// //user pic uploads
// exports.userpics = async (req, res, next) => {
//   console.log(req.file);
//   const file = req.file;
//   const name = req.body.name;
//   const code = req.body.code;
//   try {
//     if (
//       file.detectedFileExtension !== ".jpg" &&
//       file.detectedFileExtension !== ".jpeg" &&
//       file.detectedFileExtension !== ".png"
//     ) {
//       throw "Invalid File Format";
//     }
//     const fileName = name + code + file.detectedFileExtension;
//     await pipeline(
//       file.stream,
//       fs.createWriteStream(`${__dirname}/../../uploads/userPics/${fileName}`)
//     );
//     await User.findOneAndUpdate(
//       { salaryCode: code },
//       { photo: `${FILE_UPLOAD_PATH}/userPics/${fileName}` }
//     );
//   } catch (err) {
//     console.log(err);
//   }
// };
