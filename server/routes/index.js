const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");

// GET /api
router.get("/", controller.getIndex);
router.get("/signUp", controller.signUp);
router.get("/checkTutorId", controller.checkId);
router.get("/checkStudentId", controller.checkId);
router.get("/checkTutorNickname", controller.checkNickname);
router.get("/checkStudentNickname", controller.checkNickname);

// POST /api
router.post("/tutor", controller.createTutor);
router.post("/student", controller.createStudent);

module.exports = router;
