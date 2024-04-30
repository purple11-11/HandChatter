const { Tutor, Student, Favorites, Review } = require("../models");
const { Op } = require("sequelize");
const { transporter } = require("../modules/nodemailer/nodemailer");

const bcrypt = require("bcrypt");
const saltRound = 10;

function hashPW(pw) {
    return bcrypt.hashSync(pw, saltRound);
}
function comparePW(inputpw, hashedpw) {
    return bcrypt.compareSync(inputpw, hashedpw);
}

// GET /api/userInfo
exports.getInfo = async (req, res) => {
    try {
        const { userId, role } = req.session;
        console.log(userId, role);

        if (!userId) return res.status(401).send("로그인을 해주세요.");

        if (role === "student") {
            const studentInfo = await Student.findAll({
                where: { id: userId },
                attributes: ["id", "nickname", "email", "provider", "profile_img", "authority"],
            });
            return res.status(200).send({ studentInfo });
        } else if (role === "tutor") {
            const tutorInfo = await Tutor.findAll({
                where: { id: userId },
                attributes: [
                    "id",
                    "nickname",
                    "email",
                    "description",
                    "authority",
                    "profile_img",
                    "des_video",
                    "price",
                ],
            });
            return res.status(200).send({ tutorInfo });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("SERVER ERROR!!!");
    }
};

// GET /api
exports.getTutors = async (req, res) => {
    try {
        const { q } = req.query;
        if (q) {
            const searchTutorsInfo = await Tutor.findAll({
                where: {
                    description: {
                        [Op.like]: `%${q}%`,
                    },
                },
                attributes: ["nickname", "description", "profile_img", "price"],
            });
            if (searchTutorsInfo && searchTutorsInfo.length > 0) {
                res.send({ searchTutorsInfo: searchTutorsInfo });
            } else {
                res.status(404).send("검색 결과가 없습니다.");
            }
        } else {
            const tutorsInfo = await Tutor.findAll();
            if (tutorsInfo && tutorsInfo.length > 0) {
                res.send({ tutorsInfo: tutorsInfo });
            } else {
                res.status(404).send("검색 결과가 없습니다.");
            }
        }
    } catch (err) {
        console.log("강사정보 조회 실패 err:", err);
        res.status(500).send("강사정보 조회 실패");
    }
};

// GET /api/tutors/:tutorIdx
exports.getTutorDetail = async (req, res) => {
    try {
        const { tutorIdx } = req.params;
        const tutorInfo = await Tutor.findOne({
            where: {
                tutor_idx: tutorIdx,
            },

            attributes: [
                "nickname",
                "email",
                "description",
                "authority",
                "profile_img",
                "des_video",
            ],
        });
        // const review = await Review.findAll({
        //     where: {
        //         tutor_idx: tutorIdx,
        //     },
        //     attributes: ["content", "rating", "created_at"],
        // });
        if (tutorInfo) {
            res.send({ tutorInfo: tutorInfo });
        } else {
            res.status(404).send("강사 상세정보가 존재하지 않음");
        }
    } catch (err) {
        console.log("강사 상세정보 조회 실패 err:", err);
        res.status(500).send("강사 상세정보 조회 실패");
    }
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
    if (!id) return res.status(400).send("빈칸을 입력해주세요.");

    let isDuplicateTutor, isDuplicateStudent;
    try {
        [isDuplicateTutor, isDuplicateStudent] = await Promise.all([
            Tutor.findOne({ where: { id } }),
            Student.findOne({ where: { id } }),
        ]);
        const available = !isDuplicateTutor && !isDuplicateStudent;
        res.status(200).send({ available });
    } catch (error) {
        res.status(500).send("SERVER ERROR");
    }
};

// GET /api/checkTutorNickname
// GET /api/checkStudentNickname
exports.checkNickname = async (req, res) => {
    const { nickname } = req.query;
    if (!nickname) return res.status(400).send("빈칸을 입력해주세요.");

    let isDuplicateTutor, isDuplicateStudent;
    try {
        [isDuplicateTutor, isDuplicateStudent] = await Promise.all([
            Tutor.findOne({ where: { nickname } }),
            Student.findOne({ where: { nickname } }),
        ]);
        const available = !isDuplicateTutor && !isDuplicateStudent;
        res.status(200).send({ available });
    } catch (error) {
        res.status(500).send("SERVER ERROR");
    }
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
            res.status(200).send(`회원님의 아이디는 ${studentId}입니다.`);
        } else if (searchEmailTutor) {
            const tutorId = searchEmailTutor.id;
            res.status(200).send(`회원님의 아이디는 ${tutorId}입니다.`);
        } else return;
    } catch (err) {
        res.status(500).send("server error!!!");
    }
};

