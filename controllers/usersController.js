const User = require("../models/User");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({isDelete: false}).select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
 
  res.json(users);
});

const createNewUser = asyncHandler(async (req, res) => {
  const { username, firstname, lastname, password, roles, line } = req.body;
  // Confirm data
  if (
    !username ||
    !firstname ||
    !lastname ||
    !password ||
    !Array.isArray(roles) ||
    !roles.length
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate
  const duplicate = await User.findOne({ username:username , isDelete: false}).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  // Hash password
  const hasedPwd = await bcrypt.hash(password, 10); // salt rounds

  const userObject = {
    username,
    firstname,
    lastname,
    line,
    password: hasedPwd,
    roles,
  };

  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, firstname, lastname, line, roles, active, password } =
    req.body;

  //Confirm data
  if (
    !id ||
    !username ||
    !firstname ||
    !lastname ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check fot duplicate
  const duplicate = await User.findOne({ username:username , isDelete: false}).lean().exec();
  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  user.username = username;
  user.firstname = firstname;
  user.lastname = lastname;
  user.line = line;
  user.roles = roles;
  user.active = active;

  if (password) {
    //Hash password
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  await User.findOneAndUpdate({ _id: id }, { isDelete: true , active: false});


  const reply = `Username ${result.username} with ID ${result.id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
