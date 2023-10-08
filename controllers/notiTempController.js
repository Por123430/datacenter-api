const asyncHandler = require("express-async-handler");
const Noti_Temp = require("../models/Noti_Temp");

const postNoti_temp = asyncHandler(async (req, res) => {
  const date = new Date();
  const time = new Intl.DateTimeFormat("en-Us", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
  const { temperature } = req.body;
  if (!temperature) {
    return res.status(400).json({ message: "All fields are required" });
  }
  savetime = time;
  const Noti_TempObject = { temperature, savetime };
  const noti_temp = await Noti_Temp.create(Noti_TempObject);
  if (noti_temp) {
    res.status(201).json({ message: `New temp ${temperature} created` });
  } else {
    res.status(400).json({ message: "Invalid temp data received" });
  }
});

const getAllNoti_temp = asyncHandler(async (req, res) => {
  const noti_temp = await (await Noti_Temp.find().select().lean()).reverse();
  if (!noti_temp?.length) {
    return res.status(400).json({ message: "No noti_temp found" });
  }
  //console.log(monitors)
  res.json(noti_temp);
});

const filterNoti_tempByDay = asyncHandler(async (req, res) => {
  try {
    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth() + 1;

    const pipelines = [
      {
        $match: { $expr: { $eq: [{ $dayOfMonth: "$createdAt" }, currentDay] } },
      },
      {
        $match: { $expr: { $eq: [{ $month: "$createdAt" }, currentMonth] } },
      },
      // Add more stages to your pipeline if needed
    ];
    const noti_temp = await Noti_Temp.aggregate(pipelines).sort({
      createdAt: -1,
    });
    const count = await (await Noti_Temp.aggregate(pipelines)).length;
    // if (!noti_temp?.length) {
    //   return res.status(404).json({ message: 'No filterNoti_temp found' });
    // }

    res.json({ noti_temp, count });
  } catch (error) {
    console.error("Error fetching filterNoti_temp:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const searchNotiTemp = asyncHandler(async (req, res) => {
  const { value } = req.body;
  // if(value==="detect"){
  //   value = 1;
  // }
  // console.log(value);
  const piplines = [
    {
      $match: {
        $or: [
          { temperature: { $regex: ".*" + value + ".*", $options: "i" } },
          { createdAt: { $regex: ".*" + value + ".*", $options: "i" } },
          { savetime: { $regex: ".*" + value + ".*", $options: "i" } },
        ],
      },
    },
  ];
  const monitors = await (await Noti_Temp.aggregate(piplines)).reverse();
  res.json(monitors);
});
const chartFilterByWeek = asyncHandler(async (req, res) => {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - now.getDay());

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 7);
  const startOfWeek = new Date(startDate);
  const endOfWeek = new Date(endDate);
  const pipelines = [];
  for (let i = 0; i < 7; i++) {
    const pipeline = [
      {
        $match: {
          createdAt: {
            $gte: startOfWeek,
            $lt: endOfWeek, // Use $lt for exclusive end date
          },
          $expr: { $eq: [{ $dayOfWeek: "$createdAt" }, i + 1] }, // Filter by the day of the week
        },
      },
      { 
        $group: { 
          _id: null, 
          count: { $sum: 1 },
          time: { $addToSet: "$createdAt" }, // Collect unique savetime values
        } 
      },
    ];
    const monitors = await (await Noti_Temp.aggregate(pipeline)).reverse();
    const Count = monitors.length > 0 ? monitors[0].count : 0;
    const dates = monitors.length > 0 ? monitors[0].time : []; // Use all unique savetime values
    const report = {
      day: i + 1, // Day of the week (1 for Sunday, 2 for Monday, etc.)
      dates,
      Count,
    };

    pipelines.push(report);

    // Move to the next week
    startDate.setDate(startDate.getDate() + 7);
    endDate.setDate(endDate.getDate() + 7);
  }
  res.json(pipelines);
});




const chartFilterByDay = asyncHandler(async (req, res) => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the current month
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the current month

  const daysInMonth = endDate.getDate(); // Number of days in the current month
  const pipelines = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const pipeline = [
      {
        $match: {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), day, 0, 0, 0, 0), // Start of the day
            $lte: new Date(now.getFullYear(), now.getMonth(), day, 23, 59, 59, 999), // End of the day
          },
        },
      },
      { $group: { _id: null, count: { $sum: 1 } ,time: { $push: "$savetime" },  } },
    ];

    const monitors = await (await Noti_Temp.aggregate(pipeline)).reverse();
    const Count = monitors.length > 0 ? monitors[0].count : 0;
    const dates = monitors.length > 0 ? monitors[0].time[0] : [];
    const report = {
      day,
      dates,
      Count,
    };

    pipelines.push(report);
  }

  res.json(pipelines);
});

const chartFilterByMonth = asyncHandler(async (req, res) => {
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

      { $group: { _id: null, count: { $sum: 1 } } },
    ];
    const monitors = await (await Noti_Temp.aggregate(pipeline)).reverse();
    const Count = monitors.length > 0 ? monitors[0].count : 0;
    const report = {
      month,
      Count,
    };

    pipelines.push(report);
  }
  res.json(pipelines);
});
module.exports = {
  postNoti_temp,
  getAllNoti_temp,
  searchNotiTemp,
  filterNoti_tempByDay,
  chartFilterByWeek,
  chartFilterByDay,
  chartFilterByMonth,
};
