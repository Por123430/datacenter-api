const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    name :{
        type: String,
        required:true
    },
    image :{
        data:Buffer,
        contentType: String
    },
    savetime: {
        type: String,
        require: true,
      }
},
{
  timestamps: {
     createdAt: true, 
     updatedAt: false 
    },
})

module.exports = mongoose.model('ImageModel',ImageSchema)