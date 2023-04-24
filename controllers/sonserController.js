const asyncHandler = require('express-async-handler')
const Sensor = require('../models/Sensor')

const getSensor = asyncHandler (async (req, res) => {
    const sensor = await Sensor.find()
    if (!sensor?.length) {
        return res.status(400).json({ message: 'No sensor found'})
    }
    console.log(sensor)
    res.json(sensor)
})

const createSensor = asyncHandler (async(req, res) => {
    const{ temp, moisture} = req.body

    // Confirm data
    if (!temp  || !moisture ) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const sensorObject = { temp, moisture }

    const sensor = await Sensor.create(sensorObject)

    if (sensor) {
        res.status(201).json({ message: `New sensor ${temp} created`})
    } else {
        res.status(400).json({ message: 'Invalid sensor data received'})
    }
})
const updateSensor = asyncHandler(async (req, res) => {
    const { id, temp, moisture} = req.body

    if(!id || !temp || !moisture ){
        return res.status(400).json({ message: 'All fields are required'})
    }

    const sensor = await Sensor.findById(id).exec()

    sensor.temp = temp
    sensor.moisture = moisture

    const updateSensor = await sensor.save()

    res.json({ message: `${updateSensor.temp} updated`})

})

module.exports = {
    getSensor,
    createSensor,
    updateSensor
}