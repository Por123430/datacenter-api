const express = require("express");
const router = express.Router();
const notiLightController = require("../controllers/notiLightController");

router
  .route("/")
  .get(notiLightController.getAllNoti_light)
  .post(notiLightController.postNoti_light);

router.route("/filter").get(notiLightController.filterNoti_lightByDay);

router.route("/chartByWeek").get(notiLightController.chartFilterByWeek);

router.route('/chartByDay')
    .get(notiLightController.chartFilterByDay)


router.route('/chartByMonth')
    .get(notiLightController.chartFilterByMonth)


module.exports = router;
