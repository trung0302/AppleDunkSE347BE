import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { dir } from "console";
const __dirname = path.resolve();

//for docker
/*
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(__dirname, "/public/images/");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
      
    },
    filename: function (req, file, cb) {
      const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
      console.log("error that");
    },
  });
  
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      console.log(__dirname);
      cb(null, true);
    } else {
      console.log("lỗi chỗ này");
      cb({ message: "Unsupported file format" }, false);
    }
  };
  
  export const uploadPhoto = multer({
    storage: storage,
    fileFilter: multerFilter,
    limits: { fileSize: 1000000 },
  });
  
  export const userImgResize = async (req, res, next) => {




const currentDirectory = path.resolve();
const publicDirectory = path.join(currentDirectory, 'public');
console.log(publicDirectory);
    if (!req.files) return next();
    console.log("thisss");
    await Promise.all(
      req.files.map(async (file) => {
        console.log(file.path);
        await sharp(file.path)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(path.join(__dirname, '../backend/public/images/users', file.filename));
          console.log("vào đây");
          fs.unlinkSync(path.join(__dirname, '../backend/public/images/users', file.filename));
      })
    );
    next();
  };
  */
  //module.exports = { uploadPhoto, userImgResize };



  //for local
   
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(__dirname, "/public/images");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
      
    },
    filename: function (req, file, cb) {
      const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
      console.log("error that");
    },
  });
  
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      console.log(__dirname);
      cb(null, true);
    } else {
      console.log("lỗi chỗ này");
      cb({ message: "Unsupported file format" }, false);
    }
  };
  
  export const uploadPhoto = multer({
    storage: storage,
    fileFilter: multerFilter,
    limits: { fileSize: 1000000 },
  });
  
  export const userImgResize = async (req, res, next) => {

const currentDirectory = path.resolve();
const publicDirectory = path.join(currentDirectory, 'public');
console.log(publicDirectory);
    if (!req.files) return next();
    console.log("thisss");
    await Promise.all(
      req.files.map(async (file) => {
        console.log(file.path);
        await sharp(file.path)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(path.join(__dirname, '/public', file.filename));
          console.log("vào đây");
          //fs.unlinkSync(path.join(__dirname, '/public/images', file.filename));
          fs.unlinkSync(path.join(__dirname, '/public', file.filename));
      })
    );
    next();
  };
   