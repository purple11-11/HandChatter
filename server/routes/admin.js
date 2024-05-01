const express = require("express");
const router = express.Router();
const controller = require("../controller/Cadmin");

router.post("/login", controller.login);
router.patch("/access", controller.approveTutor);

module.exports = router;
