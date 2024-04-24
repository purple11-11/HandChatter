const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");
const passport = require("passport");

// GET /api
router.get("/", controller.getIndex);
router.get("/signUp", controller.signUp);

// POST /api
router.post("/tutor", controller.createTutor);
router.post("/student", controller.createStudent);

// GET /api/auth/kakao
router.get("/auth/kakao", passport.authenticate("kakao"));

// GET /api/auth/kakao/callback
router.get(
    "/auth/kakao/callback",
    passport.authenticate("kakao", {
        failureRedirect: "/",
    }),
    (req, res) => {
        res.redirect("/");
    }
);

module.exports = router;
