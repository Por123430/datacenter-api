const express = require('express')
const router = express.Router()
const notiTempController = require('../controllers/notiTempController')

router.route('/')
    .get(notiTempController.getAllNoti_temp)
    .post(notiTempController.postNoti_temp)
   

router.route('/search')
    .post(notiTempController.searchNotiTemp)

router.route('/filter')
    .get(notiTempController.filterNoti_tempByDay)

router.route('/chartByWeek')
    .get(notiTempController.chartFilterByWeek)

router.route('/chartByDay')
    .get(notiTempController.chartFilterByDay)


router.route('/chartByMonth')
    .get(notiTempController.chartFilterByMonth)


module.exports = router