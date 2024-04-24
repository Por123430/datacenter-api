const asyncHandler = require('express-async-handler')
const Noti_Temp = require('../models/Noti_Temp')
const Noti_Humi = require('../models/Noti_Humi')



const postNoti_humi = asyncHandler (async(req, res) => {
    const date = new Date()
    const time = new Intl.DateTimeFormat('en-Us', { dateStyle: 'short',timeStyle: 'short'}).format(date)
    const{humidity } = req.body
    if(!humidity){
        return res.status(400).json({message: 'All fields are required'})
    }
    savetime = time
    const Noti_HumiObject = { humidity, savetime}
    const noti_humi = await Noti_Humi.create(Noti_HumiObject)
    if (noti_humi) {
        res.status(201).json({ message: `New humidity ${humidity} created`})
    } else {
        res.status(400).json({ message: 'Invalid humidity data received'})
    }
})

const filterNoti_humiByDay = asyncHandler(async (req, res) => {
    try {
        const currentDay = new Date().getDate();
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const pipelines = [
          {
            $match: { $expr: { $eq: [{ $year: "$createdAt" }, currentYear] } },
          },
      
        {
             $match: { $expr: { $eq: [{ $dayOfMonth: "$createdAt" }, currentDay] } } 
        },
        {
            $match: { $expr: { $eq: [{ $month: "$createdAt" }, currentMonth] } } 
        }
       
      ];
      const noti_humi = await Noti_Humi.aggregate(pipelines).sort({ createdAt: -1 });
      const count = await (await Noti_Humi.aggregate(pipelines)).length
     
  
      res.json({noti_humi,count});
    } catch (error) {
      console.error('Error fetching filterNoti_humi:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

const getAllnoti_Humi = asyncHandler (async (req, res) => {
    const noti_humi = await (await Noti_Humi.find().select().lean()).reverse()
    if (!noti_humi?.length) {
        return res.status(400).json({ message: 'No noti_humi found'})
    }
    
    res.json(noti_humi)
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
          value: {$first:"$humidity"}
        } 
      },
    ];
    const monitors = await (await Noti_Humi.aggregate(pipeline)).reverse();
    const value = monitors.length > 0 ? monitors[0].value : 0;
    const Count = monitors.length > 0 ? monitors[0].count : 0;
    const dates = monitors.length > 0 ? monitors[0].time : []; // Use all unique savetime values
    const report = {
      day: startOfWeek.getDate() + i, // Day of the week (1 for Sunday, 2 for Monday, etc.)
      dates,
      Count,
      value
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
            value: { $first: "$humidity" },
          },
        },
      ];
  
      promises.push(Noti_Humi.aggregate(pipeline));
    }
  
    try {
      const results = await Promise.all(promises);
      const reports = results.map((monitors, i) => {
        const Count = monitors.length > 0 ? monitors[0].count : 0;
        const value = monitors.length > 0 ? monitors[0].value : 0;
        const dates = monitors.length > 0 ? monitors[0].time[0] : [];
        return {
          day: i + 1,
          dates,
          Count,
          value,
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
  
        { $group: { _id: null, count: { $sum: 1 } ,value: {$first:"$humidity"} } },
      ];
      const monitors = await (await Noti_Humi.aggregate(pipeline)).reverse();
      const Count = monitors.length > 0 ? monitors[0].count : 0;
      const value = monitors.length > 0 ? monitors[0].value : 0;
      const report = {
        month,
        Count,
        value
      };
  
      pipelines.push(report);
    }
    res.json(pipelines);
  });


module.exports = {
    getAllnoti_Humi,
    postNoti_humi,
    filterNoti_humiByDay,
    chartFilterByWeek,
    chartFilterByDay,
    chartFilterByMonth
}