const mongoose  = require('mongoose');

const activitySchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    count:{
        type: Number,
        index: true,
    },
    roles: [
        {
          type: String,
          default: "Officer",
        },
    ],
    login_time: {
        type: String,
        require: true,
    },
    logout_time: {
        type: String,
        default: "-",
    }
},{
    timestamps : true
})
module.exports = mongoose.model("Activity", activitySchema);