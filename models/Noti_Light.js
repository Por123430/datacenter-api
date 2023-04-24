const mongoose = require("mongoose");

const noti_lightSchema = new mongoose.Schema(
  {
    flame: {
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

module.exports = mongoose.model("Noti_Light", noti_lightSchema);
