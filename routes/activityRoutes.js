const express = require('express')
const router = express.Router()
const activityController = require('../controllers/activityController')

router.route('/')
    .get(activityController.getAllActivity)

module.exports = router