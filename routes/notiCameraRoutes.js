const express = require('express')
const router = express.Router()
const notiCameraController = require('../controllers/notiCamaraController')

router.route('/')
    .get(notiCameraController.getAllNoti_camera)
    .post(notiCameraController.postNoti_camera)



// router.route('/postNoti_humi')
//     .post(notificationController.postNoti_humi)

router.route("/chartByWeek").get(notiCameraController.chartFilterByWeek);

router.route('/chartByDay')
    .get(notiCameraController.chartFilterByDay)


router.route('/chartByMonth')
    .get(notiCameraController.chartFilterByMonth)


module.exports = router