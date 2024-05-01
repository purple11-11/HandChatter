const express = require("express");
const router = express.Router();
const controller = require("../controller/Cadmin");

router.patch("/", controller.approveTutor);

module.exports = router;
