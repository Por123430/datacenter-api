const express = require('express')
const router = express.Router()
const notiCameraController = require('../controllers/notiCamaraController')

router.route('/')
    .get(notiCameraController.getAllNoti_camera)
    .post(notiCameraController.postNoti_camera)

    router.route("/filter").get(notiCameraController.filterNoti_motionByDay);

// router.route('/postNoti_humi')
//     .post(notificationController.postNoti_humi)

router.route("/chartByWeek").get(notiCameraController.chartFilterByWeek);

router.route('/chartByDay')
    .get(notiCameraController.chartFilterByDay)


router.route('/chartByMonth')
    .get(notiCameraController.chartFilterByMonth)


module.exports = router