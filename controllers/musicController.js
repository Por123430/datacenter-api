const asyncHandler = require('express-async-handler')
const Music = require('../models/music_con')

const getMusic = asyncHandler (async (req, res) => {
    const music = await Music.find()
    if (!music?.length) {
        return res.status(400).json({ message: 'No music found'})
    }
    res.json(music)
})
const getMusicActivTrue = asyncHandler (async (req, res) => {
    const music = await Music.find({active: true}).exec()
    if (!music?.length) {
        return res.status(400).json({ message: 'No music found'})
    }
    res.json(music)
})

const createMusic = asyncHandler (async(req, res) => {
    const{ no, name, active} = req.body

    // Confirm data
    // if (!no  || !name || !active) {
    //     return res.status(400).json({ message: 'All fields are required'})
    // }

    const musicObject = { no, name , active}
    console.log(musicObject);
    const music = await Music.create(musicObject)

    if (music) {
        res.status(201).json({ message: `New music ${name} created`})
    } else {
        res.status(400).json({ message: 'Invalid music data received'})
    }
})
const updateMusic = asyncHandler(async (req, res) => {
    const { id, active } = req.body;
    if (!id || !active) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Find the sensor document by ID
        const music = await Music.findById(id).exec();

        if (!music) {
            return res.status(404).json({ message: 'music not found' });
        }

        // Update the fields
        music.active = active;
        
        // Save the updated sensor document
        await music.save();
        await Music.updateMany({ _id: { $ne: id } }, { $set: { active: false } });

        res.json(music)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = {
    getMusic,
    createMusic,
    updateMusic,
    getMusicActivTrue
}