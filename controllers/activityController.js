const asyncHandler = require('express-async-handler')
const Activity = require('../models/Activity')

const getAllActivity = asyncHandler (async (req, res) => {
    const activity = await (await Activity.find().select().lean()).reverse()
    if (!activity?.length) {
        return res.status(400).json({ message: 'No activity found'})
    }
    //console.log(monitors)
    res.json(activity)
})

module.exports = {
    getAllActivity
}