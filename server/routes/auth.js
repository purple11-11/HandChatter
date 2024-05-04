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
        res.redirect(
            process.env.NODE_ENV === "production"
                ? process.env.CLIENT_URL_PROD
                : process.env.CLIENT_URL_DEV
        );
    }
);

module.exports = router;
