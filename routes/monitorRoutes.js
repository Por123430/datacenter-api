const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const monitorsController = require('../controllers/monitorsController')


router.route('/')
    .get(monitorsController.getAllMonitors)
    .post(monitorsController.searchMonitors)

module.exports = router