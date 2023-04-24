const asyncHandler = require('express-async-handler')
const Noti_Temp = require('../models/Noti_Temp')
const Noti_Humi = require('../models/Noti_Humi')



const postNoti_humi = asyncHandler (async(req, res) => {
    const date = new Date()
    const time = new Intl.DateTimeFormat('en-Us', { dateStyle: 'short',timeStyle: 'short'}).format(date)
    const{humidity } = req.body
    if(!humidity){
        return res.status(400).json({message: 'All fields are required'})
    }
    savetime = time
    const Noti_HumiObject = { humidity, savetime}
    const noti_humi = await Noti_Humi.create(Noti_HumiObject)
    if (noti_humi) {
        res.status(201).json({ message: `New humidity ${humidity} created`})
    } else {
        res.status(400).json({ message: 'Invalid humidity data received'})
    }
})
const getAllnoti_Humi = asyncHandler (async (req, res) => {
    const noti_humi = await (await Noti_Humi.find().select().lean()).reverse()
    if (!noti_humi?.length) {
        return res.status(400).json({ message: 'No noti_humi found'})
    }
    //console.log(monitors)
    res.json(noti_humi)
})


module.exports = {
    getAllnoti_Humi,
    postNoti_humi
}