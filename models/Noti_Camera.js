const mongoose = require("mongoose");

const noti_cameraSchema = new mongoose.Schema(
  {
    camera: {
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

module.exports = mongoose.model("Noti_Camera", noti_cameraSchema);
