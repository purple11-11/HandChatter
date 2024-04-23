const model = require("../models");

// GET /api
exports.getIndex = (req, res) => {
    res.send("response from api server [GET /api]");
};
exports.signUp = (req, res) => {
    res.send("회원가입 페이지");
    // res.render("join", {isLogin: false})
};

// POST /api
exports.signUpTutor = (req, res) => {
    model.Tutor.create({
        id: req.body.id,
        nickname: req.body.nickname,
        password: req.body.password,
        email: req.body.email,
        description: req.body.description,
        auth: req.body.auth,
        authority: req.body.authority,
    })
        .then((result) => {
            console.log(result);
            res.end("회원가입 성공");
        })
        .catch((err) => {
            console.log("회원가입 실패", err);
            res.status(500).send("회원가입 실패");
        });
};
exports.signUpStudent = (req, res) => {
    model.Student.create({
        id: req.body.id,
        nickname: req.body.nickname,
        password: req.body.password,
        email: req.body.email,
    })
        .then((result) => {
            console.log(result);
            res.end("회원가입 성공");
        })
        .catch((err) => {
            console.log("회원가입 실패", err);
            res.status(500).send("회원가입 실패");
        });
};
