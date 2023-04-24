const asyncHandler = require("express-async-handler");
const ImageModel = require("../models/ImageModel");
const mongoose = require("mongoose");
const multer = require("multer");
const express = require("express");
const app = express();
const fs = require('fs');

const Storage = multer.diskStorage({
 
  destination:( req, file, cb) =>{
    cb(null, 'uploads')
  },
  filename: ( req, file, cb) => {
    cb(null,file.originalname)
  }
});
const upload = multer({
  storage: Storage,}).single("testImage2");
const getAllImage = asyncHandler(async (req, res) => {
  // const { name} = req.body
  const images = await ImageModel.find().sort({_id:-1});
  if (!images?.length) {
    return res.status(400).json({ message: "No images found" });
  }
  res.json(images)
 
});

const uploadImage = asyncHandler(async (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const date = new Date()
      const time = new Intl.DateTimeFormat('en-Us', { dateStyle: 'short',timeStyle: 'short'}).format(date)
      const newImage = new ImageModel({
        name: req.body.name,
        image: {
          data: fs.readFileSync("uploads/" +req.file.filename),
          contentType: "image/png",
        },
        savetime: time
      });
      newImage
        .save()
        .then(() =>res.send(`successfully ${newImage.name} uploaded`))
        .catch((err) => console.log(err))
    }
  });
});

module.exports = {
  getAllImage,
  uploadImage,
};
