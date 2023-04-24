const express = require('express')
const router = express.Router()
const sensorController = require('../controllers/sonserController')



 
router.route('/')
    .post(sensorController.createSensor)
    .get(sensorController.getSensor)
    .patch(sensorController.updateSensor)

 

module.exports = router