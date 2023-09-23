const asyncHandler = require("express-async-handler");
const Moniters = require("../models/Monitor");

const getAllMonitors = asyncHandler(async (req, res) => {
  const monitors = await (await Moniters.find().select().lean()).reverse();
  if (!monitors?.length) {
    return res.status(400).json({ message: "No monitors found" });
  }
  //console.log(monitors)
  res.json(monitors);
});

const searchMonitors = asyncHandler(async (req, res) => {
  const { value } = req.body;
  // if(value==="detect"){
  //   value = 1;
  // }
  // console.log(value);
  const piplines = [
    {
      $match: {
        $or: [
          { temp: { $regex: ".*" + value + ".*", $options: "i" } },
          { moisture: { $regex: ".*" + value + ".*", $options: "i" } },
          { lighting: { $regex: ".*" + value + ".*", $options: "i" } },
          { createdAt: { $regex: ".*" + value + ".*", $options: "i" } },
        ],
      },
    },
  ];
  const monitors = await (await Moniters.aggregate(piplines)).reverse();
  res.json(monitors);
});
module.exports = {
  getAllMonitors,
  searchMonitors,
};
