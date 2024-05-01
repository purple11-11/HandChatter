const express = require("express");
const router = express.Router();
const controller = require("../controller/Cadmin");

router.get("/", controller.getUsers);
router.post("/login", controller.login);
router.patch("/access", controller.approveTutor);

module.exports = router;
