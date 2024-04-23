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

// GET /api/signUp
exports.signUp = (req, res) => {
    res.send("회원가입 페이지");
    // res.render("join", {isLogin: false})
};

// GET /api/checkTutorId
exports.checkTutorId = async (req, res) => {
    const { id } = req.query;
    if (!id) return;

    const isDuplicate = await Tutor.findOne({
        where: {
            id,
        },
    });
    if (isDuplicate) {
        res.send({ available: false });
    } else {
        res.send({ available: true });
    }
};

// GET /api/checkStudentId
exports.checkStudentId = async (req, res) => {
    const { id } = req.query;

    if (!id) return;

    const isDuplicate = await Student.findOne({
        where: {
            id,
        },
    });

    if (isDuplicate) {
        res.send({ available: false });
    } else {
        res.send({ available: true });
    }
};

// GET /api/checkTutorNickname
exports.checkTutorNickname = async (req, res) => {
    const { nickname } = req.query;

    if (!nickname) return;

    const isDuplicate = await Tutor.findOne({
        where: {
            nickname,
        },
    });
    if (isDuplicate) {
        res.send({ available: false });
    } else {
        res.send({ available: true });
    }
};

// GET /api/checkStudentNickname
exports.checkStudentNickname = async (req, res) => {
    const { nickname } = req.query;
    if (!nickname) return;

    const isDuplicate = await Student.findOne({
        where: {
            nickname,
        },
    });

    if (isDuplicate) {
        res.send({ available: false });
    } else {
        res.send({ available: true });
    }
};

// POST /api/tutor
exports.createTutor = async (req, res) => {
    const { id, nickname, password, email, auth } = req.body;
    if (!id | !nickname | !password | !email | !auth) return;
    try {
        await Tutor.create({
            id,
            nickname,
            password: hashPW(password),
            email,
            auth,
        });
        // console.log(result);
        res.send("회원가입 성공");
    } catch (err) {
        console.log("회원가입 실패", err);
        res.status(500).send("회원가입 실패");
    }
};

// POST /api/student
exports.createStudent = async (req, res) => {
    const { id, nickname, password, email } = req.body;

    if (!id | !nickname | !password | !email) return;
    try {
        await Student.create({
            id,
            nickname,
            password: hashPW(password),
            email,
        });

        res.end("회원가입 성공");
    } catch (err) {
        console.log("회원가입 실패", err);
        res.status(500).send("회원가입 실패");
    }
};
