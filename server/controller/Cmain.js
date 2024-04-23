const { Tutor, Student } = require("../models");

const bcrypt = require("bcrypt");
const saltRound = 10;

function hashPW(pw) {
    return bcrypt.hashSync(pw, saltRound);
}
// function comparePW(inputpw, hashedpw) {
//     return bcrypt.compareSync(inputpw, hashedpw);
// }

// GET /api
exports.getIndex = (req, res) => {
    res.send("response from api server [GET /api]");
};

// GET /api
exports.signUp = (req, res) => {
    res.send("회원가입 페이지");
    // res.render("join", {isLogin: false})
};

// POST /api
exports.createTutor = async (req, res) => {
    console.log(typeof hashPW(req.body.password));
    try {
        const result = await Tutor.create({
            id: req.body.id,
            nickname: req.body.nickname,
            password: hashPW(req.body.password),
            email: req.body.email,
            description: req.body.description,
            auth: req.body.auth,
            authority: req.body.authority,
        });
        // console.log(result);
        res.end("회원가입 성공");
    } catch (err) {
        console.log("회원가입 실패", err);
        res.status(500).send("회원가입 실패");
    }
};

exports.createStudent = async (req, res) => {
    try {
        const result = await Student.create({
            id: req.body.id,
            nickname: req.body.nickname,
            password: hashPW(req.body.password),
            email: req.body.email,
        });

        console.log(result);
        res.end("회원가입 성공");
    } catch (err) {
        console.log("회원가입 실패", err);
        res.status(500).send("회원가입 실패");
    }
};
