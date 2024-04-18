const express = require("express");
const router = express.Router();
const notiHumiController = require("../controllers/notiHumiController");

router
  .route("/")
  .get(notiHumiController.getAllnoti_Humi)
  .post(notiHumiController.postNoti_humi);

// router.route('/postNoti_humi')
//     .post(notificationController.postNoti_humi)

router.route("/filter").get(notiHumiController.filterNoti_humiByDay);

router.route("/chartByWeek").get(notiHumiController.chartFilterByWeek);

router.route('/chartByDay')
    .get(notiHumiController.chartFilterByDay)


router.route('/chartByMonth')
    .get(notiHumiController.chartFilterByMonth)




module.exports = router;
