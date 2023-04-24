const express = require('express')
const router = express.Router()
const notiHumiController = require('../controllers/notiHumiController')

router.route('/')
    .get(notiHumiController.getAllnoti_Humi)
    .post(notiHumiController.postNoti_humi)



// router.route('/postNoti_humi')
//     .post(notificationController.postNoti_humi)



module.exports = router