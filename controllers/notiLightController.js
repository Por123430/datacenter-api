const asyncHandler = require('express-async-handler')
const Noti_Light = require('../models/Noti_Light')
const postNoti_light = asyncHandler (async(req, res) => {
    const date = new Date()
    const time = new Intl.DateTimeFormat('en-Us', { dateStyle: 'short',timeStyle: 'short'}).format(date)
    const{flame} = req.body
    if(!flame){
        return res.status(400).json({message: 'All fields are required'})
    }
    savetime = time
    const Noti_LightObject = { flame, savetime}
    const noti_light = await Noti_Light.create(Noti_LightObject)
    if (noti_light) {
        res.status(201).json({ message: `New flame ${flame} created`})
    } else {
        res.status(400).json({ message: 'Invalid flame data received'})
    }
})

const getAllNoti_light = asyncHandler (async (req, res) => {
    const noti_light = await (await Noti_Light.find().select().lean()).reverse()
    if (!noti_light?.length) {
        return res.status(400).json({ message: 'No noti_light found'})
    }
    //console.log(monitors)
    res.json(noti_light)
})

module.exports = {
    postNoti_light,
    getAllNoti_light
}