// GET /api/searchPassword
exports.searchPassword = async (req, res) => {
    let searchIdStudent, searchIdTutor;
    try {
        const { id, email } = req.query;
        if (!email || !id) return res.status(400).send("빈칸을 입력해주세요.");

        [searchIdTutor, searchIdStudent] = await Promise.all([
            Tutor.findOne({ where: { id, email } }),
            Student.findOne({ where: { id, email } }),
        ]);

        if (!searchIdTutor && !searchIdStudent) {
            res.status(400).send("유효하지 않은 값입니다. 다시 입력해주세요.");
        } else if (searchIdStudent) {
            res.status(200).send(`<script>
            alert('새로운 비밀번호를 입력해주세요').
            res.redirect('/inputPassword')
            </script>`);
        } else if (searchIdTutor) {
            res.status(200).send(`<script>
            alert('새로운 비밀번호를 입력해주세요').
            res.redirect('/inputPassword')
            </script>`);
        } else return;
    } catch (err) {
        res.status(500).send("server error!!!");
    }
};

// GET /api/email
exports.sendEmail = async (req, res) => {
    const { email } = req.body;
    const randomNum = (Math.floor(Math.random() * 1000000) + 100000).toString().substring(0, 6);

    console.log("randomNum ::", randomNum);

    const checkEmail = await Promise.all([
        Tutor.findOne({ where: { email } }),
        Student.findOne({ where: { email } }),
    ]);

    if (checkEmail[0] || checkEmail[1]) return res.send("이미 가입된 이메일입니다.");

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "[Hand Chatter 👐🏻] 이메일 인증",
        html: `<h2>인증번호를 입력해주세요</h2>  <h3>${randomNum} 입니다.</h3>`,
    };

    await transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("이메일 전송 실패", err);
            return res.status(500).send("이메일 전송 실패");
        } else {
            console.log("이메일 전송 성공", info.response);
            return res.status(200).send({ randomNum });
        }
    });
};

// POST /api/tutor
exports.createTutor = async (req, res) => {
    const { id, nickname, password, email } = req.body;

    if (!id || !nickname || !password || !email)
        return res.status(400).send("빈칸을 입력해주세요.");
    try {
        await Tutor.create({
            id,
            nickname,
            password: hashPW(password),
            email,
            auth: req.file.path,
        });

        res.status(200).send("회원가입 성공");
    } catch (err) {
        res.status(500).send("회원가입 실패");
    }
};

// POST /api/student
exports.createStudent = async (req, res) => {
    const { id, nickname, password, email } = req.body;

    if (!id || !nickname || !password || !email)
        return res.status(400).send("빈칸을 입력해주세요.");
    try {
        await Student.create({
            id,
            nickname,
            password: hashPW(password),
            email,
        });

        res.status(200).send("회원가입 성공");
    } catch (err) {
        res.status(500).send("회원가입 실패");
    }
};

