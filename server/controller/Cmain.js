const { Model } = require("sequelize");
const { Tutor, Student } = require("../models");

const bcrypt = require("bcrypt");
const saltRound = 10;

function hashPW(pw) {
    return bcrypt.hashSync(pw, saltRound);
}
function comparePW(inputpw, hashedpw) {
    return bcrypt.compareSync(inputpw, hashedpw);
}

// GET /api
exports.getIndex = (req, res) => {
    res.send("response from api server [GET /api]");
};

// GET /api/signUpTutor
exports.signUpTutor = (req, res) => {
    res.send({ isLogin: false });
};
// GET /api/signUpStudent
exports.signUpStudent = (req, res) => {
    res.send({ isLogin: false });
};
// GET /api/login
exports.login = (req, res) => {
    res.send({ isLogin: false });
};
// GET /api/checkStudentId
// GET /api/checkTutorId
exports.checkId = async (req, res) => {
    const { id } = req.query;
    if (!id) return res.send("빈칸을 입력해주세요.");

    let isDuplicateTutor, isDuplicateStudent;
    try {
        [isDuplicateTutor, isDuplicateStudent] = await Promise.all([
            Tutor.findOne({ where: { id } }),
            Student.findOne({ where: { id } }),
        ]);
    } catch (error) {
        console.error("checkNickname Error:", error);
        // 오류 처리
        return;
    }

    const available = !isDuplicateTutor && !isDuplicateStudent;
    res.send({ available });
};

// GET /api/checkTutorNickname
// GET /api/checkStudentNickname
exports.checkNickname = async (req, res) => {
    const { nickname } = req.query;
    if (!nickname) return res.send("빈칸을 입력해주세요.");

    let isDuplicateTutor, isDuplicateStudent;
    try {
        [isDuplicateTutor, isDuplicateStudent] = await Promise.all([
            Tutor.findOne({ where: { nickname } }),
            Student.findOne({ where: { nickname } }),
        ]);
    } catch (error) {
        console.error("checkNickname Error:", error);
        // 오류 처리
        return;
    }

    const available = !isDuplicateTutor && !isDuplicateStudent;
    res.send({ available });
};

// GET /api/searchId
exports.searchId = async (req, res) => {
    let searchEmailStudent, searchEmailTutor;
    try {
        const { email } = req.query;
        if (!email) return res.send("빈칸을 입력해주세요.");

        [searchEmailTutor, searchEmailStudent] = await Promise.all([
            Tutor.findOne({ where: { email } }),
            Student.findOne({ where: { email } }),
        ]);

        if (!searchEmailTutor && !searchEmailStudent) {
            res.send("존재하지 않는 이메일입니다. 다시 입력해주세요.");
        } else if (searchEmailStudent) {
            const studentId = searchEmailStudent.id;
            res.send(`회원님의 아이디는 ${studentId}입니다.`);
        } else if (searchEmailTutor) {
            const tutorId = searchEmailTutor.id;
            res.send(`회원님의 아이디는 ${tutorId}입니다.`);
        } else return;
    } catch (err) {
        console.log("seachId controller ::", err);
        res.status(500).send("server error!!!");
    }
};

// GET /api/searchPassword
exports.searchPassword = async (req, res) => {
    let searchIdStudent, searchIdTutor;
    try {
        const { id, email } = req.query;
        if (!email || !id) return res.send("빈칸을 입력해주세요.");

        [searchIdTutor, searchIdStudent] = await Promise.all([
            Tutor.findOne({ where: { id, email } }),
            Student.findOne({ where: { id, email } }),
        ]);

        if (!searchIdTutor && !searchIdStudent) {
            res.send("유효하지 않은 값입니다. 다시 입력해주세요.");
        } else if (searchIdStudent) {
            res.send(`<script>
            alert('새로운 비밀번호를 입력해주세요').
            res.redirect('/inputPassword')
            </script>`);
        } else if (searchIdTutor) {
            res.send(`<script>
            alert('새로운 비밀번호를 입력해주세요').
            res.redirect('/inputPassword')
            </script>`);
        } else return;
    } catch (err) {
        console.log("seachPassword controller ::", err);
        res.status(500).send("server error!!!");
    }
};

