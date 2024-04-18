const express = require('express')
const router = express.Router()
const musicController = require('../controllers/musicController')



 
router.route('')
    .post(musicController.createMusic)
    .get(musicController.getMusic)
    .put(musicController.updateMusic)

router.route('/active')
    .get(musicController.getMusicActivTrue)

 

module.exports = router