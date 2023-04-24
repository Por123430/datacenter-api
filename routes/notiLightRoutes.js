const express = require('express')
const router = express.Router()
const notiLightController = require('../controllers/notiLightController')

router.route('/')
    .get(notiLightController.getAllNoti_light)
    .post(notiLightController.postNoti_light)





module.exports = router