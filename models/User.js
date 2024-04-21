const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  firstname: {
    type: String,
    require: true,
  },
  lastname: {
    type: String,
    require: true,
  },
  line: {
    type: String,
  },
  password: {
    type: String,
    require: true,
  },
  roles: [
    {
      type: String,
      default: "Officer",
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);
