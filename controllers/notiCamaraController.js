const asyncHandler = require('express-async-handler')
const Noti_Camera = require('../models/Noti_Camera')
const postNoti_camera = asyncHandler (async(req, res) => {
    const date = new Date()
    const time = new Intl.DateTimeFormat('en-Us', { dateStyle: 'short',timeStyle: 'short'}).format(date)
    const{camera} = req.body
    if(!camera){
        return res.status(400).json({message: 'All fields are required'})
    }
    savetime = time
    const Noti_CameraObject = { camera, savetime}
    const noti_camera = await Noti_Camera.create(Noti_CameraObject)
    if (noti_camera) {
        res.status(201).json({ message: `New camera ${camera} created`})
    } else {
        res.status(400).json({ message: 'Invalid camera data received'})
    }
})

const getAllNoti_camera = asyncHandler (async (req, res) => {
    const noti_camera = await (await Noti_Camera.find().select().lean()).reverse()
    if (!noti_camera?.length) {
        return res.status(400).json({ message: 'No noti_camera found'})
    }
    //console.log(monitors)
    res.json(noti_camera)
})

const chartFilterByWeek = asyncHandler(async (req, res) => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0); 
    startDate.setDate(startDate.getDate() - now.getDay());
  
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7);
    const weeks = [
      "Sunday",
      "Monday",
      "Tuesday ",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const pipelines = [];
    for (let i = 0; i < weeks.length; i++) {
      const day = weeks[i];
  
      const pipeline = [
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
            $expr: { $eq: [{ $dayOfWeek: "$createdAt" }, i + 1] } // Filter by the day of the week
          },
        },
        { $group: { _id: null, count: { $sum: 1 } } }
      ];
      const monitors = await (await Noti_Camera.aggregate(pipeline)).reverse();
      const Count = monitors.length > 0 ? monitors[0].count : 0;
      const report = {
        day,
        Count,
      };
  
      pipelines.push(report);
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
  
      const monitors = await (await Noti_Camera.aggregate(pipeline)).reverse();
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
      const monitors = await (await Noti_Camera.aggregate(pipeline)).reverse();
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
    postNoti_camera,
    getAllNoti_camera,
    chartFilterByWeek,
    chartFilterByDay,
    chartFilterByMonth
}