const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");

// GET /api
router.get("/", controller.getIndex);
router.get("/sign_up", controller.signUp);

// POST /api
router.post("/tutor_sign_up", controller.createTutor);
router.post("/student_sign_up", controller.createStudent);

module.exports = router;
