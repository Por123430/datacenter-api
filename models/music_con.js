const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  no:{
    type: Number,
  },
  name:{
    type: String
  },
  active: {
    type: Boolean
  },

});

module.exports = mongoose.model("Music", musicSchema);