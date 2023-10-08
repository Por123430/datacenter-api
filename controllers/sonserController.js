const asyncHandler = require('express-async-handler')
const Sensor = require('../models/Sensor')

const getSensor = asyncHandler (async (req, res) => {
    const sensor = await Sensor.find()
    if (!sensor?.length) {
        return res.status(400).json({ message: 'No sensor found'})
    }
    res.json(sensor)
})

const createSensor = asyncHandler (async(req, res) => {
    const{ temp, moisture, position} = req.body

    // Confirm data
    if (!temp  || !moisture || !position) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const sensorObject = { temp, moisture , position}

    const sensor = await Sensor.create(sensorObject)

    if (sensor) {
        res.status(201).json({ message: `New sensor ${temp} created`})
    } else {
        res.status(400).json({ message: 'Invalid sensor data received'})
    }
})
const updateSensor = asyncHandler(async (req, res) => {
    const { id, temp, moisture, position } = req.body;
    if (!id || !temp || !moisture || !position) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Find the sensor document by ID
        const sensor = await Sensor.findById(id).exec();

        if (!sensor) {
            return res.status(404).json({ message: 'Sensor not found' });
        }

        // Update the fields
        sensor.temp = temp;
        sensor.moisture = moisture;
        sensor.position = position;

        // Save the updated sensor document
        await sensor.save();

        res.json({ message: `${sensor.model} updated` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = {
    getSensor,
    createSensor,
    updateSensor
}