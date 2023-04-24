const asyncHandler = require('express-async-handler')
const Noti_Camera = require('../models/Noti_Camera')
const postNoti_camera = asyncHandler (async(req, res) => {
    const date = new Date()
    const time = new Intl.DateTimeFormat('en-Us', { dateStyle: 'short',timeStyle: 'short'}).format(date)
    const{camera} = req.body
    if(!camera){
        return res.status(400).json({message: 'All fields are required'})
    }
    savetime = time
    const Noti_CameraObject = { camera, savetime}
    const noti_camera = await Noti_Camera.create(Noti_CameraObject)
    if (noti_camera) {
        res.status(201).json({ message: `New temp ${camera} created`})
    } else {
        res.status(400).json({ message: 'Invalid temp data received'})
    }
})

const getAllNoti_camera = asyncHandler (async (req, res) => {
    const noti_camera = await (await Noti_Camera.find().select().lean()).reverse()
    if (!noti_camera?.length) {
        return res.status(400).json({ message: 'No noti_camera found'})
    }
    //console.log(monitors)
    res.json(noti_camera)
})

module.exports = {
    postNoti_camera,
    getAllNoti_camera
}