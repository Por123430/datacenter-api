const asyncHandler = require("express-async-handler");
const Moniters = require("../models/Monitor");

const getAllMonitors = asyncHandler(async (req, res) => {
  const monitors = await (await Moniters.find().select().lean()).reverse();
  if (!monitors?.length) {
    return res.status(400).json({ message: "No monitors found" });
  }

  res.json(monitors);
});


const getCsv = asyncHandler(async (req, res) => {
  const currentYear = new Date().getFullYear();
  try {
    const pipeline = [
     
      { $match: { $expr: { $eq: [{ $year: "$createdAt" }, currentYear] } } },

      
    ];
    const monitors = (await Moniters.aggregate(pipeline)).reverse();
    if (!monitors?.length) {
      return res.status(400).json({ message: "No monitors found for the current year" });
    }

    res.json(monitors);
  } catch (error) {
    console.error("Error fetching monitors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


const searchMonitors = asyncHandler(async (req, res) => {
  const { value } = req.body;
 
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

const chartFilterByMonthTemp = asyncHandler(async (req, res) => {
  const currentYear = new Date().getFullYear();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const pipelines = [];
  for (let i = 0; i < months.length; i++) {
    const month = months[i];

    const pipeline = [
      { $match: { $expr: { $eq: [{ $month: "$createdAt" }, i + 1] } } },
      { $match: { $expr: { $eq: [{ $year: "$createdAt" }, currentYear] } } },

      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          value: { $first: "$temp" },

        },
      },
    ];
    const monitors = (await Moniters.aggregate(pipeline)).reverse();
    const value = monitors.length > 0 ? monitors[0].value : 0;
    const Count = monitors.length > 0 ? monitors[0].count : 0;
    const report = {
      month,
      Count,
      value,
    };

    pipelines.push(report);
  }
  res.json(pipelines);
});
const chartFilterByMonthHumi = asyncHandler(async (req, res) => {
  const currentYear = new Date().getFullYear();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const pipelines = [];
  for (let i = 0; i < months.length; i++) {
    const month = months[i];

    const pipeline = [
      { $match: { $expr: { $eq: [{ $month: "$createdAt" }, i + 1] } } },
      { $match: { $expr: { $eq: [{ $year: "$createdAt" }, currentYear] } } },

      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          value: { $first: "$moisture" },

        },
      },
    ];
    const monitors = (await Moniters.aggregate(pipeline)).reverse();
    const value = monitors.length > 0 ? monitors[0].value : 0;
    const Count = monitors.length > 0 ? monitors[0].count : 0;
    const report = {
      month,
      Count,
      value,
    };

    pipelines.push(report);
  }
  res.json(pipelines);
});
const chartFilterByMonthLight = asyncHandler(async (req, res) => {
  const currentYear = new Date().getFullYear();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const pipelines = [];
  for (let i = 0; i < months.length; i++) {
    const month = months[i];

    const pipeline = [
      { $match: { $expr: { $eq: [{ $month: "$createdAt" }, i + 1] } } },
      { $match: { $expr: { $eq: [{ $year: "$createdAt" }, currentYear] } } },

      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          value: { $first: "$lighting" },

        },
      },
    ];
    const monitors = (await Moniters.aggregate(pipeline)).reverse();
    const value = monitors.length > 0 ? 1 : 0;
    const Count = monitors.length > 0 ? monitors[0].count : 0;
    const report = {
      month,
      Count,
      value,
    };

    pipelines.push(report);
  }
  res.json(pipelines);
});
module.exports = {
  getAllMonitors,
  searchMonitors,
  chartFilterByMonthTemp,
  chartFilterByMonthLight,
  chartFilterByMonthHumi,
  getCsv
};
