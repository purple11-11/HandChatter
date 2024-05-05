const express = require("express");
const router = express.Router();
const passport = require("passport");

// GET /auth/kakao
// 카카오 로그인 창 연결
router.get("/kakao", passport.authenticate("kakao"));

// GET /auth/kakao/callback
// 로그인에 대한 결과
router.get(
    "/kakao/callback",
    passport.authenticate("kakao", {
        // 로그인에대한 결과를 GET /auth/kakao/callback 로 받는다.
        failureRedirect:
            process.env.NODE_ENV === "production"
                ? process.env.CLIENT_URL_PROD
                : process.env.CLIENT_URL_DEV,
    }),
    (req, res) => {
        req.session.userId = req.user.id;
        req.session.stu_idx = req.user.stu_idx;
        req.session.role = "student"; // 사용자 역할에 따라 조정 가능
        res.redirect(
            process.env.NODE_ENV === "production"
                ? process.env.CLIENT_URL_PROD
                : process.env.CLIENT_URL_DEV
        );
    }
);

module.exports = router;
