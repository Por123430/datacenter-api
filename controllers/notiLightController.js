const asyncHandler = require('express-async-handler')
const Noti_Light = require('../models/Noti_Light')
const postNoti_light = asyncHandler (async(req, res) => {
    const date = new Date()
    const time = new Intl.DateTimeFormat('en-Us', { dateStyle: 'short',timeStyle: 'short'}).format(date)
    const{flame} = req.body
    if(!flame){
        return res.status(400).json({message: 'All fields are required'})
    }
    savetime = time
    const Noti_LightObject = { flame, savetime}
    const noti_light = await Noti_Light.create(Noti_LightObject)
    if (noti_light) {
        res.status(201).json({ message: `New flame ${flame} created`})
    } else {
        res.status(400).json({ message: 'Invalid flame data received'})
    }
})

const filterNoti_lightByDay = asyncHandler(async (req, res) => {
    try {
        const currentDay = new Date().getDate();
        const currentMonth = new Date().getMonth() + 1;
        
      const pipelines = [
        {
             $match: { $expr: { $eq: [{ $dayOfMonth: "$createdAt" }, currentDay] } } 
        },
        {
            $match: { $expr: { $eq: [{ $month: "$createdAt" }, currentMonth] } } 
        }
        
      ];
      const noti_light = await Noti_Light.aggregate(pipelines).sort({ createdAt: -1 });
      const count = await (await Noti_Light.aggregate(pipelines)).length
    
  
      res.json({noti_light,count});
    } catch (error) {
      console.error('Error fetching filterNoti_light:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
const getAllNoti_light = asyncHandler (async (req, res) => {
    const noti_light = await (await Noti_Light.find().select().lean()).reverse()
    if (!noti_light?.length) {
        return res.status(400).json({ message: 'No noti_light found'})
    }
   
    res.json(noti_light)
})

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
    const monitors = await (await Noti_Light.aggregate(pipeline)).reverse();
    
    const Count = monitors.length > 0 ? monitors[0].count : 0;
    const dates = monitors.length > 0 ? monitors[0].time : []; // Use all unique savetime values
    const report = {
      day: startOfWeek.getDate() + i, // Day of the week (1 for Sunday, 2 for Monday, etc.)
      dates,
      Count,
      value: Count
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
  const promises = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      day,
      0,
      0,
      0,
      0
    );
    const dayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      day,
      23,
      59,
      59,
      999
    );

    const pipeline = [
      {
        $match: {
          createdAt: {
            $gte: dayStart,
            $lte: dayEnd,
          },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          time: { $push: "$savetime" },
          
        },
      },
    ];

    promises.push(Noti_Light.aggregate(pipeline));
  }

  try {
    const results = await Promise.all(promises);
    const reports = results.map((monitors, i) => {
      const Count = monitors.length > 0 ? monitors[0].count : 0;
      const dates = monitors.length > 0 ? monitors[0].time[0] : [];
      return {
        day: i + 1,
        dates,
        Count,
        value:Count,
      };
    });

    res.json(reports);
  } catch (error) {
    // Handle any errors that occur during the aggregation.
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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
      const monitors = await (await Noti_Light.aggregate(pipeline)).reverse();
      const Count = monitors.length > 0 ? monitors[0].count : 0;
      const report = {
        month,
        Count,
        value: Count
      };
  
      pipelines.push(report);
    }
    res.json(pipelines);
  });

module.exports = {
    postNoti_light,
    getAllNoti_light,
    filterNoti_lightByDay,
    chartFilterByWeek,
    chartFilterByDay,
    chartFilterByMonth
}