const express = require("express");
const router = express.router();
const controller = require("../controller/Cmain");

// GET /api
router.get("/", controller.getIndex);

module.exports = router;
