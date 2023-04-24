const mongoose = require("mongoose");

const noti_humiditySchema = new mongoose.Schema(
  {
    humidity: {
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
      updatedAt: false,
    },
  }
);

module.exports = mongoose.model("Noti_Humi", noti_humiditySchema);
