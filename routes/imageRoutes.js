const express = require('express')
const router = express.Router()
// const imageController = require('../controllers/imageController')

const imageController = require('../controllers/imageController')
router.route('/')
    .get(imageController.getAllImage)
    .post(imageController.uploadImage)
    // .get(imageController.getAllImage)
    // .post(imageController.uploadImage)

 

module.exports = router