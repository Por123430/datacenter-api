const express = require('express')
const router = express.Router()
const notiTempController = require('../controllers/notiTempController')

router.route('/')
    .get(notiTempController.getAllNoti_temp)
    .post(notiTempController.postNoti_temp)
    

module.exports = router