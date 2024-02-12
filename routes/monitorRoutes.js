const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const monitorsController = require('../controllers/monitorsController')


router.route('/')
    .get(monitorsController.getAllMonitors)
    .post(monitorsController.searchMonitors)

router.route('/chartByMonthTemp')
    .get(monitorsController.chartFilterByMonthTemp)

router.route('/chartByMonthHumi')
    .get(monitorsController.chartFilterByMonthHumi)

router.route('/chartByMonthLight')
    .get(monitorsController.chartFilterByMonthLight)

router.route('/csv')
    .get(monitorsController.getCsv)
 


module.exports = router