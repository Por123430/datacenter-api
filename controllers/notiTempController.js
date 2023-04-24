const asyncHandler = require('express-async-handler')
const Noti_Temp = require('../models/Noti_Temp')

const postNoti_temp = asyncHandler (async(req, res) => {
    const date = new Date()
    const time = new Intl.DateTimeFormat('en-Us', { dateStyle: 'short',timeStyle: 'short'}).format(date)
    const{temperature} = req.body
    if(!temperature){
        return res.status(400).json({message: 'All fields are required'})
    }
    savetime = time
    const Noti_TempObject = { temperature, savetime}
    const noti_temp = await Noti_Temp.create(Noti_TempObject)
    if (noti_temp) {
        res.status(201).json({ message: `New temp ${temperature} created`})
    } else {
        res.status(400).json({ message: 'Invalid temp data received'})
    }
})

const getAllNoti_temp = asyncHandler (async (req, res) => {
    const noti_temp = await (await Noti_Temp.find().select().lean()).reverse()
    if (!noti_temp?.length) {
        return res.status(400).json({ message: 'No noti_temp found'})
    }
    //console.log(monitors)
    res.json(noti_temp)
})

module.exports = {
    postNoti_temp,
    getAllNoti_temp
}