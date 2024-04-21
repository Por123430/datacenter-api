const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  model:{
    type: String,
    default: "1"
  },
  temp: {
    type: String,
    require: true,
  },
  moisture: {
    type: String,
    require: true,
  },
  position: {
    type: String,
    require: true,
  },
 
});

module.exports = mongoose.model("Sensor", sensorSchema);