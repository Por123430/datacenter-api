const mongoose = require("mongoose");

const noti_timpSchema = new mongoose.Schema(
  {
    temperature: {
      type: String,
      require: true,
    },
    savetime: {
      type: String,
      require: true,
    },

  },
  {
    timestamps: {
       createdAt: true, 
       updatedAt: false 
      },
  }
);

module.exports = mongoose.model("Noti_Temp", noti_timpSchema);