// POST /api/loginTutor
exports.loginTutor = async (req, res) => {
    const { id, password } = req.body;
    if (!id || !password) return res.status(400).send("빈칸을 입력해주세요.");

    try {
        const resultTutor = await Tutor.findOne({
            where: {
                id,
            },
        });
        if (resultTutor) {
            // user가 있을 때
            // 비밀번호 비교
            const loginResult = comparePW(password, resultTutor.password);
            if (loginResult) {
                const { id, tutor_idx } = resultTutor;

                req.session.userId = id;
                req.session.tutor_idx = tutor_idx;
                req.session.role = "tutor";

                const tutorId = req.session.userId;

                res.status(200).send({
                    isLogin: true,
                    tutorId: tutorId,
                });
            } else {
                // 아이디는 있지만 비밀번호 불일치
                res.status(400).send("비밀번호가 일치하지 않습니다. 다시 시도해주세요.");
            }
        } else {
            // user 못찾았을 때,
            res.status(400).send("존재하지 않는 아이디입니다. 다시 시도해주세요.");
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

// POST /api/loginStudent
exports.loginStudent = async (req, res) => {
    const { id, password } = req.body;
    if (!id || !password) return res.status(400).send("빈칸을 입력해주세요.");

    try {
        const resultStudent = await Student.findOne({
            where: {
                id,
            },
        });
        // console.log(resultId);
        if (!resultStudent)
            return res.status(400).send("존재하지 않는 아이디입니다. 다시 시도해주세요.");

        // user가 있을 때
        const loginResult = comparePW(password, resultStudent.password);
        if (!loginResult) {
            //비밀번호 틀렸을 때
            return res.status(400).send("비밀번호가 일치하지 않습니다. 다시 시도해주세요.");
        } else {
            req.session.userId = resultStudent.id;
            req.session.stu_idx = resultStudent.stu_idx;
            req.session.role = "student";

            console.log(
                "req.session 저장 ::",
                req.session.userId,
                req.session.stu_idx,
                req.session.role
            );
            const studentId = req.session.userId;
            return res.status(200).send({
                isLogin: true,
                studentId: studentId,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("SERVER ERROR");
    }
};

// POST /api/logout
exports.logout = (req, res) => {
    try {
        if (req.session) {
            req.session.destroy(() => {
                res.status(200).send({ msg: "로그아웃 되었습니다." });
            });
        } else res.status(401).send({ msg: "이미 세션이 만료되었습니다." });
    } catch (err) {
        res.status(500).send("SERVER ERROR");
    }
};

// POST /api/favorites
exports.addFavorites = async (req, res) => {
    const id = req.session.student;
    if (!id) res.status(401).send("로그인을 해주세요.");
    const { stu_idx, tutor_idx } = req.body;

    try {
        const existingFavorite = await Favorites.findOne({
            where: {
                stu_idx,
                tutor_idx,
            },
        });

        if (!existingFavorite) {
            await Favorites.create({ stu_idx, tutor_idx });
            res.status(200).send("찜 목록에 추가되었습니다.");
        } else return res.status(500).send("SERVER ERROR!!!");
    } catch (error) {
        console.error(error);
        res.status(500).send("SERVER ERROR!!!");
    }
};

// POST /api/favoritesTutor
exports.searchFavorites = async (req, res) => {
    try {
        const id = req.session.userId;
        if (!id) res.status(401).send("로그인을 해주세요.");

        const student = await Student.findOne({
            where: {
                id,
            },
        });
        if (!student) {
            throw new Error("SERVER ERROR!!!");
        } else {
            const stu_idx = student.stu_idx;
            const favorites = await Favorites.findAll({
                where: {
                    stu_idx,
                },
                include: [
                    {
                        model: Tutor,
                        attributes: ["nickname", "description", "profile_img", "price"],
                    },
                ],
            });
            if (!favorites) {
                res.status(200).send(
                    "찜한 튜터가 없습니다. 관심 있는 튜터를 찜 목록에 추가해보세요!"
                );
            } else res.status(200).send({ favorites });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("SERVER ERROR!!!");
    }
};

//POST /api/reviews
exports.addReviews = async (req, res) => {
    try {
        const stu_idx = req.session.stu_idx;
        if (!stu_idx) return res.send("로그인을 해주세요.");

        const { content, rating, tutor_idx } = req.body;
        if (!content || !rating) return res.status(400).send("빈칸을 입력해주세요.");
        const review = await Review.create({
            content,
            rating,
            tutor_idx,
            stu_idx,
        });
        if (!review) {
            throw new Error("SERVER ERROR!!!");
        } else res.status(200).send("리뷰를 성공적으로 달았습니다!");
    } catch (error) {
        console.log(error);
        res.status(500).send("SERVER ERROR!!!");
    }
};

// PATCH /api/tutorProfile
exports.editTutorProfile = async (req, res) => {
    try {
        const { id, nickname, password, level, price, desVideo, description } = req.body;
        if (!nickname || !price || !password) res.status(400).send("빈칸을 입력해주세요.");
        // desVideo 유효성 검사 해야하나? 일단 대기
        let defaultImg = "./uploads/default.jpg";
        const realPrice = Number(price);

        const tutor = await Tutor.findOne({
            where: {
                id,
            },
        });
        if (tutor) {
            const checkPassword = comparePW(password, tutor.password);
            if (!checkPassword) {
                return res.status(400).send("유효한 비밀번호를 입력해주세요.");
            } else {
                await Tutor.update(
                    {
                        profile_img: defaultImg,
                        nickname,
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
                return res.status(200).send({ result: true, msg: "프로필을 변경하였습니다." });
            }
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

//PATCH / api / editTutorPassword;
exports.editTutorPassword = async (req, res) => {
    const { password, newPassword } = req.body;
    const id = req.session.userId;
    try {
        if (!password || !newPassword) res.status(400).send("빈칸을 입력해주세요.");
        const tutor = await Tutor.findOne({
            where: {
                id,
            },
        });
        if (tutor) {
            const checkPassword = comparePW(password, tutor.password);
            if (!checkPassword) {
                return res.status(400).send("유효한 비밀번호를 입력해주세요.");
            } else if (newPassword) {
                await Tutor.update(
                    {
                        password: hashPW(newPassword),
                    },
                    {
                        where: { id },
                    }
                );
                res.status(200).send({ result: true, msg: "비밀번호가 변경되었습니다." });
            }
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

// PATCH /api/studentProfile
exports.editStudentProfile = async (req, res) => {
    try {
        const { id, nickname, password } = req.body;
        if (!nickname || !password) res.status(400).send("빈칸을 입력해주세요.");

        let defaultImg = "./uploads/default.jpg";

        const student = await Student.findOne({
            where: {
                id,
            },
        });
        if (student) {
            const checkPassword = comparePW(password, student.password);
            if (!checkPassword) {
                res.status(400).send("유효한 비밀번호를 입력해주세요.");
            } else {
                await Student.update(
                    {
                        profile_img: defaultImg,
                        nickname,
                    },
                    {
                        where: {
                            id,
                        },
                    }
                );
                return res.status(200).send({ result: true, msg: "프로필을 변경하였습니다." });
            }
        }
    } catch (error) {
        res.status(500).send(error);
    }
};
//PATCH / api / editStudentPassword;
exports.editStudentPassword = async (req, res) => {
    const { password, newPassword } = req.body;
    const id = req.session.id;
    try {
        if (!password || !newPassword) res.status(400).send("빈칸을 입력해주세요.");
        const student = await Student.findOne({
            where: {
                id,
            },
        });
        if (student) {
            const checkPassword = comparePW(password, student.password);
            if (!checkPassword) {
                return res.status(400).send("유효한 비밀번호를 입력해주세요.");
            } else if (newPassword) {
                await Student.update(
                    {
                        password: hashPW(newPassword),
                    },
                    {
                        where: { id },
                    }
                );
                res.status(200).send({ result: true, msg: "비밀번호가 변경되었습니다." });
            }
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

// DELETE /api/withdrawal
exports.deleteUser = async (req, res) => {
    const { id, password } = req.body;
    const { userId, role } = req.session;
    let isTutor, isStudent;
    try {
        console.log(userId, role);
        if (!req.session.userId) return res.send("탈퇴 권한이 없습니다. 로그인 후 이용해주세요.");

        if (id !== req.session.userId) return res.send("아이디를 정확하게 입력해주세요.");

        if (!password) return res.send("비밀번호를 입력해주세요.");

        [isTutor, isStudent] = await Promise.all([
            Tutor.findOne({ where: { id } }),
            Student.findOne({ where: { id } }),
        ]);

        if (!isTutor && !isStudent) return res.send("존재하지 않는 아이디입니다.");

        async function deleteUser(model, id) {
            await model.destroy({ where: { id } });
        }

        if (
            (isTutor && comparePW(password, isTutor.password)) ||
            (isStudent && comparePW(password, isStudent.password))
        ) {
            const model = isTutor ? Tutor : Student;
            const userId = isTutor ? isTutor.id : isStudent.id;

            await deleteUser(model, userId);
            req.session.destroy((err) => {
                if (err) {
                    console.error("세션 삭제 실패:", err);
                    return res.status(500).send("서버에러");
                }
                return res.status(200).send({ success: true });
            });
        } else {
            return res.send("비밀번호가 일치하지 않습니다.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("SERVER ERROR!!!");
    }
};

// DELETE /api/favorites
exports.deleteFavorites = async (req, res) => {
    const id = req.session.student;
    if (!id) res.status(401).send("로그인을 해주세요.");
    const { stu_idx, tutor_idx } = req.body;

    try {
        const existingFavorite = await Favorites.findOne({
            where: {
                stu_idx,
                tutor_idx,
            },
        });

        if (existingFavorite) {
            await existingFavorite.destroy();
            res.status(200).send("찜 목록에서 제거되었습니다.");
        } else return res.status(500).send("SERVER ERROR!!!");
    } catch (error) {
        console.error(error);
        res.status(500).send("SERVER ERROR!!!");
    }
};
