const asyncHandler = require('express-async-handler')
const Moniters = require('../models/Monitor')

const getAllMonitors = asyncHandler (async (req, res) => {
    const monitors = await (await Moniters.find().select().lean()).reverse()
    if (!monitors?.length) {
        return res.status(400).json({ message: 'No monitors found'})
    }
    //console.log(monitors)
    res.json(monitors)
})

module.exports = {
    getAllMonitors
}