const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");

// GET /api
router.get("/", controller.getIndex);
router.get("/signUp", controller.signUp);

// POST /api
router.post("/tutor", controller.createTutor);
router.post("/student", controller.createStudent);

module.exports = router;
