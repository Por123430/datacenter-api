const mongoose = require('mongoose');

const monitersSchema = new mongoose.Schema({
    temp: {
    type: String,
    require: true,
  },
  moisture: {
    type: String,
    require: true,
  },
 
});

module.exports = mongoose.model("Monitors", monitersSchema);