// POST /api/tutor
exports.createTutor = async (req, res) => {
    const { id, nickname, password, email, auth } = req.body;
    if (!id || !nickname || !password || !email || !auth) return res.send("빈칸을 입력해주세요.");
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
        console.log("회원가입 실패 err:", err);
        res.status(500).send("회원가입 실패");
    }
};

// POST /api/student
exports.createStudent = async (req, res) => {
    const { id, nickname, password, email } = req.body;

    if (!id || !nickname || !password || !email) return res.send("빈칸을 입력해주세요.");
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

// POST /api/loginTutor
exports.loginTutor = async (req, res) => {
    const { id, password } = req.body;
    if (!id || !password) return res.send("빈칸을 입력해주세요.");

    try {
        const resultTutor = await Tutor.findOne({
            where: {
                id,
            },
        });
        // console.log(resultId);
        if (resultTutor) {
            // user가 있을 때
            // 비밀번호 비교
            const loginResult = comparePW(password, resultTutor.password);
            if (loginResult) {
                req.session.tutor = resultTutor.id;
                const tutorId = req.session.tutor;
                console.log(req.session.tutor);
                console.log("dd", req.session.tutor);
                console.log(">>>", req.session);
                console.log("***", req.sessionID);
                res.send({ isLogin: true, tutorId: tutorId });
            } else {
                // 아이디는 있지만 비밀번호 불일치
                res.send("비밀번호가 일치하지 않습니다. 다시 시도해주세요.");
            }
        } else {
            // user 못찾았을 때,
            res.send("존재하지 않는 아이디입니다. 다시 시도해주세요.");
        }
    } catch (err) {
        console.log(err);
    }
};
// POST /api/loginStudent
exports.loginStudent = async (req, res) => {
    const { id, password } = req.body;
    if (!id || !password) return res.send("빈칸을 입력해주세요.");

    try {
        const resultStudent = await Student.findOne({
            where: {
                id,
            },
        });
        // console.log(resultId);
        if (!resultStudent) return res.send("존재하지 않는 아이디입니다. 다시 시도해주세요.");

        // user가 있을 때
        const loginResult = comparePW(password, resultStudent.password);
        if (!loginResult) {
            //비밀번호 틀렸을 때
            return res.send("비밀번호가 일치하지 않습니다. 다시 시도해주세요.");
        } else {
            req.session.student = resultStudent.id;
            const studentId = req.session.student;
            return res.send({ isLogin: true, studentId: studentId });
        }
    } catch (err) {
        console.log(err);
    }
};
exports.logout = (req, res) => {
    try {
        if (req.session && (req.session.tutor || req.session.student)) {
            req.session.destroy(() => {
                res.send({ msg: "로그아웃 되었습니다." });
            });
        } else {
            res.send({ msf: "이미 세션이 만료되었습니다." });
        }
    } catch (err) {
        console.log("logout error >> ", err);
        res.status(500).send("server error!");
    }
};

// DELETE /api/tutor
exports.deleteTutor = async (req, res) => {
    const { id, password } = req.body;

    console.log("tutor_id ::", id, "tutor_password ::", password);
    try {
        if (!req.session.tutor) return res.send("탈퇴 권한이 없습니다. 로그인 후 이용해주세요.");
        console.log(req.session.tutor);
        if (id !== req.session.tutor) return res.send("아이디를 정확하게 입력해주세요.");
        if (!password) return res.send("비밀번호를 입력해주세요.");

        const isTutor = await Tutor.findOne({
            where: { id },
        });
        if (!comparePW(password, isTutor.password))
            return res.send("비밀번호가 일치하지 않습니다.");
        if (isTutor && comparePW(password, isTutor.password)) {
            await Tutor.destroy({ where: { id } });
            await req.session.destroy((err) => {
                if (err) {
                    console.error("세션 삭제 실패:", err);
                    return res.status(500).send("서버에러");
                }
                return res.send({ success: true, msg: "회원 탈퇴" });
            });
        }
    } catch (err) {
        console.log("deleteTutor controller err::", err);
        res.status(500).send("server error!");
    }
};

// PATCH /api/tutorProfile
exports.editTutorProfile = async (req, res) => {
    try {
        const { id, changeDefaultImg, nickname, password, level, price, desVideo, description } =
            req.body;
        if (!nickname || !price) return res.send("빈칸을 입력해주세요.");
        // desVideo 유효성 검사 해야하나?
        let defaultImg = "./uploads/default.jpg";
        const realPrice = Number(price);
        await Tutor.update(
            {
                profile_img: defaultImg,
                nickname,
                password,
                level,
                price: realPrice,
                des_video: desVideo,
                description,
            },
            {
                where: {
                    id,
                },
            }
        );

        return res.send({ result: true });
    } catch (error) {
        console.log(error);
        res.send({ error: error.message });
    }
};

//PATCH / api / editTutorPassword;
exports.editTutorPassword = async (req, res) => {
    const { id, password, newPassword1, newPassword2 } = req.body;
    try {
        const tutor = await Tutor.findOne({
            where: {
                id,
            },
        });
        if (tutor) {
            const checkPassword = comparePW(password, tutor.password);
            if (!checkPassword) {
                return res.send("유효한 비밀번호를 입력해주세요.");
            } else if (newPassword1 !== newPassword2) {
                res.send("비밀번호가 일치하지 않습니다.");
            } else {
                await Tutor.update(
                    {
                        password: hashPW(newPassword1),
                    },
                    {
                        where: { id },
                    }
                );
                res.send({ result: true });
            }
        } else throw new Error("Invaild ID");
    } catch (error) {
        console.log({});
        res.send({ error: error.message });
    }
};

// PATCH /api/studentProfile
exports.editStudentProfile = async (req, res) => {
    try {
        const { id, changeDefaultImg, nickname, password } = req.body;
        if (!nickname) return res.send("빈칸을 입력해주세요.");

        let defaultImg = "./uploads/default.jpg";

        await Student.update(
            {
                profile_img: defaultImg,
                nickname,
                password,
            },
            {
                where: {
                    id,
                },
            }
        );

        return res.send({ result: true });
    } catch (error) {
        console.log(error);
        res.send({ error: error.message });
    }
};
//PATCH / api / editStudentPassword;
exports.editStudentPassword = async (req, res) => {
    const { id, password, newPassword1, newPassword2 } = req.body;
    try {
        const student = await Student.findOne({
            where: {
                id,
            },
        });
        if (student) {
            const checkPassword = comparePW(password, student.password);
            if (!checkPassword) {
                return res.send("유효한 비밀번호를 입력해주세요.");
            } else if (newPassword1 !== newPassword2) {
                res.send("비밀번호가 일치하지 않습니다.");
            } else {
                await Student.update(
                    {
                        password: hashPW(newPassword1),
                    },
                    {
                        where: { id },
                    }
                );
                res.send({ result: true });
            }
        } else throw new Error("Invaild ID");
    } catch (error) {
        console.log({ error: error.message });
        res.send({ error: error.message });
    }
};

// DELETE /api/student
exports.deleteStudent = async (req, res) => {
    const { id, password } = req.body;

    console.log("student_id ::", id, "student_password ::", password);
    try {
        if (!req.session.student) return res.send("탈퇴 권한이 없습니다. 로그인 후 이용해주세요.");
        console.log(req.session.student);
        if (id !== req.session.student) return res.send("아이디를 정확하게 입력해주세요.");
        if (!password) return res.send("비밀번호를 입력해주세요.");

        const isStudent = await Student.findOne({
            where: { id },
        });
        if (!comparePW(password, isStudent.password))
            return res.send("비밀번호가 일치하지 않습니다.");
        if (isStudent && comparePW(password, isStudent.password)) {
            await Student.destroy({ where: { id } });
            await req.session.destroy((err) => {
                if (err) {
                    console.error("세션 삭제 실패:", err);
                    return res.status(500).send("서버에러");
                }
                return res.send({ success: true, msg: "회원 탈퇴" });
            });
        }
    } catch (err) {
        console.log("deleteTutor controller err::", err);
        res.status(500).send("server error!");
    }
};
